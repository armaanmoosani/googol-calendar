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
$year = htmlspecialchars($json_obj['year']);
$month = htmlspecialchars($json_obj['month']);
$stmt = $mysqli->prepare("SELECT id, title, event_date, start_time, end_time, tags, location_title FROM events WHERE YEAR(event_date) = ? AND MONTH(event_date) = ? AND user_id = ? ORDER BY event_date, start_time");
if (!$stmt) {
    echo json_encode(["events" => []]);
    exit;
}
$stmt->bind_param("ssi", $year, $month, $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = [
        "id" => $row['id'],
        "title" => $row['title'],
        "event_date" => date("Y-m-d", strtotime($row['event_date'])),
        "start_time" => $row['start_time'],
        "end_time" => $row['end_time'],
        "tags" => $row['tags'],
        "location" => $row['location_title'] 
    ];
}

$stmt->close();
echo json_encode(["events" => $events]);
exit;