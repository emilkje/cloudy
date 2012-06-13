<?php

// $sections = $_SERVER['PATH_INFO'];
// $sections = explode("/", $sections);
// array_shift($sections);
// 
// list($province, $city, $place) = $sections;

extract($_GET);

if(isset($place)) {
	if(empty($place)) {
		$xml = "http://www.yr.no/sted/Norge/$province/$city/$city/varsel.xml";
	} else {
		$xml = "http://www.yr.no/sted/Norge/$province/$city/$place/varsel.xml";
	}
} else {
	$xml = "http://www.yr.no/sted/Norge/$province/$city/$city/varsel.xml";
}

header("Content-Type: application/json");
$dom = simplexml_load_string(file_get_contents($xml));
echo json_encode($dom);
