/* =========================
   Love Week: Date Locks + Progress Bar
   Works on: rose.html → valentine.html
========================= */

const LOVE_WEEK = [
  { key: "rose",      title: "Rose Day 🌹",       href: "rose.html",      month: 1, day: 7,  index: 1 },
  { key: "propose",   title: "Propose Day 💌",    href: "propose.html",   month: 1, day: 8,  index: 2 },
  { key: "chocolate", title: "Chocolate Day 🍫",  href: "chocolate.html", month: 1, day: 9,  index: 3 },
  { key: "teddy",     title: "Teddy Day 🧸",      href: "teddy.html",     month: 1, day: 10, index: 4 },
  { key: "promise",   title: "Promise Day 🤞",    href: "promise.html",   month: 1, day: 11, index: 5 },
  { key: "hug",       title: "Hug Day 🤍",        href: "hug.html",       month: 1, day: 12, index: 6 },
  { key: "kiss",      title: "Kiss Day 💋",       href: "kiss.html",      month: 1, day: 13, index: 7 },
  { key: "valentine", title: "Valentine’s Day ❤️",href: "valentine.html", month: 1, day: 14, index: 8 },
];

const PAGE_KEY = document.body.getAttribute("data-page"); // e.g. "propose"
const CURRENT = LOVE_WEEK.find(d => d.key === PAGE_KEY);

function formatLocal(d){
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });
}

function unlockTimeFor(dayObj){
  const now = new Date();
  const y = now.getFullYear();
  return new Date(y, dayObj.month, dayObj.day, 0, 0, 0); // 12:00 AM local time
}

function canOpen(dayObj){
  const now = new Date();
  return now.getTime() >= unlockTimeFor(dayObj).getTime();
}

/* ---------- Progress Bar ---------- */
function setProgress(){
  const textEl = document.getElementById("progressText");
  const barEl  = document.getElementById("progressBarFill");

  if (!CURRENT || !textEl || !barEl) return;

  // We want Day 1/7 from Rose(1) to Valentine(7)
  // Map: rose=1 ... kiss=7, valentine=7 (final)
  const dayNumber = Math.min(7, Math.max(1, CURRENT.index)); // rose=1, propose=2, ..., kiss=7, valentine=7
  const pct = (dayNumber / 7) * 100;

  textEl.textContent = `Day ${dayNumber}/7 • ${CURRENT.title}`;
  barEl.style.width = pct + "%";
}

/* ---------- Date Lock Overlay ---------- */
function showLockOverlay(dayObj){
  const target = unlockTimeFor(dayObj);

  document.documentElement.style.overflow = "hidden";
  const overlay = document.createElement("div");
  overlay.className = "daylock";

  overlay.innerHTML = `
    <div class="daylock-card">
      <div class="daylock-badge">🔒 Locked</div>
      <h2>This page opens on</h2>
      <p class="daylock-date">${formatLocal(target)}</p>
      <p class="daylock-sub">Come back when the clock hits 12:00 AM 😈</p>
      <div class="daylock-actions">
        <a class="btn ghost" href="index.html">← Back to Cover</a>
        <a class="btn primary" href="${LOVE_WEEK[0].href}">Go to Rose Day 🌹</a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Live countdown in title (optional nice touch)
  const timer = setInterval(() => {
    if (canOpen(dayObj)){
      clearInterval(timer);
      overlay.remove();
      document.documentElement.style.overflow = "";
    }
  }, 1000);
}

function initLocks(){
  if (!CURRENT) return;

  // If current page isn't allowed yet, lock it
  if (!canOpen(CURRENT)){
    showLockOverlay(CURRENT);
  }
}

function injectLockStyles(){
  const s = document.createElement("style");
  s.textContent = `
    .progress-wrap{
      max-width: 920px;
      margin: 18px auto 0;
      padding: 0 12px;
    }
    .progress-top{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      margin-bottom: 8px;
      color: rgba(255,255,255,.85);
      font-weight: 800;
      letter-spacing: .2px;
    }
    .progress-bar{
      height: 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.06);
      overflow:hidden;
    }
    .progress-fill{
      height: 100%;
      width: 0%;
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(255,63,122,0.98), rgba(255,45,85,0.95));
      transition: width .6s ease;
    }

    .daylock{
      position: fixed;
      inset: 0;
      display:grid;
      place-items:center;
      background: rgba(0,0,0,0.62);
      backdrop-filter: blur(10px);
      z-index: 9999;
      padding: 18px;
    }
    .daylock-card{
      width: min(720px, 100%);
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 22px;
      padding: 18px;
      text-align:center;
      box-shadow: 0 18px 60px rgba(0,0,0,.55);
    }
    .daylock-badge{
      display:inline-flex;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255,63,122,0.14);
      border: 1px solid rgba(255,63,122,0.25);
      font-weight: 900;
    }
    .daylock-card h2{ margin: 12px 0 6px; }
    .daylock-date{
      font-weight: 900;
      font-size: 18px;
      color: rgba(255,255,255,0.95);
      margin: 0 0 6px;
    }
    .daylock-sub{ color: rgba(255,255,255,0.75); margin: 0 0 14px; }
    .daylock-actions{
      display:flex;
      gap: 10px;
      justify-content:center;
      flex-wrap:wrap;
    }
  `;
  document.head.appendChild(s);
}

(function bootWeek(){
  injectLockStyles();
  setProgress();
  initLocks();
})();
