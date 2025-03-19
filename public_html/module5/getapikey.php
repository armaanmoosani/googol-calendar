<?php
header('Content-Type: application/json');
$apiKey = getenv('GOOGLEAPIKEY');  
echo json_encode(['key' => $apiKey]);
?>