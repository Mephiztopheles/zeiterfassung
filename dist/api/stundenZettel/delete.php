<?php
$json = json_decode(file_get_contents("data.json"));
$id = $_GET["id"];
if ($id)
    foreach ($json as $key => $val) {
        if ($val->id == $id) {
            unset($json[$key]);
            $response = json_encode($json);
            file_put_contents("data.json", $response);
            header("HTTP/1.1 200 OK");
            exit;
        }
    }