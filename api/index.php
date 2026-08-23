<?php
// LAHIAM'S — REST API front controller (PHP 8.3, MySQL via Stored Procedures)
require_once __DIR__ . '/config.php';

cors();
securityHeaders();
rateLimit();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = preg_replace('#^/api#', '', $uri);
$segs = array_values(array_filter(explode('/', trim($uri, '/')), fn($s) => $s !== ''));
$resource = $segs[0] ?? '';
$id = $segs[1] ?? null;
$sub = $segs[2] ?? null;

// ---------------- AUTH (public) ----------------
if ($resource === 'auth' && $id === 'login' && $method === 'POST') {
  $b = getJsonBody();
  $u = env('APP_USER', 'admin');
  $p = env('APP_PASS', 'admin123');
  if (($b['username'] ?? '') === $u && ($b['password'] ?? '') === $p) {
    $token = jwtSign(['sub' => 1, 'iat' => time(), 'exp' => time() + 60 * 60 * 24 * 7]);
    jsonOut(['token' => $token, 'user' => ['id' => 1, 'name' => 'Freddy Mercer']]);
  }
  jsonErr('INVALID_CREDENTIALS', 401);
}

$uid = requireJwt();
$conn = getDb();

// ---------------- SETUP (run migrations once) ----------------
if ($resource === 'setup' && $method === 'POST') {
  runMigrations($conn);
  jsonOut(['ok' => true]);
}

// ---------------- PROFILE ----------------
if ($resource === 'profile') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_profile_get', [$uid]);
    jsonOut($rows ? [mapProfile($rows[0])] : []);
  }
  if ($method === 'PUT') {
    $b = getJsonBody();
    $rows = callSP($conn, 'sp_profile_update', [
      $uid, $b['name'] ?? '', $b['avatar'] ?? '', $b['plan'] ?? 'Premium', $b['email'] ?? ''
    ]);
    jsonOut($rows ? mapProfile($rows[0]) : []);
  }
}

// ---------------- TASKS ----------------
if ($resource === 'tasks') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_tasks_list', [$uid]);
    jsonOut(array_map('mapTask', $rows));
  }
  if ($method === 'POST') {
    $b = getJsonBody();
    $rows = callSP($conn, 'sp_tasks_create', [
      $uid, $b['title'] ?? '', $b['notes'] ?? '',
      mapPriorityUiToDb($b['priority'] ?? 'Media'),
      nullOr($b['date'] ?? $b['dueDate'] ?? null),
      $b['list'] ?? 'inbox',
      nullOr($b['projectId'] ?? $b['project'] ?? null)
    ]);
    jsonOut(['id' => (string)($rows[0]['id'] ?? 0)]);
  }
  if ($method === 'PUT' && $id) {
    $b = getJsonBody();
    callSP($conn, 'sp_tasks_update', [
      $id, $uid, $b['title'] ?? '', $b['notes'] ?? '',
      isset($b['completed']) ? ($b['completed'] ? 1 : 0) : 0,
      mapPriorityUiToDb($b['priority'] ?? 'Media'),
      nullOr($b['date'] ?? $b['dueDate'] ?? null),
      $b['list'] ?? 'inbox',
      nullOr($b['projectId'] ?? $b['project'] ?? null)
    ]);
    jsonOut(['ok' => true]);
  }
  if ($method === 'DELETE' && $id) {
    callSP($conn, 'sp_tasks_delete', [$id, $uid]);
    jsonOut(['ok' => true]);
  }
  if ($method === 'PATCH' && $id && $sub === 'toggle') {
    $rows = callSP($conn, 'sp_tasks_toggle', [$id, $uid]);
    jsonOut(['completed' => (bool)($rows[0]['completed'] ?? false)]);
  }
}

// ---------------- PROJECTS ----------------
if ($resource === 'projects') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_projects_list', [$uid]);
    jsonOut(array_map('mapProject', $rows));
  }
  if ($method === 'POST') {
    $b = getJsonBody();
    $rows = callSP($conn, 'sp_projects_create', [
      $uid, $b['title'] ?? '', $b['description'] ?? '', $b['color'] ?? $b['category'] ?? 'indigo',
      mapStatusUiToDb($b['status'] ?? 'En Progreso'), (int)($b['progress'] ?? 0),
      nullOr($b['dueDate'] ?? null)
    ]);
    jsonOut(['id' => (string)($rows[0]['id'] ?? 0)]);
  }
  if ($method === 'PUT' && $id) {
    $b = getJsonBody();
    callSP($conn, 'sp_projects_update', [
      $id, $uid, $b['title'] ?? '', $b['description'] ?? '', $b['color'] ?? $b['category'] ?? 'indigo',
      mapStatusUiToDb($b['status'] ?? 'En Progreso'), (int)($b['progress'] ?? 0),
      nullOr($b['dueDate'] ?? null)
    ]);
    jsonOut(['ok' => true]);
  }
  if ($method === 'DELETE' && $id) {
    callSP($conn, 'sp_projects_delete', [$id, $uid]);
    jsonOut(['ok' => true]);
  }
}

// ---------------- CALENDAR EVENTS ----------------
if ($resource === 'calendar-events') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_calendar_events_list', [$uid]);
    jsonOut(array_map('mapCalendarEvent', $rows));
  }
  if ($method === 'POST') {
    $b = getJsonBody();
    $day = $b['day'] ?? null; $month = $b['month'] ?? null; $year = $b['year'] ?? null;
    $eventDate = ($day && $month && $year) ? sprintf('%04d-%02d-%02d', $year, $month, $day) : nullOr($b['eventDate'] ?? null);
    $rows = callSP($conn, 'sp_calendar_events_create', [
      $uid, $b['title'] ?? '', nullOr($eventDate), nullOr($b['time'] ?? null),
      $b['type'] ?? 'event', nullOr(mapPriorityUiToDb($b['priority'] ?? 'Media')), $b['color'] ?? 'indigo'
    ]);
    jsonOut(['id' => (string)($rows[0]['id'] ?? 0)]);
  }
  if ($method === 'PUT' && $id) {
    $b = getJsonBody();
    $day = $b['day'] ?? null; $month = $b['month'] ?? null; $year = $b['year'] ?? null;
    $eventDate = ($day && $month && $year) ? sprintf('%04d-%02d-%02d', $year, $month, $day) : nullOr($b['eventDate'] ?? null);
    callSP($conn, 'sp_calendar_events_update', [
      $id, $uid, $b['title'] ?? '', nullOr($eventDate), nullOr($b['time'] ?? null),
      $b['type'] ?? 'event', nullOr(mapPriorityUiToDb($b['priority'] ?? 'Media')), $b['color'] ?? 'indigo'
    ]);
    jsonOut(['ok' => true]);
  }
  if ($method === 'DELETE' && $id) {
    callSP($conn, 'sp_calendar_events_delete', [$id, $uid]);
    jsonOut(['ok' => true]);
  }
}

// ---------------- RECURRING ----------------
if ($resource === 'recurring') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_recurring_list', [$uid]);
    jsonOut(array_map('mapRecurring', $rows));
  }
  if ($method === 'POST') {
    $b = getJsonBody();
    $rows = callSP($conn, 'sp_recurring_create', [
      $uid, $b['title'] ?? '', (int)($b['dayOfWeek'] ?? 1),
      mapTimeSlotUiToDb($b['timeSlot'] ?? 'Mañana'), $b['color'] ?? 'indigo',
      (float)($b['amount'] ?? 0)
    ]);
    jsonOut(['id' => (string)($rows[0]['id'] ?? 0)]);
  }
  if ($method === 'DELETE' && $id) {
    callSP($conn, 'sp_recurring_delete', [$id, $uid]);
    jsonOut(['ok' => true]);
  }
}

// ---------------- TRANSACTIONS ----------------
if ($resource === 'transactions') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_transactions_list', [$uid]);
    jsonOut(array_map('mapTransaction', $rows));
  }
  if ($method === 'POST') {
    $b = getJsonBody();
    $rows = callSP($conn, 'sp_transactions_create', [
      $uid, $b['name'] ?? $b['title'] ?? '', (float)($b['amount'] ?? 0),
      $b['type'] ?? 'expense', $b['category'] ?? 'general',
      $b['paymentMethod'] ?? 'efectivo', nullOr($b['date'] ?? null)
    ]);
    jsonOut(['id' => (string)($rows[0]['id'] ?? 0)]);
  }
  if ($method === 'DELETE' && $id) {
    callSP($conn, 'sp_transactions_delete', [$id, $uid]);
    jsonOut(['ok' => true]);
  }
}

// ---------------- NOTES ----------------
if ($resource === 'notes') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_notes_list', [$uid]);
    jsonOut(array_map('mapNote', $rows));
  }
  if ($method === 'POST') {
    $b = getJsonBody();
    $rows = callSP($conn, 'sp_notes_create', [
      $uid, $b['title'] ?? '', $b['content'] ?? '', $b['type'] ?? 'General',
      isset($b['pinned']) ? ($b['pinned'] ? 1 : 0) : 0,
      isset($b['favorite']) ? ($b['favorite'] ? 1 : 0) : 0,
      nullOr($b['folder'] ?? null)
    ]);
    jsonOut(['id' => (string)($rows[0]['id'] ?? 0)]);
  }
  if ($method === 'PUT' && $id) {
    $b = getJsonBody();
    callSP($conn, 'sp_notes_update', [
      $id, $uid, $b['title'] ?? '', $b['content'] ?? '', $b['type'] ?? 'General',
      isset($b['pinned']) ? ($b['pinned'] ? 1 : 0) : 0,
      isset($b['favorite']) ? ($b['favorite'] ? 1 : 0) : 0,
      nullOr($b['folder'] ?? null)
    ]);
    jsonOut(['ok' => true]);
  }
  if ($method === 'DELETE' && $id) {
    callSP($conn, 'sp_notes_delete', [$id, $uid]);
    jsonOut(['ok' => true]);
  }
}

// ---------------- INBOX ----------------
if ($resource === 'inbox') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_inbox_list', [$uid]);
    jsonOut(array_map('mapInbox', $rows));
  }
  if ($sub === 'convert' && $method === 'POST' && $id) {
    $list = callSP($conn, 'sp_inbox_list', [$uid]);
    $item = null;
    foreach ($list as $r) { if ((string)$r['id'] === (string)$id) { $item = $r; break; } }
    if (!$item) jsonErr('NOT_FOUND', 404);
    callSP($conn, 'sp_tasks_create', [$uid, $item['text'], '', 'medium', null, 'inbox', null]);
    callSP($conn, 'sp_inbox_update', [$id, $uid, 'task']);
    jsonOut(['ok' => true]);
  }
  if ($method === 'POST') {
    $b = getJsonBody();
    $text = trim(($b['text'] ?? '') . ' ' . ($b['title'] ?? '') . ' ' . ($b['note'] ?? ''));
    $text = trim($text);
    if ($text === '') jsonErr('EMPTY_TEXT', 400);
    $rows = callSP($conn, 'sp_inbox_create', [$uid, $text]);
    jsonOut(['id' => (string)($rows[0]['id'] ?? 0)]);
  }
  if ($method === 'PUT' && $id) {
    $b = getJsonBody();
    callSP($conn, 'sp_inbox_update', [$id, $uid, nullOr($b['convertedTo'] ?? null)]);
    jsonOut(['ok' => true]);
  }
  if ($method === 'DELETE' && $id) {
    callSP($conn, 'sp_inbox_delete', [$id, $uid]);
    jsonOut(['ok' => true]);
  }
}

// ---------------- AI ----------------
if ($resource === 'ai') {
  if ($method === 'GET') {
    $rows = callSP($conn, 'sp_ai_messages_list', [$uid]);
    jsonOut(array_map('mapAiMessage', $rows));
  }
  if ($method === 'POST') {
    $b = getJsonBody();
    $text = trim($b['text'] ?? $b['message'] ?? '');
    if ($text === '') jsonErr('EMPTY_MESSAGE');
    $key = env('GEMINI_API_KEY', '');
    if ($key === '') {
      jsonErr('AI_NOT_CONFIGURED', 503);
    }
    callSP($conn, 'sp_ai_messages_create', [$uid, 'user', $text]);
    $reply = callGemini($key, $text);
    callSP($conn, 'sp_ai_messages_create', [$uid, 'ai', $reply]);
    jsonOut(['reply' => $reply]);
  }
}

jsonErr('NOT_FOUND', 404);

// ================= MAPPERS =================
function mapProfile($r) {
  return [
    'id' => (string)$r['id'], 'name' => $r['name'], 'fullName' => $r['name'],
    'avatar' => $r['avatar'] ?? '', 'plan' => $r['plan'], 'email' => $r['email'] ?? ''
  ];
}
function mapTask($r) {
  return [
    'id' => (string)$r['id'], 'title' => $r['title'], 'time' => nullOr($r['time'] ?? null),
    'date' => nullOr($r['due_date']), 'priority' => mapPriorityDbToUi($r['priority']),
    'project' => nullOr($r['project_title'] ?? $r['project_id'] ?? null),
    'category' => null, 'completed' => (bool)$r['completed'],
    'dueDateLabel' => nullOr($r['due_date']), 'name' => $r['title']
  ];
}
function mapProject($r) {
  $tc = (int)($r['tasks_completed'] ?? 0);
  $tt = (int)($r['tasks_total'] ?? 0);
  return [
    'id' => (string)$r['id'], 'title' => $r['title'], 'description' => $r['description'] ?? '',
    'status' => mapStatusDbToUi($r['status']), 'progress' => (int)$r['progress'],
    'tasksCompleted' => $tc, 'tasksTotal' => $tt, 'taskCount' => $tt,
    'dueDate' => nullOr($r['due_date']) ?? 'Por definir', 'category' => nullOr($r['color'] ?? null),
    'color' => $r['color'] ?? 'indigo', 'name' => $r['title']
  ];
}
function mapCalendarEvent($r) {
  $ts = strtotime($r['event_date']);
  return [
    'id' => (string)$r['id'], 'day' => (int)date('j', $ts), 'month' => (int)date('n', $ts),
    'year' => (int)date('Y', $ts), 'title' => $r['title'], 'time' => nullOr($r['event_time']),
    'type' => $r['type'] ?? 'event', 'priority' => nullOr($r['priority']),
    'attendees' => 0, 'color' => $r['color'] ?? 'indigo'
  ];
}
function mapRecurring($r) {
  $dow = (int)$r['day_of_week'];
  $label = nextWeekdayLabel($dow);
  return [
    'id' => (string)$r['id'], 'title' => $r['title'], 'dueDate' => $label,
    'amount' => (float)$r['amount'], 'logoLetter' => mb_strtoupper(mb_substr($r['title'], 0, 1)),
    'color' => $r['color'] ?? 'indigo'
  ];
}
function mapTransaction($r) {
  return [
    'id' => (string)$r['id'], 'title' => $r['name'], 'name' => $r['name'],
    'category' => $r['category'], 'amount' => (float)$r['amount'], 'type' => $r['type'],
    'paymentMethod' => $r['payment_method'], 'date' => $r['txn_date'],
    'dateGroup' => '', 'icon' => ''
  ];
}
function mapNote($r) {
  return [
    'id' => (string)$r['id'], 'title' => $r['title'], 'content' => $r['content'] ?? '',
    'type' => $r['type'], 'tags' => [], 'pinned' => (bool)$r['pinned'],
    'favorite' => (bool)$r['favorite'], 'updatedAt' => $r['created_at'],
    'folder' => nullOr($r['folder'] ?? null)
  ];
}
function mapInbox($r) {
  return [
    'id' => (string)$r['id'], 'text' => $r['text'], 'createdAt' => $r['created_at'],
    'convertedTo' => nullOr($r['converted_to'] ?? null)
  ];
}
function mapAiMessage($r) {
  return [
    'id' => (string)$r['id'], 'sender' => $r['sender'], 'text' => $r['text'],
    'timestamp' => $r['created_at']
  ];
}

function mapPriorityUiToDb($p) {
  return $p === 'Alta' ? 'high' : ($p === 'Baja' ? 'low' : 'medium');
}

function nextWeekdayLabel($dow) {
  $es = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  $today = (int)date('w');
  $diff = ($dow - $today + 7) % 7;
  if ($diff === 0) $diff = 7;
  $d = strtotime("+$diff days");
  return $es[$dow] . ' ' . date('j', $d) . ' ' . ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][(int)date('n', $d) - 1];
}

function callGemini($key, $prompt) {
  $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $key;
  $body = json_encode(['contents' => [['parts' => [['text' => $prompt]]]]]);
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => $body, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30
  ]);
  $resp = curl_exec($ch);
  curl_close($ch);
  if (!$resp) return 'No pude conectar con el asistente en este momento.';
  $data = json_decode($resp, true);
  return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Sin respuesta del asistente.';
}

function runMigrations($conn) {
  $dir = __DIR__ . '/sql/';
  // Ensure DB default collation matches the schema (utf8mb4_0900_ai_ci) so SP
  // parameters (which inherit the DB default) don't collide with table columns.
  $dbName = env('DB_NAME', 'lahiams');
  $conn->exec("ALTER DATABASE `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci");
  // drop existing tables for a clean, idempotent migrate
  $conn->query('SET FOREIGN_KEY_CHECKS=0');
  foreach (['calendar_events','recurring_events','inbox_items','notes','transactions','tasks','projects','users'] as $t) {
    $conn->query("DROP TABLE IF EXISTS `$t`");
  }
  $conn->query('SET FOREIGN_KEY_CHECKS=1');
  // schema
  $schema = file_get_contents($dir . 'schema.sql');
  foreach (array_filter(array_map('trim', explode(';', $schema))) as $stmt) {
    if ($stmt === '') continue;
    $conn->query($stmt);
  }
  // stored procedures (use // as delimiter, strip DELIMITER lines)
  $sp = file_get_contents($dir . 'stored_procedures.sql');
  $sp = preg_replace('/DELIMITER\s+\/\//', '', $sp);
  $sp = preg_replace('/DELIMITER\s+;/', '', $sp);
  $blocks = array_filter(array_map('trim', explode('//', $sp)));
  foreach ($blocks as $block) {
    if ($block === '') continue;
    if (preg_match('/CREATE\s+PROCEDURE\s+`?(\w+)`?/i', $block, $m)) {
      $conn->query("DROP PROCEDURE IF EXISTS `{$m[1]}`");
    }
    $conn->query($block);
  }
  // seed
  $seed = file_get_contents($dir . 'seed.sql');
  foreach (array_filter(array_map('trim', explode(';', $seed))) as $stmt) {
    if ($stmt === '') continue;
    $conn->query($stmt);
  }
}
