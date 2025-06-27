<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'focus_app');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Helper function to check if user is authenticated
function requireAuth() {
    session_start();
    
    // Check session
    if (isset($_SESSION['user_id'])) {
        return true;
    }
    
    // Check remember token
    if (isset($_COOKIE['remember_token'])) {
        global $pdo;
        $stmt = $pdo->prepare("
            SELECT u.id, u.name, u.email 
            FROM users u 
            JOIN remember_tokens rt ON u.id = rt.user_id 
            WHERE rt.token = ? AND rt.expires_at > NOW()
        ");
        $stmt->execute([$_COOKIE['remember_token']]);
        $user = $stmt->fetch();
        
        if ($user) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            return true;
        }
    }
    
    // Redirect to login
    header('Location: login.html');
    exit;
}

// Helper function to get current user
function getCurrentUser() {
    session_start();
    if (isset($_SESSION['user_id'])) {
        return [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email']
        ];
    }
    return null;
}
?>
