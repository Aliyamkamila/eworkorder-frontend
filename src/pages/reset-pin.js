import '../main.js'

document.getElementById('resetForm').addEventListener('submit', (e) => {
  e.preventDefault()
  document.getElementById('resetFormState').classList.add('d-none')
  document.getElementById('successState').classList.remove('d-none')
})