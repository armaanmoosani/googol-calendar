<?php
ini_set("session.cookie_httponly", 1);
session_name("MY_SECURE_SESSION");
session_start();
require 'db.php';
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

if (!$json_obj) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}
if ($_SESSION['token'] !== $json_obj['csrf']) {
    echo json_encode(["success" => false, "message" => "CSRF token validation failed"]);
    exit;
}
$userId = $_SESSION['user_id'];
$stmt = $mysqli->prepare("SELECT id, username FROM users WHERE id != ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit;
}
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($id, $username);
$users = [];
while ($stmt->fetch()) {
    $users[] = ['id' => $id, 'username' => $username];
}
$stmt->close();
echo json_encode(["success" => true, "users" => $users]);
exit;
?>