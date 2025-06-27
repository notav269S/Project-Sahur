<?php
require_once '../config.php';
requireAuth();

header('Content-Type: application/json');

$user = getCurrentUser();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            getTasks($user['id']);
            break;
        case 'POST':
            createTask($user['id']);
            break;
        case 'PUT':
            updateTask($user['id']);
            break;
        case 'DELETE':
            deleteTask($user['id']);
            break;
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function getTasks($userId) {
    global $pdo;
    
    $stmt = $pdo->prepare("
        SELECT id, title, description, completed, priority, due_date, tags, created_at, updated_at 
        FROM tasks 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ");
    $stmt->execute([$userId]);
    $tasks = $stmt->fetchAll();
    
    // Decode JSON tags
    foreach ($tasks as &$task) {
        $task['tags'] = json_decode($task['tags'] ?? '[]', true);
    }
    
    echo json_encode(['success' => true, 'data' => $tasks]);
}

function createTask($userId) {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['title'])) {
        throw new Exception('Title is required');
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO tasks (user_id, title, description, completed, priority, due_date, tags, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $result = $stmt->execute([
        $userId,
        $input['title'],
        $input['description'] ?? null,
        $input['completed'] ?? false,
        $input['priority'] ?? 'medium',
        $input['due_date'] ?? null,
        json_encode($input['tags'] ?? [])
    ]);
    
    if ($result) {
        $taskId = $pdo->lastInsertId();
        echo json_encode([
            'success' => true,
            'id' => $taskId,
            'createdAt' => date('Y-m-d H:i:s')
        ]);
    } else {
        throw new Exception('Failed to create task');
    }
}

function updateTask($userId) {
    global $pdo;
    
    $taskId = $_GET['id'] ?? null;
    if (!$taskId) {
        throw new Exception('Task ID is required');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Verify task belongs to user
    $stmt = $pdo->prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?");
    $stmt->execute([$taskId, $userId]);
    if (!$stmt->fetch()) {
        throw new Exception('Task not found');
    }
    
    $updates = [];
    $params = [];
    
    if (isset($input['title'])) {
        $updates[] = "title = ?";
        $params[] = $input['title'];
    }
    if (isset($input['description'])) {
        $updates[] = "description = ?";
        $params[] = $input['description'];
    }
    if (isset($input['completed'])) {
        $updates[] = "completed = ?";
        $params[] = $input['completed'];
    }
    if (isset($input['priority'])) {
        $updates[] = "priority = ?";
        $params[] = $input['priority'];
    }
    if (isset($input['due_date'])) {
        $updates[] = "due_date = ?";
        $params[] = $input['due_date'];
    }
    if (isset($input['tags'])) {
        $updates[] = "tags = ?";
        $params[] = json_encode($input['tags']);
    }
    
    if (empty($updates)) {
        throw new Exception('No fields to update');
    }
    
    $updates[] = "updated_at = NOW()";
    $params[] = $taskId;
    
    $sql = "UPDATE tasks SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute($params)) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Failed to update task');
    }
}

function deleteTask($userId) {
    global $pdo;
    
    $taskId = $_GET['id'] ?? null;
    if (!$taskId) {
        throw new Exception('Task ID is required');
    }
    
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
    
    if ($stmt->execute([$taskId, $userId])) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception('Task not found');
        }
    } else {
        throw new Exception('Failed to delete task');
    }
}
?>
