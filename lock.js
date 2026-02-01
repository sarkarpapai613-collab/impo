/* =========================
   Global Password Lock (ALL pages)
   - Locks every page that includes this script
   - Remembers unlock via localStorage
========================= */

const ENABLE_GLOBAL_LOCK = true;         // set false to disable everywhere
const LOCK_SECRET = "yashasvi";          // case-insensitive
const LOCK_STORAGE_KEY = "loveWeekUnlocked_v1"; // change if needed

function isUnlocked() {
  return localStorage.getItem(LOCK_STORAGE_KEY) === "1";
}

function setUnlocked() {
  localStorage.setItem(LOCK_STORAGE_KEY, "1");
}

function injectLockStyles() {
  const s = document.createElement("style");
  s.textContent = `
    body.__locked > *:not(.global-lock) { display: none !important; }

    .global-lock{
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 18px;
      background: rgba(0,0,0,0.62);
      backdrop-filter: blur(10px);
      z-index: 99999;
    }

    .global-lock-card{
      width: min(720px, 100%);
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 22px;
      padding: 18px;
      text-align: center;
      box-shadow: 0 18px 60px rgba(0,0,0,.55);
      color: rgba(255,255,255,0.95);
    }

    .global-lock-badge{
      display: inline-flex;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255,63,122,0.14);
      border: 1px solid rgba(255,63,122,0.25);
      font-weight: 900;
      letter-spacing: .2px;
    }

    .global-lock-card h2{
      margin: 12px 0 6px;
    }

    .global-lock-sub{
      margin: 0 0 14px;
      color: rgba(255,255,255,0.75);
      line-height: 1.6;
    }

    .global-lock-row{
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .global-lock-input{
      width: min(320px, 100%);
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.14);
      outline: none;
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.95);
      font-weight: 700;
    }

    .global-lock-status{
      margin-top: 10px;
      font-weight: 800;
      color: rgba(255,255,255,0.85);
      min-height: 20px;
    }
  `;
  document.head.appendChild(s);
}

function injectLockUI() {
  const overlay = document.createElement("div");
  overlay.className = "global-lock";
  overlay.innerHTML = `
    <div class="global-lock-card">
      <div class="global-lock-badge">🔒 Locked</div>
      <h2>For Yashasvi only 😈💗</h2>
      <p class="global-lock-sub">
        Enter the secret word to unlock this week.
        <br/>Hint: her name / nickname
      </p>

      <div class="global-lock-row">
        <input class="global-lock-input" id="__lockInput" type="password" placeholder="Type secret..." autocomplete="off" />
        <button class="btn primary" id="__unlockBtn">Unlock</button>
      </div>

      <div class="global-lock-status" id="__lockStatus"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = document.getElementById("__lockInput");
  const btn = document.getElementById("__unlockBtn");
  const status = document.getElementById("__lockStatus");

  function tryUnlock() {
    const val = (input.value || "").trim().toLowerCase();
    if (!val) {
      status.textContent = "Type the secret word 😚";
      status.style.color = "#ffd1dc";
      return;
    }
    if (val === LOCK_SECRET.toLowerCase()) {
      setUnlocked();
      status.textContent = "Unlocked 💗";
      status.style.color = "#38d97a";

      // remove overlay + show page
      document.body.classList.remove("__locked");
      overlay.remove();
    } else {
      status.textContent = "Wrong 😅 try again";
      status.style.color = "#ff8aa0";
      input.focus();
      input.select();
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
  });
  btn.addEventListener("click", tryUnlock);

  // Focus input immediately
  setTimeout(() => input.focus(), 50);
}

(function bootGlobalLock() {
  if (!ENABLE_GLOBAL_LOCK) return;

  injectLockStyles();

  if (isUnlocked()) return;

  // lock everything until correct password
  document.body.classList.add("__locked");
  injectLockUI();
})();
