<?php
ini_set("session.cookie_httponly", 1);
session_name("MY_SECURE_SESSION");
session_start();
unset($_SESSION['user_id']);
$_SESSION['token'] = bin2hex(random_bytes(32));
echo json_encode([
    "success" => true,
    "token" => $_SESSION['token']
]);
?>