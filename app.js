/* Fitness-App Carsten – Bedienung im Browser (DOM, Speicher, Timer, Datei-Export/-Import). */
(function () {
  'use strict';
  var C = window.Core;
  var storage = null, storageError = false;
  try { storage = window.localStorage; storage.setItem('__t', '1'); storage.removeItem('__t'); } catch (e) { storageError = true; }
  var memStore = {};
  var store = storage || { getItem: function (k) { return memStore[k] || null; }, setItem: function (k, v) { memStore[k] = v; } };

  var state = C.load(store);
  var today = C.dateKey(new Date());
  var ui = { tab: 'training', date: today, today: today, open: {}, timer: null, now: Date.now(), storageError: storageError };
  try { // Timer und Ansicht überstehen ein Neuladen
    var saved = JSON.parse(sessionStorage.getItem('fitness-ui') || '{}');
    if (saved.tab) ui.tab = saved.tab;
    if (saved.timer && saved.timer.endAt > Date.now() - 60000) ui.timer = saved.timer;
  } catch (e) { /* egal */ }

  var root = document.getElementById('app');
  var saveTimer = null;

  function persist() {
    try { C.save(store, state); } catch (e) { ui.storageError = true; }
  }
  function persistSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 300);
  }
  function keepUi() {
    try { sessionStorage.setItem('fitness-ui', JSON.stringify({ tab: ui.tab, timer: ui.timer })); } catch (e) { /* egal */ }
  }
  function render(keepScroll) {
    var y = window.scrollY;
    ui.now = Date.now();
    document.documentElement.lang = state.settings.lang;
    root.innerHTML = C.render(state, ui);
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
    keepUi();
  }
  function renderTimer() {
    ui.now = Date.now();
    var el = document.getElementById('timer');
    if (el) el.innerHTML = C.viewTimer(state, ui);
  }
  function weekNow() { return C.weekInfo(state, ui.date).week; }

  // ---------------------------------------------------------- Ton und Vibration
  var audioCtx = null;
  function unlockAudio() {
    if (!state.settings.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { audioCtx = null; }
  }
  function beep() {
    if (state.settings.vibrate && navigator.vibrate) { try { navigator.vibrate([300, 150, 300, 150, 300]); } catch (e) { /* egal */ } }
    if (!state.settings.sound || !audioCtx) return;
    try {
      [0, 0.35, 0.7].forEach(function (t0) {
        var o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, audioCtx.currentTime + t0);
        g.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + t0 + 0.25);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + t0); o.stop(audioCtx.currentTime + t0 + 0.3);
      });
    } catch (e) { /* egal */ }
  }

  // ---------------------------------------------------------- Timer-Takt
  var rang = false;
  function startTimer(sec) {
    unlockAudio();
    ui.timer = C.timerStart(Date.now(), sec);
    rang = false;
    keepUi();
    renderTimer();
  }
  setInterval(function () {
    if (!ui.timer) return;
    var rem = C.timerRemaining(ui.timer, Date.now());
    if (rem <= 0 && !rang) { rang = true; beep(); }
    renderTimer();
  }, 250);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) renderTimer(); });

  // ---------------------------------------------------------- Datei-Export/-Import
  function download(name, text) {
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url; link.download = name;
    document.body.appendChild(link); link.click();
    setTimeout(function () { URL.revokeObjectURL(url); link.remove(); }, 1000);
  }

  // ---------------------------------------------------------- Klicks
  root.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el || el.tagName === 'INPUT') return;
    var act = el.getAttribute('data-act'), d = el.dataset;
    ui.msg = '';
    switch (act) {
      case 'video':
        // Einzeldatei: normaler Link zu YouTube. Web-App: genau dieses Video im Fenster der App.
        if (window.FITNESS_SINGLE_FILE || !/^https?:$/.test(location.protocol)) return;
        if (ev.preventDefault) ev.preventDefault();
        ui.video = { ex: d.ex, k: d.k };
        try { history.pushState({ video: 1 }, ''); } catch (e) { /* egal */ }
        render(true); return;
      case 'videoclose':
        if (history.state && history.state.video) { history.back(); return; } // schließt über popstate
        ui.video = null; render(true); return;
      case 'tab': ui.tab = d.v; ui.open = {}; render(false); return;
      case 'date': ui.date = d.date; render(true); return;
      case 'session': C.setSession(state, ui.date, d.sid || null); persist(); render(true); return;
      case 'done': {
        var on = C.toggleDone(state, ui.date, d.ex, weekNow(), +d.i); persist();
        if (on && state.settings.autoTimer) startTimer(+d.rest);
        render(true); return;
      }
      case 'addset': C.addSet(state, ui.date, d.ex, weekNow()); persist(); render(true); return;
      case 'rmset': C.removeSet(state, ui.date, d.ex, weekNow()); persist(); render(true); return;
      case 'timer': startTimer(+d.sec); return;
      case 'timeradd': ui.timer = C.timerAdd(ui.timer, Date.now(), 30); rang = false; keepUi(); renderTimer(); return;
      case 'timerstop': ui.timer = null; keepUi(); renderTimer(); return;
      case 'foodsub': ui.foodSub = d.v; render(false); return;
      case 'foodweek': ui.foodWeek = d.v; render(true); return;
      case 'foodday': ui.foodDay = +d.v; render(true); return;
      case 'toggle': ui.open[d.key] = !ui.open[d.key]; render(true); return;
      case 'shoplist': ui.shopList = d.v; render(false); return;
      case 'shopreset': if (confirm(C.t(state, 'confirmReset'))) { C.shopReset(state, d.list); persist(); render(true); } return;
      case 'metric': ui.metric = d.v; render(true); return;
      case 'delbody': if (confirm(C.t(state, 'confirmDelEntry'))) { C.deleteBody(state, d.date); persist(); render(true); } return;
      case 'lang': state.settings.lang = d.v; persist(); render(true); return;
      case 'week': state.settings.week = +d.v; persist(); render(true); return;
      case 'export': {
        var stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
        download('fitness-carsten-' + stamp + '.json', C.exportData(state));
        ui.msg = C.t(state, 'exported'); render(true); return;
      }
      case 'wipe':
        if (confirm(C.t(state, 'confirmWipe'))) {
          var lang = state.settings.lang;
          state = C.emptyState(); state.settings.lang = lang; persist(); render(false);
        }
        return;
    }
  });

  // ---------------------------------------------------------- Eingaben
  root.addEventListener('input', function (ev) {
    var el = ev.target;
    var f = el.getAttribute('data-in');
    if (f === 'w' || f === 'r') {
      C.setField(state, ui.date, el.dataset.ex, weekNow(), +el.dataset.i, f, el.value);
      persistSoon();
    }
  });
  root.addEventListener('change', function (ev) {
    var el = ev.target, act = el.getAttribute('data-act');
    if (el.getAttribute('data-in') === 'start') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(el.value)) { state.settings.start = el.value; persist(); render(true); }
      return;
    }
    if (el.getAttribute('data-in')) { persist(); return; }
    if (act === 'shop') { C.shopToggle(state, el.dataset.key); persist(); render(true); return; }
    if (act === 'extra') { C.toggleExtra(state, ui.date, el.dataset.key); persist(); render(true); return; }
    if (act === 'setbool') { state.settings[el.dataset.key] = el.checked; persist(); render(true); return; }
    if (act === 'import') {
      var file = el.files && el.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var next = C.importData(String(reader.result));
          if (confirm(C.t(state, 'confirmImport'))) { state = next; persist(); ui.msg = C.t(state, 'importOk'); }
        } catch (e) { ui.msg = C.t(state, 'importFail') + e.message; }
        render(true);
      };
      reader.readAsText(file);
    }
  });
  root.addEventListener('submit', function (ev) {
    var form = ev.target;
    if (form.getAttribute('data-form') !== 'body') return;
    ev.preventDefault();
    var fd = new FormData(form);
    try {
      C.saveBody(state, { date: fd.get('date'), weight: fd.get('weight'), waist: fd.get('waist'), bf: fd.get('bf') });
      persist(); ui.msg = C.t(state, 'saved');
    } catch (e) { ui.msg = C.t(state, 'enterValue'); }
    render(true);
  });

  // Tageswechsel (App bleibt offen über Mitternacht)
  // Zurück-Taste (Android) schließt das Video statt die App
  window.addEventListener('popstate', function () {
    if (ui.video) { ui.video = null; render(true); }
  });

  setInterval(function () {
    var nd = C.dateKey(new Date());
    if (nd !== ui.today) { if (ui.date === ui.today) ui.date = nd; ui.today = nd; render(true); }
  }, 60000);

  // Offline-Fähigkeit (nur bei http/https, nicht bei der Einzeldatei)
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !window.FITNESS_SINGLE_FILE) {
    navigator.serviceWorker.register('sw.js').catch(function () { /* ohne Offline weiter */ });
  }

  render(false);
})();
