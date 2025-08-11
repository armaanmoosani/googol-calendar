<?php
    $mysqli = new mysqli('localhost', 'phpuser', 'PASSWORD_KEY', 'calendar');
    if($mysqli->connect_errno) {
        printf("Connection Failed: %s\n", $mysqli->connect_error);
        exit;
    }
?>
