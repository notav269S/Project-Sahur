-- Create database
CREATE DATABASE IF NOT EXISTS focus_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE focus_app;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Remember tokens table for "Remember Me" functionality
CREATE TABLE remember_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Tasks table
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_completed (completed),
    INDEX idx_due_date (due_date),
    INDEX idx_created_at (created_at)
);

-- Notes table
CREATE TABLE notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_content (title, content)
);

-- Journal entries table
CREATE TABLE journal_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    mood ENUM('terrible', 'bad', 'okay', 'good', 'great') DEFAULT 'okay',
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date),
    INDEX idx_mood (mood)
);

-- Mood entries table
CREATE TABLE mood_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    mood_scale TINYINT NOT NULL CHECK (mood_scale >= 1 AND mood_scale <= 5),
    note TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_date (date),
    INDEX idx_mood_scale (mood_scale),
    INDEX idx_created_at (created_at)
);

-- Calendar events table
CREATE TABLE calendar_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    start_time TIME,
    end_date DATE,
    end_time TIME,
    event_type ENUM('meeting', 'task', 'personal', 'reminder') DEFAULT 'personal',
    all_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_start_date (start_date),
    INDEX idx_event_type (event_type)
);

-- User settings table
CREATE TABLE user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_setting (user_id, setting_key),
    INDEX idx_user_id (user_id)
);

-- Insert sample data for testing
INSERT INTO users (name, email, password) VALUES 
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password: password
('Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: password

-- Sample tasks
INSERT INTO tasks (user_id, title, priority, tags) VALUES 
(1, 'Complete project proposal', 'high', '["work", "urgent"]'),
(1, 'Buy groceries', 'medium', '["personal", "shopping"]'),
(1, 'Call dentist', 'low', '["health", "appointments"]');

-- Sample notes
INSERT INTO notes (user_id, title, content, tags) VALUES 
(1, 'Meeting Notes', 'Discussed project timeline and deliverables...', '["work", "meetings"]'),
(1, 'Recipe Ideas', 'Try the new pasta recipe with basil and tomatoes...', '["personal", "cooking"]');

-- Sample journal entries
INSERT INTO journal_entries (user_id, date, content, mood, tags) VALUES 
(1, CURDATE(), 'Had a productive day at work. Completed most of my tasks and felt accomplished.', 'good', '["work", "productivity"]'),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Feeling a bit overwhelmed with the workload but trying to stay positive.', 'okay', '["work", "stress"]');

-- Sample mood entries
INSERT INTO mood_entries (user_id, date, time, mood_scale, note, tags) VALUES 
(1, CURDATE(), '09:00:00', 4, 'Starting the day with good energy', '["morning", "energy"]'),
(1, CURDATE(), '15:00:00', 3, 'Afternoon slump, need coffee', '["afternoon", "tired"]');
