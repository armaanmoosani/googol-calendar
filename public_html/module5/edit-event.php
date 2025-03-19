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

$eventId = $json_obj["event_id"];
$eventTitle = htmlentities($json_obj["title"]);
$startTime = htmlspecialchars($json_obj["start_time"]);
$endTime = htmlspecialchars($json_obj["end_time"]);
$date = htmlspecialchars($json_obj["date"]);
$userId = $_SESSION['user_id'];
$tag = htmlspecialchars($json_obj['tag']);
$dateObj = new DateTime($date);
$formattedDate = $dateObj->format('Y-m-d');
$location = htmlspecialchars($json_obj['location']);
$stmt = $mysqli->prepare("UPDATE events SET title=?, event_date=?, start_time=?, end_time=?, tags=?, location_title=? WHERE id=? AND user_id=?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit;
}
$stmt->bind_param('ssssssii', $eventTitle, $formattedDate, $startTime, $endTime, $tag, $location, $eventId, $userId);
$stmt->execute();
$stmt->close();
echo json_encode(["success" => true, "message" => "Event updated successfully"]);
exit;
?>