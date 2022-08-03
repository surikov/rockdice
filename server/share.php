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
    //$drums = floor(100*intval($data->{'drumsSeed'})/29);
    //$bass = floor(100*intval($data->{'bassSeed'})/24);
    //$lead = floor(100*intval($data->{'leadSeed'})/39);
	//$pad = floor(100*intval($data->{'padSeed'})/25);
	$drums = $data->{'drumsSeed'};
    $bass = $data->{'bassSeed'};
    $lead = $data->{'leadSeed'};
    $pad = $data->{'padSeed'};
    //$chords = $data->{'chords'};
    //$line='';
    //for ($i = 0; $i <= count($chords); $i=$i+2) {
    //    $line=$line . ' '. $chords[$i];
    //}
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
    <meta property="og:url" content="https://zvoog.app/RockDice/main.php?seed=<?php echo $encoded; ?>" />
    <meta property="og:image" content="https://zvoog.app/RockDice/picture.php?drums=<?php echo $drums; ?>&prog=<?php echo urlencode($line); ?>&bass=<?php echo $bass; ?>&lead=<?php echo $lead; ?>&pad=<?php echo $pad; ?>" />
    <meta property="og:description" content="RockDice Chord Progression" />
    <meta property="og:site_name" content="RockDice" />
	<!--<script type="text/javascript" src="//platform-api.sharethis.com/js/sharethis.js#property=5b8e6991f365de0011fdf755&product=custom-share-buttons}"></script>-->
	<script type='text/javascript' src='https://platform-api.sharethis.com/js/sharethis.js#property=5b8e6991f365de0011fdf755&product=inline-share-buttons' async='async'></script>
	<link rel="stylesheet" href="share.css">
</head>
<body>
	<div>
        <!--
            <a href='javascript:void(0)' onclick="window.open('https://zvoog.app/RockDice/main.html?seed=<?php echo $encoded; ?>', '_system', 'location=yes');" >
        -->
        <a href='https://zvoog.app/RockDice/main.html?seed=<?php echo $encoded; ?>' >
            <div id='picDiv'>
                <img id='picImg' src='https://zvoog.app/RockDice/picture.php?drums=<?php echo $drums; ?>&prog=<?php echo urlencode($line); ?>&bass=<?php echo $bass; ?>&lead=<?php echo $lead; ?>&pad=<?php echo $pad; ?>'/>
            </div>
        </a>
		<br/>&nbsp;
	</div>
<div class='overDiv'>
	
	<!-- ShareThis BEGIN -->
	<div class="sharethis-inline-share-buttons"></div>
	<!-- ShareThis END -->
	
	<div>
		<p><a href='https://zvoog.app/RockDice/main.html?seed=<?php echo $encoded; ?>' >Play</a></p>
	</div>
	
</div>
	<!--
	<div class='sublink'>
		<br/>&nbsp;
        <a href='rockdice://zvoog.app/RockDice/main.html?seed=<?php echo $encoded; ?>' >
            Open in RockDice Application
        </a>
		
	</div>
	
	<div class='sublink'>
        <a href='https://play.google.com/store/apps/details?id=rockdice.chord.progression' >
            <img src='googleplay.png'/>
        </a>
		
	</div>
-->
</body>

</html>