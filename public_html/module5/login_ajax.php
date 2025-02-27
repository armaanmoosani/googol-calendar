<?php
require 'database.php';
session_start();
header("Content-Type: application/json");


$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

if (!$json_obj) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$username = htmlentities(trim($json_obj['username']));
$password = $json_obj['password'];
$token = $json_obj['token'];
$recaptcha_response = $json_obj['recaptchaResponse'];

if (!hash_equals($_SESSION['token'], $token)) {
    echo json_encode(["success" => false, "message" => "Request forgery detected"]);
    exit;
}

$secret_key = "6LfB-coqAAAAAFGyUcNUV7MhprF6qJ33mWwtUdne";
$url = "https://www.google.com/recaptcha/api/siteverify?secret=$secret_key&response=$recaptcha_response";
$response = json_decode(file_get_contents($url));

if (!$response->success) {
    echo json_encode(["success" => false, "message" => "reCAPTCHA verification failed. Please try again."]);
    exit;
}

$stmt = $mysqli->prepare("SELECT COUNT(*), id, hashed_password FROM users WHERE username=?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt, $user_id, $pwd_hash);
$stmt->fetch();
$stmt->close();

if ($cnt == 1 && password_verify($password, $pwd_hash)) {
    $_SESSION['user_id'] = $user_id;
    $_SESSION['token'] = bin2hex(random_bytes(32));

    $redirect = isset($_SESSION['redirect']) ? $_SESSION['redirect'] : "newssite.php";
    unset($_SESSION['redirect']); // Clear redirect session variable

    echo json_encode(["success" => true, "redirect" => $redirect]);
} else {
    echo json_encode(["success" => false, "message" => "Incorrect Username or Password"]);
}
exit;
?>