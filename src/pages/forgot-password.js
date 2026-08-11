import '../main.js'

document.getElementById('forgotForm').addEventListener('submit', (e) => {
  e.preventDefault()
  window.location.href = '/reset-pin.html'
})