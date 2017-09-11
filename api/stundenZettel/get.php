<?php
header("Access-Control-Allow-Origin:http://sz.mephiztopheles.wtf");
$id = $_GET["id"] ?: 0;
echo '{"id":' . $id . ',"name":"Test-' . $id . '"}';
