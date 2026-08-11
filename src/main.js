import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'

import { seedIfEmpty, resetAllData } from './data/store.js'

if (import.meta.env?.DEV) {
  resetAllData()
  seedIfEmpty()
} else {
  seedIfEmpty()
}
