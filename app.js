const TICK = 1000;
const DEFAULT_WORK = 25 * 60;
const DEFAULT_BREAK = 5 * 60;

const STORAGE_KEY = "pomodorofocus:sessions";
const SND_PENDING = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFb//VCAAAA");
let timerId = null;
let remaining = DEFAULT_WORK;
let isBreak = false;
let sessions = 0;
let lastBreakEnd = 0;

function $sel(s) { return document.querySelector(s); }
const state = { mode: "work", running: false };

function pad(n) { return n.toString().padStart(2, "0"); }
function formatSec(s) { return `${pad(Math.floor(s/60))}:${pad(s%60)}`; }
function renderTimer() { $("#timer").textContent = formatSec(remaining); }
function renderModeLabel() {
  const label = $("#modeLabel");
  const isBreakTime = state.mode === "break";
  label.textContent = isBreakTime ? "Istirahat" : "Fokus";
  label.style.color = isBreakTime ? "#38bdf8" : "#f87171";
}
function renderStats() { $("#sessions").textContent = sessions; }

function start() {
  if (state.running) return;
  state.running = true;
  $("#startBtn").textContent = "Pause";
  $("#startBtn").classList.add("btn--ghost");
  $("#startBtn").classList.remove("btn");
  timerId = setInterval(() => {
    if (remaining > 0) { remaining--; renderTimer(); }
    else { clearInterval(timerId); timerId = null; state.running = false; endSession(); }
  }, TICK);
}
function pause() {
  clearInterval(timerId); timerId = null; state.running = false;
  $("#startBtn").textContent = "Mulai";
  $("#startBtn").classList.remove("btn--ghost"); $("#startBtn").classList.add("btn");
}
function reset() {
  clearInterval(timerId); timerId = null;
  state.running = false;
  remaining = DEFAULT_WORK;
  isBreak = false;
  state.mode = "work";
  renderTimer(); renderModeLabel(); renderStats();
  $("#startBtn").textContent = "Mulai"; $("#startBtn").classList.remove("btn--ghost"); $("#startBtn").classList.add("btn");
}
function endSession() {
  sessions++;
  renderStats();
  SND_PENDING.play().catch(() => {});
  lastBreakEnd = Date.now();
  if (state.mode === "work") {
    setTimeout(startBreak, 2000);
  } else {
    setTimeout(reset, 2000);
  }
}
function startBreak() {
  state.mode = "break"; isBreak = true;
  remaining = DEFAULT_BREAK;
  renderTimer(); renderModeLabel();
  start();
}

// Events
$("#startBtn").addEventListener("click", () => {
  if (state.running) { pause(); }
  else { start(); }
});
$("#resetBtn").addEventListener("click", reset);
$("#work5").addEventListener("click", () => { remaining = 5 * 60; renderTimer(); });
$("#work25").addEventListener("click", () => { remaining = DEFAULT_WORK; renderTimer(); });
$("#break5").addEventListener("click", () => { remaining = 5 * 60; renderTimer(); });
$("#break10").addEventListener("click", () => { remaining = 10 * 60; renderTimer(); });

renderTimer(); renderModeLabel(); renderStats();