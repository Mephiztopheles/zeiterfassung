<?php
header("Access-Control-Allow-Origin:http://sz.mephiztopheles.wtf");
header("Access-Control-Allow-Headers:Origin, X-Requested-With, Content-Type, Accept");

$json = json_decode(file_get_contents("data.json"));
$data = json_decode(file_get_contents('php://input'));
if ($data->id)
    foreach ($json as $key => $val) {
        if ($val->id == $data->id) {
            $val->titel = $data->titel;
            $val->beschreibung = $data->beschreibung;
            $val->start = $data->start;
            $val->ende = $data->ende;
            $response = json_encode($json);
            file_put_contents("data.json", $response);
            echo $val;
            exit;
        }
    }

$ai = (int)file_get_contents("ai.txt");
$data->id = ++$ai;
array_push($json, $data);
file_put_contents("data.json", json_encode($json));
file_put_contents("ai.txt", $ai);
echo json_encode($data);