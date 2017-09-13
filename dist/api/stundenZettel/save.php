<?php
header('Content-Type: application/json');

$json = json_decode(file_get_contents("data.json"));
$data = json_decode(file_get_contents('php://input'));
if ($data->id)
    foreach ($json as $key => $val) {
        if ($val->id == $data->id) {
            $val->titel = $data->titel;
            $val->beschreibung = $data->beschreibung;
            $val->start = $data->start;
            $val->ende = $data->ende;
            $val->projekt = $data->projekt;
            $response = json_encode($json);
            file_put_contents("data.json", $response);
            echo json_encode($val);
            exit;
        }
    }

$ai = (int)file_get_contents("ai.txt");
$data->id = ++$ai;
array_push($json, $data);
file_put_contents("data.json", json_encode($json));
file_put_contents("ai.txt", $ai);
echo json_encode($data);