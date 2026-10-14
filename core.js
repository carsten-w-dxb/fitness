/* Fitness-App Carsten – Logik und Ansichten (ohne DOM, in Node testbar).
   Daten: PLAN aus data.js (erzeugt aus Carstens Plan-Dateien). */
(function (root) {
  'use strict';
  var PLAN = (typeof module !== 'undefined' && module.exports) ? require('./data.js') : root.PLAN;

  var APP_ID = 'fitness-carsten';
  var SCHEMA = 1;
  var STORE_KEY = 'fitness-carsten-v1';
  var SESSIONS = ['OA', 'UA', 'MI', 'OB', 'UB'];
  // Ausdauer/Schritte (Carsten 14.10.2026: Werte von der Huawei-Uhr von Hand eintragen). Zahlen nur aus dem Plan:
  var STEP_GOAL = 15000;               // „Schritte beibehalten: möglichst weiter 15.000+ am Tag“
  var HR_LOW = 100, HR_HIGH = 120;     // Mittwoch: „Puls etwa 100–120“
  var CARDIO_TYPES = ['bike', 'stepper', 'walk', 'treadmill', 'other'];
  var STEPS_MAX = 150000;

  // ------------------------------------------------------------ Texte der Oberfläche
  var UI = {
    de: {
      appName: 'Fitness Carsten', tabTraining: 'Training', tabFood: 'Ernährung', tabShop: 'Einkauf',
      tabBody: 'Körper', tabMore: 'Mehr',
      week: 'Woche', of: 'von', weekAuto: 'automatisch', beforeStart: 'vor dem Start', afterEnd: 'nach Woche 4',
      sets: 'Sätze', rir: 'Wdh. im Tank', goal: 'Ziel', cardioFin: 'Cardio Mi / Finisher Fr',
      restDay: 'frei, nur Gehen', otherSession: 'Andere Einheit für diesen Tag', planned: 'laut Plan',
      kg: 'kg', reps: 'Wdh.', sec: 'Sek.', m: 'm', set: 'Satz', addSet: '+ Satz', removeSet: '− Satz',
      last: 'Letztes Mal', noLast: 'Noch keine Werte', video: '▶ Video', noVideo: 'kein Video',
      rest: 'Pause', timer: 'Pausen-Timer', stop: 'Stopp', plus30: '+30 s', timerDone: 'Pause vorbei',
      finisherNone: 'Woche 1: kein Finisher (ab Woche 2).', cardio: 'Ausdauer', mobility: 'Beweglichkeit',
      minutes: 'Min.', done: 'erledigt',
      howSession: 'So läuft jede Einheit', schedule: 'Der 4-Wochen-Ablauf', overview: 'Training: 5 Tage pro Woche',
      why: 'Warum so', wednesday: 'Mittwoch · Cardio, Beweglichkeit, Rumpf',
      weekA: 'Plan A', weekB: 'Plan B', thisWeek: 'diese Woche', day: 'Tag', recipes: 'Rezepte', info: 'Infos',
      slots: ['Frühstück', 'Mittag', 'Nachmittag', 'Trainings-Snack', 'Abend', 'Spät'],
      dayTotal: 'Tag gesamt', trainingSnack: '+ Trainings-Snack',
      groups: { F: 'Frühstück', M: 'Mittag', A: 'Abend', S: 'Snacks' },
      ingredients: 'Zutaten', method: 'Zubereitung',
      fdTagesablauf: 'Tagesablauf', fdZahlen: 'Wie die Zahlen entstehen', fdAnpassung: 'Anpassungsregel ab Woche 3',
      fdSpielregeln: 'Spielregeln', fdErgaenzungen: 'Ergänzungen',
      monthly: 'Monatsvorrat', monthlyLong: 'Teil 1: Monatsvorrat (Vorrat und Tiefkühl)', fresh: 'Frischeinkauf',
      need: 'Bedarf 4 Wochen', buy: 'Kaufen', stock: 'Vorrat', weekShort: 'Wo.', aed: 'AED ca.', checked: 'abgehakt', resetChecks: 'Haken zurücksetzen',
      herbsTitle: 'Jede Woche frisch dazu', basics: 'Grundausstattung (einmal, falls nicht im Haus)', costs: '',
      confirmReset: 'Alle Haken dieser Liste zurücksetzen?',
      bodyTitle: 'Körperwerte', date: 'Datum', weight: 'Gewicht', waist: 'Taille', bf: 'Körperfett',
      unitWeight: 'kg', unitWaist: 'cm', unitBf: '%', save: 'Speichern', entries: 'Einträge', del: 'Löschen',
      confirmDelEntry: 'Diesen Eintrag löschen?', noEntries: 'Noch keine Einträge.', avg7: 'Ø 7 Tage',
      chartEmpty: 'Für die Kurve fehlen noch Werte.', progress: 'Fortschritt messen', signs: 'Woran du siehst, dass es läuft',
      enterValue: 'Bitte mindestens einen Wert eintragen.', saved: 'Gespeichert.',
      navyTitle: 'Körperfett berechnen (US-Navy-Formel)', height: 'Größe', neck: 'Hals',
      navyHint: 'Hals direkt unter dem Kehlkopf, Taille auf Nabelhöhe, morgens nüchtern. Die Formel schätzt; wichtig ist der Trend. Deine Größe merkt sich die App.',
      navyBtn: 'Berechnen und eintragen', navyOk: 'Körperfett {bf} % eingetragen (Taille {w} cm).',
      navyBad: 'Bitte Größe, Hals und Taille in cm eintragen (Taille größer als Hals).',
      settings: 'Einstellungen', language: 'Sprache', planStart: 'Planstart (Montag)', weekChoice: 'Woche',
      sound: 'Ton am Pausenende', vibrate: 'Vibration am Pausenende', autoTimer: 'Timer nach abgehaktem Satz starten',
      data: 'Daten', dataNote: 'Alle Eingaben bleiben nur auf diesem Handy (im Browser gespeichert). Für Handywechsel oder Sicherung: exportieren und die Datei aufheben.',
      export: 'Daten exportieren (JSON)', import: 'Daten importieren', wipe: 'Alle Daten löschen',
      confirmImport: 'Import ersetzt alle Daten in der App durch die Datei. Weiter?',
      confirmWipe: 'Wirklich alle Trainings-, Körper- und Einkaufsdaten auf diesem Handy löschen?',
      importOk: 'Import fertig.', importFail: 'Import nicht möglich: ', exported: 'Export erstellt.',
      planInfo: 'Der Plan', videos: 'Videos', videoNote: 'Die Videos laufen direkt in der App (über YouTube, ohne Cookies). Nur dafür braucht die App Internet.',
      openYoutube: 'Auf YouTube öffnen', closeVideo: 'Video schließen',
      on: 'an', off: 'aus', version: 'Version', storageWarn: 'Speichern im Browser ist hier nicht möglich. Bitte exportieren.',
      today: 'heute', prevWeek: 'Woche', nextWeek: 'Woche', planOver: 'Danach folgt eine leichtere Woche (halbe Satzzahl, gleiche Gewichte), dann Block 2.',
      tabCardio: 'Ausdauer',
      huaweiNote: 'Werte von der Huawei-Uhr ablesen und hier eintragen. Eine automatische Übernahme ist mit dieser Web-App nicht möglich.',
      stepsTitle: 'Schritte', stepsLabel: 'Schritte am {d}', stepsSave: 'Schritte speichern', stepsSaved: 'Schritte gespeichert.',
      stepsBad: 'Bitte die Schritte als ganze Zahl eintragen (z. B. 16240).', stepsDel: 'Schritte löschen', confirmDelSteps: 'Schritte vom {d} löschen?',
      stepsNone: 'Für diesen Tag sind noch keine Schritte eingetragen.', stepsHave: 'Eingetragen: {n} Schritte.',
      prevDay: 'Vortag', nextDay: 'Folgetag',
      unitTitle: 'Ausdauer-Einheit', unitOn: 'am {d}', type: 'Art',
      types: { bike: 'Fahrrad', stepper: 'Stepper', walk: 'Gehen', treadmill: 'Laufband', other: 'Sonstiges' },
      duration: 'Dauer', durationUnit: 'Min.', avgHr: 'Ø Herzfrequenz', hrUnit: 'bpm', distance: 'Distanz', kmUnit: 'km',
      activeKcal: 'Aktive Kalorien', kcalUnit: 'kcal', note: 'Notiz', optional: 'optional',
      unitSave: 'Einheit speichern', unitUpdate: 'Änderung speichern', cancel: 'Abbrechen', edit: 'Ändern',
      unitSaved: 'Einheit gespeichert.', unitBad: 'Bitte Art und Dauer (Minuten) eintragen. Puls 30–230, Distanz und Kalorien als Zahl.',
      confirmDelUnit: 'Diese Einheit löschen?', unitsDay: 'Einheiten an diesem Tag', unitsWeek: 'Weitere Einheiten dieser Woche', noUnits: 'Noch keine Einheiten.',
      weekOverview: 'Wochenübersicht', stepsAvg: 'Schritte Ø', stepsGoal: 'Ziel laut Plan: {n}+ am Tag',
      stepsOk: 'Ziel erreicht', stepsUnder: 'unter {n}', daysEntered: '{n} von 7 Tagen eingetragen', noStepsWeek: 'Diese Woche noch keine Schritte eingetragen.',
      wedCardio: 'Mittwochs-Cardio', cardioTarget: 'Vorgabe Woche {w}: {m} Min.', cardioOf: '{a} von {m} Min.',
      hrPlan: 'Plan: Puls etwa {lo}–{hi}', hrIn: 'im Bereich {lo}–{hi}', hrAbove: 'darüber', hrBelow: 'darunter', hrNone: 'kein Puls eingetragen',
      avgHrShort: 'Ø Puls', noCardioDay: 'Am Cardio-Tag ist noch keine Einheit eingetragen.',
      cardioRule: 'Gezählt werden die Einheiten am Cardio-Tag (Mittwoch oder der Tag, auf den du die Einheit im Training gelegt hast), außer „Gehen“. Gehen zählt zu den Schritten.',
      finisherHere: 'Den Finisher am Freitag (ab Woche 2) trägst du im Training ein, nicht hier.',
      allWeeks: 'Alle 4 Wochen', cardioShort: 'Cardio Mi', cardioEnter: 'Ausdauer eintragen', cardioEntered: 'Eingetragen: {a} Min.'
    },
    en: {
      appName: 'Fitness Carsten', tabTraining: 'Training', tabFood: 'Nutrition', tabShop: 'Shopping',
      tabBody: 'Body', tabMore: 'More',
      week: 'Week', of: 'of', weekAuto: 'automatic', beforeStart: 'before the start', afterEnd: 'after week 4',
      sets: 'Sets', rir: 'Reps in reserve', goal: 'Goal', cardioFin: 'Cardio Wed / finisher Fri',
      restDay: 'rest day, walking only', otherSession: 'Another session for this day', planned: 'as planned',
      kg: 'kg', reps: 'reps', sec: 'sec', m: 'm', set: 'Set', addSet: '+ set', removeSet: '− set',
      last: 'Last time', noLast: 'No values yet', video: '▶ Video', noVideo: 'no video',
      rest: 'Rest', timer: 'Rest timer', stop: 'Stop', plus30: '+30 s', timerDone: 'Rest is over',
      finisherNone: 'Week 1: no finisher (from week 2).', cardio: 'Endurance', mobility: 'Mobility',
      minutes: 'min', done: 'done',
      howSession: 'How every session works', schedule: 'The 4-week schedule', overview: 'Training: 5 days a week',
      why: 'Why it is built this way', wednesday: 'Wednesday · Cardio, mobility, core',
      weekA: 'Plan A', weekB: 'Plan B', thisWeek: 'this week', day: 'Day', recipes: 'Recipes', info: 'Info',
      slots: ['Breakfast', 'Lunch', 'Afternoon', 'Training snack', 'Dinner', 'Late'],
      dayTotal: 'Day total', trainingSnack: '+ training snack',
      groups: { F: 'Breakfast', M: 'Lunch', A: 'Dinner', S: 'Snacks' },
      ingredients: 'Ingredients', method: 'Method',
      fdTagesablauf: 'The day at a glance', fdZahlen: 'Where the numbers come from', fdAnpassung: 'Adjustment rule from week 3',
      fdSpielregeln: 'Ground rules', fdErgaenzungen: 'Supplements',
      monthly: 'Monthly stock', monthlyLong: 'Part 1: Monthly stock (buy once for all 4 weeks)', fresh: 'Fresh food',
      need: 'Need, 4 weeks', buy: 'Buy', stock: 'Stock', weekShort: 'Wk', aed: 'AED approx.', checked: 'ticked', resetChecks: 'Clear ticks',
      herbsTitle: 'Every week, fresh', basics: 'One-off basics (only if not already at home)', costs: 'Cost per month at a glance',
      confirmReset: 'Clear all ticks in this list?',
      bodyTitle: 'Body measurements', date: 'Date', weight: 'Weight', waist: 'Waist', bf: 'Body fat',
      unitWeight: 'kg', unitWaist: 'cm', unitBf: '%', save: 'Save', entries: 'Entries', del: 'Delete',
      confirmDelEntry: 'Delete this entry?', noEntries: 'No entries yet.', avg7: '7-day avg',
      chartEmpty: 'Not enough values for a chart yet.', progress: 'Tracking progress', signs: 'Signs that it is working',
      enterValue: 'Please enter at least one value.', saved: 'Saved.',
      navyTitle: 'Calculate body fat (US Navy formula)', height: 'Height', neck: 'Neck',
      navyHint: 'Neck just below the larynx, waist at navel height, in the morning before breakfast. The formula is an estimate; the trend is what counts. The app remembers your height.',
      navyBtn: 'Calculate and save', navyOk: 'Body fat {bf} % saved (waist {w} cm).',
      navyBad: 'Please enter height, neck and waist in cm (waist larger than neck).',
      settings: 'Settings', language: 'Language', planStart: 'Plan start (Monday)', weekChoice: 'Week',
      sound: 'Sound at the end of the rest', vibrate: 'Vibration at the end of the rest', autoTimer: 'Start the timer after ticking a set',
      data: 'Data', dataNote: 'Everything you enter stays on this phone only (stored in the browser). To change phones or keep a backup: export and keep the file.',
      export: 'Export data (JSON)', import: 'Import data', wipe: 'Delete all data',
      confirmImport: 'Importing replaces all data in the app with the file. Continue?',
      confirmWipe: 'Really delete all training, body and shopping data on this phone?',
      importOk: 'Import complete.', importFail: 'Import not possible: ', exported: 'Export created.',
      planInfo: 'The plan', videos: 'Videos', videoNote: 'The videos play right inside the app (via YouTube, without cookies). That is the only thing the app needs the internet for.',
      openYoutube: 'Open on YouTube', closeVideo: 'Close video',
      on: 'on', off: 'off', version: 'Version', storageWarn: 'Saving in the browser is not possible here. Please export.',
      today: 'today', prevWeek: 'Week', nextWeek: 'Week', planOver: 'After that comes a lighter week (half the number of sets, same weights), then block 2.',
      tabCardio: 'Endurance',
      huaweiNote: 'Read the values from the Huawei watch and enter them here. Automatic transfer is not possible with this web app.',
      stepsTitle: 'Steps', stepsLabel: 'Steps on {d}', stepsSave: 'Save steps', stepsSaved: 'Steps saved.',
      stepsBad: 'Please enter the steps as a whole number (e.g. 16240).', stepsDel: 'Delete steps', confirmDelSteps: 'Delete the steps for {d}?',
      stepsNone: 'No steps entered for this day yet.', stepsHave: 'Entered: {n} steps.',
      prevDay: 'Previous day', nextDay: 'Next day',
      unitTitle: 'Endurance session', unitOn: 'on {d}', type: 'Type',
      types: { bike: 'Bike', stepper: 'Stepper', walk: 'Walk', treadmill: 'Treadmill', other: 'Other' },
      duration: 'Duration', durationUnit: 'min', avgHr: 'Avg heart rate', hrUnit: 'bpm', distance: 'Distance', kmUnit: 'km',
      activeKcal: 'Active calories', kcalUnit: 'kcal', note: 'Note', optional: 'optional',
      unitSave: 'Save session', unitUpdate: 'Save changes', cancel: 'Cancel', edit: 'Edit',
      unitSaved: 'Session saved.', unitBad: 'Please enter the type and duration (minutes). Heart rate 30–230, distance and calories as numbers.',
      confirmDelUnit: 'Delete this session?', unitsDay: 'Sessions on this day', unitsWeek: 'Other sessions this week', noUnits: 'No sessions yet.',
      weekOverview: 'Week overview', stepsAvg: 'Avg steps', stepsGoal: 'Plan target: {n}+ a day',
      stepsOk: 'target reached', stepsUnder: 'below {n}', daysEntered: '{n} of 7 days entered', noStepsWeek: 'No steps entered this week yet.',
      wedCardio: 'Wednesday cardio', cardioTarget: 'Week {w} target: {m} min', cardioOf: '{a} of {m} min',
      hrPlan: 'Plan: heart rate about {lo}–{hi}', hrIn: 'in the {lo}–{hi} range', hrAbove: 'above', hrBelow: 'below', hrNone: 'no heart rate entered',
      avgHrShort: 'Avg HR', noCardioDay: 'No session entered on the cardio day yet.',
      cardioRule: 'Counted: the sessions on the cardio day (Wednesday, or the day you moved that session to under Training), except “Walk”. Walking counts towards the steps.',
      finisherHere: 'Enter the Friday finisher (from week 2) under Training, not here.',
      allWeeks: 'All 4 weeks', cardioShort: 'Cardio Wed', cardioEnter: 'Enter endurance', cardioEntered: 'Entered: {a} min'
    }
  };

  function t(state, key) {
    var lang = (state && state.settings && state.settings.lang) || 'de';
    var v = UI[lang][key];
    return v === undefined ? UI.de[key] : v;
  }
  function L(state, obj) { // Text {de, en} in aktueller Sprache
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;
    var lang = state.settings.lang;
    return (obj[lang] !== undefined && obj[lang] !== null) ? obj[lang] : obj.de;
  }
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ------------------------------------------------------------ Zustand
  function defaultSettings() {
    return { lang: 'de', start: PLAN.start, week: 0, sound: true, vibrate: true, autoTimer: true, height: null };
  }
  function emptyState() {
    // steps und cardio kamen am 14.10.2026 dazu (Speicherformat nur erweitert; ältere Stände haben sie nicht).
    return { schema: SCHEMA, settings: defaultSettings(), workouts: {}, body: [], shop: {}, steps: {}, cardio: [] };
  }
  function isObj(x) { return x !== null && typeof x === 'object' && !Array.isArray(x); }
  function isDate(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T12:00:00Z')); }
  function numOrNull(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
    return isFinite(n) ? n : null;
  }

  // Prüft und vervollständigt Daten (aus localStorage oder Import). Wirft Error bei kaputten Daten.
  function normalize(data) {
    if (!isObj(data)) throw new Error('keine gültigen App-Daten');
    if (data.schema !== SCHEMA) throw new Error('unbekannte Datenversion ' + data.schema);
    var s = emptyState();
    if (data.settings !== undefined) {
      if (!isObj(data.settings)) throw new Error('Einstellungen fehlerhaft');
      var ds = data.settings;
      if (ds.lang === 'de' || ds.lang === 'en') s.settings.lang = ds.lang;
      if (isDate(ds.start)) s.settings.start = ds.start;
      if ([0, 1, 2, 3, 4].indexOf(ds.week) >= 0) s.settings.week = ds.week;
      ['sound', 'vibrate', 'autoTimer'].forEach(function (k) { if (typeof ds[k] === 'boolean') s.settings[k] = ds[k]; });
      if (typeof ds.height === 'number' && ds.height >= 120 && ds.height <= 230) s.settings.height = ds.height;
    }
    if (data.workouts !== undefined) {
      if (!isObj(data.workouts)) throw new Error('Trainingsdaten fehlerhaft');
      Object.keys(data.workouts).forEach(function (date) {
        if (!isDate(date)) throw new Error('Datum fehlerhaft: ' + date);
        var w = data.workouts[date];
        if (!isObj(w)) throw new Error('Training ' + date + ' fehlerhaft');
        var out = { ex: {} };
        if (w.s !== undefined) {
          if (SESSIONS.indexOf(w.s) < 0) throw new Error('Einheit fehlerhaft: ' + w.s);
          out.s = w.s;
        }
        if (w.ex !== undefined) {
          if (!isObj(w.ex)) throw new Error('Übungen ' + date + ' fehlerhaft');
          Object.keys(w.ex).forEach(function (id) {
            var sets = w.ex[id];
            if (!Array.isArray(sets)) throw new Error('Sätze fehlerhaft: ' + id);
            out.ex[id] = sets.map(function (st) {
              if (!isObj(st)) throw new Error('Satz fehlerhaft: ' + id);
              return { w: numOrNull(st.w), r: numOrNull(st.r), d: st.d === true };
            });
          });
        }
        if (w.x !== undefined) {
          if (!isObj(w.x)) throw new Error('Zusatz fehlerhaft');
          out.x = {};
          Object.keys(w.x).forEach(function (k) { out.x[k] = w.x[k] === true; });
        }
        s.workouts[date] = out;
      });
    }
    if (data.body !== undefined) {
      if (!Array.isArray(data.body)) throw new Error('Körperwerte fehlerhaft');
      data.body.forEach(function (b) {
        if (!isObj(b) || !isDate(b.date)) throw new Error('Körperwert fehlerhaft');
        s.body.push({ date: b.date, weight: numOrNull(b.weight), waist: numOrNull(b.waist), bf: numOrNull(b.bf) });
      });
      s.body.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    }
    if (data.shop !== undefined) {
      if (!isObj(data.shop)) throw new Error('Einkaufsliste fehlerhaft');
      Object.keys(data.shop).forEach(function (k) { if (data.shop[k] === true) s.shop[k] = true; });
    }
    if (data.steps !== undefined) { // fehlt in älteren Ständen/Exporten: dann einfach leer
      if (!isObj(data.steps)) throw new Error('Schritte fehlerhaft');
      Object.keys(data.steps).sort().forEach(function (d) {
        var v = data.steps[d];
        if (!isDate(d) || typeof v !== 'number' || !isFinite(v) || v < 0 || v > STEPS_MAX || Math.round(v) !== v) throw new Error('Schritte fehlerhaft: ' + d);
        s.steps[d] = v;
      });
    }
    if (data.cardio !== undefined) {
      if (!Array.isArray(data.cardio)) throw new Error('Ausdauer fehlerhaft');
      var ids = {};
      data.cardio.forEach(function (c) {
        var e = cleanUnit(c);
        if (ids[e.id]) throw new Error('Ausdauer doppelt: ' + e.id);
        ids[e.id] = true;
        s.cardio.push(e);
      });
      sortUnits(s.cardio);
    }
    return s;
  }

  function load(storage) {
    var raw = null;
    try {
      raw = storage.getItem(STORE_KEY);
      if (!raw) return emptyState();
      return normalize(JSON.parse(raw));
    } catch (e) {
      // Unlesbarer Stand: Rohdaten beiseitelegen statt sie beim nächsten Speichern zu überschreiben
      try { if (raw) storage.setItem(STORE_KEY + '-unlesbar', raw); } catch (e2) { /* egal */ }
      return emptyState();
    }
  }
  function save(storage, state) {
    storage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function exportData(state, nowIso) {
    return JSON.stringify({ app: APP_ID, schema: SCHEMA, exported: nowIso || new Date().toISOString(), data: state }, null, 1);
  }
  function importData(text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { throw new Error('Datei ist kein gültiges JSON'); }
    if (!isObj(obj) || obj.app !== APP_ID) throw new Error('Datei stammt nicht aus dieser App');
    if (obj.schema !== SCHEMA) throw new Error('unbekannte Datenversion');
    return normalize(obj.data);
  }

  // ------------------------------------------------------------ Datum und Wochen
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dayNum(s) { // Tage seit 1970 (UTC, ohne Sommerzeit-Probleme)
    var p = s.split('-');
    return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000);
  }
  function fromDayNum(n) {
    var d = new Date(n * 86400000);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }
  function addDays(s, n) { return fromDayNum(dayNum(s) + n); }
  function weekday(s) { return (new Date(dayNum(s) * 86400000).getUTCDay() + 6) % 7; } // 0 = Montag
  function mondayOf(s) { return addDays(s, -weekday(s)); }

  // Woche im Plan: raw = Kalenderwoche ab Start (1 = erste Woche), week = 1..4 für Training
  function weekInfo(state, date) {
    var start = mondayOf(state.settings.start);
    var raw = Math.floor((dayNum(date) - dayNum(start)) / 7) + 1;
    var phase = raw < 1 ? 'before' : raw > 4 ? 'after' : 'plan';
    var week = Math.min(Math.max(raw, 1), 4);
    var manual = state.settings.week;
    if (manual >= 1 && manual <= 4) { week = manual; phase = 'manual'; }
    var nutr;
    if (phase === 'manual') nutr = week % 2 === 1 ? 'A' : 'B';
    else if (raw < 1) nutr = 'A';
    else nutr = raw % 2 === 1 ? 'A' : 'B'; // Plan A in Woche 1 und 3, Plan B in Woche 2 und 4 (danach weiter im Wechsel)
    return { raw: raw, week: week, phase: phase, nutr: nutr,
      monday: phase === 'manual' ? addDays(start, (week - 1) * 7) : mondayOf(date) };
  }

  function fmtDate(state, s, withYear) {
    var p = s.split('-');
    if (state.settings.lang === 'en') {
      var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+p[1] - 1];
      return (+p[2]) + ' ' + mon + (withYear ? ' ' + p[0] : '');
    }
    return p[2] + '.' + p[1] + '.' + (withYear ? p[0] : '');
  }

  // ------------------------------------------------------------ Training
  function sessionOf(state, date) {
    var w = state.workouts[date];
    if (w && w.s) return w.s;
    return PLAN.sessionOfDay[weekday(date)];
  }
  function exercisesOf(sid) { return PLAN.sessions[sid] || []; }
  function findExercise(id) {
    for (var i = 0; i < SESSIONS.length; i++) {
      var l = PLAN.sessions[SESSIONS[i]];
      for (var j = 0; j < l.length; j++) if (l[j].id === id) return l[j];
    }
    return null;
  }
  // Sätze laut 4-Wochen-Ablauf: Woche 1 = 2 pro Übung, ab Woche 2 überall 3 (Carsten 14.10.2026); Finisher nach Ablauf.
  function setCount(ex, week) {
    var sch = PLAN.schedule[week - 1];
    if (ex.id === 'finisher-rad') return sch.finMin;
    return sch.sets;
  }
  // Satzangabe im Kopf der Übung: Zahl vor „ד passend zur Woche, Rest (Wdh., Sek., je Seite) wie in der Übungstabelle.
  function setsLabel(state, ex, week) {
    var s = L(state, ex.sets);
    if (ex.id === 'finisher-rad') return s;
    return s.replace(/^\s*\d+(?:–\d+)?\s*×/, setCount(ex, week) + ' ×');
  }
  function getSets(state, date, ex, week) {
    var w = state.workouts[date];
    if (w && w.ex && w.ex[ex.id]) return w.ex[ex.id];
    var n = setCount(ex, week), out = [];
    for (var i = 0; i < n; i++) out.push({ w: null, r: null, d: false });
    return out;
  }
  function ensureSets(state, date, ex, week) {
    if (!state.workouts[date]) state.workouts[date] = { ex: {} };
    var w = state.workouts[date];
    if (!w.ex) w.ex = {};
    if (!w.ex[ex.id]) w.ex[ex.id] = getSets(state, date, ex, week).map(function (s) { return { w: s.w, r: s.r, d: s.d }; });
    return w.ex[ex.id];
  }
  function setField(state, date, exId, week, i, field, value) {
    var ex = findExercise(exId);
    var sets = ensureSets(state, date, ex, week);
    while (sets.length <= i) sets.push({ w: null, r: null, d: false });
    if (field === 'd') sets[i].d = !!value; else sets[i][field] = numOrNull(value);
    return sets[i];
  }
  function toggleDone(state, date, exId, week, i) {
    var ex = findExercise(exId);
    var sets = ensureSets(state, date, ex, week);
    sets[i].d = !sets[i].d;
    return sets[i].d;
  }
  function addSet(state, date, exId, week) {
    var sets = ensureSets(state, date, findExercise(exId), week);
    var prev = sets[sets.length - 1];
    sets.push({ w: prev ? prev.w : null, r: null, d: false });
    return sets.length;
  }
  function removeSet(state, date, exId, week) {
    var sets = ensureSets(state, date, findExercise(exId), week);
    if (sets.length > 0) sets.pop();
    return sets.length;
  }
  function setSession(state, date, sid) {
    if (!state.workouts[date]) state.workouts[date] = { ex: {} };
    if (sid === PLAN.sessionOfDay[weekday(date)] || sid === null) delete state.workouts[date].s;
    else state.workouts[date].s = sid;
  }
  function toggleExtra(state, date, key) {
    if (!state.workouts[date]) state.workouts[date] = { ex: {} };
    var w = state.workouts[date];
    if (!w.x) w.x = {};
    w.x[key] = !w.x[key];
    return w.x[key];
  }
  function hasValues(sets) {
    return sets && sets.some(function (s) { return s.w !== null || s.r !== null || s.d; });
  }
  // Letzte Werte je Übung: jüngstes Datum vor 'date' mit Eintrag
  function lastValues(state, exId, date) {
    var dates = Object.keys(state.workouts).filter(function (d) { return d < date; }).sort().reverse();
    for (var i = 0; i < dates.length; i++) {
      var w = state.workouts[dates[i]];
      if (w.ex && hasValues(w.ex[exId])) return { date: dates[i], sets: w.ex[exId] };
    }
    return null;
  }
  function fmtNum(state, n) {
    if (n === null || n === undefined) return '–';
    var s = String(Math.round(n * 100) / 100);
    return state.settings.lang === 'de' ? s.replace('.', ',') : s;
  }
  function fmtSets(state, ex, sets) {
    var u = t(state, ex.unit === 'sec' ? 'sec' : ex.unit === 'm' ? 'm' : 'reps');
    return sets.filter(function (s) { return s.w !== null || s.r !== null; }).map(function (s) {
      var a = (!ex.bw && s.w !== null) ? fmtNum(state, s.w) + ' kg × ' : '';
      return a + (s.r !== null ? fmtNum(state, s.r) + ' ' + u : '–');
    }).join(' · ');
  }

  // ------------------------------------------------------------ Pausen-Timer (zeitstempelbasiert)
  function timerStart(nowMs, seconds) { return { endAt: nowMs + seconds * 1000, dur: seconds }; }
  function timerRemaining(timer, nowMs) { return timer ? Math.max(0, timer.endAt - nowMs) : 0; }
  function timerAdd(timer, nowMs, seconds) {
    if (!timer) return timerStart(nowMs, seconds);
    var base = Math.max(timer.endAt, nowMs);
    return { endAt: base + seconds * 1000, dur: timer.dur + seconds };
  }
  function fmtClock(ms) {
    var s = Math.ceil(ms / 1000), m = Math.floor(s / 60);
    return m + ':' + pad(s % 60);
  }

  // ------------------------------------------------------------ Körperwerte
  function saveBody(state, entry) {
    if (!isDate(entry.date)) throw new Error('Datum fehlt');
    var e = { date: entry.date, weight: numOrNull(entry.weight), waist: numOrNull(entry.waist), bf: numOrNull(entry.bf) };
    if (e.weight === null && e.waist === null && e.bf === null) throw new Error('kein Wert');
    var ex = state.body.filter(function (b) { return b.date === e.date; })[0];
    if (ex) { // gleicher Tag: neue Werte ergänzen/überschreiben
      ['weight', 'waist', 'bf'].forEach(function (k) { if (e[k] !== null) ex[k] = e[k]; });
    } else state.body.push(e);
    state.body.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    return state.body;
  }
  function deleteBody(state, date) {
    state.body = state.body.filter(function (b) { return b.date !== date; });
  }
  // US-Navy-Formel (Männer, cm): 495 / (1,0324 − 0,19077·log10(Taille − Hals) + 0,15456·log10(Größe)) − 450
  function navyBf(height, neck, waist) {
    var hgt = numOrNull(height), n = numOrNull(neck), w = numOrNull(waist);
    if (hgt === null || n === null || w === null) return null;
    if (hgt < 120 || hgt > 230 || n < 25 || n > 70 || w < 50 || w > 200 || w - n < 5) return null;
    var bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(hgt)) - 450;
    if (!isFinite(bf) || bf < 2 || bf > 60) return null;
    return Math.round(bf * 10) / 10;
  }
  function saveNavy(state, entry) {
    var bf = navyBf(entry.height, entry.neck, entry.waist);
    if (bf === null || !isDate(entry.date)) throw new Error('Werte fehlen');
    state.settings.height = numOrNull(entry.height);
    saveBody(state, { date: entry.date, waist: numOrNull(entry.waist), bf: bf });
    return bf;
  }
  function series(state, field) {
    return state.body.filter(function (b) { return b[field] !== null; }).map(function (b) { return { date: b.date, v: b[field] }; });
  }
  function avg7(pts) { // gleitender Schnitt der letzten 7 Tage (inkl. Tag selbst)
    return pts.map(function (p) {
      var n0 = dayNum(p.date) - 6, sum = 0, n = 0;
      pts.forEach(function (q) { var d = dayNum(q.date); if (d >= n0 && d <= dayNum(p.date)) { sum += q.v; n++; } });
      return { date: p.date, v: Math.round(sum / n * 100) / 100 };
    });
  }
  function chartSVG(state, pts, opt) {
    opt = opt || {};
    var W = 360, H = 200, l = 40, r = 10, tp = 12, b = 26;
    if (!pts.length) return '<p class="muted">' + esc(t(state, 'chartEmpty')) + '</p>';
    var all = pts.concat(opt.avg || []);
    var vmin = Math.min.apply(null, all.map(function (p) { return p.v; }));
    var vmax = Math.max.apply(null, all.map(function (p) { return p.v; }));
    if (vmax - vmin < 1) { vmin -= 0.5; vmax += 0.5; }
    var padv = (vmax - vmin) * 0.1; vmin -= padv; vmax += padv;
    var d0 = dayNum(pts[0].date), d1 = dayNum(pts[pts.length - 1].date);
    if (d1 === d0) { d0 -= 1; d1 += 1; }
    function x(p) { return l + (dayNum(p.date) - d0) / (d1 - d0) * (W - l - r); }
    function y(v) { return tp + (vmax - v) / (vmax - vmin) * (H - tp - b); }
    function f(n) { return Math.round(n * 10) / 10; }
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opt.label || '') + '">';
    for (var i = 0; i <= 4; i++) {
      var v = vmin + (vmax - vmin) * i / 4, yy = f(y(v));
      s += '<line x1="' + l + '" x2="' + (W - r) + '" y1="' + yy + '" y2="' + yy + '" class="grid" stroke="#273239" stroke-width="1"/>';
      s += '<text x="' + (l - 6) + '" y="' + (yy + 4) + '" class="ax" fill="#93a2ab" font-size="11" text-anchor="end">' + esc(fmtNum(state, Math.round(v * 10) / 10)) + '</text>';
    }
    s += '<text x="' + l + '" y="' + (H - 6) + '" class="ax" fill="#93a2ab" font-size="11">' + esc(fmtDate(state, pts[0].date)) + '</text>';
    if (pts.length > 1) s += '<text x="' + (W - r) + '" y="' + (H - 6) + '" class="ax" fill="#93a2ab" font-size="11" text-anchor="end">' + esc(fmtDate(state, pts[pts.length - 1].date)) + '</text>';
    if (opt.avg && opt.avg.length > 1) {
      s += '<polyline class="avg" fill="none" stroke="#e0a84e" stroke-width="2" stroke-dasharray="5 4" points="' + opt.avg.map(function (p) { return f(x(p)) + ',' + f(y(p.v)); }).join(' ') + '"/>';
    }
    if (pts.length > 1) s += '<polyline class="line" fill="none" stroke="#4fb38a" stroke-width="2.5" stroke-linejoin="round" points="' + pts.map(function (p) { return f(x(p)) + ',' + f(y(p.v)); }).join(' ') + '"/>';
    pts.forEach(function (p) { s += '<circle class="dot" fill="#4fb38a" cx="' + f(x(p)) + '" cy="' + f(y(p.v)) + '" r="3.5"/>'; });
    return s + '</svg>';
  }

  // ------------------------------------------------------------ Schritte und Ausdauer (von der Huawei-Uhr abgelesen)
  function fmtInt(state, n) {
    if (n === null || n === undefined) return '–';
    var sep = state.settings.lang === 'en' ? ',' : '.';
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }
  function roundTo(n, d) {
    if (n === null || n === undefined) return null;
    var f = Math.pow(10, d);
    return Math.round(n * f) / f;
  }
  // Schritte: "16240", "16.240", "16,240" oder "16 240" → 16240. Sonst null.
  function parseSteps(v) {
    var s = String(v === null || v === undefined ? '' : v).replace(/[\s.,'’  ]/g, '');
    if (!/^\d{1,6}$/.test(s)) return null;
    var n = parseInt(s, 10);
    return n <= STEPS_MAX ? n : null;
  }
  function setSteps(state, date, value) {
    var n = parseSteps(value);
    if (!isDate(date) || n === null) throw new Error('Schritte fehlerhaft');
    state.steps[date] = n;
    return n;
  }
  function deleteSteps(state, date) { delete state.steps[date]; }
  // Dauer in Minuten: "38", "38,5", "38:12" (Min:Sek) oder "0:38:12" (Std:Min:Sek wie auf der Uhr)
  function parseDuration(v) {
    var s = String(v === null || v === undefined ? '' : v).trim(), m;
    if ((m = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(s))) return roundTo(+m[1] * 60 + +m[2] + +m[3] / 60, 1);
    if ((m = /^(\d{1,3}):(\d{1,2})$/.exec(s))) return roundTo(+m[1] + +m[2] / 60, 1);
    return roundTo(numOrNull(s), 1);
  }
  function numIn(v, lo, hi, optional, what) {
    if (v === null || v === undefined) { if (optional) return null; throw new Error(what + ' fehlt'); }
    if (typeof v !== 'number' || !isFinite(v) || v < lo || v > hi) throw new Error(what + ' fehlerhaft');
    return v;
  }
  // Prüft eine Ausdauer-Einheit (Eingabe oder Import) und gibt sie in fester Form zurück. Wirft bei Fehlern.
  function cleanUnit(c) {
    if (!isObj(c)) throw new Error('Einheit fehlerhaft');
    if (typeof c.id !== 'string' || !/^[A-Za-z0-9-]{1,40}$/.test(c.id)) throw new Error('Einheit ohne Kennung');
    if (!isDate(c.date)) throw new Error('Einheit: Datum fehlerhaft');
    if (CARDIO_TYPES.indexOf(c.type) < 0) throw new Error('Einheit: Art fehlerhaft');
    if (c.note !== undefined && c.note !== null && typeof c.note !== 'string') throw new Error('Einheit: Notiz fehlerhaft');
    return {
      id: c.id, date: c.date, type: c.type,
      min: numIn(c.min, 1, 600, false, 'Dauer'),
      hr: numIn(c.hr, 30, 230, true, 'Puls'),
      km: numIn(c.km, 0, 500, true, 'Distanz'),
      kcal: numIn(c.kcal, 0, 10000, true, 'Kalorien'),
      note: (c.note || '').slice(0, 300)
    };
  }
  function sortUnits(list) {
    list.sort(function (x, y) { return x.date < y.date ? -1 : x.date > y.date ? 1 : x.id < y.id ? -1 : x.id > y.id ? 1 : 0; });
  }
  function nextUnitId(state, date) {
    var n = 1;
    while (state.cardio.some(function (u) { return u.id === date + '-' + n; })) n++;
    return date + '-' + n;
  }
  // Neue Einheit (editId leer) oder Änderung einer bestehenden. Felder kommen als Text aus dem Formular.
  function saveUnit(state, input, editId) {
    var e = cleanUnit({
      id: editId || (isDate(input.date) ? nextUnitId(state, input.date) : 'x'),
      date: input.date, type: input.type,
      min: parseDuration(input.min),
      hr: roundTo(numOrNull(input.hr), 0),
      km: roundTo(numOrNull(input.km), 2),
      kcal: roundTo(numOrNull(input.kcal), 0),
      note: String(input.note === null || input.note === undefined ? '' : input.note).trim()
    });
    if (editId) {
      var i = -1;
      state.cardio.forEach(function (u, k) { if (u.id === editId) i = k; });
      if (i < 0) throw new Error('Einheit nicht gefunden');
      state.cardio[i] = e;
    } else state.cardio.push(e);
    sortUnits(state.cardio);
    return e;
  }
  function deleteUnit(state, id) {
    state.cardio = state.cardio.filter(function (u) { return u.id !== id; });
  }
  function unitsOn(state, date) {
    return state.cardio.filter(function (u) { return u.date === date; });
  }
  // Schritte einer Woche (Mo–So um 'date'). Ø nur über eingetragene Tage (fehlende Tage zählen nicht als 0).
  function weekSteps(state, date) {
    var mon = mondayOf(date), days = [], sum = 0, n = 0;
    for (var i = 0; i < 7; i++) {
      var d = addDays(mon, i), v = state.steps[d];
      if (v === undefined) v = null; else { sum += v; n++; }
      days.push({ date: d, v: v });
    }
    var avg = n ? Math.round(sum / n) : null;
    return { monday: mon, days: days, n: n, avg: avg, ok: avg !== null && avg >= STEP_GOAL };
  }
  // Cardio-Tag der Woche: Tag(e) mit der Mittwochs-Einheit (auch wenn im Training verschoben), sonst Mittwoch.
  function cardioDays(state, monday) {
    var out = [];
    for (var i = 0; i < 7; i++) { var d = addDays(monday, i); if (sessionOf(state, d) === 'MI') out.push(d); }
    return out.length ? out : [addDays(monday, 2)];
  }
  // Einordnung nur nach dem Planwert „Puls etwa 100–120“
  function hrClass(hr) {
    if (hr === null || hr === undefined) return null;
    var r = Math.round(hr);
    if (r < HR_LOW) return 'below';
    if (r > HR_HIGH) return 'above';
    return 'in';
  }
  // Mittwochs-Cardio einer Woche: Minuten gegen Vorgabe aus dem 4-Wochen-Ablauf, Ø-Puls (nach Minuten gewichtet)
  function wedCardio(state, date, week) {
    var w = week || weekInfo(state, date).week;
    var target = PLAN.schedule[w - 1].cardioMin;
    var days = cardioDays(state, mondayOf(date));
    var units = state.cardio.filter(function (u) { return days.indexOf(u.date) >= 0 && u.type !== 'walk'; });
    var min = 0, hrMin = 0, hrSum = 0;
    units.forEach(function (u) { min += u.min; if (u.hr !== null) { hrMin += u.min; hrSum += u.hr * u.min; } });
    var hr = hrMin ? Math.round(hrSum / hrMin) : null;
    return { week: w, target: target, days: days, units: units, min: roundTo(min, 1), hr: hr, hrClass: hrClass(hr), reached: min >= target };
  }
  function hrText(state, cls) {
    var k = { 'in': 'hrIn', above: 'hrAbove', below: 'hrBelow' }[cls];
    return k ? t(state, k).replace('{lo}', HR_LOW).replace('{hi}', HR_HIGH) : t(state, 'hrNone');
  }
  // Balken Mo–So mit Ziellinie 15.000 (selbst gezeichnet, SVG)
  function stepsChartSVG(state, ws, sel) {
    var W = 360, H = 190, l = 46, r = 8, tp = 12, b = 26, lang = state.settings.lang;
    var vmax = STEP_GOAL * 1.2;
    ws.days.forEach(function (d) { if (d.v !== null && d.v * 1.08 > vmax) vmax = d.v * 1.08; });
    vmax = Math.ceil(vmax / 5000) * 5000;
    function y(v) { return Math.round((tp + (vmax - v) / vmax * (H - tp - b)) * 10) / 10; }
    var slot = (W - l - r) / 7, bw = Math.round(slot * 0.62);
    var s = '<svg class="chart steps" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t(state, 'stepsTitle')) + '">';
    for (var g = 0; g <= vmax; g += 5000) {
      s += '<line x1="' + l + '" x2="' + (W - r) + '" y1="' + y(g) + '" y2="' + y(g) + '" class="grid" stroke="#273239" stroke-width="1"/>';
      s += '<text x="' + (l - 6) + '" y="' + (y(g) + 4) + '" class="ax" fill="#93a2ab" font-size="11" text-anchor="end">' + esc(fmtInt(state, g)) + '</text>';
    }
    ws.days.forEach(function (d, i) {
      var cx = Math.round((l + slot * i + slot / 2) * 10) / 10;
      if (d.v !== null && d.v > 0) {
        var top = y(d.v), on = d.v >= STEP_GOAL;
        s += '<rect class="sbar' + (on ? ' ok' : '') + '" x="' + Math.round(cx - bw / 2) + '" y="' + top + '" width="' + bw + '" height="' + Math.round((y(0) - top) * 10) / 10 + '" rx="4" fill="' + (on ? '#4fb38a' : '#5d7480') + '"/>';
      }
      s += '<text x="' + cx + '" y="' + (H - 8) + '" class="ax' + (d.date === sel ? ' sel' : '') + '" fill="' + (d.date === sel ? '#e6ecef' : '#93a2ab') + '" font-size="12" text-anchor="middle"' + (d.date === sel ? ' font-weight="700"' : '') + '>' + esc(PLAN.dayShort[lang][i]) + '</text>';
    });
    s += '<line class="goal" x1="' + l + '" x2="' + (W - r) + '" y1="' + y(STEP_GOAL) + '" y2="' + y(STEP_GOAL) + '" stroke="#e0a84e" stroke-width="2" stroke-dasharray="6 4"/>';
    return s + '</svg>';
  }
  // Fortschritt Minuten gegen Vorgabe (SVG statt Inline-Stil, wegen der Content-Security-Policy)
  function progressSVG(val, target) {
    var W = 300, f = target > 0 ? Math.min(val / target, 1) : 0;
    return '<svg class="prog" viewBox="0 0 ' + W + ' 12" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="0" width="' + W + '" height="12" rx="6" fill="#273239"/>' +
      (f > 0 ? '<rect x="0" y="0" width="' + Math.max(12, Math.round(W * f)) + '" height="12" rx="6" fill="' + (val >= target ? '#4fb38a' : '#2e7d5f') + '"/>' : '') + '</svg>';
  }

  // ------------------------------------------------------------ Einkauf
  function shopToggle(state, key) {
    if (state.shop[key]) delete state.shop[key]; else state.shop[key] = true;
    return !!state.shop[key];
  }
  function shopKeys(list) { // alle Schlüssel einer Liste ('m' oder 'w1'..'w4')
    if (list === 'm') return PLAN.shopping.monthly.map(function (i) { return 'm:' + i.food; }).concat(['m:creatine']);
    var out = [];
    PLAN.shopping.weekly.forEach(function (g) { g.items.forEach(function (i) { out.push(list + ':' + i.food); }); });
    out.push(list + ':herbs');
    return out;
  }
  function shopReset(state, list) {
    shopKeys(list).forEach(function (k) { delete state.shop[k]; });
  }
  function shopCount(state, list) {
    var keys = shopKeys(list);
    return { done: keys.filter(function (k) { return state.shop[k]; }).length, total: keys.length };
  }

  // ------------------------------------------------------------ Ansichten (HTML-Strings)
  function btn(act, label, attrs, cls) {
    return '<button type="button" class="' + (cls || 'btn') + '" data-act="' + act + '"' + (attrs || '') + '>' + label + '</button>';
  }
  function a(name, val) { return ' data-' + name + '="' + esc(val) + '"'; }
  // Videos in der App abspielen: YouTube ohne Cookies, erst nach Tippen; nur genau das hinterlegte Video.
  // Die Einzeldatei (file://) öffnet stattdessen den YouTube-Link (app.js).
  var EMBED = 'https://www.youtube-nocookie.com/embed/';
  function videoId(url) {
    var m = /^https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})$/.exec(url || '');
    return m ? m[1] : null;
  }
  function videoOf(exId, k) { return PLAN.videos[k === 'alt' ? exId + ':alt' : exId] || null; }
  function videoLink(state, exId, k, label, cls) {
    var v = videoOf(exId, k);
    return '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer" data-act="video"' +
      a('ex', exId) + a('k', k) + '>' + label + '</a>';
  }
  function viewVideo(state, ui) {
    if (!ui.video) return '';
    var v = videoOf(ui.video.ex, ui.video.k), id = v && videoId(v.url), ex = findExercise(ui.video.ex);
    if (!id || !ex) return '';
    return '<div class="vmodal" role="dialog" aria-modal="true" aria-label="' + esc(L(state, ex.name)) + '"><div class="vbox">' +
      '<div class="vhead"><b>' + esc(L(state, ex.name)) + '</b>' +
      btn('videoclose', '✕', ' aria-label="' + esc(t(state, 'closeVideo')) + '"', 'btn small ghost') + '</div>' +
      '<div class="vframe"><iframe src="' + EMBED + id + '?rel=0&amp;playsinline=1&amp;autoplay=1" title="' + esc(v.title) + '"' +
      ' allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' +
      '<p class="muted small">' + esc(v.title) + ' (' + esc(v.channel) + ')</p>' +
      '<div class="row gap">' + btn('videoclose', esc(t(state, 'closeVideo')), '', 'btn small') +
      '<a class="btn small ghost" href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer">' + esc(t(state, 'openYoutube')) + '</a></div>' +
      '</div></div>';
  }
  function details(title, html, open) {
    return '<details class="card info"' + (open ? ' open' : '') + '><summary>' + esc(title) + '</summary><div class="plantext">' + html + '</div></details>';
  }
  function seg(items, current, act, attrName) {
    return '<div class="seg">' + items.map(function (it) {
      return '<button type="button" class="segb' + (String(it[0]) === String(current) ? ' on' : '') + '" data-act="' + act + '"' + a(attrName, it[0]) + '>' + esc(it[1]) + '</button>';
    }).join('') + '</div>';
  }
  function tx(state, key) { return PLAN.texts[state.settings.lang][key] || ''; }

  function viewTraining(state, ui) {
    var date = ui.date, wi = weekInfo(state, date), sch = PLAN.schedule[wi.week - 1];
    var lang = state.settings.lang, h = '';
    var weekLabel = t(state, 'week') + ' ' + wi.week + ' ' + t(state, 'of') + ' 4';
    if (wi.phase === 'before') weekLabel += ' · ' + t(state, 'beforeStart');
    if (wi.phase === 'after') weekLabel = t(state, 'afterEnd') + ' (' + t(state, 'week') + ' ' + wi.raw + ')';
    h += '<section class="card head"><div class="row between"><h2>' + esc(weekLabel) + '</h2>' +
      '<span class="pill">' + esc(fmtDate(state, wi.monday) + '–' + fmtDate(state, addDays(wi.monday, 6))) + '</span></div>';
    h += '<div class="kv"><span>' + esc(t(state, 'sets')) + '</span><b>' + esc(sch.row[lang][1]) + '</b>' +
      '<span>' + esc(t(state, 'rir')) + '</span><b>' + esc(sch.row[lang][2]) + '</b>' +
      '<span>' + esc(t(state, 'cardioFin')) + '</span><b>' + esc(sch.row[lang][3]) + '</b>' +
      '<span>' + esc(t(state, 'goal')) + '</span><b>' + esc(sch.row[lang][4]) + '</b></div>';
    if (wi.phase === 'after') h += '<p class="muted">' + esc(t(state, 'planOver')) + '</p>';
    h += '</section>';

    // Tagesleiste der Woche
    var mon = mondayOf(date), today = ui.today;
    h += '<nav class="days">';
    for (var i = 0; i < 7; i++) {
      var d = addDays(mon, i), sid = sessionOf(state, d);
      h += '<button type="button" class="dayb' + (d === date ? ' on' : '') + (d === today ? ' today' : '') + '" data-act="date"' + a('date', d) + '>' +
        '<span>' + esc(PLAN.dayShort[lang][i]) + '</span><small>' + esc(fmtDate(state, d)) + '</small>' +
        '<i>' + esc(sid || '–') + '</i></button>';
    }
    h += '</nav>';
    h += '<div class="row gap weeknav">' + btn('date', '‹ ' + esc(t(state, 'prevWeek')), a('date', addDays(date, -7)), 'btn small ghost') +
      (date !== today ? btn('date', esc(t(state, 'today')), a('date', today), 'btn small') : '') +
      btn('date', esc(t(state, 'nextWeek')) + ' ›', a('date', addDays(date, 7)), 'btn small ghost') + '</div>';

    var wd = weekday(date), sid0 = sessionOf(state, date);
    var title = PLAN.days[lang][wd] + ' · ' + (sid0 ? sessionTitle(state, sid0) : t(state, 'restDay'));
    h += '<section class="card"><div class="row between"><h2>' + esc(title) + '</h2>' +
      (date === today ? '<span class="pill hi">' + esc(t(state, 'today')) + '</span>' : '') + '</div>';
    h += '<div class="timerq"><span>' + esc(t(state, 'timer')) + '</span>' +
      [60, 90, 120].map(function (s) { return btn('timer', s + ' s', a('sec', s), 'btn small'); }).join('') + '</div>';
    h += '<details class="choose"><summary>' + esc(t(state, 'otherSession')) + '</summary><div class="wrapb">' +
      SESSIONS.map(function (s) {
        return btn('session', esc(sessionTitle(state, s)), a('sid', s), 'btn small' + (s === sid0 ? ' on' : ''));
      }).join('') + btn('session', esc(t(state, 'planned')), a('sid', ''), 'btn small ghost') + '</div></details></section>';

    if (!sid0) {
      h += '<section class="card"><p>' + esc(t(state, 'restDay')) + '</p></section>';
    } else {
      if (sid0 === 'MI') h += viewCardio(state, ui, date, wi, sch);
      exercisesOf(sid0).forEach(function (ex) { h += viewExercise(state, ui, date, wi, ex); });
      if (sid0 === 'MI') h += details(t(state, 'wednesday'), tx(state, 'mittwoch'), false);
    }
    h += details(t(state, 'howSession'), tx(state, 'soLaeuft'), false);
    h += details(t(state, 'schedule'), tx(state, 'ablauf'), false);
    h += details(t(state, 'overview'), '<p class="sub">' + tx(state, 'trainingSub') + '</p>' + tx(state, 'trainingUebersicht'), false);
    h += details(t(state, 'why'), tx(state, 'warum'), false);
    return h;
  }
  function sessionTitle(state, sid) {
    var lang = state.settings.lang;
    var idx = PLAN.sessionOfDay.indexOf(sid);
    return PLAN.training[idx][lang];
  }
  function viewCardio(state, ui, date, wi, sch) {
    var w = state.workouts[date] || {}, x = w.x || {};
    var u = t(state, 'minutes');
    var got = 0;
    unitsOn(state, date).forEach(function (e) { if (e.type !== 'walk') got += e.min; });
    return '<section class="card ex"><div class="exh"><h3>' + esc(t(state, 'cardio')) + '</h3><span class="sets">' + sch.cardioMin + ' ' + esc(u) + '</span></div>' +
      '<label class="check big"><input type="checkbox" data-act="extra"' + a('key', 'cardio') + (x.cardio ? ' checked' : '') + '> ' + esc(t(state, 'done')) + '</label>' +
      '<div class="row between gocardio"><span class="muted small">' + (got ? esc(t(state, 'cardioEntered').replace('{a}', fmtNum(state, roundTo(got, 1)))) : '') + '</span>' +
      btn('gocardio', esc(t(state, 'cardioEnter')) + ' ›', a('date', date), 'btn small ghost') + '</div></section>' +
      '<section class="card ex"><div class="exh"><h3>' + esc(t(state, 'mobility')) + '</h3><span class="sets">10 ' + esc(u) + '</span></div>' +
      '<label class="check big"><input type="checkbox" data-act="extra"' + a('key', 'mobility') + (x.mobility ? ' checked' : '') + '> ' + esc(t(state, 'done')) + '</label></section>';
  }
  function viewExercise(state, ui, date, wi, ex) {
    var lang = state.settings.lang, h = '';
    var sets = getSets(state, date, ex, wi.week);
    var vid = PLAN.videos[ex.id], alt = PLAN.videos[ex.id + ':alt'];
    h += '<section class="card ex" id="ex-' + esc(ex.id) + '"><div class="exh"><h3><span class="nr">' + ex.nr + '</span> ' + esc(L(state, ex.name)) + '</h3>' +
      '<span class="sets">' + esc(setsLabel(state, ex, wi.week)) + '</span></div>';
    if (L(state, ex.hint)) h += '<p class="hint">' + esc(L(state, ex.hint)) + '</p>';
    var last = lastValues(state, ex.id, date);
    h += '<p class="last">' + (last ? esc(t(state, 'last')) + ' ' + esc(fmtDate(state, last.date)) + ': <b>' + esc(fmtSets(state, ex, last.sets)) + '</b>' : esc(t(state, 'noLast'))) + '</p>';
    if (ex.id === 'finisher-rad' && wi.week === 1 && sets.length === 0) {
      h += '<p class="muted">' + esc(t(state, 'finisherNone')) + '</p>';
    }
    var unit = t(state, ex.unit === 'sec' ? 'sec' : ex.unit === 'm' ? 'm' : 'reps');
    h += '<div class="setrows">';
    sets.forEach(function (s, i) {
      h += '<div class="setrow' + (s.d ? ' done' : '') + '"><span class="sn">' + (i + 1) + '</span>';
      if (!ex.bw) {
        h += '<label class="fld"><input type="number" inputmode="decimal" step="0.5" min="0" data-in="w"' + a('ex', ex.id) + a('i', i) +
          ' value="' + (s.w === null ? '' : esc(s.w)) + '" placeholder="' + esc(lastPh(last, i, 'w')) + '"><small>kg</small></label>';
      }
      h += '<label class="fld"><input type="number" inputmode="numeric" step="1" min="0" data-in="r"' + a('ex', ex.id) + a('i', i) +
        ' value="' + (s.r === null ? '' : esc(s.r)) + '" placeholder="' + esc(lastPh(last, i, 'r')) + '"><small>' + esc(unit) + '</small></label>';
      h += btn('done', s.d ? '✓' : '○', a('ex', ex.id) + a('i', i) + a('rest', ex.rest) + ' aria-label="' + esc(t(state, 'set') + ' ' + (i + 1)) + '"', 'tick' + (s.d ? ' on' : ''));
      h += '</div>';
    });
    h += '</div><div class="row gap">' + btn('addset', esc(t(state, 'addSet')), a('ex', ex.id), 'btn small ghost') +
      (sets.length ? btn('rmset', esc(t(state, 'removeSet')), a('ex', ex.id), 'btn small ghost') : '') +
      btn('timer', esc(t(state, 'rest')) + ' ' + ex.rest + ' s', a('sec', ex.rest), 'btn small ghost') +
      (vid ? videoLink(state, ex.id, 'main', esc(t(state, 'video')) + (alt ? ' 1' : ''), 'btn small vid') : '<span class="muted small vid">' + esc(t(state, 'noVideo')) + '</span>') +
      (alt ? videoLink(state, ex.id, 'alt', esc(t(state, 'video')) + ' 2', 'btn small vid') : '') +
      '</div>' + (alt ? '<p class="muted small">' + esc(t(state, 'video')) + ' 1: ' + esc(vid.title) + ' · ' + esc(t(state, 'video')) + ' 2: ' + esc(alt.title) + '</p>' : '') + '</section>';
    void lang;
    return h;
  }
  function lastPh(last, i, f) {
    if (!last || !last.sets[i] || last.sets[i][f] === null) return '';
    return String(last.sets[i][f]);
  }

  function viewFood(state, ui) {
    var lang = state.settings.lang, wi = weekInfo(state, ui.today);
    var wk = ui.foodWeek || wi.nutr, sub = ui.foodSub || 'day', h = '';
    h += '<section class="card head">' + seg([['day', t(state, 'day')], ['recipes', t(state, 'recipes')], ['info', t(state, 'info')]], sub, 'foodsub', 'v') + '</section>';
    if (sub === 'day') {
      h += '<section class="card">' + seg([['A', t(state, 'weekA') + (wi.nutr === 'A' ? ' · ' + t(state, 'thisWeek') : '')],
        ['B', t(state, 'weekB') + (wi.nutr === 'B' ? ' · ' + t(state, 'thisWeek') : '')]], wk, 'foodweek', 'v');
      h += '<p class="sub">' + esc(tx(state, wk === 'A' ? 'wocheASub' : 'wocheBSub')) + '</p>';
      var dsel = ui.foodDay === undefined || ui.foodDay === null ? weekday(ui.today) : ui.foodDay;
      h += '<nav class="days">' + PLAN.dayShort[lang].map(function (n, i) {
        return '<button type="button" class="dayb' + (i === dsel ? ' on' : '') + '" data-act="foodday"' + a('v', i) + '><span>' + esc(n) + '</span><i>' + esc(PLAN.sessionOfDay[i] || '–') + '</i></button>';
      }).join('') + '</nav></section>';
      var day = PLAN.weeks[wk][dsel], tr = PLAN.training[dsel];
      h += '<section class="card"><h2>' + esc(PLAN.days[lang][dsel]) + '</h2><p class="tr">' + esc(tr ? tr[lang] : t(state, 'restDay')) +
        (tr ? ' <span class="ts">' + esc(t(state, 'trainingSnack')) + '</span>' : '') + '</p>';
      var slots = UI[lang].slots;
      var codes = day.meals, si = 0;
      codes.forEach(function (code) {
        var slot = code === 'T' ? slots[3] : slots[si >= 3 ? si + 1 : si];
        if (code !== 'T') si++;
        h += mealCard(state, ui, code, slot);
      });
      h += '<div class="total"><span>' + esc(t(state, 'dayTotal')) + '</span><b>' + esc(day.line[lang]) + '</b></div></section>';
      h += '<section class="card box">' + tx(state, wk === 'A' ? 'kochplanA' : 'kochplanB') + '</section>';
    } else if (sub === 'recipes') {
      h += '<section class="card"><p class="sub">' + esc(tx(state, 'rezepteSub')) + '</p></section>';
      [['F', ['F1', 'F2', 'F3', 'F4']], ['M', ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']], ['A', ['A1', 'A2', 'A3', 'A4', 'A5']], ['S', ['S1', 'S2', 'T', 'N1', 'N2']]]
        .forEach(function (g) {
          h += '<section class="card"><h2>' + esc(UI[lang].groups[g[0]]) + '</h2>' + g[1].map(function (c) { return mealCard(state, ui, c, ''); }).join('') + '</section>';
        });
    } else {
      h += '<section class="card"><p class="sub">' + esc(tx(state, 'ernaehrungSub')) + '</p></section>';
      h += details(t(state, 'fdTagesablauf'), tx(state, 'tagesablauf'), true);
      h += details(t(state, 'fdZahlen'), tx(state, 'zahlen'), false);
      h += details(t(state, 'fdAnpassung'), tx(state, 'anpassung'), false);
      h += details(t(state, 'fdSpielregeln'), tx(state, 'spielregeln'), false);
      h += details(t(state, 'fdErgaenzungen'), tx(state, 'ergaenzungen'), false);
    }
    return h;
  }
  function mealCard(state, ui, code, slot) {
    var m = PLAN.meals[code], lang = state.settings.lang, open = ui.open && ui.open['meal:' + code + ':' + slot];
    var h = '<div class="meal' + (open ? ' open' : '') + '"><button type="button" class="mealh" data-act="toggle"' + a('key', 'meal:' + code + ':' + slot) + '>' +
      (slot ? '<small class="slot">' + esc(slot) + '</small>' : '') +
      '<span class="title"><span class="code">' + esc(code) + '</span> ' + esc(m.title[lang]) + '</span>' +
      '<small class="macro">' + esc(m.line[lang]) + '</small></button>';
    if (open) {
      h += '<div class="mealb"><ul>' + m.items.map(function (i) { return '<li>' + esc(i.text[lang]) + '</li>'; }).join('') + '</ul>' +
        (m.how[lang] ? '<p class="how">' + esc(m.how[lang]) + '</p>' : '') + '</div>';
    }
    return h + '</div>';
  }

  function viewShop(state, ui) {
    var lang = state.settings.lang, wi = weekInfo(state, ui.today);
    var list = ui.shopList || ('w' + (wi.phase === 'after' ? 4 : wi.week)), h = '';
    var wk = t(state, 'weekShort');
    h += '<section class="card head">' + seg([['m', t(state, 'stock')], ['w1', wk + ' 1'], ['w2', wk + ' 2'], ['w3', wk + ' 3'], ['w4', wk + ' 4']], list, 'shoplist', 'v');
    var c = shopCount(state, list);
    h += '<div class="row between"><span class="muted">' + c.done + ' / ' + c.total + ' ' + esc(t(state, 'checked')) + '</span>' +
      btn('shopreset', esc(t(state, 'resetChecks')), a('list', list), 'btn small ghost') + '</div></section>';
    function item(key, name, amount, extra) {
      var on = !!state.shop[key];
      return '<label class="shopi' + (on ? ' on' : '') + '"><input type="checkbox" data-act="shop"' + a('key', key) + (on ? ' checked' : '') + '>' +
        '<span class="nm">' + esc(name) + '</span><span class="am">' + esc(amount) + '</span>' + (extra ? '<small class="ex2">' + esc(extra) + '</small>' : '') + '</label>';
    }
    if (list === 'm') {
      h += '<section class="card"><h2>' + esc(t(state, 'monthlyLong')) + '</h2><p class="sub">' + esc(tx(state, 'einkaufSub')) + '</p>';
      PLAN.shopping.monthly.forEach(function (i) {
        var need = i.need[lang];
        h += item('m:' + i.food, i.name[lang], i.buy[lang], (need ? t(state, 'need') + ': ' + need + ' · ' : '') + i.aed + ' AED');
      });
      var cr = PLAN.shopping.extra.creatine;
      h += item('m:creatine', cr.name[lang], cr.buy[lang], (cr.need[lang] ? t(state, 'need') + ': ' + cr.need[lang] + ' · ' : '') + cr.aed + ' AED');
      h += '</section>';
      if (lang === 'en') h += details(t(state, 'costs'), tx(state, 'kosten'), false);
      h += details(t(state, 'basics'), tx(state, 'grundausstattung'), false);
    } else {
      var n = +list.slice(1), ab = n % 2 === 1 ? 'a' : 'b';
      h += '<section class="card"><h2>' + esc(t(state, 'fresh') + ' · ' + t(state, 'week') + ' ' + n + ' (' + (ab === 'a' ? 'A' : 'B') + ')') + '</h2><p class="sub">' + esc(tx(state, 'teil2Sub')) + '</p>';
      PLAN.shopping.weekly.forEach(function (g) {
        h += '<h3>' + esc(g.group[lang]) + '</h3>';
        g.items.forEach(function (i) { h += item(list + ':' + i.food, i.name[lang], i[ab][lang], ''); });
      });
      h += '<h3>' + esc(t(state, 'herbsTitle')) + '</h3>' + item(list + ':herbs', PLAN.shopping.extra.herbs[lang], '', '');
      h += '</section>';
      if (tx(state, 'teil2Info')) h += '<section class="card plantext">' + tx(state, 'teil2Info') + '</section>';
    }
    return h;
  }

  function viewBody(state, ui) {
    var metric = ui.metric || 'weight', h = '';
    var units = { weight: t(state, 'unitWeight'), waist: t(state, 'unitWaist'), bf: t(state, 'unitBf') };
    h += '<section class="card"><h2>' + esc(t(state, 'bodyTitle')) + '</h2><form class="bodyf" data-form="body">' +
      '<label class="fld wide"><small>' + esc(t(state, 'date')) + '</small><input type="date" name="date" value="' + esc(ui.today) + '" required></label>' +
      '<label class="fld"><small>' + esc(t(state, 'weight')) + ' (kg)</small><input type="number" inputmode="decimal" step="0.1" min="30" max="250" name="weight"></label>' +
      '<label class="fld"><small>' + esc(t(state, 'waist')) + ' (cm)</small><input type="number" inputmode="decimal" step="0.5" min="40" max="200" name="waist"></label>' +
      '<label class="fld"><small>' + esc(t(state, 'bf')) + ' (%)</small><input type="number" inputmode="decimal" step="0.1" min="3" max="60" name="bf"></label>' +
      '<button type="submit" class="btn primary">' + esc(t(state, 'save')) + '</button>' +
      (ui.msg ? '<p class="msg">' + esc(ui.msg) + '</p>' : '') + '</form></section>';
    h += '<section class="card"><h2>' + esc(t(state, 'navyTitle')) + '</h2><p class="small muted">' + esc(t(state, 'navyHint')) + '</p>' +
      '<form class="bodyf" data-form="navy">' +
      '<label class="fld wide"><small>' + esc(t(state, 'date')) + '</small><input type="date" name="date" value="' + esc(ui.today) + '" required></label>' +
      '<label class="fld"><small>' + esc(t(state, 'height')) + ' (cm)</small><input type="number" inputmode="decimal" step="0.5" min="120" max="230" name="height" value="' + (state.settings.height === null ? '' : esc(state.settings.height)) + '"></label>' +
      '<label class="fld"><small>' + esc(t(state, 'neck')) + ' (cm)</small><input type="number" inputmode="decimal" step="0.5" min="25" max="70" name="neck"></label>' +
      '<label class="fld"><small>' + esc(t(state, 'waist')) + ' (cm)</small><input type="number" inputmode="decimal" step="0.5" min="50" max="200" name="waist"></label>' +
      '<button type="submit" class="btn primary">' + esc(t(state, 'navyBtn')) + '</button>' +
      (ui.navyMsg ? '<p class="msg">' + esc(ui.navyMsg) + '</p>' : '') + '</form></section>';
    h += '<section class="card">' + seg([['weight', t(state, 'weight')], ['waist', t(state, 'waist')], ['bf', t(state, 'bf')]], metric, 'metric', 'v');
    var pts = series(state, metric);
    h += chartSVG(state, pts, { avg: metric === 'weight' ? avg7(pts) : null, label: t(state, metric) });
    if (metric === 'weight' && pts.length > 1) h += '<p class="legend"><i class="lg line"></i> ' + esc(t(state, 'weight')) + ' <i class="lg avg"></i> ' + esc(t(state, 'avg7')) + '</p>';
    h += '</section>';
    h += '<section class="card"><h2>' + esc(t(state, 'entries')) + '</h2>';
    if (!state.body.length) h += '<p class="muted">' + esc(t(state, 'noEntries')) + '</p>';
    else {
      h += '<table class="tbl"><thead><tr><th>' + esc(t(state, 'date')) + '</th><th>kg</th><th>cm</th><th>%</th><th></th></tr></thead><tbody>';
      state.body.slice().reverse().forEach(function (b) {
        h += '<tr><td>' + esc(fmtDate(state, b.date, true)) + '</td><td>' + esc(fmtNum(state, b.weight)) + '</td><td>' + esc(fmtNum(state, b.waist)) + '</td><td>' + esc(fmtNum(state, b.bf)) + '</td><td>' +
          btn('delbody', '×', a('date', b.date) + ' aria-label="' + esc(t(state, 'del')) + '"', 'btn small ghost') + '</td></tr>';
      });
      h += '</tbody></table>';
    }
    h += '</section>';
    h += details(t(state, 'progress'), '<p>' + tx(state, 'messenSub') + '</p>', false);
    h += details(t(state, 'signs'), tx(state, 'woran'), false);
    void units;
    return h;
  }

  // ------------------------------------------------------------ Ansicht Ausdauer (Schritte + Einheiten + Woche)
  function dayLabel(state, d) { return PLAN.dayShort[state.settings.lang][weekday(d)] + ' ' + fmtDate(state, d); }
  function unitRow(state, u, withDate) {
    var parts = [fmtNum(state, u.min) + ' ' + t(state, 'durationUnit')];
    if (u.km !== null) parts.push(fmtNum(state, u.km) + ' ' + t(state, 'kmUnit'));
    if (u.kcal !== null) parts.push(fmtInt(state, u.kcal) + ' ' + t(state, 'kcalUnit'));
    var cls = hrClass(u.hr);
    return '<div class="unit"><div class="unith"><b>' + (withDate ? esc(dayLabel(state, u.date)) + ' · ' : '') + esc(UI[state.settings.lang].types[u.type]) + '</b>' +
      '<span class="unitv">' + esc(parts.join(' · ')) + '</span></div>' +
      (u.hr !== null ? '<div class="small">' + esc(t(state, 'avgHrShort') + ' ' + fmtInt(state, u.hr) + ' ' + t(state, 'hrUnit')) + ' <span class="hrc ' + cls + '">' + esc(hrText(state, cls)) + '</span></div>' : '') +
      (u.note ? '<div class="small muted">' + esc(u.note) + '</div>' : '') +
      '<div class="row gap">' + btn('cedit', esc(t(state, 'edit')), a('id', u.id), 'btn small ghost') +
      btn('cdel', esc(t(state, 'del')), a('id', u.id), 'btn small ghost dangerg') + '</div></div>';
  }
  function numField(state, name, label, unit, val, opt, attrs) {
    return '<label class="fld"><small>' + esc(label) + ' (' + esc(unit) + ')</small>' +
      '<input ' + attrs + ' name="' + name + '" value="' + (val === null || val === undefined ? '' : esc(val)) + '"' + (opt ? ' placeholder="' + esc(t(state, 'optional')) + '"' : '') + '></label>';
  }
  function viewEndurance(state, ui) {
    var lang = state.settings.lang, date = isDate(ui.cDate) ? ui.cDate : ui.today, h = '';
    var types = UI[lang].types;
    h += '<p class="note">' + esc(t(state, 'huaweiNote')) + '</p>';

    // Tag wählen + Schritte
    var sv = state.steps[date];
    h += '<section class="card"><h2>' + esc(t(state, 'stepsTitle')) + '</h2><div class="daypick">' +
      btn('cday', '‹', a('date', addDays(date, -1)) + ' aria-label="' + esc(t(state, 'prevDay')) + '"', 'btn ghost') +
      '<input type="date" data-in="cdate" value="' + esc(date) + '" aria-label="' + esc(t(state, 'date')) + '">' +
      btn('cday', '›', a('date', addDays(date, 1)) + ' aria-label="' + esc(t(state, 'nextDay')) + '"', 'btn ghost') + '</div>' +
      (date !== ui.today ? '<div class="row gap">' + btn('cday', esc(t(state, 'today')), a('date', ui.today), 'btn small') + '</div>' : '');
    h += '<form class="stepsf" data-form="steps"><label class="fld big"><small>' + esc(t(state, 'stepsLabel').replace('{d}', dayLabel(state, date))) + '</small>' +
      '<input type="text" inputmode="numeric" autocomplete="off" enterkeyhint="done" maxlength="8" name="steps" value="' + (sv === undefined ? '' : esc(sv)) + '"></label>' +
      '<button type="submit" class="btn primary big">' + esc(t(state, 'stepsSave')) + '</button>' +
      (ui.sMsg ? '<p class="msg">' + esc(ui.sMsg) + '</p>' : '') + '</form>';
    h += '<div class="row between stepsinfo"><span class="muted small">' + esc(sv === undefined ? t(state, 'stepsNone') : t(state, 'stepsHave').replace('{n}', fmtInt(state, sv))) + '</span>' +
      (sv === undefined ? '' : btn('stepsdel', esc(t(state, 'stepsDel')), a('date', date), 'btn small ghost')) + '</div></section>';

    // Ausdauer-Einheit eintragen/ändern
    var edit = ui.cEdit ? state.cardio.filter(function (u) { return u.id === ui.cEdit; })[0] : null;
    var f = edit || { type: CARDIO_TYPES.indexOf(ui.cType) >= 0 ? ui.cType : 'bike', min: null, hr: null, km: null, kcal: null, note: '' };
    h += '<section class="card"><h2>' + esc(t(state, 'unitTitle')) + ' <small class="muted">' + esc(t(state, 'unitOn').replace('{d}', dayLabel(state, date))) + '</small></h2>' +
      '<form class="bodyf unitf" data-form="cardio"><div class="chips" role="radiogroup" aria-label="' + esc(t(state, 'type')) + '">' +
      CARDIO_TYPES.map(function (k) {
        return '<label class="chip"><input type="radio" name="type" value="' + k + '"' + (f.type === k ? ' checked' : '') + '><span>' + esc(types[k]) + '</span></label>';
      }).join('') + '</div>' +
      numField(state, 'min', t(state, 'duration'), t(state, 'durationUnit'), f.min, false, 'type="text" inputmode="decimal" autocomplete="off" maxlength="8"') +
      numField(state, 'hr', t(state, 'avgHr'), t(state, 'hrUnit'), f.hr, false, 'type="number" inputmode="numeric" step="1" min="30" max="230"') +
      numField(state, 'km', t(state, 'distance'), t(state, 'kmUnit'), f.km, true, 'type="number" inputmode="decimal" step="0.01" min="0" max="500"') +
      numField(state, 'kcal', t(state, 'activeKcal'), t(state, 'kcalUnit'), f.kcal, true, 'type="number" inputmode="numeric" step="1" min="0" max="10000"') +
      '<label class="fld wide"><small>' + esc(t(state, 'note')) + '</small><input type="text" name="note" maxlength="300" autocomplete="off" value="' + esc(f.note) + '" placeholder="' + esc(t(state, 'optional')) + '"></label>' +
      '<button type="submit" class="btn primary">' + esc(t(state, edit ? 'unitUpdate' : 'unitSave')) + '</button>' +
      (edit ? btn('ccancel', esc(t(state, 'cancel')), '', 'btn ghost wide') : '') +
      (ui.cMsg ? '<p class="msg">' + esc(ui.cMsg) + '</p>' : '') + '</form>';
    var dayUnits = unitsOn(state, date);
    h += '<h3>' + esc(t(state, 'unitsDay')) + '</h3>' + (dayUnits.length ? dayUnits.map(function (u) { return unitRow(state, u, false); }).join('') : '<p class="muted small">' + esc(t(state, 'noUnits')) + '</p>') + '</section>';

    // Wochenübersicht (Woche aus dem 4-Wochen-Ablauf)
    var wi = weekInfo(state, date), ws = weekSteps(state, date), wc = wedCardio(state, date, wi.week), mon = ws.monday;
    var weekLabel = t(state, 'week') + ' ' + wi.week + ' ' + t(state, 'of') + ' 4';
    if (wi.phase === 'before') weekLabel += ' · ' + t(state, 'beforeStart');
    if (wi.phase === 'after') weekLabel = t(state, 'afterEnd') + ' (' + t(state, 'week') + ' ' + wi.raw + ')';
    h += '<section class="card"><div class="row between"><h2>' + esc(t(state, 'weekOverview')) + '</h2><span class="pill">' + esc(fmtDate(state, mon) + '–' + fmtDate(state, addDays(mon, 6))) + '</span></div>' +
      '<p class="muted small">' + esc(weekLabel) + '</p>' +
      '<div class="row gap weeknav">' + btn('cday', '‹ ' + esc(t(state, 'prevWeek')), a('date', addDays(date, -7)), 'btn small ghost') +
      btn('cday', esc(t(state, 'nextWeek')) + ' ›', a('date', addDays(date, 7)), 'btn small ghost') + '</div>';
    h += '<h3>' + esc(t(state, 'stepsAvg')) + '</h3>';
    if (ws.avg === null) h += '<p class="muted">' + esc(t(state, 'noStepsWeek')) + '</p>';
    else {
      h += '<div class="big-num"><b>' + esc(fmtInt(state, ws.avg)) + '</b> <span class="hrc ' + (ws.ok ? 'in' : 'below') + '">' +
        esc(ws.ok ? t(state, 'stepsOk') : t(state, 'stepsUnder').replace('{n}', fmtInt(state, STEP_GOAL))) + '</span></div>' +
        '<p class="muted small">' + esc(t(state, 'daysEntered').replace('{n}', ws.n)) + '</p>';
    }
    h += '<p class="small"><i class="lg goal"></i> ' + esc(t(state, 'stepsGoal').replace('{n}', fmtInt(state, STEP_GOAL))) + '</p>';
    h += stepsChartSVG(state, ws, date);
    h += '<nav class="days steps">' + ws.days.map(function (d, i) {
      return '<button type="button" class="dayb' + (d.date === date ? ' on' : '') + (d.date === ui.today ? ' today' : '') + '" data-act="cday"' + a('date', d.date) + '>' +
        '<span>' + esc(PLAN.dayShort[lang][i]) + '</span><small>' + esc(d.v === null ? '–' : fmtInt(state, d.v)) + '</small></button>';
    }).join('') + '</nav>';

    h += '<h3>' + esc(t(state, 'wedCardio')) + ' <small class="muted">' + esc(wc.days.map(function (d) { return dayLabel(state, d); }).join(', ')) + '</small></h3>';
    h += '<div class="big-num"><b>' + esc(t(state, 'cardioOf').replace('{a}', fmtNum(state, wc.min)).replace('{m}', wc.target)) + '</b></div>' + progressSVG(wc.min, wc.target);
    h += '<p class="muted small">' + esc(t(state, 'cardioTarget').replace('{w}', wc.week).replace('{m}', wc.target)) + '<br>' + esc(t(state, 'hrPlan').replace('{lo}', HR_LOW).replace('{hi}', HR_HIGH)) + '</p>';
    if (!wc.units.length) h += '<p class="muted">' + esc(t(state, 'noCardioDay')) + '</p>';
    else h += '<p>' + esc(t(state, 'avgHrShort')) + ' <b>' + (wc.hr === null ? '–' : esc(fmtInt(state, wc.hr) + ' ' + t(state, 'hrUnit'))) + '</b> <span class="hrc ' + (wc.hrClass || 'none') + '">' + esc(hrText(state, wc.hrClass)) + '</span></p>';
    h += '<p class="muted small">' + esc(t(state, 'cardioRule')) + '</p><p class="muted small">' + esc(t(state, 'finisherHere')) + '</p>';
    // weitere Einheiten der Woche (die des gewählten Tages stehen schon oben)
    var weekUnits = state.cardio.filter(function (u) { return u.date >= mon && u.date <= addDays(mon, 6) && u.date !== date; });
    if (weekUnits.length) h += '<h3>' + esc(t(state, 'unitsWeek')) + '</h3>' + weekUnits.map(function (u) { return unitRow(state, u, true); }).join('');
    h += '</section>';

    // Alle 4 Wochen (wie die Spalte „Schritte Ø“ in der Wochentabelle des Plans)
    var start = mondayOf(state.settings.start);
    h += '<section class="card"><h2>' + esc(t(state, 'allWeeks')) + '</h2><table class="tbl"><thead><tr><th>' + esc(t(state, 'week')) + '</th><th>' + esc(t(state, 'stepsAvg')) + '</th><th>' + esc(t(state, 'cardioShort')) + '</th><th>' + esc(t(state, 'avgHrShort')) + '</th></tr></thead><tbody>';
    for (var w = 1; w <= 4; w++) {
      var m0 = addDays(start, (w - 1) * 7), s0 = weekSteps(state, m0), c0 = wedCardio(state, m0, w);
      h += '<tr' + (m0 === mon ? ' class="on"' : '') + '><td><b>' + w + '</b> <small class="muted">' + esc(fmtDate(state, m0)) + '</small></td><td>' + esc(fmtInt(state, s0.avg)) + '</td><td>' +
        esc(fmtNum(state, c0.min) + ' / ' + c0.target) + '</td><td>' + esc(c0.hr === null ? '–' : fmtInt(state, c0.hr)) + '</td></tr>';
    }
    h += '</tbody></table></section>';
    return h;
  }

  function viewMore(state, ui) {
    var s = state.settings, h = '';
    h += '<section class="card"><h2>' + esc(t(state, 'settings')) + '</h2>';
    h += '<div class="setting"><span>' + esc(t(state, 'language')) + '</span>' + seg([['de', 'Deutsch'], ['en', 'English']], s.lang, 'lang', 'v') + '</div>';
    h += '<div class="setting"><span>' + esc(t(state, 'planStart')) + '</span><input type="date" data-in="start" value="' + esc(s.start) + '"></div>';
    h += '<div class="setting"><span>' + esc(t(state, 'weekChoice')) + '</span>' + seg([[0, t(state, 'weekAuto')], [1, '1'], [2, '2'], [3, '3'], [4, '4']], s.week, 'week', 'v') + '</div>';
    [['sound', 'sound'], ['vibrate', 'vibrate'], ['autoTimer', 'autoTimer']].forEach(function (k) {
      h += '<label class="setting check"><span>' + esc(t(state, k[1])) + '</span><input type="checkbox" data-act="setbool"' + a('key', k[0]) + (s[k[0]] ? ' checked' : '') + '></label>';
    });
    h += '</section>';
    h += '<section class="card"><h2>' + esc(t(state, 'data')) + '</h2><p class="muted">' + esc(t(state, 'dataNote')) + '</p>' +
      (ui.storageError ? '<p class="msg warn">' + esc(t(state, 'storageWarn')) + '</p>' : '') +
      '<div class="stack">' + btn('export', esc(t(state, 'export')), '', 'btn primary') +
      '<label class="btn file">' + esc(t(state, 'import')) + '<input type="file" accept="application/json,.json" data-act="import"></label>' +
      btn('wipe', esc(t(state, 'wipe')), '', 'btn danger') + '</div>' + (ui.msg ? '<p class="msg">' + esc(ui.msg) + '</p>' : '') + '</section>';
    h += '<section class="card"><h2>' + esc(t(state, 'planInfo')) + '</h2><p class="sub">' + esc(tx(state, 'titelSub')) + '</p></section>';
    h += details(state.settings.lang === 'de' ? 'Ausgangslage' : 'Starting point', tx(state, 'ausgangslage'), false);
    h += details(state.settings.lang === 'de' ? 'Das Ziel in Zahlen' : 'The goal in numbers', tx(state, 'ziel'), false);
    h += details(state.settings.lang === 'de' ? 'Die 8 Regeln, die den Unterschied machen' : 'The 8 rules that make the difference', tx(state, 'regeln'), false);
    var vl = '';
    SESSIONS.forEach(function (sid) {
      exercisesOf(sid).forEach(function (ex) {
        var v = PLAN.videos[ex.id], v2 = PLAN.videos[ex.id + ':alt'];
        function one(x, k) { return videoLink(state, ex.id, k, esc(x.title), '') + ' <small>(' + esc(x.channel) + ')</small>'; }
        vl += '<li><b>' + esc(L(state, ex.name)) + '</b><br>' + (v ? one(v, 'main') : '<small>' + esc(t(state, 'noVideo')) + '</small>') + (v2 ? '<br>' + one(v2, 'alt') : '') + '</li>';
      });
    });
    h += details(t(state, 'videos'), '<p class="small">' + esc(t(state, 'videoNote')) + '</p><ul class="vids">' + vl + '</ul>', false);
    h += '<p class="muted center small">' + esc(t(state, 'version')) + ' ' + esc(PLAN.version) + '</p>';
    return h;
  }

  function viewTimer(state, ui) {
    if (!ui.timer) return '';
    var rem = timerRemaining(ui.timer, ui.now), doneT = rem <= 0;
    return '<div class="timerbar' + (doneT ? ' fin' : '') + '"><b class="clock">' + (doneT ? esc(t(state, 'timerDone')) : fmtClock(rem)) + '</b>' +
      btn('timeradd', esc(t(state, 'plus30')), '', 'btn small') + btn('timerstop', esc(t(state, 'stop')), '', 'btn small') + '</div>';
  }

  // Eigene, einfache Symbole (SVG, keine Schrift/Emoji nötig)
  var ICON = {
    training: '<path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12"/>',
    food: '<path d="M3 11h18a9 9 0 0 1-18 0zM8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',
    shop: '<path d="M3 4h2l2.5 11h10L20 8H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/>',
    body: '<path d="M4 4v16h16"/><path d="M7 15l4-5 3 3 5-6"/>',
    cardio: '<path d="M2 12h4l2.5-6 4 12 3-9 1.5 3H22"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
  };
  function icon(k) {
    return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[k] + '</svg>';
  }
  // Reiter „Ausdauer“ steht neben „Körper“: die ersten vier Reiter bleiben an ihrem Platz, „Mehr“ bleibt rechts außen.
  var TABS = [['training', 'tabTraining'], ['food', 'tabFood'], ['shop', 'tabShop'], ['body', 'tabBody'], ['cardio', 'tabCardio'], ['more', 'tabMore']];
  function render(state, ui) {
    var views = { training: viewTraining, food: viewFood, shop: viewShop, body: viewBody, cardio: viewEndurance, more: viewMore };
    if (!views[ui.tab]) ui.tab = 'training';
    var view = views[ui.tab];
    var h = '<header class="top"><h1>' + esc(t(state, TABS.filter(function (x) { return x[0] === ui.tab; })[0][1])) + '</h1></header>';
    h += '<main id="main">' + view(state, ui) + '</main>';
    h += '<div id="timer">' + viewTimer(state, ui) + '</div>';
    h += '<nav class="tabs">' + TABS.map(function (x) {
      return '<button type="button" class="tab' + (x[0] === ui.tab ? ' on' : '') + '" data-act="tab"' + a('v', x[0]) + '>' + icon(x[0]) + '<small>' + esc(t(state, x[1])) + '</small></button>';
    }).join('') + '</nav>';
    h += viewVideo(state, ui);
    return h;
  }

  var Core = {
    PLAN: PLAN, UI: UI, APP_ID: APP_ID, SCHEMA: SCHEMA, STORE_KEY: STORE_KEY, SESSIONS: SESSIONS,
    t: t, esc: esc, emptyState: emptyState, normalize: normalize, load: load, save: save,
    exportData: exportData, importData: importData,
    dateKey: dateKey, addDays: addDays, weekday: weekday, mondayOf: mondayOf, weekInfo: weekInfo, fmtDate: fmtDate,
    sessionOf: sessionOf, exercisesOf: exercisesOf, findExercise: findExercise, setCount: setCount, setsLabel: setsLabel, getSets: getSets,
    setField: setField, toggleDone: toggleDone, addSet: addSet, removeSet: removeSet, setSession: setSession,
    toggleExtra: toggleExtra, lastValues: lastValues, fmtSets: fmtSets,
    timerStart: timerStart, timerRemaining: timerRemaining, timerAdd: timerAdd, fmtClock: fmtClock,
    saveBody: saveBody, deleteBody: deleteBody, navyBf: navyBf, saveNavy: saveNavy, fmtNum: fmtNum, series: series, avg7: avg7, chartSVG: chartSVG,
    shopToggle: shopToggle, shopKeys: shopKeys, shopReset: shopReset, shopCount: shopCount,
    render: render, viewTimer: viewTimer, viewVideo: viewVideo, videoId: videoId, EMBED: EMBED,
    STEP_GOAL: STEP_GOAL, HR_LOW: HR_LOW, HR_HIGH: HR_HIGH, CARDIO_TYPES: CARDIO_TYPES, TABS: TABS,
    fmtInt: fmtInt, parseSteps: parseSteps, setSteps: setSteps, deleteSteps: deleteSteps, parseDuration: parseDuration,
    saveUnit: saveUnit, deleteUnit: deleteUnit, unitsOn: unitsOn, weekSteps: weekSteps, cardioDays: cardioDays,
    hrClass: hrClass, wedCardio: wedCardio, stepsChartSVG: stepsChartSVG, viewEndurance: viewEndurance
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Core; else root.Core = Core;
})(this);
