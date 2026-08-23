-- ============================================================
-- LAHIAM'S — Esquema MySQL 8 (Wiazart Core: PHP + MySQL + SPs)
-- Sin datos mock: solo estructura + 1 usuario real de base.
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(160) NOT NULL DEFAULT 'Usuario',
  avatar     VARCHAR(512) DEFAULT '',
  plan       VARCHAR(60)  DEFAULT 'Premium',
  email      VARCHAR(200) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS tasks (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NOT NULL,
  title      VARCHAR(255) NOT NULL,
  notes      TEXT,
  completed  TINYINT(1) NOT NULL DEFAULT 0,
  priority   ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  due_date   VARCHAR(50) NULL,
  list       ENUM('inbox','today','upcoming','overdue') NOT NULL DEFAULT 'inbox',
  project_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id),
  INDEX (list),
  INDEX (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS projects (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  color       VARCHAR(40) NOT NULL DEFAULT 'indigo',
  status      ENUM('idea','active','paused','done') NOT NULL DEFAULT 'active',
  progress    INT NOT NULL DEFAULT 0,
  due_date    VARCHAR(50) NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS calendar_events (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NOT NULL,
  title      VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(20) NULL,
  type       VARCHAR(20) NOT NULL DEFAULT 'event',
  priority   VARCHAR(10) NULL,
  color      VARCHAR(40) NOT NULL DEFAULT 'indigo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id),
  INDEX (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS recurring_events (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  day_of_week TINYINT NOT NULL COMMENT '0=Dom .. 6=Sab',
  time_slot   VARCHAR(40) NULL,
  amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
  color       VARCHAR(40) NOT NULL DEFAULT 'indigo',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS transactions (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  user_id        INT NOT NULL,
  name           VARCHAR(255) NOT NULL,
  amount         DECIMAL(12,2) NOT NULL DEFAULT 0,
  type           ENUM('income','expense') NOT NULL DEFAULT 'expense',
  category       VARCHAR(80) NOT NULL DEFAULT 'general',
  payment_method VARCHAR(80) NOT NULL DEFAULT 'efectivo',
  txn_date       VARCHAR(50) NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id),
  INDEX (txn_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS notes (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  user_id   INT NOT NULL,
  title     VARCHAR(255) NOT NULL,
  content   TEXT,
  type      VARCHAR(60) NOT NULL DEFAULT 'General',
  pinned    TINYINT(1) NOT NULL DEFAULT 0,
  favorite  TINYINT(1) NOT NULL DEFAULT 0,
  folder    VARCHAR(80) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS inbox_items (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  user_id      INT NOT NULL,
  text         VARCHAR(512) NOT NULL,
  converted_to VARCHAR(40) NULL COMMENT 'Task|Event|Reminder|Note|Project',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS ai_messages (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NOT NULL,
  sender     ENUM('user','ai') NOT NULL,
  text       TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
