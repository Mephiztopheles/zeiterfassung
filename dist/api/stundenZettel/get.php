<?php
header('Content-Type: application/json');
$json = json_decode(file_get_contents("data.json"));
$id = $_GET["id"];
if ($id)
    foreach ($json as $key => $val) {
        if ($val->id == $id) {
            echo json_encode($json[$key]);
            exit;
        }
    }
