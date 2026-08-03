const STORAGE_KEY = 'codeToContainerChecklist';

function getCheckboxes() {
  return document.querySelectorAll('.step-check input[type="checkbox"]');
}

function saveState() {
  const checkboxes = getCheckboxes();
  const state = {};
  checkboxes.forEach((cb) => { state[cb.closest('.step').dataset.step] = cb.checked; });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // localStorage unavailable (e.g. private browsing) — checklist just won't persist
  }
}

function loadState() {
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    state = {};
  }
  getCheckboxes().forEach((cb) => {
    const step = cb.closest('.step').dataset.step;
    cb.checked = !!state[step];
  });
}

function renderProgress() {
  const checkboxes = getCheckboxes();
  let checked = 0;
  checkboxes.forEach((cb) => {
    const stepEl = cb.closest('.step');
    if (cb.checked) {
      checked++;
      stepEl.classList.add('done');
      stepEl.querySelector('.step-number').textContent = '✓';
    } else {
      stepEl.classList.remove('done');
      stepEl.querySelector('.step-number').textContent = stepEl.dataset.step;
    }
  });
  const total = checkboxes.length;
  document.getElementById('progressLabel').textContent = checked + ' / ' + total + ' ready';
  document.getElementById('progressFill').style.width = (checked / total * 100) + '%';
  return checked === total;
}

function handleCheckboxChange() {
  saveState();
  const allDone = renderProgress();
  if (allDone) {
    showComplete();
  }
}

function resetChecklist() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  getCheckboxes().forEach((cb) => { cb.checked = false; });
  renderProgress();
  hideComplete();
}

// Restore saved progress on page load, without triggering the completion screen
loadState();
renderProgress();

function showComplete() {
  document.getElementById('completeOverlay').classList.add('show');
}

function hideComplete() {
  document.getElementById('completeOverlay').classList.remove('show');
}

function copyCode(btn) {
  const pre = btn.parentElement.querySelector('pre');
  const text = pre.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copied';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1500);
  });
}

// ---------- COUNTDOWN ----------
// TODO: replace with your actual session date and time before sharing.
const SESSION_DATE = new Date('2026-08-13T09:00:00');

// The countdown must stay correct even if a student's device clock is wrong
// or gets changed mid-session. We fetch true time once from a public time
// API, then track elapsed time with performance.now() — a monotonic clock
// that isn't affected by the OS clock being adjusted — instead of Date.now().
const TIME_API_URL = 'https://timeapi.io/api/Time/current/zone?timeZone=UTC';
let timeAnchor = null; // { serverMs, perfMs }

async function syncServerTime() {
  try {
    const response = await fetch(TIME_API_URL);
    if (!response.ok) throw new Error('Time API responded with ' + response.status);
    const data = await response.json();
    const serverMs = new Date(data.dateTime + 'Z').getTime();
    if (Number.isNaN(serverMs)) throw new Error('Unparseable dateTime: ' + data.dateTime);
    timeAnchor = { serverMs, perfMs: performance.now() };
  } catch (e) {
    // Time API unreachable — fall back to the device clock for this tick.
    console.warn('Falling back to device clock for countdown:', e);
  }
}

function getAccurateNow() {
  if (timeAnchor) {
    return new Date(timeAnchor.serverMs + (performance.now() - timeAnchor.perfMs));
  }
  return new Date();
}

function tickCountdown() {
  const now = getAccurateNow();
  let diff = Math.max(0, SESSION_DATE - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
  document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
}

syncServerTime().then(tickCountdown);
tickCountdown();
setInterval(tickCountdown, 1000);
// Re-sync periodically to correct drift and recover from an initial failed fetch.
setInterval(syncServerTime, 5 * 60 * 1000);
