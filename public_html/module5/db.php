<?php
    $mysqli = new mysqli('localhost', 'phpuser', 'a8ushd742%o43(2jx@*ujsui', 'calendar');
    if($mysqli->connect_errno) {
        printf("Connection Failed: %s\n", $mysqli->connect_error);
        exit;
    }
?>