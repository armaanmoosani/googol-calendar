<?php
session_name("MY_SECURE_SESSION");
session_start();
ini_set("session.cookie_httponly", 1);
$response = array();
if (isset($_SESSION['user_id'])) {
    $response['loggedIn'] = true;
} else {
    $response['loggedIn'] = false;
}
echo json_encode($response);
?>
