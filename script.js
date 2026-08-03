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

// ---------- DUMMY COUNTDOWN ----------
// TODO: replace with your actual session date and time before sharing.
const SESSION_DATE = new Date();
SESSION_DATE.setDate(SESSION_DATE.getDate() + 7);
SESSION_DATE.setHours(9, 0, 0, 0);

function tickCountdown() {
  const now = new Date();
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

tickCountdown();
setInterval(tickCountdown, 1000);
