<?php
/*
function imagecopymerge_alpha($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $pct){
	// creating a cut resource
	$cut = imagecreatetruecolor($src_w, $src_h);
	// copying relevant section from background to the cut resource
	imagecopy($cut, $dst_im, 0, 0, $dst_x, $dst_y, $src_w, $src_h);
	// copying relevant section from watermark to the cut resource
	imagecopy($cut, $src_im, 0, 0, $src_x, $src_y, $src_w, $src_h);
	// insert cut resource to destination image
	imagecopymerge($dst_im, $cut, $dst_x, $dst_y, 0, 0, $src_w, $src_h, $pct);
}*/
/*
function partColor($part,$im){
	$r = floor(255 * $part);
	$g = floor(255 - 255 * $part);
	$b = floor(2 * abs(127 - 254 * $part));
	$color = imagecolorallocate($im, $r, $g, $b);
	return $color;
}*/
try {
	ob_end_clean();
	
	

	$gdimage = imagecreatetruecolor(800, 800);
	imagealphablending($gdimage, true);
	
	//$background_drum = imagecolorallocate($gdimage, 11, 22, 133);
	//$background_bass = imagecolorallocate($gdimage, 211, 22, 33);
	//$background_lead = imagecolorallocate($gdimage, 11, 122, 33);
	//$background_pad = imagecolorallocate($gdimage, 111, 22, 133);
	$text_color = imagecolorallocate($gdimage, 255, 255, 255);
	$text_shadow = imagecolorallocate($gdimage, 66,66, 66);
	$font = './Roboto-Light.ttf';
	$title_text='RockDice';
	//$pro_text=htmlspecialchars($_GET["prog"]);
	$pro_text='A# Bmaj7 Cb D Em Faug';
	
	$nDrums = round(intval($_GET["drums"])*28/100);
	$nBass = round(intval($_GET["bass"])*23/100);
	$nLead = round(intval($_GET["lead"])*38/100);
	$nPad = round(intval($_GET["pad"])*24/100);

	$pathDrums='./bg/empty.png';
	$pathBass='./bg/empty.png';
	$pathLead='./bg/empty.png';
	$pathPad='./bg/empty.png';

	if($nDrums==0)$pathDrums='./bg/drums909.png';
	else if($nDrums==1)$pathDrums='./bg/drumsMPC.png';
	else if($nDrums==2)$pathDrums='./bg/drums909.png';
	else if($nDrums==3)$pathDrums='./bg/drums909.png';
	else if($nDrums==4)$pathDrums='./bg/drumsElectro.png';
	else if($nDrums==5)$pathDrums='./bg/drums909.png';
	else if($nDrums==6)$pathDrums='./bg/drumsElectro.png';
	else if($nDrums==7)$pathDrums='./bg/drumsGreen.png';
	else if($nDrums==8)$pathDrums='./bg/drumsMPC.png';
	else if($nDrums==9)$pathDrums='./bg/drumsMPC.png';
	else if($nDrums==10)$pathDrums='./bg/drumsMPC.png';
	else if($nDrums==11)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==12)$pathDrums='./bg/drumsGreen.png';
	else if($nDrums==13)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==14)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==15)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==16)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==17)$pathDrums='./bg/drumsGreen.png';
	else if($nDrums==18)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==19)$pathDrums='./bg/drumsElectro.png';
	else if($nDrums==20)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==21)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==22)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==23)$pathDrums='./bg/drumsGreen.png';
	else if($nDrums==24)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==25)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==26)$pathDrums='./bg/drumsBig.png';
	else if($nDrums==27)$pathDrums='./bg/drumsGreen.png';
	else if($nDrums==28)$pathDrums='./bg/drumsGreen.png';

	if($nBass==0)$pathBass='./bg/bassLine3.png';
	else if($nBass==1)$pathBass='./bg/bassLine3.png';
	else if($nBass==2)$pathBass='./bg/bassLine3.png';
	else if($nBass==3)$pathBass='./bg/bass1.png';
	else if($nBass==4)$pathBass='./bg/bassVolca.png';
	else if($nBass==5)$pathBass='./bg/bass1.png';
	else if($nBass==6)$pathBass='./bg/bass303.png';
	else if($nBass==7)$pathBass='./bg/bassSlap.png';
	else if($nBass==8)$pathBass='./bg/bassSlap.png';
	else if($nBass==9)$pathBass='./bg/bass1.png';
	else if($nBass==10)$pathBass='./bg/bassSlap.png';
	else if($nBass==11)$pathBass='./bg/bass303.png';
	else if($nBass==12)$pathBass='./bg/bass3.png';
	else if($nBass==13)$pathBass='./bg/bass1.png';
	else if($nBass==14)$pathBass='./bg/bass1.png';
	else if($nBass==15)$pathBass='./bg/bassSlap.png';
	else if($nBass==16)$pathBass='./bg/bassSlap.png';
	else if($nBass==17)$pathBass='./bg/bassSlap.png';
	else if($nBass==18)$pathBass='./bg/bass1.png';
	else if($nBass==19)$pathBass='./bg/bassSlap.png';
	else if($nBass==20)$pathBass='./bg/bassLine3.png';
	else if($nBass==21)$pathBass='./bg/bass2.png';
	else if($nBass==22)$pathBass='./bg/bass2.png';
	else if($nBass==23)$pathBass='./bg/bass2.png';

	if($nLead==0)$pathLead='./bg/leadPiano1.png';
	else if($nLead==1)$pathLead='./bg/leadPiano1.png';
	else if($nLead==2)$pathLead='./bg/leadPiano1.png';
	else if($nLead==3)$pathLead='./bg/leadPiano1.png';
	else if($nLead==4)$pathLead='./bg/leadPiano1.png';
	else if($nLead==5)$pathLead='./bg/leadPiano1.png';
	else if($nLead==6)$pathLead='./bg/leadPiano1.png';
	else if($nLead==7)$pathLead='./bg/leadPiano1.png';
	else if($nLead==8)$pathLead='./bg/leadPiano1.png';
	else if($nLead==9)$pathLead='./bg/leadAccu1.png';
	else if($nLead==10)$pathLead='./bg/leadAccu1.png';
	else if($nLead==11)$pathLead='./bg/leadAccu1.png';
	else if($nLead==12)$pathLead='./bg/leadAccu1.png';
	else if($nLead==13)$pathLead='./bg/leadAccu1.png';
	else if($nLead==14)$pathLead='./bg/leadClean1.png';
	else if($nLead==15)$pathLead='./bg/leadClean1.png';
	else if($nLead==16)$pathLead='./bg/leadClean1.png';
	else if($nLead==17)$pathLead='./bg/leadClean1.png';
	else if($nLead==18)$pathLead='./bg/leadClean1.png';
	else if($nLead==19)$pathLead='./bg/leadClean1.png';
	else if($nLead==20)$pathLead='./bg/leadRust1.png';
	else if($nLead==21)$pathLead='./bg/leadRust1.png';
	else if($nLead==22)$pathLead='./bg/leadRust1.png';
	else if($nLead==23)$pathLead='./bg/leadXylo.png';
	else if($nLead==24)$pathLead='./bg/leadTrombone1.png';
	else if($nLead==25)$pathLead='./bg/leadMarimba.png';
	else if($nLead==26)$pathLead='./bg/leadClean1.png';
	else if($nLead==27)$pathLead='./bg/leadAccu1.png';
	else if($nLead==28)$pathLead='./bg/leadSynth1.png';
	else if($nLead==29)$pathLead='./bg/leadSynth1.png';
	else if($nLead==30)$pathLead='./bg/leadSynth1.png';
	else if($nLead==31)$pathLead='./bg/leadDrive1.png';
	else if($nLead==32)$pathLead='./bg/leadDrive1.png';
	else if($nLead==33)$pathLead='./bg/leadDrive1.png';
	else if($nLead==34)$pathLead='./bg/leadDrive1.png';
	else if($nLead==35)$pathLead='./bg/leadDrive1.png';
	else if($nLead==36)$pathLead='./bg/leadDrive1.png';
	else if($nLead==37)$pathLead='./bg/leadDrive1.png';
	else if($nLead==38)$pathLead='./bg/leadDrive1.png';

	if($nPad==0)$pathPad='./bg/padStrings.png';
	else if($nPad==1)$pathPad='./bg/padStrings.png';
	else if($nPad==2)$pathPad='./bg/padStrings.png';
	else if($nPad==3)$pathPad='./bg/padStrings.png';
	else if($nPad==4)$pathPad='./bg/padStrings.png';
	else if($nPad==5)$pathPad='./bg/padStrings.png';
	else if($nPad==6)$pathPad='./bg/padViolin.png';
	else if($nPad==7)$pathPad='./bg/padViolin.png';
	else if($nPad==8)$pathPad='./bg/padFlute.png';
	else if($nPad==9)$pathPad='./bg/padFlute.png';
	else if($nPad==10)$pathPad='./bg/padOrgan.png';
	else if($nPad==11)$pathPad='./bg/padOrgan.png';
	else if($nPad==12)$pathPad='./bg/padOrgan.png';
	else if($nPad==13)$pathPad='./bg/padOrgan.png';
	else if($nPad==14)$pathPad='./bg/padBells.png';
	else if($nPad==15)$pathPad='./bg/padBells.png';
	else if($nPad==16)$pathPad='./bg/padHarm.png';
	else if($nPad==17)$pathPad='./bg/padHarm.png';
	else if($nPad==18)$pathPad='./bg/padHarm.png';
	else if($nPad==19)$pathPad='./bg/padChoir1.png';
	else if($nPad==20)$pathPad='./bg/padChoir1.png';
	else if($nPad==21)$pathPad='./bg/padChoir1.png';
	else if($nPad==22)$pathPad='./bg/padChoir1.png';
	else if($nPad==23)$pathPad='./bg/padChoir1.png';
	else if($nPad==24)$pathPad='./bg/padChoir1.png';
	
	$imgDrums = imagecreatefrompng($pathDrums);
	$imgBass = imagecreatefrompng($pathBass);
	$imgLead = imagecreatefrompng($pathLead);
	$imgPad = imagecreatefrompng($pathPad);

	imagecopymerge($gdimage, $imgDrums, 0, 0, 0, 0, 200, 800, 100);
	imagecopymerge($gdimage, $imgBass, 200, 0, 0, 0, 200, 800, 100);
	imagecopymerge($gdimage, $imgLead, 400, 0, 0, 0, 200, 800, 100);
	imagecopymerge($gdimage, $imgPad, 600, 0, 0, 0, 200, 800, 100);
	
	//imagefilledrectangle($gdimage, 0, 0, 400, 400, partColor($partDrums,$gdimage));
	//imagefilledrectangle($gdimage, 400, 0, 800, 400, partColor($partBass,$gdimage));
	//imagefilledrectangle($gdimage, 0, 400, 400, 800, partColor($partLead,$gdimage));
	//imagefilledrectangle($gdimage, 400, 400, 800, 800, partColor($partPad,$gdimage));
	
	$texttop=280;
	//$title_text=$title_text.$nDrums.$pathDrums;
	
	$bbox = imagettfbbox(17, 0, $font, $title_text);
	$x = $bbox[0] + (imagesx($gdimage) / 2) - ($bbox[4] / 2) ;
	$h1=$bbox[1]-$bbox[7];
	
	imagettftext($gdimage, 17, 0, $x+2, $texttop+2, $text_shadow, $font, $title_text);
	imagettftext($gdimage, 17, 0, $x-1, $texttop-1, $text_shadow, $font, $title_text);
	imagettftext($gdimage, 17, 0, $x, $texttop, $text_color, $font, $title_text);

	$bbox = imagettfbbox(33, 0, $font, $pro_text);
	$x = $bbox[0] + (imagesx($gdimage) / 2) - ($bbox[4] / 2) ;
	$h2=$bbox[1]-$bbox[7];
	
	
	
	//$imgA = imagecreatefrompng('./testdrawing.png');
	//imagecopymerge_alpha($gdimage, $imgA, 0, 0, 0, 0, 400, 400, 100);
	
	//$imgB = imagecreatefrompng('./drawing2.png');
	//imagecopymerge_alpha($gdimage, $imgB, 400, 400, 0, 0, 400, 400, 100);
	
	imagettftext($gdimage, 33, 0, $x+2, $texttop+$h1+$h2+2, $text_shadow, $font, $pro_text);
	imagettftext($gdimage, 33, 0, $x-1, $texttop+$h1+$h2-1, $text_shadow, $font, $pro_text);
	imagettftext($gdimage, 33, 0, $x, $texttop+$h1+$h2, $text_color, $font, $pro_text);
	
	//imagettftext($gdimage, 17, 0, 33, 44, $text_color, $font, 'pro_text');

	header('Content-Type: image/png');
	imagepng($gdimage);
	imagedestroy($gdimage);
	imagedestroy($imgDrums);
	imagedestroy($partBass);
	imagedestroy($partLead);
	imagedestroy($partPad);
	
	/*
	$imagick = new Imagick();
	$fileContentString = file_get_contents('./testdrawing.svg');
	$imagick->readImageBlob($fileContentString);
	$imagick->setImageFormat("png32");
	
	$imagick2 = new Imagick();
	$fileContentString2 = file_get_contents('./drawing2.svg');
	$imagick2->readImageBlob($fileContentString2);
	$imagick2->setImageFormat("png32");
	
	$imagick->addImage($imagick2);
	
	header('Content-Type: image/png');
	echo $imagick->getImageBlob();
	$imagick->clear();
	$imagick->destroy();
	*/
}
catch (Throwable $e)
	{
		echo $e;
	}
?>