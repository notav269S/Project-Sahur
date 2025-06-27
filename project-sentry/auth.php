<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$action = $input['action'];

try {
    switch ($action) {
        case 'signup':
            handleSignup($input);
            break;
        case 'login':
            handleLogin($input);
            break;
        case 'logout':
            handleLogout();
            break;
        case 'check':
            checkAuth();
            break;
        default:
            throw new Exception('Invalid action');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function handleSignup($input) {
    global $pdo;
    
    // Validate input
    if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
        throw new Exception('All fields are required');
    }
    
    $name = trim($input['name']);
    $email = trim(strtolower($input['email']));
    $password = $input['password'];
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }
    
    // Validate password
    if (strlen($password) < 6) {
        throw new Exception('Password must be at least 6 characters long');
    }
    
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        throw new Exception('An account with this email already exists');
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Create user
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password, created_at) 
        VALUES (?, ?, ?, NOW())
    ");
    
    if ($stmt->execute([$name, $email, $hashedPassword])) {
        $userId = $pdo->lastInsertId();
        
        // Create session
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;
        
        echo json_encode([
            'success' => true,
            'message' => 'Account created successfully',
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email
            ]
        ]);
    } else {
        throw new Exception('Failed to create account');
    }
}

function handleLogin($input) {
    global $pdo;
    
    // Validate input
    if (empty($input['email']) || empty($input['password'])) {
        throw new Exception('Email and password are required');
    }
    
    $email = trim(strtolower($input['email']));
    $password = $input['password'];
    $remember = isset($input['remember']) && $input['remember'];
    
    // Find user
    $stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password'])) {
        throw new Exception('Invalid email or password');
    }
    
    // Create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    
    // Handle remember me
    if ($remember) {
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        // Store remember token
        $stmt = $pdo->prepare("
            INSERT INTO remember_tokens (user_id, token, expires_at) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE token = ?, expires_at = ?
        ");
        $stmt->execute([$user['id'], $token, $expires, $token, $expires]);
        
        // Set cookie
        setcookie('remember_token', $token, strtotime('+30 days'), '/', '', false, true);
    }
    
    // Update last login
    $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);
}

function handleLogout() {
    // Clear remember token if exists
    if (isset($_COOKIE['remember_token'])) {
        global $pdo;
        $stmt = $pdo->prepare("DELETE FROM remember_tokens WHERE token = ?");
        $stmt->execute([$_COOKIE['remember_token']]);
        setcookie('remember_token', '', time() - 3600, '/');
    }
    
    // Destroy session
    session_destroy();
    
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
}

function checkAuth() {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'success' => true,
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'email' => $_SESSION['user_email']
            ]
        ]);
    } else {
        echo json_encode(['success' => true, 'authenticated' => false]);
    }
}
?>
