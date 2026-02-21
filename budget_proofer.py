#!/usr/bin/env python3
"""
Budget Proofer — Swiss K.Y. Association Grant Audit Tool
=========================================================
Reads a folder containing:
  - One master Excel summary file (name contains "master" or "summary")
  - One Excel file per project
  - One scanned-image PDF per project (all invoices bundled together)

Produces a PDF audit report covering:
  1. Master file balance arithmetic
  2. Master period amounts vs. project payment requests
  3. Per-project invoice sum and budget equation
  4. Invoice numbers and amounts present in scanned PDFs (via OCR)

Usage:
  python budget_proofer.py <folder> [--period "11--12-2025"] [--output report.pdf]

Exit codes:
  0  All checks passed
  2  One or more checks failed
  1  Fatal error (bad folder, missing dependency, etc.)
"""

from __future__ import annotations

import argparse
import io
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime
from difflib import SequenceMatcher
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Third-party imports (all listed in requirements.txt)
# ---------------------------------------------------------------------------
try:
    import openpyxl
except ImportError:
    sys.exit("ERROR: openpyxl not installed. Run: pip install openpyxl")

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("ERROR: PyMuPDF not installed. Run: pip install PyMuPDF")

try:
    from PIL import Image
except ImportError:
    sys.exit("ERROR: Pillow not installed. Run: pip install Pillow")

try:
    import pytesseract
except ImportError:
    sys.exit("ERROR: pytesseract not installed. Run: pip install pytesseract")

try:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import cm
    from reportlab.platypus import (
        HRFlowable,
        PageBreak,
        Paragraph,
        SimpleDocTemplate,
        Spacer,
        Table,
        TableStyle,
    )
except ImportError:
    sys.exit("ERROR: reportlab not installed. Run: pip install reportlab")


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

TOLERANCE = 0.02  # Acceptable rounding difference (≤ 2 agorot / cents)
OCR_DPI = 300
MIN_OCR_TEXT_LEN = 50  # Pages with fewer chars are flagged as low-quality scans
FUZZY_PDF_MATCH_THRESHOLD = 0.4   # Minimum SequenceMatcher ratio to link PDF→Excel
FUZZY_NAME_MATCH_THRESHOLD = 0.55  # Minimum ratio to match master row → project file
FUZZY_PERIOD_MATCH_THRESHOLD = 0.5

# Report colours
PASS_BG = colors.Color(0.78, 0.95, 0.78)
FAIL_BG = colors.Color(1.0, 0.78, 0.78)
HDR_BG = colors.Color(0.2, 0.35, 0.55)


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class InvoiceRow:
    row_number: Optional[int]
    description: str
    invoice_number: str       # Raw string; may be empty
    supplier_name: str
    payment_day: str
    reference: str
    total: Optional[float]
    period_label: str         # Nearest preceding col-A period label


@dataclass
class ProjectSummary:
    total_listed_invoices: Optional[float]
    payment_request: Optional[float]
    paid_previous_report: Optional[float]
    remaining_budget: Optional[float]


@dataclass
class ProjectData:
    file_path: Path
    project_number: Optional[int]
    project_name: str
    total_budget: Optional[float]
    invoices: list[InvoiceRow] = field(default_factory=list)
    summary: Optional[ProjectSummary] = None
    parse_errors: list[str] = field(default_factory=list)


@dataclass
class MasterRow:
    project_number: int
    project_name: str
    approved: Optional[float]
    period_amounts: dict[str, Optional[float]]
    balance: Optional[float]


@dataclass
class CheckResult:
    check_name: str
    project_name: str
    passed: bool
    expected: str
    actual: str
    detail: str


@dataclass
class AuditReport:
    master_arithmetic_checks: list[CheckResult] = field(default_factory=list)
    master_vs_project_checks: list[CheckResult] = field(default_factory=list)
    project_math_checks: list[CheckResult] = field(default_factory=list)
    invoice_ocr_checks: list[CheckResult] = field(default_factory=list)

    def all_checks(self) -> list[CheckResult]:
        return (
            self.master_arithmetic_checks
            + self.master_vs_project_checks
            + self.project_math_checks
            + self.invoice_ocr_checks
        )

    def total(self) -> int:
        return len(self.all_checks())

    def passed_count(self) -> int:
        return sum(1 for c in self.all_checks() if c.passed)

    def failed_count(self) -> int:
        return self.total() - self.passed_count()


# ---------------------------------------------------------------------------
# Helper: float parsing
# ---------------------------------------------------------------------------

_RTL_MARKERS = re.compile(r"[\u200e\u200f\u202a-\u202e]")


def _parse_float(value) -> Optional[float]:
    """Convert an openpyxl cell value to float; return None on failure."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value)
    text = _RTL_MARKERS.sub("", text)
    text = text.replace("\xa0", " ")          # non-breaking space
    text = re.sub(r"[₪$€\s]", "", text)      # currency symbols and spaces
    text = text.replace(",", "")              # thousands separators
    text = text.strip()
    if text == "" or text == "-":
        return None
    try:
        return float(text)
    except ValueError:
        return None


def _fmt(v: Optional[float]) -> str:
    """Format a float for display; show '—' for None."""
    if v is None:
        return "—"
    return f"{v:,.2f}"


def _last_numeric(row) -> Optional[float]:
    """Return the last cell in a row that parses as a float."""
    for cell in reversed(list(row)):
        v = _parse_float(cell)
        if v is not None:
            return v
    return None


# ---------------------------------------------------------------------------
# Helper: period normalisation
# ---------------------------------------------------------------------------

def _norm_period(s: str) -> str:
    """Normalise a period label for fuzzy comparison."""
    s = _RTL_MARKERS.sub("", s)
    s = re.sub(r"[\s/–—]", "-", s)   # unify separators
    s = re.sub(r"-{2,}", "-", s)     # collapse multiple dashes
    return s.lower().strip()


def _best_period_match(target: str, headers: list[str]) -> Optional[str]:
    """Return the header most similar to target; None if below threshold."""
    nt = _norm_period(target)
    best_h, best_r = None, 0.0
    for h in headers:
        r = SequenceMatcher(None, nt, _norm_period(h)).ratio()
        if r > best_r:
            best_r = r
            best_h = h
    return best_h if best_r >= FUZZY_PERIOD_MATCH_THRESHOLD else None


# ---------------------------------------------------------------------------
# File discovery
# ---------------------------------------------------------------------------

def discover_files(folder: Path) -> tuple[Optional[Path], list[Path], list[Path]]:
    """
    Scan folder for master.xlsx, project Excel files, and PDF files.

    Returns (master_path, project_excel_paths, project_pdf_paths).
    master_path is None if not found.
    """
    xlsx_files: list[Path] = []
    pdf_files: list[Path] = []

    for f in sorted(folder.iterdir()):
        if not f.is_file():
            continue
        if f.suffix.lower() in (".xlsx", ".xls"):
            xlsx_files.append(f)
        elif f.suffix.lower() == ".pdf":
            pdf_files.append(f)

    master: Optional[Path] = None
    projects: list[Path] = []
    for f in xlsx_files:
        stem_lower = f.stem.lower()
        if "master" in stem_lower or "summary" in stem_lower:
            if master is None:
                master = f
            else:
                print(f"  WARN: Multiple master candidates found; using {master.name}, ignoring {f.name}")
        else:
            projects.append(f)

    if master is None:
        print("  WARN: No master file found (no .xlsx with 'master' or 'summary' in name). Master checks will be skipped.")

    return master, projects, pdf_files


def match_pdf_to_excel(
    excel_paths: list[Path], pdf_paths: list[Path]
) -> dict[Path, Optional[Path]]:
    """
    Match each project Excel file to its PDF by fuzzy filename similarity.
    Returns dict mapping excel_path → pdf_path (or None).
    """
    mapping: dict[Path, Optional[Path]] = {}
    for ep in excel_paths:
        best_pdf: Optional[Path] = None
        best_ratio = 0.0
        for pp in pdf_paths:
            r = SequenceMatcher(None, ep.stem.lower(), pp.stem.lower()).ratio()
            if r > best_ratio:
                best_ratio = r
                best_pdf = pp
        if best_ratio >= FUZZY_PDF_MATCH_THRESHOLD:
            mapping[ep] = best_pdf
        else:
            mapping[ep] = None
            print(f"  WARN: No PDF matched for {ep.name} (best ratio {best_ratio:.2f}). OCR checks skipped.")
    return mapping


# ---------------------------------------------------------------------------
# Master file parsing
# ---------------------------------------------------------------------------

def parse_master(
    path: Path,
) -> tuple[list[MasterRow], list[str]]:
    """Parse the master summary Excel file into MasterRow objects."""
    warnings: list[str] = []
    wb = openpyxl.load_workbook(str(path), data_only=True)
    ws = wb.active

    if wb.sheetnames and len(wb.sheetnames) > 1:
        warnings.append(f"Master file has {len(wb.sheetnames)} sheets; only active sheet parsed.")

    # --- Locate header row ---
    header_row_idx: Optional[int] = None
    col_no: Optional[int] = None
    col_name: Optional[int] = None
    col_approved: Optional[int] = None
    col_balance: Optional[int] = None
    period_cols: list[tuple[int, str]] = []  # (col_index_0based, label)

    all_rows = list(ws.iter_rows(values_only=True))
    for ridx, row in enumerate(all_rows):
        cells = [str(c or "").strip() for c in row]
        # Detect header: row must contain both a "No" column and a "Name" column
        has_no = any(re.match(r"^no\.?$|^№$|^#$", c, re.IGNORECASE) for c in cells)
        has_name = any("name" in c.lower() and len(c) > 2 for c in cells)
        if has_no and has_name:
            header_row_idx = ridx
            for cidx, c in enumerate(cells):
                cl = c.lower()
                if re.match(r"^no\.?$|^№$|^#$", cl):
                    col_no = cidx
                elif "name" in cl and "project" in cl or ("name" in cl and col_name is None):
                    col_name = cidx
                elif cl == "approved" or cl.startswith("approv"):
                    col_approved = cidx
                elif "balance" in cl or "remaining" in cl:
                    col_balance = cidx
            break

    if header_row_idx is None:
        warnings.append("Could not locate header row in master file. Master checks skipped.")
        return [], warnings

    # Period columns: everything between approved and balance
    header_cells = [str(c or "").strip() for c in all_rows[header_row_idx]]
    for cidx, label in enumerate(header_cells):
        if cidx in (col_no, col_name, col_approved, col_balance):
            continue
        if col_approved is not None and col_balance is not None:
            if col_approved < cidx < col_balance and label:
                period_cols.append((cidx, label))
        elif label and cidx not in (col_no, col_name, col_approved, col_balance):
            # Fallback: include anything that looks like a period label
            if re.search(r"\d{4}", label):
                period_cols.append((cidx, label))

    # --- Parse data rows ---
    rows: list[MasterRow] = []
    for row in all_rows[header_row_idx + 1 :]:
        no_val = row[col_no] if col_no is not None else None
        if no_val is None or str(no_val).strip() == "":
            continue
        try:
            project_number = int(str(no_val).strip().rstrip("."))
        except (ValueError, TypeError):
            continue  # Subtotal rows like "Total for therapy"

        name = str(row[col_name] if col_name is not None else "").strip()
        if not name:
            continue

        approved = _parse_float(row[col_approved]) if col_approved is not None else None
        balance = _parse_float(row[col_balance]) if col_balance is not None else None
        period_amounts: dict[str, Optional[float]] = {}
        for cidx, label in period_cols:
            period_amounts[label] = _parse_float(row[cidx])

        rows.append(MasterRow(project_number, name, approved, period_amounts, balance))

    return rows, warnings


# ---------------------------------------------------------------------------
# Project file parsing
# ---------------------------------------------------------------------------

_SUMMARY_KEYWORDS: dict[str, str] = {
    "total of listed": "total_listed_invoices",
    "payment request": "payment_request",
    "paid in the previous": "paid_previous_report",
    "remaining budget": "remaining_budget",
    "remaining": "remaining_budget",
}

_PERIOD_RE = re.compile(r"\d{1,2}[\-–/]\d{4}")


def parse_project(path: Path) -> ProjectData:
    """Parse one per-project Excel file."""
    data = ProjectData(
        file_path=path,
        project_number=None,
        project_name=path.stem,
        total_budget=None,
    )

    wb = openpyxl.load_workbook(str(path), data_only=True)
    ws = wb.active

    if wb.sheetnames and len(wb.sheetnames) > 1:
        data.parse_errors.append(f"Multiple sheets; only active sheet parsed.")

    all_rows = list(ws.iter_rows(values_only=True))

    # ---- Phase 1: project number and name (scan first 25 rows) ----
    for row in all_rows[:25]:
        cells = [c for c in row if c is not None]
        text = " ".join(str(c) for c in cells)
        # Look for "Project X" or "Project No. X" pattern
        m = re.search(r"project\s*(?:no\.?|number|#)?\s*(\d+)", text, re.IGNORECASE)
        if m and data.project_number is None:
            data.project_number = int(m.group(1))
        # Project name: longest non-numeric string cell in same row
        if data.project_number is not None and data.project_name == path.stem:
            for c in cells:
                cs = str(c).strip()
                if (
                    len(cs) > 4
                    and not re.match(r"^[\d,.\s₪$€]+$", cs)
                    and "project" not in cs.lower()
                ):
                    data.project_name = cs
                    break

    # ---- Phase 2: total budget ----
    for row in all_rows:
        text = " ".join(str(c or "") for c in row).lower()
        if "total budget" in text:
            v = _last_numeric(row)
            if v is not None:
                data.total_budget = v
                break

    # ---- Phase 3: invoices table ----
    invoices_label_row: Optional[int] = None
    for ridx, row in enumerate(all_rows):
        text = " ".join(str(c or "") for c in row).lower()
        if "invoices table" in text or "invoice table" in text:
            invoices_label_row = ridx
            break

    if invoices_label_row is None:
        data.parse_errors.append("Could not find 'Invoices table:' label.")
        # Still attempt summary parsing below
    else:
        # Next non-empty row is column headers
        col_header_row: Optional[int] = None
        for ridx in range(invoices_label_row + 1, min(invoices_label_row + 5, len(all_rows))):
            if any(c is not None for c in all_rows[ridx]):
                col_header_row = ridx
                break

        # Map column indices
        col_rownum: Optional[int] = None
        col_desc: Optional[int] = None
        col_invnum: Optional[int] = None
        col_supplier: Optional[int] = None
        col_payment: Optional[int] = None
        col_ref: Optional[int] = None
        col_total: Optional[int] = None

        if col_header_row is not None:
            for cidx, cell in enumerate(all_rows[col_header_row]):
                cl = str(cell or "").strip().lower()
                if re.match(r"^row$|^#$|^no\.?$|row\s*#", cl):
                    col_rownum = cidx
                elif "description" in cl:
                    col_desc = cidx
                elif "invoice" in cl and ("number" in cl or "no" in cl or col_invnum is None):
                    col_invnum = cidx
                elif "supplier" in cl or ("name" in cl and "supplier" in cl):
                    col_supplier = cidx
                elif "payment" in cl or "date" in cl or "day" in cl:
                    col_payment = cidx
                elif "reference" in cl or cl.startswith("ref"):
                    col_ref = cidx
                elif "total" in cl or "amount" in cl:
                    col_total = cidx

        # ---- Phase 4: invoice data rows ----
        first_data_row = (col_header_row + 1) if col_header_row is not None else (invoices_label_row + 2)
        current_period = ""
        summary_start: Optional[int] = None

        for ridx in range(first_data_row, len(all_rows)):
            row = all_rows[ridx]
            text_lower = " ".join(str(c or "") for c in row).lower()

            # Detect start of summary section
            if any(kw in text_lower for kw in _SUMMARY_KEYWORDS):
                summary_start = ridx
                break

            # Update period label from col A
            col_a = str(row[0] or "").strip()
            if col_a and _PERIOD_RE.search(col_a):
                current_period = col_a

            # Skip blank rows
            if not any(c is not None for c in row):
                continue

            total_val = _parse_float(row[col_total]) if col_total is not None else None
            inv_raw = str(row[col_invnum] or "").strip() if col_invnum is not None else ""

            # Skip header echoes or completely blank invoice rows
            if inv_raw.lower() in ("invoice number", "invoice no", "invoice no.", "", "none"):
                inv_raw = ""
            if total_val is None and inv_raw == "":
                continue

            try:
                rn = int(row[col_rownum]) if col_rownum is not None and row[col_rownum] is not None else None
            except (TypeError, ValueError):
                rn = None

            data.invoices.append(
                InvoiceRow(
                    row_number=rn,
                    description=str(row[col_desc] or "").strip() if col_desc is not None else "",
                    invoice_number=inv_raw,
                    supplier_name=str(row[col_supplier] or "").strip() if col_supplier is not None else "",
                    payment_day=str(row[col_payment] or "").strip() if col_payment is not None else "",
                    reference=str(row[col_ref] or "").strip() if col_ref is not None else "",
                    total=total_val,
                    period_label=current_period,
                )
            )

        # ---- Phase 5: summary rows ----
        summary_data: dict[str, Optional[float]] = {
            "total_listed_invoices": None,
            "payment_request": None,
            "paid_previous_report": None,
            "remaining_budget": None,
        }
        scan_from = summary_start if summary_start is not None else first_data_row
        for row in all_rows[scan_from:]:
            text_lower = " ".join(str(c or "") for c in row).lower()
            for kw, field_name in _SUMMARY_KEYWORDS.items():
                if kw in text_lower and summary_data[field_name] is None:
                    v = _last_numeric(row)
                    if v is not None:
                        summary_data[field_name] = v

        data.summary = ProjectSummary(
            total_listed_invoices=summary_data["total_listed_invoices"],
            payment_request=summary_data["payment_request"],
            paid_previous_report=summary_data["paid_previous_report"],
            remaining_budget=summary_data["remaining_budget"],
        )

    return data


# ---------------------------------------------------------------------------
# Math checks
# ---------------------------------------------------------------------------

def check_master_arithmetic(master_rows: list[MasterRow], report: AuditReport) -> None:
    """Verify balance = approved - sum(period amounts) for every master row."""
    for mr in master_rows:
        pname = f"[{mr.project_number}] {mr.project_name}"
        if mr.approved is None:
            report.master_arithmetic_checks.append(
                CheckResult("balance_formula", pname, False, "—", "—", "Approved amount missing")
            )
            continue
        period_vals = [v for v in mr.period_amounts.values() if v is not None]
        period_sum = sum(period_vals)
        expected_balance = mr.approved - period_sum
        actual_balance = mr.balance if mr.balance is not None else 0.0
        passed = abs(actual_balance - expected_balance) <= TOLERANCE
        report.master_arithmetic_checks.append(
            CheckResult(
                check_name="balance_formula",
                project_name=pname,
                passed=passed,
                expected=_fmt(expected_balance),
                actual=_fmt(mr.balance),
                detail=f"Approved {_fmt(mr.approved)} − periods {_fmt(period_sum)} = {_fmt(expected_balance)}",
            )
        )


def check_project_math(project: ProjectData, report: AuditReport) -> None:
    """Verify per-project invoice sum and budget equation."""
    pname = project.project_name
    s = project.summary

    if s is None:
        report.project_math_checks.append(
            CheckResult("invoice_sum", pname, False, "—", "—", "Summary section not found in file")
        )
        return

    # Check 1: invoice rows sum == total_listed_invoices
    invoice_sum = sum(inv.total for inv in project.invoices if inv.total is not None)
    if s.total_listed_invoices is not None:
        passed = abs(invoice_sum - s.total_listed_invoices) <= TOLERANCE
        report.project_math_checks.append(
            CheckResult(
                check_name="invoice_sum",
                project_name=pname,
                passed=passed,
                expected=_fmt(s.total_listed_invoices),
                actual=_fmt(invoice_sum),
                detail=f"Sum of {len(project.invoices)} invoice row(s)",
            )
        )
    else:
        report.project_math_checks.append(
            CheckResult("invoice_sum", pname, False, "—", _fmt(invoice_sum), "'Total of listed invoices' cell not found")
        )

    # Check 2: budget equation
    if all(
        v is not None
        for v in (s.payment_request, s.paid_previous_report, s.remaining_budget, project.total_budget)
    ):
        total_accounted = s.payment_request + s.paid_previous_report + s.remaining_budget  # type: ignore[operator]
        passed = abs(total_accounted - project.total_budget) <= TOLERANCE  # type: ignore[operator]
        report.project_math_checks.append(
            CheckResult(
                check_name="budget_equation",
                project_name=pname,
                passed=passed,
                expected=_fmt(project.total_budget),
                actual=_fmt(total_accounted),
                detail=(
                    f"Request {_fmt(s.payment_request)} + Prev {_fmt(s.paid_previous_report)}"
                    f" + Remaining {_fmt(s.remaining_budget)} = {_fmt(total_accounted)}"
                ),
            )
        )
    else:
        missing = [
            name
            for name, val in [
                ("payment_request", s.payment_request),
                ("paid_previous_report", s.paid_previous_report),
                ("remaining_budget", s.remaining_budget),
                ("total_budget", project.total_budget),
            ]
            if val is None
        ]
        report.project_math_checks.append(
            CheckResult(
                "budget_equation", pname, False, "—", "—",
                f"Missing values: {', '.join(missing)}"
            )
        )


def check_master_vs_project(
    master_rows: list[MasterRow],
    projects: list[ProjectData],
    target_period: Optional[str],
    report: AuditReport,
) -> None:
    """For each master row, find the matching project and compare the period amount."""
    proj_by_number: dict[int, ProjectData] = {
        p.project_number: p for p in projects if p.project_number is not None
    }

    for mr in master_rows:
        pname = f"[{mr.project_number}] {mr.project_name}"

        # Find matching project
        proj: Optional[ProjectData] = proj_by_number.get(mr.project_number)
        if proj is None:
            # Fuzzy name match
            best_p: Optional[ProjectData] = None
            best_r = 0.0
            for p in projects:
                r = SequenceMatcher(None, mr.project_name.lower(), p.project_name.lower()).ratio()
                if r > best_r:
                    best_r = r
                    best_p = p
            if best_r >= FUZZY_NAME_MATCH_THRESHOLD:
                proj = best_p
            else:
                report.master_vs_project_checks.append(
                    CheckResult(
                        "project_match", pname, False, "—", "—",
                        f"No matching project Excel found (best ratio {best_r:.2f})"
                    )
                )
                continue

        if proj.summary is None:
            report.master_vs_project_checks.append(
                CheckResult("period_match", pname, False, "—", "—", "Project summary not parsed")
            )
            continue

        # Determine master period amount
        master_amount: Optional[float] = None
        period_label_used = ""
        if target_period:
            matched_header = _best_period_match(target_period, list(mr.period_amounts.keys()))
            if matched_header:
                master_amount = mr.period_amounts.get(matched_header)
                period_label_used = matched_header
            else:
                report.master_vs_project_checks.append(
                    CheckResult(
                        "period_match", pname, False, _fmt(proj.summary.payment_request), "—",
                        f"Period '{target_period}' not found in master columns: {list(mr.period_amounts.keys())}"
                    )
                )
                continue
        else:
            # No target period: use the rightmost period column
            if mr.period_amounts:
                period_label_used, master_amount = list(mr.period_amounts.items())[-1]
            else:
                report.master_vs_project_checks.append(
                    CheckResult("period_match", pname, False, "—", "—", "No period columns in master")
                )
                continue

        project_request = proj.summary.payment_request
        if master_amount is None or project_request is None:
            report.master_vs_project_checks.append(
                CheckResult(
                    "period_match", pname, False,
                    _fmt(project_request), _fmt(master_amount),
                    f"Missing value (master col '{period_label_used}')"
                )
            )
            continue

        passed = abs(master_amount - project_request) <= TOLERANCE
        report.master_vs_project_checks.append(
            CheckResult(
                check_name="period_match",
                project_name=pname,
                passed=passed,
                expected=_fmt(project_request),
                actual=_fmt(master_amount),
                detail=f"Master col '{period_label_used}' vs project payment request",
            )
        )


# ---------------------------------------------------------------------------
# OCR helpers
# ---------------------------------------------------------------------------

def _normalize_amount(value: float) -> set[str]:
    """Return candidate string representations of an amount for OCR matching."""
    i = int(round(value))
    variants: set[str] = {
        str(i),
        f"{i:,}",            # e.g. "5,900"
        f"{value:.2f}",
        f"{value:,.2f}",
        str(i).replace(",", "."),   # European style
    }
    # Also add without thousands sep
    variants.add(re.sub(r"[,\.]", "", str(i)))
    return variants


def _normalize_invoice_number(inv: str) -> list[str]:
    """Return candidate search strings for an invoice number."""
    stripped = inv.strip()
    digits_only = re.sub(r"\D", "", stripped)
    candidates = [stripped, stripped.upper()]
    if digits_only:
        candidates.append(digits_only)
        candidates.append(digits_only.lstrip("0") or digits_only)
    candidates.append(stripped.replace(" ", "-"))
    candidates.append(stripped.replace("-", " "))
    # Deduplicate while preserving order
    seen: set[str] = set()
    result: list[str] = []
    for c in candidates:
        if c and c not in seen:
            seen.add(c)
            result.append(c)
    return result


def extract_text_from_pdf(pdf_path: Path) -> list[str]:
    """Render each PDF page at 300 DPI and OCR it. Returns one string per page."""
    doc = fitz.open(str(pdf_path))
    page_texts: list[str] = []
    mat = fitz.Matrix(OCR_DPI / 72, OCR_DPI / 72)

    for page_num, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=mat)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        try:
            text = pytesseract.image_to_string(img, lang="eng+heb", config="--psm 6")
        except pytesseract.TesseractError:
            try:
                text = pytesseract.image_to_string(img, lang="eng", config="--psm 6")
                if page_num == 1:
                    print("  WARN: Hebrew Tesseract data not available; using English only.")
            except pytesseract.TesseractError as exc:
                text = ""
                print(f"  WARN: OCR failed on page {page_num}: {exc}")

        page_texts.append(text)

    return page_texts


def check_invoices_in_pdf(
    project: ProjectData, pdf_path: Path, report: AuditReport
) -> None:
    """Verify each invoice number (and amount) from the project Excel exists in the PDF."""
    print(f"  OCR: {pdf_path.name} ...")
    page_texts = extract_text_from_pdf(pdf_path)
    full_text = "\n--- PAGE BREAK ---\n".join(page_texts)
    pname = project.project_name

    if len(full_text.strip()) < MIN_OCR_TEXT_LEN:
        report.invoice_ocr_checks.append(
            CheckResult(
                "ocr_quality", pname, False, "readable text", f"{len(full_text.strip())} chars",
                "OCR extracted very little text — scan quality may be too low"
            )
        )
        return

    for inv in project.invoices:
        if not inv.invoice_number:
            continue

        # Search for invoice number
        candidates = _normalize_invoice_number(inv.invoice_number)
        match_pos: Optional[int] = None
        for cand in candidates:
            pos = full_text.lower().find(cand.lower())
            if pos != -1:
                match_pos = pos
                break

        number_found = match_pos is not None
        label = f"Inv #{inv.invoice_number} ({inv.supplier_name or 'unknown supplier'})"

        report.invoice_ocr_checks.append(
            CheckResult(
                check_name="invoice_number_in_pdf",
                project_name=pname,
                passed=number_found,
                expected=inv.invoice_number,
                actual="found" if number_found else "not found",
                detail=label,
            )
        )

        if not number_found or inv.total is None:
            continue

        # Check amount appears near the invoice number
        window_start = max(0, match_pos - 500)
        window_end = min(len(full_text), match_pos + 500)
        window = full_text[window_start:window_end]

        target_variants = _normalize_amount(inv.total)
        amount_found = False
        for token in re.findall(r"[\d,.\s]+", window):
            token_clean = re.sub(r"\s", "", token)
            token_clean_plain = re.sub(r"[,.]", "", token_clean)
            check_variants = {token_clean, token_clean_plain}
            if target_variants & check_variants:
                amount_found = True
                break

        report.invoice_ocr_checks.append(
            CheckResult(
                check_name="invoice_amount_in_pdf",
                project_name=pname,
                passed=amount_found,
                expected=_fmt(inv.total),
                actual="confirmed" if amount_found else "not confirmed",
                detail=f"{label} — amount {_fmt(inv.total)}",
            )
        )


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def _check_table(checks: list[CheckResult]) -> Table:
    """Build a colour-coded reportlab Table from CheckResult objects."""
    headers = ["Project", "Check", "Status", "Expected", "Actual", "Detail"]
    data: list[list[str]] = [headers]
    row_styles: list[tuple] = []

    for i, c in enumerate(checks, start=1):
        data.append([
            c.project_name,
            c.check_name,
            "PASS" if c.passed else "FAIL",
            c.expected,
            c.actual,
            c.detail,
        ])
        bg = PASS_BG if c.passed else FAIL_BG
        row_styles.append(("BACKGROUND", (0, i), (-1, i), bg))

    style = TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), HDR_BG),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 7.5),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]
        + row_styles
    )
    col_widths = [4.5 * cm, 3.5 * cm, 1.5 * cm, 2.5 * cm, 2.5 * cm, 5.5 * cm]
    return Table(data, colWidths=col_widths, style=style, repeatRows=1)


def generate_pdf_report(
    report: AuditReport,
    output_path: Path,
    folder: Path,
    period: Optional[str],
) -> None:
    """Generate the full PDF audit report."""
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=1.8 * cm,
        rightMargin=1.8 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "AuditTitle", parent=styles["Title"], fontSize=18, spaceAfter=6, textColor=HDR_BG
    )
    h1_style = ParagraphStyle(
        "AuditH1", parent=styles["Heading1"], fontSize=12, spaceBefore=14, spaceAfter=4,
        textColor=HDR_BG
    )
    body_style = ParagraphStyle("AuditBody", parent=styles["Normal"], fontSize=9, spaceAfter=2)
    warn_style = ParagraphStyle(
        "AuditWarn", parent=styles["Normal"], fontSize=9, textColor=colors.darkorange
    )

    story = []

    # ---- Cover / Summary ----
    story.append(Paragraph("Grant Budget Audit Report", title_style))
    story.append(Paragraph(
        f"Folder: <i>{folder}</i>  |  Period: <i>{period or 'all'}</i>  |  "
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        body_style,
    ))
    story.append(Spacer(1, 0.4 * cm))
    story.append(HRFlowable(width="100%", thickness=1, color=HDR_BG))
    story.append(Spacer(1, 0.3 * cm))

    total = report.total()
    passed = report.passed_count()
    failed = report.failed_count()
    rate = f"{100 * passed / max(total, 1):.1f}%"

    summary_data = [
        ["Total checks", "Passed", "Failed", "Pass rate"],
        [str(total), str(passed), str(failed), rate],
    ]
    st = Table(summary_data, colWidths=[3.5 * cm] * 4)
    st.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), HDR_BG),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 1), (-1, 1), PASS_BG if failed == 0 else FAIL_BG),
            ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
        ])
    )
    story.append(st)
    story.append(PageBreak())

    def add_section(heading: str, checks: list[CheckResult]) -> None:
        if not checks:
            return
        story.append(Paragraph(heading, h1_style))
        story.append(_check_table(checks))
        story.append(Spacer(1, 0.5 * cm))

    add_section("1. Master File Balance Arithmetic", report.master_arithmetic_checks)
    add_section("2. Master File vs. Project Files (Period Cross-Check)", report.master_vs_project_checks)
    add_section("3. Per-Project Math Checks", report.project_math_checks)
    add_section("4. Invoice PDF Verification (OCR)", report.invoice_ocr_checks)

    if not any([
        report.master_arithmetic_checks,
        report.master_vs_project_checks,
        report.project_math_checks,
        report.invoice_ocr_checks,
    ]):
        story.append(Paragraph("No checks were run.", warn_style))

    doc.build(story)


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Audit grant budget Excel files and produce a PDF report.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("folder", help="Folder containing all budget Excel and PDF files")
    parser.add_argument(
        "--period",
        default=None,
        metavar="LABEL",
        help='Period column label to check, e.g. "11--12-2025"',
    )
    parser.add_argument(
        "--output",
        default="report.pdf",
        metavar="FILE",
        help="Output PDF report path (default: report.pdf)",
    )
    args = parser.parse_args()

    folder = Path(args.folder).expanduser().resolve()
    if not folder.is_dir():
        print(f"ERROR: '{folder}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    print(f"Scanning: {folder}")

    # Discovery
    master_path, project_excel_paths, pdf_paths = discover_files(folder)
    pdf_map = match_pdf_to_excel(project_excel_paths, pdf_paths)

    # Parse master
    master_rows: list[MasterRow] = []
    if master_path:
        print(f"Parsing master: {master_path.name}")
        master_rows, warnings = parse_master(master_path)
        for w in warnings:
            print(f"  WARN: {w}")
        print(f"  → {len(master_rows)} project rows found")

    # Parse project files
    projects: list[ProjectData] = []
    for ep in project_excel_paths:
        print(f"Parsing project: {ep.name}")
        p = parse_project(ep)
        projects.append(p)
        for err in p.parse_errors:
            print(f"  WARN: {err}")
        inv_count = len(p.invoices)
        print(f"  → '{p.project_name}' | budget={_fmt(p.total_budget)} | {inv_count} invoices")

    # Run checks
    audit = AuditReport()

    if master_rows:
        print("\nRunning master arithmetic checks ...")
        check_master_arithmetic(master_rows, audit)
        print("Running master vs. project cross-checks ...")
        check_master_vs_project(master_rows, projects, args.period, audit)

    print("Running per-project math checks ...")
    for p in projects:
        check_project_math(p, audit)

    print("Running invoice PDF verification ...")
    for p in projects:
        pdf_path = pdf_map.get(p.file_path)
        if pdf_path:
            check_invoices_in_pdf(p, pdf_path, audit)
        else:
            audit.invoice_ocr_checks.append(
                CheckResult(
                    "pdf_match", p.project_name, False, "PDF file", "not found",
                    "No matching PDF; OCR checks skipped"
                )
            )

    # Generate report
    output = Path(args.output).expanduser().resolve()
    print(f"\nGenerating report: {output}")
    generate_pdf_report(audit, output, folder, args.period)

    total = audit.total()
    passed = audit.passed_count()
    failed = audit.failed_count()
    print(f"\nResult: {passed}/{total} checks passed | {failed} failed")
    print(f"Report: {output}")

    sys.exit(0 if failed == 0 else 2)


if __name__ == "__main__":
    main()
