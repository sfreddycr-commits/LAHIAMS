-- Seed mínimo real: solo el usuario dueño de los datos. Cero contenido mock.
INSERT INTO users (id, name, avatar, plan, email) VALUES
  (1, 'Freddy Mercer', '', 'Premium', 'freddy@lahiams.app')
ON DUPLICATE KEY UPDATE name = VALUES(name);
