<?php

$query = $_GET['query'];

$json = file_get_contents("http://www.yr.no/_/websvc/jsonforslagsboks.aspx?s=" . $query . "&s1t=&s1i=&s2t=&s2i=");
$filter = json_decode($json);
$json = json_encode(array('result' => array_pop($filter)));

header("Content-Type: application/json");
echo $json;
