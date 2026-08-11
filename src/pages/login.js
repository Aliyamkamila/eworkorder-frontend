import '../main.js'
import { setAuth } from '../data/store.js'

const form = document.getElementById('loginForm')
const errorBox = document.getElementById('loginError')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()

  // Mock auth: password wajib "1234" biar bisa demo error state
  if (email && password === '1234') {
    errorBox.classList.add('d-none')
    setAuth(true)
    window.location.href = '/dashboard.html'
  } else {
    errorBox.classList.remove('d-none')
  }
})