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
$event_id = $json_obj['event_id'];
$user_id = $_SESSION['user_id'];
$stmt = $mysqli->prepare("DELETE FROM events WHERE id = ? AND user_id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Failed to prepare statement"]);
    exit;
}

$stmt->bind_param("ii", $event_id, $user_id);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to delete event"]);
    exit;
}
echo json_encode(["success" => true, "message" => "Event deleted successfully"]);
$stmt->close();
?>