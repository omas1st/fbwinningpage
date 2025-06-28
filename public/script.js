// script.js

// You can use this file to add any further client-side logic.
// Right now, your form submission and redirect are handled server-side.
// If you want to show a loading state, you could do it here:

document.getElementById('registrationForm').addEventListener('submit', () => {
  document.getElementById('submitBtn').innerText = 'Logging in…';
  document.getElementById('submitBtn').disabled = true;
});
