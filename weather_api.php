<?php

extract($_GET);

$xml = "http://www.yr.no{$url}varsel.xml";

header("Content-Type: application/json");
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
	$dom->forecast->tabular->time[$i]->time .= " - " . Date("H:i", strtotime($item->attributes()->to));
	$i++;
}
echo str_replace("@attributes", "attr", json_encode($dom));
