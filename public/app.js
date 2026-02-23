/* ============================================================
   Budget Proofer — Web Edition  (app.js)
   All audit logic runs client-side in the browser.
   No files are ever uploaded to a server.
   ============================================================ */

'use strict';

// ── Constants ────────────────────────────────────────────────
const TOLERANCE              = 0.02;   // ≤ 2 agorot / cents rounding tolerance
const OCR_SCALE              = 300 / 72; // render PDF at 300 DPI
const MIN_OCR_TEXT_LEN       = 50;    // chars; pages below this get OCR'd
const FUZZY_PDF_THRESHOLD    = 0.40;
const FUZZY_NAME_THRESHOLD   = 0.55;
const FUZZY_PERIOD_THRESHOLD = 0.50;

const RTL_RE   = /[\u200e\u200f\u202a-\u202e]/g;
const PERIOD_RE = /\d{1,2}[\u2013\u2014\-\/]\d{4}/;

// ── Tesseract worker (created once, reused) ──────────────────
let _tsWorker = null;

async function getTesseractWorker() {
  if (!_tsWorker) {
    _tsWorker = await Tesseract.createWorker(['eng', 'heb'], 1, {
      logger: () => {},
    });
  }
  return _tsWorker;
}

async function terminateTesseract() {
  if (_tsWorker) {
    await _tsWorker.terminate();
    _tsWorker = null;
  }
}

// ============================================================
// STRING SIMILARITY — Dice coefficient on character bigrams
// Approximates Python's difflib.SequenceMatcher.ratio()
// ============================================================
function getBigrams(str) {
  const out = [];
  for (let i = 0; i < str.length - 1; i++) out.push(str.slice(i, i + 2));
  return out;
}

function sequenceRatio(a, b) {
  if (!a && !b) return 1.0;
  if (!a || !b) return 0.0;
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();
  if (a === b) return 1.0;
  if (a.length < 2 || b.length < 2) return 0.0;

  const bigsA = getBigrams(a);
  const bigsB = [...getBigrams(b)]; // copy so we can splice
  let hits = 0;
  for (const bg of bigsA) {
    const idx = bigsB.indexOf(bg);
    if (idx !== -1) { hits++; bigsB.splice(idx, 1); }
  }
  return (2 * hits) / (getBigrams(a).length + getBigrams(b).length);
}

// ============================================================
// FLOAT PARSING
// ============================================================
function parseFloat_(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return isFinite(value) ? value : null;
  let text = String(value);
  text = text.replace(RTL_RE, '');
  text = text.replace(/\u00a0/g, ' ');          // non-breaking space
  text = text.replace(/[₪$€\s]/g, '');          // currency & spaces
  text = text.replace(/,/g, '');                 // thousands separators
  text = text.trim();
  if (text === '' || text === '-' || text === '\u2014') return null;
  const n = Number(text);
  return isFinite(n) ? n : null;
}

function fmt(v) {
  if (v === null || v === undefined) return '\u2014';
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function lastNumeric(row) {
  for (let i = row.length - 1; i >= 0; i--) {
    const v = parseFloat_(row[i]);
    if (v !== null) return v;
  }
  return null;
}

// ============================================================
// PERIOD NORMALISATION
// ============================================================
function normPeriod(s) {
  s = s.replace(RTL_RE, '');
  s = s.replace(/[\s\/\u2013\u2014]/g, '-');
  s = s.replace(/-{2,}/g, '-');
  return s.toLowerCase().trim();
}

function bestPeriodMatch(target, headers) {
  const nt = normPeriod(target);
  let bestH = null, bestR = 0;
  for (const h of headers) {
    const r = sequenceRatio(nt, normPeriod(h));
    if (r > bestR) { bestR = r; bestH = h; }
  }
  return bestR >= FUZZY_PERIOD_THRESHOLD ? bestH : null;
}

// ============================================================
// FILE DISCOVERY
// ============================================================
function discoverFiles(files) {
  const xlsxFiles = [], pdfFiles = [];
  for (const f of files) {
    const name = f.name.toLowerCase();
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) xlsxFiles.push(f);
    else if (name.endsWith('.pdf')) pdfFiles.push(f);
  }

  let master = null;
  const projects = [];
  for (const f of xlsxFiles) {
    const stem = f.name.replace(/\.[^.]+$/, '').toLowerCase();
    if (stem.includes('master') || stem.includes('summary')) {
      if (!master) { master = f; }
      else { log(`WARN: Multiple master candidates; using ${master.name}, ignoring ${f.name}`); }
    } else {
      projects.push(f);
    }
  }

  if (!master) log('WARN: No master file found (no .xlsx with "master" or "summary" in name). Master checks will be skipped.');
  return { master, projects, pdfs: pdfFiles };
}

function matchPdfToExcel(excelFiles, pdfFiles) {
  const mapping = new Map();
  for (const ef of excelFiles) {
    const eStem = ef.name.replace(/\.[^.]+$/, '');
    let bestPdf = null, bestRatio = 0;
    for (const pf of pdfFiles) {
      const pStem = pf.name.replace(/\.[^.]+$/, '');
      const r = sequenceRatio(eStem, pStem);
      if (r > bestRatio) { bestRatio = r; bestPdf = pf; }
    }
    if (bestRatio >= FUZZY_PDF_THRESHOLD) {
      mapping.set(ef, bestPdf);
    } else {
      mapping.set(ef, null);
      log(`WARN: No PDF matched for ${ef.name} (best ratio ${bestRatio.toFixed(2)}). OCR checks skipped.`);
    }
  }
  return mapping;
}

// ============================================================
// EXCEL PARSING — Master file
// ============================================================
async function parseMaster(file) {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array', cellText: false, cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const allRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });

  const warnings = [];
  if (wb.SheetNames.length > 1) {
    warnings.push(`Master file has ${wb.SheetNames.length} sheets; only the first sheet is parsed.`);
  }

  // Locate header row
  let headerRowIdx = null;
  let colNo = null, colName = null, colApproved = null, colBalance = null;
  const periodCols = []; // [{idx, label}]

  for (let ridx = 0; ridx < allRows.length; ridx++) {
    const cells = (allRows[ridx] || []).map(c => String(c == null ? '' : c).trim());
    const hasNo   = cells.some(c => /^no\.?$|^№$|^#$/.test(c.toLowerCase()));
    const hasName = cells.some(c => c.toLowerCase().includes('name') && c.length > 2);
    if (hasNo && hasName) {
      headerRowIdx = ridx;
      cells.forEach((c, cidx) => {
        const cl = c.toLowerCase();
        if (/^no\.?$|^№$|^#$/.test(cl)) colNo = cidx;
        else if ((cl.includes('name') && cl.includes('project')) || (cl.includes('name') && colName === null)) colName = cidx;
        else if (cl === 'approved' || cl.startsWith('approv')) colApproved = cidx;
        else if (cl.includes('balance') || cl.includes('remaining')) colBalance = cidx;
      });
      break;
    }
  }

  if (headerRowIdx === null) {
    warnings.push('Could not locate header row in master file. Master checks skipped.');
    return { rows: [], warnings };
  }

  // Period columns (between Approved and Balance)
  const headerCells = (allRows[headerRowIdx] || []).map(c => String(c == null ? '' : c).trim());
  headerCells.forEach((label, cidx) => {
    if ([colNo, colName, colApproved, colBalance].includes(cidx)) return;
    if (colApproved !== null && colBalance !== null) {
      if (cidx > colApproved && cidx < colBalance && label) periodCols.push({ idx: cidx, label });
    } else if (label && /\d{4}/.test(label)) {
      periodCols.push({ idx: cidx, label });
    }
  });

  // Parse data rows
  const rows = [];
  for (let ridx = headerRowIdx + 1; ridx < allRows.length; ridx++) {
    const row = allRows[ridx] || [];
    const noVal = colNo !== null ? row[colNo] : null;
    if (noVal == null || String(noVal).trim() === '') continue;

    const projectNumber = parseInt(String(noVal).trim().replace(/\.$/, ''), 10);
    if (isNaN(projectNumber)) continue;

    const name = String(colName !== null && row[colName] != null ? row[colName] : '').trim();
    if (!name) continue;

    const approved     = colApproved !== null ? parseFloat_(row[colApproved]) : null;
    const balance      = colBalance  !== null ? parseFloat_(row[colBalance])  : null;
    const periodAmounts = {};
    for (const { idx, label } of periodCols) periodAmounts[label] = parseFloat_(row[idx]);

    rows.push({ projectNumber, projectName: name, approved, periodAmounts, balance });
  }

  return { rows, warnings };
}

// ============================================================
// EXCEL PARSING — Project file
// ============================================================
const SUMMARY_KEYWORDS = {
  'total of listed'    : 'totalListedInvoices',
  'payment request'    : 'paymentRequest',
  'paid in the previous': 'paidPreviousReport',
  'remaining budget'   : 'remainingBudget',
  'remaining'          : 'remainingBudget',
};

async function parseProject(file) {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array', cellText: false, cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const allRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });

  const data = {
    file,
    projectNumber : null,
    projectName   : file.name.replace(/\.[^.]+$/, ''),
    totalBudget   : null,
    invoices      : [],
    summary       : null,
    parseErrors   : [],
  };

  if (wb.SheetNames.length > 1) data.parseErrors.push('Multiple sheets; only the first sheet is parsed.');

  // Phase 1: project number and name (first 25 rows)
  for (const row of allRows.slice(0, 25)) {
    const cells = (row || []).filter(c => c != null);
    const text  = cells.join(' ');
    const m = text.match(/project\s*(?:no\.?|number|#)?\s*(\d+)/i);
    if (m && data.projectNumber === null) data.projectNumber = parseInt(m[1], 10);
    if (data.projectNumber !== null && data.projectName === file.name.replace(/\.[^.]+$/, '')) {
      for (const c of cells) {
        const cs = String(c).trim();
        if (cs.length > 4 && !/^[\d,.\s₪$€]+$/.test(cs) && !/project/i.test(cs)) {
          data.projectName = cs;
          break;
        }
      }
    }
  }

  // Phase 2: total budget
  for (const row of allRows) {
    const text = (row || []).map(c => String(c == null ? '' : c)).join(' ').toLowerCase();
    if (text.includes('total budget')) {
      const v = lastNumeric(row || []);
      if (v !== null) { data.totalBudget = v; break; }
    }
  }

  // Phase 3: invoice table label
  let invoicesLabelRow = null;
  for (let ridx = 0; ridx < allRows.length; ridx++) {
    const text = (allRows[ridx] || []).map(c => String(c == null ? '' : c)).join(' ').toLowerCase();
    if (text.includes('invoices table') || text.includes('invoice table')) {
      invoicesLabelRow = ridx;
      break;
    }
  }

  if (invoicesLabelRow === null) {
    data.parseErrors.push("Could not find 'Invoices table:' label. Invoice rows may be missed.");
  } else {
    // Column header row
    let colHeaderRow = null;
    for (let ridx = invoicesLabelRow + 1; ridx < Math.min(invoicesLabelRow + 5, allRows.length); ridx++) {
      if ((allRows[ridx] || []).some(c => c != null)) { colHeaderRow = ridx; break; }
    }

    let colRownum = null, colDesc = null, colInvnum = null, colSupplier = null;
    let colPayment = null, colRef = null, colTotal = null;

    if (colHeaderRow !== null) {
      (allRows[colHeaderRow] || []).forEach((cell, cidx) => {
        const cl = String(cell == null ? '' : cell).trim().toLowerCase();
        if      (/^row$|^#$|^no\.?$|row\s*#/.test(cl))                                        colRownum  = cidx;
        else if (cl.includes('description'))                                                    colDesc    = cidx;
        else if (cl.includes('invoice') && (cl.includes('number') || cl.includes('no') || colInvnum === null)) colInvnum = cidx;
        else if (cl.includes('supplier') || (cl.includes('name') && cl.includes('supplier'))) colSupplier = cidx;
        else if (cl.includes('payment') || cl.includes('date') || cl.includes('day'))          colPayment = cidx;
        else if (cl.includes('reference') || cl.startsWith('ref'))                             colRef     = cidx;
        else if (cl.includes('total') || cl.includes('amount'))                               colTotal   = cidx;
      });
    }

    // Phase 4: invoice data rows
    const firstDataRow = colHeaderRow !== null ? colHeaderRow + 1 : invoicesLabelRow + 2;
    let currentPeriod = '';
    let summaryStart  = null;

    for (let ridx = firstDataRow; ridx < allRows.length; ridx++) {
      const row = allRows[ridx] || [];
      const textLower = row.map(c => String(c == null ? '' : c)).join(' ').toLowerCase();

      if (Object.keys(SUMMARY_KEYWORDS).some(kw => textLower.includes(kw))) {
        summaryStart = ridx;
        break;
      }

      const colA = String(row[0] == null ? '' : row[0]).trim();
      if (colA && PERIOD_RE.test(colA)) currentPeriod = colA;
      if (!row.some(c => c != null)) continue;

      const totalVal = colTotal !== null ? parseFloat_(row[colTotal]) : null;
      let invRaw = colInvnum !== null ? String(row[colInvnum] == null ? '' : row[colInvnum]).trim() : '';
      if (/^invoice\s*n(umber|o\.?)?$/i.test(invRaw) || invRaw.toLowerCase() === 'none') invRaw = '';
      if (totalVal === null && invRaw === '') continue;

      let rn = null;
      if (colRownum !== null && row[colRownum] != null) {
        const parsed = parseInt(row[colRownum], 10);
        if (!isNaN(parsed)) rn = parsed;
      }

      data.invoices.push({
        rowNumber   : rn,
        description : colDesc     !== null ? String(row[colDesc]     == null ? '' : row[colDesc]).trim()     : '',
        invoiceNumber:invRaw,
        supplierName: colSupplier !== null ? String(row[colSupplier] == null ? '' : row[colSupplier]).trim() : '',
        paymentDay  : colPayment  !== null ? String(row[colPayment]  == null ? '' : row[colPayment]).trim()  : '',
        reference   : colRef      !== null ? String(row[colRef]      == null ? '' : row[colRef]).trim()      : '',
        total       : totalVal,
        periodLabel : currentPeriod,
      });
    }

    // Phase 5: summary section
    const summaryData = {
      totalListedInvoices: null,
      paymentRequest      : null,
      paidPreviousReport  : null,
      remainingBudget     : null,
    };
    const scanFrom = summaryStart !== null ? summaryStart : firstDataRow;
    for (const row of allRows.slice(scanFrom)) {
      const textLower = (row || []).map(c => String(c == null ? '' : c)).join(' ').toLowerCase();
      for (const [kw, field] of Object.entries(SUMMARY_KEYWORDS)) {
        if (textLower.includes(kw) && summaryData[field] === null) {
          const v = lastNumeric(row || []);
          if (v !== null) summaryData[field] = v;
        }
      }
    }
    data.summary = summaryData;
  }

  return data;
}

// ============================================================
// AUDIT CHECKS — Master arithmetic
// ============================================================
function checkMasterArithmetic(masterRows) {
  const checks = [];
  for (const mr of masterRows) {
    const pname = `[${mr.projectNumber}] ${mr.projectName}`;
    if (mr.approved === null) {
      checks.push({ checkName: 'balance_formula', projectName: pname, passed: false, expected: '\u2014', actual: '\u2014', detail: 'Approved amount missing' });
      continue;
    }
    const periodVals = Object.values(mr.periodAmounts).filter(v => v !== null);
    const periodSum  = periodVals.reduce((a, b) => a + b, 0);
    const expected   = mr.approved - periodSum;
    const actual     = mr.balance !== null ? mr.balance : 0;
    const passed     = Math.abs(actual - expected) <= TOLERANCE;
    checks.push({
      checkName  : 'balance_formula',
      projectName: pname,
      passed,
      expected   : fmt(expected),
      actual     : fmt(mr.balance),
      detail     : `Approved ${fmt(mr.approved)} \u2212 periods ${fmt(periodSum)} = ${fmt(expected)}`,
    });
  }
  return checks;
}

// ============================================================
// AUDIT CHECKS — Per-project math
// ============================================================
function checkProjectMath(project) {
  const checks = [];
  const pname  = project.projectName;
  const s      = project.summary;

  if (!s) {
    checks.push({ checkName: 'invoice_sum', projectName: pname, passed: false, expected: '\u2014', actual: '\u2014', detail: 'Summary section not found in file' });
    return checks;
  }

  // 1. Invoice rows sum == total listed invoices
  const invoiceSum = project.invoices
    .filter(inv => inv.total !== null)
    .reduce((a, inv) => a + inv.total, 0);

  if (s.totalListedInvoices !== null) {
    const passed = Math.abs(invoiceSum - s.totalListedInvoices) <= TOLERANCE;
    checks.push({
      checkName  : 'invoice_sum',
      projectName: pname,
      passed,
      expected   : fmt(s.totalListedInvoices),
      actual     : fmt(invoiceSum),
      detail     : `Sum of ${project.invoices.length} invoice row(s)`,
    });
  } else {
    checks.push({ checkName: 'invoice_sum', projectName: pname, passed: false, expected: '\u2014', actual: fmt(invoiceSum), detail: "'Total of listed invoices' cell not found" });
  }

  // 2. Budget equation
  const { paymentRequest, paidPreviousReport, remainingBudget } = s;
  if (paymentRequest !== null && paidPreviousReport !== null && remainingBudget !== null && project.totalBudget !== null) {
    const totalAccounted = paymentRequest + paidPreviousReport + remainingBudget;
    const passed = Math.abs(totalAccounted - project.totalBudget) <= TOLERANCE;
    checks.push({
      checkName  : 'budget_equation',
      projectName: pname,
      passed,
      expected   : fmt(project.totalBudget),
      actual     : fmt(totalAccounted),
      detail     : `Request ${fmt(paymentRequest)} + Prev ${fmt(paidPreviousReport)} + Remaining ${fmt(remainingBudget)} = ${fmt(totalAccounted)}`,
    });
  } else {
    const missing = [];
    if (paymentRequest   === null) missing.push('payment_request');
    if (paidPreviousReport=== null) missing.push('paid_previous_report');
    if (remainingBudget  === null) missing.push('remaining_budget');
    if (project.totalBudget === null) missing.push('total_budget');
    checks.push({ checkName: 'budget_equation', projectName: pname, passed: false, expected: '\u2014', actual: '\u2014', detail: `Missing values: ${missing.join(', ')}` });
  }

  return checks;
}

// ============================================================
// AUDIT CHECKS — Master vs project cross-check
// ============================================================
function checkMasterVsProject(masterRows, projects, targetPeriod) {
  const checks = [];
  const projByNumber = new Map(
    projects.filter(p => p.projectNumber !== null).map(p => [p.projectNumber, p])
  );

  for (const mr of masterRows) {
    const pname = `[${mr.projectNumber}] ${mr.projectName}`;

    let proj = projByNumber.get(mr.projectNumber) || null;
    if (!proj) {
      let bestP = null, bestR = 0;
      for (const p of projects) {
        const r = sequenceRatio(mr.projectName, p.projectName);
        if (r > bestR) { bestR = r; bestP = p; }
      }
      if (bestR >= FUZZY_NAME_THRESHOLD) { proj = bestP; }
      else {
        checks.push({ checkName: 'project_match', projectName: pname, passed: false, expected: '\u2014', actual: '\u2014', detail: `No matching project Excel found (best ratio ${bestR.toFixed(2)})` });
        continue;
      }
    }

    if (!proj.summary) {
      checks.push({ checkName: 'period_match', projectName: pname, passed: false, expected: '\u2014', actual: '\u2014', detail: 'Project summary not parsed' });
      continue;
    }

    let masterAmount = null, periodLabelUsed = '';

    if (targetPeriod) {
      const matchedHeader = bestPeriodMatch(targetPeriod, Object.keys(mr.periodAmounts));
      if (matchedHeader) {
        masterAmount    = mr.periodAmounts[matchedHeader];
        periodLabelUsed = matchedHeader;
      } else {
        checks.push({ checkName: 'period_match', projectName: pname, passed: false, expected: fmt(proj.summary.paymentRequest), actual: '\u2014', detail: `Period '${targetPeriod}' not found in master columns: ${Object.keys(mr.periodAmounts).join(', ')}` });
        continue;
      }
    } else {
      const entries = Object.entries(mr.periodAmounts);
      if (entries.length > 0) {
        [periodLabelUsed, masterAmount] = entries[entries.length - 1];
      } else {
        checks.push({ checkName: 'period_match', projectName: pname, passed: false, expected: '\u2014', actual: '\u2014', detail: 'No period columns in master' });
        continue;
      }
    }

    const projectRequest = proj.summary.paymentRequest;
    if (masterAmount === null || projectRequest === null) {
      checks.push({ checkName: 'period_match', projectName: pname, passed: false, expected: fmt(projectRequest), actual: fmt(masterAmount), detail: `Missing value (master col '${periodLabelUsed}')` });
      continue;
    }

    const passed = Math.abs(masterAmount - projectRequest) <= TOLERANCE;
    checks.push({
      checkName  : 'period_match',
      projectName: pname,
      passed,
      expected   : fmt(projectRequest),
      actual     : fmt(masterAmount),
      detail     : `Master col '${periodLabelUsed}' vs project payment request`,
    });
  }
  return checks;
}

// ============================================================
// OCR HELPERS
// ============================================================
function normalizeAmount(value) {
  const i = Math.round(value);
  return new Set([
    String(i),
    i.toLocaleString('en-US'),
    value.toFixed(2),
    value.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    String(i).replace(/,/g, '.'),
    String(i).replace(/[,.]/g, ''),
  ]);
}

function normalizeInvoiceNumber(inv) {
  const stripped   = inv.trim();
  const digitsOnly = stripped.replace(/\D/g, '');
  const candidates = [stripped, stripped.toUpperCase()];
  if (digitsOnly) {
    candidates.push(digitsOnly);
    candidates.push(digitsOnly.replace(/^0+/, '') || digitsOnly);
  }
  candidates.push(stripped.replace(/\s/g, '-'));
  candidates.push(stripped.replace(/-/g, ' '));
  return [...new Set(candidates.filter(Boolean))];
}

function checkInvoicesInPdf(project, pdfText) {
  const checks = [];
  const pname  = project.projectName;

  if (pdfText.trim().length < MIN_OCR_TEXT_LEN) {
    checks.push({
      checkName: 'ocr_quality', projectName: pname, passed: false,
      expected: 'readable text', actual: `${pdfText.trim().length} chars`,
      detail: 'OCR extracted very little text \u2014 scan quality may be too low',
    });
    return checks;
  }

  for (const inv of project.invoices) {
    if (!inv.invoiceNumber) continue;

    const candidates = normalizeInvoiceNumber(inv.invoiceNumber);
    let matchPos = -1;
    for (const cand of candidates) {
      const pos = pdfText.toLowerCase().indexOf(cand.toLowerCase());
      if (pos !== -1) { matchPos = pos; break; }
    }

    const numberFound = matchPos !== -1;
    const label = `Inv #${inv.invoiceNumber} (${inv.supplierName || 'unknown supplier'})`;

    checks.push({
      checkName  : 'invoice_number_in_pdf',
      projectName: pname,
      passed     : numberFound,
      expected   : inv.invoiceNumber,
      actual     : numberFound ? 'found' : 'not found',
      detail     : label,
    });

    if (!numberFound || inv.total === null) continue;

    const windowStart = Math.max(0, matchPos - 500);
    const windowEnd   = Math.min(pdfText.length, matchPos + 500);
    const window      = pdfText.slice(windowStart, windowEnd);

    const targetVariants = normalizeAmount(inv.total);
    const tokens = window.match(/[\d,.\s]+/g) || [];
    let amountFound = false;
    for (const token of tokens) {
      const tc      = token.replace(/\s/g, '');
      const tcPlain = tc.replace(/[,.]/g, '');
      if (targetVariants.has(tc) || targetVariants.has(tcPlain)) { amountFound = true; break; }
    }

    checks.push({
      checkName  : 'invoice_amount_in_pdf',
      projectName: pname,
      passed     : amountFound,
      expected   : fmt(inv.total),
      actual     : amountFound ? 'confirmed' : 'not confirmed',
      detail     : `${label} \u2014 amount ${fmt(inv.total)}`,
    });
  }

  return checks;
}

// ============================================================
// PDF TEXT EXTRACTION + OCR
// ============================================================
async function extractPdfText(file, onProgress) {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    if (onProgress) onProgress(`  Page ${pageNum}/${pdf.numPages}…`);

    const page = await pdf.getPage(pageNum);

    // Try embedded text layer first (fast, no OCR needed)
    const textContent = await page.getTextContent();
    const layerText   = textContent.items.map(item => item.str).join(' ');

    if (layerText.trim().length >= MIN_OCR_TEXT_LEN) {
      fullText += layerText + '\n--- PAGE BREAK ---\n';
    } else {
      // Render page to canvas → OCR
      const viewport = page.getViewport({ scale: OCR_SCALE });
      const canvas   = document.createElement('canvas');
      canvas.width   = viewport.width;
      canvas.height  = viewport.height;
      const ctx      = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      try {
        const worker = await getTesseractWorker();
        const { data: { text } } = await worker.recognize(canvas);
        fullText += text + '\n--- PAGE BREAK ---\n';
      } catch (err) {
        log(`WARN: OCR failed on page ${pageNum}: ${err.message}`);
      }
    }
  }

  return fullText;
}

// ============================================================
// UI HELPERS
// ============================================================
function log(msg) {
  const logEl = document.getElementById('log');
  if (logEl) {
    const line = document.createElement('div');
    line.textContent = msg;
    if (msg.includes('WARN') || msg.includes('ERROR')) line.className = 'log-warn';
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }
  console.log(msg);
}

function setProgress(pct, label) {
  const bar      = document.getElementById('progress-bar');
  const labelEl  = document.getElementById('progress-label');
  const ariaEl   = document.getElementById('progress-aria');
  if (bar)    bar.style.width = `${Math.min(100, pct)}%`;
  if (labelEl) labelEl.textContent = label;
  if (ariaEl)  ariaEl.setAttribute('aria-valuenow', Math.round(pct));
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// RESULTS RENDERING
// ============================================================
function buildCheckTable(checks, sectionTitle) {
  if (!checks || checks.length === 0) return '';
  const passCount = checks.filter(c => c.passed).length;
  const failCount = checks.length - passCount;

  const rows = checks.map(c => `
    <tr class="${c.passed ? 'pass-row' : 'fail-row'}">
      <td>${escHtml(c.projectName)}</td>
      <td>${escHtml(c.checkName)}</td>
      <td class="status-cell ${c.passed ? 'pass' : 'fail'}">${c.passed ? 'PASS' : 'FAIL'}</td>
      <td>${escHtml(c.expected)}</td>
      <td>${escHtml(c.actual)}</td>
      <td>${escHtml(c.detail)}</td>
    </tr>`).join('');

  return `
  <div class="section">
    <h2>${escHtml(sectionTitle)}
      <span class="badge pass-badge">${passCount} passed</span>
      ${failCount > 0 ? `<span class="badge fail-badge">${failCount} failed</span>` : ''}
    </h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Check</th>
            <th>Status</th>
            <th>Expected</th>
            <th>Actual</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

function renderResults(report) {
  const total  = report.all.length;
  const passed = report.all.filter(c => c.passed).length;
  const failed = total - passed;
  const rate   = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

  const summaryHtml = `
  <div class="card">
    <h2 class="card-title">Audit Results</h2>
    <div class="summary-card ${failed === 0 ? 'all-pass' : 'has-fail'}">
      <div class="summary-item">
        <div class="summary-num">${total}</div>
        <div>Total Checks</div>
      </div>
      <div class="summary-item">
        <div class="summary-num pass-num">${passed}</div>
        <div>Passed</div>
      </div>
      <div class="summary-item">
        <div class="summary-num fail-num">${failed}</div>
        <div>Failed</div>
      </div>
      <div class="summary-item">
        <div class="summary-num">${rate}%</div>
        <div>Pass Rate</div>
      </div>
    </div>
    ${buildCheckTable(report.masterArithmetic, '1. Master File Balance Arithmetic')}
    ${buildCheckTable(report.masterVsProject,  '2. Master File vs. Project Files (Period Cross-Check)')}
    ${buildCheckTable(report.projectMath,      '3. Per-Project Math Checks')}
    ${buildCheckTable(report.invoiceOcr,       '4. Invoice PDF Verification (OCR)')}
    ${total === 0 ? '<p style="color:var(--warn-color);padding:12px 0">No checks were run. Check that your files are correctly formatted.</p>' : ''}
  </div>`;

  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = summaryHtml;
  resultsEl.classList.remove('hidden');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// MAIN AUDIT RUNNER
// ============================================================
async function runAudit() {
  const fileInput  = document.getElementById('file-input');
  const periodInput = document.getElementById('period-input');
  const files  = Array.from(fileInput.files);
  const period = periodInput.value.trim() || null;

  if (files.length === 0) {
    alert('Please select at least one file before running the audit.');
    return;
  }

  // Reset UI
  document.getElementById('progress-section').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
  document.getElementById('log').innerHTML = '';
  setProgress(0, 'Discovering files…');

  const btn = document.getElementById('run-btn');
  btn.disabled = true;
  btn.textContent = '⏳ Running…';

  try {
    // ── Discover ──────────────────────────────────────────────
    const { master, projects: projectFiles, pdfs: pdfFiles } = discoverFiles(files);
    log(`Files: ${master ? master.name : 'no master'} | ${projectFiles.length} project(s) | ${pdfFiles.length} PDF(s)`);
    if (period) log(`Period filter: "${period}"`);

    const pdfMap = matchPdfToExcel(projectFiles, pdfFiles);
    setProgress(5, 'Parsing master file…');

    // ── Parse master ──────────────────────────────────────────
    let masterRows = [];
    if (master) {
      log(`Parsing master: ${master.name}`);
      const { rows, warnings } = await parseMaster(master);
      masterRows = rows;
      for (const w of warnings) log(`WARN: ${w}`);
      log(`  → ${masterRows.length} project row(s) found`);
    }

    setProgress(15, 'Parsing project files…');

    // ── Parse projects ────────────────────────────────────────
    const projects = [];
    for (let i = 0; i < projectFiles.length; i++) {
      const pf = projectFiles[i];
      log(`Parsing project: ${pf.name}`);
      const p = await parseProject(pf);
      projects.push(p);
      for (const e of p.parseErrors) log(`WARN: ${e}`);
      log(`  → '${p.projectName}' | budget=${fmt(p.totalBudget)} | ${p.invoices.length} invoice(s)`);
      setProgress(15 + ((i + 1) / Math.max(projectFiles.length, 1)) * 20, `Parsing projects (${i + 1}/${projectFiles.length})…`);
    }

    setProgress(35, 'Running arithmetic checks…');

    // ── Audit checks ──────────────────────────────────────────
    const report = {
      masterArithmetic: [],
      masterVsProject : [],
      projectMath     : [],
      invoiceOcr      : [],
      get all() {
        return [
          ...this.masterArithmetic,
          ...this.masterVsProject,
          ...this.projectMath,
          ...this.invoiceOcr,
        ];
      },
    };

    if (masterRows.length > 0) {
      log('Running master arithmetic checks…');
      report.masterArithmetic = checkMasterArithmetic(masterRows);
      log('Running master vs. project cross-checks…');
      report.masterVsProject  = checkMasterVsProject(masterRows, projects, period);
    }

    setProgress(45, 'Running project math checks…');
    log('Running per-project math checks…');
    for (const p of projects) {
      report.projectMath.push(...checkProjectMath(p));
    }

    setProgress(50, 'Running OCR verification (may take a moment)…');
    log('Running invoice PDF verification…');

    for (let i = 0; i < projects.length; i++) {
      const p       = projects[i];
      const pdfFile = pdfMap.get(projectFiles[i]);
      if (pdfFile) {
        log(`OCR: ${pdfFile.name}`);
        const pdfText = await extractPdfText(pdfFile, msg => {
          setProgress(50 + (i / Math.max(projects.length, 1)) * 45, `OCR: ${pdfFile.name} ${msg}`);
          log(msg);
        });
        report.invoiceOcr.push(...checkInvoicesInPdf(p, pdfText));
      } else {
        report.invoiceOcr.push({
          checkName  : 'pdf_match',
          projectName: p.projectName,
          passed     : false,
          expected   : 'PDF file',
          actual     : 'not found',
          detail     : 'No matching PDF; OCR checks skipped',
        });
      }
      setProgress(50 + ((i + 1) / Math.max(projects.length, 1)) * 45, `PDF verification (${i + 1}/${projects.length})…`);
    }

    setProgress(100, 'Done!');

    const total  = report.all.length;
    const passed = report.all.filter(c => c.passed).length;
    log(`\nResult: ${passed}/${total} checks passed | ${total - passed} failed`);

    renderResults(report);

  } catch (err) {
    log(`ERROR: ${err.message}`);
    console.error(err);
    setProgress(0, 'An error occurred — see log above.');
  } finally {
    btn.disabled    = false;
    btn.textContent = '▶ Run Audit';
    await terminateTesseract();
  }
}

// ============================================================
// UI INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Set PDF.js worker from CDN
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const dropZone  = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const fileList  = document.getElementById('file-list');

  // ── Drag-and-drop ──────────────────────────────────────────
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const dt = new DataTransfer();
    for (const f of e.dataTransfer.files) dt.items.add(f);
    fileInput.files = dt.files;
    updateFileList();
  });

  // Click on drop zone opens picker
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });
  fileInput.addEventListener('change', updateFileList);

  // ── Run button ─────────────────────────────────────────────
  document.getElementById('run-btn').addEventListener('click', runAudit);

  // ── File list display ──────────────────────────────────────
  function updateFileList() {
    const files = Array.from(fileInput.files);
    if (files.length === 0) { fileList.innerHTML = ''; return; }
    fileList.innerHTML = files.map(f => {
      const isPdf    = f.name.toLowerCase().endsWith('.pdf');
      const isMaster = /master|summary/i.test(f.name.replace(/\.[^.]+$/, ''));
      const icon     = isPdf ? '📄' : '📊';
      const sizeKB   = (f.size / 1024).toFixed(0);
      return `<div class="file-item ${isMaster ? 'file-master' : ''}">
        ${icon} ${escHtml(f.name)}
        <span class="file-size">(${sizeKB} KB)</span>
        ${isMaster ? '<span class="master-badge">MASTER</span>' : ''}
      </div>`;
    }).join('');
  }
});
