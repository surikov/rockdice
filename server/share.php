<html>
<?php
	function simplifiedChords($inchords){
		$chords=$inchords;
		for ($ll = count($chords) - 2; $ll > 0; $ll--) {
				for ($mm = 0; $mm < count($chords) - 1; $mm++) {
					if ($mm + $ll + $ll <= count($chords)) {
						$slice = array_slice($chords,$mm, $mm + $ll);
						$txtchords = ':'.join(':',$chords). ':';
						$to = ':' . join(':',$slice);
						$from = $to . $to . ':';
						$to = $to . ':';
						$txtchords = str_replace($from, $to,$txtchords);
						$rez = explode(':',$txtchords);
						$chords = [];
						for ($kk = 0; $kk < count($rez); $kk++) {
							if (strlen($rez[$kk])) {
								array_push($chords,$rez[$kk]);
							}
						}
					}
				}
			}
			return $chords;
	}
    $json = $_GET['seed'];
    $encoded=urlencode($json);
    $data=json_decode($json);
  	$drums = $data->{'drumsSeed'};
    $bass = $data->{'bassSeed'};
    $lead = $data->{'leadSeed'};
    $pad = $data->{'padSeed'};
	$chordnums=$data->{'chords'};
	$chords=[];
	for ($i = 0; $i < count($chordnums); $i=$i+2) {
       array_push($chords,$chordnums[$i]);
    }
	$chords=simplifiedChords($chords);
	$line='';
    for ($i = 0; $i < count($chords); $i++) {
        $line=$line . ' '. $chords[$i];
    }
?>
<head>
	<title>RockDice Share v1.0</title>
    <meta charset="utf-8">
    <meta name="twitter:card" content="summary" />
    <meta property="og:title" content="<?php echo $line; ?>" />
    <meta property="og:url" content="https://mzxbox.ru/RockDice/share.php?seed=<?php echo $encoded; ?>" />
    <meta property="og:image" content="https://mzxbox.ru/RockDice/picture.php?drums=<?php echo $drums; ?>&prog=<?php echo urlencode($line); ?>&bass=<?php echo $bass; ?>&lead=<?php echo $lead; ?>&pad=<?php echo $pad; ?>" />
    <meta property="og:description" content="RockDice Chord Progression" />
    <meta property="og:site_name" content="RockDice" />
	<script type='text/javascript' src='https://platform-api.sharethis.com/js/sharethis.js#property=5b8e6991f365de0011fdf755&product=inline-share-buttons' async='async'></script>
	<link rel="stylesheet" href="share.css">
</head>
<body>
	<div>
        <a href='https://surikov.github.io/rockdice/main.html?seed=<?php echo $encoded; ?>' >
            <div id='picDiv'>
                <img id='picImg' src='https://mzxbox.ru/RockDice/picture.php?drums=<?php echo $drums; ?>&prog=<?php echo urlencode($line); ?>&bass=<?php echo $bass; ?>&lead=<?php echo $lead; ?>&pad=<?php echo $pad; ?>'/>
            </div>
        </a>
		<br/>&nbsp;
	</div>
<div class='overDiv'>
	
	<!-- ShareThis BEGIN -->
	<div class="sharethis-inline-share-buttons"></div>
	<!-- ShareThis END -->
	
	<div>
		<p><a href='https://surikov.github.io/rockdice/main.html?seed=<?php echo $encoded; ?>' >Play</a></p>
	</div>
	
</div>

</body>

</html>