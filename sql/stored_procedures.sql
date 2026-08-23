-- ============================================================
-- LAHIAM'S — Stored Procedures (única vía de acceso a datos)
-- El backend PHP SOLO llama a estos SPs (cero SQL inline).
-- ============================================================

DELIMITER //

-- ---------------- PROFILE ----------------
CREATE PROCEDURE sp_profile_get(IN p_user_id INT)
BEGIN
  SELECT id, name, avatar, plan, email FROM users WHERE id = p_user_id LIMIT 1;
END //

CREATE PROCEDURE sp_profile_update(
  IN p_user_id INT, IN p_name VARCHAR(160), IN p_avatar VARCHAR(512),
  IN p_plan VARCHAR(60), IN p_email VARCHAR(200)
)
BEGIN
  UPDATE users SET name = p_name, avatar = p_avatar, plan = p_plan, email = p_email
  WHERE id = p_user_id;
  SELECT id, name, avatar, plan, email FROM users WHERE id = p_user_id LIMIT 1;
END //

-- ---------------- TASKS ----------------
CREATE PROCEDURE sp_tasks_list(IN p_user_id INT)
BEGIN
  SELECT t.id, t.user_id, t.title, t.notes, t.completed, t.priority, t.due_date, t.list, t.project_id,
         t.created_at, (SELECT title FROM projects p WHERE p.id = t.project_id) AS project_title
  FROM tasks t WHERE t.user_id = p_user_id ORDER BY t.created_at DESC;
END //

CREATE PROCEDURE sp_tasks_create(
  IN p_user_id INT, IN p_title VARCHAR(255), IN p_notes TEXT,
  IN p_priority VARCHAR(10), IN p_due_date VARCHAR(50), IN p_list VARCHAR(12),
  IN p_project_name VARCHAR(255)
)
BEGIN
  DECLARE v_pid INT DEFAULT NULL;
  IF p_project_name IS NOT NULL AND p_project_name <> '' THEN
    SELECT id INTO v_pid FROM projects WHERE user_id = p_user_id AND title = p_project_name LIMIT 1;
  END IF;
  INSERT INTO tasks (user_id, title, notes, priority, due_date, list, project_id)
  VALUES (p_user_id, p_title, p_notes, p_priority, p_due_date, p_list, v_pid);
  SELECT LAST_INSERT_ID() AS id;
END //

CREATE PROCEDURE sp_tasks_update(
  IN p_id INT, IN p_user_id INT, IN p_title VARCHAR(255), IN p_notes TEXT,
  IN p_completed TINYINT(1), IN p_priority VARCHAR(10), IN p_due_date VARCHAR(50),
  IN p_list VARCHAR(12), IN p_project_name VARCHAR(255)
)
BEGIN
  DECLARE v_pid INT DEFAULT NULL;
  IF p_project_name IS NOT NULL AND p_project_name <> '' THEN
    SELECT id INTO v_pid FROM projects WHERE user_id = p_user_id AND title = p_project_name LIMIT 1;
  END IF;
  UPDATE tasks
    SET title = p_title, notes = p_notes, completed = p_completed,
        priority = p_priority, due_date = p_due_date, list = p_list, project_id = v_pid
  WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

CREATE PROCEDURE sp_tasks_toggle(IN p_id INT, IN p_user_id INT)
BEGIN
  UPDATE tasks SET completed = IF(completed, 0, 1) WHERE id = p_id AND user_id = p_user_id;
  SELECT completed FROM tasks WHERE id = p_id AND user_id = p_user_id;
END //

CREATE PROCEDURE sp_tasks_delete(IN p_id INT, IN p_user_id INT)
BEGIN
  DELETE FROM tasks WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

-- ---------------- PROJECTS ----------------
CREATE PROCEDURE sp_projects_list(IN p_user_id INT)
BEGIN
  SELECT p.*,
    (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS tasks_total,
    (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.completed = 1) AS tasks_completed
  FROM projects p
  WHERE p.user_id = p_user_id
  ORDER BY p.created_at DESC;
END //

CREATE PROCEDURE sp_projects_create(
  IN p_user_id INT, IN p_title VARCHAR(255), IN p_description TEXT,
  IN p_color VARCHAR(40), IN p_status VARCHAR(12), IN p_progress INT, IN p_due_date VARCHAR(50)
)
BEGIN
  INSERT INTO projects (user_id, title, description, color, status, progress, due_date)
  VALUES (p_user_id, p_title, p_description, p_color, p_status, p_progress, p_due_date);
  SELECT LAST_INSERT_ID() AS id;
END //

CREATE PROCEDURE sp_projects_update(
  IN p_id INT, IN p_user_id INT, IN p_title VARCHAR(255), IN p_description TEXT,
  IN p_color VARCHAR(40), IN p_status VARCHAR(12), IN p_progress INT, IN p_due_date VARCHAR(50)
)
BEGIN
  UPDATE projects
    SET title = p_title, description = p_description, color = p_color,
        status = p_status, progress = p_progress, due_date = p_due_date
  WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

CREATE PROCEDURE sp_projects_delete(IN p_id INT, IN p_user_id INT)
BEGIN
  DELETE FROM projects WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

-- ---------------- CALENDAR EVENTS ----------------
CREATE PROCEDURE sp_calendar_events_list(IN p_user_id INT)
BEGIN
  SELECT * FROM calendar_events WHERE user_id = p_user_id ORDER BY event_date, event_time;
END //

CREATE PROCEDURE sp_calendar_events_create(
  IN p_user_id INT, IN p_title VARCHAR(255), IN p_event_date DATE,
  IN p_event_time VARCHAR(20), IN p_type VARCHAR(20), IN p_priority VARCHAR(10), IN p_color VARCHAR(40)
)
BEGIN
  INSERT INTO calendar_events (user_id, title, event_date, event_time, type, priority, color)
  VALUES (p_user_id, p_title, p_event_date, p_event_time, p_type, p_priority, p_color);
  SELECT LAST_INSERT_ID() AS id;
END //

CREATE PROCEDURE sp_calendar_events_update(
  IN p_id INT, IN p_user_id INT, IN p_title VARCHAR(255), IN p_event_date DATE,
  IN p_event_time VARCHAR(20), IN p_type VARCHAR(20), IN p_priority VARCHAR(10), IN p_color VARCHAR(40)
)
BEGIN
  UPDATE calendar_events
    SET title = p_title, event_date = p_event_date, event_time = p_event_time,
        type = p_type, priority = p_priority, color = p_color
  WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

CREATE PROCEDURE sp_calendar_events_delete(IN p_id INT, IN p_user_id INT)
BEGIN
  DELETE FROM calendar_events WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

-- ---------------- RECURRING EVENTS ----------------
CREATE PROCEDURE sp_recurring_list(IN p_user_id INT)
BEGIN
  SELECT * FROM recurring_events WHERE user_id = p_user_id ORDER BY day_of_week;
END //

CREATE PROCEDURE sp_recurring_create(
  IN p_user_id INT, IN p_title VARCHAR(255), IN p_day_of_week TINYINT,
  IN p_time_slot VARCHAR(40), IN p_color VARCHAR(40), IN p_amount DECIMAL(12,2)
)
BEGIN
  INSERT INTO recurring_events (user_id, title, day_of_week, time_slot, color, amount)
  VALUES (p_user_id, p_title, p_day_of_week, p_time_slot, p_color, p_amount);
  SELECT LAST_INSERT_ID() AS id;
END //

CREATE PROCEDURE sp_recurring_delete(IN p_id INT, IN p_user_id INT)
BEGIN
  DELETE FROM recurring_events WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

-- ---------------- TRANSACTIONS ----------------
CREATE PROCEDURE sp_transactions_list(IN p_user_id INT)
BEGIN
  SELECT * FROM transactions WHERE user_id = p_user_id ORDER BY txn_date DESC;
END //

CREATE PROCEDURE sp_transactions_create(
  IN p_user_id INT, IN p_name VARCHAR(255), IN p_amount DECIMAL(12,2),
  IN p_type VARCHAR(10), IN p_category VARCHAR(80), IN p_payment_method VARCHAR(80), IN p_txn_date VARCHAR(50)
)
BEGIN
  INSERT INTO transactions (user_id, name, amount, type, category, payment_method, txn_date)
  VALUES (p_user_id, p_name, p_amount, p_type, p_category, p_payment_method, p_txn_date);
  SELECT LAST_INSERT_ID() AS id;
END //

CREATE PROCEDURE sp_transactions_delete(IN p_id INT, IN p_user_id INT)
BEGIN
  DELETE FROM transactions WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

-- ---------------- NOTES ----------------
CREATE PROCEDURE sp_notes_list(IN p_user_id INT)
BEGIN
  SELECT * FROM notes WHERE user_id = p_user_id ORDER BY pinned DESC, created_at DESC;
END //

CREATE PROCEDURE sp_notes_create(
  IN p_user_id INT, IN p_title VARCHAR(255), IN p_content TEXT,
  IN p_type VARCHAR(60), IN p_pinned TINYINT(1), IN p_favorite TINYINT(1), IN p_folder VARCHAR(80)
)
BEGIN
  INSERT INTO notes (user_id, title, content, type, pinned, favorite, folder)
  VALUES (p_user_id, p_title, p_content, p_type, p_pinned, p_favorite, p_folder);
  SELECT LAST_INSERT_ID() AS id;
END //

CREATE PROCEDURE sp_notes_update(
  IN p_id INT, IN p_user_id INT, IN p_title VARCHAR(255), IN p_content TEXT,
  IN p_type VARCHAR(60), IN p_pinned TINYINT(1), IN p_favorite TINYINT(1), IN p_folder VARCHAR(80)
)
BEGIN
  UPDATE notes
    SET title = p_title, content = p_content, type = p_type, pinned = p_pinned,
        favorite = p_favorite, folder = p_folder
  WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

CREATE PROCEDURE sp_notes_delete(IN p_id INT, IN p_user_id INT)
BEGIN
  DELETE FROM notes WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

-- ---------------- INBOX ----------------
CREATE PROCEDURE sp_inbox_list(IN p_user_id INT)
BEGIN
  SELECT * FROM inbox_items WHERE user_id = p_user_id ORDER BY created_at DESC;
END //

CREATE PROCEDURE sp_inbox_create(IN p_user_id INT, IN p_text VARCHAR(512))
BEGIN
  INSERT INTO inbox_items (user_id, text) VALUES (p_user_id, p_text);
  SELECT LAST_INSERT_ID() AS id;
END //

CREATE PROCEDURE sp_inbox_update(IN p_id INT, IN p_user_id INT, IN p_converted_to VARCHAR(40))
BEGIN
  UPDATE inbox_items SET converted_to = p_converted_to WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

CREATE PROCEDURE sp_inbox_delete(IN p_id INT, IN p_user_id INT)
BEGIN
  DELETE FROM inbox_items WHERE id = p_id AND user_id = p_user_id;
  SELECT ROW_COUNT() AS affected;
END //

-- ---------------- AI MESSAGES ----------------
CREATE PROCEDURE sp_ai_messages_list(IN p_user_id INT)
BEGIN
  SELECT * FROM ai_messages WHERE user_id = p_user_id ORDER BY created_at ASC;
END //

CREATE PROCEDURE sp_ai_messages_create(IN p_user_id INT, IN p_sender VARCHAR(8), IN p_text TEXT)
BEGIN
  INSERT INTO ai_messages (user_id, sender, text) VALUES (p_user_id, p_sender, p_text);
  SELECT LAST_INSERT_ID() AS id;
END //

DELIMITER ;
