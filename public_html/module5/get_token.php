<?php
session_name("MY_SECURE_SESSION");
session_start();
ini_set("session.cookie_httponly", 1);
if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32)); 
}

echo json_encode(['token' => $_SESSION['token']]);
?>
