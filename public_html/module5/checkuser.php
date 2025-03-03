<?php
include 'db_connection.php'; 
ini_set("session.cookie_httponly", 1);
$data = json_decode(file_get_contents("php://input"));
$newuser = $data['username'];
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
$stmt->bind_param('s', $newuser);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();
header('Content-Type: application/json');
echo json_encode(['exists' => $cnt > 0]);
?>