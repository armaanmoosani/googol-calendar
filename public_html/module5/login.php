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
if (!$secret_key) {
    echo json_encode(["success" => false, "message" => "reCAPTCHA secret key is not set properly."]);
    exit;
}
//cite: https://developers.google.com/recaptcha/docs/v3
$recaptcha_response = $json_obj['recaptchaResponse'];
$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
$response = file_get_contents($verifyUrl . '?secret=' . $secret_key . '&response=' . $recaptcha_response);
$responseKeys = json_decode($response, true);
if ($responseKeys['success'] != true || $responseKeys['score'] < 0.5) {
    echo json_encode(["success" => false, "message" => "reCAPTCHA verification failed. Please try again."]);
    exit;
}

$username = htmlentities(trim($json_obj['username']));
$password = $json_obj['password'];

$stmt = $mysqli->prepare("SELECT COUNT(*), id, hashed_password FROM users WHERE username=?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt, $user_id, $pwd_hash);
$stmt->fetch();
$stmt->close();

if ($cnt == 1 && password_verify($password, $pwd_hash)) {
    $_SESSION['user_id'] = $user_id;
    echo json_encode(["success" => true, "redirect" => "login.html"]);
} else {
    echo json_encode(["success" => false, "message" => "Incorrect Username or Password"]);
}
exit;
?>