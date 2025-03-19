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
$eventId = (int)$json_obj["event_id"];
$userId = (int)$json_obj["user_id"];
$stmt = $mysqli->prepare("SELECT title, event_date, start_time, end_time, tags, location_title FROM events WHERE id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit;
}

$stmt->bind_param('i', $eventId);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($eventTitle, $eventDate, $startTime, $endTime, $tags, $location);
$stmt->fetch();
$stmt->close();

$stmt = $mysqli->prepare("INSERT INTO events (user_id, title, event_date, start_time, end_time, tags, location_title) VALUES (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit;
}

$stmt->bind_param('issssss', $userId, $eventTitle, $eventDate, $startTime, $endTime, $tags, $location);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to share event"]);
    exit;
}
echo json_encode(["success" => true, "message" => "Event shared successfully"]);
$stmt->close();