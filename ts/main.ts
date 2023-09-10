let onAir: boolean = false;
let zapp: ZvoogApp;
let uiMode: 'web' | 'android' | 'pro' | 'free' = 'free';
let lastSongPosition: number = 0;
let lastGridPosition: number = 0;
let extendedSchedulePath: { ready: boolean, title: string, path: string }[] = [{ ready: false, title: '', path: '' }];
declare var jsAndroidActivityLink: any;

function onDeviceReady() {
	document.addEventListener("pause", onPauseCrdv, false);
	document.addEventListener("resume", onResumeCrdv, false);
}

function onPauseCrdv() {
	zapp.cancelPlay();
	saveState();
}
function onResumeCrdv() {
	//
}

function nameyyyymmddhhmmss() {
	var tt = new Date();
	var yyyy = tt.getFullYear();
	var mm = tt.getMonth() < 9 ? "0" + (tt.getMonth() + 1) : (tt.getMonth() + 1); // getMonth() is zero-based
	var dd = tt.getDate() < 10 ? "0" + tt.getDate() : tt.getDate();
	var hh = tt.getHours() < 10 ? "0" + tt.getHours() : tt.getHours();
	var min = tt.getMinutes() < 10 ? "0" + tt.getMinutes() : tt.getMinutes();
	var ss = tt.getSeconds() < 10 ? "0" + tt.getSeconds() : tt.getSeconds();
	return 'RockDice_' + yyyy + '_' + mm + '_' + dd + '_' + hh + '_' + min + '_' + ss + '.mid';
};
function promptExportFile(data64: string, fileName: string, mime: string) {
	//console.log('promptExportFile', fileName, mime);
	//console.log('jsAndroidActivityLink', jsAndroidActivityLink);
	//var b64 = Buffer.from(uInt8Array).toString('base64');
	//var data64=bytesToBase64(uInt8Array);
	//console.log(data64);
	jsAndroidActivityLink.propmtExportFileActivity(data64, fileName, mime);
}
function exportFile(uInt8Array: Int8Array) {
	let windowObj = window as any;
	let LocalFileSystemObj = window['LocalFileSystem'] as any;
	let cordovaObj = window['cordova'] as any;
	windowObj.requestFileSystem(LocalFileSystemObj.PERSISTENT, 0, function (fs) {
		console.log('fileSystem', JSON.stringify(fs));
		var fileDir = cordovaObj.file.externalDataDirectory.replace(cordovaObj.file.externalRootDirectory, '');
		var fileName = nameyyyymmddhhmmss();
		var filePath = fileDir + fileName;
		console.log('filePath', filePath);
		fs.root.getFile(filePath, {
			create: true,
			exclusive: false
		}, function (fileEntry) {
			console.log("fileEntry is file?" + fileEntry.isFile.toString());
			fileEntry.createWriter(function (fileWriter) {
				fileWriter.onwriteend = function () {
					console.log("Successful file write...");
				};
				fileWriter.onerror = function (e) {
					console.log("Failed file write: " + e.toString());
				};
				var dataObj = new Blob([uInt8Array.buffer], {
					type: 'application/octet-stream'
				});
				fileWriter.write(dataObj);
				//document.getElementById("infoLine").innerHTML = '' + filePath;
				console.log('filePath', filePath);
				let aa: HTMLElement | null = document.getElementById('exportLabel') as any;
				if (aa) {
					const regex = /\//g;
					aa.textContent = filePath.replace(regex, ' / ');
				}
				setDivStyleDisplay('midiExportDiv', 'flex');
			});
		}, function (err) {
			console.log('getFile error', JSON.stringify(err));
		});
	}, function (err) {
		console.log('requestFileSystem error', JSON.stringify(err));
	});
}
function handleOpenURL(url_string: string) {
	console.log("received url: " + url_string);
	//let queryString = window.location.search;
	var url = new URL(url_string);
	var seed = url.searchParams.get('seed');
	//let urlParams = new URLSearchParams(url);//queryString);
	//let seed = urlParams.get('seed');
	console.log('seed', seed);
	if (seed) {
		try {
			let param = JSON.parse(seed);
			let o = zapp.readObjectFromlocalStorage(zapp.stateName);
			if (o) {
				let old: StateSeed = o as StateSeed;
				old.comment = '' + new Date();
				zapp.pushUndoState(old, zapp.undoList);
			}
			param.comment = '' + new Date();
			zapp.saveText2localStorage(zapp.stateName, JSON.stringify(param));
			if (zapp.harmonizer) { zapp.loadSongState(param); }
		} catch (xx) {
			console.log(xx);
		}
	}
}
function rockDiceInitUI() {
	console.log('rockDiceInitUI v3.04');
	
	zapp = new ZvoogApp();
	rockDiceUI.connectRoundButtons(zapp);

	/*let test:HTMLElement|null=document.getElementById('drumColor');
	if(test){
		test.style.stroke='#f00';
	}*/

	document.addEventListener("deviceready", onDeviceReady, false);
	/*
		document.addEventListener("doneAd", function (e) {
			console.log('doneAd');
			//control.adCounterSet(control.adMobMaxCounter);
			zapp.rewardAdsShow();
		}, false);
		document.addEventListener("skipAd", function (e) {
			console.log('skipAd');
			//control.adCounterSet(control.adMobMaxCounter);
		}, false);
	*/
	
	dumpRandomProg();
}

function rockDicePlayRandom() {
	if (zapp.storeChangedStateNoStartAd())
		zapp.chooseRandomSong();

	//let test = 'https://zvoog.app/RockDice/main.html?seed=%7B%22drumsSeed%22%3A17%2C%22bassSeed%22%3A16%2C%22leadSeed%22%3A7%2C%22padSeed%22%3A23%2C%22drumsVolume%22%3A111%2C%22bassVolume%22%3A99%2C%22leadVolume%22%3A66%2C%22padVolume%22%3A77%2C%22chords%22%3A%5B%22F%23m7%22%2C%224%2F8%22%2C%22B7%22%2C%224%2F8%22%2C%22F%23m7%22%2C%224%2F8%22%2C%22B7%22%2C%224%2F8%22%2C%22E%22%2C%228%2F8%22%2C%22A%22%2C%228%2F8%22%5D%2C%22tempo%22%3A130%2C%22mode%22%3A%22Ionian%22%2C%22tone%22%3A%22E%22%2C%22version%22%3A%22v2.07%22%2C%22comment%22%3A%22%22%2C%22ui%22%3A%22pro%22%7D';
	//handleOpenURL(test);
}
var recordIntervalID = 0;
var recordTimeCounter = 0;
var recordTimeDelta = 0;
function showRecordAlert(time: number) {
	hideRecordAlert();
	let e: HTMLElement | null = document.getElementById('alertDiv');
	if (e) {
		e.style.display = 'block';
	}
	setDivStyleDisplay('recordFog', 'flex');
	recordTimeCounter = 0;
	recordTimeDelta = 100 / time;
	recordIntervalID = setInterval(function () {
		recordTimeCounter = recordTimeCounter + recordTimeDelta;
		let e: HTMLElement | null = document.getElementById('alertTime');
		if (e) {
			e.style.width = '' + Math.floor(recordTimeCounter) + '%';
		}
	}, 999);
}
function hideRecordAlert() {
	clearInterval(recordIntervalID);
	let e: HTMLElement | null = document.getElementById('alertDiv');
	if (e) {
		e.style.display = 'none';
	}
	setDivStyleDisplay('recordFog', 'none');
}
function floatTo16BitPCM(output: DataView, skip: number, input: Float32Array) {
	var offset = skip;
	//try {
	for (let i = 0; i < input.length; i++) {
		let s = Math.max(-1, Math.min(1, input[i]));
		var nn = s * 0x7FFF;
		if (s < 0) {
			nn = s * 0x8000;
		}
		//output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
		output.setInt16(offset, nn, true);
		offset = offset + 2;
	}
	//} catch (exx) {
	//	console.log('offset', offset);
	//	console.log(exx);
	//}
}

function writeString(view: DataView, offset: number, string: string) {
	for (let i = 0; i < string.length; i++) {
		view.setUint8(offset + i, string.charCodeAt(i));
	}
}

function encodeWAV(samples: Float32Array, sampleRate: number): DataView {
	console.log('length', (44 + samples.length * 2));
	let buffer: ArrayBuffer = new ArrayBuffer(44 + samples.length * 2);
	let view: DataView = new DataView(buffer);
	var numChannels = 1;
	console.log('buffer', buffer);

	/* RIFF identifier */
	writeString(view, 0, 'RIFF');
	/* RIFF chunk length */
	view.setUint32(4, 36 + samples.length * 2, true);
	/* RIFF type */
	writeString(view, 8, 'WAVE');
	/* format chunk identifier */
	writeString(view, 12, 'fmt ');
	/* format chunk length */
	view.setUint32(16, 16, true);
	/* sample format (raw) */
	view.setUint16(20, 1, true);
	/* channel count */
	view.setUint16(22, numChannels, true);
	/* sample rate */
	view.setUint32(24, sampleRate, true);
	/* byte rate (sample rate * block align) */
	view.setUint32(28, sampleRate * 4, true);
	/* block align (channel count * bytes per sample) */
	view.setUint16(32, numChannels * 2, true);
	/* bits per sample */
	view.setUint16(34, 16, true);
	/* data chunk identifier */
	writeString(view, 36, 'data');
	/* data chunk length */
	view.setUint32(40, samples.length * 2, true);

	floatTo16BitPCM(view, 44, samples);

	return view;
}
function rockDiceClickStartRecord() {
	console.log('rockDiceClickStartRecord');
	var scriptProcessorNode: ScriptProcessorNode = zapp.audioContext.createScriptProcessor(4096, 1, 1);
	//var allAudioBuffers: AudioBuffer[] = [];
	var buffers: number[][] = [];
	var sampleRate: number = 0;
	//var kk=0;
	scriptProcessorNode.onaudioprocess = function (audioProcessingEvent: AudioProcessingEvent) {
		var arr: Float32Array = audioProcessingEvent.inputBuffer.getChannelData(0);
		var newarr: number[] = [];
		for (var i = 0; i < arr.length; i++) {
			newarr[i] = arr[i];
		}
		buffers.push(newarr);
		sampleRate = audioProcessingEvent.inputBuffer.sampleRate;
		//allAudioBuffers.push(inputBuffer);
		//console.log((buffers.length-1),arr[0],newarr[0],buffers[buffers.length-1][0]);
		//kk++;
	}
	let e: HTMLInputElement | null = document.getElementById('menuRecordingButton') as HTMLInputElement;
	if (e) {
		e.src = 'resources/buttonPause.svg';
		if (onAir) {
			zapp.cancelPlay();
		}
		let newTime = durations2time(zapp.schedule.measures);
		//console.log('duration', newTime);
		showRecordAlert(newTime);
		zapp.ticker.waitLoopDuration = newTime;
		zapp.ticker.preDestinationNode.connect(scriptProcessorNode);
		scriptProcessorNode.connect(zapp.audioContext.destination);
		zapp.startPlay();
		setTimeout(() => {
			zapp.cancelPlay();
			//console.log('allAudioBuffers', buffers);
			if (e) e.src = 'resources/buttonWav.svg';
			zapp.ticker.preDestinationNode.disconnect(scriptProcessorNode);
			scriptProcessorNode.disconnect(zapp.audioContext.destination);
			var valCount = 0;
			for (var i = 0; i < buffers.length; i++) {
				valCount = valCount + buffers[i].length;
			}
			var singleFloat32Array: Float32Array = new Float32Array(valCount);
			var offset = 0;
			for (var i = 0; i < buffers.length; i++) {
				//singleFloat32Array.set(allAudioBuffers[i].getChannelData(0), offset);
				singleFloat32Array.set(buffers[i], offset);
				offset = offset + buffers[i].length;
			}
			//console.log('buf', buffers[0][0], buffers[10][0], buffers[20][0]);
			//console.log('val', singleFloat32Array[0 * buffers[0].length], singleFloat32Array[10 * buffers[0].length], singleFloat32Array[20 * buffers[0].length]);

			//console.log('singleFloat32Array', singleFloat32Array);
			hideRecordAlert();
			let dataview: DataView = encodeWAV(singleFloat32Array, sampleRate);
			if (uiMode == 'web') {

				let blob: Blob = new Blob([dataview], { type: 'audio/wav' });


				//console.log('dataview', dataview);
				//console.log('blob', blob);

				var ourl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.href = ourl;
				a.download = 'rockdice';
				a.click();
			} else {
				//var data64=dataViewToBase64(dataview);
				/*var uInt8Array:Uint8Array=new Uint8Array(dataview.buffer);
				console.log('uInt8Array '+uInt8Array.length+' dataview '+dataview.byteLength+' buffer '+dataview.buffer.byteLength);
				var data64=uInt8ArrayToBase64(uInt8Array);
				for(var i=0;i<100;i++){
					console.log(dataview.getInt8(i)+' / '+dataview.getUint8(i)+' / '+dataview.getUint16(i)+' / '+dataview.getUint32(i)+' / '+dataview.buffer[i]+' / '+uInt8Array[i]);
				}*/
				var data64 = _arrayBufferToBase64(dataview.buffer);
				promptExportFile(data64, 'RockDice.wav', 'audio/wav');
			}
		}, newTime * 1000 + 321);
	}
}
/*
function exportWavWeb(data64) {
	promptExportFile(data64, 'RockDice.wav', 'audio/wav');
}
function exportWavAndroid(data64) {
	promptExportFile(data64, 'RockDice.wav', 'audio/wav');
}*/
function rockDiceClickStartRecord2() {
	console.log('rockDiceClickStartRecord');
	let e: HTMLInputElement | null = document.getElementById('menuRecordingButton') as HTMLInputElement;
	if (e) {
		e.src = 'resources/buttonPause.svg';
		if (onAir) {
			zapp.cancelPlay();
		}
		let newTime = durations2time(zapp.schedule.measures);
		console.log(newTime);
		showRecordAlert(newTime);
		zapp.ticker.waitLoopDuration = newTime;
		var mediaStreamDestination: MediaStreamAudioDestinationNode = zapp.audioContext.createMediaStreamDestination();
		zapp.ticker.preDestinationNode.connect(mediaStreamDestination);
		var chunks: Blob[] = [];
		//var mediaRecorder = new window['MediaRecorder'](mediaStreamDestination.stream);
		//https://github.com/mattdiamond/Recorderjs/blob/master/src/recorder.js

		var tryRecorder: MediaRecorder | null = null;
		try {
			var mediaRecorderOptions: MediaRecorderOptions = {
				mimeType: 'audio/mpeg'
			};
			tryRecorder = new MediaRecorder(mediaStreamDestination.stream, mediaRecorderOptions);
		} catch (exp) {
			console.log(exp);
		}
		if (!(tryRecorder)) {
			tryRecorder = new MediaRecorder(mediaStreamDestination.stream);
		}
		if (tryRecorder) {
			var mediaRecorder: MediaRecorder = tryRecorder;
			var ondataavailablefunc: ((this: MediaRecorder, ev: BlobEvent) => any) = function (e1: BlobEvent) {
				console.log('e1', e1);
				var data: Blob = e1.data;
				chunks.push(data);
			};
			mediaRecorder.ondataavailable = ondataavailablefunc;
			mediaRecorder.onstop = function (ee) {
				if (onAir) {
					zapp.cancelPlay();
				}
				zapp.ticker.preDestinationNode.disconnect(mediaStreamDestination);
				if (e) e.src = 'resources/buttonWebA.svg';
				console.log('mediaRecorder', mediaRecorder);
				var blob = new Blob(chunks, {
					'type': mediaRecorder.mimeType //'audio/ogg; codecs=opus'
				});
				console.log('blob', blob);

				var ourl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.href = ourl;
				a.download = 'rockdice';
				a.click();
			};
			mediaRecorder.start();
			zapp.startPlay();
			setTimeout(() => {
				mediaRecorder.stop();
				hideRecordAlert();
			}, newTime * 1000 + 321);
		}
	}
}
function rockDiceRestartOrStart() {
	if (onAir) {
		let newTime = durations2time(zapp.schedule.measures);
		zapp.ticker.waitLoopDuration = newTime;
		zapp.ticker.restart();

	} else {
		zapp.startPlay();
	}
	//setDivStyleDisplay('playDiv', 'none');
	//setDivStyleDisplay('pauseDiv', 'block');
	rockDiceAdjustAnimation();
	zapp.dumpHarmony();
}
function rockDiceAdjustAnimation() {
	if (onAir) {
		setDivStyleDisplay('playDiv', 'block');
		setDivStyleDisplay('pauseDiv', 'none');
	} else {
		setDivStyleDisplay('playDiv', 'none');
		setDivStyleDisplay('pauseDiv', 'block');
	}
}
function rockDiceClickPlay() {
	//console.log('rockDiceClickPlay', onAir);

	if (onAir) {
		zapp.cancelPlay();
		//setDivStyleDisplay('playDiv', 'none');
		//setDivStyleDisplay('pauseDiv', 'block');
	} else {
		zapp.startPlay();

		//setDivStyleDisplay('playDiv', 'block');
		//setDivStyleDisplay('pauseDiv', 'none');
	}
	rockDiceAdjustAnimation();

}
function rockDiceClickOptions() {
	//console.log('rockDiceClickOptions');
	setDivStyleDisplay('appOptionsDiv', 'flex');
}
function rockDiceCloseOptionsDiv() {
	//console.log('rockDiceCloseOptionsDiv');
	setDivStyleDisplay('appOptionsDiv', 'none');
}
//function rockDiceClickShare() {
//	console.log('rockDiceClickShare');
//}
//function rockDiceClickAdsCounter() {
//console.log('rockDiceClickAdsCounter');
//window.open('https://play.google.com/store/apps/details?id=rockdice.chord.progression');//, '_system', 'location=yes');
//	zapp.startAdsShow();
//}
function rockDiceProgressionChanged() {
	//console.log('rockDiceProgressionChanged');
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);

	var sz = trackProgressions.length;
	var vv = 1 * (document.getElementById('sliderProgression') as any).value;
	var nn = Math.floor(sz * vv / 1000);
	//this.selectedProgression = nn;
	uiCannyTask(() => {
		zapp.setProgression(nn, () => {
			rockDiceRestartOrStart();
		});
	});

}



function rockDiceShowChord() {
	zapp.refitUndoList();
	setDivStyleDisplay('chordInfoDiv', 'flex');
}
function rockDiceCloseChordInfoDiv() {
	setDivStyleDisplay('chordInfoDiv', 'none');
}


function rockDiceClickUndo() {
	//console.log('rockDiceClickUndo');
	zapp.refitUndoList();
	setDivStyleDisplay('undoListDiv', 'flex');
}
function rockDiceCloseUndoDiv() {
	//console.log('rockDiceCloseUndoDiv');

	setDivStyleDisplay('undoListDiv', 'none');
}

function clickUndoItem(itemNum: number) {
	console.log('clickUndoItem', itemNum);
}


function rockDiceClickProgList() {

	setDivStyleDisplay('progListDiv', 'flex');
}
function rockDiceCloseProgDiv() {

	setDivStyleDisplay('progListDiv', 'none');
}
function rockDiceCloseExcerptsDiv() {

	setDivStyleDisplay('excerptsListDiv', 'none');
}
function rockDiceRiffExcerptsOpen() {
	zapp.refiExcerptsList();
	setDivStyleDisplay('excerptsListDiv', 'flex');
}
function rockDiceClosePromptExcerptDiv() {
	zapp.refiExcerptsList();
	setDivStyleDisplay('excerptPromptDiv', 'none');
}
function rockDiceRiffPromptExcerptOpen(title: string, nn: number) {

	var lmnt: HTMLElement | null = document.getElementById("excerptTitle");
	if (lmnt) {
		lmnt.innerHTML = title;
	}
	lmnt = document.getElementById("exExProg");
	if (lmnt) {
		lmnt.onclick = () => {
			//console.log('prog', nn);
			if (zapp.storeChangedStateNoStartAd()) {
				zapp.doForCachedSchedule(extendedSchedulePath[-nn].path, (sch: ZvoogSchedule) => {
					zapp.setTracksByProg(nn, sch.harmony, () => {
						rockDiceRestartOrStart();
					});
				});
			}
		};
	}
	lmnt = document.getElementById("exExDrums");
	if (lmnt) {
		lmnt.onclick = () => {
			//console.log('drums', nn);
			if (zapp.storeChangedStateNoStartAd()) {
				zapp.setDrumPattern(nn, () => {
					rockDiceRestartOrStart();
				});
			}
		};
	}
	lmnt = document.getElementById("exExBass");
	if (lmnt) {
		lmnt.onclick = () => {
			//console.log('bass', nn);
			if (zapp.storeChangedStateNoStartAd()) {
				zapp.setBassPattern(nn, () => {
					rockDiceRestartOrStart();
				});
			}
		};
	}
	lmnt = document.getElementById("exExLead");
	if (lmnt) {
		lmnt.onclick = () => {
			//console.log('lead', nn);
			if (zapp.storeChangedStateNoStartAd()) {
				zapp.setLeadPattern(nn, () => {
					rockDiceRestartOrStart();
				});
			}
		};
	}
	lmnt = document.getElementById("exExPad");
	if (lmnt) {
		lmnt.onclick = () => {
			//console.log('pad', nn);
			if (zapp.storeChangedStateNoStartAd()) {
				zapp.setPadPattern(nn, () => {
					rockDiceRestartOrStart();
				});
			}
		};
	}
	lmnt = document.getElementById("exExAll");
	if (lmnt) {
		lmnt.onclick = () => {
			//console.log('all', nn);
			if (zapp.storeChangedStateNoStartAd()) {
				zapp.selectedBass = nn;
				zapp.selectedDrums = nn;
				zapp.selectedLead = nn;
				zapp.selectedPad = nn;


				zapp.doForCachedSchedule(extendedSchedulePath[-nn].path, (sch: ZvoogSchedule) => {
					zapp.setTempo(sch.measures[0].tempo);
					zapp.setTracksByProg(nn, sch.harmony, () => {
						zapp.setDefaultVolumes();
						rockDiceRestartOrStart();
					});
				});
			}
		};
	}
	setDivStyleDisplay('excerptPromptDiv', 'flex');

}
/*
function rockDiceClickSongList() {
	console.log('rockDiceClickSongList');
	setDivStyleDisplay('songListDiv', 'flex');
}
function rockDiceCloseSongDiv() {
	console.log('rockDiceCloseSongDiv');
	setDivStyleDisplay('songListDiv', 'none');
}
*/
function rockDiceClickDrumsList() {
	//console.log('rockDiceClickDrumsList');
	setDivStyleDisplay('drumsListDiv', 'flex');
}
function rockDiceCloseDrumsDiv() {
	//console.log('rockDiceCloseDrumsDiv');
	setDivStyleDisplay('drumsListDiv', 'none');
}

function rockDiceClickBassList() {
	//console.log('rockDiceClickBassList');
	setDivStyleDisplay('bassListDiv', 'flex');
}
function rockDiceCloseBassDiv() {
	//console.log('rockDiceCloseBassDiv');
	setDivStyleDisplay('bassListDiv', 'none');
}

function rockDiceClickLeadList() {
	//console.log('rockDiceClickLeadList');
	setDivStyleDisplay('leadListDiv', 'flex');
}
function rockDiceCloseLeadDiv() {
	//console.log('rockDiceCloseLeadDiv');
	setDivStyleDisplay('leadListDiv', 'none');
}

function rockDiceClickPadList() {
	//console.log('rockDiceClickPadList');
	setDivStyleDisplay('padListDiv', 'flex');
}
function rockDiceClosePadDiv() {
	//console.log('rockDiceClosePadDiv');
	setDivStyleDisplay('padListDiv', 'none');
}


function rockDiceClickNoAds() {
	let ss = zapp.createCurrentState();
	ss.comment = '';
	let link = 'https://play.google.com/store/apps/details?id=surikov.rockdice.addsfree';
	window.open(link);
}

function rockDiceClickShare() {
	//console.log('rockDiceClickShare');
	let ss = zapp.createCurrentState();
	ss.comment = '';
	let link = zapp.createShareLink(ss);
	//window.open(link);//, '_system', 'location=yes');
	window.location.href = link;
	/*
	let e: HTMLElement | null = document.getElementById('exLabel');
	if (e) {
		e.textContent = link;
	}
	setDivStyleDisplay('midiShareDiv', 'flex');
	*/

	/*for (let i = 0; i < zapp.cashedDrums.length; i++) {
		console.log(i,'cashedDrums', zapp.cashedDrums[i]);
	}
	for (let i = 0; i < zapp.cashedDrums.length; i++) {
		console.log(i,'cashedIns', zapp.cashedIns[i]);
	}*/

}
/*
function rockDiceCloseShare() {
	console.log('rockDiceCloseShare');
	setDivStyleDisplay('midiShareDiv', 'none');
}*/


function rockDiceClickMIDIExport() {
	//console.log('rockDiceClickMIDI');
	//setDivStyleDisplay('midiExportDiv', 'flex');
	if (uiMode == 'web') {
		exportMIDIDesktop(zapp.schedule);
	} else {
		exportMIDIAndroid(zapp.schedule);
	}
}
function rockDiceCloseMIDIExport() {
	//console.log('rockDiceCloseMIDIExport');
	setDivStyleDisplay('midiExportDiv', 'none');
}
function saveState() {
	/*console.log('saveState start');
	for (var ii = 0; ii < zapp.schedule.harmony.progression.length; ii++) {
		console.log(zapp.schedule.harmony.progression[ii].chord
			, zapp.schedule.harmony.progression[ii].duration.count
			, zapp.schedule.harmony.progression[ii].duration.division);
	}*/
	//console.log('1',zapp.schedule.harmony.progression[2].chord, zapp.schedule.harmony.progression[2].duration.count, zapp.schedule.harmony.progression[2].duration.division);
	let state = zapp.createCurrentState();
	//console.log('2',zapp.schedule.harmony.progression[2].chord, zapp.schedule.harmony.progression[2].duration.count, zapp.schedule.harmony.progression[2].duration.division);
	//console.log('saveState',state.chords.join(' '));
	let txt = JSON.stringify(state);
	//console.log('3',zapp.schedule.harmony.progression[2].chord, zapp.schedule.harmony.progression[2].duration.count, zapp.schedule.harmony.progression[2].duration.division);
	zapp.saveText2localStorage(zapp.stateName, txt);
	//console.log('4',zapp.schedule.harmony.progression[2].chord, zapp.schedule.harmony.progression[2].duration.count, zapp.schedule.harmony.progression[2].duration.division);
	txt = JSON.stringify(zapp.undoList);
	//console.log('5',zapp.schedule.harmony.progression[2].chord, zapp.schedule.harmony.progression[2].duration.count, zapp.schedule.harmony.progression[2].duration.division);
	zapp.saveText2localStorage(zapp.undoName, txt);
	//console.log('6',zapp.schedule.harmony.progression[2].chord, zapp.schedule.harmony.progression[2].duration.count, zapp.schedule.harmony.progression[2].duration.division);
	//console.log('saveState end');
	/*for (var ii = 0; ii < zapp.schedule.harmony.progression.length; ii++) {
		console.log(zapp.schedule.harmony.progression[ii].chord
			, zapp.schedule.harmony.progression[ii].duration.count
			, zapp.schedule.harmony.progression[ii].duration.division);
	}*/
	//zapp.saveText2localStorage(zapp.counterName, '' + zapp.adsCounter);

}
function rockDiceClickStartInit() {
	console.log('rockDiceClickStartInit', zapp);
	if (zapp) {
		setDivStyleDisplay('fogInitDiv', 'none');
		zapp.interStart();
		zapp.ticker.watcher = (position: number) => {
			if (Math.abs(lastSongPosition - position) > 0.33) {
				lastSongPosition = position;
				let xx = Math.round(0.2 + seconds2Duration384(position, zapp.selectedTempo) / 48);
				if (xx < 0) xx = 0;
				if (xx > 127) xx = 127;
				reColorCell(lastGridPosition, '');
				reColorCell(xx, '#ffffff');
				lastGridPosition = xx;
			}
		};
		//let me=this;
		window.addEventListener("pagehide", saveState);
		window.addEventListener("blur", saveState);
		window.addEventListener("unload", saveState);
		//console.log('rockDiceClickStartInit done');
		//zapp.dumpCashedInstruments();
	}
}
function reColorCell(num: number, color: string) {
	let e: HTMLElement | null = document.getElementById('chord' + num);
	if (e) {
		e.style.color = color;
	}
}
function rockDiceTempoSliderChanged() {
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	//console.log('rockDiceTempoSliderChanged');
	uiCannyTask(() => {
		let e: HTMLInputElement | null = document.getElementById('tempoSlider') as any;
		if (e) {
			zapp.setTempo(parseInt(e.value));
			rockDiceRestartOrStart();
		}
	});
}
function rockDiceDrumsSliderChanged() {
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	//console.log('rockDiceDrumsSliderChanged');
	uiCannyTask(() => {
		let e: HTMLInputElement | null = document.getElementById('drumVolumeSlider') as any;
		if (e) {
			zapp.setDrumsVolume(parseInt(e.value));
			rockDiceRestartOrStart();
		}
	});

}
function rockDiceBassSliderChanged() {
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	//console.log('rockDiceBassSliderChanged');
	uiCannyTask(() => {
		let e: HTMLInputElement | null = document.getElementById('bassVolumeSlider') as any;
		if (e) {
			zapp.setBassVolume(parseInt(e.value));
			rockDiceRestartOrStart();
		}
	});
}
function rockDiceLeadSliderChanged() {
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	//console.log('rockDiceLeadSliderChanged');
	uiCannyTask(() => {
		let e: HTMLInputElement | null = document.getElementById('leadVolumeSlider') as any;
		if (e) {
			zapp.setLeadVolume(parseInt(e.value));
			rockDiceRestartOrStart();
		}
	});
}
function rockDicePadSliderChanged() {
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	//console.log('rockDicePadSliderChanged');
	uiCannyTask(() => {
		let e: HTMLInputElement | null = document.getElementById('padVolumeSlider') as any;
		if (e) {
			zapp.setPadVolume(parseInt(e.value));
			rockDiceRestartOrStart();
		}
	});
}
function rockDicePromptChord(position8: number) {
	console.log('rockDicePromptChord', position8);
	let chordChaneChord: ZvoogChordMelody | null = zapp.harmonizer.findProgressionPart({
		count: position8,
		division: 8
	}, zapp.schedule.harmony.progression);
	if (chordChaneChord) {
		//let chordChaneName = chordChaneChord.chord;
		let chordPlay = zapp.harmonizer.checkProgressionPoint({
			count: position8,
			division: 8
		}, zapp.schedule.harmony.progression);
		var chordPlayName = '-';
		if (chordPlay != null) {
			chordPlayName = chordPlay.chord;
		}

		let name = prompt('', chordPlayName);
		if (name != null) {
			//zapp.storeChangedStateAndCheck();
			zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
			//console.log('clickChordName', name, barNum, note8);
			let newChord = zapp.parseChordName(name); //.setProgressionChord(barNum*8+note8,name);
			//console.log('clickChordName', barNum*8+note8, newChord,barNum, note8,barNum*8+note8);
			zapp.setProgressionChord(position8, newChord, zapp.schedule.harmony);
			//console.log('set',zapp.schedule.harmony);
			//zapp.redefineProgGrid();
			//var un;
			zapp.setAllTracks(rockDiceRestartOrStart);
			//zapp.dumpCurrentState();
			//rockDiceRestartOrStart();
		}
	}
}








function rockDiceClickDrumsButton() {
	let nn = Math.floor(Math.random() * zapp.drumsSchedules.length);
	//console.log('rockDiceClickDrumsButton', nn, zapp.drumsSchedules.length);
	uiCannyTask(() => {
		if (zapp.storeChangedStateNoStartAd()) {
			zapp.setDrumsVolume(111);
			zapp.setDrumPattern(nn, () => {
				rockDiceRestartOrStart();
			});
		}
	});
}
function rockDiceRollDrumsButton(nn: number) {
	//console.log('rockDiceRollDrumsButton', nn);
	uiCannyTask(() => {
		if (zapp.storeChangedStateNoStartAd()) {
			zapp.setDrumPattern(nn, () => {
				rockDiceRestartOrStart();
			});
		}
	});

}
function rockDiceReleaseDrumsButton() {
	//console.log('rockDiceReleaseDrumsButton');
	//if (zapp.storeChangedStateNoStartAd()) {
	//
	//}
}

function rockDiceClickBassButton() {
	let nn = Math.floor(Math.random() * zapp.bassSchedules.length);
	//console.log('rockDiceClickBassButton', nn, zapp.bassSchedules.length);
	uiCannyTask(() => {
		if (zapp.storeChangedStateNoStartAd()) {
			zapp.setBassVolume(99);
			zapp.setBassPattern(nn, () => {
				rockDiceRestartOrStart();
			});
		}
	});
}
function rockDiceRollBassButton(nn: number) {
	//console.log('rockDiceRollBassButton', nn);
	uiCannyTask(() => {
		if (zapp.storeChangedStateNoStartAd()) {
			zapp.setBassPattern(nn, () => {
				rockDiceRestartOrStart();
			});
		}
	});
}
function rockDiceReleaseBassButton() {
	//console.log('rockDiceReleaseBassButton');
	//if (zapp.storeChangedStateNoStartAd()) {
	//
	//}
}

function rockDiceClickLeadButton() {
	let nn = Math.floor(Math.random() * zapp.leadSchedules.length);
	//console.log('rockDiceClickLeadButton', nn, zapp.leadSchedules.length);
	uiCannyTask(() => {
		if (zapp.storeChangedStateNoStartAd()) {
			zapp.setLeadVolume(66);
			zapp.setLeadPattern(nn, () => {
				rockDiceRestartOrStart();
			});
		}
	});
}
function rockDiceRollLeadButton(nn: number) {
	//console.log('rockDiceRollLeadButton', nn);
	uiCannyTask(() => {
		if (zapp.storeChangedStateNoStartAd()) {
			zapp.setLeadPattern(nn, () => {
				rockDiceRestartOrStart();
			});
		}
	});
}
function rockDiceReleaseLeadButton() {
	//console.log('rockDiceReleaseLeadButton');
	//if (zapp.storeChangedStateNoStartAd()) {
	//
	//}
}

function rockDiceClickPadButton() {
	let nn = Math.floor(Math.random() * zapp.padSchedules.length);
	//console.log('rockDiceClickPadButton', nn, zapp.padSchedules.length);
	uiCannyTask(() => {
		if (zapp.storeChangedStateNoStartAd()) {
			zapp.setPadVolume(77);
			zapp.setPadPattern(nn, () => {
				rockDiceRestartOrStart();
			});
		}
	});
}
function rockDiceRollPadButton(nn: number) {
	//console.log('rockDiceRollPadButton', nn);
	uiCannyTask(() => {
		if (zapp.storeChangedStateNoStartAd()) {
			zapp.setPadPattern(nn, () => {
				rockDiceRestartOrStart();
			});
		}
	});
}
function rockDiceReleasePadButton() {
	//console.log('rockDiceReleasePadButton');
	//if (zapp.storeChangedStateNoStartAd()) {
	//
	//}
}
function rockDiceClick4x4() {
	//console.log('rockDiceClick4x4');
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	zapp.repeatForByFirstN(4, zapp.schedule.harmony);
	zapp.setAllTracks(rockDiceRestartOrStart);
}
function rockDiceClick8x2() {
	//console.log('rockDiceClick8x2');
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	zapp.repeatForByFirstN(8, zapp.schedule.harmony);
	zapp.setAllTracks(rockDiceRestartOrStart);
}
function _____rockDicePlusLoop4() {
	//console.log('rockDicePlusLoop4');
	setDivStyleDisplay('toolsLoop4', 'none');
	setDivStyleDisplay('divLoop8', 'block');
	setDivStyleDisplay('toolsLoop8', 'block');
	setDivStyleDisplay('divLoop16', 'none');
	setDivStyleDisplay('toolsLoop16', 'none');
}
function _____rockDicePlusLoop8() {
	//console.log('rockDicePlusLoop8');
	setDivStyleDisplay('toolsLoop4', 'none');
	setDivStyleDisplay('divLoop8', 'block');
	setDivStyleDisplay('toolsLoop8', 'none');
	setDivStyleDisplay('divLoop16', 'block');
	setDivStyleDisplay('toolsLoop16', 'block');
}
function _____rockDiceMinusLoop8() {
	//console.log('rockDiceMinusLoop8');
	setDivStyleDisplay('toolsLoop4', 'block');
	setDivStyleDisplay('divLoop8', 'none');
	setDivStyleDisplay('toolsLoop8', 'none');
	setDivStyleDisplay('divLoop16', 'none');
	setDivStyleDisplay('toolsLoop16', 'none');
}
function ___rockDiceMinusLoop16() {
	//console.log('rockDiceMinusLoop16');
	setDivStyleDisplay('toolsLoop4', 'none');
	setDivStyleDisplay('divLoop8', 'block');
	setDivStyleDisplay('toolsLoop8', 'block');
	setDivStyleDisplay('divLoop16', 'none');
	setDivStyleDisplay('toolsLoop16', 'none');
}


function setDivStyleDisplay(id: string, style: string) {
	let e: HTMLElement | null = document.getElementById(id);
	if (e) {
		e.style.display = style;
		e.scrollTop=0;
	}
}
function calcChordDown(fullName: string): string {
	var parts = fullName.split("/");
	//console.log('calcChordDown',parts,parts.length);
	if (parts.length == 2) {
		//console.log('split',parts[0] , parts[1],calcPartDown(parts[0] + '/' + parts[1]));
		return calcPartDown(parts[0]) + '/' + calcPartDown(parts[1]);
	} else {
		return calcPartDown(fullName);
	}
}
function calcPartDown(fullName: string): string {
	var chordStrip = fullName.substring(0, 1);
	var secondSign = fullName.substring(1, 2);
	if (secondSign == '#' || secondSign == 'b') {
		chordStrip = chordStrip + secondSign;
	}
	var remains = fullName.substring(chordStrip.length, fullName.length);
	if (chordStrip == 'Ab') return 'G' + remains;
	if (chordStrip == 'A') return 'G#' + remains;
	if (chordStrip == 'A#') return 'A' + remains;
	if (chordStrip == 'Bb') return 'A' + remains;
	if (chordStrip == 'B') return 'A#' + remains;
	if (chordStrip == 'C') return 'B' + remains;
	if (chordStrip == 'C#') return 'C' + remains;
	if (chordStrip == 'Db') return 'C' + remains;
	if (chordStrip == 'D') return 'C#' + remains;
	if (chordStrip == 'D#') return 'D' + remains;
	if (chordStrip == 'Eb') return 'D' + remains;
	if (chordStrip == 'E') return 'D#' + remains;
	if (chordStrip == 'F') return 'E' + remains;
	if (chordStrip == 'F#') return 'F' + remains;
	if (chordStrip == 'Gb') return 'F' + remains;
	if (chordStrip == 'G') return 'F#' + remains;
	if (chordStrip == 'G#') return 'G' + remains;
	return fullName;
}
function calcChordUp(fullName: string): string {
	var parts = fullName.split("/");
	if (parts.length == 2) {
		return calcPartUp(parts[0]) + '/' + calcPartUp(parts[1]);
	} else {
		return calcPartUp(fullName);
	}
}
function calcPartUp(fullName: string): string {
	var chordStrip = fullName.substring(0, 1);
	var secondSign = fullName.substring(1, 2);
	if (secondSign == '#' || secondSign == 'b') {
		chordStrip = chordStrip + secondSign;
	}
	var remains = fullName.substring(chordStrip.length, fullName.length);
	if (chordStrip == 'Ab') return 'A' + remains;
	if (chordStrip == 'A') return 'A#' + remains;
	if (chordStrip == 'A#') return 'B' + remains;
	if (chordStrip == 'Bb') return 'B' + remains;
	if (chordStrip == 'B') return 'C' + remains;
	if (chordStrip == 'C') return 'C#' + remains;
	if (chordStrip == 'C#') return 'D' + remains;
	if (chordStrip == 'Db') return 'D' + remains;
	if (chordStrip == 'D') return 'D#' + remains;
	if (chordStrip == 'D#') return 'E' + remains;
	if (chordStrip == 'Eb') return 'E' + remains;
	if (chordStrip == 'E') return 'F' + remains;
	if (chordStrip == 'F') return 'F#' + remains;
	if (chordStrip == 'F#') return 'G' + remains;
	if (chordStrip == 'Gb') return 'G' + remains;
	if (chordStrip == 'G') return 'G#' + remains;
	if (chordStrip == 'G#') return 'A' + remains;
	return fullName;
}

function rockDiceClickProgPrompt() {
	//console.log('rockDiceClickProgPrompt');
	zapp.promptProgression();
	rockDiceRestartOrStart();
}
function rockDiceClickProgUp() {
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	let progchords: ZvoogChordMelody[] = zapp.schedule.harmony.progression;
	for (var i = 0; i < progchords.length; i++) {
		progchords[i].chord = calcChordUp(progchords[i].chord);
	}
	zapp.harmonizer.repeatAllVoices(zapp.schedule, { count: 16, division: 1 });
	zapp.setAllTracks(() => {
		zapp.ticker.restart();
	});
	rockDiceRestartOrStart();
}
function rockDiceClickProgDown() {
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	let progchords: ZvoogChordMelody[] = zapp.schedule.harmony.progression;
	for (var i = 0; i < progchords.length; i++) {
		progchords[i].chord = calcChordDown(progchords[i].chord);
	}
	zapp.harmonizer.repeatAllVoices(zapp.schedule, { count: 16, division: 1 });
	zapp.setAllTracks(() => {
		zapp.ticker.restart();
	});
	rockDiceRestartOrStart();
}
function rockDiceClickProgRefit() {
	//console.log('rockDiceClickProgRefit');
	//zapp.storeChangedStateAndCheck();
	zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
	zapp.chooseVariantProg();
	rockDiceRestartOrStart();
}
let uiWaitForTask: number = 0;
function uiCannyTask(task: () => void) {
	let currentWaitForTask = Math.random();
	uiWaitForTask = currentWaitForTask;
	setTimeout(() => {
		if (currentWaitForTask == uiWaitForTask) {
			task();
		}
	}, 123);
}
class RoundedHandler {
	value: number = 0;
	calculatedValue: number = 0;
	maxValue: number = 0;
	click: () => void;
	interEnd: () => void;
	change: (nn: number) => void;
	rotation: HTMLElement | null;
	component: HTMLElement | null;
	startY: number = 0;
	delta: number = 0;
	startValue: number = 0;
	watchMouse: boolean = false;
	colorcomp: HTMLElement | null;
	colorcalc: (v: number) => string;
	negative = false;

	constructor(count: number
		, colorcomp: HTMLElement | null
		//, colorcalc: (v: number) => string
		, maincomp: HTMLElement | null
		, rocomp: HTMLElement | null
		, onclick: () => void
		, onchange: (nn: number) => void
		, endInteraction: () => void
	) {
		this.value = 0;
		this.maxValue = count - 1;
		this.interEnd = endInteraction;
		this.click = onclick;
		this.change = onchange;
		this.rotation = rocomp;
		this.component = maincomp;
		this.startY = 0;
		this.delta = 0;
		this.startValue = 0;
		this.watchMouse = false;
		//this.colorcalc = colorcalc;
		this.colorcomp = colorcomp;
		window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
		window.addEventListener('mousemove', this.onMouseMove.bind(this), true);
		if (this.component) {
			this.component.addEventListener('mousedown', this.cmousedown.bind(this), false);
			this.component.addEventListener("touchstart", this.ctouchstart.bind(this), false);
			this.component.addEventListener("touchmove", this.ctouchmove.bind(this), false);
			this.component.addEventListener("touchend", this.ctouchend.bind(this), false);
		}
		this.setColor();
	}
	setColor() {
		if (this.colorcomp) {
			if (this.negative) {
				let rgba = 'rgba(50,50,50,0.99)';
				this.colorcomp.style.stroke = rgba;
			} else {
				let part = this.value / this.maxValue;
				let r = Math.floor(255 * part);//Math.floor(255 * Math.cos(part * Math.PI / 2));
				let g = Math.floor(255 - 255 * part);//Math.floor(255 * Math.sin(part * Math.PI / 2));
				let b = Math.floor(2 * Math.abs(127 - 254 * part));
				//console.log(part, r, g, b);
				let rgba = 'rgba(' + r + ',' + g + ',' + b + ',1)';
				this.colorcomp.style.stroke = rgba;
			}
		}
	}

	setRoundedValue(newValue: number, fire: boolean) {
		var diff = (newValue != this.value);
		this.negative = (newValue < 0);
		//console.log('setRoundedValue',newValue,this.negative);
		//var old = this.value;
		this.value = newValue;
		if (this.value < 0) this.value = 0;
		if (this.value > this.maxValue) this.value = this.maxValue;
		if (diff) {
			if (this.rotation) {
				let rova = 270 * this.value / this.maxValue;
				this.rotation.style.transform = "rotate(" + rova + "deg)";

				this.setColor();
			}
			if (fire) this.change(this.value);
		}
	}
	cmousedown(mouseEvent: any) {
		mouseEvent.preventDefault();
		this.startY = mouseEvent.clientY;
		this.startValue = this.value;
		this.delta = 0;
		this.watchMouse = true;
	}
	onMouseUp(mouseEvent: any) {
		if (this.watchMouse) {
			this.watchMouse = false;
			mouseEvent.preventDefault();
			if (this.delta < 10) {
				this.click();
			}
			this.interEnd();
		}

	};
	onMouseMove(mouseEvent: any) {
		if (this.watchMouse) {
			mouseEvent.preventDefault();
			var dY = mouseEvent.clientY - this.startY;
			this.delta = Math.abs(dY);
			var newVal = Math.floor(this.startValue - dY / (1000 / this.maxValue));
			if (newVal < 0) newVal = 0;
			if (newVal > this.maxValue) newVal = this.maxValue;
			this.setRoundedValue(newVal, true);
		}
	};

	ctouchstart(touchEvent: any) {
		touchEvent.preventDefault();
		this.startY = touchEvent.touches[0].clientY;
		this.startValue = this.value;
		this.delta = 0;
	}
	ctouchmove(touchEvent: any) {
		touchEvent.preventDefault();
		var dY = touchEvent.touches[0].clientY - this.startY;
		this.delta = Math.abs(dY);
		var newVal = Math.floor(this.startValue - dY / (1000 / this.maxValue));
		if (newVal < 0) newVal = 0;
		if (newVal > this.maxValue) newVal = this.maxValue;
		this.setRoundedValue(newVal, true);
	}
	ctouchend(touchEvent: any) {
		touchEvent.preventDefault();
		if (this.delta < 10) {
			this.click();
		}
		this.interEnd();
	}


}
class RockDiceUI {

	connectRoundButtons(zapp: ZvoogApp) {
		let me = this;
		zapp.drumControl = new RoundedHandler(zapp.drumsSchedules.length
			, document.getElementById('drumColor')
			, document.getElementById('svgdrums'), document.getElementById('roundDrums')
			, rockDiceClickDrumsButton, rockDiceRollDrumsButton, rockDiceReleaseDrumsButton);
		zapp.bassControl = new RoundedHandler(zapp.bassSchedules.length
			, document.getElementById('bassColor')
			, document.getElementById('svgbass'), document.getElementById('roundBass')
			, rockDiceClickBassButton, rockDiceRollBassButton, rockDiceReleaseBassButton);
		zapp.leadControl = new RoundedHandler(zapp.leadSchedules.length
			, document.getElementById('leadColor')
			, document.getElementById('svglead'), document.getElementById('roundLead')
			, rockDiceClickLeadButton, rockDiceRollLeadButton, rockDiceReleaseLeadButton);
		zapp.padControl = new RoundedHandler(zapp.padSchedules.length
			, document.getElementById('padColor')
			, document.getElementById('svgpad'), document.getElementById('roundPad')
			, rockDiceClickPadButton, rockDiceRollPadButton, rockDiceReleasePadButton);
	}
}
let rockDiceUI: RockDiceUI = new RockDiceUI();

