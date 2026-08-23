/* LAHIAM'S — vanilla SPA (HTML + JS). Consumes /api with JWT HS256. */
(function () {
  'use strict';
  const API = '/api';
  const $app = document.getElementById('app');
  const $toast = document.getElementById('toast');

  let TOKEN = localStorage.getItem('lahiams_token') || '';
  let USER = null;
  let VIEW = 'dashboard';
  const cache = {};

  // ---------- utils ----------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function toast(msg) {
    $toast.textContent = msg; $toast.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => ($toast.hidden = true), 2600);
  }
  async function api(path, opts) {
    opts = opts || {};
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    if (TOKEN) headers['Authorization'] = 'Bearer ' + TOKEN;
    const res = await fetch(API + path, { method: opts.method || 'GET', headers, body: opts.body });
    if (res.status === 401) { logout(); render(); throw new Error('auth'); }
    if (res.status === 429) { toast('Demasiadas solicitudes. Espera un momento.'); throw new Error('rate'); }
    if (res.status === 503) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'AI_NOT_CONFIGURED'); }
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'ERROR'); }
    const ct = res.headers.get('content-type') || '';
    return ct.indexOf('application/json') >= 0 ? res.json() : null;
  }
  async function get(path) { return api(path); }
  async function send(path, method, body) { return api(path, { method, body: JSON.stringify(body || {}) }); }

  function logout() { TOKEN = ''; USER = null; localStorage.removeItem('lahiams_token'); }

  // ---------- auth ----------
  async function doLogin(username, password) {
    const r = await api('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    TOKEN = r.token; USER = r.user; localStorage.setItem('lahiams_token', TOKEN);
    await bootstrap();
  }

  // ---------- views ----------
  const NAV = [
    ['dashboard', 'Dashboard'], ['tasks', 'Tareas'], ['projects', 'Proyectos'],
    ['calendar', 'Calendario'], ['money', 'Finanzas'], ['notes', 'Notas'],
    ['inbox', 'Bandeja'], ['ai', 'Asistente IA'], ['settings', 'Ajustes']
  ];

  function shell(inner) {
    if (!USER) return loginView();
    return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">LAHIAM<span>'S</span></div>
        ${NAV.map(([k, label]) => `<button class="nav-item ${VIEW === k ? 'active' : ''}" data-nav="${k}"><span class="dot"></span>${label}</button>`).join('')}
        <div class="spacer"></div>
        <button class="nav-item" data-action="logout">Cerrar sesión</button>
      </aside>
      <main class="main">
        <div class="topbar"><h1>${NAV.find(n => n[0] === VIEW)[1]}</h1>
          <div class="muted">${esc(USER && USER.name || 'Usuario')}</div></div>
        <div class="content" id="view">${inner}</div>
      </main>
    </div>`;
  }

  function loginView() {
    return `<div class="login-wrap"><div class="card login-card">
      <div class="brand center" style="padding:0 0 14px">LAHIAM<span>'S</span></div>
      <div class="muted center" style="margin-bottom:14px">Inicia sesión para continuar</div>
      <form id="loginForm">
        <label>Usuario</label><input name="username" autocomplete="username" required />
        <label>Contraseña</label><input name="password" type="password" autocomplete="current-password" required />
        <div class="row" style="margin-top:16px"><button class="btn" type="submit" style="width:100%">Entrar</button></div>
        <div id="loginErr" class="empty" style="color:var(--red)"></div>
      </form></div></div>`;
  }

  async function dashboardView() {
    const [tasks, projects, events, txns] = await Promise.all([
      get('/tasks'), get('/projects'), get('/calendar-events'), get('/transactions')
    ]);
    const done = (tasks || []).filter(t => t.completed).length;
    const today = (events || []).filter(e => e.date === 'Hoy' || (e.day && e.month === monthNow() && e.day === dayNow()));
    return `<div class="grid grid-4">
      ${stat((tasks || []).length, 'Tareas')}
      ${stat(done, 'Completadas')}
      ${stat((projects || []).length, 'Proyectos')}
      ${stat((txns || []).length, 'Movimientos')}
    </div>
    <div class="grid grid-2">
      <div class="card"><h3>Eventos de hoy</h3>${eventList(today)}</div>
      <div class="card"><h3>Quick Add</h3>
        <input id="qaTitle" placeholder="¿Qué necesitas hacer?" />
        <div class="row" style="margin-top:10px">
          <select id="qaPriority"><option>Alta</option><option selected>Media</option><option>Baja</option></select>
          <input id="qaDate" placeholder="Hoy / 2026-09-01" style="max-width:160px" />
          <button class="btn" data-action="qa-add">Agregar</button>
        </div>
      </div>
    </div>`;
  }

  function stat(n, l) { return `<div class="stat"><div class="n">${n}</div><div class="l">${esc(l)}</div></div>`; }

  async function tasksView() {
    const [tasks, projects] = await Promise.all([get('/tasks'), get('/projects')]);
    const items = (tasks || []).map(t => `
      <div class="item ${t.completed ? 'done' : ''}">
        <input type="checkbox" ${t.completed ? 'checked' : ''} data-action="task-toggle" data-id="${esc(t.id)}" />
        <div class="body"><div class="title">${esc(t.title)}</div>
          <div class="meta">${esc(t.dueDateLabel || t.date || '')}${t.project ? ' · ' + esc(t.project) : ''}</div></div>
        <span class="pill ${esc(t.priority || 'Media')}">${esc(t.priority || 'Media')}</span>
        <button class="btn ghost sm" data-action="task-del" data-id="${esc(t.id)}">✕</button>
      </div>`).join('') || '<div class="empty">Sin tareas</div>';
    const projOpts = (projects || []).map(p => `<option>${esc(p.title)}</option>`).join('');
    return `<div class="card">
      <h3>Nueva tarea</h3>
      <div class="row">
        <input id="tTitle" placeholder="Título" style="flex:2" />
        <select id="tPriority"><option>Alta</option><option selected>Media</option><option>Baja</option></select>
        <input id="tDate" placeholder="Hoy / fecha" style="max-width:150px" />
        <select id="tProject"><option value="">— proyecto —</option>${projOpts}</select>
        <button class="btn" data-action="task-add">Agregar</button>
      </div>
    </div>
    <div class="card"><h3>Tareas</h3><div class="list">${items}</div></div>`;
  }

  async function projectsView() {
    const projects = await get('/projects');
    const cards = (projects || []).map(p => `
      <div class="card">
        <div class="row"><span class="swatch" style="background:${esc(p.color || '#6366f1')}"></span>
          <strong>${esc(p.title)}</strong><span class="spacer"></span>
          <span class="pill status">${esc(p.status)}</span>
          <button class="btn ghost sm" data-action="proj-del" data-id="${esc(p.id)}">✕</button></div>
        <div class="muted" style="margin:8px 0">${esc(p.description || '')}</div>
        <div class="meta">${esc(p.dueDate || '')} · ${p.tasksCompleted || 0}/${p.tasksTotal || 0} tareas</div>
      </div>`).join('') || '<div class="empty">Sin proyectos</div>';
    return `<div class="card"><h3>Nuevo proyecto</h3>
      <div class="row"><input id="pTitle" placeholder="Título" style="flex:2" />
        <select id="pStatus"><option>En Progreso</option><option>Idea</option><option>Pausado</option><option>Completado</option></select>
        <input id="pColor" type="color" value="#6366f1" style="max-width:50px;padding:2px" />
        <input id="pDue" placeholder="Vence" style="max-width:140px" />
        <button class="btn" data-action="proj-add">Crear</button></div>
      <input id="pDesc" placeholder="Descripción" style="margin-top:10px" />
    </div>
    <div class="grid grid-3">${cards}</div>`;
  }

  async function calendarView() {
    const events = await get('/calendar-events?month=' + monthNow());
    return `<div class="card"><h3>Nuevo evento</h3>
      <div class="row">
        <input id="eTitle" placeholder="Título" style="flex:2" />
        <input id="eDay" type="number" min="1" max="31" placeholder="Día" style="max-width:80px" />
        <input id="eMonth" type="number" min="1" max="12" placeholder="Mes" style="max-width:80px" />
        <input id="eYear" type="number" placeholder="Año" style="max-width:90px" />
        <input id="eTime" type="time" style="max-width:120px" />
        <select id="eType"><option value="event">Evento</option><option value="task">Tarea</option><option value="reminder">Recordatorio</option></select>
        <input id="eColor" type="color" value="#8b5cf6" style="max-width:50px;padding:2px" />
        <button class="btn" data-action="event-add">Agregar</button>
      </div></div>
    <div class="card"><h3>Eventos (${esc(monthNow())})</h3><div class="list">${eventList(events)}</div></div>`;
  }
  function eventList(events) {
    if (!events || !events.length) return '<div class="empty">Sin eventos</div>';
    return events.map(e => `<div class="item">
      <span class="swatch" style="background:${esc(e.color || '#8b5cf6')}"></span>
      <div class="body"><div class="title">${esc(e.title)}</div>
        <div class="meta">${esc(e.day || '')}/${esc(e.month || '')} ${esc(e.time || '')} · ${esc(e.type || '')}</div></div>
      <button class="btn ghost sm" data-action="event-del" data-id="${esc(e.id)}">✕</button>
    </div>`).join('');
  }

  async function moneyView() {
    const txns = await get('/transactions');
    const rows = (txns || []).map(t => `<div class="item">
      <div class="body"><div class="title">${esc(t.title)}</div>
        <div class="meta">${esc(t.date || '')} · ${esc(t.category || '')} · ${esc(t.type || '')}</div></div>
      <strong style="color:${t.type === 'income' ? 'var(--green)' : 'var(--red)'}">${t.type === 'income' ? '+' : '-'}${esc(t.amount)}</strong>
      <button class="btn ghost sm" data-action="txn-del" data-id="${esc(t.id)}">✕</button>
    </div>`).join('') || '<div class="empty">Sin movimientos</div>';
    return `<div class="card"><h3>Nuevo movimiento</h3>
      <div class="row"><input id="mTitle" placeholder="Concepto" style="flex:2" />
        <select id="mType"><option value="expense">Gasto</option><option value="income">Ingreso</option></select>
        <input id="mAmount" type="number" step="0.01" placeholder="Monto" style="max-width:120px" />
        <input id="mCat" placeholder="Categoría" style="max-width:130px" />
        <input id="mDate" placeholder="Fecha" style="max-width:130px" />
        <button class="btn" data-action="txn-add">Agregar</button></div></div>
    <div class="card"><h3>Movimientos</h3><div class="list">${rows}</div></div>`;
  }

  async function notesView() {
    const notes = await get('/notes');
    const rows = (notes || []).map(n => `<div class="item">
      <span class="swatch" style="background:${esc(n.color || '#6366f1')}"></span>
      <div class="body"><div class="title">${esc(n.title)}</div><div class="meta">${esc((n.content || '').slice(0, 80))}</div></div>
      <button class="btn ghost sm" data-action="note-del" data-id="${esc(n.id)}">✕</button>
    </div>`).join('') || '<div class="empty">Sin notas</div>';
    return `<div class="card"><h3>Nueva nota</h3>
      <input id="nTitle" placeholder="Título" />
      <textarea id="nContent" placeholder="Contenido" style="margin-top:10px"></textarea>
      <div class="row" style="margin-top:10px"><input id="nColor" type="color" value="#6366f1" style="max-width:50px;padding:2px" />
        <button class="btn" data-action="note-add">Guardar</button></div></div>
    <div class="card"><h3>Notas</h3><div class="list">${rows}</div></div>`;
  }

  async function inboxView() {
    const items = await get('/inbox');
    const rows = (items || []).map(i => `<div class="item">
       <div class="body"><div class="title">${esc(i.text || '')}</div></div>
      <button class="btn sm" data-action="inbox-convert" data-id="${esc(i.id)}">→ Tarea</button>
      <button class="btn ghost sm" data-action="inbox-del" data-id="${esc(i.id)}">✕</button>
    </div>`).join('') || '<div class="empty">Bandeja vacía</div>';
    return `<div class="card"><h3>Nuevo elemento</h3>
      <input id="iTitle" placeholder="Título" />
      <textarea id="iNote" placeholder="Nota" style="margin-top:10px"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn" data-action="inbox-add">Agregar</button></div></div>
    <div class="card"><h3>Bandeja de entrada</h3><div class="list">${rows}</div></div>`;
  }

  async function aiView() {
    return `<div class="card"><h3>Asistente IA</h3>
      <div class="chat" id="aiChat"><div class="msg ai">Hola, soy tu asistente. ¿En qué puedo ayudarte?</div></div>
      <div class="row" style="margin-top:12px"><input id="aiInput" placeholder="Escribe un mensaje..." style="flex:1" />
        <button class="btn" data-action="ai-send">Enviar</button></div>
      <div class="muted" style="margin-top:8px">Requiere GEMINI_API_KEY configurada en el servidor.</div>
    </div>`;
  }

  async function settingsView() {
    const prof = await get('/profile');
    const p = (prof && prof[0]) || {};
    return `<div class="card"><h3>Perfil</h3>
      <label>Nombre</label><input id="sName" value="${esc(p.name || '')}" />
      <label>Email</label><input id="sEmail" value="${esc(p.email || '')}" />
      <label>Plan</label><input id="sPlan" value="${esc(p.plan || 'Premium')}" />
      <div class="row" style="margin-top:14px"><button class="btn" data-action="profile-save">Guardar</button></div>
    </div>
    <div class="card"><h3>Seguridad</h3>
      <div class="muted">Autenticación con JWT HS256. El secreto y las credenciales viven en <code>.env</code> (fuera del repo).</div>
      <div class="row" style="margin-top:12px"><button class="btn danger" data-action="logout">Cerrar sesión</button></div>
    </div>`;
  }

  // ---------- render ----------
  const VIEWS = {
    dashboard: dashboardView, tasks: tasksView, projects: projectsView, calendar: calendarView,
    money: moneyView, notes: notesView, inbox: inboxView, ai: aiView, settings: settingsView
  };
  async function render() {
    if (!TOKEN) { $app.innerHTML = loginView(); bindLogin(); return; }
    $app.innerHTML = shell('<div class="empty">Cargando…</div>');
    try {
      const html = await (VIEWS[VIEW] || dashboardView)();
      const v = document.getElementById('view'); if (v) v.innerHTML = html;
    } catch (e) { /* auth handled */ }
    bindView();
  }

  function monthNow() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function dayNow() { return String(new Date().getDate()); }

  // ---------- events ----------
  function bindLogin() {
    const f = document.getElementById('loginForm');
    if (!f) return;
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = document.getElementById('loginErr'); err.textContent = '';
      try { await doLogin(f.username.value, f.password.value); }
      catch (ex) { err.textContent = 'Credenciales inválidas'; }
    });
  }

  function bindView() {
    $app.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => { VIEW = b.dataset.nav; render(); }));
    $app.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', onAction));
  }

  async function onAction(e) {
    const b = e.currentTarget; const a = b.dataset.action; const id = b.dataset.id;
    try {
      if (a === 'logout') { logout(); render(); return; }
      if (a === 'qa-add') {
        await send('/tasks', 'POST', { title: val('qaTitle'), priority: val('qaPriority'), date: val('qaDate') });
        toast('Tarea agregada'); return render();
      }
      if (a === 'task-add') {
        await send('/tasks', 'POST', { title: val('tTitle'), priority: val('tPriority'), date: val('tDate'), project: val('tProject') });
        toast('Tarea agregada'); return render();
      }
      if (a === 'task-toggle') {
        await send('/tasks/' + id + '/toggle', 'PATCH'); return render();
      }
      if (a === 'task-del') { await send('/tasks/' + id, 'DELETE'); return render(); }
      if (a === 'proj-add') {
        await send('/projects', 'POST', { title: val('pTitle'), status: val('pStatus'), description: val('pDesc'), color: val('pColor'), dueDate: val('pDue') });
        toast('Proyecto creado'); return render();
      }
      if (a === 'proj-del') { await send('/projects/' + id, 'DELETE'); return render(); }
      if (a === 'event-add') {
        await send('/calendar-events', 'POST', {
          title: val('eTitle'), day: val('eDay'), month: val('eMonth'), year: val('eYear'),
          time: val('eTime'), type: val('eType'), color: val('eColor')
        });
        toast('Evento creado'); return render();
      }
      if (a === 'event-del') { await send('/calendar-events/' + id, 'DELETE'); return render(); }
      if (a === 'txn-add') {
        await send('/transactions', 'POST', { title: val('mTitle'), type: val('mType'), amount: val('mAmount'), category: val('mCat'), date: val('mDate') });
        toast('Movimiento agregado'); return render();
      }
      if (a === 'txn-del') { await send('/transactions/' + id, 'DELETE'); return render(); }
      if (a === 'note-add') {
        await send('/notes', 'POST', { title: val('nTitle'), content: val('nContent'), color: val('nColor') });
        toast('Nota guardada'); return render();
      }
      if (a === 'note-del') { await send('/notes/' + id, 'DELETE'); return render(); }
      if (a === 'inbox-add') {
        await send('/inbox', 'POST', { title: val('iTitle'), note: val('iNote') });
        toast('Agregado a la bandeja'); return render();
      }
      if (a === 'inbox-del') { await send('/inbox/' + id, 'DELETE'); return render(); }
      if (a === 'inbox-convert') {
        const r = await send('/inbox/' + id + '/convert', 'POST');
        toast('Convertido a tarea #' + (r && r.id)); return render();
      }
      if (a === 'profile-save') {
        await send('/profile', 'PUT', { name: val('sName'), email: val('sEmail'), plan: val('sPlan') });
        toast('Perfil guardado'); return;
      }
      if (a === 'ai-send') { return aiSend(); }
    } catch (ex) { toast(ex.message || 'Error'); }
  }

  async function aiSend() {
    const input = document.getElementById('aiInput');
    const chat = document.getElementById('aiChat');
    if (!input || !chat || !input.value.trim()) return;
    const msg = input.value.trim(); input.value = '';
    chat.appendChild(el('div', 'msg user', msg));
    try {
      const r = await send('/ai', 'POST', { message: msg });
      chat.appendChild(el('div', 'msg ai', (r && r.reply) || 'Sin respuesta'));
    } catch (ex) { chat.appendChild(el('div', 'msg ai', '⚠️ ' + ex.message)); }
    chat.scrollTop = chat.scrollHeight;
  }

  function val(id) { const e = document.getElementById(id); return e ? e.value : ''; }
  function el(tag, cls, txt) { const e = document.createElement(tag); e.className = cls; e.textContent = txt; return e; }

  async function bootstrap() {
    try { const p = await get('/profile'); USER = USER || {}; if (p && p[0]) USER.name = p[0].name; }
    catch (e) { USER = USER || {}; }
    render();
  }

  // ---------- init ----------
  if (TOKEN) { bootstrap(); } else { render(); }
})();
