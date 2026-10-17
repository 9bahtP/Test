<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>บันทึกการจูนหุ่น</title>
<style>
  :root {
    --bg: #f3f4f6;
    --surface: #ffffff;
    --text: #15181d;
    --muted: #5b6470;
    --line: #d9dde3;
    --c-short: #1f6fb2;
    --c-over: #7a4cc2;
    --c-turn: #b45309;
    --c-force: #b4232c;
    --c-wobble: #0f766e;
    color-scheme: light;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #101317;
      --surface: #1a1f26;
      --text: #eef0f3;
      --muted: #9aa4b2;
      --line: #2c333d;
      --c-short: #2b7fc7;
      --c-over: #8b5cd0;
      --c-turn: #c2620d;
      --c-force: #c9303a;
      --c-wobble: #148a80;
      color-scheme: dark;
    }
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: "Noto Sans Thai", "Sarabun", system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.5;
    padding: max(12px, env(safe-area-inset-top)) 12px max(24px, env(safe-area-inset-bottom));
  }
  .wrap { max-width: 640px; margin: 0 auto; }

  /* นาฬิกา */
  .clock {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .time {
    font-size: clamp(40px, 12vw, 60px);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  .time small { font-size: 0.5em; color: var(--muted); font-weight: 600; }
  .state { font-size: 13px; color: var(--muted); margin-top: 2px; }
  .ctrl { display: flex; flex-direction: column; gap: 8px; }

  button { font: inherit; cursor: pointer; }
  button:focus-visible { outline: 3px solid var(--text); outline-offset: 2px; }

  .small-btn {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 9px 14px;
    font-size: 15px;
    min-width: 96px;
  }
  .small-btn:active { transform: scale(0.97); }
  .small-btn.danger { color: var(--c-force); border-color: var(--c-force); }
  .small-btn:disabled { opacity: 0.4; cursor: default; }

  /* ปุ่มบันทึก */
  .pad {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 12px 0;
  }
  .pad button:last-child { grid-column: 1 / -1; }
  .tap {
    color: #fff;
    border: 0;
    border-radius: 16px;
    min-height: 118px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    user-select: none;
    touch-action: manipulation;
    transition: transform 0.08s ease;
  }
  .tap:active { transform: scale(0.96); }
  .tap .name { font-size: clamp(20px, 6vw, 26px); font-weight: 700; }
  .tap .count { font-size: 22px; font-variant-numeric: tabular-nums; opacity: 0.92; }
  .tap .last { font-size: 13px; opacity: 0.85; font-variant-numeric: tabular-nums; min-height: 20px; }
  .tap.flash { animation: flash 0.35s ease; }
  @keyframes flash { 0% { filter: brightness(1.5); } 100% { filter: brightness(1); } }
  @media (prefers-reduced-motion: reduce) {
    .tap, .tap.flash { transition: none; animation: none; }
  }

  /* บันทึก */
  .log-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 18px 2px 8px;
    flex-wrap: wrap;
  }
  .log-head h2 { margin: 0; font-size: 18px; }
  .log-tools { display: flex; gap: 8px; flex-wrap: wrap; }
  .log-tools .small-btn { min-width: 0; padding: 7px 12px; font-size: 14px; }

  .summary {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }
  .chip {
    font-size: 13px;
    padding: 3px 10px;
    border-radius: 999px;
    color: #fff;
    font-variant-numeric: tabular-nums;
  }

  ol.log { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
  .row {
    background: var(--surface);
    border: 1px solid var(--line);
    border-left-width: 6px;
    border-radius: 10px;
    padding: 8px 12px;
    display: grid;
    grid-template-columns: 38px 1fr auto;
    align-items: center;
    gap: 8px;
  }
  .row .no { color: var(--muted); font-weight: 700; font-variant-numeric: tabular-nums; }
  .row .what { font-weight: 600; }
  .row .what span { color: var(--muted); font-weight: 400; }
  .row .when { text-align: right; font-variant-numeric: tabular-nums; }
  .row .when b { display: block; font-size: 17px; }
  .row .when small { color: var(--muted); font-size: 12px; }
  .empty {
    color: var(--muted);
    text-align: center;
    padding: 28px 12px;
    border: 1px dashed var(--line);
    border-radius: 12px;
  }
  .toast {
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    background: var(--text);
    color: var(--bg);
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 14px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }
  .toast.show { opacity: 1; }
</style>
</head>
<body>
<div class="wrap">

  <section class="clock" aria-label="นาฬิกาจับเวลา">
    <div>
      <div class="time" id="time" aria-live="off">00:00<small>.0</small></div>
      <div class="state" id="state">กดปุ่มใดก็ได้เพื่อเริ่มจับเวลา</div>
    </div>
    <div class="ctrl">
      <button class="small-btn" id="startBtn">เริ่ม</button>
      <button class="small-btn danger" id="resetBtn">รีเซ็ต</button>
    </div>
  </section>

  <section class="pad" id="pad" aria-label="ปุ่มบันทึกอาการ"></section>

  <section>
    <div class="log-head">
      <h2>ลำดับที่กด <span id="total" style="color:var(--muted);font-weight:400"></span></h2>
      <div class="log-tools">
        <button class="small-btn" id="undoBtn">ลบอันล่าสุด</button>
        <button class="small-btn" id="orderBtn">ใหม่สุดก่อน</button>
        <button class="small-btn" id="copyBtn">คัดลอก</button>
      </div>
    </div>
    <div class="summary" id="summary"></div>
    <ol class="log" id="log"></ol>
  </section>
</div>
<div class="toast" id="toast"></div>

<script>
(function () {
  const ITEMS = [
    { id: 'short',  name: 'เวลาขาด',    color: 'var(--c-short)' },
    { id: 'over',   name: 'เวลาเกิน',   color: 'var(--c-over)' },
    { id: 'turn',   name: 'เลี้ยวผิด',   color: 'var(--c-turn)' },
    { id: 'force',  name: 'แรงไป',      color: 'var(--c-force)' },
    { id: 'wobble', name: 'สะบัด ส่าย', color: 'var(--c-wobble)' }
  ];

  const $ = (id) => document.getElementById(id);
  const pad = $('pad'), logEl = $('log'), timeEl = $('time'), stateEl = $('state');
  const startBtn = $('startBtn'), orderBtn = $('orderBtn');

  let events = [];           // {seq, id, nth, ms, clock}
  let counts = {};           // id -> จำนวนครั้ง
  let status = 'idle';       // idle | running | paused
  let baseMs = 0;            // เวลาสะสมก่อนหน้า
  let startedAt = 0;         // performance.now() ตอนเริ่มรอบล่าสุด
  let timer = null;
  let newestFirst = true;

  ITEMS.forEach((it) => { counts[it.id] = 0; });

  /* ---------- เวลา ---------- */
  function elapsed() {
    return status === 'running' ? baseMs + (performance.now() - startedAt) : baseMs;
  }
  function fmt(ms) {
    const t = Math.floor(ms / 100);           // หน่วย 0.1 วินาที
    const tenth = t % 10;
    const s = Math.floor(t / 10) % 60;
    const m = Math.floor(t / 600);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + tenth;
  }
  function fmtParts(ms) {
    const f = fmt(ms);
    return f.slice(0, 5) + '<small>' + f.slice(5) + '</small>';
  }
  function clockNow() {
    const d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, '0')).join(':');
  }
  function tick() { timeEl.innerHTML = fmtParts(elapsed()); }

  function start() {
    if (status === 'running') return;
    status = 'running';
    startedAt = performance.now();
    timer = setInterval(tick, 50);
    startBtn.textContent = 'หยุดเวลา';
    stateEl.textContent = 'กำลังจับเวลา';
  }
  function pause() {
    if (status !== 'running') return;
    baseMs = elapsed();
    status = 'paused';
    clearInterval(timer);
    tick();
    startBtn.textContent = 'เริ่มต่อ';
    stateEl.textContent = 'หยุดชั่วคราว';
  }

  /* ---------- สร้างปุ่ม ---------- */
  ITEMS.forEach((it) => {
    const b = document.createElement('button');
    b.className = 'tap';
    b.style.background = it.color;
    b.id = 'btn-' + it.id;
    b.innerHTML =
      '<span class="name">' + it.name + '</span>' +
      '<span class="count">(0)</span>' +
      '<span class="last">&nbsp;</span>';
    b.addEventListener('click', () => press(it.id, b));
    pad.appendChild(b);
  });

  function press(id, btn) {
    if (status !== 'running') start();      // กดครั้งแรก/หลังหยุด = เริ่มเวลาให้เอง
    const ms = elapsed();
    counts[id] += 1;
    events.push({ seq: events.length + 1, id: id, nth: counts[id], ms: ms, clock: clockNow() });
    render();
    btn.classList.remove('flash');
    void btn.offsetWidth;
    btn.classList.add('flash');
    if (navigator.vibrate) navigator.vibrate(25);
  }

  /* ---------- แสดงผล ---------- */
  function render() {
    // ปุ่ม
    ITEMS.forEach((it) => {
      const b = $('btn-' + it.id);
      b.querySelector('.count').textContent = '(' + counts[it.id] + ')';
      const last = [...events].reverse().find((e) => e.id === it.id);
      b.querySelector('.last').textContent = last ? 'ล่าสุด ' + fmt(last.ms) : '\u00A0';
    });

    // สรุป
    const sum = $('summary');
    sum.innerHTML = '';
    ITEMS.forEach((it) => {
      if (!counts[it.id]) return;
      const c = document.createElement('span');
      c.className = 'chip';
      c.style.background = it.color;
      c.textContent = it.name + ' (' + counts[it.id] + ')';
      sum.appendChild(c);
    });

    // บันทึก
    $('total').textContent = events.length ? '— ทั้งหมด ' + events.length + ' ครั้ง' : '';
    logEl.innerHTML = '';
    if (!events.length) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'ยังไม่มีการบันทึก กดปุ่มด้านบนเมื่อเจออาการ';
      logEl.appendChild(li);
    } else {
      const list = newestFirst ? [...events].reverse() : events;
      list.forEach((e) => {
        const it = ITEMS.find((x) => x.id === e.id);
        const li = document.createElement('li');
        li.className = 'row';
        li.style.borderLeftColor = it.color;
        li.innerHTML =
          '<div class="no">#' + e.seq + '</div>' +
          '<div class="what">' + it.name + ' <span>(ครั้งที่ ' + e.nth + ')</span></div>' +
          '<div class="when"><b>' + fmt(e.ms) + '</b><small>' + e.clock + ' น.</small></div>';
        logEl.appendChild(li);
      });
    }
    $('undoBtn').disabled = !events.length;
    orderBtn.textContent = newestFirst ? 'ใหม่สุดก่อน' : 'เก่าสุดก่อน';
  }

  /* ---------- ปุ่มควบคุม ---------- */
  startBtn.addEventListener('click', () => {
    if (status === 'running') pause(); else start();
  });

  $('resetBtn').addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    status = 'idle';
    baseMs = 0;
    events = [];
    ITEMS.forEach((it) => { counts[it.id] = 0; });
    startBtn.textContent = 'เริ่ม';
    stateEl.textContent = 'กดปุ่มใดก็ได้เพื่อเริ่มจับเวลา';
    tick();
    render();
    toast('รีเซ็ตแล้ว');
  });

  $('undoBtn').addEventListener('click', () => {
    const e = events.pop();
    if (!e) return;
    counts[e.id] -= 1;
    render();
    toast('ลบ #' + e.seq + ' แล้ว');
  });

  orderBtn.addEventListener('click', () => {
    newestFirst = !newestFirst;
    render();
  });

  $('copyBtn').addEventListener('click', () => {
    if (!events.length) { toast('ยังไม่มีข้อมูล'); return; }
    const lines = events.map((e) => {
      const it = ITEMS.find((x) => x.id === e.id);
      return '#' + e.seq + ' ' + it.name + ' (ครั้งที่ ' + e.nth + ') ' + fmt(e.ms) + ' [' + e.clock + ']';
    });
    const summary = ITEMS.filter((it) => counts[it.id])
      .map((it) => it.name + ' (' + counts[it.id] + ')').join(', ');
    const text = lines.join('\n') + '\n\nสรุป: ' + summary;
    const done = () => toast('คัดลอกแล้ว');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else fallbackCopy(text, done);
  });

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('คัดลอกไม่ได้'); }
    document.body.removeChild(ta);
  }

  let toastTimer;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1400);
  }

  tick();
  render();
})();
</script>
</body>
</html>
