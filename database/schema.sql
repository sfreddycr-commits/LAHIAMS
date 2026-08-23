-- Esquema inicial para Capoy Tours
CREATE DATABASE IF NOT EXISTS capoy_db;
USE capoy_db;

-- Tabla de Tours
CREATE TABLE IF NOT EXISTS tours (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price_usd DECIMAL(10, 2),
    operator_type ENUM('direct', 'external'),
    operator_name VARCHAR(255),
    main_image VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Admins
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stored Procedure para Autenticación
DELIMITER //
CREATE PROCEDURE sp_authenticate_admin(IN p_email VARCHAR(255), IN p_password VARCHAR(255))
BEGIN
    SELECT id, name, email, role 
    FROM admins 
    WHERE email = p_email AND password = p_password;
END //
DELIMITER ;

-- Stored Procedure para Insertar/Actualizar Tour
DELIMITER //
CREATE PROCEDURE sp_save_tour(
    IN p_id VARCHAR(50), 
    IN p_title VARCHAR(255), 
    IN p_price DECIMAL(10,2),
    IN p_op_type VARCHAR(20),
    IN p_op_name VARCHAR(255)
)
BEGIN
    INSERT INTO tours (id, title, price_usd, operator_type, operator_name)
    VALUES (p_id, p_title, p_price, p_op_type, p_op_name)
    ON DUPLICATE KEY UPDATE
        title = p_title, price_usd = p_price, operator_type = p_op_type, operator_name = p_op_name;
END //
DELIMITER ;
