<?php
// https://twitter.com/molgavapp
echo 'postriff v1.10';
$api_key="GrUQs6V4V67UNMeag0K88q1Dtj";
$api_secret_key='jyjnaGkX4Uiyes8IORhZFqNaSsGYA72prYiPZGPL8l283lp1nOC';
$access_token ='3245967814-X89h5Y5W1wGgUKVKolN9KBzixGEYz67bcMxf19HR' ;
$access_token_secret='yW484b2XQH5gA5zJqwt3Nb1WiXiXFT448qswk5lHpn1PsM' ;
use DG\Twitter\Twitter;
require_once './twitter.class.php';
function createRandomSong(){
	$progressions=[
		"Fmaj7-A"
		,"Am-B-Gm"
		,"Am-Dm-E"
		,"C#m-E-B-A"
		,"Am-C-Dm-Em"
		,"Am-D7-E7-Am"
		,"Am-D9-Fm-C"
		,"Am-Dm-F-G"
		,"Am-Dm-Fm-C"
		,"Am-Em-G-Dm"
		,"Am-F-C-G"
		,"Am-F-Em-Am"
		,"Am-G-Dm7"
		,"Am-G-Em-F"
		,"Am-G-F-E7"
		,"Bm-A-G-F#m"
		,"C-Am-Dm-G"
		,"C-D7-Fm-C"
		,"C-D7-G7-C"
		,"C-E-Am7-F"
		,"Dm-Am-C-G"
		,"Dm-F-Am-G"
		,"Em-B-C-Am"
		,"Em-B-G-Em"
		,"Em-C-G-D"
		,"Em-D-C-D"
		,"Em-D-C-B"
		,"Em-G-C-Am"
		,"Em-G-Dsus4-A7sus4"
		,"Fm-Db-Ab-Eb"
		,"F-Em7-Am-G"
		,"G-B-C-Cm"
		,"G-C-D-Em"
		,"Dm-Gm-Dm-A-Dm"
		,"F-Em-Am-G-Am"
		,"Am-C-D-Am-C-Am"
		,"Am-Dsus4-Dm-F-G-Dm7"
		,"Am-F7-G-Em-F-G"
		,"Am-G-C-F-E-E7"
		,"Am-G-Dm-F-G-Am"
		,"Am-E-Em-D-Dm-Am-Adim-E"
		,"Am-E7-G-D-F-C-Dm-E7"
		,"Am-Em-G-D-Am-Cmaj7-G-D"
		,"Am-F-E7-Am-Dm7-Gsus4-F-E7"
		,"Gm-Cm-F-Bb-Eb-Adim-D-Gm"
		,"Dm-Bb-C-Gm-Bb-F-Gm-Dm"
		,"Am-G-D"
		,"C-Gm-Dm"
		,"Cmaj7-Cm7-F7"
		,"Dm7-G7-Cmaj7"
		,"Am7-Em7-Dsus4-Dm7"
		,"Am-F7-D7-E7"
		,"Am7-F7-G-Em7"
		,"C-Am-E-G"
		,"C-D7-F-C"
		,"C-F-G-G7"
		,"Cm7-Ab7-G7"
		,"Cmaj7-Gm7-C7-Fmaj7"
		,"D7-G7-C7-F7"
		,"Dm7-G7-Cmaj7-C6"
		,"F#m7-B7-E-A"
		,"Cmaj7-D7-Dm7-G7-Cmaj7"
		,"Em-G-D-C-A"
		,"Cmaj7-Am7-Dm7-G7-Em7-A7-Dm7-G7"
		,"Cmaj7-C7-Fmaj7-Fm7-Em7-A7-Dm7-G7-Cmaj7"
		,"A-D-E"
		,"Am-D-G"
		,"C-Am-F"
		,"C-F-G"
		,"D-C-G"
		,"F-Am-G"
		,"F-Bb-C"
		,"G-C-D"
		,"Am-G-D-F"
		,"C-Ab-Bb-C"
		,"C-Am-Em-F"
		,"C-Am-F-G"
		,"C-Dm-F-G"
		,"C-G-Am-F"
		,"C-F-G-Am"
		,"C-F-C-G"
		,"C-F-Dm-G"
		,"C-F-G-F"
		,"C-Fm-Bb7-C"
		,"Cm-Ab-Eb-Bb"
		,"D-A-C-G"
		,"D-C-G-D"
		,"D-C-Bb-F"
		,"D-G-Bm-A"
		,"E-B-C#m-A"
		,"E-G-A-G"
		,"F-Am-G-D"
		,"F-C-Dm-Bb"
		,"F-G-Am-Em"
		,"G-C-D-C"
		,"G-C-F-C"
		,"G-D-Em-C"
		,"G-Em-C-D"
		,"C-G-F-G-C"
		,"D-F-G-C-G"
		,"D-G-D-A-D"
		,"E-B-C#m-G#m-A"
		,"F-Am-F-G-C"
		,"A-E-F#m-D-A-E"
		,"C-Dm-Am7-F-G-C"
		,"C-G-Am-Em-F-C-F-G"
		,"D-A-Bm-F#m-G-D-G-A"
		,"E-C-D-Em-Em-G-Am-Bm"
		,"F-Bb-Edim-Am-Dm-Gm-C-F"
		,"G-D-Em-Bm-C-G-C-D"
	];
	$drumsCount=29;
	$bassCount=24;
	$leadCount=39;
	$padCount=25;
	$progNum = ''.rand(0,count($progressions)-1);
	$progString=$progressions[$progNum];
	$pieces = explode("-", $progString);
	$chords=["D7","2/8","G7","6/8","C7","2/8","F7","6/8","D7","2/8","G7","6/8","C7","2/8","F7","6/8"];
	switch(count($pieces)){
		case 2: $chords=[$pieces[0],'4/4',$pieces[1],'4/4']; break;
		case 3: $chords=[$pieces[0],'4/4',$pieces[1],'4/4',$pieces[2],'8/4']; break;
		case 4: $chords=[$pieces[0],'4/4',$pieces[1],'4/4',$pieces[2],'4/4',$pieces[3],'4/4']; break;
		case 5: $chords=[$pieces[0],'4/4',$pieces[1],'4/4',$pieces[2],'4/4',$pieces[3],'2/4',$pieces[4],'2/4']; break;
		case 6: $chords=[$pieces[0],'4/4',$pieces[1],'2/4',$pieces[2],'2/4',$pieces[3],'4/4',$pieces[4],'2/4',$pieces[5],'2/4']; break;
		case 7: $chords=[$pieces[0],'4/4',$pieces[1],'4/4',$pieces[2],'4/4',$pieces[3],'4/4',$pieces[4],'4/4',$pieces[5],'4/4',$pieces[6],'8/4']; break;
		case 8: $chords=[$pieces[0],'4/4',$pieces[1],'4/4',$pieces[2],'4/4',$pieces[3],'4/4',$pieces[4],'4/4',$pieces[5],'4/4',$pieces[6],'4/4',$pieces[7],'4/4']; break;
		case 9: $chords=[$pieces[0],'4/4',$pieces[1],'4/4',$pieces[2],'4/4',$pieces[3],'4/4',$pieces[4],'4/4',$pieces[5],'4/4',$pieces[6],'4/4',$pieces[7],'2/4',$pieces[8],'2/4']; break;
	}
	$sng=new StdClass();
	$sng->drumsSeed = ''.rand(0,$drumsCount-1);
	$sng->bassSeed = ''.rand(0,$bassCount-1);
	$sng->leadSeed = ''.rand(0,$leadCount-1);
	$sng->padSeed = ''.rand(0,$padCount-1);
	$sng->drumsVolume = '111';
	$sng->bassVolume = '99';
	$sng->leadVolume = '66';
	$sng->padVolume = '77';
	$sng->chords = $chords;
	$sng->tempo = '130';
	$sng->mode = 'Ionian';
	$sng->tone = 'C';
	$sng->version = 'v0.0';
	$sng->comment = '';
	$sng->uiMode = 'web';
	return json_encode($sng);
}
try {
	$twitter = new Twitter($api_key, $api_secret_key, $access_token, $access_token_secret);
	$songSeed=str_replace("\/","/",createRandomSong());
	$text='#WebAudio #MusicTech #MusicApp #GenerativeMusic #ProceduralArt #generativeart #proceduralmusic #chords RockDice Chord Progression https://mzxbox.ru/RockDice/share.php?seed='.urlencode($songSeed);
	echo"\ntext: ";
	echo $text;
	$tweet = $twitter->send($text); // you can add $imagePath or array of image paths as second argument
} catch (DG\Twitter\TwitterException $e) {
	echo 'Error: ' . $e->getMessage();
}
echo"\ndone postriff";
?>
