/* =========================
   CONFIG (edit these)
========================= */

// 1) Password lock
const ENABLE_LOCK = true; // set false to disable lock entirely
const SECRET = "yashasvi"; // change this to her name/nickname (case-insensitive)

// 2) Names
const GIRLFRIEND_NAME = "Baby"; // change
const GIRLFRIEND_NAME2 = "Yashasvi"; // change
const YOUR_NAME = "Jericho"; // change if needed

// 3) Rose Day date (Feb 7)
const ROSE_DAY_MONTH = 1; // Feb = 1 (0-based)
const ROSE_DAY_DATE  = 7;

/* =========================
   Helpers
========================= */
const $ = (s) => document.querySelector(s);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function setText(id, text){
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* =========================
   Boot
========================= */
const lock = $("#lock");
const lockInput = $("#lockInput");
const unlockBtn = $("#unlockBtn");
const lockStatus = $("#lockStatus");
const app = $("#app");

setText("gfName", GIRLFRIEND_NAME);
setText("gfName2", GIRLFRIEND_NAME2);
setText("yourName", YOUR_NAME);

if (!ENABLE_LOCK){
  showApp();
} else {
  // allow enter key
  lockInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
  });
  unlockBtn.addEventListener("click", tryUnlock);
}

function showApp(){
  lock.style.display = "none";
  app.classList.remove("app-hidden");
  app.setAttribute("aria-hidden", "false");
  startTypedNote();
  startMineTyping();
  buildReasons();
  startCountdown();
  startPetals();
  startHearts();
}

/* =========================
   Unlock
========================= */
function tryUnlock(){
  const val = (lockInput.value || "").trim().toLowerCase();
  if (!val){
    lockStatus.textContent = "Type the secret word 😚";
    lockStatus.style.color = "#ffd1dc";
    return;
  }
  if (val === SECRET.toLowerCase()){
    lockStatus.textContent = "Unlocked 💗";
    lockStatus.style.color = "#38d97a";
    showApp();
  } else {
    lockStatus.textContent = "Wrong 😅 try again (hint: her name / nickname)";
    lockStatus.style.color = "#ff8aa0";
    lockInput.focus();
    lockInput.select();
  }
}

/* =========================
   Typed Note
========================= */
const typedEl = $("#typedText");
const mineEl = document.getElementById("mineText");
const note =
`Happy Rose Day, ${GIRLFRIEND_NAME2} 🌹
You don’t belong to this world…
you belong with me.
In my thoughts, in my arms, in my heart always.

I want to be the one you come to,
the one you need,
the one you choose , every single time.
I get jealous, I get protective,
not because I doubt you,
but because I can’t imagine losing you.

You’re mine, ${GIRLFRIEND_NAME2}.
And I’m yours.
No distance, no day, no person changes that.`;


function startTypedNote(){
  if (!typedEl) return;
  typedEl.textContent = "";
  let i = 0;
  const speed = 18;

  const tick = () => {
    typedEl.textContent += note.charAt(i);
    i++;
    if (i < note.length) setTimeout(tick, speed);
  };
  tick();
}

/* =========================
   Reasons grid
========================= */
const reasons = [
  ["Your smile", "It instantly makes my whole mood better."],
  ["Your eyes", "They feel like home to me."],
  ["Your voice", "Even one call makes my day softer."],
  ["Your kindness", "You care so deeply, and it shows."],
  ["Your strength", "You handle life like a queen."],
  ["Just you", "I love you exactly the way you are."]
];

function buildReasons(){
  const grid = $("#reasonsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  reasons.forEach(([title, desc], idx) => {
    const div = document.createElement("div");
    div.className = "reason card";
    div.style.animation = `fadeInUp .45s ease ${idx * 0.06}s both`;
    div.innerHTML = `<b>${title}</b><p>${desc}</p>`;
    grid.appendChild(div);
  });
}

// small animation
const style = document.createElement("style");
style.textContent = `
@keyframes fadeInUp{
  from{ opacity:0; transform: translateY(10px); }
  to{ opacity:1; transform: translateY(0); }
}`;
document.head.appendChild(style);

/* =========================
   Countdown to Rose Day
========================= */
function getRoseDayTarget(){
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, ROSE_DAY_MONTH, ROSE_DAY_DATE, 0, 0, 0);

  // if already passed this year, set next year
  if (target.getTime() < now.getTime()){
    target = new Date(year + 1, ROSE_DAY_MONTH, ROSE_DAY_DATE, 0, 0, 0);
  }
  return target;
}

function startCountdown(){
  const target = getRoseDayTarget();

  const tick = () => {
    const now = new Date();
    const diff = target - now;

    const totalSec = Math.max(0, Math.floor(diff / 1000));
    const d = Math.floor(totalSec / (3600 * 24));
    const h = Math.floor((totalSec % (3600 * 24)) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    setText("days", d);
    setText("hours", h);
    setText("mins", m);
    setText("secs", s);
  };

  tick();
  setInterval(tick, 1000);
}

/* =========================
   Modal Surprise + Confetti-ish roses
========================= */
const modal = $("#modal");
const closeModal = $("#closeModal");
const surpriseBtn = $("#surpriseBtn");
const confettiBtn = $("#confettiBtn");
const modalMsg = $("#modalMsg");

const surpriseText =
`Baby, this rose is my promise 🌹
I’m holding onto you tightly,
not to cage you,
but to protect what’s precious to me.

I want to be your habit,
your safe place,
the one you think of before sleeping
and the one you miss when I’m not around.

You don’t walk alone anymore.
You have me.
And I’m not letting you go. 😚💗`;


surpriseBtn?.addEventListener("click", () => {
  modalMsg.textContent = surpriseText;
  modal.classList.remove("hidden");
  popRoses(24);
});

closeModal?.addEventListener("click", () => modal.classList.add("hidden"));
modal?.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

confettiBtn?.addEventListener("click", () => popRoses(36));

function popRoses(n){
  for (let i = 0; i < n; i++){
    const el = document.createElement("div");
    el.className = "heart";
    el.textContent = Math.random() > 0.5 ? "🌹" : "💗";
    el.style.left = Math.random() * 100 + "vw";
    el.style.bottom = "-20px";
    el.style.animationDuration = (3.8 + Math.random() * 3.2) + "s";
    el.style.fontSize = (16 + Math.random() * 18) + "px";
    $("#hearts").appendChild(el);

    setTimeout(() => el.remove(), 7000);
  }
}

/* =========================
   Proposal Yes/No
========================= */
const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const proposalMsg = $("#proposalMsg");

yesBtn?.addEventListener("click", () => {
  proposalMsg.textContent = `Yayyy 😭💗 I love you, ${GIRLFRIEND_NAME}!`;
  proposalMsg.style.color = "#38d97a";
  popRoses(40);
});

// ✅ No button: impossible to click 😈
noBtn?.addEventListener("pointerenter", escapeNoButton);
noBtn?.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  escapeNoButton();
});
noBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  escapeNoButton();
});

// Mobile: if user taps anywhere near it, it escapes
noBtn?.addEventListener("touchstart", (e) => {
  e.preventDefault();
  e.stopPropagation();
  escapeNoButton();
}, { passive: false });

function escapeNoButton(){
  const btn = noBtn;
  if (!btn) return;

  // Make it "unclickable" + always escaping
  btn.style.pointerEvents = "none";

  const parent = btn.parentElement;
  const rect = parent.getBoundingClientRect();

  // Jump far enough so it feels impossible
  const x = (Math.random() * rect.width) - rect.width / 2;
  const y = (Math.random() * rect.height) - rect.height / 2;

  btn.style.position = "relative";
  btn.style.left = `${clamp(x, -180, 180)}px`;
  btn.style.top  = `${clamp(y, -80, 80)}px`;

  proposalMsg.textContent = "Nice try 😈 …just press YES, you’re mine.";
  proposalMsg.style.color = "rgba(255,255,255,0.92)";

  // Re-enable pointer events after it moved, so it can keep escaping forever
  setTimeout(() => {
    btn.style.pointerEvents = "auto";
  }, 180);
}

/* =========================
   Music
========================= */
const music = $("#bgMusic");
const musicBtn = $("#musicBtn");
let musicOn = false;

musicBtn?.addEventListener("click", async () => {
  if (!music) return;
  try{
    if (!musicOn){
      await music.play();
      musicOn = true;
      musicBtn.textContent = "⏸ Pause Music";
      popRoses(10);
    } else {
      music.pause();
      musicOn = false;
      musicBtn.textContent = "🎵 Play Music";
    }
  } catch (e){
    alert("Autoplay blocked 😅 Tap again or add a valid song.mp3 file.");
  }
});

/* =========================
   Floating hearts (ambient)
========================= */
function startHearts(){
  setInterval(() => {
    const el = document.createElement("div");
    el.className = "heart";
    el.textContent = Math.random() > 0.5 ? "💗" : "🌹";
    el.style.left = Math.random() * 100 + "vw";
    el.style.bottom = "-20px";
    el.style.animationDuration = (4 + Math.random() * 4) + "s";
    el.style.fontSize = (14 + Math.random() * 18) + "px";
    $("#hearts").appendChild(el);
    setTimeout(() => el.remove(), 9000);
  }, 550);
}

/* =========================
   Rose Petals Canvas
========================= */
function startPetals(){
  const canvas = document.getElementById("petals");
  const ctx = canvas.getContext("2d");

  const resize = () => {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const petals = Array.from({length: 40}, () => makePetal());

  function makePetal(){
    return {
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight,
      r: 4 + Math.random() * 8,
      vx: -0.6 + Math.random() * 1.2,
      vy: 0.8 + Math.random() * 1.8,
      rot: Math.random() * Math.PI,
      vrot: (-0.02 + Math.random() * 0.04),
      alpha: 0.35 + Math.random() * 0.35
    };
  }

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;

    // simple petal shape
    ctx.beginPath();
    ctx.moveTo(0, -p.r);
    ctx.quadraticCurveTo(p.r, -p.r/2, 0, p.r);
    ctx.quadraticCurveTo(-p.r, -p.r/2, 0, -p.r);
    ctx.closePath();

    ctx.fillStyle = "rgba(255,45,85,1)";
    ctx.fill();

    ctx.restore();
  }

  function tick(){
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

    petals.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;

      // drift
      p.vx += (-0.02 + Math.random() * 0.04) * 0.03;

      drawPetal(p);

      if (p.y > window.innerHeight + 30){
        Object.assign(p, makePetal(), { y: -30, x: Math.random() * window.innerWidth });
      }
      if (p.x < -50) p.x = window.innerWidth + 50;
      if (p.x > window.innerWidth + 50) p.x = -50;
    });

    requestAnimationFrame(tick);
  }
  tick();
}

function startMineTyping(){
  if (!mineEl) return;

  const phrase = "You are mine. 😈🌹";
  const pauseAfter = 900;
  const speed = 70;

  let i = 0;
  let deleting = false;

  const tick = () => {
    if (!deleting){
      mineEl.textContent = phrase.slice(0, i);
      i++;
      if (i <= phrase.length){
        setTimeout(tick, speed);
      } else {
        deleting = true;
        setTimeout(tick, pauseAfter);
      }
    } else {
      mineEl.textContent = phrase.slice(0, i);
      i--;
      if (i >= 0){
        setTimeout(tick, 35);
      } else {
        deleting = false;
        i = 0;
        setTimeout(tick, 300);
      }
    }
  };

  tick();
}

