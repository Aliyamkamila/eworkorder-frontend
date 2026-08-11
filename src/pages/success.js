// src/pages/success.js
import '../main.js'
import { Toast } from 'bootstrap'

const params = new URLSearchParams(window.location.search)
const woId = params.get('wo')

document.getElementById('btnReturn').href = '/wo-detail.html'
document.getElementById('btnContinue').href = '/wo-detail.html'

const toast = new Toast(document.getElementById('successToast'))
toast.show()

// Optional: Add some animation or additional functionality
document.addEventListener('DOMContentLoaded', () => {
  // Get work order number if available
  if (woId) {
    const woNumber = document.getElementById('woNumber')
    if (woNumber) {
      woNumber.textContent = `WO-${woId}`
    }
  }

  // Auto redirect after 5 seconds if user doesn't click anything
  let redirectTimer = setTimeout(() => {
    window.location.href = '/wo-detail.html'
  }, 5000)

  // Clear timer if user interacts with buttons
  const buttons = document.querySelectorAll('#btnReturn, #btnContinue')
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      clearTimeout(redirectTimer)
    })
  })

  // Add countdown indicator
  const countdownEl = document.getElementById('countdown')
  if (countdownEl) {
    let seconds = 5
    const interval = setInterval(() => {
      seconds--
      if (seconds > 0) {
        countdownEl.textContent = seconds
      } else {
        clearInterval(interval)
      }
    }, 1000)
  }
})

// Export for testing purposes
export { woId }