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

if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}

if (!hash_equals($_SESSION['token'], $json_obj['token'])) {
    echo json_encode(["success" => false, "message" => "Request forgery detected"]);
    exit;
}
$secret_key = getenv("RECAPTCHA_V3_SECRET_KEY");
$recaptcha_response = $json_obj['recaptchaResponse'];
$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
$response = file_get_contents($verifyUrl . '?secret=' . $secret_key . '&response=' . $recaptcha_response);
$responseKeys = json_decode($response, true);
if ($responseKeys['success'] != true || $responseKeys['score'] < 0.5) {
    echo json_encode(["success" => false, "message" => "reCAPTCHA verification failed. Please try again."]);
    exit;
}

$newuser = htmlentities($json_obj['newuser']);
$newpassword = $json_obj['newpassword'];

$stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
$stmt->bind_param('s', $newuser);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

if ($cnt > 0) {
    echo json_encode(["success" => false, "message" => "User already exists"]);
    exit;
}

$hashed_password = password_hash($newpassword, PASSWORD_DEFAULT);
$stmt = $mysqli->prepare("INSERT INTO users (username, hashed_password) VALUES (?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit;
}
$stmt->bind_param('ss', $newuser, $hashed_password);
$stmt->execute();
$stmt->close();
echo json_encode(["success" => true, "redirect" => "login.html"]);
exit;
?>