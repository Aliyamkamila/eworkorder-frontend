const WO_KEY = 'ewo_workorders'
const ROUTING_KEY = 'ewo_routing_'
const OP_KEY = 'ewo_operations_'
const AUTH_KEY = 'ewo_auth'
const LOG_KEY = 'ewo_log_'
const REV_KEY = 'ewo_scope_revisions_'
const SEED_VERSION = 'ewo_seed_v14'
export function resetAllData() {
  const APP_KEYS = [
    WO_KEY,
    ...Object.keys(seedRouting).map(id => ROUTING_KEY + id),
    ...Object.keys(seedOperations).map(id => OP_KEY + id),
    ...Object.keys(seedRouting).map(id => LOG_KEY + id),
    ...Object.keys(seedRouting).map(id => REV_KEY + id),
    AUTH_KEY,
    'selected_wo',
    SEED_VERSION,
  ]
  APP_KEYS.forEach(key => localStorage.removeItem(key))
}

const seedWorkOrders = [
  {
    id: 'WO-2026-0001',
    jobNo: '54989783',
    barcode: { exists: true, type: 'JOB', value: '54989783' },
    assembly: { code: 'AA1820849(QK2)', barcode: { exists: true, type: 'ASSEMBLY', value: 'AA1820849(QK2)' } },
    description: 'Impeller Assembly - Stage 3',
    status: 'In Progress',
    qty: 120,
    dueDate: '2026-08-10',
    lastOperation: 'Machining',
    assignedTo: 'Andi Pratama',
    salesOrder: 'SO-88213',
    revision: 'Rev.02',
    uom: 'UOM-4471',
    customer: 'Baker Hughes',
    createdDate: '2026-07-20',
    createdBy: 'System',
    priority: 'High',
    department: 'Machining',
    partNumber: 'PART-1001',
  },
  {
    id: 'WO-2026-0002',
    jobNo: '55200831',
    barcode: { exists: true, type: 'JOB', value: '55200831' },
    assembly: { code: 'BB019224(AX1)', barcode: { exists: true, type: 'ASSEMBLY', value: 'BB019224(AX1)' } },
    description: 'Valve Body Casting',
    status: 'Not Started',
    qty: 60,
    dueDate: '2026-08-12',
    lastOperation: 'Inspection',
    assignedTo: 'Budi Santoso',
    salesOrder: 'SO-88220',
    revision: 'Rev.01',
    uom: 'UOM-4472',
    customer: 'Schlumberger',
    createdDate: '2026-07-21',
    createdBy: 'System',
    priority: 'Medium',
    department: 'Casting',
    partNumber: 'PART-2001',
  },
  {
    id: 'WO-2026-0003',
    jobNo: '55333021',
    barcode: { exists: true, type: 'JOB', value: '55333021' },
    assembly: { code: 'CC440811(R2)', barcode: { exists: true, type: 'ASSEMBLY', value: 'CC440811(R2)' } },
    description: 'Turbine Blade Finishing',
    status: 'Completed',
    qty: 40,
    dueDate: '2026-07-30',
    lastOperation: '-',
    assignedTo: 'Citra Dewi',
    salesOrder: 'SO-88190',
    revision: 'Rev.03',
    uom: 'UOM-4470',
    customer: 'Shell',
    createdDate: '2026-07-15',
    createdBy: 'System',
    priority: 'Low',
    department: 'Finishing',
    partNumber: 'PART-3001',
  },
  {
    id: 'WO-2026-0004',
    jobNo: '55490077',
    barcode: { exists: true, type: 'JOB', value: '55490077' },
    assembly: { code: 'DD998120(T7)', barcode: { exists: true, type: 'ASSEMBLY', value: 'DD998120(T7)' } },
    description: 'Compressor Housing Weld',
    status: 'In Progress',
    qty: 25,
    dueDate: '2026-08-15',
    lastOperation: 'Welding',
    assignedTo: 'Dedi Kurnia',
    salesOrder: 'SO-88240',
    revision: 'Rev.01',
    uom: 'UOM-4475',
    customer: 'Petronas',
    createdDate: '2026-07-22',
    createdBy: 'System',
    priority: 'Critical',
    department: 'Welding',
    partNumber: 'PART-4001',
  },
]

// Digital Routing Sheet seed data
// Hierarchy: Parent Operation -> child Sequences
// Each sequence uses SCOPE (short = header, full = expandable detail)
const seedRouting = {
  'WO-2026-0001': [
    {
      opNo: '230', description: 'CNC Machining', workCenter: 'WC-CNC-01', status: 'Completed',
      barcode: { exists: true, type: 'OPERATION', value: '230' },
      sequences: [
        {
          seqNo: '10', opCode: 'ME101', department: 'ME', status: 'Completed', workingOn: 'Budi Santoso',
          barcode: { exists: true, type: 'RESOURCE_SEQUENCE', value: '54989783$230$10' },
          scope: 'Set up CNC machine and load program...', scopeFull: 'Set up CNC machine and load program. Run machining for Stage 3 impeller. Verify dimensional tolerance per drawing. Clad material to ASTM A105 and complete roughing and finishing passes.',
          lastEdited: 'Andi Pratama',
          lastEditedBy: 'Andi Pratama',
          lastEditedAt: '2026-08-10T14:32:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
        },
        {
          seqNo: '20', opCode: 'ME102', department: 'ME', status: 'Completed', workingOn: 'Budi Santoso',
          scope: 'Dimensional inspection', scopeFull: 'Perform dimensional inspection on machined part using CMM. Record all measurements in the inspection report and verify bore depth, OD, and surface finish against drawing.',
          lastEdited: 'Andi Pratama',
          lastEditedBy: 'Andi Pratama',
          lastEditedAt: '2026-08-10T14:45:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
        },
      ],
    },
    {
      opNo: '5300', description: 'Assembly & Torque Check', workCenter: 'WC-ASM-01', status: 'In Progress',
      barcode: { exists: true, type: 'OPERATION', value: '5300' },
      sequences: [
        {
          seqNo: '10', opCode: 'AS201', department: 'AS', status: 'In Progress', workingOn: 'Andi Pratama',
          scope: 'Assemble stage 3 components', scopeFull: 'Assemble stage 3 impeller components based on assembly drawing and torque matrix.',
          lastEdited: 'Andi Pratama',
          lastEditedBy: 'Andi Pratama',
          lastEditedAt: '2026-08-10T15:01:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
        },
        {
          seqNo: '30', opCode: 'AS202', department: 'AS', status: 'Not Started', workingOn: '-',
          barcode: { exists: true, type: 'RESOURCE_SEQUENCE', value: '54989783$5300$30' },
          scope: 'Final torque verification', scopeFull: 'Perform final torque verification using calibrated torque wrench and sign off the torque checklist.',
          lastEdited: 'Andi Pratama',
          lastEditedBy: 'Andi Pratama',
          lastEditedAt: '2026-08-10T15:12:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
        },
      ],
    },
    {
      opNo: '5400', description: 'Final Dimensional Inspection', workCenter: 'WC-QC-02', status: 'Not Started',
      barcode: { exists: true, type: 'OPERATION', value: '5400' },
      sequences: [
        {
          seqNo: '10', opCode: 'QC402', department: 'QC', status: 'Not Started', workingOn: '-',
          scope: 'Final dimensional check', scopeFull: 'Perform final dimensional check before release to final QC stamping.',
          lastEdited: 'Citra Dewi',
          lastEditedBy: 'Citra Dewi',
          lastEditedAt: '2026-08-10T15:20:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
        },
      ],
    },
    {
      opNo: '9000', description: 'Final QC Inspection', workCenter: 'WC-QC-07', status: 'Not Started',
      barcode: { exists: true, type: 'OPERATION', value: '9000' },
      sequences: [
        {
          seqNo: '10', opCode: 'QC499', department: 'QC', status: 'Not Started', workingOn: '-',
          scope: 'Final quality release', scopeFull: 'Review IAR, quality order, and acceptance quantities before formal closing stamp.',
          lastEdited: 'Citra Dewi',
          lastEditedBy: 'Citra Dewi',
          lastEditedAt: '2026-08-10T15:25:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
          closingStampAvailable: true,
        },
      ],
    },
  ],
  'WO-2026-0002': [
    {
      opNo: '260', description: 'Casting & Pour', workCenter: 'WC-CST-01', status: 'Completed',
      barcode: { exists: true, type: 'OPERATION', value: '260' },
      sequences: [
        {
          seqNo: '10', opCode: 'CA301', department: 'CA', status: 'Completed', workingOn: 'Budi Santoso',
          scope: 'Casting and pour', scopeFull: 'Set up mold and pour metal for valve body casting. Allow cool down and verify integrity after knockout.',
          lastEdited: 'Citra Dewi',
          lastEditedBy: 'Citra Dewi',
          lastEditedAt: '2026-08-09T11:15:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
        },
      ],
    },
    {
      opNo: '340', description: 'Visual Inspection', workCenter: 'WC-QC-05', status: 'In Progress',
      barcode: { exists: true, type: 'OPERATION', value: '340' },
      sequences: [
        {
          seqNo: '20', opCode: 'QC401', department: 'QC', status: 'In Progress', workingOn: 'Citra Dewi',
          barcode: { exists: true, type: 'RESOURCE_SEQUENCE', value: '55200831$340$20' },
          scope: 'Visual inspection', scopeFull: 'Perform visual inspection and check cracks, porosity, cold shut, and other surface defects.',
          lastEdited: 'Citra Dewi',
          lastEditedBy: 'Citra Dewi',
          lastEditedAt: '2026-08-10T10:55:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
          closingStampAvailable: true,
        },
      ],
    },
  ],
  'WO-2026-0003': [
    {
      opNo: '330', description: 'Surface Grind & Polish', workCenter: 'WC-FIN-01', status: 'Completed',
      barcode: { exists: true, type: 'OPERATION', value: '330' },
      sequences: [
        {
          seqNo: '10', opCode: 'FN501', department: 'FN', status: 'Completed', workingOn: 'Citra Dewi',
          barcode: { exists: true, type: 'RESOURCE_SEQUENCE', value: '55333021$330$10' },
          scope: 'Surface grind and polish', scopeFull: 'Set up finishing machine and polish turbine blade to required surface finish and visual appearance.',
          lastEdited: 'Budi Santoso',
          lastEditedBy: 'Budi Santoso',
          lastEditedAt: '2026-08-08T16:00:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
          closingStampAvailable: true,
        },
      ],
    },
  ],
  'WO-2026-0004': [
    {
      opNo: '5400', description: 'Housing Welding', workCenter: 'WC-WLD-01', status: 'In Progress',
      barcode: { exists: true, type: 'OPERATION', value: '5400' },
      sequences: [
        {
          seqNo: '10', opCode: 'WE601', department: 'WE', status: 'In Progress', workingOn: 'Dedi Kurnia',
          scope: 'Set up welding machine and weld housing', scopeFull: 'Set up welding machine. Weld compressor housing frame and verify dimensional fit-up.',
          lastEdited: 'Andi Pratama',
          lastEditedBy: 'Andi Pratama',
          lastEditedAt: '2026-08-10T08:30:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
        },
      ],
    },
    {
      opNo: '6000', description: 'Weld Inspection', workCenter: 'WC-QC-09', status: 'Not Started',
      barcode: { exists: true, type: 'OPERATION', value: '6000' },
      sequences: [
        {
          seqNo: '20', opCode: 'QC401', department: 'QC', status: 'Not Started', workingOn: '-',
          barcode: { exists: true, type: 'RESOURCE_SEQUENCE', value: '55490077$6000$20' },
          scope: 'Weld inspection', scopeFull: 'Inspect weld quality and verify weld dimensions and penetration per welding procedure.',
          lastEdited: 'Andi Pratama',
          lastEditedBy: 'Andi Pratama',
          lastEditedAt: '2026-08-10T08:35:00.000Z',
          iar: '', qualityOrder: '', qtyAccepted: '', qtyScrapped: '',
          closingStampAvailable: true,
        },
      ],
    },
  ],
}

// Operation List seed data (Shopfloor Operation List module)
// Requirement types: 'Clock Required' | 'Stamp Only'
const seedOperations = {
  'WO-2026-0001': [
    { opNo: '230', name: 'CNC Machining', department: 'ME', operationCode: 'ME101', machine: 'ME101', barcode: { exists: true, type: 'OPERATION', value: '230' }, assignedEmployee: 'Budi Santoso', requirementType: 'Clock Required', status: 'Completed', standardHours: 8, actualHours: 7.5, active: false, documents: ['Machining Program', 'Set-up Sheet', 'Dimensional Drawing STG-3'], routingInfo: 'Cladding & Machining - Stage 3 Impeller', materials: ['Impeller Blank', 'Cladding Wire A105', 'Coolant'] },
    { opNo: '5300', name: 'Assembly & Torque Check', department: 'AS', operationCode: 'AS201', machine: 'AS201', barcode: { exists: true, type: 'OPERATION', value: '5300' }, assignedEmployee: 'Andi Pratama', requirementType: 'Clock Required', status: 'In Progress', standardHours: 6, actualHours: 1.5, active: true, documents: ['Assembly Manual', 'Torque Specification TP-88'], routingInfo: 'Assembly & Torque Check - Stage 3 impeller components', materials: ['Impeller Sub-assembly', 'Fastener Kit', 'Torque Wrench'] },
    { opNo: '5400', name: 'Final Dimensional Inspection', department: 'QC', operationCode: 'QC402', machine: 'QC402', barcode: { exists: true, type: 'OPERATION', value: '5400' }, assignedEmployee: 'Citra Dewi', requirementType: 'Stamp Only', status: 'Not Started', standardHours: 4, actualHours: 0, active: false, documents: ['CMM Report', 'Inspection Procedure IP-204'], routingInfo: 'Final dimensional check before final release', materials: ['CMM Stylus Kit', 'Master Ball'] },
    { opNo: '9000', name: 'Final QC Inspection', department: 'QC', operationCode: 'QC499', machine: 'QC499', barcode: { exists: true, type: 'OPERATION', value: '9000' }, assignedEmployee: 'Dedi Kurnia', requirementType: 'Stamp Only', status: 'Not Started', standardHours: 3, actualHours: 0, active: false, documents: ['Final Inspection Checklist', 'Certification Pack'], routingInfo: 'Final QC sign-off prior to release', materials: ['Inspection Stamps', 'Certificate Set'] },
  ],
  'WO-2026-0002': [
    { opNo: '260', name: 'Casting & Pour', department: 'CA', operationCode: 'CA301', machine: 'CA301', barcode: { exists: true, type: 'OPERATION', value: '260' }, assignedEmployee: 'Budi Santoso', requirementType: 'Clock Required', status: 'Completed', standardHours: 10, actualHours: 9.1, active: false, documents: ['Mold Setup Sheet', 'Pouring Procedure PP-11'], routingInfo: 'Casting & Pour - Valve Body', materials: ['Valve Body Mold', 'Molten Metal'] },
    { opNo: '340', name: 'Visual Inspection', department: 'QC', operationCode: 'QC401', machine: 'QC401', barcode: { exists: true, type: 'OPERATION', value: '340' }, assignedEmployee: 'Citra Dewi', requirementType: 'Stamp Only', status: 'In Progress', standardHours: 2, actualHours: 0.6, active: true, documents: ['Visual Inspection Standard', 'Defect Catalog'], routingInfo: 'Visual Inspection - cracks, porosity, cold shut', materials: ['Inspection Light', 'Magnifier'] },
  ],
  'WO-2026-0003': [
    { opNo: '330', name: 'Surface Grind & Polish', department: 'FN', operationCode: 'FN501', machine: 'FN501', barcode: { exists: true, type: 'OPERATION', value: '330' }, assignedEmployee: 'Citra Dewi', requirementType: 'Clock Required', status: 'Completed', standardHours: 5, actualHours: 4.8, active: false, documents: ['Finishing Procedure', 'Surface Finish Spec'], routingInfo: 'Surface Grind & Polish - Turbine Blade', materials: ['Turbine Blade', 'Abrasive Wheel'] },
  ],
  'WO-2026-0004': [
    { opNo: '5400', name: 'Housing Welding', department: 'WE', operationCode: 'WE601', machine: 'WE601', barcode: { exists: true, type: 'OPERATION', value: '5400' }, assignedEmployee: 'Dedi Kurnia', requirementType: 'Clock Required', status: 'In Progress', standardHours: 9, actualHours: 3.0, active: true, documents: ['WPS Welding Procedure', 'Weld Map'], routingInfo: 'Cladding & Machining - Compressor Housing', materials: ['Compressor Housing', 'Weld Rods', 'Shielding Gas'] },
    { opNo: '6000', name: 'Weld Inspection', department: 'QC', operationCode: 'QC401', machine: 'QC401', barcode: { exists: true, type: 'OPERATION', value: '6000' }, assignedEmployee: 'Citra Dewi', requirementType: 'Stamp Only', status: 'Not Started', standardHours: 2, actualHours: 0, active: false, documents: ['Weld Inspection Standard', 'NDT Procedure'], routingInfo: 'Weld Inspection - weld gauge & UT', materials: ['Weld Gauge', 'UT Equipment'] },
  ],
}

export function getOperations(id) {
  return JSON.parse(localStorage.getItem(OP_KEY + id) || '[]')
}

export function saveOperations(id, rows) {
  localStorage.setItem(OP_KEY + id, JSON.stringify(rows))
}

export function updateWorkOrderStatus(id, status) {
  const wos = getWorkOrders()
  const idx = wos.findIndex(w => w.id === id)
  if (idx >= 0) {
    wos[idx] = { ...wos[idx], status }
    localStorage.setItem(WO_KEY, JSON.stringify(wos))
  }
}

export function seedIfEmpty() {
  if (localStorage.getItem(SEED_VERSION) !== '1') {
    localStorage.setItem(WO_KEY, JSON.stringify(seedWorkOrders))
    Object.entries(seedRouting).forEach(([id, rows]) => {
      localStorage.setItem(ROUTING_KEY + id, JSON.stringify(rows))
    })
    Object.entries(seedOperations).forEach(([id, rows]) => {
      localStorage.setItem(OP_KEY + id, JSON.stringify(rows))
    })
    seedBaselineRevisions()
    localStorage.setItem(SEED_VERSION, '1')
  }
}

export function getWorkOrders() {
  return JSON.parse(localStorage.getItem(WO_KEY) || '[]')
}

export function getWorkOrder(id) {
  return getWorkOrders().find(w => w.id === id)
}

export function getRouting(id) {
  return JSON.parse(localStorage.getItem(ROUTING_KEY + id) || '[]')
}

export function saveRouting(id, rows) {
  localStorage.setItem(ROUTING_KEY + id, JSON.stringify(rows))
}

// Seed a baseline "Rev. 01" revision for every existing sequence so the
// history always has at least a starting point. Only runs during seeding.
function seedBaselineRevisions() {
  Object.entries(seedRouting).forEach(([id, ops]) => {
    const rows = JSON.parse(localStorage.getItem(ROUTING_KEY + id) || '[]')
    const revs = []
    rows.forEach((op, opIdx) => {
      const seedOp = ops[opIdx] || {}
      ;(op.sequences || []).forEach((seq, seqIdx) => {
        const seedSeq = (seedOp.sequences || [])[seqIdx] || {}
        const editedBy = seedSeq.lastEdited || seq.lastEdited || 'System'
        revs.push({
          revisionNo: 'Rev. 01',
          dateTime: '05 Aug 2026, 09:20',
          timestamp: '2026-08-05T09:20:00.000Z',
          editedBy,
          summary: 'Initial scope',
          opNo: String(op.opNo),
          seqNo: String(seq.seqNo),
          prevScope: '',
          prevScopeFull: '',
          newScope: seq.scope || '',
          newScopeFull: seq.scopeFull || '',
        })
      })
    })
    if (revs.length) localStorage.setItem(REV_KEY + id, JSON.stringify(revs))
  })
}

// ====================== SCOPE REVISION HISTORY ======================
// Revisions are stored per work order (REV_KEY + id) as an array of entries.
// Each revision targets a specific sequence, identified by opNo + seqNo.

// Map current user names to their department for permission checks.
// Permission is based on department/role, NOT on a specific person's name.
const USER_DEPARTMENTS = {
  'Andi Pratama': 'ME',
  'Budi Santoso': 'ME',
  'Citra Dewi': 'QC',
  'Dedi Kurnia': 'WE',
}

export function getUserDepartment(userName) {
  return USER_DEPARTMENTS[userName] || 'ME'
}

// Current logged-in user. Structured so it can later read from the real
// auth account; for the prototype it defaults to the admin 'Andi Pratama'.
let currentUser = null
export function setCurrentUser(name) {
  currentUser = name
}
export function getCurrentUser() {
  return currentUser || 'Andi Pratama'
}

export function getScopeRevisions(id) {
  return JSON.parse(localStorage.getItem(REV_KEY + id) || '[]')
}

export function saveScopeRevisions(id, revs) {
  localStorage.setItem(REV_KEY + id, JSON.stringify(revs))
}

// Compute the next revision number for a given sequence.
// Scans existing revisions for that op+seq and returns the next number.
export function nextRevisionNo(id, opNo, seqNo) {
  const revs = getScopeRevisions(id).filter(
    r => String(r.opNo) === String(opNo) && String(r.seqNo) === String(seqNo)
  )
  let max = 0
  revs.forEach(r => {
    const m = String(r.revisionNo || '').match(/(\d+)/)
    if (m && parseInt(m[1]) > max) max = parseInt(m[1])
  })
  return max + 1
}

// Add a new revision entry for a sequence.
export function addScopeRevision(id, entry) {
  const revs = getScopeRevisions(id)
  revs.push(entry)
  localStorage.setItem(REV_KEY + id, JSON.stringify(revs))
  return revs
}

// Build a revision entry object with all required fields.
export function buildRevision({ id, opNo, seqNo, summary, prevScope, prevScopeFull, newScope, newScopeFull }) {
  const revNo = nextRevisionNo(id, opNo, seqNo)
  const now = new Date()
  return {
    revisionNo: `Rev. ${String(revNo).padStart(2, '0')}`,
    dateTime: now.toLocaleString('id-ID'),
    timestamp: now.toISOString(),
    editedBy: getCurrentUser(),
    summary,
    opNo: String(opNo),
    seqNo: String(seqNo),
    prevScope,
    prevScopeFull,
    newScope,
    newScopeFull,
  }
}

// Map a work center / machine code to a department code (ME, WE, QC, AS, CA, FN)
// Fallback: parse the WC prefix (WC-CNC -> ME, WC-QC -> QC, WC-WLD -> WE, etc.)
export function deptCodeFromWorkCenter(wc = '') {
  const w = String(wc).toUpperCase()
  if (w.includes('CNC') || w.includes('MACH') || w.includes('MILL') || w.includes('LATHE')) return 'ME'
  if (w.includes('WLD') || w.includes('WELD')) return 'WE'
  if (w.includes('QC') || w.includes('INSP') || w.includes('BENCH')) return 'QC'
  if (w.includes('ASM') || w.includes('ASSEM')) return 'AS'
  if (w.includes('CST') || w.includes('CAST')) return 'CA'
  if (w.includes('FIN')) return 'FN'
  const m = w.match(/WC-([A-Z]+)/)
  if (m) {
    const p = m[1]
    if (/CNC|MACH|LATHE|MILL/.test(p)) return 'ME'
    if (/WLD|WELD/.test(p)) return 'WE'
    if (/QC|INSP/.test(p)) return 'QC'
    if (/ASM|ASSEM/.test(p)) return 'AS'
    if (/CST|CAST/.test(p)) return 'CA'
    if (/FIN/.test(p)) return 'FN'
  }
  return 'ME'
}

// Aggregate unique department codes for a routing list
export function getAssignedDepartments(routing = []) {
  const codes = new Set()
  routing.forEach(op => {
    ;(op.sequences || []).forEach(seq => {
      if (seq.department) codes.add(seq.department)
    })
  })
  return Array.from(codes)
}

// Aggregate unique "working on" people across sequences
export function getWorkingOn(routing = []) {
  const names = new Set()
  routing.forEach(op => {
    ;(op.sequences || []).forEach(seq => {
      if (seq.workingOn && seq.workingOn !== '-') names.add(seq.workingOn)
    })
  })
  return Array.from(names)
}

// Determine the "last operation" (highest sequence number reached) for a routing list.
export function getLastOperation(routing = []) {
  if (!routing || routing.length === 0) return '-'
  const flat = []
  routing.forEach(op => {
    const seqs = op.sequences || []
    if (seqs.length === 0) {
      flat.push({ opNo: op.opNo, status: op.status || 'Not Started' })
    } else {
      seqs.forEach(seq => {
        flat.push({ opNo: op.opNo, status: seq.status || op.status || 'Not Started' })
      })
    }
  })
  if (flat.length === 0) return '-'

  const sorted = [...flat].sort((a, b) => (parseInt(a.opNo) || 0) - (parseInt(b.opNo) || 0))
  const last = sorted[sorted.length - 1]
  if (last.status === 'Completed') return last.opNo
  const furthestInProgress = [...sorted].reverse().find(s => s.status === 'In Progress' || s.status === 'Not Started')
  return furthestInProgress ? furthestInProgress.opNo : last.opNo
}

export function setSelectedWO(id) {
  sessionStorage.setItem('selected_wo', id)
}
export function getSelectedWO() {
  return sessionStorage.getItem('selected_wo')
}

export function setAuth(v) {
  sessionStorage.setItem(AUTH_KEY, v ? '1' : '0')
}
export function isAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

// Activity Log
export function getLogs(id) {
  return JSON.parse(localStorage.getItem(LOG_KEY + id) || '[]')
}
export function addLog(id, entry) {
  const logs = getLogs(id)
  logs.push({
    timestamp: new Date().toLocaleString('id-ID'),
    ...entry,
  })
  localStorage.setItem(LOG_KEY + id, JSON.stringify(logs))
  return logs
}
