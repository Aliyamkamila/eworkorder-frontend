// src/pages/wo-detail.js
import '../main.js'
import { Offcanvas, Modal } from 'bootstrap'
import JsBarcode from 'jsbarcode'
import { isAuthed, getSelectedWO, getWorkOrder, getRouting, saveRouting, addLog, getOperations, saveOperations, updateWorkOrderStatus, getScopeRevisions, addScopeRevision, buildRevision, getCurrentUser, setCurrentUser, getUserDepartment, seedIfEmpty } from '../data/store.js'

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
const inspectionStampModalEl = document.getElementById('inspectionStampModal')
const inspectionStampModal = inspectionStampModalEl ? new Modal(inspectionStampModalEl) : null
const stampDetailModalEl = document.getElementById('stampDetailModal')
const stampDetailModal = stampDetailModalEl ? new Modal(stampDetailModalEl) : null
const stampDetailBody = document.getElementById('stampDetailBody')
const fIrnNo = document.getElementById('f_irnNo')
const fQtyOrdered = document.getElementById('f_qtyOrdered')
const fQtyScrapped = document.getElementById('f_qtyScrapped')
const fQtyAccepted = document.getElementById('f_qtyAccepted')
const fReviewedBy = document.getElementById('f_reviewedBy')
const fReviewedDate = document.getElementById('f_reviewedDate')
const btnApplyInspectionStamp = document.getElementById('btnApplyInspectionStamp')
const inspectionSpinner = document.getElementById('inspectionSpinner')

// State
let currentAction = 'Add'
let editingRow = null
let routingData = []
let woId = null
let prevScopeData = { scope: '', scopeFull: '' }
let currentRevisionSeq = null
let pendingInspectionOpIndex = -1

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  seedIfEmpty()
  if (!isAuthed()) {
    window.location.href = '/login.html'
    return
  }

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
                <span class="badge bg-${pct === 100 ? 'success' : 'primary'}">${pct === 100 ? 'Completed' : 'In Progress'}</span>
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

// Load Routing Data
async function loadRouting(id) {
  try {
    const data = await getRouting(id)
    routingData = data || []
  } catch (error) {
    console.error('Error loading routing:', error)
  }
}

function getScopeMarkup(seq) {
  const shortText = (seq.scope || '').trim() || '-'
  const fullText = (seq.scopeFull || '').trim()

  if (!fullText || fullText === shortText) {
    return `<span class="scope-title small">${shortText}</span>`
  }

  return `
    <div class="scope-head" data-scope-short="${escapeHtmlAttr(shortText)}" data-scope-full="${escapeHtmlAttr(fullText)}">
      <span class="scope-title small">${shortText}</span>
      <span class="scope-chevron"><i class="bi bi-chevron-right"></i></span>
    </div>
  `
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
let unmappedSequences = []

function mapRoutingToOperations(ops, routing) {
  const normalized = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const mapped = ops.map(op => ({ ...op, sequences: [], matched: false }))

  unmappedSequences = []

  ;(routing || []).forEach(rOp => {
    const rName = normalized(rOp.description || rOp.opNo || '')
    let target = null
    if (rName) {
      target = mapped.find(op => normalized(op.name) === rName) ||
               mapped.find(op => normalized(op.name).includes(rName) || rName.includes(normalized(op.name)))
    }
    ;(rOp.sequences || []).forEach((seq, sIdx) => {
      const seqEntry = { ...seq, routingOpNo: rOp.opNo || '', routingOpIndex: routing.indexOf(rOp), rSeqIndex: sIdx, status: normalizeStatus(seq.status) }
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

// ====================== SCOPE REVISION HISTORY ======================
const revisionHistoryModalEl = document.getElementById('revisionHistoryModal')
const revisionHistoryModal = revisionHistoryModalEl ? new Modal(revisionHistoryModalEl) : null
const revisionDetailModalEl = document.getElementById('revisionDetailModal')
const revisionDetailModal = revisionDetailModalEl ? new Modal(revisionDetailModalEl) : null
const revisionContext = document.getElementById('revisionContext')
const revisionHistoryBody = document.getElementById('revisionHistoryBody')
const revisionDetailTitle = document.getElementById('revisionDetailTitle')
const revisionDetailBody = document.getElementById('revisionDetailBody')

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

function openRevisionDetail(rev) {
  if (!rev) return
  revisionDetailTitle.textContent = `${rev.revisionNo || 'Revision'} · OP ${rev.opNo || ''} Sequence ${rev.seqNo || ''}`
  revisionDetailBody.innerHTML = `
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
  `
  if (revisionDetailModal) revisionDetailModal.show()
}

function escapeHtml(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}

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

function splitScope(text) {
  if (!text) return []
  return text.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean)
}

function buildChangeSummary(prevFull, prevShort, newFull, newShort) {
  const prev = (prevFull && prevFull.trim()) || (prevShort && prevShort.trim()) || ''
  const next = (newFull && newFull.trim()) || (newShort && newShort.trim()) || ''
  if (prev === next) return 'Scope updated'
  if (!prev) return 'Scope added'
  if (!next) return 'Scope removed'
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

// Handle Action Click
function handleActionClick(action, opIdx, seqIdx) {
  const op = routingData[opIdx]
  if (!op) return
  const item = seqIdx >= 0 ? (op.sequences || [])[seqIdx] : null

  currentAction = action
  editingRow = { opIdx, seqIdx }

  const deleteWarning = document.getElementById('deleteWarning')
  if (deleteWarning) deleteWarning.style.display = 'none'

  if (action === 'edit') {
    prevScopeData = {
      scope: item ? (item.scope || '') : '',
      scopeFull: item ? (item.scopeFull || '') : '',
    }
    const scopeEl = document.getElementById('f_scope')
    const scopeFullEl = document.getElementById('f_scopeFull')
    if (scopeEl) scopeEl.value = item ? item.scope : ''
    if (scopeFullEl) scopeFullEl.value = item ? item.scopeFull : ''
    document.getElementById('panelTitle').textContent = `Edit Sequence ${item ? item.seqNo : ''}`

    const userDept = getUserDepartment(getCurrentUser())
    const canEditScope = userDept === 'ME'
    if (scopeEl) scopeEl.disabled = !canEditScope
    if (scopeFullEl) scopeFullEl.disabled = !canEditScope

    if (!canEditScope) {
      document.getElementById('panelSubtitle').textContent = 'Read-only view - limited permissions'
    } else {
      document.getElementById('panelSubtitle').textContent = 'Modify scope details'
    }

    btnSave.textContent = canEditScope ? 'Save' : 'Close'
    btnSave.style.display = 'block'
    if (!canEditScope) {
      btnSave.disabled = false
      btnSave.type = 'button'
      btnSave.onclick = () => offcanvas.hide()
    } else {
      btnSave.disabled = false
      btnSave.type = 'submit'
      btnSave.onclick = null
    }
  } else if (action === 'closingStamp') {
    const scopeEl = document.getElementById('f_scope')
    const scopeFullEl = document.getElementById('f_scopeFull')
    if (scopeEl) scopeEl.value = item ? item.scope : ''
    if (scopeFullEl) scopeFullEl.value = item ? item.scopeFull : ''
    document.getElementById('panelTitle').textContent = `Closing Stamp · Sequence ${item ? item.seqNo : ''}`
    document.getElementById('panelSubtitle').textContent = 'Formal completion certification'
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

// Form Submit Handler
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (currentAction === 'edit' && getUserDepartment(getCurrentUser()) !== 'ME') {
    offcanvas.hide()
    form.reset()
    syncResourceSequenceBarcodeField()
    validationSuccess.classList.add('d-none')
    return
  }

  if (currentAction === 'delete' && editingRow !== null) {
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

  if (currentAction === 'edit' && editingRow !== null) {
    const { opIdx, seqIdx } = editingRow
    const seq = routingData[opIdx]?.sequences?.[seqIdx]
    const seqNo = seq ? seq.seqNo : ''
    const scope = document.getElementById('f_scope')?.value.trim() || ''
    const scopeFull = document.getElementById('f_scopeFull')?.value.trim() || ''

    const missing = []
    if (!scope) missing.push('Scope')
    if (!scopeFull) missing.push('Scope Full')

    if (missing.length) {
      showValidationError('Please fill in all required fields: ' + missing.join(', '))
      showToast('Validation Error', 'Harap lengkapi field wajib: ' + missing.join(', '), 'error')
      return
    }

    const newData = [...routingData]
    const opNo = newData[opIdx] ? newData[opIdx].opNo : ''
    const updatedSequence = {
      ...newData[opIdx].sequences[seqIdx],
      scope,
      scopeFull,
      lastEdited: getCurrentUser(),
      lastEditedBy: getCurrentUser(),
      lastEditedAt: new Date().toISOString(),
    }
    newData[opIdx].sequences[seqIdx] = updatedSequence

    await saveRouting(woId, newData)
    routingData = newData
    refreshOperationsView()

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

// Module tab switching
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

let operations = []
let selectedOpIndex = -1
let pendingNextSelection = -1
let opSearchQuery = ''

const opSearchInput = document.getElementById('opSearchInput')
if (opSearchInput) {
  opSearchInput.addEventListener('input', (e) => {
    opSearchQuery = e.target.value.toLowerCase().trim()
    renderOperationList()
  })
}

async function loadOperationList(id) {
  try {
    let ops = getOperations(id) || []
    if (ops.length === 0) {
      const routing = getRouting(id) || []
      ops = routing.map((op, i) => ({
        opNo: String((parseInt(op.opNo) || (i + 1) * 100)),
        name: op.description || `Operation ${op.opNo}`,
        department: op.workCenter ? 'ME' : 'ME',
        machine: op.workCenter || '-',
        barcode: op.barcode,
        assignedEmployee: '-',
        requirementType: 'Clock Required',
        status: normalizeStatus(op.status),
        documents: [], routingInfo: op.description || '', materials: [],
      }))
    }

    unmappedSequences = []
    operations = mapRoutingToOperations(ops, routingData)

    deriveActiveOperation()
    renderOperationList()
    const activeIdx = operations.findIndex(o => o.active)
    if (activeIdx >= 0) {
      selectOperation(activeIdx)
    }
  } catch (error) {
    console.error('Error loading operations:', error)
  }
}

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
  const at = seq.lastEditedAt ? new Date(seq.lastEditedAt) : null
  if (!at || isNaN(at.getTime())) return ''
  const dateStr = at.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  const timeStr = at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
  return `${dateStr}, ${timeStr}`
}

// ====================== RENDER OPERATION LIST ======================
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
      <div class="wo-grid-row wo-grid-empty">
        <div class="wo-grid-cell table-empty" style="grid-column: 1 / span 13">
          <i class="bi bi-inbox d-block fs-3 mb-1"></i>
          ${opSearchQuery ? '<h6>No matching operations</h6><p>Try adjusting your search terms</p>' : '<h6>No operations found</h6><p>Operations will appear here once assigned</p>'}
        </div>
      </div>
    `
    opProgressTag.textContent = ''
    return
  }

  const sorted = [...displayOps].sort((a, b) => (parseInt(a.opNo) || 0) - (parseInt(b.opNo) || 0))
  const { total, completed, activeIdx } = deriveActiveOperation()
  const pct = total ? Math.round((completed / total) * 100) : 0
  opProgressTag.textContent = `${completed}/${total} · ${pct}%`

  let html = ''
  sorted.forEach((op, i) => {
    const isActive = op.active
    const isCompleted = op.status === 'Completed'
    const statusClass = isCompleted ? 'completed' : (isActive ? 'active' : 'pending')
    const statusBadge = getStatusBadgeColor(op.status)
    const statusText = normalizeStatus(op.status)
    const seqs = op.sequences || []
    const seqCount = seqs.length
    const opBarcodeValue = getOperationBarcodeValue(op)
    const isExpanded = false

    // PARENT ROW - 12 columns
    const opFlowKey = `op_flow_${woId}_${op.opNo}`
    const opFlow = JSON.parse(sessionStorage.getItem(opFlowKey) || '{}')
    html += `
      <div class="wo-grid-row op-parent-row ${isCompleted ? '' : 'op-row-selectable'}" data-index="${i}">
        <div class="wo-grid-cell" style="grid-column: 1" data-col="1">
          ${seqCount > 0 ? `
            <button class="btn btn-sm btn-link p-0 op-expand-btn" data-op-index="${i}" title="Expand / collapse">
              <i class="bi bi-chevron-right op-expand-icon"></i>
            </button>
          ` : '<span class="text-muted" style="opacity:0.3;">—</span>'}
        </div>
        <div class="wo-grid-cell ps-1 fw-semibold op-detail-no text-center" style="grid-column: 2" data-col="2">${op.opNo || ''}</div>
        <div class="wo-grid-cell text-center" style="grid-column: 3" data-col="3">-</div>
        <div class="wo-grid-cell" style="grid-column: 4" data-col="4">
          <span class="scope-title small">${op.routingInfo || op.name || 'Operation'}</span>
        </div>
        <div class="wo-grid-cell text-center hide-on-lg" style="grid-column: 5" data-col="5">${opBarcodeValue ? buildBarcodeMarkup(opBarcodeValue) : '<span class="text-muted">-</span>'}</div>
        <div class="wo-grid-cell" style="grid-column: 6" data-col="6">
          <span class="badge bg-${statusBadge}"><span class="status-dot ${statusClass}"></span>${statusText}</span>
        </div>
        <div class="wo-grid-cell" style="grid-column: 7" data-col="7"><span class="dept-chip">${op.department || '<span class="text-muted">-</span>'}</span></div>
        <div class="wo-grid-cell" style="grid-column: 8" data-col="8"><code class="machine-code">${op.operationCode || op.machine || '-'}</code></div>
        <div class="wo-grid-cell text-center hide-on-sm" style="grid-column: 9" data-col="9">${op.assignedEmployee || '<span class="text-muted">-</span>'}</div>
        <div class="wo-grid-cell text-center hide-on-lg" style="grid-column: 10" data-col="10">-</div>
        <div class="wo-grid-cell hide-on-xl text-center" style="grid-column: 11" data-col="11">-</div>
        <div class="wo-grid-cell hide-on-xl text-center" style="grid-column: 12" data-col="12">-</div>
        <div class="wo-grid-cell" style="grid-column: 13" data-col="13">
          <button class="btn btn-sm btn-outline-primary" data-view="${i}">
            <i class="bi bi-eye"></i> View
          </button>
        </div>
      </div>
    `

    if (seqs.length) {
      seqs.forEach((seq, seqIdx) => {
        const seqStatusColor = getStatusBadgeColor(seq.status)
        const seqStatusClass = seq.status === 'Completed' ? 'completed' : (seq.status === 'In Progress' ? 'active' : 'pending')
        const seqBarcode = getResourceSequenceBarcode(seq)
        const lastEditedDisplay = formatLastEdited(seq)
        const isFinal = !!seq.closingStampAvailable

        html += `
          <div class="wo-grid-row op-seq-row" data-op-index="${i}" style="display:none;">
            <div class="wo-grid-cell ps-4 text-center" style="grid-column: 1" data-col="1">
              <span class="text-muted small" style="opacity:0.4;">└</span>
            </div>
            <div class="wo-grid-cell ps-1 text-muted small" style="grid-column: 2" data-col="2"></div>
            <div class="wo-grid-cell text-center" style="grid-column: 3" data-col="3"><span class="seq-num">${seq.seqNo || '-'}</span></div>
            <div class="wo-grid-cell" style="grid-column: 4" data-col="4">
              ${getScopeMarkup(seq)}
            </div>
            <div class="wo-grid-cell text-center hide-on-lg" style="grid-column: 5" data-col="5">${seqBarcode.exists ? buildBarcodeMarkup(seqBarcode.value) : '<span class="text-muted">-</span>'}</div>
            <div class="wo-grid-cell" style="grid-column: 6" data-col="6">
              <span class="badge bg-${seqStatusColor}"><span class="status-dot ${seqStatusClass}"></span>${normalizeStatus(seq.status)}</span>
            </div>
            <div class="wo-grid-cell" style="grid-column: 7" data-col="7"><span class="dept-chip">${seq.department || '-'}</span></div>
            <div class="wo-grid-cell" style="grid-column: 8" data-col="8"><code class="machine-code">${seq.operationCode || seq.machine || '-'}</code></div>
            <div class="wo-grid-cell text-center hide-on-sm" style="grid-column: 9" data-col="9">${seq.workingOn || '<span class="text-muted">-</span>'}</div>
            <div class="wo-grid-cell text-center hide-on-lg" style="grid-column: 10" data-col="10">
              ${lastEditedDisplay ? `<div class="last-edited-cell text-center"><span class="text-muted">Last Revised</span><span class="last-edited-date">${lastEditedDisplay}</span><button class="btn btn-link btn-sm p-0 revision-link" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" title="View Revision History"><i class="bi bi-clock-history"></i></button></div>` : '<span class="text-muted">-</span>'}
            </div>
            <div class="wo-grid-cell hide-on-xl text-center" style="grid-column: 11" data-col="11">-</div>
            <div class="wo-grid-cell hide-on-xl text-center" style="grid-column: 12" data-col="12">-</div>
            <div class="wo-grid-cell" style="grid-column: 13" data-col="13">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="edit" title="Edit"><i class="bi bi-pencil"></i></button>
                ${isFinal ? `<button class="btn btn-outline-success action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="closingStamp" title="Closing Stamp"><i class="bi bi-patch-check"></i></button>` : ''}
                <button class="btn btn-outline-danger action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="delete" title="Delete"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        `
      })
    }
  })

  // Unassigned sequences
  if (unmappedSequences.length) {
    html += `
      <div class="wo-grid-row op-parent-row unmapped-parent">
        <div class="wo-grid-cell" style="grid-column: 1" data-col="1">
          <button class="btn btn-sm btn-link p-0 op-expand-btn" data-op-index="-1" title="Expand / collapse">
            <i class="bi bi-chevron-right op-expand-icon"></i>
          </button>
        </div>
        <div class="wo-grid-cell ps-1" style="grid-column: 2 / span 13" data-col="2">
          <div class="op-name-cell">
            <span class="op-name text-warning"><i class="bi bi-exclamation-triangle me-1"></i>Unassigned Sequences</span>
            <span class="op-seq-count">${unmappedSequences.length} sequence${unmappedSequences.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    `

    unmappedSequences.forEach((seq, seqIdx) => {
      const seqStatusColor = getStatusBadgeColor(seq.status)
      const seqStatusClass = seq.status === 'Completed' ? 'completed' : (seq.status === 'In Progress' ? 'active' : 'pending')
      const seqBarcode = getResourceSequenceBarcode(seq)
      const isFinal = !!seq.closingStampAvailable
      const lastEditedDisplay = formatLastEdited(seq)

      html += `
        <div class="wo-grid-row op-seq-row" data-op-index="-1" style="display:none;">
          <div class="wo-grid-cell ps-4 text-center" style="grid-column: 1" data-col="1">
            <span class="text-muted small" style="opacity:0.4;">└</span>
          </div>
          <div class="wo-grid-cell ps-1 text-muted small" style="grid-column: 2" data-col="2"></div>
          <div class="wo-grid-cell text-center" style="grid-column: 3" data-col="3"><span class="seq-num">${seq.seqNo || '-'}</span></div>
          <div class="wo-grid-cell" style="grid-column: 4" data-col="4">
            ${getScopeMarkup(seq)}
          </div>
          <div class="wo-grid-cell text-center hide-on-lg" style="grid-column: 5" data-col="5">${seqBarcode.exists ? buildBarcodeMarkup(seqBarcode.value) : '<span class="text-muted">-</span>'}</div>
          <div class="wo-grid-cell" style="grid-column: 6" data-col="6">
            <span class="badge bg-${seqStatusColor}"><span class="status-dot ${seqStatusClass}"></span>${normalizeStatus(seq.status)}</span>
          </div>
          <div class="wo-grid-cell" style="grid-column: 7" data-col="7"><span class="dept-chip">${seq.department || '-'}</span></div>
          <div class="wo-grid-cell" style="grid-column: 8" data-col="8"><code class="machine-code">${seq.operationCode || seq.machine || '-'}</code></div>
          <div class="wo-grid-cell text-center hide-on-sm" style="grid-column: 9" data-col="9">${seq.workingOn || '<span class="text-muted">-</span>'}</div>
          <div class="wo-grid-cell text-center hide-on-lg" style="grid-column: 10" data-col="10">
            ${lastEditedDisplay ? `<div class="last-edited-cell text-center"><span class="text-muted">Last Revised</span><span class="last-edited-date">${lastEditedDisplay}</span><button class="btn btn-link btn-sm p-0 revision-link" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" title="View Revision History"><i class="bi bi-clock-history"></i></button></div>` : '<span class="text-muted">-</span>'}
          </div>
          <div class="wo-grid-cell hide-on-xl text-center" style="grid-column: 11" data-col="11">-</div>
          <div class="wo-grid-cell hide-on-xl text-center" style="grid-column: 12" data-col="12">-</div>
          <div class="wo-grid-cell" style="grid-column: 13" data-col="13">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="edit" title="Edit"><i class="bi bi-pencil"></i></button>
              ${isFinal ? `<button class="btn btn-outline-success action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="closingStamp" title="Closing Stamp"><i class="bi bi-patch-check"></i></button>` : ''}
              <button class="btn btn-outline-danger action-seq-btn" data-r-index="${seq.routingOpIndex}" data-r-seq-index="${seq.rSeqIndex}" data-action="delete" title="Delete"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      `
    })
  }

  opTableBody.innerHTML = html
  renderGeneratedBarcodes(opTableBody)

  // Expand / collapse sequences
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

  // Row click / View
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
      const idx = parseInt(btn.dataset.view)
      selectOperation(idx)
      const op = operations[idx]
      if (!op) return
      const flowKey = `op_flow_${woId}_${op.opNo}`
      const flow = JSON.parse(sessionStorage.getItem(flowKey) || '{}')
      const stampData = getStampDataForEntity(op, 'operation', flow)
      if (stampData.exists) {
        const saveEntry = (op.actionHistory || []).find(h => h.action === 'save') || (op.actionHistory || []).find(h => h.label === 'Finalized')
        openStampDetailModal(stampData, {
          entityType: 'operation',
          opNo: op.opNo,
          name: op.name,
          department: op.department,
          finalized: saveEntry ? { user: saveEntry.user, display: saveEntry.display } : null,
        })
      }
    })
  })

  // Sequence action buttons
  opTableBody.querySelectorAll('.action-seq-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const rIndex = parseInt(btn.dataset.rIndex)
      const rSeqIndex = parseInt(btn.dataset.rSeqIndex)
      const action = btn.dataset.action
      handleActionClick(action, rIndex, rSeqIndex)
    })
  })

  // Revision history links
  opTableBody.querySelectorAll('.revision-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation()
      const rIndex = parseInt(link.dataset.rIndex)
      const rSeqIndex = parseInt(link.dataset.rSeqIndex)
      openRevisionHistory(rIndex, rSeqIndex)
    })
  })

  // Scope expand / collapse
  opTableBody.querySelectorAll('.scope-head').forEach(head => {
    head.addEventListener('click', (e) => {
      e.stopPropagation()
      const isOpen = head.classList.contains('open')
      const titleEl = head.querySelector('.scope-title')

      if (isOpen) {
        head.classList.remove('open')
        titleEl.textContent = head.dataset.scopeShort || '-'
      } else {
        head.classList.add('open')
        titleEl.textContent = head.dataset.scopeFull || ''
      }
    })
  })
}

function selectOperation(idx) {
  selectedOpIndex = idx
  const op = operations[idx]
  if (!op) return
  renderDetailPanel(op)
}

function renderDetailPanel(op) {
  const normalizedStatus = normalizeStatus(op.status)
  const isCompleted = normalizedStatus === 'Completed'
  const flowKey = `op_flow_${woId}_${op.opNo}`
  const flow = JSON.parse(sessionStorage.getItem(flowKey) || '{}')

  const steps = isCompleted ? renderFinalizedView(op) : renderActionArea(op)

  const stampData = getStampDataForEntity(op, 'operation', flow)

  const stampDetailsHTML = stampData.exists
    ? `
      <div class="stamp-inline-card">
        <div class="stamp-inline-visual" data-open-stamp-detail title="View stamp detail">
          <div class="stamp-inline-badge">
            ${buildOperationRoundStampSVG(op.opNo, stampData.user, stampData.display, 120)}
          </div>
        </div>
        <div class="stamp-inline-info">
          <div class="stamp-inline-row">
            <span class="stamp-inline-label">Confirmed By</span>
            <span class="stamp-inline-value">${escapeHtml(stampData.user)}</span>
          </div>
          <div class="stamp-inline-row">
            <span class="stamp-inline-label">Date &amp; Time</span>
            <span class="stamp-inline-value">${escapeHtml(stampData.display)}</span>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-primary stamp-inline-view-btn" data-open-stamp-detail>
          <i class="bi bi-eye"></i> View
        </button>
      </div>
    `
    : `
      <span class="stamp-indicator stamp-indicator--empty" title="Not Stamped">
        <span class="stamp-indicator-stamp" style="width:22px;height:22px;">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="12" opacity="0.4" />
          </svg>
        </span>
        <span class="stamp-indicator-text">Not Stamped</span>
      </span>
    `

  const statusBadgeColor = getStatusBadgeColor(op.status)
  opDetailPanel.innerHTML = `
    <div class="op-detail-head op-detail-head--compact">
      <div class="d-flex align-items-center gap-2 mb-1">
        <h5 class="op-detail-name mb-0">${op.name || 'Operation'}</h5>
        <span class="badge bg-${statusBadgeColor}">${normalizedStatus}</span>
      </div>
      <div class="op-detail-meta">
        <span class="op-detail-no">OP ${op.opNo || ''}</span>
        ${op.department ? `<span class="dept-chip">${op.department}</span>` : ''}
        ${op.operationCode || op.machine ? `<code class="machine-code">${op.operationCode || op.machine}</code>` : ''}
      </div>
    </div>

    <div class="op-detail-section op-detail-section--tight">
      <div class="section-label">Workflow Actions</div>
      ${steps}
    </div>

    <div class="op-detail-section op-detail-section--tight">
      <div class="section-label">Stamp Details</div>
      ${stampDetailsHTML}
    </div>
  `

  if (stampData.exists) {
    opDetailPanel.querySelectorAll('[data-open-stamp-detail]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const saveEntry = (op.actionHistory || []).find(h => h.action === 'save') || (op.actionHistory || []).find(h => h.label === 'Finalized')
        openStampDetailModal(stampData, {
          entityType: 'operation',
          opNo: op.opNo,
          name: op.name,
          department: op.department,
          finalized: saveEntry ? { user: saveEntry.user, display: saveEntry.display } : null,
        })
      })
    })
  }
}

function renderActionArea(op) {
  const flowKey = `op_flow_${woId}_${op.opNo}`
  const flow = JSON.parse(sessionStorage.getItem(flowKey) || '{}')

  const steps = [
    { key: 'performDone', label: 'Perform', icon: 'bi-tools', action: 'performDone' },
    { key: 'stamp', label: 'Stamp', icon: 'bi-patch-check', action: 'stamp' },
    { key: 'save', label: 'Save', icon: 'bi-send', action: 'save' },
  ]

  let currentIdx = steps.findIndex(s => !flow[s.key])
  if (currentIdx === -1) currentIdx = steps.length - 1

  const stepper = `
    <div class="op-stepper op-stepper--compact">
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

  const history = op.actionHistory || []
  const historyHtml = history.length > 0 ? `
    <div class="op-history">
      <div class="op-history-title">Action History</div>
      <div class="op-history-list">
        ${history.map(h => `
          <div class="op-history-item">
            <div class="op-history-icon"><i class="bi ${h.icon || 'bi-circle'}"></i></div>
            <div class="op-history-content">
              <div class="op-history-label">${h.label}</div>
              <div class="op-history-meta">By ${escapeHtml(h.user)} · ${escapeHtml(h.display)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : ''

  const stampData = getStampDataForEntity(op, 'operation', flow)
  const stampVisual = stampData.exists ? `
    <div class="op-stamp-preview">
      <div class="op-stamp-round-wrap">
        ${buildOperationRoundStampSVG(op.opNo, stampData.user, stampData.display, 100)}
      </div>
      <div class="op-stamp-meta">
        <span class="op-stamp-by">Confirmed by ${escapeHtml(stampData.user)}</span>
        <span class="op-stamp-at">${escapeHtml(stampData.display)}</span>
      </div>
    </div>
  ` : ''

  const currentStep = steps[currentIdx]
  const actionBtn = currentStep && !flow.save ? `
    <div class="op-action-bar">
      <button class="btn btn-primary op-action-btn" data-flow="${currentStep.action}">
        <i class="bi ${currentStep.icon} me-1"></i> ${currentStep.label}
      </button>
    </div>
  ` : ''

  return `
    <div class="op-workflow">
      ${stepper}
      <div class="op-workflow-body">
        ${historyHtml}
        ${stampVisual}
        ${actionBtn}
      </div>
    </div>
  `
}

function renderFinalizedView(op) {
  const history = op.actionHistory || []
  const saveEntry = history.find(h => h.action === 'save') || history.find(h => h.label === 'Finalized') || history[history.length - 1]
  const finalizedBy = saveEntry ? saveEntry.user : getCurrentUser()
  const finalizedAt = saveEntry ? saveEntry.display : new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'UTC'
  })

  const flowKey = `op_flow_${woId}_${op.opNo}`
  const flow = JSON.parse(sessionStorage.getItem(flowKey) || '{}')
  const stampData = getStampDataForEntity(op, 'operation', flow)

  const stepper = `
    <div class="op-stepper op-stepper--compact op-stepper--done">
      <div class="op-step done">
        <div class="op-step-dot"><i class="bi bi-check-lg"></i></div>
        <span class="op-step-label">Perform</span>
      </div>
      <div class="op-step ${stampData.exists ? 'done' : 'not-stamped'}">
        <div class="op-step-dot">
          ${stampData.exists ? '<i class="bi bi-check-lg"></i>' : '<i class="bi bi-dash-lg"></i>'}
        </div>
        <span class="op-step-label">Stamp</span>
        ${stampData.exists
          ? `<div class="op-step-meta">${escapeHtml(stampData.user)} · ${escapeHtml(stampData.display)}</div>`
          : `<div class="op-step-meta op-step-meta--not-stamped">Not Stamped</div>`}
      </div>
      <div class="op-step done">
        <div class="op-step-dot"><i class="bi bi-check-lg"></i></div>
        <span class="op-step-label">Save</span>
        <div class="op-step-meta op-step-meta--final">Finalized · ${escapeHtml(finalizedBy)} · ${escapeHtml(finalizedAt)}</div>
      </div>
    </div>
  `

  const historyHtml = history.length > 0 ? `
    <div class="op-history">
      <div class="op-history-list">
        ${history.map(h => `
          <div class="op-history-item">
            <div class="op-history-icon"><i class="bi ${h.icon || 'bi-circle'}"></i></div>
            <div class="op-history-content">
              <div class="op-history-label">${h.label}</div>
              <div class="op-history-meta">By ${escapeHtml(h.user)} · ${escapeHtml(h.display)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : ''

  const closingStamp = op.inspectionStamp ? buildInspectionStampHTML(op.inspectionStamp) : ''

  return `
    <div class="op-workflow">
      ${stepper}
      ${historyHtml ? `<div class="op-workflow-body">${historyHtml}</div>` : ''}
      ${closingStamp ? `<div class="op-detail-section"><div class="section-label">Closing Stamp</div>${closingStamp}</div>` : ''}
    </div>
  `
}

function getStepDescription(key) {
  const desc = {
    performDone: 'Complete the operation work',
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
  const now = new Date()
  const user = getCurrentUser()
  const display = now.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    timeZone: 'UTC'
  })

  if (action === 'performDone') {
    flow.performDone = { done: true, user, timestamp: now.toISOString(), display }
    op.actionHistory = op.actionHistory || []
    op.actionHistory.push({ action: 'performDone', label: 'Perform', icon: 'bi-tools', user, timestamp: now.toISOString(), display })
    sessionStorage.setItem(flowKey, JSON.stringify(flow))
    saveOperations(woId, operations)
    renderDetailPanel(op)
  } else if (action === 'stamp') {
    const stampNow = new Date()
    const stampDisplay = stampNow.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      timeZone: 'UTC'
    })
    flow.stamp = { done: true, user, timestamp: stampNow.toISOString(), display: stampDisplay, stampString: stampDisplay }
    op.actionHistory = op.actionHistory || []
    op.actionHistory.push({ action: 'stamp', label: 'Stamped', icon: 'bi-patch-check-fill', user, timestamp: stampNow.toISOString(), display: stampDisplay })
    sessionStorage.setItem(flowKey, JSON.stringify(flow))
    saveOperations(woId, operations)
    renderDetailPanel(op)
  } else if (action === 'save') {
    saveOperation()
  } else if (action === 'applyInspectionStamp') {
    pendingInspectionOpIndex = selectedOpIndex
    showInspectionStampModal(op)
  }
})

async function completeOperationSimple(op, onDone) {
  opProcessingOverlay.classList.remove('d-none')
  opProcessingSub.textContent = `Completing operation ${op.opNo}`
  opProcessingBar.style.width = '0%'

  const steps = [
    { w: 20, label: 'Saving operation data...' },
    { w: 45, label: 'Updating progress...' },
    { w: 70, label: 'Refreshing progress bar...' },
    { w: 85, label: 'Updating operation status...' },
  ]

  await new Promise(resolve => {
    let i = 0
    const run = () => {
      if (i >= steps.length) {
        const saveNow = new Date()
        op.status = 'Completed'
        op.active = false
        op.actionHistory = op.actionHistory || []
        op.actionHistory.push({ action: 'save', label: 'Finalized', icon: 'bi-check-circle-fill', user: getCurrentUser(), timestamp: saveNow.toISOString(), display: saveNow.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }) })
        saveOperations(woId, operations)
        sessionStorage.removeItem(`op_flow_${woId}_${op.opNo}`)
        addLog(woId, { user: getCurrentUser(), action: 'Operation Completed', detail: `OP ${op.opNo} marked as completed` })

        const nextActive = operations.findIndex(o => o.status !== 'Completed')
        operations.forEach((o, idx) => {
          o.active = (idx === nextActive)
        })
        saveOperations(woId, operations)

        deriveActiveOperation()
        renderOperationList()
        loadWorkOrder(woId)
        pendingNextSelection = nextActive

        setTimeout(() => {
          opProcessingOverlay.classList.add('d-none')
          if (nextActive >= 0) {
            if (nextOpModal) nextOpModal.show()
          } else {
            if (onDone) onDone()
          }
          resolve()
        }, 500)
        return
      }
      const s = steps[i]
      opProcessingSub.textContent = s.label
      opProcessingBar.style.width = s.w + '%'
      i++
      setTimeout(run, 500)
    }
    run()
  })
}

async function saveOperation() {
  const op = operations[selectedOpIndex]
  if (!op) return

  const remaining = operations.filter(o => o.status !== 'Completed').length
  const isLastOp = remaining <= 1

  if (isLastOp) {
    pendingInspectionOpIndex = selectedOpIndex
    await completeOperationSimple(op, () => {
      showInspectionStampModal(op)
    })
  } else {
    await completeOperationSimple(op)
  }
}

// ====================== UNIFIED STAMP SYSTEM ======================

// ---- OPERATION STAMP: circular rubber stamp ----
// Used for each completed operation. Round shape, no form fields.
function buildOperationRoundStampSVG(opNo, user, date, size = 180) {
  const reviewer = String(user || '').trim()
  const center = reviewer ? reviewer.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'OP'
  const shortDate = date ? date.split(',')[0].trim().toUpperCase() : ''
  const opLabel = opNo ? `OP ${opNo}` : 'OPERATION'
  const arcLabel = reviewer ? reviewer.toUpperCase() : 'COMPLETED'
  
  const filterId = `op-stamp-ink-${size}`
  const topArcId = `op-stamp-arc-top-${size}`
  const btmArcId = `op-stamp-arc-btm-${size}`
  const cx = size / 2
  const cy = size / 2
  const r1 = size * 0.455
  const r2 = size * 0.395
  const sw1 = size * 0.032
  const sw2 = size * 0.016
  const arcR = size * 0.355
  const topArcPath = `M ${cx - arcR},${cy} A ${arcR},${arcR} 0 0,1 ${cx + arcR},${cy}`
  const btmArcPath = `M ${cx - arcR},${cy} A ${arcR},${arcR} 0 0,0 ${cx + arcR},${cy}`
  
  return `
    <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">
      <defs>
        <filter id="${filterId}" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="4" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="${size * 0.018}" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feComposite in="displaced" in2="SourceGraphic" operator="in" />
        </filter>
        <path id="${topArcId}" d="${topArcPath}" />
        <path id="${btmArcId}" d="${btmArcPath}" />
      </defs>
      <g transform="rotate(-8, ${cx}, ${cy})" filter="url(#${filterId})" fill="#0a0a0a" stroke="#0a0a0a">
        <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="#0a0a0a" stroke-width="${sw1}" opacity="0.92" />
        <circle cx="${cx}" cy="${cy}" r="${r2}" fill="none" stroke="#0a0a0a" stroke-width="${sw2}" opacity="0.85" />
        <text font-size="${size * 0.072}" font-weight="700" font-family="'Courier New', Courier, monospace" letter-spacing="${size * 0.012}" fill="#0a0a0a" opacity="0.90">
          <textPath href="#${topArcId}" startOffset="50%" text-anchor="middle">${escapeHtml(arcLabel)}</textPath>
        </text>
        <text x="${cx}" y="${cy + size * 0.095}" text-anchor="middle" font-size="${size * 0.34}" font-weight="900" font-family="'Times New Roman', Georgia, serif" fill="#0a0a0a" opacity="0.93" dominant-baseline="middle">${escapeHtml(center)}</text>
        <line x1="${cx - size * 0.22}" y1="${cy + size * 0.23}" x2="${cx + size * 0.22}" y2="${cy + size * 0.23}" stroke="#0a0a0a" stroke-width="${size * 0.010}" opacity="0.70" />
        ${shortDate ? `
        <text font-size="${size * 0.060}" font-weight="700" font-family="'Courier New', Courier, monospace" letter-spacing="${size * 0.008}" fill="#0a0a0a" opacity="0.88">
          <textPath href="#${btmArcId}" startOffset="50%" text-anchor="middle">${escapeHtml(shortDate)}</textPath>
        </text>
        ` : ''}
      </g>
    </svg>
  `
}

// ---- CLOSING STAMP: rectangular/square rubber stamp ----
// Used ONLY for the Final/Closing Stamp after all operations are complete.
function buildClosingRectStampSVG(stamp, size = 240) {
  const irnNo = String(stamp.irnNo || '').trim()
  const qtyOrdered = String(stamp.qtyOrdered != null ? stamp.qtyOrdered : '-')
  const qtyScrapped = String(stamp.qtyScrapped != null ? stamp.qtyScrapped : '-')
  const qtyAccepted = String(stamp.qtyAccepted != null ? stamp.qtyAccepted : '-')
  const reviewedBy = String(stamp.reviewedBy || '').trim().toUpperCase()
  const reviewedDate = stamp.reviewedDateDisplay ? stamp.reviewedDateDisplay.split(',')[0].trim().toUpperCase() : (stamp.reviewedDate ? new Date(stamp.reviewedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '-')
  
  const filterId = `closing-rect-ink-${size}`
  const w = size
  const h = size * 0.75
  const cx = w / 2
  const cy = h / 2
  
  return `
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">
      <defs>
        <filter id="${filterId}" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="3" seed="7" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="${size * 0.012}" xChannelSelector="R" yChannelSelector="G" result="d"/>
          <feComposite in="d" in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      <g transform="rotate(-3, ${cx}, ${cy})" filter="url(#${filterId})" fill="#0a0a0a" stroke="none">
        <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="6" ry="6" fill="none" stroke="#0a0a0a" stroke-width="${size * 0.025}" opacity="0.90"/>
        <rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="3" ry="3" fill="none" stroke="#0a0a0a" stroke-width="${size * 0.012}" opacity="0.70"/>
        
        <text x="${cx}" y="${cy - h * 0.32}" text-anchor="middle" font-size="${size * 0.065}" font-weight="900" font-family="'Courier New', Courier, monospace" letter-spacing="4" fill="#0a0a0a" opacity="0.95">FINAL / CLOSING STAMP</text>
        <line x1="20" y1="${cy - h * 0.24}" x2="${w - 20}" y2="${cy - h * 0.24}" stroke="#0a0a0a" stroke-width="${size * 0.010}" opacity="0.60"/>
        
        <text x="24" y="${cy - h * 0.12}" text-anchor="start" font-size="${size * 0.042}" font-weight="700" font-family="'Courier New', Courier, monospace" fill="#0a0a0a" opacity="0.88">IRN No.: ${escapeHtml(irnNo)}</text>
        
        <text x="24" y="${cy + h * 0.02}" text-anchor="start" font-size="${size * 0.042}" font-weight="700" font-family="'Courier New', Courier, monospace" fill="#0a0a0a" opacity="0.88">Qty Ordered: ${escapeHtml(qtyOrdered)}</text>
        
        <text x="24" y="${cy + h * 0.14}" text-anchor="start" font-size="${size * 0.042}" font-weight="700" font-family="'Courier New', Courier, monospace" fill="#0a0a0a" opacity="0.88">Qty Scrapped / RTV: ${escapeHtml(qtyScrapped)}</text>
        
        <text x="24" y="${cy + h * 0.26}" text-anchor="start" font-size="${size * 0.042}" font-weight="700" font-family="'Courier New', Courier, monospace" fill="#0a0a0a" opacity="0.88">Qty Accepted: ${escapeHtml(qtyAccepted)}</text>
        
        <line x1="20" y1="${cy + h * 0.34}" x2="${w - 20}" y2="${cy + h * 0.34}" stroke="#0a0a0a" stroke-width="${size * 0.010}" opacity="0.60"/>
        
        <text x="${cx}" y="${cy + h * 0.46}" text-anchor="middle" font-size="${size * 0.045}" font-weight="700" font-family="'Courier New', Courier, monospace" letter-spacing="1" fill="#0a0a0a" opacity="0.90">${escapeHtml(reviewedBy)}</text>
        <text x="${cx}" y="${cy + h * 0.58}" text-anchor="middle" font-size="${size * 0.040}" font-weight="600" font-family="'Courier New', Courier, monospace" fill="#0a0a0a" opacity="0.82">${escapeHtml(reviewedDate)}</text>
      </g>
    </svg>
  `
}

// ---- CLOSING STAMP: full circular rubber stamp ----
// Used ONLY for the Final/Closing Stamp after all operations are complete.
function buildCircularStampSVG(centerLetter, reviewerText, date, size = 200) {
  const reviewer = String(reviewerText || '').trim()
  // Full name for the arc label — use full name up to ~24 chars, spaced with small gaps
  const arcLabel = reviewer.toUpperCase() || 'INSPECTOR'
  // Large center initial
  const center = (centerLetter || (reviewer ? reviewer[0] : 'A')).toUpperCase()
  // Date line: e.g. "10 Aug 2026"
  const shortDate = date ? date.split(',')[0].trim().toUpperCase() : ''

  // Unique filter id per size so multiple stamps on the same page don't clash
  const filterId = `stamp-ink-${size}`
  const topArcId = `stamp-arc-top-${size}`
  const btmArcId = `stamp-arc-btm-${size}`

  const cx = size / 2
  const cy = size / 2
  // Outer ring radius, inner ring radius
  const r1 = size * 0.455   // outer
  const r2 = size * 0.395   // inner
  const sw1 = size * 0.032  // outer stroke width — thick, like a rubber die
  const sw2 = size * 0.016  // inner stroke width

  // Top arc: reviewer name curves along top half (just inside inner ring)
  const arcR = size * 0.355
  const topArcPath = `M ${cx - arcR},${cy} A ${arcR},${arcR} 0 0,1 ${cx + arcR},${cy}`
  // Bottom arc: date curves along bottom half
  const btmArcPath = `M ${cx - arcR},${cy} A ${arcR},${arcR} 0 0,0 ${cx + arcR},${cy}`

  return `
    <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">
      <defs>
        <!-- Turbulence: simulates uneven ink absorption on paper fibers -->
        <filter id="${filterId}" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="4" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="${size * 0.018}" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feComposite in="displaced" in2="SourceGraphic" operator="in" />
        </filter>
        <path id="${topArcId}" d="${topArcPath}" />
        <path id="${btmArcId}" d="${btmArcPath}" />
      </defs>

      <!-- Slight rotation to look hand-placed, like a physical stamp -->
      <g transform="rotate(-8, ${cx}, ${cy})" filter="url(#${filterId})" fill="#0a0a0a" stroke="#0a0a0a">

        <!-- Outer ring — thick, like the raised die edge -->
        <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none"
          stroke="#0a0a0a" stroke-width="${sw1}" opacity="0.92" />

        <!-- Inner ring — thinner, secondary border -->
        <circle cx="${cx}" cy="${cy}" r="${r2}" fill="none"
          stroke="#0a0a0a" stroke-width="${sw2}" opacity="0.85" />

        <!-- Reviewer name arced along the top inside the rings -->
        <text font-size="${size * 0.068}" font-weight="700"
              font-family="'Courier New', Courier, monospace"
              letter-spacing="${size * 0.012}"
              fill="#0a0a0a" opacity="0.90">
          <textPath href="#${topArcId}" startOffset="50%" text-anchor="middle">${escapeHtml(arcLabel)}</textPath>
        </text>

        <!-- Large center initial — the dominant visual element -->
        <text x="${cx}" y="${cy + size * 0.095}"
              text-anchor="middle"
              font-size="${size * 0.34}"
              font-weight="900"
              font-family="'Times New Roman', Georgia, serif"
              fill="#0a0a0a" opacity="0.93"
              dominant-baseline="middle">${escapeHtml(center)}</text>

        <!-- Horizontal rule lines flanking the date — give it a "stamp band" look -->
        <line x1="${cx - size * 0.22}" y1="${cy + size * 0.23}"
              x2="${cx + size * 0.22}" y2="${cy + size * 0.23}"
              stroke="#0a0a0a" stroke-width="${size * 0.010}" opacity="0.70" />

        <!-- Date arced along the bottom -->
        ${shortDate ? `
        <text font-size="${size * 0.057}" font-weight="700"
              font-family="'Courier New', Courier, monospace"
              letter-spacing="${size * 0.008}"
              fill="#0a0a0a" opacity="0.88">
          <textPath href="#${btmArcId}" startOffset="50%" text-anchor="middle">${escapeHtml(shortDate)}</textPath>
        </text>
        ` : ''}

      </g>
    </svg>
  `
}

function getStampDataForEntity(entity, entityType = 'operation', flow = {}) {
  if (!entity) return { exists: false }

  if (entityType === 'sequence') {
    if (!entity.closingStamp) return { exists: false }
    const by = entity.closingStampBy || '-'
    const at = entity.closingStampAt ? new Date(entity.closingStampAt).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      timeZone: 'UTC'
    }) : '-'
    return {
      exists: true,
      user: by,
      timestamp: entity.closingStampAt,
      display: at,
      centerLetter: by !== '-' ? by.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()[0] : 'A',
      reviewerText: by,
    }
  }

  if (entityType === 'closing') {
    if (!entity.inspectionStamp) return { exists: false }
    const stamp = entity.inspectionStamp
    const by = stamp.reviewedBy || '-'
    const at = stamp.reviewedDateDisplay || new Date(stamp.reviewedDate).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: 'UTC'
    })
    return {
      exists: true,
      user: by,
      timestamp: stamp.reviewedDate,
      display: at,
      centerLetter: by !== '-' ? by.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()[0] : 'A',
      reviewerText: by,
    }
  }

  const history = entity.actionHistory || []
  const stampEntry = history.find(h => h.action === 'stamp') || history.find(h => h.label === 'Stamped')
  if (stampEntry) {
    return {
      exists: true,
      user: stampEntry.user,
      timestamp: stampEntry.timestamp,
      display: stampEntry.display,
      centerLetter: stampEntry.user ? stampEntry.user.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()[0] : 'A',
      reviewerText: stampEntry.user,
    }
  }
  if (flow && flow.stamp && flow.stamp.done) {
    return {
      exists: true,
      user: flow.stamp.user,
      timestamp: flow.stamp.timestamp,
      display: flow.stamp.display,
      centerLetter: flow.stamp.user ? flow.stamp.user.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()[0] : 'A',
      reviewerText: flow.stamp.user,
    }
  }
  return { exists: false }
}

function buildStampIndicatorHTML(stampData, opts = {}) {
  if (!stampData.exists) {
    return `
      <span class="stamp-indicator stamp-indicator--empty" title="Not Stamped">
        <span class="stamp-indicator-stamp" style="width:22px;height:22px;">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="12" opacity="0.4" />
          </svg>
        </span>
        <span class="stamp-indicator-text">Not Stamped</span>
      </span>
    `
  }
  // Operation stamp indicator: show a compact circular icon + date text
  return `
    <span class="stamp-indicator" title="Confirmed by ${escapeHtml(stampData.user)} at ${escapeHtml(stampData.display)}">
      <span class="stamp-indicator-stamp"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="14" opacity="0.85" /></svg></span>
      <span class="stamp-indicator-meta">${escapeHtml(stampData.display)}</span>
    </span>
  `
}

function buildStampDetailModalContent(stampData, entityInfo = {}) {
  // entityType: 'operation' (op badge) | 'closing' (circular closing stamp)
  const entityType = entityInfo.entityType || 'operation'
  const isClosing = entityType === 'closing'

  if (!stampData || !stampData.exists) {
    return `
      <div class="stamp-detail-card">
        <div class="stamp-detail-stamp" style="width:120px;height:120px;opacity:0.35;">
          ${buildCircularStampSVG('A', '', '', 120)}
        </div>
        <div class="stamp-detail-status" style="color:var(--muted);background:var(--border-light);border-color:var(--border);">
          <i class="bi bi-patch-check"></i> Not Stamped
        </div>
        ${entityInfo.opNo ? `<div class="stamp-detail-meta"><div class="stamp-detail-row"><span class="stamp-detail-label">Operation</span><span class="stamp-detail-value">OP ${escapeHtml(entityInfo.opNo)}${entityInfo.name ? ' · ' + escapeHtml(entityInfo.name) : ''}</span></div><div class="stamp-detail-row"><span class="stamp-detail-label">Department</span><span class="stamp-detail-value">${escapeHtml(entityInfo.department || '-')}</span></div></div>` : ''}
      </div>
    `
  }

  const isFinalized = !!entityInfo.finalized
  const finalizedBy = entityInfo.finalized ? entityInfo.finalized.user : null
  const finalizedAt = entityInfo.finalized ? entityInfo.finalized.display : null

  // Stamp visual — round for operation, rectangular for closing
  const stampVisual = isClosing
    ? `<div class="stamp-detail-stamp stamp-detail-stamp--rect">
        ${buildClosingRectStampSVG({ irnNo: entityInfo.irnNo, qtyOrdered: entityInfo.qtyOrdered, qtyScrapped: entityInfo.qtyScrapped, qtyAccepted: entityInfo.qtyAccepted, reviewedBy: stampData.reviewerText, reviewedDate: stampData.display }, 220)}
       </div>`
    : `<div class="stamp-detail-stamp stamp-detail-stamp--round">
        ${buildOperationRoundStampSVG(entityInfo.opNo, stampData.user, stampData.display, 160)}
       </div>`

  const statusLabel = isClosing ? 'CLOSING STAMP APPLIED' : 'OPERATION CONFIRMED'
  const statusIcon = isClosing ? 'bi-patch-check-fill' : 'bi-check-square-fill'
  const stampedByLabel = isClosing ? 'Reviewed By' : 'Confirmed By'

  return `
    <div class="stamp-detail-card">
      ${stampVisual}
      <div class="stamp-detail-status">
        <i class="bi ${statusIcon}"></i> ${statusLabel}
        ${isFinalized ? '<span style="margin:0 0.35rem;color:var(--border);">|</span><span style="color:#15803d;"><i class="bi bi-check-circle-fill"></i> FINALIZED</span>' : ''}
      </div>
      <div class="stamp-detail-meta">
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">${stampedByLabel}</span>
          <span class="stamp-detail-value">${escapeHtml(stampData.user)}</span>
        </div>
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">Date &amp; Time</span>
          <span class="stamp-detail-value">${escapeHtml(stampData.display)}</span>
        </div>
        ${entityInfo.opNo ? `
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">Operation</span>
          <span class="stamp-detail-value">${escapeHtml(entityInfo.name || '')} · OP ${escapeHtml(entityInfo.opNo)}</span>
        </div>
        ` : ''}
        ${entityInfo.sequenceNo ? `
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">Sequence</span>
          <span class="stamp-detail-value">Sequence ${escapeHtml(entityInfo.sequenceNo)}</span>
        </div>
        ` : ''}
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">Department</span>
          <span class="stamp-detail-value">${escapeHtml(entityInfo.department || '-')}</span>
        </div>
        ${isClosing && entityInfo.irnNo ? `
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">IRN No.</span>
          <span class="stamp-detail-value">${escapeHtml(entityInfo.irnNo)}</span>
        </div>
        ` : ''}
        ${isClosing && entityInfo.qtyOrdered != null ? `
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">Qty Ordered</span>
          <span class="stamp-detail-value">${escapeHtml(String(entityInfo.qtyOrdered))}</span>
        </div>
        ` : ''}
        ${isClosing && entityInfo.qtyAccepted != null ? `
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">Qty Accepted</span>
          <span class="stamp-detail-value">${escapeHtml(String(entityInfo.qtyAccepted))}</span>
        </div>
        ` : ''}
        ${isClosing && entityInfo.qtyScrapped != null ? `
        <div class="stamp-detail-row">
          <span class="stamp-detail-label">Qty Scrapped</span>
          <span class="stamp-detail-value">${escapeHtml(String(entityInfo.qtyScrapped))}</span>
        </div>
        ` : ''}
        ${isFinalized && finalizedBy ? `
        <div class="stamp-detail-row stamp-detail-finalized">
          <span class="stamp-detail-label">Finalized By</span>
          <span class="stamp-detail-value">${escapeHtml(finalizedBy)}</span>
        </div>
        ` : ''}
        ${isFinalized && finalizedAt ? `
        <div class="stamp-detail-row stamp-detail-finalized">
          <span class="stamp-detail-label">Finalized Date &amp; Time</span>
          <span class="stamp-detail-value">${escapeHtml(finalizedAt)}</span>
        </div>
        ` : ''}
      </div>
    </div>
  `
}

function openStampDetailModal(stampData, entityInfo = {}) {
  if (!stampDetailModal || !stampDetailBody) return
  stampDetailBody.innerHTML = buildStampDetailModalContent(stampData, entityInfo)
  stampDetailModal.show()
}

// ====================== INSPECTION STAMP ======================
function showInspectionStampModal(op) {
  const wo = getWorkOrder(woId)
  fIrnNo.value = ''
  fQtyOrdered.value = wo ? (wo.qty || '') : ''
  fQtyScrapped.value = ''
  fQtyAccepted.value = ''
  fReviewedBy.value = getCurrentUser()
  fReviewedDate.value = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    timeZone: 'UTC'
  })

  const formEl = document.getElementById('inspectionStampForm')
  formEl?.classList.remove('was-validated')
  formEl?.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'))

  updateClosingStampPreview()

  if (inspectionStampModal) inspectionStampModal.show()
}

function updateClosingStampPreview() {
  const previewEl = document.getElementById('closingStampPreview')
  if (!previewEl) return
  const stamp = {
    irnNo: fIrnNo ? fIrnNo.value.trim() : '',
    qtyOrdered: fQtyOrdered ? fQtyOrdered.value : '-',
    qtyScrapped: fQtyScrapped ? fQtyScrapped.value : '-',
    qtyAccepted: fQtyAccepted ? fQtyAccepted.value : '-',
    reviewedBy: fReviewedBy ? fReviewedBy.value : '',
    reviewedDate: fReviewedDate ? fReviewedDate.value : '-',
  }
  previewEl.innerHTML = `<div class="closing-rect-stamp">${buildClosingRectStampSVG(stamp, 200)}</div>`
}

[fIrnNo, fQtyScrapped, fQtyAccepted, fQtyOrdered, fReviewedBy, fReviewedDate].forEach(el => {
  el?.addEventListener('input', updateClosingStampPreview)
  el?.addEventListener('change', updateClosingStampPreview)
})

function buildInspectionStampHTML(stamp) {
  if (!stamp) return ''
  const reviewedDate = stamp.reviewedDateDisplay || new Date(stamp.reviewedDate).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'UTC'
  })

  const stampWithDate = { ...stamp, reviewedDateDisplay: reviewedDate }
  return `
    <div class="closing-rect-stamp-area">
      <div class="closing-rect-stamp">
        ${buildClosingRectStampSVG(stampWithDate, 220)}
      </div>
    </div>
  `
}

async function applyInspectionStamp() {
  const formEl = document.getElementById('inspectionStampForm')
  if (!formEl) return

  formEl.classList.add('was-validated')

  const irnNo = fIrnNo.value.trim()
  const qtyScrapped = parseInt(fQtyScrapped.value, 10)
  const qtyAccepted = parseInt(fQtyAccepted.value, 10)
  const qtyOrdered = parseInt(fQtyOrdered.value, 10)

  if (!irnNo) {
    showToast('Validation Error', 'IRN No. is required.', 'error')
    fIrnNo.focus()
    return
  }
  if (Number.isNaN(qtyScrapped) || qtyScrapped < 0) {
    showToast('Validation Error', 'Qty Scrapped must be a valid number.', 'error')
    fQtyScrapped.focus()
    return
  }
  if (Number.isNaN(qtyAccepted) || qtyAccepted < 0) {
    showToast('Validation Error', 'Qty Accepted Completed must be a valid number.', 'error')
    fQtyAccepted.focus()
    return
  }

  const op = operations[pendingInspectionOpIndex]
  if (!op) return

  op.inspectionStamp = {
    irnNo,
    qtyOrdered,
    qtyScrapped,
    qtyAccepted,
    reviewedBy: getCurrentUser(),
    reviewedDate: new Date().toISOString(),
    reviewedDateDisplay: fReviewedDate.value,
  }

  saveOperations(woId, operations)

  if (inspectionStampModal) inspectionStampModal.hide()

  updateWorkOrderStatus(woId, 'Completed')
  addLog(woId, { user: getCurrentUser(), action: 'Closing Stamp', detail: `Closing stamp applied to OP ${op.opNo} - IRN: ${op.inspectionStamp?.irnNo || '-'}` })

  deriveActiveOperation()
  renderOperationList()
  loadWorkOrder(woId)
  renderDetailPanel(op)

  showToast('Final/Closing Stamp Applied', 'Work order has been completed.', 'success')
}

btnApplyInspectionStamp?.addEventListener('click', applyInspectionStamp)

inspectionStampModalEl?.addEventListener('hidden.bs.modal', () => {
  pendingInspectionOpIndex = -1
  const formEl = document.getElementById('inspectionStampForm')
  formEl?.classList.remove('was-validated')
  formEl?.reset()
})

// Next Operation modal handlers
yesNextOpBtn?.addEventListener('click', () => {
  if (nextOpModal) nextOpModal.hide()
  if (pendingNextSelection >= 0) {
    selectOperation(pendingNextSelection)
  }
})
noNextOpBtn?.addEventListener('click', () => {
  if (nextOpModal) nextOpModal.hide()
  selectedOpIndex = -1
})

function refreshOperationsView() {
  unmappedSequences = []
  operations = mapRoutingToOperations(getOperations(woId) || [], routingData)
  deriveActiveOperation()
  renderOperationList()
}

function normalizeStatus(status) {
  const s = String(status || '').trim().toLowerCase()
  if (['complete', 'completed'].includes(s)) return 'Completed'
  if (['in progress', 'current', 'active', 'in-progress'].includes(s)) return 'In Progress'
  if (['not started', 'pending', 'draft', 'not-started'].includes(s)) return 'Not Started'
  if (['cancelled', 'canceled', 'on hold', 'hold'].includes(s)) return 'Cancelled'
  return 'Not Started'
}

function getStatusBadgeColor(status) {
  const normalized = normalizeStatus(status)
  const colors = {
    'Not Started': 'secondary',
    'In Progress': 'info',
    'Completed': 'success',
    'Cancelled': 'danger'
  }
  return colors[normalized] || 'secondary'
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

// Toggle Sidebar
document.getElementById('toggleSidebar')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed')
})

window.addEventListener('error', (e) => {
  console.error('Global error:', e)
})

