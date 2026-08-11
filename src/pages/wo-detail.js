// src/pages/wo-detail.js
import '../main.js'
import { Offcanvas, Modal } from 'bootstrap'
import JsBarcode from 'jsbarcode'
import { isAuthed, getSelectedWO, getWorkOrder, getRouting, saveRouting, addLog, getOperations, saveOperations, updateWorkOrderStatus, getScopeRevisions, addScopeRevision, buildRevision, getCurrentUser, setCurrentUser, getUserDepartment } from '../data/store.js'

// DOM Elements
const headerEl = document.getElementById('woHeaderCard')
const operationsView = document.getElementById('operationsView')
const panelEl = document.getElementById('actionPanel')
const offcanvas = new Offcanvas(panelEl)
panelEl.addEventListener('hidden.bs.offcanvas', () => {
  document.getElementById('panelTitle').textContent = 'Routing Action'
  document.getElementById('panelSubtitle').textContent = 'Manage operation sequence details'
})
const form = document.getElementById('routingForm')
const btnSave = document.getElementById('btnSave')
const saveSpinner = document.getElementById('saveSpinner')
const validationError = document.getElementById('validationError')
const validationSuccess = document.getElementById('validationSuccess')
const processStatus = document.getElementById('processStatus')
const processText = document.getElementById('processText')
const processBar = document.getElementById('processBar')
const processSpinner = document.getElementById('processSpinner')
const validationToast = document.getElementById('validationToast')
const toastTitle = document.getElementById('toastTitle')
const toastMsg = document.getElementById('toastMsg')
const toastClose = document.getElementById('toastClose')
const hasResourceSequenceBarcodeInput = document.getElementById('f_hasSequenceBarcode')
const resourceSequenceBarcodeWrap = document.getElementById('f_sequenceBarcodeWrap')
const resourceSequenceBarcodeInput = document.getElementById('f_sequenceBarcode')

// State
let currentAction = 'Add'
let editingRow = null
let routingData = []
let woId = null
let prevScopeData = { scope: '', scopeFull: '' }
let currentRevisionSeq = null

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  if (!isAuthed()) {
    window.location.href = '/login.html'
    return
  }

  // Set the current logged-in user for revision tracking (prototype uses the
  // admin shown in the sidebar; can be wired to the real auth account later).
  setCurrentUser('Andi Pratama')

  woId = getSelectedWO()
  if (!woId) {
    headerEl.innerHTML = `
      <div class="alert alert-warning mb-0">
        <i class="bi bi-exclamation-triangle"></i> No work order selected.
        <a href="/dashboard.html" class="alert-link">Go back to dashboard</a>
      </div>
    `
    return
  }

  await loadWorkOrder(woId)
  await loadRouting(woId)
  await loadOperationList(woId)
})

// Load Work Order Header
async function loadWorkOrder(woId) {
  try {
    const wo = await getWorkOrder(woId)
    if (!wo) {
      headerEl.innerHTML = `
        <div class="alert alert-danger mb-0">
          <i class="bi bi-exclamation-circle"></i> Work order not found
        </div>
      `
      return
    }

    // Compute progress & active operation from operations
    const ops = getOperations(woId) || []
    const completed = ops.filter(o => o.status === 'Completed').length
    const total = ops.length
    const pct = total ? Math.round((completed / total) * 100) : 0
    const activeOp = ops.find(o => o.status !== 'Completed') || null
    const barcodeBlocks = [
      { label: 'Job No', value: getJobNoBarcodeValue(wo) },
      { label: 'Assembly', value: getAssemblyBarcodeValue(wo) },
    ]
      .filter(barcode => !!barcode.value)
      .map(barcode => `
        <div>
          <div class="small text-muted">${barcode.label} Barcode</div>
          ${buildBarcodeMarkup(barcode.value)}
        </div>
      `)
      .join('')

    headerEl.innerHTML = `
      <div class="wo-header-top row align-items-center g-3">
        <div class="col">
          <div class="d-flex align-items-center gap-3">
            <div class="header-icon">
              <i class="bi bi-file-text fs-4"></i>
            </div>
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <h4 class="fw-bold mb-0">${wo.woNumber || wo.id || woId}</h4>
                <span class="badge bg-${pct === 100 ? 'success' : 'primary'}">${pct === 100 ? 'Complete' : 'In Progress'}</span>
              </div>
              ${activeOp
                ? `<span class="small text-muted">Current: OP ${activeOp.opNo} · ${activeOp.name}</span>`
                : `<span class="small text-success fw-medium"><i class="bi bi-check-circle me-1"></i>All operations completed</span>`}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <div class="d-flex gap-3 flex-wrap">
            ${barcodeBlocks}
            <div class="header-info-chip">
              <span class="info-label">Quantity</span>
              <span class="info-value">${wo.qty ?? '-'}</span>
            </div>
            <div class="header-info-chip">
              <span class="info-label">Sales Order</span>
              <span class="info-value">${wo.salesOrder || '-'}</span>
            </div>
            <div class="header-info-chip">
              <span class="info-label">Revision</span>
              <span class="info-value">${wo.revision || '-'}</span>
            </div>
            <div class="header-info-chip">
              <span class="info-label">UOM</span>
              <span class="info-value">${wo.uom || '-'}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="wo-header-meta">
        <div class="row align-items-center g-3">
          <div class="col-12 col-md-7">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="small text-muted fw-semibold text-uppercase ls-1">Overall Progress</span>
              <span class="small fw-bold text-primary-dark">${pct}% · ${completed}/${total} operations</span>
            </div>
            <div class="progress wo-progress" style="height:8px;">
              <div class="progress-bar ${pct === 100 ? 'bg-success' : 'bg-primary'}" style="width:${pct}%"></div>
            </div>
          </div>
        </div>
      </div>
    `
    renderGeneratedBarcodes(headerEl)
  } catch (error) {
    console.error('Error loading work order:', error)
    headerEl.innerHTML = `
      <div class="alert alert-danger mb-0">
        <i class="bi bi-exclamation-circle"></i> Error loading work order details
      </div>
    `
  }
}

// Load Routing Data (stored for the merged Operations view)
async function loadRouting(id) {
  try {
    const data = await getRouting(id)
    routingData = data || []
  } catch (error) {
    console.error('Error loading routing:', error)
  }
}

// Returns the scope text for display: prefer the full description,
// fall back to the short scope when scopeFull is not provided.
function getScopeText(short, full) {
  if (full && full.trim()) return full.trim()
  return short || '-'
}

function normalizeBarcodeValue(value) {
  return String(value || '').trim()
}

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildBarcodeMarkup(encodedValue) {
  const value = normalizeBarcodeValue(encodedValue)
  if (!value) return '-'
  return `
    <div class="barcode-cell">
      <svg class="real-barcode" data-barcode-value="${escapeHtmlAttr(value)}" role="img" aria-label="Barcode ${escapeHtmlAttr(value)}"></svg>
      <div class="barcode-human">${value}</div>
    </div>
  `
}

function renderGeneratedBarcodes(root) {
  if (!root) return
  root.querySelectorAll('svg.real-barcode').forEach(svg => {
    const encodedValue = normalizeBarcodeValue(svg.dataset.barcodeValue)
    if (!encodedValue) return

    try {
      JsBarcode(svg, encodedValue, {
        format: 'CODE128',
        lineColor: '#111827',
        width: 1.6,
        height: 46,
        margin: 0,
        displayValue: false,
        background: 'transparent',
      })
    } catch (error) {
      console.error(`Failed to render barcode: ${encodedValue}`, error)
      svg.replaceWith(document.createTextNode(encodedValue))
    }
  })
}

function getBarcodeMetadata(entity, fallbackType = '') {
  const raw = entity?.barcode
  if (raw && typeof raw === 'object') {
    const value = normalizeBarcodeValue(raw.value)
    const type = String(raw.type || fallbackType || '').toUpperCase()
    return { exists: raw.exists === true && !!value, type, value }
  }

  // Legacy frontend prototype compatibility (before barcode metadata shape).
  if (fallbackType === 'RESOURCE_SEQUENCE') {
    const legacyValue = normalizeBarcodeValue(entity?.sequenceBarcode)
    return { exists: !!legacyValue, type: 'RESOURCE_SEQUENCE', value: legacyValue }
  }

  return { exists: false, type: String(fallbackType || '').toUpperCase(), value: '' }
}

function getResourceSequenceBarcode(seq) {
  return getBarcodeMetadata(seq, 'RESOURCE_SEQUENCE')
}

function getJobNoBarcodeValue(wo) {
  return normalizeBarcodeValue(wo?.jobNo || wo?.woNumber || wo?.id)
}

function getAssemblyBarcodeValue(wo) {
  return normalizeBarcodeValue(wo?.assembly?.code)
}

function getOperationBarcodeValue(op) {
  const opBarcode = getBarcodeMetadata(op, 'OPERATION')
  if (!opBarcode.exists) return ''
  return normalizeBarcodeValue(op.opNo || opBarcode.value)
}

function syncResourceSequenceBarcodeField() {
  if (!hasResourceSequenceBarcodeInput || !resourceSequenceBarcodeWrap || !resourceSequenceBarcodeInput) return
  const enabled = hasResourceSequenceBarcodeInput.checked
  resourceSequenceBarcodeWrap.classList.toggle('d-none', !enabled)
  resourceSequenceBarcodeInput.disabled = !enabled
}

// ====================== ROUTING SEQUENCE MAPPING ======================
// Attach routing sequences to Operation List records by matching the routing
// operation's description against the operations-list operation's name.
// Routing sequences that cannot be confidently matched are kept visible under
// an "Unassigned" group so no routing data is lost.
// NOTE: This mapping is intentionally isolated so it can be replaced with a
// direct ID-based link once the operation numbering is aligned between the
// routing and operations data sources.
function mapRoutingToOperations(ops, routing) {
  const normalized = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const mapped = ops.map(op => ({ ...op, sequences: [], matched: false }))

  ;(routing || []).forEach(rOp => {
    const rName = normalized(rOp.description || rOp.opNo || '')
    let target = null
    if (rName) {
      target = mapped.find(op => normalized(op.name) === rName) ||
               mapped.find(op => normalized(op.name).includes(rName) || rName.includes(normalized(op.name)))
    }
    ;(rOp.sequences || []).forEach((seq, sIdx) => {
      const seqEntry = { ...seq, routingOpNo: rOp.opNo || '', routingOpIndex: routing.indexOf(rOp), rSeqIndex: sIdx }
      if (target) {
        target.sequences.push(seqEntry)
        target.matched = true
      } else {
        unmappedSequences.push(seqEntry)
      }
    })
  })

  return mapped
}

// Unmatched sequences that could not be attached to any operation.
let unmappedSequences = []

// ====================== SCOPE REVISION HISTORY ======================
const revisionHistoryModalEl = document.getElementById('revisionHistoryModal')
const revisionHistoryModal = revisionHistoryModalEl ? new Modal(revisionHistoryModalEl) : null
const revisionDetailModalEl = document.getElementById('revisionDetailModal')
const revisionDetailModal = revisionDetailModalEl ? new Modal(revisionDetailModalEl) : null
const revisionContext = document.getElementById('revisionContext')
const revisionHistoryBody = document.getElementById('revisionHistoryBody')
const revisionDetailTitle = document.getElementById('revisionDetailTitle')
const revisionDetailBody = document.getElementById('revisionDetailBody')

// Open revision history modal for a specific sequence
function openRevisionHistory(opIdx, seqIdx) {
  const op = routingData[opIdx]
  if (!op) return
  const seq = (op.sequences || [])[seqIdx]
  if (!seq) return
  currentRevisionSeq = { opIdx, seqIdx }

  const revs = getScopeRevisions(woId)
    .filter(r => String(r.opNo) === String(op.opNo) && String(r.seqNo) === String(seq.seqNo))
    .sort((a, b) => parseInt((b.revisionNo||'').match(/\d+/)?.[1]||0) - parseInt((a.revisionNo||'').match(/\d+/)?.[1]||0))

  revisionContext.innerHTML = `
    <div class="revision-context-chip">OP ${op.opNo || ''} · Sequence ${seq.seqNo || ''}</div>
    <span class="text-muted small">Scope Revision History for this sequence</span>
  `

  if (!revs.length) {
    revisionHistoryBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-4">
          <i class="bi bi-inbox"></i> No revision history found.
        </td>
      </tr>
    `
  } else {
    revisionHistoryBody.innerHTML = revs.map((r, i) => `
      <tr>
        <td><span class="rev-badge">${r.revisionNo || '-'}</span></td>
        <td class="text-muted">${r.dateTime || '-'}</td>
        <td>${r.editedBy || '-'}</td>
        <td>${r.summary || '-'}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" data-view-rev="${i}">
            <i class="bi bi-eye"></i> View
          </button>
        </td>
      </tr>
    `).join('')
  }

  revisionHistoryBody.querySelectorAll('[data-view-rev]').forEach(btn => {
    btn.addEventListener('click', () => {
      const rev = revs[parseInt(btn.dataset.viewRev)]
      openRevisionDetail(rev)
    })
  })

  if (revisionHistoryModal) revisionHistoryModal.show()
}

// Open revision detail modal
function openRevisionDetail(rev) {
  if (!rev) return
  revisionDetailTitle.textContent = `${rev.revisionNo || 'Revision'} · OP ${rev.opNo || ''} Sequence ${rev.seqNo || ''}`
  revisionDetailBody.innerHTML = `
    <div class="revision-meta">
      <div class="info-field">
        <div class="info-label">Edited by</div>
        <div class="info-value">${rev.editedBy || '-'}</div>
      </div>
      <div class="info-field">
        <div class="info-label">Date</div>
        <div class="info-value">${rev.dateTime || '-'}</div>
      </div>
      <div class="info-field">
        <div class="info-label">Operation</div>
        <div class="info-value">OP ${rev.opNo || '-'} Sequence ${rev.seqNo || '-'}</div>
      </div>
      <div class="info-field">
        <div class="info-label">Change Summary</div>
        <div class="info-value">${rev.summary || '-'}</div>
      </div>
    </div>

    <div class="rev-compare-grid">
      <div class="rev-panel rev-prev">
        <div class="rev-panel-title"><i class="bi bi-arrow-left-circle"></i> Previous Scope</div>
        <div class="rev-scope-text">${escapeHtml(rev.prevScopeFull || rev.prevScope || '—')}</div>
      </div>
      <div class="rev-panel rev-new">
        <div class="rev-panel-title"><i class="bi bi-arrow-right-circle"></i> Updated Scope</div>
        <div class="rev-scope-text">${escapeHtml(rev.newScopeFull || rev.newScope || '—')}</div>
      </div>
    </div>

    <div class="rev-diff-block">
      <div class="rev-diff-title"><i class="bi bi-diagram-3"></i> Change Comparison</div>
      ${buildComparison(rev.prevScopeFull || rev.prevScope || '', rev.newScopeFull || rev.newScope || '')}
    </div>
  `
  if (revisionDetailModal) revisionDetailModal.show()
}

// Escape HTML to avoid injection
function escapeHtml(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}

// Build a sentence/line-level comparison between previous and updated scope
function buildComparison(prev, next) {
  if (!prev && !next) return '<div class="text-muted small">No changes.</div>'
  const prevParts = splitScope(prev)
  const nextParts = splitScope(next)
  const rows = []
  const max = Math.max(prevParts.length, nextParts.length)
  for (let i = 0; i < max; i++) {
    const p = (prevParts[i] || '').trim()
    const n = (nextParts[i] || '').trim()
    if (p && n) {
      if (p === n) {
        rows.push(`<div class="rev-diff-row diff-unchanged"><span class="diff-status"><i class="bi bi-dash"></i></span><span>${escapeHtml(n)}</span></div>`)
      } else {
        rows.push(`<div class="rev-diff-row diff-removed"><span class="diff-status"><i class="bi bi-x-lg"></i></span><span>${escapeHtml(p)}</span></div>`)
        rows.push(`<div class="rev-diff-row diff-added"><span class="diff-status"><i class="bi bi-plus-lg"></i></span><span>${escapeHtml(n)}</span></div>`)
      }
    } else if (p) {
      rows.push(`<div class="rev-diff-row diff-removed"><span class="diff-status"><i class="bi bi-x-lg"></i></span><span>${escapeHtml(p)}</span></div>`)
    } else if (n) {
      rows.push(`<div class="rev-diff-row diff-added"><span class="diff-status"><i class="bi bi-plus-lg"></i></span><span>${escapeHtml(n)}</span></div>`)
    }
  }
  return rows.join('')
}

// Split scope text into sentences/lines for comparison
function splitScope(text) {
  if (!text) return []
  return text.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean)
}

// Auto-generate a concise change summary from the previous vs updated scope.
function buildChangeSummary(prevFull, prevShort, newFull, newShort) {
  const prev = (prevFull && prevFull.trim()) || (prevShort && prevShort.trim()) || ''
  const next = (newFull && newFull.trim()) || (newShort && newShort.trim()) || ''
  if (prev === next) return 'Scope updated'
  // If the previous scope was empty, treat as scope added
  if (!prev) return 'Scope added'
  // If the new scope is empty, treat as scope removed
  if (!next) return 'Scope removed'
  // Find the first differing sentence to describe the change
  const prevParts = splitScope(prev)
  const nextParts = splitScope(next)
  for (let i = 0; i < nextParts.length; i++) {
    if (prevParts[i] !== nextParts[i]) {
      const nextSentence = nextParts[i] || ''
      const words = nextSentence.replace(/[.!?]$/, '').split(/\s+/)
      const key = words.slice(0, 6).join(' ')
      return `Updated ${key}`
    }
  }
  return 'Scope updated'
}

// Handle Action Click (Edit/Delete a sequence within an operation)
function handleActionClick(action, opIdx, seqIdx) {
  const op = routingData[opIdx]
  if (!op) return
  const item = seqIdx >= 0 ? (op.sequences || [])[seqIdx] : null

  currentAction = action
  editingRow = { opIdx, seqIdx }

  // Reset delete warning
  const deleteWarning = document.getElementById('deleteWarning')
  if (deleteWarning) deleteWarning.style.display = 'none'

  if (action === 'edit') {
    // Capture the previous scope values so we can store them in a revision
    prevScopeData = {
      scope: item ? (item.scope || '') : '',
      scopeFull: item ? (item.scopeFull || '') : '',
    }
    document.getElementById('f_opNo').value = op.opNo || ''
    document.getElementById('f_description').value = op.description || ''
    document.getElementById('f_seqNo').value = item ? item.seqNo : ''
    document.getElementById('f_scope').value = item ? item.scope : ''
    document.getElementById('f_scopeFull').value = item ? item.scopeFull : ''
    document.getElementById('f_opCode').value = item ? (item.opCode || item.machine || '') : ''
    document.getElementById('f_status').value = item ? (item.status || 'Pending') : 'Pending'
    document.getElementById('f_department').value = item ? item.department : ''
    document.getElementById('f_workingOn').value = item ? item.workingOn : ''
    document.getElementById('f_lastEdited').value = item ? (item.lastEditedBy || item.lastEdited || '') : ''
    document.getElementById('f_iar').value = item ? (item.iar || '') : ''
    document.getElementById('f_qualityOrder').value = item ? (item.qualityOrder || '') : ''
    document.getElementById('f_qtyAccepted').value = item ? (item.qtyAccepted ?? '') : ''
    document.getElementById('f_qtyScrapped').value = item ? (item.qtyScrapped ?? '') : ''
    const sequenceBarcode = getResourceSequenceBarcode(item)
    if (hasResourceSequenceBarcodeInput) hasResourceSequenceBarcodeInput.checked = sequenceBarcode.exists
    if (resourceSequenceBarcodeInput) resourceSequenceBarcodeInput.value = sequenceBarcode.value
    syncResourceSequenceBarcodeField()
    document.getElementById('panelTitle').textContent = `Edit Sequence ${item ? item.seqNo : ''}`
    document.getElementById('panelSubtitle').textContent = 'Modify sequence details and scope'

    // Permission: only ME department users can edit scope
    const userDept = getUserDepartment(getCurrentUser())
    const canEditScope = userDept === 'ME'
    const scopeFields = ['f_scope', 'f_scopeFull']
    scopeFields.forEach(id => {
      const el = document.getElementById(id)
      if (el) el.disabled = !canEditScope
    })
    if (!canEditScope) {
      document.getElementById('panelTitle').textContent = `View Sequence ${item ? item.seqNo : ''} (${userDept} - Read Only)`
      document.getElementById('panelSubtitle').textContent = 'Read-only view - limited permissions'
    }

    btnSave.textContent = canEditScope ? 'Save' : 'Close'
    btnSave.style.display = 'block'
    if (!canEditScope) {
      form.querySelectorAll('input, select, textarea').forEach(f => { f.disabled = true })
      btnSave.disabled = false
      btnSave.type = 'button'
      btnSave.onclick = () => offcanvas.hide()
    } else {
      form.querySelectorAll('input, select, textarea').forEach(f => { f.disabled = false })
      btnSave.disabled = false
      btnSave.type = 'submit'
      btnSave.onclick = null
    }
  } else if (action === 'closingStamp') {
    document.getElementById('panelTitle').textContent = `Closing Stamp · Sequence ${item ? item.seqNo : ''}`
    document.getElementById('panelSubtitle').textContent = 'Formal completion certification'
    document.getElementById('f_opNo').value = op.opNo || ''
    document.getElementById('f_description').value = op.description || ''
    document.getElementById('f_seqNo').value = item ? item.seqNo : ''
    document.getElementById('f_scope').value = item ? item.scope : ''
    document.getElementById('f_scopeFull').value = item ? item.scopeFull : ''
    document.getElementById('f_opCode').value = item ? (item.opCode || item.machine || '') : ''
    document.getElementById('f_status').value = item ? (item.status || 'Pending') : 'Pending'
    document.getElementById('f_department').value = item ? item.department : ''
    document.getElementById('f_workingOn').value = item ? item.workingOn : ''
    document.getElementById('f_lastEdited').value = item ? (item.lastEditedBy || item.lastEdited || '') : ''
    const sequenceBarcode = getResourceSequenceBarcode(item)
    if (hasResourceSequenceBarcodeInput) hasResourceSequenceBarcodeInput.checked = sequenceBarcode.exists
    if (resourceSequenceBarcodeInput) resourceSequenceBarcodeInput.value = sequenceBarcode.value
    syncResourceSequenceBarcodeField()
    form.querySelectorAll('input, select, textarea').forEach(f => { f.disabled = true })
    btnSave.textContent = 'Apply Closing Stamp'
    btnSave.style.display = 'block'
    btnSave.disabled = false
    btnSave.type = 'button'
    btnSave.onclick = () => applyClosingStamp(opIdx, seqIdx)
  } else if (action === 'delete') {
    document.getElementById('panelTitle').textContent = 'Delete Sequence'
    document.getElementById('panelSubtitle').textContent = 'Confirm deletion'
    if (!deleteWarning) {
      const warning = document.createElement('div')
      warning.id = 'deleteWarning'
      warning.className = 'alert alert-danger'
      warning.innerHTML = `
        <i class="bi bi-exclamation-triangle"></i>
        Are you sure you want to delete sequence "${item ? item.seqNo : ''}"? This action cannot be undone.
      `
      form.insertBefore(warning, form.querySelector('#validationError'))
    } else {
      deleteWarning.style.display = 'block'
      deleteWarning.innerHTML = `
        <i class="bi bi-exclamation-triangle"></i>
        Are you sure you want to delete sequence "${item ? item.seqNo : ''}"? This action cannot be undone.
      `
    }
    btnSave.textContent = 'Delete'
    btnSave.style.display = 'block'
    btnSave.type = 'submit'
    btnSave.disabled = false
    form.querySelectorAll('input, select, textarea').forEach(f => { f.disabled = true })
  }

  validationError.classList.add('d-none')
  validationSuccess.classList.add('d-none')

  offcanvas.show()
}

// Apply Closing Stamp to a final sequence (frontend prototype only)
function applyClosingStamp(opIdx, seqIdx) {
  const newData = [...routingData]
  if (seqIdx >= 0 && newData[opIdx] && newData[opIdx].sequences[seqIdx]) {
    newData[opIdx].sequences[seqIdx] = {
      ...newData[opIdx].sequences[seqIdx],
      status: 'Completed',
      closingStamp: true,
      closingStampAt: new Date().toISOString(),
      closingStampBy: getCurrentUser(),
    }
    saveRouting(woId, newData)
    routingData = newData
    refreshOperationsView()
    addLog(woId, { user: getCurrentUser(), action: 'Closing Stamp', detail: `Closing stamp applied to OP ${newData[opIdx].opNo} Sequence ${newData[opIdx].sequences[seqIdx].seqNo}` })
    showToast('Closing Stamp Applied', 'Formal completion recorded for this sequence.', 'success')
    offcanvas.hide()
    form.reset()
    syncResourceSequenceBarcodeField()
    validationSuccess.classList.add('d-none')
  }
}

// Simulate frontend-only save pipeline for prototype interactions.
function runProcessSimulation(message, onDone) {
  processStatus.classList.remove('d-none')
  processSpinner.classList.remove('d-none')
  processBar.style.width = '0%'
  btnSave.disabled = true
  saveSpinner.classList.remove('d-none')

  const steps = [
    { w: 25, label: 'Validating data...' },
    { w: 50, label: 'Updating database...' },
    { w: 75, label: 'Creating activity log...' },
    { w: 100, label: 'Frontend save complete (dummy)...' },
  ]
  let i = 0
  const run = () => {
    if (i >= steps.length) {
      processText.textContent = 'Return Success ✓'
      processSpinner.classList.add('d-none')
      processBar.style.width = '100%'
      setTimeout(() => {
        processStatus.classList.add('d-none')
        btnSave.disabled = false
        saveSpinner.classList.add('d-none')
        onDone && onDone()
      }, 400)
      return
    }
    const s = steps[i]
    processText.textContent = s.label
    processBar.style.width = s.w + '%'
    i++
    setTimeout(run, 500)
  }
  run()
}

// Form Submit Handler (Edit / Delete sequence)
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Non-ME users have read-only access; close offcanvas without saving
  if (currentAction === 'edit' && getUserDepartment(getCurrentUser()) !== 'ME') {
    offcanvas.hide()
    form.reset()
    syncResourceSequenceBarcodeField()
    validationSuccess.classList.add('d-none')
    return
  }

  if (currentAction === 'delete' && editingRow !== null) {
    // Confirm delete sequence
    const { opIdx, seqIdx } = editingRow
    const newData = [...routingData]
    if (seqIdx >= 0) {
      newData[opIdx] = {
        ...newData[opIdx],
        sequences: (newData[opIdx].sequences || []).filter((_, i) => i !== seqIdx),
      }
    } else {
      newData.splice(opIdx, 1)
    }
    try {
      await saveRouting(woId, newData)
      routingData = newData
      refreshOperationsView()
      addLog(woId, { user: 'Admin', action: 'Delete', detail: `Deleted sequence ${seqIdx + 1}` })
      offcanvas.hide()
      form.reset()
      const warn = document.getElementById('deleteWarning')
      if (warn) warn.style.display = 'none'
    } catch (error) {
      console.error('Error deleting:', error)
    }
    return
  }

  // Edit sequence
  if (currentAction === 'edit' && editingRow !== null) {
    const { opIdx, seqIdx } = editingRow
    const seqNo = document.getElementById('f_seqNo').value.trim()
    const scope = document.getElementById('f_scope').value.trim()
    const scopeFull = document.getElementById('f_scopeFull').value.trim()
    const opCode = document.getElementById('f_opCode').value.trim()
    const status = document.getElementById('f_status').value
    const department = document.getElementById('f_department').value
    const workingOn = document.getElementById('f_workingOn').value.trim()
    const iar = document.getElementById('f_iar').value.trim()
    const qualityOrder = document.getElementById('f_qualityOrder').value.trim()
    const qtyAccepted = document.getElementById('f_qtyAccepted').value.trim()
    const qtyScrapped = document.getElementById('f_qtyScrapped').value.trim()
    const wantsSequenceBarcode = !!hasResourceSequenceBarcodeInput?.checked
    const typedSequenceBarcode = resourceSequenceBarcodeInput ? resourceSequenceBarcodeInput.value.trim() : ''

    const missing = []
    if (!seqNo) missing.push('Sequence No')
    if (!scope) missing.push('Scope')
    if (!scopeFull) missing.push('Scope Full')
    if (!opCode) missing.push('Operation Code')
    if (!department) missing.push('Department')

    if (missing.length) {
      showValidationError('Please fill in all required fields: ' + missing.join(', '))
      showToast('Validation Error', 'Harap lengkapi field wajib: ' + missing.join(', '), 'error')
      return
    }

    const newData = [...routingData]
    const opNo = newData[opIdx] ? newData[opIdx].opNo : ''
    const sequenceBarcodeValue = wantsSequenceBarcode ? typedSequenceBarcode : ''
    const seqData = { seqNo, scope, scopeFull, opCode, status, department, workingOn, lastEdited: getCurrentUser(), lastEditedBy: getCurrentUser(), lastEditedAt: new Date().toISOString(), iar, qualityOrder, qtyAccepted, qtyScrapped }
    if (seqIdx >= 0) {
      const updatedSequence = {
        ...newData[opIdx].sequences[seqIdx],
        ...seqData,
      }
      if (wantsSequenceBarcode) {
        updatedSequence.barcode = {
          exists: true,
          type: 'RESOURCE_SEQUENCE',
          value: sequenceBarcodeValue,
        }
      } else {
        delete updatedSequence.barcode
      }
      delete updatedSequence.sequenceBarcode
      newData[opIdx].sequences[seqIdx] = updatedSequence
    } else if (newData[opIdx].sequences) {
      const newSequence = { ...seqData }
      if (wantsSequenceBarcode) {
        newSequence.barcode = {
          exists: true,
          type: 'RESOURCE_SEQUENCE',
          value: sequenceBarcodeValue,
        }
      }
      newData[opIdx].sequences.push(newSequence)
    } else {
      const newSequence = { ...seqData }
      if (wantsSequenceBarcode) {
        newSequence.barcode = {
          exists: true,
          type: 'RESOURCE_SEQUENCE',
          value: sequenceBarcodeValue,
        }
      }
      newData[opIdx].sequences = [newSequence]
    }

    await saveRouting(woId, newData)
    routingData = newData
    refreshOperationsView()

    // ===== SCOPE REVISION TRACKING =====
    // Only create a new revision when the scope actually changed on save.
    const scopeChanged =
      (prevScopeData.scope || '') !== scope ||
      (prevScopeData.scopeFull || '') !== scopeFull
    if (scopeChanged) {
      const summary = buildChangeSummary(prevScopeData.scopeFull, prevScopeData.scope, scopeFull, scope)
      const revision = buildRevision({
        id: woId,
        opNo,
        seqNo,
        summary,
        prevScope: prevScopeData.scope || '',
        prevScopeFull: prevScopeData.scopeFull || '',
        newScope: scope,
        newScopeFull: scopeFull,
      })
      addScopeRevision(woId, revision)
      // Update last edited by the current editor (from current user)
      newData[opIdx].sequences[seqIdx] = {
        ...newData[opIdx].sequences[seqIdx],
        lastEdited: getCurrentUser(),
      }
      await saveRouting(woId, newData)
      routingData = newData
      refreshOperationsView()
    }

    addLog(woId, { user: 'Admin', action: 'Edit', detail: `Sequence ${seqNo}${scopeChanged ? ` · ${summary}` : ''}` })
    runProcessSimulation('Saving sequence', () => {
      showValidationSuccess('Sequence saved successfully!')
      showToast('Success', 'Sequence saved in frontend dummy data.', 'success')
      setTimeout(() => {
        offcanvas.hide()
        form.reset()
        syncResourceSequenceBarcodeField()
        validationSuccess.classList.add('d-none')
      }, 1200)
    })
  }
})

hasResourceSequenceBarcodeInput?.addEventListener('change', syncResourceSequenceBarcodeField)
syncResourceSequenceBarcodeField()

// Module tab switching (single Operations view)
document.querySelectorAll('.module-nav a[data-tab]').forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelectorAll('.module-nav a[data-tab]').forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    const target = tab.dataset.tab
    if (target === 'operations') {
      operationsView.classList.remove('d-none')
      renderOperationList()
    }
  })
})

// ====================== OPERATION LIST MODULE ======================
const opTableBody = document.getElementById('opTableBody')
const opDetailPanel = document.getElementById('opDetailPanel')
const opProgressTag = document.getElementById('opProgressTag')
const opProcessingOverlay = document.getElementById('opProcessingOverlay')
const opProcessingSub = document.getElementById('opProcessingSub')
const opProcessingBar = document.getElementById('opProcessingBar')
const nextOpModalEl = document.getElementById('nextOpModal')
const nextOpModal = nextOpModalEl ? new Modal(nextOpModalEl) : null
const yesNextOpBtn = document.getElementById('yesNextOpBtn')
const noNextOpBtn = document.getElementById('noNextOpBtn')

// State
let operations = []
let selectedOpIndex = -1
let pendingNextSelection = -1
let opSearchQuery = ''

// DOM Elements for search
const opSearchInput = document.getElementById('opSearchInput')
if (opSearchInput) {
  opSearchInput.addEventListener('input', (e) => {
    opSearchQuery = e.target.value.toLowerCase().trim()
    renderOperationList()
  })
}

// Load Operation List
async function loadOperationList(id) {
  try {
    let ops = getOperations(id) || []
    if (ops.length === 0) {
      // Fallback: derive from routing if no operation seed exists
      const routing = getRouting(id) || []
      ops = routing.map((op, i) => ({
        opNo: String((parseInt(op.opNo) || (i + 1) * 100)),
        name: op.description || `Operation ${op.opNo}`,
        department: op.workCenter ? 'ME' : 'ME',
        machine: op.workCenter || '-',
        barcode: op.barcode,
        assignedEmployee: '-',
        requirementType: 'Clock Required',
        status: op.status === 'Complete' || op.status === 'Completed' ? 'Completed' : 'Not Started',
        standardHours: 0, actualHours: 0,
        documents: [], routingInfo: op.description || '', materials: [],
      }))
    }

    // Attach routing sequences to the operation records (by name matching).
    unmappedSequences = []
    operations = mapRoutingToOperations(ops, routingData)

    deriveActiveOperation()
    renderOperationList()
    // Select the current operation by default
    const activeIdx = operations.findIndex(o => o.active)
    if (activeIdx >= 0) {
      selectOperation(activeIdx)
    }
  } catch (error) {
    console.error('Error loading operations:', error)
  }
}

// Derive active operation (first non-completed) and progress
function deriveActiveOperation() {
  const total = operations.length
  let completed = 0
  let activeIdx = -1
  operations.forEach((op, i) => {
    if (op.status === 'Completed') completed++
    else if (activeIdx === -1) activeIdx = i
  })
  operations.forEach((op, i) => {
    op.active = (i === activeIdx)
  })
  return { total, completed, activeIdx }
}

function formatLastEdited(seq) {
  const by = seq.lastEditedBy || seq.lastEdited || '-'
  const at = seq.lastEditedAt ? new Date(seq.lastEditedAt) : null
  if (by === '-') return '-'
  const initials = by.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  if (!at || isNaN(at.getTime())) return initials
  const dateStr = at.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  const timeStr = at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
  return `${initials} · ${dateStr}, ${timeStr}`
}

// Render Operations table (parent = Operation, expandable child = Sequences)
function renderOperationList() {
  let displayOps = operations
  if (opSearchQuery) {
    displayOps = operations.filter(op => {
      const searchStr = `${op.opNo || ''} ${op.name || ''} ${op.department || ''} ${op.machine || ''} ${op.assignedEmployee || ''}`.toLowerCase()
      return searchStr.includes(opSearchQuery)
    })
  }

  if (!displayOps || displayOps.length === 0) {
    opTableBody.innerHTML = `
      <tr>
        <td colspan="12" class="table-empty">
          <i class="bi bi-inbox d-block fs-3 mb-1"></i>
          ${opSearchQuery ? '<h6>No matching operations</h6><p>Try adjusting your search terms</p>' : '<h6>No operations found</h6><p>Operations will appear here once assigned</p>'}
        </td>
      </tr>
    `
    opProgressTag.textContent = ''
    return
  }

  // Sort by opNo ascending
  const sorted = [...displayOps].sort((a, b) => (parseInt(a.opNo) || 0) - (parseInt(b.opNo) || 0))
  const { total, completed, activeIdx } = deriveActiveOperation()
  const pct = total ? Math.round((completed / total) * 100) : 0
  opProgressTag.textContent = `${completed}/${total} · ${pct}%`

  let html = ''
  sorted.forEach((op, i) => {
    const isActive = op.active
    const isCompleted = op.status === 'Completed'
    const reqType = op.requirementType === 'Stamp Only' ? 'Stamp Only' : 'Clock Required'
    const statusClass = isCompleted ? 'completed' : (isActive ? 'active' : 'pending')
    const statusBadge = isCompleted ? 'bg-success' : (isActive ? 'bg-primary' : 'bg-secondary')
    const statusText = isCompleted ? 'Completed' : (isActive ? 'Current' : 'Not Started')
    const seqs = op.sequences || []
    const seqCount = seqs.length
    const opBarcodeValue = getOperationBarcodeValue(op)

    // Parent row - ALWAYS 12 columns
    html += `
      <tr class="op-parent-row ${isCompleted ? '' : 'op-row-selectable'}" data-index="${i}">
        <td class="ps-4">
          <button class="btn btn-sm btn-link p-0 op-expand-btn" data-op-index="${i}" title="Expand / collapse">
            <i class="bi bi-chevron-right op-expand-icon"></i>
          </button>
        </td>
        <td class="ps-1 fw-semibold op-detail-no">${op.opNo || ''}</td>
        <td>
          <div class="op-name-cell">
            <span class="op-name fw-medium">${op.name || 'Operation'}</span>
            ${seqCount ? `<span class="op-seq-count">${seqCount} seq${seqCount > 1 ? 's' : ''}</span>` : ''}
          </div>
        </td>
        <td class="text-center">${opBarcodeValue ? buildBarcodeMarkup(opBarcodeValue) : '<span class="text-muted">-</span>'}</td>
        <td>${reqType === 'Clock Required'
              ? '<span class="req-badge req-clock"><i class="bi bi-clock"></i> Clock Required</span>'
              : '<span class="req-badge req-stamp"><i class="bi bi-patch-check"></i> Stamp Only</span>'}</td>
        <td><span class="badge ${statusBadge}"><span class="status-dot ${statusClass}"></span>${statusText}</span></td>
        <td><span class="dept-chip">${op.department || '<span class="text-muted">-</span>'}</span></td>
        <td class="d-none d-lg-table-cell"><code class="machine-code">${op.machine || '-'}</code></td>
        <td class="d-none d-lg-table-cell">${op.assignedEmployee || '<span class="text-muted">-</span>'}</td>
        <td class="d-none d-xl-table-cell text-center">${op.standardHours ?? '-'}</td>
        <td class="d-none d-xl-table-cell text-center">${op.actualHours ?? 0}</td>
        <td class="text-end pe-3">
          <button class="btn btn-sm btn-outline-primary" data-view="${i}">
            <i class="bi bi-eye"></i> View
          </button>
        </td>
      </tr>
    `

    // Child rows - USE THE SAME 12 COLUMN STRUCTURE as parent rows
    if (seqs.length) {
      seqs.forEach((seq, seqIdx) => {
        const seqStatusColor = getStatusBadgeColor(seq.status || 'Pending')
        const seqStatusClass = seq.status === 'Completed' ? 'completed' : (seq.status === 'In Progress' ? 'active' : 'pending')
        const seqBarcode = getResourceSequenceBarcode(seq)
        const lastEditedDisplay = formatLastEdited(seq)
        const isFinal = !!seq.closingStampAvailable
        
        html += `
          <tr class="op-seq-row" data-op-index="${i}" style="display:none;">
            <td class="ps-4">
              <span class="text-muted small">${seq.seqNo || ''}</span>
            </td>
            <td class="ps-1 text-muted small">${seq.opCode || '-'}</td>
            <td>
              <div class="scope-cell">
                <span class="scope-title small">${getScopeText(seq.scope, seq.scopeFull)}</span>
              </div>
            </td>
            <td>${seqBarcode.exists ? buildBarcodeMarkup(seqBarcode.value) : '<span class="text-muted">-</span>'}</td>
            <td><span class="badge bg-${seqStatusColor}"><span class="status-dot ${seqStatusClass}"></span>${seq.status || 'Pending'}</span></td>
            <td><span class="dept-chip">${seq.department || '-'}</span></td>
            <td class="d-none d-lg-table-cell"><code class="machine-code">${seq.machine || '-'}</code></td>
            <td class="d-none d-lg-table-cell">${seq.workingOn || '-'}</td>
            <td class="d-none d-xl-table-cell text-center">-</td>
            <td class="d-none d-xl-table-cell text-center">-</td>
            <td class="text-end pe-3">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="edit" title="Edit"><i class="bi bi-pencil"></i></button>
                ${isFinal ? `<button class="btn btn-outline-success action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="closingStamp" title="Closing Stamp"><i class="bi bi-patch-check"></i></button>` : ''}
                <button class="btn btn-outline-danger action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="delete" title="Delete"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          </tr>
        `
      })
    }
  })

  // Unassigned sequences
  if (unmappedSequences.length) {
    html += `
      <tr class="op-parent-row unmapped-parent">
        <td class="ps-3">
          <button class="btn btn-sm btn-link p-0 op-expand-btn" data-op-index="-1" title="Expand / collapse">
            <i class="bi bi-chevron-right op-expand-icon"></i>
          </button>
        </td>
        <td colspan="11" class="ps-1">
          <div class="op-name-cell">
            <span class="op-name text-warning"><i class="bi bi-exclamation-triangle me-1"></i>Unassigned Sequences</span>
            <span class="op-seq-count">${unmappedSequences.length} sequence${unmappedSequences.length > 1 ? 's' : ''}</span>
          </div>
        </td>
      </tr>
    `
    
    unmappedSequences.forEach((seq, seqIdx) => {
      const seqStatusColor = getStatusBadgeColor(seq.status || 'Pending')
      const seqStatusClass = seq.status === 'Completed' ? 'completed' : (seq.status === 'In Progress' ? 'active' : 'pending')
      const seqBarcode = getResourceSequenceBarcode(seq)
      const isFinal = !!seq.closingStampAvailable
      
      html += `
        <tr class="op-seq-row" data-op-index="-1" style="display:none;">
          <td class="ps-4">
            <span class="text-muted small">${seq.seqNo || ''}</span>
          </td>
          <td class="ps-1 text-muted small">${seq.opCode || '-'}</td>
          <td>
            <div class="scope-cell">
              <span class="scope-title small">${getScopeText(seq.scope, seq.scopeFull)}</span>
            </div>
          </td>
          <td>${seqBarcode.exists ? buildBarcodeMarkup(seqBarcode.value) : '<span class="text-muted">-</span>'}</td>
          <td><span class="badge bg-${seqStatusColor}"><span class="status-dot ${seqStatusClass}"></span>${seq.status || 'Pending'}</span></td>
          <td><span class="dept-chip">${seq.department || '-'}</span></td>
          <td class="d-none d-lg-table-cell"><code class="machine-code">${seq.machine || '-'}</code></td>
          <td class="d-none d-lg-table-cell">${seq.workingOn || '-'}</td>
          <td class="d-none d-xl-table-cell text-center">-</td>
          <td class="d-none d-xl-table-cell text-center">-</td>
          <td class="text-end pe-3">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="edit" title="Edit"><i class="bi bi-pencil"></i></button>
              ${isFinal ? `<button class="btn btn-outline-success action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="closingStamp" title="Closing Stamp"><i class="bi bi-patch-check"></i></button>` : ''}
              <button class="btn btn-outline-danger action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="delete" title="Delete"><i class="bi bi-trash"></i></button>
            </div>
          </td>
        </tr>
      `
    })
  }

  opTableBody.innerHTML = html
  renderGeneratedBarcodes(opTableBody)

  // Expand / collapse sequences - now toggles multiple child rows
  opTableBody.querySelectorAll('.op-expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const opIndex = parseInt(btn.dataset.opIndex)
      const rows = opTableBody.querySelectorAll(`.op-seq-row[data-op-index="${opIndex}"]`)
      const isHidden = rows.length > 0 && rows[0].style.display === 'none'
      rows.forEach(row => {
        row.style.display = isHidden ? '' : 'none'
      })
      btn.querySelector('.op-expand-icon').classList.toggle('bi-chevron-down', isHidden)
      btn.querySelector('.op-expand-icon').classList.toggle('bi-chevron-right', !isHidden)
    })
  })

  // Row click / View -> open detail panel
  opTableBody.querySelectorAll('.op-parent-row').forEach(tr => {
    tr.addEventListener('click', (e) => {
      if (e.target.closest('[data-view]') || e.target.closest('.op-expand-btn')) return
      const index = parseInt(tr.dataset.index)
      if (!isNaN(index)) {
        selectOperation(index)
      }
    })
  })
  
  opTableBody.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      selectOperation(parseInt(btn.dataset.view))
    })
  })

  // Sequence edit / delete
  opTableBody.querySelectorAll('.action-seq-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const rIndex = parseInt(btn.dataset.rIndex)
      const rSeqIndex = parseInt(btn.dataset.rSeqIndex)
      const action = btn.dataset.action
      handleActionClick(action, rIndex, rSeqIndex)
    })
  })

  // View revision history for a sequence
  opTableBody.querySelectorAll('.revision-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation()
      const rIndex = parseInt(link.dataset.rIndex)
      const rSeqIndex = parseInt(link.dataset.rSeqIndex)
      openRevisionHistory(rIndex, rSeqIndex)
    })
  })
}

// Select an operation -> open detail panel
function selectOperation(idx) {
  selectedOpIndex = idx
  const op = operations[idx]
  if (!op) return
  renderDetailPanel(op)
}

// Render Operation Detail Panel (RIGHT PANEL) — header + workflow action only
function renderDetailPanel(op) {
  const isCompleted = op.status === 'Completed'
  const reqType = op.requirementType === 'Stamp Only' ? 'Stamp Only' : 'Clock Required'

  const steps = isCompleted
    ? '<div class="op-done-msg"><i class="bi bi-check-circle-fill"></i> Operation completed.</div>'
    : renderActionArea(op)

  const reqBadge = reqType === 'Clock Required'
    ? '<span class="req-badge req-clock"><i class="bi bi-clock"></i> Clock Required</span>'
    : '<span class="req-badge req-stamp"><i class="bi bi-patch-check"></i> Stamp Only</span>'

  opDetailPanel.innerHTML = `
    <div class="op-detail-head">
      <div class="d-flex align-items-center gap-2 mb-2">
        <h5 class="op-detail-name mb-0">${op.name || 'Operation'}</h5>
        <span class="badge bg-${isCompleted ? 'success' : 'primary'}">${isCompleted ? 'Completed' : 'Active'}</span>
      </div>
      <span class="op-detail-no">OP ${op.opNo || ''}</span>
      <div class="op-detail-badges">
        ${reqBadge}
        ${op.department ? `<span class="dept-chip">${op.department}</span>` : ''}
        ${op.machine && op.machine !== '-' ? `<span class="machine-code">${op.machine}</span>` : ''}
      </div>
    </div>

    <div class="op-detail-section">
      <div class="section-label">Workflow Actions</div>
      <div id="opActionArea">${steps}</div>
    </div>
  `
}

// Render workflow action buttons based on requirement type — MES-style stepper
function renderActionArea(op) {
  const reqType = op.requirementType || 'Clock Required'

  // Browser state for the flow (session-based)
  const flowKey = `op_flow_${woId}_${op.opNo}`
  const flow = JSON.parse(sessionStorage.getItem(flowKey) || '{}')

  // Define the workflow steps
  const steps = reqType === 'Clock Required'
    ? [
        { key: 'clockIn', label: 'Clock In', icon: 'bi-box-arrow-right', action: 'clockIn' },
        { key: 'performDone', label: 'Perform', icon: 'bi-tools', action: 'performDone' },
        { key: 'clockOut', label: 'Clock Out', icon: 'bi-box-arrow-in-left', action: 'clockOut' },
        { key: 'stamp', label: 'Stamp', icon: 'bi-patch-check', action: 'stamp' },
        { key: 'save', label: 'Save', icon: 'bi-send', action: 'save' },
      ]
    : [
        { key: 'performDone', label: 'Perform', icon: 'bi-tools', action: 'performDone' },
        { key: 'stamp', label: 'Stamp', icon: 'bi-patch-check', action: 'stamp' },
        { key: 'save', label: 'Save', icon: 'bi-send', action: 'save' },
      ]

  // Determine current step index (first not-done step)
  let currentIdx = steps.findIndex(s => !flow[s.key])
  if (currentIdx === -1) currentIdx = steps.length - 1

  // Build the stepper header (horizontal progress indicator)
  const stepper = `
    <div class="op-stepper">
      ${steps.map((s, i) => {
        const done = !!flow[s.key]
        const isCurrent = i === currentIdx && !done
        return `
          <div class="op-step ${done ? 'done' : ''} ${isCurrent ? 'current' : ''}">
            <div class="op-step-dot">
              ${done ? '<i class="bi bi-check-lg"></i>' : `<i class="bi ${s.icon}"></i>`}
            </div>
            <span class="op-step-label">${s.label}</span>
          </div>
        `
      }).join('')}
    </div>
  `

  // Build the action card for the current step
  const currentStep = steps[currentIdx]
  const actionCard = `
    <div class="op-action-card">
      <div class="op-action-icon"><i class="bi ${currentStep.icon}"></i></div>
      <div class="op-action-info">
        <div class="op-action-title">${currentStep.label}</div>
        <div class="op-action-desc">${getStepDescription(currentStep.key)}</div>
      </div>
      <button class="btn btn-primary op-action-btn" data-flow="${currentStep.action}">
        <i class="bi ${currentStep.icon} me-1"></i> ${currentStep.label}
      </button>
    </div>
  `

  // Show completed steps summary
  const doneSteps = steps.filter(s => flow[s.key])
  const doneSummary = doneSteps.length > 0 ? `
    <div class="op-done-steps">
      ${doneSteps.map(s => `
        <span class="op-done-chip">
          <i class="bi bi-check-circle-fill"></i> ${s.label}${flow[s.key] && s.key !== 'performDone' ? ` · ${flow[s.key]}` : ''}
        </span>
      `).join('')}
    </div>
  ` : ''

  return `
    <div class="op-flow">
      ${stepper}
      ${doneSummary}
      ${actionCard}
    </div>
  `
}

// Helper: step description text
function getStepDescription(key) {
  const desc = {
    clockIn: 'Start tracking time for this operation',
    performDone: 'Complete the operation work',
    clockOut: 'Stop tracking time for this operation',
    stamp: 'Apply digital stamp to certify the operation',
    save: 'Save and finalize the operation',
  }
  return desc[key] || ''
}

// Event delegation for action area
opDetailPanel.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-flow]')
  if (!btn) return
  const op = operations[selectedOpIndex]
  if (!op) return
  const action = btn.dataset.flow
  const flowKey = `op_flow_${woId}_${op.opNo}`
  const flow = JSON.parse(sessionStorage.getItem(flowKey) || '{}')
  const now = new Date().toLocaleTimeString()

  if (action === 'clockIn') {
    flow.clockIn = now
    sessionStorage.setItem(flowKey, JSON.stringify(flow))
    renderDetailPanel(op)
  } else if (action === 'performDone') {
    flow.performDone = true
    sessionStorage.setItem(flowKey, JSON.stringify(flow))
    renderDetailPanel(op)
  } else if (action === 'clockOut') {
    flow.clockOut = now
    sessionStorage.setItem(flowKey, JSON.stringify(flow))
    renderDetailPanel(op)
  } else if (action === 'stamp') {
    flow.stamp = now
    sessionStorage.setItem(flowKey, JSON.stringify(flow))
    renderDetailPanel(op)
  } else if (action === 'save') {
    saveOperation()
  }
})

// Save Operation: update progress -> ask Next Operation?
function saveOperation() {
  const op = operations[selectedOpIndex]
  if (!op) return

  // Determine if this is the last remaining operation
  const remaining = operations.filter(o => o.status !== 'Completed').length
  const isLastOp = remaining <= 1

  // Show processing overlay
  opProcessingOverlay.classList.remove('d-none')
  opProcessingSub.textContent = `Saving operation ${op.opNo}`
  opProcessingBar.style.width = '0%'

  // Normal save steps
  const baseSteps = [
    { w: 20, label: 'Saving operation data...' },
    { w: 45, label: 'Updating progress...' },
    { w: 70, label: 'Refreshing progress bar...' },
    { w: 85, label: 'Updating operation status...' },
  ]
  // Final WO completion pipeline (only when last operation is saved)
  const finalSteps = [
    { w: 90, label: 'Work Order Complete ✓' },
    { w: 94, label: 'Update WO Status = COMPLETE' },
    { w: 97, label: 'Generate Digital Work Order Package' },
    { w: 100, label: 'Archive Documents (frontend demo)' },
  ]
  const steps = isLastOp ? [...baseSteps, ...finalSteps] : [...baseSteps, { w: 100, label: 'Checking next operation...' }]

  let i = 0
  const run = () => {
    if (i >= steps.length) {
      // Finalize operation
      op.status = 'Completed'
      op.actualHours = (op.actualHours || 0) + 0.5
      op.active = false
      saveOperations(woId, operations)
      // Clear flow
      sessionStorage.removeItem(`op_flow_${woId}_${op.opNo}`)
      addLog(woId, { user: 'Admin', action: 'Complete', detail: `Operation ${op.opNo} ${op.name} completed` })

      // Check if another operation exists
      const nextActive = operations.findIndex(o => o.status !== 'Completed')
      operations.forEach((o, idx) => {
        o.active = (idx === nextActive)
      })
      saveOperations(woId, operations)

      // Check if all done
      const allDone = operations.every(o => o.status === 'Completed')
      if (allDone) {
        updateWorkOrderStatus(woId, 'Complete')
        addLog(woId, { user: 'System', action: 'Complete', detail: 'Work Order marked COMPLETE. Digital WO package generated and archived in frontend demo flow.' })
      }

      // Refresh progress & table & header
      deriveActiveOperation()
      renderOperationList()
      loadWorkOrder(woId)
      pendingNextSelection = nextActive

      setTimeout(() => {
        opProcessingOverlay.classList.add('d-none')
        if (allDone) {
          // Display completion pipeline
          showToast('All Operations Completed', 'All operations completed successfully.', 'success')
          opDetailPanel.innerHTML = `
            <div class="op-all-done">
              <i class="bi bi-check-circle-fill fs-2 text-success"></i>
              <h5 class="mt-2 mb-1">Work Order Complete</h5>
              <p class="text-muted mb-0">All operations completed successfully.</p>
              <div class="op-complete-steps">
                <div><i class="bi bi-check-circle-fill"></i> Work Order Status = COMPLETE</div>
                <div><i class="bi bi-check-circle-fill"></i> Generate Digital Work Order Package</div>
                <div><i class="bi bi-check-circle-fill"></i> Archive Documents</div>
                <div><i class="bi bi-check-circle-fill"></i> Backend integration pending (frontend prototype)</div>
              </div>
            </div>
          `
        } else {
          // Ask: Next Operation?
          if (nextOpModal) nextOpModal.show()
        }
      }, 500)
      return
    }
    const s = steps[i]
    opProcessingSub.textContent = s.label
    opProcessingBar.style.width = s.w + '%'
    i++
    setTimeout(run, isLastOp ? 500 : 400)
  }
  run()
}

// Next Operation? modal handlers
yesNextOpBtn?.addEventListener('click', () => {
  if (nextOpModal) nextOpModal.hide()
  // Return to Operation List and select the next operation
  if (pendingNextSelection >= 0) {
    selectOperation(pendingNextSelection)
  }
})
noNextOpBtn?.addEventListener('click', () => {
  if (nextOpModal) nextOpModal.hide()
  // Stay; user can select any operation from the list
  selectedOpIndex = -1
})

// Re-render the merged Operations view after a routing edit/delete.
function refreshOperationsView() {
  unmappedSequences = []
  operations = mapRoutingToOperations(getOperations(woId) || [], routingData)
  deriveActiveOperation()
  renderOperationList()
}

// Utility Functions
function getStatusBadgeColor(status) {
  const colors = {
    'Draft': 'secondary',
    'Pending': 'warning',
    'In Progress': 'info',
    'Complete': 'success',
    'Completed': 'success',
    'Cancelled': 'danger'
  }
  return colors[status] || 'secondary'
}

function showValidationError(message) {
  validationError.textContent = message
  validationError.classList.remove('d-none')
  validationSuccess.classList.add('d-none')
}

function showValidationSuccess(message) {
  validationSuccess.textContent = message
  validationSuccess.classList.remove('d-none')
  validationError.classList.add('d-none')
}

// Toast notification
function showToast(title, message, type = 'error') {
  toastTitle.textContent = title
  toastMsg.textContent = message
  validationToast.classList.toggle('success', type === 'success')
  validationToast.classList.add('show')
  clearTimeout(showToast._timer)
  showToast._timer = setTimeout(() => {
    validationToast.classList.remove('show')
  }, 4000)
}

toastClose?.addEventListener('click', () => {
  validationToast.classList.remove('show')
})

// Per-field validation error
function markInvalid(el, invalid) {
  el.classList.toggle('is-invalid', invalid)
  if (invalid) {
    el.classList.remove('shake')
    void el.offsetWidth
    el.classList.add('shake')
  }
}

// Toggle Sidebar
document.getElementById('toggleSidebar')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed')
})

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e)
})

// Export for testing
export { loadWorkOrder, loadRouting, renderOperationList }