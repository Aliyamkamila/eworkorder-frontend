import '../main.js'
import { seedIfEmpty, getWorkOrders, getRouting, getLastOperation, getWorkingOn, isAuthed, setSelectedWO } from '../data/store.js'

if (!isAuthed()) window.location.href = '/index.html'
seedIfEmpty()

const statusClass = {
  'Completed': 'status-completed',
  'In Progress': 'status-in-progress',
  'Not Started': 'status-not-started',
}

function renderStats(list) {
  const stats = [
    { label: 'Total Active WO', value: 1, icon: 'bi-clipboard-data', color: 'text-primary' },
    { label: 'Completed', value: list.filter(w => w.status === 'Completed').length, icon: 'bi-check-circle', color: 'text-success' },
    { label: 'Not Started', value: list.filter(w => w.status === 'Not Started').length, icon: 'bi-hourglass-split', color: 'text-warning' },
    { label: 'In Progress', value: list.filter(w => w.status === 'In Progress').length, icon: 'bi-gear', color: 'text-primary' },
  ]
  document.getElementById('statCards').innerHTML = stats.map(s => `
    <div class="col-xl col-md-4 col-6">
      <div class="stat-card">
        <div class="stat-icon ${s.color}"><i class="bi ${s.icon}"></i></div>
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    </div>
  `).join('')
}

function renderTable(list) {
  document.getElementById('woTableBody').innerHTML = list.map(w => {
const routing = getRouting(w.id)
    const lastOp = getLastOperation(routing)
    const workingOn = getWorkingOn(routing)
    return `
    <tr data-id="${w.id}">
      <td class="ps-3 wo-id">${w.id}</td>
      <td>${w.description}</td>
      <td><span class="status-badge ${statusClass[w.status] || ''}">${w.status}</span></td>
<td>${w.department || '-'}</td>
      <td>${w.partNumber || '-'}</td>
      <td>${w.qty}</td>
      <td>${w.dueDate}</td>
      <td><span class="op-badge">OP ${lastOp}</span></td>
      <td>${workingOn.join(', ') || '-'}</td>
    </tr>
  `
  }).join('')

  document.querySelectorAll('#woTableBody tr').forEach(tr => {
    tr.addEventListener('click', () => {
      setSelectedWO(tr.dataset.id)
      window.location.href = '/wo-detail.html'
    })
  })
}

function applyFilters() {
  const q = document.getElementById('searchInput').value.toLowerCase()
  const status = document.getElementById('filterStatus').value
  const dept = document.getElementById('filterDepartment').value
  const part = document.getElementById('filterPart').value
  const fromDate = document.getElementById('filterFromDate').value
  const toDate = document.getElementById('filterToDate').value
  const filtered = getWorkOrders().filter(w =>
    (w.id.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)) &&
    (!status || w.status === status) &&
    (!dept || w.department === dept) &&
    (!part || w.partNumber === part) &&
    (!fromDate || (w.dueDate && w.dueDate >= fromDate)) &&
    (!toDate || (w.dueDate && w.dueDate <= toDate))
  )
  renderTable(filtered)
}

const all = getWorkOrders()
renderStats(all)
renderTable(all)
document.getElementById('searchInput').addEventListener('input', applyFilters)
document.getElementById('filterStatus').addEventListener('change', applyFilters)
document.getElementById('filterDepartment').addEventListener('change', applyFilters)
document.getElementById('filterPart').addEventListener('change', applyFilters)
document.getElementById('filterFromDate').addEventListener('change', applyFilters)
document.getElementById('filterToDate').addEventListener('change', applyFilters)
document.getElementById('toggleSidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed')
})
