<?php
// LAHIAM'S — API config (Wiazart Core: PHP + MySQL + SPs only)
// All secrets come from environment variables or a .env file. Never hardcode credentials.

// --- Load .env (Apache/PHP-CLI often has no env vars set) ---
(function () {
  $p = __DIR__ . '/../.env';
  if (!file_exists($p)) return;
  foreach (file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    $line = trim($line);
    if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
    list($k, $v) = explode('=', $line, 2);
    $k = trim($k); $v = trim($v);
    if (!isset($_ENV[$k])) { $_ENV[$k] = $v; putenv("$k=$v"); }
  }
})();

function env($key, $default = null) {
  if (isset($_ENV[$key])) return $_ENV[$key];
  $v = getenv($key);
  return $v === false ? $default : $v;
}

function getDb() {
  static $conn = null;
  if ($conn !== null) return $conn;
  $host = env('DB_HOST', 'localhost');
  $db   = env('DB_NAME', 'lahiams');
  $user = env('DB_USER', 'root');
  $pass = env('DB_PASS', '');
  $port = env('DB_PORT', '3306');
  $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
  try {
    $conn = new PDO($dsn, $user, $pass, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]);
  } catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'DB_CONNECT_FAILED']);
    exit;
  }
  // Tables are utf8mb4_0900_ai_ci (MySQL 8 native default); align the connection to match and avoid collation mismatch on SP comparisons.
  $conn->exec("SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci");
  return $conn;
}

// ---------- JWT HS256 (pure PHP, no external deps) ----------
function b64url($d) { return rtrim(strtr(base64_encode($d), '+/', '-_'), '='); }
function b64urlDecode($d) {
  $d = strtr($d, '-_', '+/');
  $pad = strlen($d) % 4; if ($pad) $d .= str_repeat('=', 4 - $pad);
  return base64_decode($d);
}
function jwtSign($payload) {
  $header = b64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
  $pl = b64url(json_encode($payload));
  $sig = b64url(hash_hmac('sha256', "$header.$pl", env('JWT_SECRET', 'change-me-secret'), true));
  return "$header.$pl.$sig";
}
function jwtVerify($token) {
  $parts = explode('.', $token);
  if (count($parts) !== 3) return null;
  list($h, $pl, $sig) = $parts;
  $expected = b64url(hash_hmac('sha256', "$h.$pl", env('JWT_SECRET', 'change-me-secret'), true));
  if (!hash_equals($expected, $sig)) return null;
  $payload = json_decode(b64urlDecode($pl), true);
  if (!is_array($payload)) return null;
  if (isset($payload['exp']) && $payload['exp'] < time()) return null;
  return $payload;
}
function getBearer() {
  $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
  if (preg_match('/Bearer\s+(.+)/i', $auth, $m)) return trim($m[1]);
  if (!empty($_SERVER['HTTP_X_API_TOKEN'])) return $_SERVER['HTTP_X_API_TOKEN'];
  return null;
}
function requireJwt() {
  $t = getBearer();
  if (!$t) { http_response_code(401); header('Content-Type: application/json'); echo json_encode(['error' => 'UNAUTHORIZED']); exit; }
  $p = jwtVerify($t);
  if (!$p) { http_response_code(401); header('Content-Type: application/json'); echo json_encode(['error' => 'UNAUTHORIZED']); exit; }
  $uid = (int)($p['sub'] ?? 0);
  if ($uid < 1) { http_response_code(401); header('Content-Type: application/json'); echo json_encode(['error' => 'UNAUTHORIZED']); exit; }
  return $uid;
}

// ---------- Rate limiting (file-based, per IP) — no inline SQL ----------
function rateLimit() {
  $max = (int)env('RATE_LIMIT_MAX', '120');
  $window = (int)env('RATE_LIMIT_WINDOW', '60');
  $ip = $_SERVER['REMOTE_ADDR'] ?? 'cli';
  if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $fwd = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $ip = trim($fwd[0]);
  }
  $dir = __DIR__ . '/cache/rl';
  if (!is_dir($dir)) @mkdir($dir, 0755, true);
  $file = $dir . '/rl_' . preg_replace('/[^a-zA-Z0-9]/', '_', $ip);
  $now = time();
  $hits = 1;
  if (is_file($file)) {
    $data = @json_decode(@file_get_contents($file), true);
    if (is_array($data)) {
      if (($now - (int)($data['ts'] ?? 0)) > $window) { $hits = 1; }
      else { $hits = (int)($data['hits'] ?? 0) + 1; }
    }
  }
  if ($hits > $max) {
    http_response_code(429);
    header('Content-Type: application/json');
    header('Retry-After: ' . $window);
    echo json_encode(['error' => 'RATE_LIMITED']);
    exit;
  }
  @file_put_contents($file, json_encode(['ts' => $now, 'hits' => $hits]), LOCK_EX);
}

function cors() {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); exit;
  }
}

// Security headers (defense-in-depth; also set at Apache level in prod)
function securityHeaders() {
  if (headers_sent()) return;
  header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  header('X-Content-Type-Options: nosniff');
  header('X-Frame-Options: DENY');
  header('Referrer-Policy: no-referrer');
  header("Permissions-Policy: geolocation=(), camera=(), microphone=()");
}

function jsonOut($data, $code = 200) {
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}
function jsonErr($msg, $code = 400) {
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode(['error' => $msg]);
  exit;
}

// Call a stored procedure with positional params (prepared, no inline SQL).
function callSP($conn, $name, $params = []) {
  $placeholders = $params ? implode(',', array_fill(0, count($params), '?')) : '';
  $sql = "CALL $name($placeholders)";
  $stmt = $conn->prepare($sql);
  if (!$stmt) jsonErr('SP_PREPARE_FAILED', 500);
  $stmt->execute($params);
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  while ($stmt->nextRowset()) { /* drain extra result sets from the SP */ }
  $stmt->closeCursor();
  return $rows;
}

function getJsonBody() {
  $raw = file_get_contents('php://input');
  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : [];
}

// ---------- MAPPERS: DB rows -> frontend shapes ----------
function mapPriorityDbToUi($p) { return $p === 'high' ? 'Alta' : ($p === 'low' ? 'Baja' : 'Media'); }
function mapStatusDbToUi($s) { return $s === 'active' ? 'En Progreso' : ($s === 'idea' ? 'Idea' : ($s === 'paused' ? 'Pausado' : 'Completado')); }
function mapStatusUiToDb($s) { return $s === 'En Progreso' ? 'active' : ($s === 'Idea' ? 'idea' : ($s === 'paused' ? 'paused' : 'done')); }
function mapTimeSlotDbToUi($ts) { return $ts === 'Mañana' ? 'morning' : ($ts === 'Tarde' ? 'afternoon' : 'evening'); }
function mapTimeSlotUiToDb($ts) { return $ts === 'morning' ? 'Mañana' : ($ts === 'afternoon' ? 'Tarde' : 'Noche'); }
function nullOr($v) { return ($v === null || $v === '') ? null : $v; }
