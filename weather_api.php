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

// header("Content-Type: application/json");
$dom = simplexml_load_string(file_get_contents($xml));

$days = array(
	'Mon' => 'Mandag',
	'Tue' => 'Tirsdag',
	'Wed' => 'Onsdag',
	'Thu' => 'Torsdag',
	'Fri' => 'Fredag',
	'Sat' => 'Lørdag',
	'Sun' => 'Søndag'
);
$i = 0;
foreach($dom->forecast->tabular->time as $item) {
	$dom->forecast->tabular->time[$i]->day = $days[Date("D", strtotime($item->attributes()->from))];
	$dom->forecast->tabular->time[$i]->date = Date("d/m/y", strtotime($item->attributes()->from));
	$dom->forecast->tabular->time[$i]->time = Date("H:i", strtotime($item->attributes()->from));
	$i++;
}
echo str_replace("@attributes", "attr", json_encode($dom));
