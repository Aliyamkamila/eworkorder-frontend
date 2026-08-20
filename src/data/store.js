const WO_KEY = 'ewo_workorders'
const ROUTING_KEY = 'ewo_routing_'
const OP_KEY = 'ewo_operations_'
const AUTH_KEY = 'ewo_auth'
const LOG_KEY = 'ewo_log_'
const REV_KEY = 'ewo_scope_revisions_'
const SEED_VERSION = 'ewo_seed_v15'
export function resetAllData() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('ewo_'))
    .forEach(k => localStorage.removeItem(k))
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem('selected_wo')
}

const seedWorkOrders = [
  {
    "id": "WO-46869176",
    "jobNo": "46869176",
    "description": "WELLHEAD HSG UNIT, ASSY, 18-3/4, DMS-700, \nHIGH PRESSURE, 15,000 PSI MWP, 20 X 1 WALL, \nAPI 5L X-56 PIPE 20 FT LG EXTENSION, C/W  20 X \n1.000 WALL RL-4S PIN CONNECTOR DOWN AND \n8 EA CENTRALIZER RIBS WITH REINFORCEMENT GUSSET. \n \nMAX OD ....",
    "status": "Not Started",
    "qty": 1,
    "releaseDate": "2025-09-11",
    "startDate": "2025-09-11",
    "lastOperation": "-",
    "assignedTo": "-",
    "salesOrder": "-",
    "revision": "Rev.01",
    "uom": "UOM-46869176",
    "customer": "-",
    "createdDate": "2025-09-11",
    "createdBy": "System",
    "priority": "Normal",
    "department": "TA",
    "partNumber": "R117267-31RIL2"
  },
  {
    "id": "WO-55676506",
    "jobNo": "55676506",
    "description": "ULTI-MAX GT, PART, PIN, 80 KSI, RH, 22 X 1.000",
    "status": "Completed",
    "qty": 20,
    "releaseDate": "2026-07-13",
    "startDate": "2026-07-13",
    "lastOperation": "-",
    "assignedTo": "-",
    "salesOrder": "-",
    "revision": "Rev.01",
    "uom": "UOM-55676506",
    "customer": "-",
    "createdDate": "2026-07-13",
    "createdBy": "System",
    "priority": "Normal",
    "department": "TA",
    "partNumber": "H452231-15"
  },
  {
    "id": "WO-55814085",
    "jobNo": "55814085",
    "description": "INT JT, 36 OD X 1.5 WT, RL-2HCX BOX UP X PIN DOWN, API 5L X65 PIPE, 42.88 FT OAL",
    "status": "Completed",
    "qty": 10,
    "releaseDate": "2026-05-20",
    "startDate": "2026-05-20",
    "lastOperation": "-",
    "assignedTo": "-",
    "salesOrder": "-",
    "revision": "Rev.01",
    "uom": "UOM-55814085",
    "customer": "-",
    "createdDate": "2026-05-20",
    "createdBy": "System",
    "priority": "Normal",
    "department": "TA",
    "partNumber": "R49756-8"
  },
  {
    "id": "WO-58691715",
    "jobNo": "58691715",
    "description": "TUBING HGR W/ PUP, NON SMART WELL, HT-2, PRODUCTION, 18.750, 5,000 PSI MWP",
    "status": "Completed",
    "qty": 1,
    "releaseDate": "2026-05-15",
    "startDate": "2026-05-15",
    "lastOperation": "-",
    "assignedTo": "-",
    "salesOrder": "-",
    "revision": "Rev.01",
    "uom": "UOM-58691715",
    "customer": "-",
    "createdDate": "2026-05-15",
    "createdBy": "System",
    "priority": "Normal",
    "department": "TA",
    "partNumber": "AA1831924(QU1)"
  }
]

const seedRouting = {
  "WO-46869176": [
    {
      "opNo": "100",
      "description": "CLEAN UP",
      "workCenter": "WC-TA-01",
      "status": "Not Started",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA100",
          "department": "TA",
          "status": "Not Started",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$100$30"
          },
          "scope": "Operation 100",
          "scopeFull": "Operation 100 - 100 - CLEAN UP",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "200",
      "description": "WI RECORD TRACE",
      "workCenter": "WC-QC-01",
      "status": "Not Started",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "200"
      },
      "sequences": [
        {
          "seqNo": "3",
          "opCode": "QC200",
          "department": "QC",
          "status": "Not Started",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$200$3"
          },
          "scope": "Operation 200",
          "scopeFull": "Operation 200 - 200 - WI RECORD TRACE",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "500",
      "description": "PIPE INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Not Started",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC500",
          "department": "QC",
          "status": "Not Started",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$500$30"
          },
          "scope": "Operation 500",
          "scopeFull": "Operation 500 - 500 - PIPE INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "600",
      "description": "INSPECTION (MPI)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "600"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC600",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$600$20"
          },
          "scope": "Operation 600",
          "scopeFull": "Operation 600 - 600 - INSPECTION (MPI)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "700",
      "description": "UTG INSPECT (PRIOR WELD)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "700"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC700",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$700$30"
          },
          "scope": "Operation 700",
          "scopeFull": "Operation 700 - 700 - UTG INSPECT (PRIOR WELD)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1000",
      "description": "FIT UP CONNR",
      "workCenter": "WC-WELD-01",
      "status": "Not Started",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD1000",
          "department": "WELD",
          "status": "Not Started",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$1000$30"
          },
          "scope": "Operation 1000",
          "scopeFull": "Operation 1000 - 1000 - FIT UP CONNR",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1100",
      "description": "FIT UP INSPECT CONNR",
      "workCenter": "WC-QC-01",
      "status": "Not Started",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC1100",
          "department": "QC",
          "status": "Not Started",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$1100$30"
          },
          "scope": "Operation 1100",
          "scopeFull": "Operation 1100 - 1100 - FIT UP INSPECT CONNR",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1500",
      "description": "SUBARC CONNR",
      "workCenter": "WC-WELD-01",
      "status": "Not Started",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD1500",
          "department": "WELD",
          "status": "Not Started",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$1500$30"
          },
          "scope": "Operation 1500",
          "scopeFull": "Operation 1500 - 1500 - SUBARC CONNR",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1600",
      "description": "VISUAL INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1600"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC1600",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$1600$30"
          },
          "scope": "Operation 1600",
          "scopeFull": "Operation 1600 - 1600 - VISUAL INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2000",
      "description": "FITTING WH MS-700",
      "workCenter": "WC-WELD-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD2000",
          "department": "WELD",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$2000$30"
          },
          "scope": "Operation 2000",
          "scopeFull": "Operation 2000 - 2000 - FITTING WH MS-700",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2100",
      "description": "FIT UP INSPECT WH MS-700",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC2100",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$2100$30"
          },
          "scope": "Operation 2100",
          "scopeFull": "Operation 2100 - 2100 - FIT UP INSPECT WH MS-700",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2300",
      "description": "GTAW WH MS-700",
      "workCenter": "WC-WELD-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2300"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD2300",
          "department": "WELD",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$2300$30"
          },
          "scope": "Operation 2300",
          "scopeFull": "Operation 2300 - 2300 - GTAW WH MS-700",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2500",
      "description": "SUBARC WH MS-700",
      "workCenter": "WC-WELD-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD2500",
          "department": "WELD",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$2500$30"
          },
          "scope": "Operation 2500",
          "scopeFull": "Operation 2500 - 2500 - SUBARC WH MS-700",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2600",
      "description": "VISUAL INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2600"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC2600",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$2600$30"
          },
          "scope": "Operation 2600",
          "scopeFull": "Operation 2600 - 2600 - VISUAL INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "3200",
      "description": "UTG INSPECT (PRIOR GRIND)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3200"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC3200",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$3200$30"
          },
          "scope": "Operation 3200",
          "scopeFull": "Operation 3200 - 3200 - UTG INSPECT (PRIOR GRIND)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "3400",
      "description": "UTG INSPECT (WELD)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3400"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC3400",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$3400$30"
          },
          "scope": "Operation 3400",
          "scopeFull": "Operation 3400 - 3400 - UTG INSPECT (WELD)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "3500",
      "description": "INSPECTION (MPI)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC3500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$3500$30"
          },
          "scope": "Operation 3500",
          "scopeFull": "Operation 3500 - 3500 - INSPECTION (MPI)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "3600",
      "description": "INSPECTION (PAUT)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3600"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC3600",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$3600$30"
          },
          "scope": "Operation 3600",
          "scopeFull": "Operation 3600 - 3600 - INSPECTION (PAUT)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "4200",
      "description": "INSPECTION (MPI)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4200"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC4200",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$4200$30"
          },
          "scope": "Operation 4200",
          "scopeFull": "Operation 4200 - 4200 - INSPECTION (MPI)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "4300",
      "description": "INSPECTION (PAUT)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4300"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC4300",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$4300$30"
          },
          "scope": "Operation 4300",
          "scopeFull": "Operation 4300 - 4300 - INSPECTION (PAUT)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "4500",
      "description": "HARDNESS CHECK",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC4500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$4500$30"
          },
          "scope": "Operation 4500",
          "scopeFull": "Operation 4500 - 4500 - HARDNESS CHECK",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "5000",
      "description": "FIT UP RIB & PLATE",
      "workCenter": "WC-WELD-01",
      "status": "Not Started",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD5000",
          "department": "WELD",
          "status": "Not Started",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$5000$30"
          },
          "scope": "Operation 5000",
          "scopeFull": "Operation 5000 - 5000 - FIT UP RIB & PLATE",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "5100",
      "description": "INSPECTION F/T",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC5100",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$5100$30"
          },
          "scope": "Operation 5100",
          "scopeFull": "Operation 5100 - 5100 - INSPECTION F/T",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "5200",
      "description": "WELDING RIB & PLATE",
      "workCenter": "WC-WELD-01",
      "status": "Not Started",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5200"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD5200",
          "department": "WELD",
          "status": "Not Started",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$5200$30"
          },
          "scope": "Operation 5200",
          "scopeFull": "Operation 5200 - 5200 - WELDING RIB & PLATE",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "5300",
      "description": "VISUAL INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5300"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC5300",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$5300$30"
          },
          "scope": "Operation 5300",
          "scopeFull": "Operation 5300 - 5300 - VISUAL INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "5500",
      "description": "MPI INSPECT (WELDING)",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC5500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$5500$30"
          },
          "scope": "Operation 5500",
          "scopeFull": "Operation 5500 - 5500 - MPI INSPECT (WELDING)",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "5600",
      "description": "FINAL STRAIGHTNESS INSPECT",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5600"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC5600",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$5600$30"
          },
          "scope": "Operation 5600",
          "scopeFull": "Operation 5600 - 5600 - FINAL STRAIGHTNESS INSPECT",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "6000",
      "description": "IDENTIFICATION",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "6000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA6000",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$6000$30"
          },
          "scope": "Operation 6000",
          "scopeFull": "Operation 6000 - 6000 - IDENTIFICATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "6500",
      "description": "RECORD & VERIFY TRACE ASSY",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "6500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC6500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$6500$30"
          },
          "scope": "Operation 6500",
          "scopeFull": "Operation 6500 - 6500 - RECORD & VERIFY TRACE ASSY",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "9500",
      "description": "FINAL INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC9500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "46869176$9500$30"
          },
          "scope": "Operation 9500",
          "scopeFull": "Operation 9500 - 9500 - FINAL INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    }
  ],
  "WO-55676506": [
    {
      "opNo": "400",
      "description": "CLEAN UP",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "400"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA400",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$400$30"
          },
          "scope": "Operation 400",
          "scopeFull": "Operation 400 - 400 - CLEAN UP",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1000",
      "description": "TURNING THREAD",
      "workCenter": "WC-MACH-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "MACH1000",
          "department": "MACH",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$1000$30"
          },
          "scope": "Operation 1000",
          "scopeFull": "Operation 1000 - 1000 - TURNING THREAD",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1100",
      "description": "QC INSPECT",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC1100",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$1100$30"
          },
          "scope": "Operation 1100",
          "scopeFull": "Operation 1100 - 1100 - QC INSPECT",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1500",
      "description": "MILLING SLOT",
      "workCenter": "WC-MACH-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "MACH1500",
          "department": "MACH",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$1500$30"
          },
          "scope": "Operation 1500",
          "scopeFull": "Operation 1500 - 1500 - MILLING SLOT",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1600",
      "description": "1'ST INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1600"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC1600",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$1600$30"
          },
          "scope": "Operation 1600",
          "scopeFull": "Operation 1600 - 1600 - 1'ST INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2000",
      "description": "IDENTIFY",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA2000",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$2000$30"
          },
          "scope": "Operation 2000",
          "scopeFull": "Operation 2000 - 2000 - IDENTIFY",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2500",
      "description": "DEBURR",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA2500",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$2500$30"
          },
          "scope": "Operation 2500",
          "scopeFull": "Operation 2500 - 2500 - DEBURR",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2700",
      "description": "SAMPLING INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2700"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC2700",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$2700$30"
          },
          "scope": "Operation 2700",
          "scopeFull": "Operation 2700 - 2700 - SAMPLING INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "4000",
      "description": "CLEAN UP",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA4000",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$4000$30"
          },
          "scope": "Operation 4000",
          "scopeFull": "Operation 4000 - 4000 - CLEAN UP",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "4100",
      "description": "PHOSPHATING",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA4100",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$4100$30"
          },
          "scope": "Operation 4100",
          "scopeFull": "Operation 4100 - 4100 - PHOSPHATING",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "4200",
      "description": "ADHESION INSPECT",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4200"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC4200",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$4200$30"
          },
          "scope": "Operation 4200",
          "scopeFull": "Operation 4200 - 4200 - ADHESION INSPECT",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "4500",
      "description": "FUNCTION TEST",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA4500",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$4500$30"
          },
          "scope": "Operation 4500",
          "scopeFull": "Operation 4500 - 4500 - FUNCTION TEST",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "4600",
      "description": "INSPECTION F/T",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4600"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC4600",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$4600$30"
          },
          "scope": "Operation 4600",
          "scopeFull": "Operation 4600 - 4600 - INSPECTION F/T",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "8800",
      "description": "RECORD TRACEABILITY PART",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "8800"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA8800",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$8800$30"
          },
          "scope": "Operation 8800",
          "scopeFull": "Operation 8800 - 8800 - RECORD TRACEABILITY PART",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "8900",
      "description": "VERIFY RECORD TRACE",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "8900"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC8900",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$8900$20"
          },
          "scope": "Operation 8900",
          "scopeFull": "Operation 8900 - 8900 - VERIFY RECORD TRACE",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "9000",
      "description": "ASSEMBLY & PRESERVATION",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA9000",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$9000$30"
          },
          "scope": "Operation 9000",
          "scopeFull": "Operation 9000 - 9000 - ASSEMBLY & PRESERVATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "9500",
      "description": "FINAL INSPECT",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC9500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55676506$9500$30"
          },
          "scope": "Operation 9500",
          "scopeFull": "Operation 9500 - 9500 - FINAL INSPECT",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    }
  ],
  "WO-55814085": [
    {
      "opNo": "100",
      "description": "CLEAN UP",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA100",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$100$30"
          },
          "scope": "Operation 100",
          "scopeFull": "Operation 100 - 100 - CLEAN UP",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "500",
      "description": "WI RECORD & VERIFY TRACE",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$500$30"
          },
          "scope": "Operation 500",
          "scopeFull": "Operation 500 - 500 - WI RECORD & VERIFY TRACE",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1000",
      "description": "FIT UP",
      "workCenter": "WC-WELD-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD1000",
          "department": "WELD",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$1000$30"
          },
          "scope": "Operation 1000",
          "scopeFull": "Operation 1000 - 1000 - FIT UP",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1100",
      "description": "FIT UP INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC1100",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$1100$30"
          },
          "scope": "Operation 1100",
          "scopeFull": "Operation 1100 - 1100 - FIT UP INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1300",
      "description": "ROOT PASS",
      "workCenter": "WC-WELD-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1300"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD1300",
          "department": "WELD",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$1300$30"
          },
          "scope": "Operation 1300",
          "scopeFull": "Operation 1300 - 1300 - ROOT PASS",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "1500",
      "description": "SUBARC CONNR",
      "workCenter": "WC-WELD-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "WELD1500",
          "department": "WELD",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$1500$30"
          },
          "scope": "Operation 1500",
          "scopeFull": "Operation 1500 - 1500 - SUBARC CONNR",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "2000",
      "description": "VISUAL INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC2000",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$2000$30"
          },
          "scope": "Operation 2000",
          "scopeFull": "Operation 2000 - 2000 - VISUAL INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "3000",
      "description": "MPI INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC3000",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$3000$30"
          },
          "scope": "Operation 3000",
          "scopeFull": "Operation 3000 - 3000 - MPI INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "3100",
      "description": "PAUT INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3100"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC3100",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$3100$30"
          },
          "scope": "Operation 3100",
          "scopeFull": "Operation 3100 - 3100 - PAUT INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "3400",
      "description": "MPI INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3400"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC3400",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$3400$30"
          },
          "scope": "Operation 3400",
          "scopeFull": "Operation 3400 - 3400 - MPI INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "3500",
      "description": "PAUT INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3500"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC3500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$3500$20"
          },
          "scope": "Operation 3500",
          "scopeFull": "Operation 3500 - 3500 - PAUT INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "8000",
      "description": "IDENTIFICATION",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "8000"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "TA8000",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$8000$30"
          },
          "scope": "Operation 8000",
          "scopeFull": "Operation 8000 - 8000 - IDENTIFICATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "8500",
      "description": "RECORD & VERIFY TRACE",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "8500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC8500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$8500$30"
          },
          "scope": "Operation 8500",
          "scopeFull": "Operation 8500 - 8500 - RECORD & VERIFY TRACE",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "9500",
      "description": "FINAL INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9500"
      },
      "sequences": [
        {
          "seqNo": "30",
          "opCode": "QC9500",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "55814085$9500$30"
          },
          "scope": "Operation 9500",
          "scopeFull": "Operation 9500 - 9500 - FINAL INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    }
  ],
  "WO-58691715": [
    {
      "opNo": "100",
      "description": "CLEANING AND TRACEABILITY RECORD",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "100"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "TA100",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$100$20"
          },
          "scope": "Operation 100",
          "scopeFull": "Operation 100 - 100 - CLEANING AND TRACEABILITY RECORD",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "200",
      "description": "QC OUTGOING AND GATE CONTROL VERIFICATION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "200"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC200",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$200$20"
          },
          "scope": "Operation 200",
          "scopeFull": "Operation 200 - 200 - QC OUTGOING AND GATE CONTROL VERIFICATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "400",
      "description": "QC INCOMING AND GATE CONTROL VERIFICATION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "400"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC400",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$400$20"
          },
          "scope": "Operation 400",
          "scopeFull": "Operation 400 - 400 - QC INCOMING AND GATE CONTROL VERIFICATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "500",
      "description": "CONFIGURING EQUIPMENT PER PROCEDURE AAA653803",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "500"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "TA500",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$500$20"
          },
          "scope": "Operation 500",
          "scopeFull": "Operation 500 - 500 - CONFIGURING EQUIPMENT PER PROCEDURE AAA653803",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "510",
      "description": "HYDROTEST OF TBG HGR W/ PUP-JOINT",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "510"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "TA510",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$510$20"
          },
          "scope": "Operation 510",
          "scopeFull": "Operation 510 - 510 - FAT - HYDROTEST OF TBG HGR W/ PUP-JOINT",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "520",
      "description": "QC INSPECTION AND VERIFICATION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "520"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC520",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$520$20"
          },
          "scope": "Operation 520",
          "scopeFull": "Operation 520 - 520 - QC INSPECTION AND VERIFICATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "530",
      "description": "GAS TEST OF TBG HGR W/ PUP-JOINT",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "530"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "TA530",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$530$20"
          },
          "scope": "Operation 530",
          "scopeFull": "Operation 530 - 530 - FAT - GAS TEST OF TBG HGR W/ PUP-JOINT",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "540",
      "description": "QC INSPECTION AND VERIFICATION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "540"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC540",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$540$20"
          },
          "scope": "Operation 540",
          "scopeFull": "Operation 540 - 540 - QC INSPECTION AND VERIFICATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "550",
      "description": "PRESSURE INTEGRITY TEST",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "550"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "TA550",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$550$20"
          },
          "scope": "Operation 550",
          "scopeFull": "Operation 550 - 550 - FAT - PRESSURE INTEGRITY TEST",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "560",
      "description": "QC INSPECTION AND VERIFICATION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "560"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC560",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$560$20"
          },
          "scope": "Operation 560",
          "scopeFull": "Operation 560 - 560 - QC INSPECTION AND VERIFICATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "700",
      "description": "TBG HGR W/ PUP-JOINT FINAL PREPARATION",
      "workCenter": "WC-TA-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "700"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "TA700",
          "department": "TA",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$700$20"
          },
          "scope": "Operation 700",
          "scopeFull": "Operation 700 - 700 - FAT - TBG HGR W/ PUP-JOINT FINAL PREPARATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "800",
      "description": "QC INSPECTION AND VERIFICATION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "800"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC800",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$800$20"
          },
          "scope": "Operation 800",
          "scopeFull": "Operation 800 - 800 - QC INSPECTION AND VERIFICATION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    },
    {
      "opNo": "9000",
      "description": "FINAL INSPECTION",
      "workCenter": "WC-QC-01",
      "status": "Completed",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9000"
      },
      "sequences": [
        {
          "seqNo": "20",
          "opCode": "QC9000",
          "department": "QC",
          "status": "Completed",
          "workingOn": "-",
          "barcode": {
            "exists": true,
            "type": "RESOURCE_SEQUENCE",
            "value": "58691715$9000$20"
          },
          "scope": "Operation 9000",
          "scopeFull": "Operation 9000 - 9000 - FINAL INSPECTION",
          "lastEdited": "System",
          "lastEditedBy": "System",
          "lastEditedAt": "2026-08-20T08:00:00.000Z",
          "iar": "",
          "qualityOrder": "",
          "qtyAccepted": "",
          "qtyScrapped": ""
        }
      ]
    }
  ]
}

const seedOperations = {
  "WO-46869176": [
    {
      "opNo": "100",
      "name": "CLEAN UP",
      "department": "TA",
      "operationCode": "TA100",
      "machine": "TA100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Not Started",
      "standardHours": 0.17,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "200",
      "name": "WI RECORD TRACE",
      "department": "QC",
      "operationCode": "QC200",
      "machine": "QC200",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "200"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Not Started",
      "standardHours": 0.16,
      "actualHours": 3.44,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 200",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "500",
      "name": "PIPE INSPECTION",
      "department": "QC",
      "operationCode": "QC500",
      "machine": "QC500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Not Started",
      "standardHours": 0.25,
      "actualHours": 0.65,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "600",
      "name": "INSPECTION (MPI)",
      "department": "QC",
      "operationCode": "QC600",
      "machine": "QC600",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "600"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.37,
      "actualHours": 2.44,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 600",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "700",
      "name": "UTG INSPECT (PRIOR WELD)",
      "department": "QC",
      "operationCode": "QC700",
      "machine": "QC700",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "700"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.42,
      "actualHours": 2.44,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 700",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1000",
      "name": "FIT UP CONNR",
      "department": "WELD",
      "operationCode": "WELD1000",
      "machine": "WELD1000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1000"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Not Started",
      "standardHours": 0.83,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1100",
      "name": "FIT UP INSPECT CONNR",
      "department": "QC",
      "operationCode": "QC1100",
      "machine": "QC1100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Not Started",
      "standardHours": 0.1,
      "actualHours": 3.45,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1500",
      "name": "SUBARC CONNR",
      "department": "WELD",
      "operationCode": "WELD1500",
      "machine": "WELD1500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Not Started",
      "standardHours": 1.75,
      "actualHours": 1.22,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1600",
      "name": "VISUAL INSPECTION",
      "department": "QC",
      "operationCode": "QC1600",
      "machine": "QC1600",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1600"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 0.29,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1600",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2000",
      "name": "FITTING WH MS-700",
      "department": "WELD",
      "operationCode": "WELD2000",
      "machine": "WELD2000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 2.0,
      "actualHours": 8.96,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2100",
      "name": "FIT UP INSPECT WH MS-700",
      "department": "QC",
      "operationCode": "QC2100",
      "machine": "QC2100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 0.41,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2300",
      "name": "GTAW WH MS-700",
      "department": "WELD",
      "operationCode": "WELD2300",
      "machine": "WELD2300",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2300"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 2.58,
      "actualHours": 4.66,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2300",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2500",
      "name": "SUBARC WH MS-700",
      "department": "WELD",
      "operationCode": "WELD2500",
      "machine": "WELD2500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 3.5,
      "actualHours": 1.52,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2600",
      "name": "VISUAL INSPECTION",
      "department": "QC",
      "operationCode": "QC2600",
      "machine": "QC2600",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2600"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 2.18,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2600",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "3200",
      "name": "UTG INSPECT (PRIOR GRIND)",
      "department": "QC",
      "operationCode": "QC3200",
      "machine": "QC3200",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3200"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.58,
      "actualHours": 0.56,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 3200",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "3400",
      "name": "UTG INSPECT (WELD)",
      "department": "QC",
      "operationCode": "QC3400",
      "machine": "QC3400",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3400"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.58,
      "actualHours": 0.59,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 3400",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "3500",
      "name": "INSPECTION (MPI)",
      "department": "QC",
      "operationCode": "QC3500",
      "machine": "QC3500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.38,
      "actualHours": 0.55,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 3500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "3600",
      "name": "INSPECTION (PAUT)",
      "department": "QC",
      "operationCode": "QC3600",
      "machine": "QC3600",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3600"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.33,
      "actualHours": 1.15,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 3600",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "4200",
      "name": "INSPECTION (MPI)",
      "department": "QC",
      "operationCode": "QC4200",
      "machine": "QC4200",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4200"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.75,
      "actualHours": 0.6,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 4200",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "4300",
      "name": "INSPECTION (PAUT)",
      "department": "QC",
      "operationCode": "QC4300",
      "machine": "QC4300",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4300"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.66,
      "actualHours": 1.71,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 4300",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "4500",
      "name": "HARDNESS CHECK",
      "department": "QC",
      "operationCode": "QC4500",
      "machine": "QC4500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.68,
      "actualHours": 1.06,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 4500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "5000",
      "name": "FIT UP RIB & PLATE",
      "department": "WELD",
      "operationCode": "WELD5000",
      "machine": "WELD5000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5000"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Not Started",
      "standardHours": 2.0,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 5000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "5100",
      "name": "INSPECTION F/T",
      "department": "QC",
      "operationCode": "QC5100",
      "machine": "QC5100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.2,
      "actualHours": 1.55,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 5100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "5200",
      "name": "WELDING RIB & PLATE",
      "department": "WELD",
      "operationCode": "WELD5200",
      "machine": "WELD5200",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5200"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Not Started",
      "standardHours": 18.0,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 5200",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "5300",
      "name": "VISUAL INSPECTION",
      "department": "QC",
      "operationCode": "QC5300",
      "machine": "QC5300",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5300"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 1.03,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 5300",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "5500",
      "name": "MPI INSPECT (WELDING)",
      "department": "QC",
      "operationCode": "QC5500",
      "machine": "QC5500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.0,
      "actualHours": 1.24,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 5500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "5600",
      "name": "FINAL STRAIGHTNESS INSPECT",
      "department": "QC",
      "operationCode": "QC5600",
      "machine": "QC5600",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "5600"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.42,
      "actualHours": 1.06,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 5600",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "6000",
      "name": "IDENTIFICATION",
      "department": "TA",
      "operationCode": "TA6000",
      "machine": "TA6000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "6000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.5,
      "actualHours": 0.04,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 6000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "6500",
      "name": "RECORD & VERIFY TRACE ASSY",
      "department": "QC",
      "operationCode": "QC6500",
      "machine": "QC6500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "6500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 4.1,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 6500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "9500",
      "name": "FINAL INSPECTION",
      "department": "QC",
      "operationCode": "QC9500",
      "machine": "QC9500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.2,
      "actualHours": 0.86,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 9500",
      "materials": [
        "Material"
      ]
    }
  ],
  "WO-55676506": [
    {
      "opNo": "400",
      "name": "CLEAN UP",
      "department": "TA",
      "operationCode": "TA400",
      "machine": "TA400",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "400"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 0.13,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 400",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1000",
      "name": "TURNING THREAD",
      "department": "MACH",
      "operationCode": "MACH1000",
      "machine": "MACH1000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 2.57,
      "actualHours": 48.99,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1100",
      "name": "QC INSPECT",
      "department": "QC",
      "operationCode": "QC1100",
      "machine": "QC1100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.17,
      "actualHours": 2.51,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1500",
      "name": "MILLING SLOT",
      "department": "MACH",
      "operationCode": "MACH1500",
      "machine": "MACH1500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 38.2,
      "actualHours": 38.51,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1600",
      "name": "1'ST INSPECTION",
      "department": "QC",
      "operationCode": "QC1600",
      "machine": "QC1600",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1600"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.6,
      "actualHours": 1.51,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1600",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2000",
      "name": "IDENTIFY",
      "department": "TA",
      "operationCode": "TA2000",
      "machine": "TA2000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 2.0,
      "actualHours": 0.1,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2500",
      "name": "DEBURR",
      "department": "TA",
      "operationCode": "TA2500",
      "machine": "TA2500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 6.0,
      "actualHours": 0.01,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2700",
      "name": "SAMPLING INSPECTION",
      "department": "QC",
      "operationCode": "QC2700",
      "machine": "QC2700",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2700"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 25.0,
      "actualHours": 1.23,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2700",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "4000",
      "name": "CLEAN UP",
      "department": "TA",
      "operationCode": "TA4000",
      "machine": "TA4000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 2.0,
      "actualHours": 0.61,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 4000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "4100",
      "name": "PHOSPHATING",
      "department": "TA",
      "operationCode": "TA4100",
      "machine": "TA4100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 6.6,
      "actualHours": 0.66,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 4100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "4200",
      "name": "ADHESION INSPECT",
      "department": "QC",
      "operationCode": "QC4200",
      "machine": "QC4200",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4200"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.6,
      "actualHours": 0.58,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 4200",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "4500",
      "name": "FUNCTION TEST",
      "department": "TA",
      "operationCode": "TA4500",
      "machine": "TA4500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.0,
      "actualHours": 0.16,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 4500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "4600",
      "name": "INSPECTION F/T",
      "department": "QC",
      "operationCode": "QC4600",
      "machine": "QC4600",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "4600"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.4,
      "actualHours": 0.39,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 4600",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "8800",
      "name": "RECORD TRACEABILITY PART",
      "department": "TA",
      "operationCode": "TA8800",
      "machine": "TA8800",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "8800"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.2,
      "actualHours": 0.24,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 8800",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "8900",
      "name": "VERIFY RECORD TRACE",
      "department": "QC",
      "operationCode": "QC8900",
      "machine": "QC8900",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "8900"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.8,
      "actualHours": 0.76,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 8900",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "9000",
      "name": "ASSEMBLY & PRESERVATION",
      "department": "TA",
      "operationCode": "TA9000",
      "machine": "TA9000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 2.0,
      "actualHours": 0.26,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 9000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "9500",
      "name": "FINAL INSPECT",
      "department": "QC",
      "operationCode": "QC9500",
      "machine": "QC9500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 2.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 9500",
      "materials": [
        "Material"
      ]
    }
  ],
  "WO-55814085": [
    {
      "opNo": "100",
      "name": "CLEAN UP",
      "department": "TA",
      "operationCode": "TA100",
      "machine": "TA100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 5.0,
      "actualHours": 1.16,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "500",
      "name": "WI RECORD & VERIFY TRACE",
      "department": "QC",
      "operationCode": "QC500",
      "machine": "QC500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.0,
      "actualHours": 1.78,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1000",
      "name": "FIT UP",
      "department": "WELD",
      "operationCode": "WELD1000",
      "machine": "WELD1000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 30.0,
      "actualHours": 20.55,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1100",
      "name": "FIT UP INSPECTION",
      "department": "QC",
      "operationCode": "QC1100",
      "machine": "QC1100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.0,
      "actualHours": 2.78,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1300",
      "name": "ROOT PASS",
      "department": "WELD",
      "operationCode": "WELD1300",
      "machine": "WELD1300",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1300"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 73.2,
      "actualHours": 120.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1300",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "1500",
      "name": "SUBARC CONNR",
      "department": "WELD",
      "operationCode": "WELD1500",
      "machine": "WELD1500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "1500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 163.2,
      "actualHours": 82.51,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 1500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "2000",
      "name": "VISUAL INSPECTION",
      "department": "QC",
      "operationCode": "QC2000",
      "machine": "QC2000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "2000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.0,
      "actualHours": 1.9,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 2000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "3000",
      "name": "MPI INSPECTION",
      "department": "QC",
      "operationCode": "QC3000",
      "machine": "QC3000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 13.0,
      "actualHours": 12.86,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 3000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "3100",
      "name": "PAUT INSPECTION",
      "department": "QC",
      "operationCode": "QC3100",
      "machine": "QC3100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3100"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 12.0,
      "actualHours": 14.63,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 3100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "3400",
      "name": "MPI INSPECTION",
      "department": "QC",
      "operationCode": "QC3400",
      "machine": "QC3400",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3400"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 13.0,
      "actualHours": 19.64,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 3400",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "3500",
      "name": "PAUT INSPECTION",
      "department": "QC",
      "operationCode": "QC3500",
      "machine": "QC3500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "3500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 12.0,
      "actualHours": 11.83,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 3500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "8000",
      "name": "IDENTIFICATION",
      "department": "TA",
      "operationCode": "TA8000",
      "machine": "TA8000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "8000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.7,
      "actualHours": 0.22,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 8000",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "8500",
      "name": "RECORD & VERIFY TRACE",
      "department": "QC",
      "operationCode": "QC8500",
      "machine": "QC8500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "8500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 1.0,
      "actualHours": 0.82,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 8500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "9500",
      "name": "FINAL INSPECTION",
      "department": "QC",
      "operationCode": "QC9500",
      "machine": "QC9500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9500"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 2.0,
      "actualHours": 2.02,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 9500",
      "materials": [
        "Material"
      ]
    }
  ],
  "WO-58691715": [
    {
      "opNo": "100",
      "name": "CLEANING AND TRACEABILITY RECORD",
      "department": "TA",
      "operationCode": "TA100",
      "machine": "TA100",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "100"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 0.25,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 100",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "200",
      "name": "QC OUTGOING AND GATE CONTROL VERIFICATION",
      "department": "QC",
      "operationCode": "QC200",
      "machine": "QC200",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "200"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 0.25,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 200",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "400",
      "name": "QC INCOMING AND GATE CONTROL VERIFICATION",
      "department": "QC",
      "operationCode": "QC400",
      "machine": "QC400",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "400"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 0.25,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 400",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "500",
      "name": "CONFIGURING EQUIPMENT PER PROCEDURE AAA653803",
      "department": "TA",
      "operationCode": "TA500",
      "machine": "TA500",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "500"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 4.0,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 500",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "510",
      "name": "HYDROTEST OF TBG HGR W/ PUP-JOINT",
      "department": "TA",
      "operationCode": "TA510",
      "machine": "TA510",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "510"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 12.0,
      "actualHours": 3.54,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 510",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "520",
      "name": "QC INSPECTION AND VERIFICATION",
      "department": "QC",
      "operationCode": "QC520",
      "machine": "QC520",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "520"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 520",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "530",
      "name": "GAS TEST OF TBG HGR W/ PUP-JOINT",
      "department": "TA",
      "operationCode": "TA530",
      "machine": "TA530",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "530"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 12.0,
      "actualHours": 6.47,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 530",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "540",
      "name": "QC INSPECTION AND VERIFICATION",
      "department": "QC",
      "operationCode": "QC540",
      "machine": "QC540",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "540"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 540",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "550",
      "name": "PRESSURE INTEGRITY TEST",
      "department": "TA",
      "operationCode": "TA550",
      "machine": "TA550",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "550"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 12.0,
      "actualHours": 4.26,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 550",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "560",
      "name": "QC INSPECTION AND VERIFICATION",
      "department": "QC",
      "operationCode": "QC560",
      "machine": "QC560",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "560"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 560",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "700",
      "name": "TBG HGR W/ PUP-JOINT FINAL PREPARATION",
      "department": "TA",
      "operationCode": "TA700",
      "machine": "TA700",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "700"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 3.0,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 700",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "800",
      "name": "QC INSPECTION AND VERIFICATION",
      "department": "QC",
      "operationCode": "QC800",
      "machine": "QC800",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "800"
      },
      "assignedEmployee": "-",
      "requirementType": "Stamp Only",
      "status": "Completed",
      "standardHours": 0.1,
      "actualHours": 0.0,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 800",
      "materials": [
        "Material"
      ]
    },
    {
      "opNo": "9000",
      "name": "FINAL INSPECTION",
      "department": "QC",
      "operationCode": "QC9000",
      "machine": "QC9000",
      "barcode": {
        "exists": true,
        "type": "OPERATION",
        "value": "9000"
      },
      "assignedEmployee": "-",
      "requirementType": "Clock Required",
      "status": "Completed",
      "standardHours": 0.25,
      "actualHours": 0.91,
      "active": false,
      "documents": [
        "Procedure"
      ],
      "routingInfo": "Operation 9000",
      "materials": [
        "Material"
      ]
    }
  ]
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

const USER_DEPARTMENTS = {
  'Andi Pratama': 'ME',
  'Budi Santoso': 'ME',
  'Citra Dewi': 'QC',
  'Dedi Kurnia': 'WE',
}

export function getUserDepartment(userName) {
  return USER_DEPARTMENTS[userName] || 'ME'
}

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

export function addScopeRevision(id, entry) {
  const revs = getScopeRevisions(id)
  revs.push(entry)
  localStorage.setItem(REV_KEY + id, JSON.stringify(revs))
  return revs
}

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

export function getAssignedDepartments(routing = []) {
  const codes = new Set()
  routing.forEach(op => {
    ;(op.sequences || []).forEach(seq => {
      if (seq.department) codes.add(seq.department)
    })
  })
  return Array.from(codes)
}

export function getWorkingOn(routing = []) {
  const names = new Set()
  routing.forEach(op => {
    ;(op.sequences || []).forEach(seq => {
      if (seq.workingOn && seq.workingOn !== '-') names.add(seq.workingOn)
    })
  })
  return Array.from(names)
}

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
