# Budget Proofer — Swiss K.Y. Association Grant Audit Tool

Automated audit tool that verifies grant budget files and produces a PDF report.

## What it checks

| # | Check | How |
|---|---|---|
| 1 | **Master balance formula** | `Balance == Approved − sum(all period columns)` for every project row |
| 2 | **Master vs. project files** | Master's period amount matches the project file's "payment request" |
| 3 | **Invoice sum** | Sum of individual invoice rows equals the stated "Total of listed invoices" |
| 4 | **Budget equation** | `Payment request + Paid in previous report + Remaining budget == Total budget` |
| 5 | **Invoice numbers in PDF** | Every invoice number in the Excel appears in the scanned PDF (via OCR) |
| 6 | **Invoice amounts in PDF** | The amount for each invoice is confirmed near its number in the PDF |

## Requirements

### Python packages
```
pip install -r requirements.txt
```

### Tesseract OCR (system package — not pip)
```bash
# Ubuntu / Debian
sudo apt install tesseract-ocr tesseract-ocr-heb

# macOS
brew install tesseract tesseract-lang

# Windows
# Download installer from https://github.com/UB-Mannheim/tesseract/wiki
```

## File layout expected

All files must be in **one flat folder**:

```
/budget-folder/
  master.xlsx          <- must contain "master" or "summary" in filename
  horse_and_dogs.xlsx  <- one Excel per project
  horse_and_dogs.pdf   <- one PDF per project (all invoices bundled; scanned)
  soccer_team.xlsx
  soccer_team.pdf
  ...
```

**PDF matching:** The tool matches each project Excel to its PDF by filename similarity. Keep filenames consistent (e.g. `project4_horse.xlsx` + `project4_horse.pdf`).

## Usage

```bash
python budget_proofer.py <folder> [--period "11--12-2025"] [--output report.pdf]
```

### Arguments

| Argument | Description |
|---|---|
| `folder` | Path to the folder containing all budget files |
| `--period` | Period label exactly as it appears in the master file (e.g. `"11--12-2025"`). Optional — if omitted, uses the last period column. |
| `--output` | Output path for the PDF report (default: `report.pdf`) |

### Examples

```bash
# Check November-December 2025 period
python budget_proofer.py /Users/me/budget --period "11--12-2025" --output audit_nov_dec.pdf

# Check all periods (uses last period column as reference)
python budget_proofer.py /Users/me/budget --output audit_all.pdf
```

## Output

A PDF report with sections:

1. **Cover page** — total checks / passed / failed / pass rate
2. **Master file arithmetic** — balance formula per project
3. **Master vs. project cross-check** — period amounts reconciled
4. **Per-project math** — invoice sums and budget equations
5. **Invoice PDF verification** — OCR results per invoice

Rows are colour-coded: green = pass, red = fail.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | All checks passed |
| `2` | One or more checks failed |
| `1` | Fatal error (bad folder, missing dependency) |

## Notes

- Excel files must be saved after formulas run — openpyxl reads cached values. If amounts show as `—`, open the file in Excel and save it.
- OCR accuracy depends on scan quality. Blurry scans may cause false failures on invoice checks.
- Hebrew text in invoices is handled when `tesseract-ocr-heb` is installed; falls back to English-only OCR otherwise.
