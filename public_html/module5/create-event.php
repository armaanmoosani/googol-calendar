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
//time conversion: https://www.php.net/manual/en/datetime.createfromformat.php
$eventTitle = htmlentities($json_obj["eventTitle"]);
$startTime = htmlspecialchars($json_obj["startTime"]);
$endTime = htmlspecialchars($json_obj["endTime"]);
$startTime24 = DateTime::createFromFormat('g:i A', $startTime)->format('H:i:00');
$endTime24 = DateTime::createFromFormat('g:i A', $endTime)->format('H:i:00');
$date = htmlspecialchars($json_obj["date"]);
$dateObj = new DateTime($date);
$formattedDate = $dateObj->format('Y-m-d');
$userId = $_SESSION['user_id'];
$tags = null;
$stmt = $mysqli->prepare("INSERT INTO events (user_id, title, event_date, start_time, end_time, tags) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false]);
    exit;
}
$stmt->bind_param('isssss', $userId, $eventTitle, $formattedDate, $startTime24, $endTime24, $tags);
$stmt->execute();
$stmt->close();
echo json_encode(["success" => true]);
exit;
?>