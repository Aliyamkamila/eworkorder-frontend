// src/pages/assignments.js
import '../main.js'
import { Modal } from 'bootstrap'
import {
  isAuthed,
  seedIfEmpty,
  getWorkOrders,
  getWorkOrder,
  getOperations,
  saveOperations,
  addLog,
  getCurrentUser,
  setCurrentUser,
  getSelectedWO,
} from '../data/store.js'

// ── Auth guard ────────────────────────────────────────────────────────────────
if (!isAuthed()) {
  window.location.href = '/index.html'
}
seedIfEmpty()
setCurrentUser('Andi Pratama')

// ── DOM refs ──────────────────────────────────────────────────────────────────
const woSelect       = document.getElementById('woSelect')
const woSummaryCard  = document.getElementById('woSummaryCard')
const woSummaryInner = document.getElementById('woSummaryInner')
const opsSection     = document.getElementById('opsSection')
const asgnEmptyState = document.getElementById('asgnEmptyState')
const asgnTableBody  = document.getElementById('asgnTableBody')
const asgnOpCount    = document.getElementById('asgnOpCount')
const successBanner  = document.getElementById('successBanner')
const successMsg     = document.getElementById('successMsg')

const assignModalEl  = document.getElementById('assignModal')
const assignModal    = assignModalEl ? new Modal(assignModalEl) : null
const modalOpNo      = document.getElementById('modalOpNo')
const modalOpName    = document.getElementById('modalOpName')
const modalOpDept    = document.getElementById('modalOpDept')
const modalOpReq     = document.getElementById('modalOpReq')
const modalOpStatus  = document.getElementById('modalOpStatus')
const modalCurrAssign = document.getElementById('modalCurrAssign')
const employeeSelect = document.getElementById('employeeSelect')
const btnConfirm     = document.getElementById('btnConfirmAssign')

// ── State ─────────────────────────────────────────────────────────────────────
let currentWoId  = null   // selected WO id
let operations   = []     // loaded ops array (mutated in place)
let pendingOpIdx = -1     // which op is being assigned in the modal
let lastAssignedIdx = -1  // for post-save highlight

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizeStatus(s) {
  const v = String(s || '').trim().toLowerCase()
  if (['complete', 'completed'].includes(v))                            return 'Completed'
  if (['in progress', 'active', 'current', 'in-progress'].includes(v)) return 'In Progress'
  if (['not started', 'pending', 'draft', 'not-started'].includes(v))  return 'Not Started'
  return 'Not Started'
}

function statusBadgeColor(status) {
  return { Completed: 'success', 'In Progress': 'info', 'Not Started': 'secondary' }[status] || 'secondary'
}

// Derive assignment status from assignedEmployee field
function assignmentStatus(op) {
  return (op.assignedEmployee && op.assignedEmployee !== '-')
    ? 'Assigned'
    : 'Unassigned'
}

function assignmentBadge(op) {
  const st = assignmentStatus(op)
  return st === 'Assigned'
    ? `<span class="asgn-status-badge asgn-status-badge--assigned"><i class="bi bi-person-check-fill me-1"></i>Assigned</span>`
    : `<span class="asgn-status-badge asgn-status-badge--unassigned"><i class="bi bi-person-dash me-1"></i>Unassigned</span>`
}

function formatNow() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC',
  })
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ── Populate WO dropdown ──────────────────────────────────────────────────────
function populateWODropdown() {
  const wos = getWorkOrders()
  wos.forEach(wo => {
    const opt = document.createElement('option')
    opt.value = wo.id
    opt.textContent = `${wo.id} — ${wo.description}`
    woSelect.appendChild(opt)
  })

  // Auto-select if coming from wo-detail.html
  const preselected = getSelectedWO()
  if (preselected && wos.find(w => w.id === preselected)) {
    woSelect.value = preselected
    loadWO(preselected)
  }
}

// ── Render WO summary card ────────────────────────────────────────────────────
function renderWOSummary(wo) {
  const color = { Completed: 'success', 'In Progress': 'info', 'Not Started': 'secondary' }[wo.status] || 'secondary'

  const assigned = (getOperations(wo.id) || [])
    .filter(o => o.assignedEmployee && o.assignedEmployee !== '-').length
  const total = (getOperations(wo.id) || []).length

  woSummaryInner.innerHTML = `
    <div class="asgn-wo-field">
      <span class="asgn-wo-label">WO Number</span>
      <span class="asgn-wo-value fw-bold">${escHtml(wo.id)}</span>
    </div>
    <div class="asgn-wo-field">
      <span class="asgn-wo-label">Description</span>
      <span class="asgn-wo-value">${escHtml(wo.description || '—')}</span>
    </div>
    <div class="asgn-wo-field">
      <span class="asgn-wo-label">Quantity</span>
      <span class="asgn-wo-value">${wo.qty ?? '—'}</span>
    </div>
    <div class="asgn-wo-field">
      <span class="asgn-wo-label">WO Status</span>
      <span class="asgn-wo-value"><span class="badge bg-${color}">${escHtml(wo.status)}</span></span>
    </div>
    <div class="asgn-wo-field">
      <span class="asgn-wo-label">Assignment Progress</span>
      <span class="asgn-wo-value">
        <span class="asgn-progress-pill ${assigned === total && total > 0 ? 'asgn-progress-pill--done' : ''}">
          <i class="bi bi-people-fill me-1"></i>${assigned} / ${total} operations
        </span>
      </span>
    </div>
  `
  woSummaryCard.classList.remove('d-none')
}

// ── Render operations table ───────────────────────────────────────────────────
function renderOpsTable(highlightIdx = -1) {
  if (!operations.length) {
    asgnTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-5">
          <i class="bi bi-inbox d-block fs-3 mb-2"></i>
          No operations found for this work order.
        </td>
      </tr>
    `
    asgnOpCount.textContent = ''
    return
  }

  const sorted = [...operations]
    .map((op, originalIdx) => ({ op, originalIdx }))
    .sort((a, b) => (parseInt(a.op.opNo) || 0) - (parseInt(b.op.opNo) || 0))

  const assignedCount = sorted.filter(({ op }) => assignmentStatus(op) === 'Assigned').length
  asgnOpCount.textContent = `${assignedCount} / ${sorted.length} assigned`

  asgnTableBody.innerHTML = sorted.map(({ op, originalIdx }) => {
    const status     = normalizeStatus(op.status)
    const badgeColor = statusBadgeColor(status)
    const isAssigned = assignmentStatus(op) === 'Assigned'
    const isHighlight = originalIdx === highlightIdx

    return `
      <tr class="asgn-op-row ${isHighlight ? 'asgn-op-row--highlight' : ''}" data-op-idx="${originalIdx}">
        <td class="fw-semibold text-nowrap">OP ${escHtml(op.opNo || '—')}</td>
        <td>${escHtml(op.name || op.routingInfo || '—')}</td>
        <td><span class="dept-chip">${escHtml(op.department || '—')}</span></td>
        <td>
          <span class="asgn-req-badge asgn-req-badge--${op.requirementType === 'Stamp Only' ? 'stamp' : 'clock'}">
            <i class="bi bi-${op.requirementType === 'Stamp Only' ? 'patch-check' : 'clock'} me-1"></i>
            ${escHtml(op.requirementType || '—')}
          </span>
        </td>
        <td><span class="badge bg-${badgeColor}">${status}</span></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            ${assignmentBadge(op)}
            ${isAssigned
              ? `<span class="asgn-employee-name">${escHtml(op.assignedEmployee)}</span>`
              : ''}
          </div>
        </td>
        <td class="text-center">
          <button
            class="btn btn-sm ${isAssigned ? 'btn-outline-secondary' : 'btn-primary'} asgn-btn"
            data-op-idx="${originalIdx}">
            <i class="bi bi-${isAssigned ? 'arrow-repeat' : 'person-plus'} me-1"></i>
            ${isAssigned ? 'Reassign' : 'Assign'}
          </button>
        </td>
      </tr>
    `
  }).join('')

  // Attach button listeners
  asgnTableBody.querySelectorAll('.asgn-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      openAssignModal(parseInt(btn.dataset.opIdx))
    })
  })

  // Row click also opens assign (Step F → G in flowchart)
  asgnTableBody.querySelectorAll('.asgn-op-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.asgn-btn')) return
      openAssignModal(parseInt(row.dataset.opIdx))
    })
  })

  // Scroll highlight row into view
  if (highlightIdx >= 0) {
    const highlightRow = asgnTableBody.querySelector('.asgn-op-row--highlight')
    if (highlightRow) {
      highlightRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      // Remove highlight class after animation
      setTimeout(() => highlightRow.classList.remove('asgn-op-row--highlight'), 2500)
    }
  }
}

// ── Step G: Open assign modal — show full operation detail ────────────────────
function openAssignModal(opIdx) {
  const op = operations[opIdx]
  if (!op || !assignModal) return

  pendingOpIdx = opIdx

  const status   = normalizeStatus(op.status)
  const isAssigned = assignmentStatus(op) === 'Assigned'

  // Populate operation detail block
  modalOpNo.textContent     = `OP ${op.opNo || '—'}`
  modalOpName.textContent   = op.name || op.routingInfo || '—'
  modalOpDept.textContent   = op.department || '—'
  modalOpReq.textContent    = op.requirementType || '—'
  modalOpStatus.textContent = status
  modalOpStatus.className   = `badge bg-${statusBadgeColor(status)}`

  // Current assignment
  if (isAssigned) {
    modalCurrAssign.textContent = op.assignedEmployee
    modalCurrAssign.closest('.asgn-modal-curr-wrap').classList.remove('d-none')
  } else {
    modalCurrAssign.closest('.asgn-modal-curr-wrap').classList.add('d-none')
  }

  // Pre-select employee
  employeeSelect.value = isAssigned ? op.assignedEmployee : ''
  employeeSelect.classList.remove('is-invalid')

  // Update modal title to reflect Assign vs Reassign
  document.getElementById('assignModalLabel').textContent = isAssigned
    ? 'Reassign Operation'
    : 'Assign Operation'

  assignModal.show()
}

// ── Step I → J → K → L → M → N → O: Confirm, save, log, show success ─────────
function confirmAssign() {
  // Step J: validate (re-prompt if no employee selected)
  const employee = employeeSelect.value.trim()
  if (!employee) {
    employeeSelect.classList.add('is-invalid')
    return
  }
  employeeSelect.classList.remove('is-invalid')
  if (pendingOpIdx < 0 || pendingOpIdx >= operations.length) return

  const op          = operations[pendingOpIdx]
  const prevEmployee = op.assignedEmployee || '—'
  const isReassign   = assignmentStatus(op) === 'Assigned'

  // Step K: save assignment + update assignment status
  op.assignedEmployee = employee
  op.assignmentStatus = 'Assigned'
  op.assignedAt       = new Date().toISOString()
  op.assignedBy       = getCurrentUser()

  saveOperations(currentWoId, operations)

  // Step N: create activity log
  addLog(currentWoId, {
    user:   getCurrentUser(),
    action: isReassign ? 'Reassign' : 'Assign',
    detail: isReassign
      ? `OP ${op.opNo} reassigned from ${prevEmployee} to ${employee}`
      : `OP ${op.opNo} (${op.name || op.routingInfo || '—'}) assigned to ${employee}`,
  })

  lastAssignedIdx = pendingOpIdx
  pendingOpIdx    = -1

  assignModal.hide()

  // Step O: show success banner
  showSuccessBanner(
    isReassign
      ? `OP ${op.opNo} reassigned to <strong>${escHtml(employee)}</strong>`
      : `OP ${op.opNo} successfully assigned to <strong>${escHtml(employee)}</strong>`
  )

  // Step P: return to operation list — re-render with highlight
  renderOpsTable(lastAssignedIdx)

  // Refresh WO summary progress pill
  const wo = getWorkOrder(currentWoId)
  if (wo) renderWOSummary(wo)
}

// ── Step O: success banner ────────────────────────────────────────────────────
function showSuccessBanner(html) {
  if (!successBanner || !successMsg) return
  successMsg.innerHTML = html
  successBanner.classList.remove('d-none')
  successBanner.classList.add('asgn-banner--visible')
  clearTimeout(showSuccessBanner._timer)
  showSuccessBanner._timer = setTimeout(() => {
    successBanner.classList.remove('asgn-banner--visible')
    setTimeout(() => successBanner.classList.add('d-none'), 350)
  }, 4000)
}

// ── Load WO (Step C → D → E) ──────────────────────────────────────────────────
function loadWO(woId) {
  currentWoId = woId
  const wo = getWorkOrder(woId)

  hideBanner()

  if (!wo) {
    woSummaryCard.classList.add('d-none')
    opsSection.classList.add('d-none')
    asgnEmptyState.classList.remove('d-none')
    return
  }

  operations = getOperations(woId) || []
  renderWOSummary(wo)
  renderOpsTable()

  opsSection.classList.remove('d-none')
  asgnEmptyState.classList.add('d-none')
}

function hideBanner() {
  if (!successBanner) return
  successBanner.classList.remove('asgn-banner--visible')
  successBanner.classList.add('d-none')
}

// ── Event listeners ───────────────────────────────────────────────────────────
woSelect.addEventListener('change', () => {
  const woId = woSelect.value
  if (!woId) {
    woSummaryCard.classList.add('d-none')
    opsSection.classList.add('d-none')
    asgnEmptyState.classList.remove('d-none')
    hideBanner()
    return
  }
  loadWO(woId)
})

btnConfirm?.addEventListener('click', confirmAssign)

employeeSelect?.addEventListener('change', () => {
  employeeSelect.classList.remove('is-invalid')
})

// Dismiss banner on close button
document.getElementById('successBannerClose')?.addEventListener('click', hideBanner)

document.getElementById('toggleSidebar')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed')
})

// ── Init ──────────────────────────────────────────────────────────────────────
populateWODropdown()
