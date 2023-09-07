"use strict";
var onAir = false;
var zapp;
var uiMode = 'free';
var lastSongPosition = 0;
var lastGridPosition = 0;
var extendedSchedulePath = [{ ready: false, title: '', path: '' }];
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
}
;
function promptExportFile(data64, fileName, mime) {
    //console.log('promptExportFile', fileName, mime);
    //console.log('jsAndroidActivityLink', jsAndroidActivityLink);
    //var b64 = Buffer.from(uInt8Array).toString('base64');
    //var data64=bytesToBase64(uInt8Array);
    //console.log(data64);
    jsAndroidActivityLink.propmtExportFileActivity(data64, fileName, mime);
}
function exportFile(uInt8Array) {
    var windowObj = window;
    var LocalFileSystemObj = window['LocalFileSystem'];
    var cordovaObj = window['cordova'];
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
                var aa = document.getElementById('exportLabel');
                if (aa) {
                    var regex = /\//g;
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
function handleOpenURL(url_string) {
    console.log("received url: " + url_string);
    //let queryString = window.location.search;
    var url = new URL(url_string);
    var seed = url.searchParams.get('seed');
    //let urlParams = new URLSearchParams(url);//queryString);
    //let seed = urlParams.get('seed');
    console.log('seed', seed);
    if (seed) {
        try {
            var param = JSON.parse(seed);
            var o = zapp.readObjectFromlocalStorage(zapp.stateName);
            if (o) {
                var old = o;
                old.comment = '' + new Date();
                zapp.pushUndoState(old, zapp.undoList);
            }
            param.comment = '' + new Date();
            zapp.saveText2localStorage(zapp.stateName, JSON.stringify(param));
            if (zapp.harmonizer) {
                zapp.loadSongState(param);
            }
        }
        catch (xx) {
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
function showRecordAlert(time) {
    hideRecordAlert();
    var e = document.getElementById('alertDiv');
    if (e) {
        e.style.display = 'block';
    }
    setDivStyleDisplay('recordFog', 'flex');
    recordTimeCounter = 0;
    recordTimeDelta = 100 / time;
    recordIntervalID = setInterval(function () {
        recordTimeCounter = recordTimeCounter + recordTimeDelta;
        var e = document.getElementById('alertTime');
        if (e) {
            e.style.width = '' + Math.floor(recordTimeCounter) + '%';
        }
    }, 999);
}
function hideRecordAlert() {
    clearInterval(recordIntervalID);
    var e = document.getElementById('alertDiv');
    if (e) {
        e.style.display = 'none';
    }
    setDivStyleDisplay('recordFog', 'none');
}
function floatTo16BitPCM(output, skip, input) {
    var offset = skip;
    //try {
    for (var i = 0; i < input.length; i++) {
        var s = Math.max(-1, Math.min(1, input[i]));
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
function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
function encodeWAV(samples, sampleRate) {
    console.log('length', (44 + samples.length * 2));
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);
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
    var scriptProcessorNode = zapp.audioContext.createScriptProcessor(4096, 1, 1);
    //var allAudioBuffers: AudioBuffer[] = [];
    var buffers = [];
    var sampleRate = 0;
    //var kk=0;
    scriptProcessorNode.onaudioprocess = function (audioProcessingEvent) {
        var arr = audioProcessingEvent.inputBuffer.getChannelData(0);
        var newarr = [];
        for (var i = 0; i < arr.length; i++) {
            newarr[i] = arr[i];
        }
        buffers.push(newarr);
        sampleRate = audioProcessingEvent.inputBuffer.sampleRate;
        //allAudioBuffers.push(inputBuffer);
        //console.log((buffers.length-1),arr[0],newarr[0],buffers[buffers.length-1][0]);
        //kk++;
    };
    var e = document.getElementById('menuRecordingButton');
    if (e) {
        e.src = 'resources/buttonPause.svg';
        if (onAir) {
            zapp.cancelPlay();
        }
        var newTime = durations2time(zapp.schedule.measures);
        //console.log('duration', newTime);
        showRecordAlert(newTime);
        zapp.ticker.waitLoopDuration = newTime;
        zapp.ticker.preDestinationNode.connect(scriptProcessorNode);
        scriptProcessorNode.connect(zapp.audioContext.destination);
        zapp.startPlay();
        setTimeout(function () {
            zapp.cancelPlay();
            //console.log('allAudioBuffers', buffers);
            if (e)
                e.src = 'resources/buttonWav.svg';
            zapp.ticker.preDestinationNode.disconnect(scriptProcessorNode);
            scriptProcessorNode.disconnect(zapp.audioContext.destination);
            var valCount = 0;
            for (var i = 0; i < buffers.length; i++) {
                valCount = valCount + buffers[i].length;
            }
            var singleFloat32Array = new Float32Array(valCount);
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
            var dataview = encodeWAV(singleFloat32Array, sampleRate);
            if (uiMode == 'web') {
                var blob = new Blob([dataview], { type: 'audio/wav' });
                //console.log('dataview', dataview);
                //console.log('blob', blob);
                var ourl = URL.createObjectURL(blob);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = ourl;
                a.download = 'rockdice';
                a.click();
            }
            else {
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
    var e = document.getElementById('menuRecordingButton');
    if (e) {
        e.src = 'resources/buttonPause.svg';
        if (onAir) {
            zapp.cancelPlay();
        }
        var newTime = durations2time(zapp.schedule.measures);
        console.log(newTime);
        showRecordAlert(newTime);
        zapp.ticker.waitLoopDuration = newTime;
        var mediaStreamDestination = zapp.audioContext.createMediaStreamDestination();
        zapp.ticker.preDestinationNode.connect(mediaStreamDestination);
        var chunks = [];
        //var mediaRecorder = new window['MediaRecorder'](mediaStreamDestination.stream);
        //https://github.com/mattdiamond/Recorderjs/blob/master/src/recorder.js
        var tryRecorder = null;
        try {
            var mediaRecorderOptions = {
                mimeType: 'audio/mpeg'
            };
            tryRecorder = new MediaRecorder(mediaStreamDestination.stream, mediaRecorderOptions);
        }
        catch (exp) {
            console.log(exp);
        }
        if (!(tryRecorder)) {
            tryRecorder = new MediaRecorder(mediaStreamDestination.stream);
        }
        if (tryRecorder) {
            var mediaRecorder = tryRecorder;
            var ondataavailablefunc = function (e1) {
                console.log('e1', e1);
                var data = e1.data;
                chunks.push(data);
            };
            mediaRecorder.ondataavailable = ondataavailablefunc;
            mediaRecorder.onstop = function (ee) {
                if (onAir) {
                    zapp.cancelPlay();
                }
                zapp.ticker.preDestinationNode.disconnect(mediaStreamDestination);
                if (e)
                    e.src = 'resources/buttonWebA.svg';
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
            setTimeout(function () {
                mediaRecorder.stop();
                hideRecordAlert();
            }, newTime * 1000 + 321);
        }
    }
}
function rockDiceRestartOrStart() {
    if (onAir) {
        var newTime = durations2time(zapp.schedule.measures);
        zapp.ticker.waitLoopDuration = newTime;
        zapp.ticker.restart();
    }
    else {
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
    }
    else {
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
    }
    else {
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
    var vv = 1 * document.getElementById('sliderProgression').value;
    var nn = Math.floor(sz * vv / 1000);
    //this.selectedProgression = nn;
    uiCannyTask(function () {
        zapp.setProgression(nn, function () {
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
function clickUndoItem(itemNum) {
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
function rockDiceRiffPromptExcerptOpen(title, nn) {
    var lmnt = document.getElementById("excerptTitle");
    if (lmnt) {
        lmnt.innerHTML = title;
    }
    lmnt = document.getElementById("exExProg");
    if (lmnt) {
        lmnt.onclick = function () {
            //console.log('prog', nn);
            if (zapp.storeChangedStateNoStartAd()) {
                zapp.doForCachedSchedule(extendedSchedulePath[-nn].path, function (sch) {
                    zapp.setTracksByProg(nn, sch.harmony, function () {
                        rockDiceRestartOrStart();
                    });
                });
            }
        };
    }
    lmnt = document.getElementById("exExDrums");
    if (lmnt) {
        lmnt.onclick = function () {
            //console.log('drums', nn);
            if (zapp.storeChangedStateNoStartAd()) {
                zapp.setDrumPattern(nn, function () {
                    rockDiceRestartOrStart();
                });
            }
        };
    }
    lmnt = document.getElementById("exExBass");
    if (lmnt) {
        lmnt.onclick = function () {
            //console.log('bass', nn);
            if (zapp.storeChangedStateNoStartAd()) {
                zapp.setBassPattern(nn, function () {
                    rockDiceRestartOrStart();
                });
            }
        };
    }
    lmnt = document.getElementById("exExLead");
    if (lmnt) {
        lmnt.onclick = function () {
            //console.log('lead', nn);
            if (zapp.storeChangedStateNoStartAd()) {
                zapp.setLeadPattern(nn, function () {
                    rockDiceRestartOrStart();
                });
            }
        };
    }
    lmnt = document.getElementById("exExPad");
    if (lmnt) {
        lmnt.onclick = function () {
            //console.log('pad', nn);
            if (zapp.storeChangedStateNoStartAd()) {
                zapp.setPadPattern(nn, function () {
                    rockDiceRestartOrStart();
                });
            }
        };
    }
    lmnt = document.getElementById("exExAll");
    if (lmnt) {
        lmnt.onclick = function () {
            //console.log('all', nn);
            if (zapp.storeChangedStateNoStartAd()) {
                zapp.selectedBass = nn;
                zapp.selectedDrums = nn;
                zapp.selectedLead = nn;
                zapp.selectedPad = nn;
                zapp.doForCachedSchedule(extendedSchedulePath[-nn].path, function (sch) {
                    zapp.setTempo(sch.measures[0].tempo);
                    zapp.setTracksByProg(nn, sch.harmony, function () {
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
    var ss = zapp.createCurrentState();
    ss.comment = '';
    var link = 'https://play.google.com/store/apps/details?id=surikov.rockdice.addsfree';
    window.open(link);
}
function rockDiceClickShare() {
    //console.log('rockDiceClickShare');
    var ss = zapp.createCurrentState();
    ss.comment = '';
    var link = zapp.createShareLink(ss);
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
    }
    else {
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
    var state = zapp.createCurrentState();
    //console.log('2',zapp.schedule.harmony.progression[2].chord, zapp.schedule.harmony.progression[2].duration.count, zapp.schedule.harmony.progression[2].duration.division);
    //console.log('saveState',state.chords.join(' '));
    var txt = JSON.stringify(state);
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
        zapp.ticker.watcher = function (position) {
            if (Math.abs(lastSongPosition - position) > 0.33) {
                lastSongPosition = position;
                var xx = Math.round(0.2 + seconds2Duration384(position, zapp.selectedTempo) / 48);
                if (xx < 0)
                    xx = 0;
                if (xx > 127)
                    xx = 127;
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
function reColorCell(num, color) {
    var e = document.getElementById('chord' + num);
    if (e) {
        e.style.color = color;
    }
}
function rockDiceTempoSliderChanged() {
    //zapp.storeChangedStateAndCheck();
    zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
    //console.log('rockDiceTempoSliderChanged');
    uiCannyTask(function () {
        var e = document.getElementById('tempoSlider');
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
    uiCannyTask(function () {
        var e = document.getElementById('drumVolumeSlider');
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
    uiCannyTask(function () {
        var e = document.getElementById('bassVolumeSlider');
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
    uiCannyTask(function () {
        var e = document.getElementById('leadVolumeSlider');
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
    uiCannyTask(function () {
        var e = document.getElementById('padVolumeSlider');
        if (e) {
            zapp.setPadVolume(parseInt(e.value));
            rockDiceRestartOrStart();
        }
    });
}
function rockDicePromptChord(position8) {
    console.log('rockDicePromptChord', position8);
    var chordChaneChord = zapp.harmonizer.findProgressionPart({
        count: position8,
        division: 8
    }, zapp.schedule.harmony.progression);
    if (chordChaneChord) {
        //let chordChaneName = chordChaneChord.chord;
        var chordPlay = zapp.harmonizer.checkProgressionPoint({
            count: position8,
            division: 8
        }, zapp.schedule.harmony.progression);
        var chordPlayName = '-';
        if (chordPlay != null) {
            chordPlayName = chordPlay.chord;
        }
        var name_1 = prompt('', chordPlayName);
        if (name_1 != null) {
            //zapp.storeChangedStateAndCheck();
            zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
            //console.log('clickChordName', name, barNum, note8);
            var newChord = zapp.parseChordName(name_1); //.setProgressionChord(barNum*8+note8,name);
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
    var nn = Math.floor(Math.random() * zapp.drumsSchedules.length);
    //console.log('rockDiceClickDrumsButton', nn, zapp.drumsSchedules.length);
    uiCannyTask(function () {
        if (zapp.storeChangedStateNoStartAd()) {
            zapp.setDrumsVolume(111);
            zapp.setDrumPattern(nn, function () {
                rockDiceRestartOrStart();
            });
        }
    });
}
function rockDiceRollDrumsButton(nn) {
    //console.log('rockDiceRollDrumsButton', nn);
    uiCannyTask(function () {
        if (zapp.storeChangedStateNoStartAd()) {
            zapp.setDrumPattern(nn, function () {
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
    var nn = Math.floor(Math.random() * zapp.bassSchedules.length);
    //console.log('rockDiceClickBassButton', nn, zapp.bassSchedules.length);
    uiCannyTask(function () {
        if (zapp.storeChangedStateNoStartAd()) {
            zapp.setBassVolume(99);
            zapp.setBassPattern(nn, function () {
                rockDiceRestartOrStart();
            });
        }
    });
}
function rockDiceRollBassButton(nn) {
    //console.log('rockDiceRollBassButton', nn);
    uiCannyTask(function () {
        if (zapp.storeChangedStateNoStartAd()) {
            zapp.setBassPattern(nn, function () {
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
    var nn = Math.floor(Math.random() * zapp.leadSchedules.length);
    //console.log('rockDiceClickLeadButton', nn, zapp.leadSchedules.length);
    uiCannyTask(function () {
        if (zapp.storeChangedStateNoStartAd()) {
            zapp.setLeadVolume(66);
            zapp.setLeadPattern(nn, function () {
                rockDiceRestartOrStart();
            });
        }
    });
}
function rockDiceRollLeadButton(nn) {
    //console.log('rockDiceRollLeadButton', nn);
    uiCannyTask(function () {
        if (zapp.storeChangedStateNoStartAd()) {
            zapp.setLeadPattern(nn, function () {
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
    var nn = Math.floor(Math.random() * zapp.padSchedules.length);
    //console.log('rockDiceClickPadButton', nn, zapp.padSchedules.length);
    uiCannyTask(function () {
        if (zapp.storeChangedStateNoStartAd()) {
            zapp.setPadVolume(77);
            zapp.setPadPattern(nn, function () {
                rockDiceRestartOrStart();
            });
        }
    });
}
function rockDiceRollPadButton(nn) {
    //console.log('rockDiceRollPadButton', nn);
    uiCannyTask(function () {
        if (zapp.storeChangedStateNoStartAd()) {
            zapp.setPadPattern(nn, function () {
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
function setDivStyleDisplay(id, style) {
    var e = document.getElementById(id);
    if (e) {
        e.style.display = style;
        e.scrollTop = 0;
    }
}
function calcChordDown(fullName) {
    var parts = fullName.split("/");
    //console.log('calcChordDown',parts,parts.length);
    if (parts.length == 2) {
        //console.log('split',parts[0] , parts[1],calcPartDown(parts[0] + '/' + parts[1]));
        return calcPartDown(parts[0]) + '/' + calcPartDown(parts[1]);
    }
    else {
        return calcPartDown(fullName);
    }
}
function calcPartDown(fullName) {
    var chordStrip = fullName.substring(0, 1);
    var secondSign = fullName.substring(1, 2);
    if (secondSign == '#' || secondSign == 'b') {
        chordStrip = chordStrip + secondSign;
    }
    var remains = fullName.substring(chordStrip.length, fullName.length);
    if (chordStrip == 'Ab')
        return 'G' + remains;
    if (chordStrip == 'A')
        return 'G#' + remains;
    if (chordStrip == 'A#')
        return 'A' + remains;
    if (chordStrip == 'Bb')
        return 'A' + remains;
    if (chordStrip == 'B')
        return 'A#' + remains;
    if (chordStrip == 'C')
        return 'B' + remains;
    if (chordStrip == 'C#')
        return 'C' + remains;
    if (chordStrip == 'Db')
        return 'C' + remains;
    if (chordStrip == 'D')
        return 'C#' + remains;
    if (chordStrip == 'D#')
        return 'D' + remains;
    if (chordStrip == 'Eb')
        return 'D' + remains;
    if (chordStrip == 'E')
        return 'D#' + remains;
    if (chordStrip == 'F')
        return 'E' + remains;
    if (chordStrip == 'F#')
        return 'F' + remains;
    if (chordStrip == 'Gb')
        return 'F' + remains;
    if (chordStrip == 'G')
        return 'F#' + remains;
    if (chordStrip == 'G#')
        return 'G' + remains;
    return fullName;
}
function calcChordUp(fullName) {
    var parts = fullName.split("/");
    if (parts.length == 2) {
        return calcPartUp(parts[0]) + '/' + calcPartUp(parts[1]);
    }
    else {
        return calcPartUp(fullName);
    }
}
function calcPartUp(fullName) {
    var chordStrip = fullName.substring(0, 1);
    var secondSign = fullName.substring(1, 2);
    if (secondSign == '#' || secondSign == 'b') {
        chordStrip = chordStrip + secondSign;
    }
    var remains = fullName.substring(chordStrip.length, fullName.length);
    if (chordStrip == 'Ab')
        return 'A' + remains;
    if (chordStrip == 'A')
        return 'A#' + remains;
    if (chordStrip == 'A#')
        return 'B' + remains;
    if (chordStrip == 'Bb')
        return 'B' + remains;
    if (chordStrip == 'B')
        return 'C' + remains;
    if (chordStrip == 'C')
        return 'C#' + remains;
    if (chordStrip == 'C#')
        return 'D' + remains;
    if (chordStrip == 'Db')
        return 'D' + remains;
    if (chordStrip == 'D')
        return 'D#' + remains;
    if (chordStrip == 'D#')
        return 'E' + remains;
    if (chordStrip == 'Eb')
        return 'E' + remains;
    if (chordStrip == 'E')
        return 'F' + remains;
    if (chordStrip == 'F')
        return 'F#' + remains;
    if (chordStrip == 'F#')
        return 'G' + remains;
    if (chordStrip == 'Gb')
        return 'G' + remains;
    if (chordStrip == 'G')
        return 'G#' + remains;
    if (chordStrip == 'G#')
        return 'A' + remains;
    return fullName;
}
function rockDiceClickProgPrompt() {
    //console.log('rockDiceClickProgPrompt');
    zapp.promptProgression();
    rockDiceRestartOrStart();
}
function rockDiceClickProgUp() {
    zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
    var progchords = zapp.schedule.harmony.progression;
    for (var i = 0; i < progchords.length; i++) {
        progchords[i].chord = calcChordUp(progchords[i].chord);
    }
    zapp.harmonizer.repeatAllVoices(zapp.schedule, { count: 16, division: 1 });
    zapp.setAllTracks(function () {
        zapp.ticker.restart();
    });
    rockDiceRestartOrStart();
}
function rockDiceClickProgDown() {
    zapp.pushUndoState(zapp.createCurrentState(), zapp.undoList);
    var progchords = zapp.schedule.harmony.progression;
    for (var i = 0; i < progchords.length; i++) {
        progchords[i].chord = calcChordDown(progchords[i].chord);
    }
    zapp.harmonizer.repeatAllVoices(zapp.schedule, { count: 16, division: 1 });
    zapp.setAllTracks(function () {
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
var uiWaitForTask = 0;
function uiCannyTask(task) {
    var currentWaitForTask = Math.random();
    uiWaitForTask = currentWaitForTask;
    setTimeout(function () {
        if (currentWaitForTask == uiWaitForTask) {
            task();
        }
    }, 123);
}
var RoundedHandler = /** @class */ (function () {
    function RoundedHandler(count, colorcomp
    //, colorcalc: (v: number) => string
    , maincomp, rocomp, onclick, onchange, endInteraction) {
        this.value = 0;
        this.calculatedValue = 0;
        this.maxValue = 0;
        this.startY = 0;
        this.delta = 0;
        this.startValue = 0;
        this.watchMouse = false;
        this.negative = false;
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
    RoundedHandler.prototype.setColor = function () {
        if (this.colorcomp) {
            if (this.negative) {
                var rgba = 'rgba(50,50,50,0.99)';
                this.colorcomp.style.stroke = rgba;
            }
            else {
                var part = this.value / this.maxValue;
                var r = Math.floor(255 * part); //Math.floor(255 * Math.cos(part * Math.PI / 2));
                var g = Math.floor(255 - 255 * part); //Math.floor(255 * Math.sin(part * Math.PI / 2));
                var b = Math.floor(2 * Math.abs(127 - 254 * part));
                //console.log(part, r, g, b);
                var rgba = 'rgba(' + r + ',' + g + ',' + b + ',1)';
                this.colorcomp.style.stroke = rgba;
            }
        }
    };
    RoundedHandler.prototype.setRoundedValue = function (newValue, fire) {
        var diff = (newValue != this.value);
        this.negative = (newValue < 0);
        //console.log('setRoundedValue',newValue,this.negative);
        //var old = this.value;
        this.value = newValue;
        if (this.value < 0)
            this.value = 0;
        if (this.value > this.maxValue)
            this.value = this.maxValue;
        if (diff) {
            if (this.rotation) {
                var rova = 270 * this.value / this.maxValue;
                this.rotation.style.transform = "rotate(" + rova + "deg)";
                this.setColor();
            }
            if (fire)
                this.change(this.value);
        }
    };
    RoundedHandler.prototype.cmousedown = function (mouseEvent) {
        mouseEvent.preventDefault();
        this.startY = mouseEvent.clientY;
        this.startValue = this.value;
        this.delta = 0;
        this.watchMouse = true;
    };
    RoundedHandler.prototype.onMouseUp = function (mouseEvent) {
        if (this.watchMouse) {
            this.watchMouse = false;
            mouseEvent.preventDefault();
            if (this.delta < 10) {
                this.click();
            }
            this.interEnd();
        }
    };
    ;
    RoundedHandler.prototype.onMouseMove = function (mouseEvent) {
        if (this.watchMouse) {
            mouseEvent.preventDefault();
            var dY = mouseEvent.clientY - this.startY;
            this.delta = Math.abs(dY);
            var newVal = Math.floor(this.startValue - dY / (1000 / this.maxValue));
            if (newVal < 0)
                newVal = 0;
            if (newVal > this.maxValue)
                newVal = this.maxValue;
            this.setRoundedValue(newVal, true);
        }
    };
    ;
    RoundedHandler.prototype.ctouchstart = function (touchEvent) {
        touchEvent.preventDefault();
        this.startY = touchEvent.touches[0].clientY;
        this.startValue = this.value;
        this.delta = 0;
    };
    RoundedHandler.prototype.ctouchmove = function (touchEvent) {
        touchEvent.preventDefault();
        var dY = touchEvent.touches[0].clientY - this.startY;
        this.delta = Math.abs(dY);
        var newVal = Math.floor(this.startValue - dY / (1000 / this.maxValue));
        if (newVal < 0)
            newVal = 0;
        if (newVal > this.maxValue)
            newVal = this.maxValue;
        this.setRoundedValue(newVal, true);
    };
    RoundedHandler.prototype.ctouchend = function (touchEvent) {
        touchEvent.preventDefault();
        if (this.delta < 10) {
            this.click();
        }
        this.interEnd();
    };
    return RoundedHandler;
}());
var RockDiceUI = /** @class */ (function () {
    function RockDiceUI() {
    }
    RockDiceUI.prototype.connectRoundButtons = function (zapp) {
        var me = this;
        zapp.drumControl = new RoundedHandler(zapp.drumsSchedules.length, document.getElementById('drumColor'), document.getElementById('svgdrums'), document.getElementById('roundDrums'), rockDiceClickDrumsButton, rockDiceRollDrumsButton, rockDiceReleaseDrumsButton);
        zapp.bassControl = new RoundedHandler(zapp.bassSchedules.length, document.getElementById('bassColor'), document.getElementById('svgbass'), document.getElementById('roundBass'), rockDiceClickBassButton, rockDiceRollBassButton, rockDiceReleaseBassButton);
        zapp.leadControl = new RoundedHandler(zapp.leadSchedules.length, document.getElementById('leadColor'), document.getElementById('svglead'), document.getElementById('roundLead'), rockDiceClickLeadButton, rockDiceRollLeadButton, rockDiceReleaseLeadButton);
        zapp.padControl = new RoundedHandler(zapp.padSchedules.length, document.getElementById('padColor'), document.getElementById('svgpad'), document.getElementById('roundPad'), rockDiceClickPadButton, rockDiceRollPadButton, rockDiceReleasePadButton);
    };
    return RockDiceUI;
}());
var rockDiceUI = new RockDiceUI();
var RangedAudioParam120 = /** @class */ (function () {
    function RangedAudioParam120(base, min, max) {
        this.baseParam = base;
        this.minValue = min;
        this.maxValue = max;
    }
    RangedAudioParam120.prototype.recalulate = function (value) {
        if (value < 0)
            console.log('wrong 1-119', value);
        if (value < 0)
            value = 0;
        if (value > 119)
            value = 119;
        var ratio = (this.maxValue - this.minValue) / 119;
        var nn = this.minValue + value * ratio;
        //console.log('recalulate', value, 'min', this.minValue, 'max', this.maxValue, 'result', nn);
        return nn;
    };
    RangedAudioParam120.prototype.cancelScheduledValues = function (cancelTime) {
        this.baseParam.cancelScheduledValues(cancelTime);
    };
    RangedAudioParam120.prototype.linearRampToValueAtTime = function (value, endTime) {
        this.baseParam.linearRampToValueAtTime(this.recalulate(value), endTime);
    };
    RangedAudioParam120.prototype.setValueAtTime = function (value, startTime) {
        this.baseParam.setValueAtTime(this.recalulate(value), startTime);
    };
    return RangedAudioParam120;
}());
var ZvoogPluginLock = /** @class */ (function () {
    function ZvoogPluginLock() {
    }
    ZvoogPluginLock.prototype.lock = function () {
        this.lockedState = true;
    };
    ZvoogPluginLock.prototype.unlock = function () {
        this.lockedState = false;
    };
    ZvoogPluginLock.prototype.locked = function () {
        return this.lockedState;
    };
    return ZvoogPluginLock;
}());
var ZvoogFilterSourceEmpty = /** @class */ (function () {
    function ZvoogFilterSourceEmpty() {
        //values: ZvoogValue[];
        //ZvoogPlugin
        this.lockedState = new ZvoogPluginLock();
    }
    ZvoogFilterSourceEmpty.prototype.setData = function (data) {
    };
    ZvoogFilterSourceEmpty.prototype.state = function () {
        return this.lockedState;
    };
    ZvoogFilterSourceEmpty.prototype.prepare = function (audioContext) {
        if (this.base) {
        }
        else {
            this.base = audioContext.createGain();
        }
        this.params = [];
        //this.values = [];
    };
    ZvoogFilterSourceEmpty.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogFilterSourceEmpty.prototype.getParams = function () {
        return this.params;
    };
    ZvoogFilterSourceEmpty.prototype.busy = function () {
        return 0;
    };
    /*id(): string {
        return 'empty';
    }*/
    //getValues(): ZvoogValue[] {
    //	return this.values;
    //}
    //ZvoogPlugin
    ZvoogFilterSourceEmpty.prototype.cancelSchedule = function () {
        //
    };
    ZvoogFilterSourceEmpty.prototype.addSchedule = function (when, tempo, chord, variation) {
        //
    };
    //ZvoogEffect
    ZvoogFilterSourceEmpty.prototype.getInput = function () {
        return this.base;
    };
    return ZvoogFilterSourceEmpty;
}());
var cachedFilterSourceEmptyPlugins = [];
function takeZvoogFilterSourceEmpty() {
    for (var i = 0; i < cachedFilterSourceEmptyPlugins.length; i++) {
        if (!cachedFilterSourceEmptyPlugins[i].state().locked()) {
            cachedFilterSourceEmptyPlugins[i].state().lock();
            return cachedFilterSourceEmptyPlugins[i];
        }
    }
    var plugin = new ZvoogFilterSourceEmpty();
    plugin.state().lock();
    cachedFilterSourceEmptyPlugins.push(plugin);
    return plugin;
}
var cachedWAFEchoPlugins = [];
function takeWAFEcho() {
    for (var i = 0; i < cachedWAFEchoPlugins.length; i++) {
        if (!cachedWAFEchoPlugins[i].state().locked()) {
            cachedWAFEchoPlugins[i].state().lock();
            return cachedWAFEchoPlugins[i];
        }
    }
    var plugin = new WAFEcho();
    plugin.state().lock();
    cachedWAFEchoPlugins.push(plugin);
    return plugin;
}
var cachedWAFEqualizerPlugins = [];
function takeWAFEqualizer() {
    for (var i = 0; i < cachedWAFEqualizerPlugins.length; i++) {
        if (!cachedWAFEqualizerPlugins[i].state().locked()) {
            cachedWAFEqualizerPlugins[i].state().lock();
            return cachedWAFEqualizerPlugins[i];
        }
    }
    var plugin = new WAFEqualizer();
    plugin.state().lock();
    cachedWAFEqualizerPlugins.push(plugin);
    return plugin;
}
var cachedZvoogFxGainPlugins = [];
function takeZvoogFxGain() {
    for (var i = 0; i < cachedZvoogFxGainPlugins.length; i++) {
        if (!cachedZvoogFxGainPlugins[i].state().locked()) {
            cachedZvoogFxGainPlugins[i].state().lock();
            return cachedZvoogFxGainPlugins[i];
        }
    }
    var plugin = new ZvoogFxGain();
    plugin.state().lock();
    cachedZvoogFxGainPlugins.push(plugin);
    return plugin;
}
var cachedAudioFileSourcePlugins = [];
function takeAudioFileSource() {
    for (var i = 0; i < cachedAudioFileSourcePlugins.length; i++) {
        if (!cachedAudioFileSourcePlugins[i].state().locked()) {
            cachedAudioFileSourcePlugins[i].state().lock();
            return cachedAudioFileSourcePlugins[i];
        }
    }
    var plugin = new AudioFileSource(); //arr);
    plugin.state().lock();
    cachedAudioFileSourcePlugins.push(plugin);
    return plugin;
}
var cachedWAFInsSourcePlugins = [];
function takeWAFInsSource() {
    for (var i = 0; i < cachedWAFInsSourcePlugins.length; i++) {
        if (!cachedWAFInsSourcePlugins[i].state().locked()) {
            cachedWAFInsSourcePlugins[i].state().lock();
            return cachedWAFInsSourcePlugins[i];
        }
    }
    var plugin = new WAFInsSource(); //parseInt(data));
    plugin.state().lock();
    cachedWAFInsSourcePlugins.push(plugin);
    return plugin;
}
var cachedWAFPercSourcePlugins = [];
function takeWAFPercSource() {
    for (var i = 0; i < cachedWAFPercSourcePlugins.length; i++) {
        if (!cachedWAFPercSourcePlugins[i].state().locked()) {
            cachedWAFPercSourcePlugins[i].state().lock();
            return cachedWAFPercSourcePlugins[i];
        }
    }
    var plugin = new WAFPercSource(); //parseInt(data));
    plugin.state().lock();
    cachedWAFPercSourcePlugins.push(plugin);
    return plugin;
}
var cachedZvoogSineSourcePlugins = [];
function takeZvoogSineSource() {
    for (var i = 0; i < cachedZvoogSineSourcePlugins.length; i++) {
        if (!cachedZvoogSineSourcePlugins[i].state().locked()) {
            cachedZvoogSineSourcePlugins[i].state().lock();
            return cachedZvoogSineSourcePlugins[i];
        }
    }
    var plugin = new ZvoogSineSource();
    plugin.state().lock();
    cachedZvoogSineSourcePlugins.push(plugin);
    return plugin;
}
function createPluginEffect(id) {
    //console.log('createPluginEffect', id, cachedZvoogFxGainPlugins.length, cachedWAFEqualizerPlugins.length);
    if (id == 'echo')
        return takeWAFEcho(); //new WAFEcho();
    if (id == 'equalizer')
        return takeWAFEqualizer(); //new WAFEqualizer();
    if (id == 'gain')
        return takeZvoogFxGain(); //new ZvoogFxGain();
    //console.log('empty plugin effect for', id);
    //return new ZvoogFilterSourceEmpty();
    return takeZvoogFilterSourceEmpty();
}
function createPluginSource(id) {
    //console.log('createPluginSource', id, cachedWAFInsSourcePlugins.length, cachedWAFPercSourcePlugins.length);
    if (id == 'audio') {
        //var t = [0, 1, 2];
        //var arr: Uint8Array;
        //arr = Uint8Array.from(t);
        return takeAudioFileSource(); //new AudioFileSource(arr);
    }
    if (id == 'wafinstrument')
        return takeWAFInsSource(); //new WAFInsSource(parseInt(data));
    if (id == 'wafdrum')
        return takeWAFPercSource(); //new WAFPercSource(parseInt(data));
    if (id == 'sine')
        return takeZvoogSineSource(); //new ZvoogSineSource();
    //console.log('empty plugin source for', id);
    //return new ZvoogFilterSourceEmpty();
    return takeZvoogFilterSourceEmpty();
}
var ZvoogHarmonizer = /** @class */ (function () {
    function ZvoogHarmonizer() {
        this.drumTrackNum = 0;
        this.bassTrackNum = 1;
        this.leadTrackNum = 2;
        this.padTrackNum = 3;
        this.pitchC = 0;
        this.pitchCs = 1;
        this.pitchDb = 1;
        this.pitchD = 2;
        this.pitchDs = 3;
        this.pitchEb = 2;
        this.pitchE = 4;
        this.pitchF = 5;
        this.pitchFs = 6;
        this.pitchGb = 6;
        this.pitchG = 7;
        this.pitchGs = 8;
        this.pitchAb = 8;
        this.pitchA = 9;
        this.pitchAs = 10;
        this.pitchBb = 10;
        this.pitchB = 11;
        this.O12 = 12;
        this.S6 = this.O12 * 4 + this.pitchE;
        this.S5 = this.O12 * 4 + this.pitchA;
        this.S4 = this.O12 * 5 + this.pitchD;
        this.S3 = this.O12 * 5 + this.pitchG;
        this.S2 = this.O12 * 5 + this.pitchB;
        this.S1 = this.O12 * 6 + this.pitchE;
        this.guitarStrings6 = [this.S6, this.S5, this.S4, this.S3, this.S2, this.S1];
    }
    ZvoogHarmonizer.prototype.findScaleMode = function (name) {
        for (var i = 0; i < scaleModes.length; i++) {
            if (scaleModes[i].name == name) {
                return scaleModes[i];
            }
        }
        console.log('no', name);
        return scaleModes[0];
    };
    ZvoogHarmonizer.prototype.createDrumsTrack = function () {
        return {
            title: '',
            voices: [],
            effects: []
        };
    };
    ZvoogHarmonizer.prototype.createBassTrack = function () {
        return {
            title: '',
            voices: [],
            effects: []
        };
    };
    ZvoogHarmonizer.prototype.createLeadTrack = function () {
        return {
            title: '',
            voices: [],
            effects: []
        };
    };
    ZvoogHarmonizer.prototype.createPadTrack = function () {
        return {
            title: '',
            voices: [],
            effects: []
        };
    };
    ZvoogHarmonizer.prototype.createEmptyBaseSchedule = function () {
        console.log('createEmptyBaseSchedule');
        var schedule = {
            title: 'Base 4 tracks',
            tracks: [
                { title: 'Drums', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 111 }] }] }] },
                { title: 'Bass', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 99 }] }] }] },
                { title: 'Lead', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 66 }] }] }] },
                { title: 'Pad', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 77 }] }] }] }
            ],
            effects: [
                {
                    pluginEffect: null, kind: "echo", initial: "", parameters: [
                        { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.22 * 119 }] } //reverberator';
                        ,
                        { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.55 * 119 }] } //threshold';
                        ,
                        { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.99 * 119 }] } //knee';
                        ,
                        { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.66 * 119 }] } //ratio';
                        ,
                        { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.01 * 119 }] } //attack';
                        ,
                        { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.25 * 119 }] } //release';
                        ,
                        { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.99 * 119 }] } //compression';
                    ]
                },
                {
                    pluginEffect: null, kind: "gain", initial: "", parameters: [
                        { points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }
                    ]
                }
            ],
            measures: [
                { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 },
                { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 },
                { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 },
                { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 },
                { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 },
                { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 },
                { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 },
                { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
            ],
            harmony: {
                tone: 'C', mode: 'Ionian',
                progression: [{ duration: { count: 16, division: 1 }, chord: 'C' }]
            }
        };
        return schedule;
    };
    ZvoogHarmonizer.prototype.checkProgressionPoint = function (when, progression) {
        var position = { count: 0, division: 1 };
        for (var i = 0; i < progression.length; i++) {
            var p = progression[i];
            if (meterMore(position, when) == 0) {
                return p;
            }
            position = plusMeter(position, p.duration);
        }
        return null;
    };
    ZvoogHarmonizer.prototype.findProgressionPart = function (when, progression) {
        var position = { count: 0, division: 1 };
        for (var i = 0; i < progression.length; i++) {
            var p = progression[i];
            position = plusMeter(position, p.duration);
            if (meterMore(position, when) > 0) {
                return p;
            }
        }
        //console.trace();
        //console.log('not found', when.count, when.division, progression);
        return null;
    };
    ZvoogHarmonizer.prototype.findOrCreateChord = function (voice, trackMeasures, chordStartPosition, variation) {
        var measurePosition = { count: 0, division: 1 };
        for (var i = 0; i < trackMeasures.length; i++) {
            var nextMeasurePosition = plusMeter(measurePosition, trackMeasures[i].meter);
            if (meterMore(chordStartPosition, measurePosition) >= 0
                && meterMore(chordStartPosition, nextMeasurePosition) < 0) {
                while (voice.measureChords.length < i + 1) {
                    voice.measureChords.push({ chords: [] });
                }
                for (var ch = 0; ch < voice.measureChords[i].chords.length; ch++) {
                    var chord = voice.measureChords[i].chords[ch];
                    var pos = plusMeter(measurePosition, chord.when);
                    if (meterMore(pos, chordStartPosition) == 0) {
                        return chord;
                    }
                }
                var newpos = minusMeter(chordStartPosition, measurePosition);
                var newchord = {
                    when: newpos,
                    envelopes: [],
                    variation: variation
                };
                voice.measureChords[i].chords.push(newchord);
                return newchord;
            }
            measurePosition = nextMeasurePosition;
        }
        return null;
    };
    ZvoogHarmonizer.prototype.splitEnvelope = function (voice, trackMeasures, chordStartPosition, chordSplitPosition, envelope, variation, cutNotSplit) {
        var curEnvelopePos = { count: chordStartPosition.count, division: chordStartPosition.division };
        for (var pp = 0; pp < envelope.pitches.length; pp++) {
            var nextEnvelopePos = plusMeter(curEnvelopePos, envelope.pitches[pp].duration);
            var diffPos = minusMeter(nextEnvelopePos, chordSplitPosition);
            if (diffPos.count > 0) {
                var part1 = simplifyMeter(minusMeter(chordSplitPosition, curEnvelopePos));
                var part2 = simplifyMeter(minusMeter(envelope.pitches[pp].duration, part1));
                envelope.pitches[pp].duration = part1;
                if (!cutNotSplit) {
                    var addchord = this.findOrCreateChord(voice, trackMeasures, plusMeter(curEnvelopePos, part1), variation);
                    if (addchord) {
                        var newen = { pitches: [{ duration: part2, pitch: envelope.pitches[pp].pitch }] };
                        addchord.envelopes.push(newen);
                        for (var kk = pp + 1; kk < envelope.pitches.length; kk++) {
                            newen.pitches.push({ duration: envelope.pitches[kk].duration, pitch: envelope.pitches[kk].pitch });
                        }
                    }
                }
                envelope.pitches.length = pp + 1;
                break;
            }
            curEnvelopePos = nextEnvelopePos;
        }
    };
    ZvoogHarmonizer.prototype.splitTrackNotesByProgression = function (wholeTrack, trackMeasures, toProg, cutNotSplit) {
        var progPosition = { count: 0, division: 1 };
        for (var pp = 0; pp < toProg.progression.length; pp++) {
            var nextProgPosition = plusMeter(progPosition, toProg.progression[pp].duration);
            for (var vv = 0; vv < wholeTrack.voices.length; vv++) {
                var voice = wholeTrack.voices[vv];
                var measurePosition = { count: 0, division: 1 };
                for (var i = 0; i < trackMeasures.length; i++) {
                    if (voice.measureChords) {
                        var measureChords = voice.measureChords;
                        if (measureChords.length > i && (measureChords[i])) {
                            var measureChord = measureChords[i];
                            for (var k = 0; k < measureChord.chords.length; k++) {
                                var chord = measureChord.chords[k];
                                var chordPosition = plusMeter(measurePosition, chord.when);
                                for (var f = 0; f < chord.envelopes.length; f++) {
                                    var envelope = chord.envelopes[f];
                                    var envelopeDuration = calculateEnvelopeDuration(envelope);
                                    var envelopeEnd = plusMeter(chordPosition, envelopeDuration);
                                    if (meterMore(chordPosition, progPosition) >= 0
                                        && meterMore(chordPosition, nextProgPosition) < 0
                                        && meterMore(envelopeEnd, nextProgPosition) > 0) {
                                        this.splitEnvelope(voice, trackMeasures, chordPosition, nextProgPosition, envelope, chord.variation, cutNotSplit);
                                    }
                                }
                            }
                        }
                    }
                    measurePosition = plusMeter(measurePosition, trackMeasures[i].meter);
                }
            }
            progPosition = nextProgPosition;
        }
    };
    ZvoogHarmonizer.prototype.createMergedMode = function (modeTone, modeIntervals, choosenChord) {
        var merged = JSON.parse(JSON.stringify(modeIntervals));
        var localMode = this.stepsByName(choosenChord);
        if (localMode) {
            var stepDiff = this.chordStepDifference(modeTone, choosenChord);
            var localToneBase = modeIntervals.steps[stepDiff];
            var halfBase = this.chordAbsoluteHalftones(modeTone);
            var halfTarget = this.chordAbsoluteHalftones(choosenChord);
            var halfToneAux = halfTarget - ((halfBase + localToneBase) % 12);
            //console.log(halfBase, modeTone, '+', localToneBase, '=', choosenChord, halfTarget, ':', halfToneAux);
            //if(this.chordSymbol(envelope.pitches[p].pitch % 12).substr(1,1)=='#'){
            //}
            for (var i = 0; i < localMode.pitches.length; i++) {
                var mergedIdx = (localMode.pitches[i].step + stepDiff) % 7;
                var mergedHalftones = (merged.steps[stepDiff]
                    + localMode.pitches[i].halftone + halfToneAux) % 12;
                //console.log(mergedIdx, ':', merged.steps[mergedIdx], '>', mergedHalftones
                //	, localMode.pitches, stepDiff,choosenChord
                //	,'aux',halfToneAux);
                merged.steps[mergedIdx] = mergedHalftones;
            }
            merged.steps[stepDiff] = (120 + halfTarget - halfBase) % 12;
            merged.steps[7] = merged.steps[0];
        }
        return merged;
    };
    ZvoogHarmonizer.prototype.morphVoice = function (voice, trackMeasures, fromProg, toProg, trackIsBass
    //, isdebug: boolean
    ) {
        this.repeatProgression(fromProg, {
            count: 16,
            division: 1
        });
        //if (isdebug) {
        //console.log('morphVoice', voice.title, fromProg, toProg, trackIsBass);
        //}
        var fromIntervalMode = this.findScaleMode(fromProg.mode);
        var toIntervalMode = this.findScaleMode(toProg.mode);
        //console.log('toIntervalMode', toIntervalMode);
        //console.log('toProg', toProg);
        //console.log('tone', toProg.tone, 'halftones', this.chordAbsoluteHalftones(toProg.tone));
        var position = { count: 0, division: 1 };
        for (var ii = 0; ii < trackMeasures.length; ii++) {
            if (voice.measureChords) {
                var measureChords = voice.measureChords;
                if (measureChords.length > ii && (measureChords[ii])) {
                    var measureChord = measureChords[ii];
                    for (var kk = 0; kk < measureChord.chords.length; kk++) {
                        var chord = measureChord.chords[kk];
                        var chordPosition = plusMeter(position, chord.when);
                        var fromChord = this.findProgressionPart(chordPosition, fromProg.progression);
                        if (fromChord) {
                            var toChord = this.findProgressionPart(chordPosition, toProg.progression);
                            if (toChord) {
                                var fromChoosenChord = this.extractBassOrBase(fromChord.chord, trackIsBass);
                                //console.log(chordPosition.count, chordPosition.division, toChord.chord,toProg.progression);
                                var toSelChord = this.extractBassOrBase(toChord.chord, trackIsBass);
                                var fromMergedMode = this.createMergedMode(fromProg.tone, fromIntervalMode, fromChoosenChord);
                                var toMergedMode = this.createMergedMode(toProg.tone, toIntervalMode, toSelChord);
                                var progSteps = '';
                                var mergedSteps = '';
                                for (var ss = 0; ss < 7; ss++) {
                                    progSteps = progSteps
                                        + '/' + this.chordSymbol((this.chordAbsoluteHalftones(toProg.tone) + toIntervalMode.steps[ss]) % 12);
                                    mergedSteps = mergedSteps
                                        + '/' + this.chordSymbol((this.chordAbsoluteHalftones(toProg.tone) + toMergedMode.steps[ss]) % 12);
                                }
                                for (var f = 0; f < chord.envelopes.length; f++) {
                                    var envelope = chord.envelopes[f];
                                    for (var p = 0; p < envelope.pitches.length; p++) {
                                        var curPitch = envelope.pitches[p].pitch;
                                        envelope.pitches[p].pitch = this.transposeNote(curPitch, fromProg.tone, fromMergedMode, fromChoosenChord, toProg.tone, toMergedMode, toSelChord);
                                    }
                                }
                            }
                            else {
                                console.log('toSelChord not found', chordPosition.count, chordPosition.division, toProg.progression);
                            }
                        }
                    }
                }
            }
            position = plusMeter(position, trackMeasures[ii].meter);
        }
    };
    ZvoogHarmonizer.prototype.morphTrack = function (wholeTrack, trackMeasures, fromProg, toProg, trackIsBass
    //, isdebug: boolean
    ) {
        for (var vv = 0; vv < wholeTrack.voices.length; vv++) {
            var voice = wholeTrack.voices[vv];
            this.morphVoice(voice, trackMeasures, fromProg, toProg, trackIsBass
            //, isdebug
            );
        }
    };
    ZvoogHarmonizer.prototype.morphSchedule = function (schedule, newProg
    //, isdebug: boolean
    ) {
        //console.log('morphSchedule', schedule);
        this.repeatProgression(schedule.harmony, {
            count: 16,
            division: 1
        });
        for (var t = 1; t < schedule.tracks.length; t++) {
            var track = schedule.tracks[t];
            if (track.voices.length > 0) {
                this.splitTrackNotesByProgression(track, schedule.measures, newProg, false);
                this.morphTrack(track, schedule.measures, schedule.harmony, newProg, t == this.bassTrackNum
                //, isdebug
                );
            }
        }
    };
    ZvoogHarmonizer.prototype.transposeNote = function (pitch, fromRootTone, fromIntervalMode, fromChordName, toRootTone, toIntervalMode, toChordName) {
        var fromStep = 0;
        var fromShift = 0;
        var fromRootHalftones = this.chordAbsoluteHalftones(fromRootTone);
        var fromPitchHalftones = (pitch - fromRootHalftones) % 12;
        for (var i = 0; i < fromIntervalMode.steps.length - 1; i++) {
            if (fromPitchHalftones == fromIntervalMode.steps[i]) {
                fromStep = i;
                break;
            }
            else {
                if (fromPitchHalftones > fromIntervalMode.steps[i] && fromPitchHalftones < fromIntervalMode.steps[i + 1]) {
                    if (fromIntervalMode.flat) {
                        fromStep = i;
                        fromShift = 1;
                    }
                    else {
                        fromStep = i + 1;
                        fromShift = -1;
                    }
                    break;
                }
            }
        }
        var fromChordStep = this.chordStepDifference(fromRootTone, fromChordName);
        fromStep = this.roll7(fromStep - fromChordStep);
        var toChordStep = this.chordStepDifference(toRootTone, toChordName);
        var toStep = (fromStep + toChordStep) % 7;
        var toRootHalftones = this.chordAbsoluteHalftones(toRootTone);
        var resultPitch = toRootHalftones + toIntervalMode.steps[toStep];
        if (fromShift > 0) {
            if (toIntervalMode.steps[toStep] + 1 < toIntervalMode.steps[toStep + 1]) {
                resultPitch = resultPitch + 1;
            }
        }
        else {
            if (fromShift > 0) {
                var idx = toStep;
                if (toStep == 0)
                    idx = 7;
                if (toIntervalMode.steps[idx] - 1 > toIntervalMode.steps[idx - 1]) {
                    resultPitch = resultPitch - 1;
                }
            }
        }
        while (resultPitch < pitch)
            resultPitch = resultPitch + 12;
        if (Math.abs(resultPitch - pitch - 12) <= Math.abs(resultPitch - pitch))
            resultPitch = resultPitch - 12;
        //console.log(fromRootTone+this.chordSymbol(pitch), '>', toRootTone,this.chordSymbol(resultPitch));
        return resultPitch;
    };
    ZvoogHarmonizer.prototype.clearCloneSchedule = function (schedule) {
        var clone = JSON.parse(JSON.stringify(schedule));
        for (var i = 0; i < clone.effects.length; i++) {
            clone.effects[i].pluginEffect = null;
        }
        for (var t = 0; t < clone.tracks.length; t++) {
            for (var s = 0; s < clone.tracks[t].voices.length; s++) {
                clone.tracks[t].voices[s].source.pluginSource = null;
                for (var i = 0; i < clone.tracks[t].voices[s].effects.length; i++) {
                    clone.tracks[t].voices[s].effects[i].pluginEffect = null;
                }
            }
            for (var i = 0; i < clone.tracks[t].effects.length; i++) {
                clone.tracks[t].effects[i].pluginEffect = null;
            }
        }
        return clone;
    };
    ZvoogHarmonizer.prototype.clearCloneTrack = function (track) {
        var clone = JSON.parse(JSON.stringify(track));
        for (var s = 0; s < clone.voices.length; s++) {
            clone.voices[s].source.pluginSource = null;
            for (var i = 0; i < clone.voices[s].effects.length; i++) {
                clone.voices[s].effects[i].pluginEffect = null;
            }
        }
        for (var i = 0; i < clone.effects.length; i++) {
            clone.effects[i].pluginEffect = null;
        }
        return clone;
    };
    ZvoogHarmonizer.prototype.clearCloneVoice = function (voice) {
        var clone = JSON.parse(JSON.stringify(voice));
        clone.source.pluginSource = null;
        for (var i = 0; i < clone.effects.length; i++) {
            clone.effects[i].pluginEffect = null;
        }
        return clone;
    };
    ZvoogHarmonizer.prototype.fillVoiceByPattern = function (t, s, schedule) {
        var voice = schedule.tracks[t].voices[s];
        if (voice.strumPattern) {
            this.fillVoiceByStrumPattern(voice, voice.strumPattern, schedule.measures, schedule.harmony.progression);
        }
        else {
            if (voice.keyPattern) {
                this.fillVoiceByKeyPattern(voice, voice.keyPattern, schedule.measures, schedule.harmony.progression);
            }
            else {
                if (voice.stringPattern) {
                    this.fillVoiceByStringPattern(voice, voice.stringPattern, schedule.measures, schedule.harmony.progression);
                }
            }
        }
    };
    ZvoogHarmonizer.prototype.fillTrackVoicesByPatterns = function (t, schedule) {
        for (var s = 0; s < schedule.tracks[t].voices.length; s++) {
            this.fillVoiceByPattern(t, s, schedule);
        }
    };
    ZvoogHarmonizer.prototype.fillScheduleVoicesByPatterns = function (schedule) {
        console.log('fillScheduleVoicesByPatterns');
        for (var t = 0; t < schedule.tracks.length; t++) {
            this.fillTrackVoicesByPatterns(t, schedule);
        }
    };
    ZvoogHarmonizer.prototype.isNumber = function (value) {
        return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
    };
    ZvoogHarmonizer.prototype.fillVoiceByStringPattern = function (voice, pattern, measures, progression) {
        var strings = pattern.strings;
        var fullDur = scheduleDuration(measures);
        if (strings) {
            voice.measureChords = [];
            for (var i = 0; i < strings.length; i++) {
                var singleString = strings[i].trim();
                var voicePosition = { count: 0, division: 16 };
                while (meterMore(voicePosition, fullDur) < 0) {
                    var sym = this.extractSymbol(singleString, voicePosition.count);
                    if (sym == '*') {
                        var curChordMelody = this.findProgressionPart(voicePosition, progression);
                        if (curChordMelody) {
                            var curChordName = this.extractBassOrBase(curChordMelody.chord, false);
                            var pitch = this.findStringPitch(curChordName, 5 - i);
                            if (pitch >= 0) {
                                var addchord = this.findOrCreateChord(voice, measures, voicePosition, 0);
                                var len = 1;
                                var kk = voicePosition.count + 1;
                                while (this.extractSymbol(singleString, kk) == '-') {
                                    len++;
                                    kk++;
                                }
                                if (addchord) {
                                    addchord.envelopes.push({ pitches: [{ duration: { count: len, division: 16 }, pitch: pitch + 0 * 12 }] });
                                }
                            }
                        }
                    }
                    voicePosition.count++;
                }
            }
        }
    };
    ZvoogHarmonizer.prototype.extractSymbol = function (str, num) {
        var idx = num;
        while (idx >= str.length)
            idx = idx - str.length;
        var r = str.substr(idx, 1);
        return r;
    };
    ZvoogHarmonizer.prototype.fillVoiceByKeyPattern = function (voice, pattern, measures, progression) {
        var point = { count: 0, division: 1 };
        var strumIdx = 0;
        voice.measureChords = [];
        var lastOctave = 0;
        var lastChord = '';
        for (var i = 0; i < measures.length; i++) {
            var measure = measures[i];
            var chords = { chords: [] };
            voice.measureChords.push(chords);
            var nextpoint = plusMeter(point, measure.meter);
            var chordPos = { count: 0, division: 16 };
            while (meterMore(point, nextpoint) < 0) {
                var symbol = pattern.octaves.trim().substr(strumIdx, 1);
                var curChordMelody = this.findProgressionPart(point, progression);
                if (curChordMelody) {
                    var curChordName = this.extractBassOrBase(curChordMelody.chord, false);
                    var cuOctave = 0;
                    if (this.isNumber(symbol)) {
                        cuOctave = parseInt(symbol);
                        lastChord = curChordName;
                    }
                    else {
                        if (symbol == '-' && lastChord != curChordName) {
                            cuOctave = lastOctave;
                            lastChord = curChordName;
                        }
                    }
                    if (cuOctave) {
                        lastOctave = cuOctave;
                        var len = 1;
                        var lenPos = plusMeter(point, { count: 1, division: 16 });
                        var curLenMelody = this.findProgressionPart(lenPos, progression);
                        if (curLenMelody) {
                            var curLenChordName = this.extractBassOrBase(curLenMelody.chord, false);
                            while (this.extractSymbol(pattern.octaves.trim(), strumIdx + len) == '-'
                                && curLenChordName == lastChord
                            //&& meterMore(progressionDuration(progression),lenPos)
                            ) {
                                len++;
                                lenPos = plusMeter(lenPos, { count: 1, division: 16 });
                                curLenMelody = this.findProgressionPart(lenPos, progression);
                                if (curLenMelody) {
                                    curLenChordName = this.extractBassOrBase(curLenMelody.chord, false);
                                }
                                else {
                                    break;
                                }
                            }
                            var pitches = this.pianoKeysByName(lastChord);
                            var str = {
                                when: chordPos,
                                envelopes: [],
                                variation: 0
                            };
                            for (var ss = 0; ss < pitches.length; ss++) {
                                str.envelopes.push({
                                    pitches: [{
                                            duration: { count: len, division: 16 },
                                            pitch: pitches[ss] + cuOctave * 12
                                        }]
                                });
                            }
                            chords.chords.push(str);
                        }
                    }
                }
                point = simplifyMeter(plusMeter(point, { count: 1, division: 16 }));
                chordPos = simplifyMeter(plusMeter(chordPos, { count: 1, division: 16 }));
                strumIdx++;
                if (strumIdx >= pattern.octaves.trim().length) {
                    strumIdx = 0;
                }
            }
            point = nextpoint;
        }
    };
    ZvoogHarmonizer.prototype.fillVoiceByStrumPattern = function (voice, pattern, measures, progression) {
        var point = { count: 0, division: 1 };
        var strumIdx = 0;
        voice.measureChords = [];
        for (var i = 0; i < measures.length; i++) {
            var measure = measures[i];
            var chords = { chords: [] };
            voice.measureChords.push(chords);
            var nextpoint = plusMeter(point, measure.meter);
            var chordPos = { count: 0, division: 16 };
            var lastVar = 0;
            var lastChord = '';
            while (meterMore(point, nextpoint) < 0) {
                var symbol = pattern.directions.trim().substr(strumIdx, 1);
                var curChordMelody = this.findProgressionPart(point, progression);
                if (curChordMelody) {
                    var curChordName = this.extractBassOrBase(curChordMelody.chord, false);
                    var variation = 0;
                    if (symbol == 'V') {
                        variation = 1;
                        lastChord = curChordName; //chordMelody.chord;
                    }
                    else {
                        if (symbol == 'A') {
                            variation = 2;
                            lastChord = curChordName; //chordMelody.chord;
                        }
                        else {
                            if (symbol == 'X') {
                                variation = 3;
                                lastChord = curChordName; //chordMelody.chord;
                            }
                            else {
                                if (symbol == '-' && lastChord != curChordName) { //chordMelody.chord) {
                                    variation = lastVar;
                                    lastChord = curChordName; //chordMelody.chord;
                                }
                            }
                        }
                    }
                    if (variation) {
                        lastVar = variation;
                        var len = 1;
                        var lenPos = plusMeter(point, { count: 1, division: 16 });
                        var lenChordMelody = this.findProgressionPart(lenPos, progression);
                        if (lenChordMelody) {
                            var lenChordExtracted = this.extractBassOrBase(lenChordMelody.chord, false);
                            while (pattern.directions.trim().substr(strumIdx + len, 1) == '-' && strumIdx + len < pattern.directions.trim().length && lenChordExtracted == lastChord) {
                                len++;
                                lenPos = plusMeter(lenPos, { count: 1, division: 16 });
                                lenChordMelody = this.findProgressionPart(lenPos, progression);
                                if (lenChordMelody) {
                                    lenChordExtracted = this.extractBassOrBase(lenChordMelody.chord, false);
                                }
                                else {
                                    break;
                                }
                            }
                            var pitches = this.findChordPitches(lastChord);
                            var str = {
                                when: chordPos,
                                envelopes: [],
                                variation: variation
                            };
                            for (var ss = 0; ss < pitches.length; ss++) {
                                str.envelopes.push({
                                    pitches: [{
                                            duration: { count: len, division: 16 },
                                            pitch: pitches[ss]
                                        }]
                                });
                            }
                            chords.chords.push(str);
                        }
                    }
                    else {
                        //
                    }
                    point = simplifyMeter(plusMeter(point, { count: 1, division: 16 }));
                    chordPos = simplifyMeter(plusMeter(chordPos, { count: 1, division: 16 }));
                    strumIdx++;
                    if (strumIdx >= pattern.directions.trim().length) {
                        strumIdx = 0;
                    }
                }
            }
            point = nextpoint;
        }
    };
    ZvoogHarmonizer.prototype.tryToFindChordPitches = function (chordName) {
        for (var i = 0; i < chordfretsData.length; i++) {
            if (chordfretsData[i].name == chordName) {
                var s = chordfretsData[i].frets;
                var pitches = [];
                for (var k = 0; k < this.guitarStrings6.length; k++) {
                    if (s[k] < 0) {
                        //pitches.push(-1);
                    }
                    else {
                        pitches.push(this.guitarStrings6[k] + s[k] - 12);
                    }
                }
                return pitches;
            }
        }
        return null;
    };
    ZvoogHarmonizer.prototype.tryToFindAllPitches = function (chordName) {
        for (var i = 0; i < chordfretsData.length; i++) {
            if (chordfretsData[i].name == chordName) {
                var s = chordfretsData[i].frets;
                var pitches = [];
                for (var k = 0; k < this.guitarStrings6.length; k++) {
                    if (s[k] < 0) {
                        pitches.push(-1);
                    }
                    else {
                        pitches.push(this.guitarStrings6[k] + s[k] - 12);
                    }
                }
                return pitches;
            }
        }
        return null;
    };
    ZvoogHarmonizer.prototype.findStringPitch = function (chordName, stringHigh) {
        var strings = this.tryToFindAllPitches(chordName);
        if (!(strings)) {
            if (chordName.substr(1, 1) == '#') {
                strings = this.tryToFindChordPitches(chordName.substr(0, 1) + chordName.substr(2));
                if (strings) {
                    for (var i = 0; i < strings.length; i++) {
                        if (strings[i] > -1) {
                            strings[i] = strings[i] + 1;
                        }
                    }
                }
            }
            else {
                if (chordName.substr(1, 1) == 'b') {
                    strings = this.tryToFindChordPitches(chordName.substr(0, 1) + chordName.substr(2));
                    if (strings) {
                        for (var i = 0; i < strings.length; i++) {
                            if (strings[i] > -1) {
                                strings[i] = strings[i] - 1;
                            }
                        }
                    }
                }
            }
        }
        if (strings) {
            var r = strings[stringHigh];
            return r;
        }
        return -1;
    };
    ZvoogHarmonizer.prototype.findChordPitches = function (chordName) {
        var strings = this.tryToFindChordPitches(chordName);
        if (strings) {
            return strings;
        }
        if (chordName.substr(1, 1) == '#') {
            strings = this.tryToFindChordPitches(chordName.substr(0, 1) + chordName.substr(2));
            if (strings) {
                for (var i = 0; i < strings.length; i++) {
                    if (strings[i] > -1) {
                        strings[i] = strings[i] + 1;
                    }
                }
                return strings;
            }
        }
        if (chordName.substr(1, 1) == 'b') {
            strings = this.tryToFindChordPitches(chordName.substr(0, 1) + chordName.substr(2));
            if (strings) {
                for (var i = 0; i < strings.length; i++) {
                    if (strings[i] > -1) {
                        strings[i] = strings[i] - 1;
                    }
                }
                //console.log('found b',chordName);
                return strings;
            }
        }
        console.log('not found chord', chordName);
        return []; //-1, -1, -1, -1, -1, -1]
    };
    ZvoogHarmonizer.prototype.chordStepDifference = function (tone, chordName) {
        var fromStep = -1;
        var fromA = tone.substr(0, 1);
        if (fromA == 'C') {
            fromStep = 0;
        }
        if (fromA == 'D') {
            fromStep = 1;
        }
        if (fromA == 'E') {
            fromStep = 2;
        }
        if (fromA == 'F') {
            fromStep = 3;
        }
        if (fromA == 'G') {
            fromStep = 4;
        }
        if (fromA == 'A') {
            fromStep = 5;
        }
        if (fromA == 'B') {
            fromStep = 6;
        }
        var a = chordName.substr(0, 1);
        var step = -1;
        if (a == 'C') {
            step = 0;
        }
        if (a == 'D') {
            step = 1;
        }
        if (a == 'E') {
            step = 2;
        }
        if (a == 'F') {
            step = 3;
        }
        if (a == 'G') {
            step = 4;
        }
        if (a == 'A') {
            step = 5;
        }
        if (a == 'B') {
            step = 6;
        }
        step = this.roll7(step - fromStep);
        return step;
    };
    ZvoogHarmonizer.prototype.roll7 = function (nn) {
        var r = nn;
        while (r < 0)
            r = r + 7;
        while (r > 6)
            r = r - 7;
        return r;
    };
    ZvoogHarmonizer.prototype.chordAbsoluteHalftones = function (chordName) {
        var a = chordName.substr(0, 1);
        var root = -1;
        if (a == 'C') {
            root = 0;
        }
        if (a == 'D') {
            root = 2;
        }
        if (a == 'E') {
            root = 4;
        }
        if (a == 'F') {
            root = 5;
        }
        if (a == 'G') {
            root = 7;
        }
        if (a == 'A') {
            root = 9;
        }
        if (a == 'B') {
            root = 11;
        }
        if (chordName.substr(1, 1) == '#') {
            root++;
        }
        if (chordName.substr(1, 1) == 'b') {
            root--;
        }
        return root;
    };
    ZvoogHarmonizer.prototype.pianoKeysByName = function (chordName) {
        var retarr = [];
        var root = this.chordAbsoluteHalftones(chordName);
        var start = 1;
        if (chordName.substr(1, 1) == '#') {
            start++;
        }
        if (chordName.substr(1, 1) == 'b') {
            start++;
        }
        if (root < 0)
            root = root + 12;
        if (root >= 120)
            root = root - 12;
        retarr.push(root);
        var chordKind = chordName.substr(start);
        for (var i = 0; i < chordPitchesData.length; i++) {
            if (chordPitchesData[i].name == chordKind) {
                for (var p = 0; p < chordPitchesData[i].pitches.length; p++) {
                    retarr.push(root + chordPitchesData[i].pitches[p].halftone);
                }
                break;
            }
        }
        return retarr;
    };
    ZvoogHarmonizer.prototype.stepsByName = function (chordName) {
        var start = 1;
        if (chordName.substr(1, 1) == '#') {
            start++;
        }
        if (chordName.substr(1, 1) == 'b') {
            start++;
        }
        var chordKind = chordName.substr(start);
        for (var i = 0; i < chordPitchesData.length; i++) {
            if (chordPitchesData[i].name == chordKind) {
                return chordPitchesData[i];
            }
        }
        return null;
    };
    ZvoogHarmonizer.prototype.extractBassOrBase = function (chordName, bass) {
        var parts = chordName.split('/');
        if (parts.length > 1) {
            if (bass) {
                return parts[1];
            }
            else {
                return parts[0];
            }
        }
        else {
            return chordName;
        }
    };
    ZvoogHarmonizer.prototype.repeatProgression = function (prog, duration) {
        var pidx = 0;
        //console.log('repeatProgression',duration,progressionDuration(prog.progression));
        while (meterMore(progressionDuration(prog.progression), duration) < 0) {
            var clone = JSON.parse(JSON.stringify(prog.progression[pidx]));
            prog.progression.push(clone);
            pidx++;
        }
        //console.log(progressionDuration(prog.progression));
    };
    ZvoogHarmonizer.prototype.repeatAllVoices = function (schedule, duration) {
        //console.log('repeatAllVoices',duration,progressionDuration(schedule.harmony.progression));
        this.repeatProgression(schedule.harmony, duration);
        var midx = 0;
        while (meterMore(scheduleDuration(schedule.measures), duration) < 0) {
            var clone = JSON.parse(JSON.stringify(schedule.measures[midx]));
            schedule.measures.push(clone);
            for (var t = 0; t < schedule.tracks.length; t++) {
                var track = schedule.tracks[t];
                for (var s = 0; s < track.voices.length; s++) {
                    var voice = track.voices[s];
                    if (midx < voice.measureChords.length) {
                        var chordclone = JSON.parse(JSON.stringify(voice.measureChords[midx]));
                        voice.measureChords.push(chordclone);
                    }
                }
            }
            midx++;
        }
        //this.repeatProgression(schedule.harmony, duration);
        //console.log('repeatAllVoices done',progressionDuration(schedule.harmony.progression));
    };
    //extractMode
    ZvoogHarmonizer.prototype.chordSymbol = function (absolutestep) {
        var absstep = absolutestep % 12;
        if (absstep == 0)
            return 'C';
        if (absstep == 1)
            return 'C#';
        if (absstep == 2)
            return 'D';
        if (absstep == 3)
            return 'D#';
        if (absstep == 4)
            return 'E';
        if (absstep == 5)
            return 'F';
        if (absstep == 6)
            return 'F#';
        if (absstep == 7)
            return 'G';
        if (absstep == 8)
            return 'G#';
        if (absstep == 9)
            return 'A';
        if (absstep == 10)
            return 'A#';
        if (absstep == 11)
            return 'B';
        return '?';
    };
    ZvoogHarmonizer.prototype.notInCount = function (base, modesteps, progsteps) {
        var cnt = 0;
        for (var i = 0; i < progsteps.length; i++) {
            var nn = progsteps[i];
            for (var k = 0; k < modesteps.length; k++) {
                var modehalftones = (base + modesteps[k]) % 12;
                if (nn == modehalftones) {
                    cnt++;
                    break;
                }
            }
        }
        return (progsteps.length - cnt) / progsteps.length;
    };
    ZvoogHarmonizer.prototype.addNewArrEl = function (arr, el) {
        for (var t = 0; t < arr.length; t++) {
            if (arr[t] == el) {
                return;
            }
        }
        arr.push(el);
    };
    ZvoogHarmonizer.prototype.calculateChordDiff = function (base, chordLine, scaleMode) {
        var chords = chordLine.split('-');
        var steps = [];
        for (var i = 0; i < chords.length; i++) {
            var pianokeys = this.pianoKeysByName(chords[i]);
            for (var k = 0; k < pianokeys.length; k++) {
                this.addNewArrEl(steps, pianokeys[k] % 12);
            }
        }
        var cnt = this.notInCount(base, scaleMode.steps, steps);
        return cnt;
    };
    ZvoogHarmonizer.prototype.calculateChordDiffFromArray = function (base, chords, scaleMode) {
        var steps = [];
        for (var i = 0; i < chords.length; i++) {
            var pianokeys = this.pianoKeysByName(chords[i].name);
            for (var k = 0; k < pianokeys.length; k++) {
                this.addNewArrEl(steps, pianokeys[k] % 12);
            }
        }
        var cnt = this.notInCount(base, scaleMode.steps, steps);
        return cnt;
    };
    ZvoogHarmonizer.prototype.progIncludesChord = function (chords, symbol) {
        var symHL = this.chordAbsoluteHalftones(symbol);
        for (var i = 0; i < chords.length; i++) {
            var chHL = this.chordAbsoluteHalftones(chords[i]);
            if (symHL == chHL) {
                return true;
            }
        }
        return false;
    };
    ZvoogHarmonizer.prototype.progArrayIncludesChord = function (chords, symbol) {
        var symHL = this.chordAbsoluteHalftones(symbol);
        for (var i = 0; i < chords.length; i++) {
            var chHL = this.chordAbsoluteHalftones(chords[i].name);
            if (symHL == chHL) {
                return true;
            }
        }
        return false;
    };
    ZvoogHarmonizer.prototype.stepSymbol = function (chordName, stepNum) {
        var start = 1;
        if (chordName.substr(1, 1) == '#') {
            start++;
        }
        if (chordName.substr(1, 1) == 'b') {
            start++;
        }
        if (chordName.substr(start, 1) == 'm' && chordName.substr(start + 1, 1) != 'a') {
            if (stepNum == 0)
                return 'i';
            if (stepNum == 1)
                return 'ii';
            if (stepNum == 2)
                return 'iii';
            if (stepNum == 3)
                return 'iv';
            if (stepNum == 4)
                return 'v';
            if (stepNum == 5)
                return 'vi';
            if (stepNum == 6)
                return 'vii';
        }
        else {
            if (stepNum == 0)
                return 'I';
            if (stepNum == 1)
                return 'II';
            if (stepNum == 2)
                return 'III';
            if (stepNum == 3)
                return 'IV';
            if (stepNum == 4)
                return 'V';
            if (stepNum == 5)
                return 'VI';
            if (stepNum == 6)
                return 'VII';
        }
        return '?';
    };
    ZvoogHarmonizer.prototype.stepProg = function (pi, chords) {
        var stepLine = '';
        var dlmtr = '';
        var stepSymb = '';
        for (var k = 0; k < chords.length; k++) {
            var stepNum = this.chordStepDifference(this.chordSymbol(pi), chords[k]);
            if (this.stepSymbol(chords[k], stepNum) != stepSymb) {
                stepSymb = this.stepSymbol(chords[k], stepNum);
                stepLine = stepLine + dlmtr + stepSymb;
                dlmtr = '-';
            }
        }
        return stepLine;
    };
    ZvoogHarmonizer.prototype.stepArrProg = function (pitchHalfTone, chords) {
        var stepLine = '';
        +pitchHalfTone + ': ' + this.chordSymbol(pitchHalfTone) + ': ';
        var dlmtr = '';
        var stepSymb = '';
        for (var k = 0; k < chords.length; k++) {
            var stepNum = this.chordStepDifference(this.chordSymbol(pitchHalfTone), chords[k].name);
            if (this.stepSymbol(chords[k].name, stepNum) != stepSymb) {
                stepSymb = this.stepSymbol(chords[k].name, stepNum);
                stepLine = stepLine + dlmtr + chords[k].name + ':' + chords[k].count;
                //stepLine = stepLine + dlmtr + stepSymb;
                dlmtr = '-';
            }
        }
        return stepLine;
    };
    ZvoogHarmonizer.prototype.extractMode = function (chordLine) {
        var chords = chordLine.split('-');
        var pitches = [];
        for (var ii = 0; ii < chords.length; ii++) {
            var keys = this.pianoKeysByName(chords[ii]);
            for (var kk = 0; kk < keys.length; kk++) {
                var ikey = keys[kk] % 12;
                var foundIdx = -1;
                for (var pp = 0; pp < pitches.length; pp++) {
                    if (pitches[pp].pitch == ikey) {
                        foundIdx = pp;
                        break;
                    }
                }
                if (foundIdx < 0) {
                    pitches.push({ pitch: ikey, count: 0 });
                    foundIdx = pitches.length - 1;
                }
                pitches[foundIdx].count++;
            }
        }
        var rates = [];
        for (var pi = 0; pi < 12; pi++) {
            for (var mn = 0; mn < scaleModes.length; mn++) {
                var mode = scaleModes[mn];
                var base = pi;
                var ra = this.calculateChordDiff(base, chordLine, mode);
                if (this.progIncludesChord(chords, this.chordSymbol(base))) {
                    rates.push({
                        rate: ra, name: this.chordSymbol(base), mode: mode.name,
                        priority: mode.priority, steps: this.stepProg(base, chords)
                    });
                }
            }
        }
        rates.sort(function (a, b) {
            return (a.rate * 1000 + 7 - a.priority) - (b.rate * 1000 + 7 - b.priority);
        });
        console.log('extractMode', chordLine, rates);
        return rates[0];
    };
    ZvoogHarmonizer.prototype.calculateProgressionMode = function (chordMelody) {
        //console.log('calculateProgressionMode', chordMelody);
        var counts = [];
        var chords = [];
        for (var i = 0; i < chordMelody.length; i++) {
            var found = counts.filter(function (one) {
                return one.name == chordMelody[i].chord;
            });
            if (found.length == 0) {
                found.push({ name: chordMelody[i].chord, count: 0 });
                counts.push(found[0]);
            }
            found[0].count = found[0].count + chordMelody[i].duration.count / chordMelody[i].duration.division;
            chords.push(chordMelody[i].chord);
        }
        counts.sort(function (a, b) {
            return b.count - a.count;
        });
        //console.log('counts', counts);
        var pitches = [];
        for (var ii = 0; ii < counts.length; ii++) {
            var keys = this.pianoKeysByName(counts[ii].name);
            for (var kk = 0; kk < keys.length; kk++) {
                var ikey = keys[kk] % 12;
                var foundIdx = -1;
                for (var pp = 0; pp < pitches.length; pp++) {
                    if (pitches[pp].pitch == ikey) {
                        foundIdx = pp;
                        break;
                    }
                }
                if (foundIdx < 0) {
                    pitches.push({ pitch: ikey, count: 0 });
                    foundIdx = pitches.length - 1;
                }
                pitches[foundIdx].count++;
            }
        }
        var rates = [];
        for (var pi = 0; pi < 12; pi++) {
            for (var mn = 0; mn < scaleModes.length; mn++) {
                var mode = scaleModes[mn];
                var base = pi;
                var ra = this.calculateChordDiffFromArray(base, counts, mode);
                if (this.progArrayIncludesChord(counts, this.chordSymbol(base))) {
                    var priorityCount = 0;
                    for (var cc = 0; cc < counts.length; cc++) {
                        if (this.chordAbsoluteHalftones(counts[cc].name) == base) {
                            priorityCount = counts[cc].count;
                            break;
                        }
                    }
                    rates.push({
                        rate: ra, name: this.chordSymbol(base), mode: mode.name,
                        priority: priorityCount, steps: this.stepProg(base, chords)
                        //this.stepArrProg(base, counts)
                    });
                }
            }
        }
        rates.sort(function (a, b) {
            return (a.rate * 1000 + 7 - a.priority) - (b.rate * 1000 + 7 - b.priority);
        });
        var upper = rates.filter(function (one) {
            return one.rate == rates[0].rate && one.priority == rates[0].priority;
        });
        upper.sort(function (a, b) {
            return a.steps.localeCompare(b.steps);
        });
        console.log('calculateProgressionMode', rates, upper[0]);
        return upper[0];
    };
    return ZvoogHarmonizer;
}());
//simple drums
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65755365-0e100d090c0d100f080f-00010101020103010401050106010701274040104110421043104410451046104790670880548155825583558455855586558715a180a380a402a580a780e001--00101f01a03302503a051065-000000000000000000000000
//
//hat drums
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65654465-0e0e0d090f090e0f080f-00010101020103010401050106810701274040104110421043104410451046104794672080ea81ee82ee83ee84ea85ee86ee87eea015a111a211a311a415a511a611a711--00101f01a033024038051065-000000000000000000000000
//
//motown groove
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65758465-100e0c0d070d0809000d-000101400201034004010540068127404010411142104311441045114610479567208055815582558355845585558655a721--00101f01a033024038051065-000000000000000000000000
//
//disco groova
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65854464-0e0e0e090b0e090f000d-0001010102010301040105010681276040104110421043104410451046104781670ca044a144a244a344a444a544a644a720e001--00101f01a033024038051066-000000000000000000000000
//
//trap beat
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=8c-00005a30-65956364-0e0e0c090b0e090f000d-00410110021003100441051006100744410143014501472180718171827183718471857186718771a004a104a204a304a404a504a604a704--00a01f019033024038051066-000000000000000000000000
//
//simple 2
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-a5556264-1212100b09080e0b000e-0001010502010305040105050681070840104110421043104410451046104771a054a155a255a355a455a555a655a715e001--00601f01b033024038051066-000000000000000000000000
//
//lzLeevebreaks
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=8c-00005a30-a555a264-11110d0d090e0e0b050e-0081010c0281030c0481050c06a107094010411042104310441045104610475480548155825583558455855586558755e001--00601f01b033024038051066-000000000000000000000000
//
//James Brown: Funky President
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=64-00005a30-7555a464-0e0e0b080e080d0c050e-008901060289030604890506068907084010411042104310441045104610475180548151825483518454855186548751a001a104a201a304a401a504a601a704--00101f013033024038051066-000000000000000000000000
//
//The Winstons: Amen, Brother
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65a5aa64-0e0e0b080e080d0c050e-0005010402050344040505040605072a4090411242904312449045124610479180548155825583558455855586558701a120a320a520a754e001--00101f013033025038051066-000000000000000000000000
//
//Kendrick Lamar: Swimming Pools (Drank)
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-5585a464-0e0e0d0d0c0b0a08050e-004901080249030804490508064907684010411042104310441045104610471180548155825583558455855586558755a620a722e001--00a01f01c033024038051066-000000000000000000000000
//
//techno
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-5513a464-0e0e0d0d0c0b0a090f0e-001101110211031104110511061107f54010411042104310441045104610471080448144824483448444854486448744e001--00a01f01c033024038051066-000000000000000000000000
var dd21 = { "count": 2, "division": 1 };
var dd11 = { "count": 1, "division": 1 };
var dd12 = { "count": 1, "division": 2 };
var dd14 = { "count": 1, "division": 4 };
var dd18 = { "count": 1, "division": 8 };
var trackProgressions = [
    { title: "Fmaj7-A minor", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Fmaj7" }, { duration: { count: 2, division: 1 }, "chord": "A" }] }, jspath: null }
    //
    ,
    { title: "Am-B-Gm minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }] }, jspath: null },
    { title: "Am-Dm-E minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "E" }] }, jspath: null },
    { title: "C#m-E-B-A blues", harmony: { "tone": "C#", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C#m" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null },
    { title: "Am-C-Dm-Em minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null },
    { title: "Am-D7-E7-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null },
    { title: "Am-D9-Fm-C minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D9" }, { duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "Am-Dm-F-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "Am-Dm-Fm-C minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "Am-Em-G-Dm minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }] }, jspath: null },
    { title: "Am-F-C-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "Am-F-Em-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null },
    { title: "Am-G-Dm7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }] }, jspath: null }
    //
    ,
    { title: "Am-G-Em-F minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "Am-G-F-E7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null },
    { title: "Am-C-G-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null },
    { title: "Am-C-G-Dm minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }] }, jspath: null },
    { title: "Bm-A-G-F#m minor", harmony: { "tone": "B", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Bm" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F#m" }] }, jspath: null },
    { title: "C-Am-Dm-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "Cm-Ab-Eb-Bb epic", harmony: { "tone": "C", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cm" }, { duration: { count: 1, division: 1 }, "chord": "Ab" }, { duration: { count: 1, division: 1 }, "chord": "Eb" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }] }, jspath: null },
    { title: "C-D7-Fm-C minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "C-D7-G7-C minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "C-E-Am7-F minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "C-Fm-Bb7-C epic", harmony: { "tone": "F", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "Bb7" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "Dm-Am-C-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "Dm-F-Am-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "Em-B-C-Am minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null },
    { title: "Em-B-G-Em minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null },
    { title: "Em-C-G-D minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "Em-D-C-D minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "Em-D-C-B7 minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "B7" }] }, jspath: null },
    { title: "Em-G-C-Am minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null },
    { title: "Em-G-Dsus4-A7sus4 rock", harmony: { "tone": "E", "mode": "Dorian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dsus4" }, { duration: { count: 1, division: 1 }, "chord": "A7sus4" }] }, jspath: null },
    { title: "Em-G-D-Em minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null },
    { title: "Em-G-D-Am minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null },
    { title: "Fm-Db-Ab-Eb epic", harmony: { "tone": "F", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "Db" }, { duration: { count: 1, division: 1 }, "chord": "Ab" }, { duration: { count: 1, division: 1 }, "chord": "Eb" }] }, jspath: null },
    { title: "F-Em7-Am-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "G-B-C-Cm creep", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Cm" }] }, jspath: null },
    { title: "G-C-D-Em minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null }
    //
    ,
    { title: "Dm-Gm-Dm-A-Dm minor", harmony: { "tone": "D", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 2 }, "chord": "A" }, { duration: { count: 1, division: 2 }, "chord": "Dm" }] }, jspath: null },
    { title: "F-Em-Am-G-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 2 }, "chord": "G" }, { duration: { count: 1, division: 2 }, "chord": "Am" }] }, jspath: null }
    //
    ,
    { title: "Am-C-D-Am-C-Am minor", harmony: { "tone": "A", "mode": "Dorian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null },
    { title: "Am-Dsus4-Dm-F-G-Dm7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dsus4" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }] }, jspath: null },
    { title: "Am-F7-G-Em-F-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 2, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "Am-G-C-F-E-E7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null },
    { title: "Am-G-Dm-F-G-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
    //
    ,
    { title: "Am-E-Em-D-Dm-Am-Adim-E minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Adim" }, { duration: { count: 1, division: 1 }, "chord": "E" }] }, jspath: null },
    { title: "Am-E7-G-D-F-C-Dm-E7 eagles", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null },
    { title: "Am-Em-G-D-Am-Cmaj7-G-D epic", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "Am-F-E7-Am-Dm7-Gsus4-F-E7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "Gsus4" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null },
    { title: "Gm-Cm-F-Bb-Eb-Adim-D-Gm minor", harmony: { "tone": "G", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Cm" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "Eb" }, { duration: { count: 1, division: 1 }, "chord": "Adim" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }] }, jspath: null },
    { title: "Dm-Bb-C-Gm-Bb-F-Gm-Dm epic", harmony: { "tone": "G", "mode": "Dorian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }] }, jspath: null }
    //-----------------------------------------
    ,
    { title: "Am-G-D jazz", harmony: { "tone": "A", "mode": "Dorian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "C-Gm-Dm jazz", harmony: { "tone": "D", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }] }, jspath: null },
    { title: "Cmaj7-Cm7-F7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "Cm7" }, { duration: { count: 1, division: 1 }, "chord": "F7" }] }, jspath: null },
    { title: "Dm7-G7-Cmaj7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "Cmaj7" }] }, jspath: null }
    //
    ,
    { title: "Am7-D7-G-C major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "Am7-Em7-Dsus4-Dm7 nice", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "Dsus4" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }] }, jspath: null },
    { title: "Am-F7-D7-E7 jazz", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null },
    { title: "Am7-F7-G-Em7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "F7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }] }, jspath: null },
    { title: "Bm7-Em7-Am7-D7 major", harmony: { "tone": "G", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Bm7" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }] }, jspath: null },
    { title: "C-Am-E-G jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-D7-F-C jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "C-F-G-G7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "G7" }] }, jspath: null },
    { title: "Cm7-Ab7-G7 jazz", harmony: { "tone": "C", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Cm7" }, { duration: { count: 1, division: 1 }, "chord": "Ab7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }] }, jspath: null },
    { title: "Cmaj7-Gm7-C7-Fmaj7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "Gm7" }, { duration: { count: 1, division: 1 }, "chord": "C7" }, { duration: { count: 1, division: 1 }, "chord": "Fmaj7" }] }, jspath: null },
    { title: "D7-G7-C7-F7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "C7" }, { duration: { count: 1, division: 1 }, "chord": "F7" }] }, jspath: null },
    { title: "Dm7-G7-Cmaj7-C6 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "C6" }] }, jspath: null },
    { title: "F#m7-B7-E-A pop", harmony: { "tone": "E", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F#m7" }, { duration: { count: 1, division: 1 }, "chord": "B7" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null },
    { title: "G-E7-A7-D7 major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "A7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }] }, jspath: null },
    { title: "G-E7-Am7-D7 major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }] }, jspath: null }
    //
    ,
    { title: "Cmaj7-D7-Dm7-G7-Cmaj7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 2 }, "chord": "G7" }, { duration: { count: 1, division: 2 }, "chord": "Cmaj7" }] }, jspath: null },
    { title: "Em-G-D-C-A rock", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 2 }, "chord": "C" }, { duration: { count: 1, division: 2 }, "chord": "A" }] }, jspath: null }
    //
    ,
    { title: "Cmaj7-Am7-Dm7-G7-Em7-A7-Dm7-G7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "A7" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }] }, jspath: null }
    //
    ,
    { title: "Cmaj7-C7-Fmaj7-Fm7-Em7-A7-Dm7-G7-Cmaj7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "C7" }, { duration: { count: 1, division: 1 }, "chord": "Fmaj7" }, { duration: { count: 1, division: 1 }, "chord": "Fm7" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "A7" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 2 }, "chord": "G7" }, { duration: { count: 1, division: 2 }, "chord": "Cmaj7" }] }, jspath: null }
    //--------------------------------------
    ,
    { title: "A-D-E major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "E" }] }, jspath: null },
    { title: "Am-D-G major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-Am-F major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "C-F-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-G-F major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "D-C-G rock", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "F-Am-G nice", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "F-Bb-C blues", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "G-C-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
    //
    ,
    { title: "Am-D-G-Em major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null },
    { title: "Am-G-D-F blues", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "A-Eb-G-D major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "Eb" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "A-G-D-A blues", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null },
    { title: "C-Ab-Bb-C triumphant", harmony: { "tone": "C", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Ab" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "C-Am-Em-F major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "C-Am-Dm-G blue", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-Am-F-G happy", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-Dm-F-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-G-Am-F epic", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "C-F-G-Am nice", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null },
    { title: "C-F-C-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-F-Am-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-F-Dm-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-F-G-F major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "D-A-C-G major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "D-A-Em-G major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "D-C-G-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "D-C-Bb-F rock", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "D-Em-G-D rock", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "D-G-Bm-A rock", harmony: { "tone": "D", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Bm" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null },
    { title: "E-B-C#m-A major", harmony: { "tone": "E", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "C#m" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null },
    { title: "E-G-A-G major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "F-Am-G-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "F-C-Dm-Bb major", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }] }, jspath: null },
    { title: "F-G-Am-Em major", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null },
    { title: "G-Am-C-G major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "G-C-Em-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "G-C-D-C major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "G-C-F-C major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "G-D-Am-C major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "G-D-Em-C major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null },
    { title: "G-Em-Am-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "G-Em-C-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
    //
    ,
    { title: "C-G-F-G-C major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 2 }, "chord": "G" }, { duration: { count: 1, division: 2 }, "chord": "C" }] }, jspath: null },
    { title: "D-F-G-C-G rock", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 2 }, "chord": "C" }, { duration: { count: 1, division: 2 }, "chord": "G" }] }, jspath: null },
    { title: "D-G-D-A-D major", harmony: { "tone": "D", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 2 }, "chord": "A" }, { duration: { count: 1, division: 2 }, "chord": "D" }] }, jspath: null },
    { title: "E-B-C#m-G#m-A rock", harmony: { "tone": "E", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "C#m" }, { duration: { count: 1, division: 2 }, "chord": "G#m" }, { duration: { count: 1, division: 2 }, "chord": "A" }] }, jspath: null },
    { title: "F-Am-F-G-C epic", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 2 }, "chord": "G" }, { duration: { count: 1, division: 2 }, "chord": "C" }] }, jspath: null }
    //
    ,
    { title: "A-E-F#m-D-A-E major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "F#m" }, { duration: { count: 2, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "E" }] }, jspath: null },
    { title: "C-Dm-Am7-F-G-C major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
    //
    ,
    { title: "C-G-Am-Em-F-C-F-G epic", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null },
    { title: "C-G-Am-F-C-F-C-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [
                { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" },
                { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" },
                { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" },
                { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }
            ] }, jspath: null },
    { title: "D-A-Bm-F#m-G-D-G-A major", harmony: { "tone": "D", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "Bm" }, { duration: { count: 1, division: 1 }, "chord": "F#m" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null },
    { title: "E-C-D-Em-Em-G-Am-Bm epic", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Bm" }] }, jspath: null },
    { title: "F-Bb-Edim-Am-Dm-Gm-C-F major", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "Edim" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null },
    { title: "G-D-Em-Bm-C-G-C-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Bm" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null },
    { title: "G-D-Em-C-G-C-G-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [
                { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" },
                { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "C" },
                { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" },
                { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }
            ] }, jspath: null }
];
var chordPitchesData = [
    //{ name: '', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }] }//[4, 7] },
    { name: '', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }] },
    { name: '5', pitches: [{ step: 4, halftone: 7 }, { step: 0, halftone: 12 }] },
    { name: '6', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }] },
    { name: '69', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] },
    { name: '6add9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] },
    { name: '6sus4', pitches: [{ step: 3, halftone: 5 }, { step: 5, halftone: 9 }] },
    { name: '7', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] },
    { name: '7sus4', pitches: [{ step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] },
    { name: '7b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] },
    { name: '7-5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] },
    { name: '7#9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 2, halftone: 15 }] },
    { name: '7+9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 2, halftone: 15 }] },
    { name: '7b9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 13 }] },
    { name: '9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] },
    { name: '9#11', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] },
    { name: '9b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] },
    { name: '11', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }] },
    { name: '13', pitches: [{ step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }, { step: 5, halftone: 21 }] },
    { name: 'add9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 1, halftone: 14 }] },
    { name: 'alt', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }] },
    { name: 'aug', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }] },
    { name: '+', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }] },
    { name: 'aug7', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] },
    { name: '+7', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] },
    { name: 'aug9', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] },
    { name: '+9', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] },
    { name: 'dim', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }] },
    { name: 'dim7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 5, halftone: 9 }] },
    { name: 'm', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }] },
    { name: 'm6', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }] },
    { name: 'm69', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] },
    { name: 'm6add9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] },
    { name: 'm7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] },
    { name: 'm7b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] },
    { name: '0', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] },
    { name: 'm9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] },
    { name: 'm9b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] },
    { name: 'm11', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }] },
    { name: 'madd9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 1, halftone: 14 }] },
    { name: 'maj7', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] },
    { name: 'maj7#5', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 11 }] },
    { name: 'maj7b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 11 }] },
    { name: 'maj9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }, { step: 1, halftone: 14 }] },
    { name: 'maj11', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] },
    { name: 'maj13', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 6, halftone: 11 }] },
    { name: 'mmaj7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] },
    { name: 'mmaj7b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 11 }] },
    { name: 'mmaj9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }, { step: 1, halftone: 14 }] },
    { name: 'mmaj11', pitches: [{ step: 2, halftone: 3 }, { step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] },
    { name: 'sus2', pitches: [{ step: 1, halftone: 2 }, { step: 4, halftone: 7 }] },
    { name: 'sus4', pitches: [{ step: 3, halftone: 5 }, { step: 4, halftone: 7 }] }
    /*
    ,{ name: '5', pitches: [7, 12] },
    { name: '6', pitches: [4, 7, 9] },
    { name: '69', pitches: [4, 7, 9, 14] },
    { name: '6add9', pitches: [4, 7, 9, 14] },
    { name: '6sus4', pitches: [5, 9] },
    { name: '7', pitches: [4, 7, 10] },
    { name: '7sus4', pitches: [5, 7, 10] },
    { name: '7b5', pitches: [4, 6, 10] },
    { name: '7-5', pitches: [4, 6, 10] },
    { name: '7#9', pitches: [4, 7, 10, 15] },
    { name: '7+9', pitches: [4, 7, 10, 15] },
    { name: '7b9', pitches: [4, 7, 10, 13] },
    { name: '9', pitches: [4, 7, 10, 14] },
    { name: '9#11', pitches: [2, 4, 6, 7, 10] },
    { name: '9b5', pitches: [4, 6, 10, 14] },
    { name: '11', pitches: [4, 7, 10, 14, 17] },
    { name: '13', pitches: [10, 14, 17, 21] },
    { name: 'add9', pitches: [4, 7, 14] },
    { name: 'alt', pitches: [4, 6] },
    { name: 'aug', pitches: [4, 8] },
    { name: '+', pitches: [4, 8] },
    { name: 'aug7', pitches: [4, 8, 10] },
    { name: '+7', pitches: [4, 8, 10] },
    { name: 'aug9', pitches: [2, 4, 8, 10] },
    { name: '+9', pitches: [2, 4, 8, 10] },
    { name: 'dim', pitches: [3, 6] },
    { name: 'dim7', pitches: [3, 6, 9] },
    { name: 'm', pitches: [3, 7] },
    { name: 'm6', pitches: [3, 7, 9] },
    { name: 'm69', pitches: [3, 7, 9, 14] },
    { name: 'm6add9', pitches: [3, 7, 9, 14] },
    { name: 'm7', pitches: [3, 7, 10] },
    { name: 'm7b5', pitches: [3, 6, 10] },
    { name: '0', pitches: [3, 6, 10] },
    { name: 'm9', pitches: [3, 7, 10, 14] },
    { name: 'm9b5', pitches: [3, 6, 10, 14] },
    { name: 'm11', pitches: [3, 7, 10, 14, 17] },
    { name: 'madd9', pitches: [3, 7, 14] },
    { name: 'maj7', pitches: [4, 7, 11] },
    { name: 'maj7#5', pitches: [4, 8, 11] },
    { name: 'maj7b5', pitches: [4, 6, 11] },
    { name: 'maj9', pitches: [4, 7, 11, 14] },
    { name: 'maj11', pitches: [2, 4, 5, 7, 11] },
    { name: 'maj13', pitches: [2, 4, 7, 9, 11] },
    { name: 'mmaj7', pitches: [3, 7, 11] },
    { name: 'mmaj7b5', pitches: [3, 6, 11] },
    { name: 'mmaj9', pitches: [3, 7, 11, 14] },
    { name: 'mmaj11', pitches: [3, 5, 7, 11] },
    { name: 'sus2', pitches: [2, 7] },
    { name: 'sus4', pitches: [5, 7] }
*/
];
var chordfretsData = [
    { name: "A#", pitch: 9, frets: [-1, 1, 3, 3, 3, 1] },
    { name: "Bb", pitch: 9, frets: [-1, 1, 3, 3, 3, 1] },
    { name: "A69", pitch: 9, frets: [-1, 0, 4, 4, 2, 2] },
    { name: "A6", pitch: 9, frets: [-1, 0, 2, 2, 2, 2] },
    { name: "A11", pitch: 9, frets: [-1, 0, 0, 0, 2, 0] },
    { name: "A7b9", pitch: 9, frets: [-1, 0, 2, 3, 2, 3] },
    { name: "A13", pitch: 9, frets: [-1, 0, 2, 0, 2, 2] },
    { name: "A7#9", pitch: 9, frets: [5, 7, 5, 6, 8, 8] },
    { name: "A7", pitch: 9, frets: [-1, 0, 2, 0, 2, 0] },
    { name: "A9", pitch: 9, frets: [5, 4, 2, 0, 0, 0] },
    { name: "A7b5", pitch: 9, frets: [-1, 0, 1, 2, 2, 3] },
    { name: "A9b5", pitch: 9, frets: [-1, 0, 1, 4, 2, 3] },
    { name: "A7sus4", pitch: 9, frets: [-1, 0, 2, 0, 3, 0] },
    { name: "A9#11", pitch: 9, frets: [-1, 0, 1, 0, 2, 0] },
    { name: "Aadd9", pitch: 9, frets: [-1, 0, 2, 4, 2, 0] },
    { name: "Aaug", pitch: 9, frets: [-1, 0, 3, 2, 2, 1] },
    { name: "Aaug9", pitch: 9, frets: [-1, 0, 3, 4, 2, 3] },
    { name: "Aalt", pitch: 9, frets: [-1, 0, 1, 2, 2, -1] },
    { name: "Aaug7", pitch: 9, frets: [-1, 0, 3, 0, 2, 1] },
    { name: "Am6", pitch: 9, frets: [-1, 0, 2, 2, 1, 2] },
    { name: "Adim", pitch: 9, frets: [-1, 0, 1, 2, 1, -1] },
    { name: "Adim7", pitch: 9, frets: [-1, 0, 1, 2, 1, 2] },
    { name: "Am69", pitch: 9, frets: [-1, 0, 4, 5, 0, 0] },
    { name: "Am9", pitch: 9, frets: [-1, 0, 2, 4, 1, 3] },
    { name: "Am11", pitch: 9, frets: [-1, 0, 0, 0, 1, 0] },
    { name: "Am7b5", pitch: 9, frets: [-1, 0, 1, 0, 1, -1] },
    { name: "Amadd9", pitch: 9, frets: [-1, 0, 2, 4, 1, 0] },
    { name: "Am7", pitch: 9, frets: [-1, 0, 2, 0, 1, 0] },
    { name: "Amaj13", pitch: 9, frets: [-1, 0, 2, 1, 2, 2] },
    { name: "Amaj11", pitch: 9, frets: [-1, 0, 0, 1, 2, 0] },
    { name: "Amaj7b5", pitch: 9, frets: [-1, 0, 1, 1, 2, 4] },
    { name: "Amaj7", pitch: 9, frets: [-1, 0, 2, 1, 2, 0] },
    { name: "Amaj7#5", pitch: 9, frets: [-1, 0, 3, 1, 2, 1] },
    { name: "A", pitch: 9, frets: [-1, 0, 2, 2, 2, 0] },
    { name: "Am", pitch: 9, frets: [-1, 0, 2, 2, 1, 0] },
    { name: "Amaj9", pitch: 9, frets: [-1, 0, 2, 4, 2, 4] },
    { name: "Ammaj11", pitch: 9, frets: [-1, 0, 0, 1, 1, 0] },
    { name: "Ammaj7b5", pitch: 9, frets: [-1, 0, 1, 1, 1, 4] },
    { name: "Asus2", pitch: 9, frets: [-1, 0, 2, 2, 0, 0] },
    { name: "Ammaj7", pitch: 9, frets: [-1, 0, 2, 1, 1, 0] },
    { name: "Ammaj9", pitch: 9, frets: [5, 3, 6, 4, 0, 0] },
    { name: "Ab11", pitch: 8, frets: [4, 4, 4, 5, 4, 4] },
    { name: "Asus4", pitch: 9, frets: [-1, 0, 2, 2, 3, 0] },
    { name: "Ab6", pitch: 8, frets: [-1, 3, 1, 1, 1, 1] },
    { name: "Ab13", pitch: 8, frets: [4, 1, 3, 1, 1, 2] },
    { name: "Ab69", pitch: 8, frets: [-1, 1, 1, 1, 1, 1] },
    { name: "Ab7#9", pitch: 8, frets: [4, 3, 4, 4, 4, 4] },
    { name: "Ab7b5", pitch: 8, frets: [4, -1, 4, 5, 3, -1] },
    { name: "Ab7b9", pitch: 8, frets: [-1, 0, 1, 1, 1, 2] },
    { name: "Ab7", pitch: 8, frets: [-1, -1, 1, 1, 1, 2] },
    { name: "Ab7sus4", pitch: 8, frets: [-1, -1, 1, 1, 2, 2] },
    { name: "Ab9#11", pitch: 8, frets: [4, -1, 4, 5, 3, -1] },
    { name: "Ab9", pitch: 8, frets: [4, 3, 4, 3, 4, -1] },
    { name: "Abadd9", pitch: 8, frets: [4, 3, -1, 3, 4, -1] },
    { name: "Abalt", pitch: 8, frets: [-1, -1, 6, 5, 3, 4] },
    { name: "Ab9b5", pitch: 8, frets: [4, 3, 0, 3, -1, 2] },
    { name: "Abaug", pitch: 8, frets: [4, 3, 2, 1, 1, -1] },
    { name: "Abaug7", pitch: 8, frets: [4, -1, 4, 5, 5, 0] },
    { name: "Abdim", pitch: 8, frets: [4, 2, -1, 4, 3, -1] },
    { name: "Abaug9", pitch: 8, frets: [2, 1, 2, 1, 1, 2] },
    { name: "Abdim7", pitch: 8, frets: [-1, -1, 0, 1, 0, 1] },
    { name: "Abm11", pitch: 8, frets: [4, 2, 4, 3, 2, 2] },
    { name: "Abm6", pitch: 8, frets: [4, -1, 3, 4, 4, -1] },
    { name: "Abm69", pitch: 8, frets: [4, -1, 3, 4, 4, 6] },
    { name: "Abm7", pitch: 8, frets: [4, 6, 4, 4, 4, 4] },
    { name: "Abm7b5", pitch: 8, frets: [-1, -1, 0, 1, 0, 2] },
    { name: "Abm9", pitch: 8, frets: [4, 1, 1, 1, 0, 2] },
    { name: "Abmaj11", pitch: 8, frets: [4, 3, 1, 0, 2, -1] },
    { name: "Abmadd9", pitch: 8, frets: [4, 2, -1, 3, 4, -1] },
    { name: "Abmaj13", pitch: 8, frets: [4, 3, 3, 3, 4, 3] },
    { name: "Abmaj7#5", pitch: 8, frets: [4, 3, 2, 0, 1, 0] },
    { name: "Ab", pitch: 8, frets: [4, 3, 1, 1, 1, -1] },
    { name: "Abmaj7b5", pitch: 8, frets: [4, 3, 5, 5, 3, 3] },
    { name: "Abmaj7", pitch: 8, frets: [4, 6, 5, 5, 4, 4] },
    { name: "Abmaj9", pitch: 8, frets: [-1, 1, 1, 1, 1, 3] },
    { name: "Abm", pitch: 8, frets: [4, 6, 6, 4, 4, 4] },
    { name: "Abmmaj11", pitch: 8, frets: [4, 4, 5, 4, 4, 6] },
    { name: "Abmmaj7", pitch: 8, frets: [-1, 2, 1, 1, 4, 3] },
    { name: "Abmmaj9", pitch: 8, frets: [4, -1, 5, 3, 0, 4] },
    { name: "Abmmaj7b5", pitch: 8, frets: [4, 5, 5, 4, -1, 4] },
    { name: "Absus4", pitch: 8, frets: [-1, -1, 1, 1, 2, 4] },
    { name: "Absus2", pitch: 8, frets: [4, -1, -1, 3, 4, 4] },
    { name: "B11", pitch: 11, frets: [-1, 2, 1, 2, 0, 0] },
    { name: "B13", pitch: 11, frets: [-1, 2, 1, 2, 4, 4] },
    { name: "B6", pitch: 11, frets: [-1, 2, 1, 1, 0, -1] },
    { name: "B69", pitch: 11, frets: [-1, 2, 1, 1, 2, 2] },
    { name: "B7", pitch: 11, frets: [-1, 2, 1, 2, 0, 2] },
    { name: "B7#9", pitch: 11, frets: [-1, 2, 1, 2, 3, -1] },
    { name: "B7b9", pitch: 11, frets: [-1, 2, 1, 2, 1, 2] },
    { name: "B7b5", pitch: 11, frets: [-1, 2, 1, 2, 0, 1] },
    { name: "B7sus4", pitch: 11, frets: [-1, 2, 2, 2, 0, 0] },
    { name: "B9b5", pitch: 11, frets: [-1, 2, 1, 2, 2, 1] },
    { name: "B9", pitch: 11, frets: [-1, 2, 1, 2, 2, 2] },
    { name: "Balt", pitch: 11, frets: [-1, 2, 3, 4, 4, -1] },
    { name: "B9#11", pitch: 11, frets: [-1, 2, 1, 2, 2, 1] },
    { name: "Badd9", pitch: 11, frets: [-1, 2, 1, -1, 2, 2] },
    { name: "Baug", pitch: 11, frets: [-1, 2, 1, 0, 0, -1] },
    { name: "Baug7", pitch: 11, frets: [-1, 2, 1, 2, 0, 3] },
    { name: "Baug9", pitch: 11, frets: [-1, 2, 1, 2, 2, 3] },
    { name: "Bdim7", pitch: 11, frets: [-1, 2, 3, 1, 3, 1] },
    { name: "Bdim", pitch: 11, frets: [-1, 2, 0, -1, 0, 1] },
    { name: "Bm11", pitch: 11, frets: [-1, 2, 0, 2, 2, 0] },
    { name: "Bm6", pitch: 11, frets: [2, 2, 0, 1, 0, 2] },
    { name: "Bm69", pitch: 11, frets: [-1, 2, 0, 1, 2, 2] },
    { name: "Bm7", pitch: 11, frets: [2, 2, 4, 2, 3, 2] },
    { name: "Bm7b5", pitch: 11, frets: [-1, 2, 3, 2, 3, -1] },
    { name: "Bm9", pitch: 11, frets: [-1, 2, 0, 2, 2, 2] },
    { name: "Bmadd9", pitch: 11, frets: [-1, 5, 4, 4, 2, -1] },
    { name: "Bmaj11", pitch: 11, frets: [-1, 2, 1, 3, 0, 0] },
    { name: "Bmaj13", pitch: 11, frets: [-1, 2, 2, 3, 4, 4] },
    { name: "Bmaj7", pitch: 11, frets: [2, 2, 4, 3, 4, 2] },
    { name: "Bmaj7#5", pitch: 11, frets: [-1, 2, 1, 3, 0, 3] },
    { name: "Bmaj9", pitch: 11, frets: [2, 2, 1, 3, 2, -1] },
    { name: "Bmaj7b5", pitch: 11, frets: [-1, 2, 3, 3, 4, -1] },
    { name: "B", pitch: 11, frets: [2, 2, 4, 4, 4, 2] },
    { name: "Bmmaj7", pitch: 11, frets: [-1, 2, 0, 3, 0, 2] },
    { name: "Bmmaj11", pitch: 11, frets: [-1, 2, 0, 3, 2, 0] },
    { name: "Bmmaj7b5", pitch: 11, frets: [-1, 2, 3, 3, 3, -1] },
    { name: "Bmmaj9", pitch: 11, frets: [-1, 2, 0, 3, 2, 2] },
    { name: "Bsus2", pitch: 11, frets: [2, 2, 4, 4, 2, 2] },
    { name: "Bsus4", pitch: 11, frets: [2, 2, 4, 4, 5, 2] },
    { name: "Bm", pitch: 11, frets: [2, 2, 4, 4, 3, 2] },
    { name: "Bb11", pitch: 10, frets: [-1, 1, 1, 1, 3, 1] },
    { name: "Bb13", pitch: 10, frets: [-1, 1, 0, 1, 3, 3] },
    { name: "Bb6", pitch: 10, frets: [-1, 1, 3, 3, 3, 3] },
    { name: "Bb69", pitch: 10, frets: [-1, 1, 0, 0, 1, 1] },
    { name: "Bb7", pitch: 10, frets: [-1, 1, 3, 1, 3, 1] },
    { name: "Bb7#9", pitch: 10, frets: [-1, 1, 0, 1, 2, -1] },
    { name: "Bb7b5", pitch: 10, frets: [-1, 1, 2, 1, 3, -1] },
    { name: "Bb9#11", pitch: 10, frets: [-1, 1, 0, 1, 1, 0] },
    { name: "Bb7sus4", pitch: 10, frets: [-1, 1, 3, 1, 4, 1] },
    { name: "Bb9", pitch: 10, frets: [-1, 1, 0, 1, 1, 1] },
    { name: "Bb7b9", pitch: 10, frets: [-1, 1, 0, 1, 0, 1] },
    { name: "Bb9b5", pitch: 10, frets: [-1, 1, 0, 1, 1, 0] },
    { name: "Bbadd9", pitch: 10, frets: [-1, 1, 0, 3, 1, 1] },
    { name: "Bbalt", pitch: 10, frets: [-1, 1, 2, 3, 3, 0] },
    { name: "Bbaug7", pitch: 10, frets: [-1, 1, 4, 1, 3, 2] },
    { name: "Bbaug", pitch: 10, frets: [-1, 1, 4, 3, 3, -1] },
    { name: "Bbaug9", pitch: 10, frets: [-1, 1, 0, 1, 1, 2] },
    { name: "Bbdim", pitch: 10, frets: [-1, 1, 2, 3, 2, -1] },
    { name: "Bbm11", pitch: 10, frets: [6, 4, 6, 5, 4, 4] },
    { name: "Bbm6", pitch: 10, frets: [-1, 1, 3, -1, 2, 3] },
    { name: "Bbm69", pitch: 10, frets: [6, -1, 5, 6, 6, 8] },
    { name: "Bbdim7", pitch: 10, frets: [-1, 1, 2, 0, 2, 0] },
    { name: "Bbm7b5", pitch: 10, frets: [-1, 1, 2, 1, 2, -1] },
    { name: "Bbm7", pitch: 10, frets: [-1, 1, 3, 1, 2, 1] },
    { name: "Bbm9", pitch: 10, frets: [-1, -1, 3, 5, 2, 4] },
    { name: "Bbmadd9", pitch: 10, frets: [-1, 4, 3, 3, 1, -1] },
    { name: "Bbmaj11", pitch: 10, frets: [-1, 1, 1, 2, 3, 1] },
    { name: "Bbmaj13", pitch: 10, frets: [-1, 1, 1, 2, 3, 3] },
    { name: "Bbmaj7#5", pitch: 10, frets: [-1, 1, 0, 2, 3, 2] },
    { name: "Bbmaj7", pitch: 10, frets: [-1, 1, 3, 2, 3, 1] },
    { name: "Bb", pitch: 10, frets: [-1, 1, 3, 3, 3, 1] },
    { name: "Bbmaj7b5", pitch: 10, frets: [-1, 1, 2, 2, 3, -1] },
    { name: "Bbm", pitch: 10, frets: [-1, 1, 3, 3, 2, 1] },
    { name: "Bbmmaj11", pitch: 10, frets: [-1, 1, 1, 2, 2, 1] },
    { name: "Bbmmaj7", pitch: 10, frets: [-1, 1, 3, 2, 2, 1] },
    { name: "Bbmaj9", pitch: 10, frets: [1, 1, 0, 2, 1, -1] },
    { name: "Bbmmaj7b5", pitch: 10, frets: [-1, 1, 2, 2, 2, 0] },
    { name: "Bbmmaj9", pitch: 10, frets: [6, 4, -1, 5, 6, 5] },
    { name: "Bbsus4", pitch: 10, frets: [-1, 1, 3, 3, 4, 1] },
    { name: "Bbsus2", pitch: 10, frets: [1, 1, 3, 3, 1, 1] },
    { name: "C13", pitch: 0, frets: [-1, 3, 2, 3, 5, 5] },
    { name: "C11", pitch: 0, frets: [-1, 3, 2, 3, 1, 1] },
    { name: "C6", pitch: 0, frets: [-1, 3, 2, 2, 1, 0] },
    { name: "C69", pitch: 0, frets: [-1, 3, 2, 2, 3, 3] },
    { name: "C7", pitch: 0, frets: [-1, 3, 2, 3, 1, 0] },
    { name: "C7b5", pitch: 0, frets: [-1, -1, 2, 3, 1, 2] },
    { name: "C7#9", pitch: 0, frets: [-1, 3, 2, 3, 4, -1] },
    { name: "C7b9", pitch: 0, frets: [-1, 3, 2, 3, 2, 3] },
    { name: "C7sus4", pitch: 0, frets: [-1, 3, 3, 3, 1, 1] },
    { name: "C9b5", pitch: 0, frets: [-1, 3, 2, 3, 3, 2] },
    { name: "C9#11", pitch: 0, frets: [-1, 3, 2, 3, 3, 2] },
    { name: "C9", pitch: 0, frets: [3, 3, 2, 3, 3, 3] },
    { name: "Cadd9", pitch: 0, frets: [-1, 3, 2, 0, 3, 0] },
    { name: "Calt", pitch: 0, frets: [-1, 3, 2, 5, 5, 2] },
    { name: "Caug", pitch: 0, frets: [-1, 3, 2, 1, 1, -1] },
    { name: "Caug9", pitch: 0, frets: [-1, 3, 2, 3, 3, 4] },
    { name: "Cdim", pitch: 0, frets: [-1, 3, 1, -1, 1, 2] },
    { name: "Caug7", pitch: 0, frets: [-1, 3, 2, 3, -1, 4] },
    { name: "Cdim7", pitch: 0, frets: [-1, -1, 1, 2, 1, 2] },
    { name: "Cm11", pitch: 0, frets: [-1, 3, 1, 3, 3, 1] },
    { name: "Cm6", pitch: 0, frets: [-1, 3, 1, 2, 1, 3] },
    { name: "Cm7", pitch: 0, frets: [-1, 3, 1, 3, 4, -1] },
    { name: "Cm69", pitch: 0, frets: [-1, 3, 1, 2, 3, 3] },
    { name: "Cm9", pitch: 0, frets: [-1, 3, 1, 3, 3, 3] },
    { name: "Cm7b5", pitch: 0, frets: [-1, 3, 4, 3, 4, -1] },
    { name: "Cmadd9", pitch: 0, frets: [-1, 3, 1, 0, 3, 3] },
    { name: "Cmaj11", pitch: 0, frets: [-1, 3, 2, 0, 0, 1] },
    { name: "Cmaj13", pitch: 0, frets: [-1, 3, 2, 2, 0, 1] },
    { name: "Cmaj7#5", pitch: 0, frets: [-1, 3, 2, 1, 0, 0] },
    { name: "Cmaj7", pitch: 0, frets: [3, 3, 2, 0, 0, 0] },
    { name: "Cmaj9", pitch: 0, frets: [-1, 3, 0, 0, 0, 0] },
    { name: "C", pitch: 0, frets: [-1, 3, 2, 0, 1, 0] },
    { name: "Cm", pitch: 0, frets: [-1, 3, 1, 0, 1, 3] },
    { name: "Cmaj7b5", pitch: 0, frets: [-1, 3, 2, 4, 0, 2] },
    { name: "Cmmaj11", pitch: 0, frets: [-1, 3, 1, 0, 0, 1] },
    { name: "Cmmaj7b5", pitch: 0, frets: [-1, 3, -1, 4, 4, 2] },
    { name: "Cmmaj7", pitch: 0, frets: [-1, 3, 1, 0, 0, -1] },
    { name: "Cmmaj9", pitch: 0, frets: [-1, 3, 1, 4, 3, -1] },
    { name: "Csus2", pitch: 0, frets: [-1, 3, 0, 0, 1, 3] },
    { name: "Csus4", pitch: 0, frets: [-1, 3, 3, 0, 1, 1] },
    { name: "C#11", pitch: 1, frets: [-1, 4, 3, 0, 0, 4] },
    { name: "C#6", pitch: 1, frets: [-1, 4, 3, 3, 2, -1] },
    { name: "C#13", pitch: 1, frets: [-1, 4, 3, 3, 0, 2] },
    { name: "C#7#9", pitch: 1, frets: [-1, 4, 3, 4, 2, 0] },
    { name: "C#69", pitch: 1, frets: [-1, 4, 1, 3, 2, 1] },
    { name: "C#7", pitch: 1, frets: [-1, 4, 3, 4, 2, -1] },
    { name: "C#7b9", pitch: 1, frets: [-1, 4, 3, 4, 3, 4] },
    { name: "C#7sus4", pitch: 1, frets: [-1, 4, 4, 4, 2, 2] },
    { name: "C#7b5", pitch: 1, frets: [-1, 4, 3, 0, 0, 1] },
    { name: "C#9#11", pitch: 1, frets: [-1, 3, 2, 0, 0, 3] },
    { name: "C#9", pitch: 1, frets: [4, 4, 3, 4, 4, 4] },
    { name: "C#alt", pitch: 1, frets: [-1, 4, 3, 0, 2, 1] },
    { name: "C#add9", pitch: 1, frets: [-1, 4, 3, 1, 4, 1] },
    { name: "C#9b5", pitch: 1, frets: [-1, 4, 3, 4, 4, 3] },
    { name: "C#aug", pitch: 1, frets: [-1, 4, 4, 4, 2, 2] },
    { name: "C#aug7", pitch: 1, frets: [-1, 4, 3, 2, 0, 1] },
    { name: "C#dim", pitch: 1, frets: [-1, 4, 2, -1, 2, 3] },
    { name: "C#aug9", pitch: 1, frets: [-1, 4, 3, 4, 4, 5] },
    { name: "C#dim7", pitch: 1, frets: [-1, -1, 2, 3, 2, 3] },
    { name: "C#m11", pitch: 1, frets: [-1, 4, 2, 4, 2, 2] },
    { name: "C#m6", pitch: 1, frets: [-1, 4, 2, 3, 2, 4] },
    { name: "C#m7", pitch: 1, frets: [-1, 4, 6, 4, 5, 4] },
    { name: "C#m7b5", pitch: 1, frets: [-1, 4, 5, 4, 5, -1] },
    { name: "C#m69", pitch: 1, frets: [-1, 4, 1, 3, 2, 0] },
    { name: "C#m9", pitch: 1, frets: [-1, 4, 2, 4, 4, 4] },
    { name: "C#madd9", pitch: 1, frets: [-1, 4, 2, 1, 4, -1] },
    { name: "C#maj11", pitch: 1, frets: [-1, 4, 3, 5, 2, 2] },
    { name: "C#maj7#5", pitch: 1, frets: [1, 4, 3, 2, 1, 1] },
    { name: "C#maj13", pitch: 1, frets: [-1, 4, 1, 3, 1, 1] },
    { name: "C#maj7", pitch: 1, frets: [-1, 4, 3, 1, 1, 1] },
    { name: "C#maj7b5", pitch: 1, frets: [-1, 4, 3, 5, 6, 3] },
    { name: "C#maj9", pitch: 1, frets: [-1, 4, 1, 1, 1, 1] },
    { name: "C#m", pitch: 1, frets: [-1, 4, 2, 1, 2, -1] },
    { name: "C#mmaj11", pitch: 1, frets: [-1, 4, 2, 5, 4, 2] },
    { name: "C#", pitch: 1, frets: [-1, 4, 3, 1, 2, 1] },
    { name: "C#mmaj7", pitch: 1, frets: [-1, 4, 2, 1, 1, -1] },
    { name: "C#mmaj7b5", pitch: 1, frets: [-1, 4, 2, 0, 1, 0] },
    { name: "C#mmaj9", pitch: 1, frets: [-1, 4, 1, 1, 1, 0] },
    { name: "C#sus2", pitch: 1, frets: [4, 4, 6, 6, 4, 4] },
    { name: "C#sus4", pitch: 1, frets: [-1, 4, 4, 1, 2, -1] },
    { name: "Db", pitch: 1, frets: [-1, 4, 3, 1, 2, 1] },
    { name: "D6sus4", pitch: 2, frets: [-1, -1, 0, 2, 0, 3] },
    { name: "D11", pitch: 2, frets: [-1, -1, 0, 0, 1, 2] },
    { name: "D69", pitch: 2, frets: [-1, 5, 4, 2, 0, 0] },
    { name: "D13", pitch: 2, frets: [-1, -1, 0, 4, 1, 2] },
    { name: "D7#9", pitch: 2, frets: [-1, 5, 4, 5, 6, -1] },
    { name: "D7b5", pitch: 2, frets: [-1, -1, 0, 1, 1, 2] },
    { name: "D6", pitch: 2, frets: [-1, -1, 0, 2, 0, 2] },
    { name: "D7", pitch: 2, frets: [-1, -1, 0, 2, 1, 2] },
    { name: "D7b9", pitch: 2, frets: [-1, -1, 0, 5, 4, 2] },
    { name: "D7sus4", pitch: 2, frets: [-1, -1, 0, 2, 1, 3] },
    { name: "D9", pitch: 2, frets: [5, 5, 4, 5, 5, 5] },
    { name: "D9#11", pitch: 2, frets: [-1, -1, 0, 1, 1, 2] },
    { name: "D9b5", pitch: 2, frets: [-1, 5, 4, 5, 5, 4] },
    { name: "Dadd9", pitch: 2, frets: [-1, 5, 4, 2, 5, 2] },
    { name: "Dalt", pitch: 2, frets: [-1, -1, 0, 1, 3, 2] },
    { name: "Daug7", pitch: 2, frets: [-1, -1, 0, 3, 1, 2] },
    { name: "Daug", pitch: 2, frets: [-1, -1, 0, 3, 3, 2] },
    { name: "Daug9", pitch: 2, frets: [-1, 5, 4, 5, 5, 6] },
    { name: "Ddim", pitch: 2, frets: [-1, -1, 0, 1, -1, 1] },
    { name: "Ddim7", pitch: 2, frets: [-1, -1, 0, 1, 0, 1] },
    { name: "Dm6", pitch: 2, frets: [-1, -1, 0, 2, 0, 1] },
    { name: "Dm11", pitch: 2, frets: [-1, -1, 0, 0, 1, 1] },
    { name: "Dm69", pitch: 2, frets: [-1, 5, 3, 2, 0, 0] },
    { name: "Dm7", pitch: 2, frets: [-1, -1, 0, 2, 1, 1] },
    { name: "Dm7b5", pitch: 2, frets: [-1, -1, 0, 1, 1, 1] },
    { name: "Dmadd9", pitch: 2, frets: [-1, 5, 3, 2, 3, 0] },
    { name: "Dm9", pitch: 2, frets: [1, 0, 0, 2, 1, 0] },
    { name: "Dmaj11", pitch: 2, frets: [-1, -1, 0, 0, 2, 2] },
    { name: "Dmaj13", pitch: 2, frets: [-1, -1, 0, 4, 2, 2] },
    { name: "Dmaj7#5", pitch: 2, frets: [-1, -1, 0, 3, 2, 2] },
    { name: "Dm", pitch: 2, frets: [-1, -1, 0, 2, 3, 1] },
    { name: "Dmaj7b5", pitch: 2, frets: [-1, -1, 0, 1, 2, 2] },
    { name: "Dmaj7", pitch: 2, frets: [-1, -1, 0, 2, 2, 2] },
    { name: "D", pitch: 2, frets: [-1, -1, 0, 2, 3, 2] },
    { name: "Dmaj9", pitch: 2, frets: [-1, 5, 2, 2, 2, 2] },
    { name: "Dmmaj11", pitch: 2, frets: [-1, -1, 0, 0, 2, 1] },
    { name: "Dsus4", pitch: 2, frets: [-1, -1, 0, 2, 3, 3] },
    { name: "Dmmaj7", pitch: 2, frets: [-1, -1, 0, 2, 2, 1] },
    { name: "Dmmaj7b5", pitch: 2, frets: [-1, -1, 0, 1, 2, 1] },
    { name: "Dmmaj9", pitch: 2, frets: [-1, 5, 3, 6, 5, 0] },
    { name: "Dsus2", pitch: 2, frets: [-1, -1, 0, 2, 3, 0] },
    { name: "Dsus6", pitch: 2, frets: [-1, -1, 0, 0, 0, 3] },
    { name: "E13", pitch: 4, frets: [0, 2, 0, 1, 2, 0] },
    { name: "E6", pitch: 4, frets: [0, 2, 2, 1, 2, 0] },
    { name: "E11", pitch: 4, frets: [0, 0, 0, 1, 0, 0] },
    { name: "E69", pitch: 4, frets: [0, 2, 2, 1, 2, 2] },
    { name: "E7#9", pitch: 4, frets: [0, 2, 0, 1, 0, 3] },
    { name: "E7", pitch: 4, frets: [0, 2, 0, 1, 0, 0] },
    { name: "E7b9", pitch: 4, frets: [0, 2, 0, 1, 0, 1] },
    { name: "E7b5", pitch: 4, frets: [0, 1, 0, 1, 3, 0] },
    { name: "E7sus4", pitch: 4, frets: [0, 2, 0, 2, 0, 0] },
    { name: "E9#11", pitch: 4, frets: [0, 1, 0, 1, 0, 0] },
    { name: "E9b5", pitch: 4, frets: [0, 1, 2, 1, 3, 2] },
    { name: "Eadd9", pitch: 4, frets: [0, 2, 2, 1, 0, 2] },
    { name: "Ealt", pitch: 4, frets: [0, 1, 2, 1, -1, -1] },
    { name: "E9", pitch: 4, frets: [0, 2, 0, 1, 0, 2] },
    { name: "Eaug7", pitch: 4, frets: [0, 3, 0, 1, 1, 0] },
    { name: "Eaug", pitch: 4, frets: [0, 3, 2, 1, 1, 0] },
    { name: "Eaug9", pitch: 4, frets: [0, 3, 0, 1, 3, 2] },
    { name: "Em11", pitch: 4, frets: [0, 0, 0, 0, 0, 2] },
    { name: "Edim", pitch: 4, frets: [-1, -1, 2, 3, -1, 3] },
    { name: "Edim7", pitch: 4, frets: [0, 1, 2, 0, 2, 0] },
    { name: "Em6", pitch: 4, frets: [0, 2, 2, 0, 2, 0] },
    { name: "Em69", pitch: 4, frets: [0, 2, 2, 0, 2, 2] },
    { name: "Em7", pitch: 4, frets: [0, 2, 0, 0, 0, 0] },
    { name: "Em9", pitch: 4, frets: [0, 2, 0, 0, 0, 2] },
    { name: "Em7b5", pitch: 4, frets: [0, 1, 2, 3, 3, 3] },
    { name: "Emadd9", pitch: 4, frets: [-1, -1, 3, 1, 1, 3] },
    { name: "Emaj13", pitch: 4, frets: [0, 2, 1, 1, 2, 2] },
    { name: "Emaj11", pitch: 4, frets: [0, 0, 1, 1, 0, 0] },
    { name: "Emaj7", pitch: 4, frets: [0, 2, 1, 1, 0, 0] },
    { name: "Emaj7#5", pitch: 4, frets: [0, 3, 2, 1, 4, 4] },
    { name: "Emaj7b5", pitch: 4, frets: [0, 1, 1, 1, 4, 0] },
    { name: "Emaj9", pitch: 4, frets: [0, 2, 1, 1, 0, 2] },
    { name: "E", pitch: 4, frets: [0, 2, 2, 1, 0, 0] },
    { name: "Emmaj11", pitch: 4, frets: [0, 0, 1, 0, 0, 2] },
    { name: "Em", pitch: 4, frets: [0, 2, 2, 0, 0, 0] },
    { name: "Emmaj7", pitch: 4, frets: [0, 2, 1, 0, 0, 0] },
    { name: "Emmaj7b5", pitch: 4, frets: [0, 1, 1, 0, -1, 0] },
    { name: "Esus2", pitch: 4, frets: [2, 2, 2, 4, 5, 2] },
    { name: "Esus4", pitch: 4, frets: [0, 2, 2, 2, 0, 0] },
    { name: "Eb13", pitch: 3, frets: [-1, 6, 5, 6, 8, 8] },
    { name: "Emmaj9", pitch: 4, frets: [0, 2, 1, 0, 0, 2] },
    { name: "Eb11", pitch: 3, frets: [1, 1, 1, 1, 2, 3] },
    { name: "Eb6", pitch: 3, frets: [-1, -1, 1, 3, 1, 3] },
    { name: "Eb69", pitch: 3, frets: [-1, -1, 1, 0, 1, 1] },
    { name: "Eb7", pitch: 3, frets: [-1, -1, 1, 3, 2, 3] },
    { name: "Eb7#9", pitch: 3, frets: [-1, -1, 1, 0, 2, 2] },
    { name: "Eb7b5", pitch: 3, frets: [-1, -1, 1, 2, 2, 3] },
    { name: "Eb7b9", pitch: 3, frets: [-1, -1, 1, 0, 2, 0] },
    { name: "Eb7sus4", pitch: 3, frets: [-1, -1, 1, 3, 2, 4] },
    { name: "Eb9", pitch: 3, frets: [-1, -1, 1, 0, 2, 1] },
    { name: "Eb9b5", pitch: 3, frets: [-1, 6, 5, 6, 6, 5] },
    { name: "Eb9#11", pitch: 3, frets: [-1, -1, 1, 2, 2, 3] },
    { name: "Ebadd9", pitch: 3, frets: [-1, 6, 5, 3, 6, 3] },
    { name: "Ebalt", pitch: 3, frets: [-1, -1, 1, 2, 4, 3] },
    { name: "Ebaug", pitch: 3, frets: [-1, -1, 5, 4, 4, 3] },
    { name: "Ebaug9", pitch: 3, frets: [3, 4, 3, 4, 4, 3] },
    { name: "Ebaug7", pitch: 3, frets: [-1, -1, 1, 4, 2, 3] },
    { name: "Ebdim", pitch: 3, frets: [-1, -1, 1, 2, -1, 2] },
    { name: "Ebdim7", pitch: 3, frets: [-1, -1, 1, 2, 1, 2] },
    { name: "Ebm11", pitch: 3, frets: [-1, -1, 1, 1, 2, 2] },
    { name: "Ebm69", pitch: 3, frets: [2, -1, 1, 3, 1, 1] },
    { name: "Ebm7", pitch: 3, frets: [-1, -1, 1, 3, 2, 2] },
    { name: "Ebm6", pitch: 3, frets: [-1, 1, 1, 3, 1, 2] },
    { name: "Ebm7b5", pitch: 3, frets: [-1, -1, 1, 2, 2, 2] },
    { name: "Ebm9", pitch: 3, frets: [-1, 6, 4, 6, 6, 6] },
    { name: "Ebmadd9", pitch: 3, frets: [-1, -1, 4, 3, 4, 1] },
    { name: "Ebmaj11", pitch: 3, frets: [-1, -1, 1, 1, 3, 3] },
    { name: "Ebmaj13", pitch: 3, frets: [-1, 3, 1, 0, 3, -1] },
    { name: "Ebmaj7#5", pitch: 3, frets: [3, 6, 5, 4, 3, 3] },
    { name: "Ebmaj7", pitch: 3, frets: [-1, 1, 1, 3, 3, 3] },
    { name: "Ebmaj9", pitch: 3, frets: [-1, 6, 3, 3, 3, 3] },
    { name: "Ebm", pitch: 3, frets: [-1, -1, 1, 3, 4, 2] },
    { name: "Ebmaj7b5", pitch: 3, frets: [-1, -1, 1, 2, 3, 3] },
    { name: "Ebmmaj11", pitch: 3, frets: [-1, 1, 1, 1, 3, 2] },
    { name: "Eb", pitch: 3, frets: [-1, -1, 1, 3, 4, 3] },
    { name: "Ebmmaj7", pitch: 3, frets: [-1, -1, 1, 3, 3, 2] },
    { name: "Ebmmaj7b5", pitch: 3, frets: [-1, -1, 1, 2, 3, 2] },
    { name: "Ebsus2", pitch: 3, frets: [1, 1, 1, 3, 4, 1] },
    { name: "Ebmmaj9", pitch: 3, frets: [-1, 6, 4, 7, 6, -1] },
    { name: "F13", pitch: 5, frets: [1, 3, 1, 2, 3, 1] },
    { name: "Ebsus4", pitch: 3, frets: [-1, -1, 1, 3, 4, 4] },
    { name: "F6", pitch: 5, frets: [1, -1, 3, 2, 3, 1] },
    { name: "F11", pitch: 5, frets: [1, 1, 1, 2, 1, 1] },
    { name: "F69", pitch: 5, frets: [1, 0, 0, 0, 1, 1] },
    { name: "F7b5", pitch: 5, frets: [1, 0, 1, 2, 0, 1] },
    { name: "F7#9", pitch: 5, frets: [1, 3, 1, 2, 1, 4] },
    { name: "F7", pitch: 5, frets: [1, 3, 1, 2, 1, 1] },
    { name: "F7sus4", pitch: 5, frets: [1, 3, 1, 3, 1, 1] },
    { name: "F7b9", pitch: 5, frets: [1, 3, 1, 2, 1, 2] },
    { name: "F9#11", pitch: 5, frets: [1, 0, 1, 0, 0, 1] },
    { name: "F9b5", pitch: 5, frets: [1, 0, 1, 0, 0, 1] },
    { name: "Falt", pitch: 5, frets: [1, 2, 3, 2, 0, -1] },
    { name: "Fadd9", pitch: 5, frets: [-1, -1, 3, 2, 1, 3] },
    { name: "Faug7", pitch: 5, frets: [1, 0, 1, 2, 2, -1] },
    { name: "Faug9", pitch: 5, frets: [1, 0, 1, 0, 2, 1] },
    { name: "Faug", pitch: 5, frets: [-1, -1, 3, 2, 2, 1] },
    { name: "Fdim", pitch: 5, frets: [-1, -1, 3, 4, -1, 4] },
    { name: "Fdim7", pitch: 5, frets: [1, -1, 0, 1, 0, 1] },
    { name: "F9", pitch: 5, frets: [1, 3, 1, 2, 1, 3] },
    { name: "Fm11", pitch: 5, frets: [1, 1, 1, 1, 1, 3] },
    { name: "Fm69", pitch: 5, frets: [1, 3, 3, 1, 3, 3] },
    { name: "Fm6", pitch: 5, frets: [1, -1, 0, 1, 1, 1] },
    { name: "Fm7", pitch: 5, frets: [1, 3, 1, 1, 1, 1] },
    { name: "Fm7b5", pitch: 5, frets: [1, -1, 1, 1, 0, -1] },
    { name: "Fmaj11", pitch: 5, frets: [1, 1, 2, 2, 1, 1] },
    { name: "Fm9", pitch: 5, frets: [1, 3, 1, 1, 1, 3] },
    { name: "Fmadd9", pitch: 5, frets: [-1, -1, 3, 1, 1, 3] },
    { name: "Fmaj13", pitch: 5, frets: [1, 0, 0, 0, 1, 0] },
    { name: "Fmaj7#5", pitch: 5, frets: [1, 0, 2, 2, 2, 0] },
    { name: "Fmaj7", pitch: 5, frets: [-1, -1, 3, 2, 1, 0] },
    { name: "Fmaj7b5", pitch: 5, frets: [1, 0, 2, 2, 0, 0] },
    { name: "Fmaj9", pitch: 5, frets: [1, 0, 2, 0, 1, 0] },
    { name: "Fmmaj11", pitch: 5, frets: [1, 1, 2, 1, 1, 3] },
    { name: "F", pitch: 5, frets: [1, 3, 3, 2, 1, 1] },
    { name: "Fm", pitch: 5, frets: [1, 3, 3, 1, 1, 1] },
    { name: "Fmmaj7", pitch: 5, frets: [1, 3, 2, 1, 1, 1] },
    { name: "Fmmaj7b5", pitch: 5, frets: [1, 2, 2, 1, 0, 0] },
    { name: "F#11", pitch: 6, frets: [2, 1, 2, 1, 0, 0] },
    { name: "Fmmaj9", pitch: 5, frets: [1, 3, 2, 1, 1, 3] },
    { name: "Fsus2", pitch: 5, frets: [1, 3, 3, -1, 1, 3] },
    { name: "F#6", pitch: 6, frets: [2, -1, 1, 3, 2, -1] },
    { name: "F#13", pitch: 6, frets: [2, 2, 1, 3, 0, 0] },
    { name: "Fsus4", pitch: 5, frets: [1, 3, 3, 3, 1, 1] },
    { name: "F#69", pitch: 6, frets: [2, 1, 1, 1, 2, 2] },
    { name: "F#7#9", pitch: 6, frets: [2, 1, 2, 2, 2, 2] },
    { name: "F#7", pitch: 6, frets: [2, 4, 2, 3, 2, 2] },
    { name: "F#7b9", pitch: 6, frets: [2, 1, 2, 0, 2, 0] },
    { name: "F#7sus4", pitch: 6, frets: [2, 4, 2, 4, 2, 2] },
    { name: "F#9#11", pitch: 6, frets: [2, 1, 2, 1, 1, 2] },
    { name: "F#7b5", pitch: 6, frets: [2, -1, 2, 3, 1, -1] },
    { name: "F#aug", pitch: 6, frets: [-1, -1, 4, 3, 3, 2] },
    { name: "F#add9", pitch: 6, frets: [2, 1, -1, 1, 2, 2] },
    { name: "F#9", pitch: 6, frets: [2, 4, 2, 3, 2, 4] },
    { name: "F#9b5", pitch: 6, frets: [2, 1, 2, 1, 1, 2] },
    { name: "F#alt", pitch: 6, frets: [-1, -1, 4, 3, 1, 2] },
    { name: "F#aug7", pitch: 6, frets: [2, -1, 2, 3, 3, -1] },
    { name: "F#aug9", pitch: 6, frets: [2, 1, 2, 1, 3, 0] },
    { name: "F#dim7", pitch: 6, frets: [2, -1, 1, 2, 1, -1] },
    { name: "F#dim", pitch: 6, frets: [2, 0, -1, 2, 1, -1] },
    { name: "F#m6", pitch: 6, frets: [2, -1, 1, 2, 2, 2] },
    { name: "F#m11", pitch: 6, frets: [2, 0, 2, 1, 0, 0] },
    { name: "F#m69", pitch: 6, frets: [2, 0, 1, 1, 2, 2] },
    { name: "F#m7b5", pitch: 6, frets: [2, 0, 2, 2, 1, 0] },
    { name: "F#madd9", pitch: 6, frets: [-1, -1, 4, 2, 2, 4] },
    { name: "F#m9", pitch: 6, frets: [2, 0, 2, 1, 2, 0] },
    { name: "F#m7", pitch: 6, frets: [2, 4, 2, 2, 2, 2] },
    { name: "F#maj13", pitch: 6, frets: [2, 1, 1, 1, 2, 1] },
    { name: "F#maj11", pitch: 6, frets: [2, 2, 3, 3, 2, 2] },
    { name: "F#maj7#5", pitch: 6, frets: [2, -1, 3, 3, 3, -1] },
    { name: "F#maj7b5", pitch: 6, frets: [2, 1, 3, 3, 1, 1] },
    { name: "F#maj7", pitch: 6, frets: [2, 4, 3, 3, 2, 2] },
    { name: "F#maj9", pitch: 6, frets: [2, 1, 3, 1, 2, 1] },
    { name: "F#", pitch: 6, frets: [2, 4, 4, 3, 2, 2] },
    { name: "F#mmaj11", pitch: 6, frets: [2, 2, 3, 2, 2, 4] },
    { name: "F#m", pitch: 6, frets: [2, 4, 4, 2, 2, 2] },
    { name: "F#mmaj7b5", pitch: 6, frets: [2, 3, 3, 2, -1, 2] },
    { name: "F#mmaj7", pitch: 6, frets: [2, 4, 3, 2, 2, 2] },
    { name: "F#sus2", pitch: 6, frets: [2, -1, -1, 1, 2, 2] },
    { name: "F#sus4", pitch: 6, frets: [2, 4, 4, 4, 2, 2] },
    { name: "F#mmaj9", pitch: 6, frets: [2, 0, 3, 1, 2, 1] },
    { name: "G13", pitch: 7, frets: [3, 0, 2, 0, 0, 1] },
    { name: "G11", pitch: 7, frets: [3, 2, 0, 0, 1, 1] },
    { name: "G6", pitch: 7, frets: [3, 2, 0, 0, 0, 0] },
    { name: "G69", pitch: 7, frets: [3, 0, 0, 0, 0, 0] },
    { name: "G7#9", pitch: 7, frets: [3, 2, 0, 3, 0, 1] },
    { name: "G7b9", pitch: 7, frets: [3, 2, 0, 1, 3, 1] },
    { name: "G7", pitch: 7, frets: [3, 2, 0, 0, 0, 1] },
    { name: "G7b5", pitch: 7, frets: [3, -1, 3, 4, 2, -1] },
    { name: "G7sus4", pitch: 7, frets: [3, 3, 0, 0, 1, 1] },
    { name: "G9#11", pitch: 7, frets: [3, 2, 3, 2, 2, 3] },
    { name: "G9", pitch: 7, frets: [3, 0, 0, 0, 0, 1] },
    { name: "G9b5", pitch: 7, frets: [3, 2, 3, 2, 2, 3] },
    { name: "Galt", pitch: 7, frets: [3, 2, -1, 0, 2, 3] },
    { name: "Gaug", pitch: 7, frets: [3, 2, 1, 0, 0, -1] },
    { name: "Gadd9", pitch: 7, frets: [3, 0, 0, 2, 0, 3] },
    { name: "Gaug7", pitch: 7, frets: [3, 2, 1, 0, 0, 1] },
    { name: "Gaug9", pitch: 7, frets: [3, 0, 1, 0, 0, 1] },
    { name: "Gm11", pitch: 7, frets: [3, -1, 3, 3, 1, -1] },
    { name: "Gdim", pitch: 7, frets: [3, 1, -1, 3, 2, -1] },
    { name: "Gm6", pitch: 7, frets: [3, -1, 2, 3, 3, 3] },
    { name: "Gm7", pitch: 7, frets: [3, 5, 3, 3, 3, 3] },
    { name: "Gm69", pitch: 7, frets: [3, 1, 0, 2, 3, 0] },
    { name: "Gm7b5", pitch: 7, frets: [3, -1, -1, 3, 2, 1] },
    { name: "Gm9", pitch: 7, frets: [3, 0, 0, 3, 3, 1] },
    { name: "Gdim7", pitch: 7, frets: [3, 1, -1, 3, 2, 0] },
    { name: "Gmaj11", pitch: 7, frets: [3, 2, 0, 0, 1, 2] },
    { name: "Gmadd9", pitch: 7, frets: [3, 1, 0, 2, 3, 3] },
    { name: "Gmaj13", pitch: 7, frets: [3, 2, 2, 2, 3, 2] },
    { name: "Gmaj7b5", pitch: 7, frets: [3, 2, 4, 4, 2, 2] },
    { name: "Gmaj7", pitch: 7, frets: [3, 2, 0, 0, 0, 2] },
    { name: "Gmaj7#5", pitch: 7, frets: [-1, -1, 1, 0, 0, 2] },
    { name: "Gm", pitch: 7, frets: [3, 1, 0, 0, 3, 3] },
    { name: "Gmmaj11", pitch: 7, frets: [3, 3, 4, 3, 3, 5] },
    { name: "G", pitch: 7, frets: [3, 2, 0, 0, 0, 3] },
    { name: "Gmaj9", pitch: 7, frets: [3, 0, 0, 0, 0, 2] },
    { name: "Gmmaj7b5", pitch: 7, frets: [3, 4, 4, 3, -1, 3] },
    { name: "Gmmaj7", pitch: 7, frets: [3, 1, 0, 0, 3, 2] },
    { name: "Gsus2", pitch: 7, frets: [3, 0, 0, 0, 3, 3] },
    { name: "Gmmaj9", pitch: 7, frets: [3, 0, 0, 3, 3, 2] },
    { name: "Gsus4", pitch: 7, frets: [3, 3, 0, 0, 1, 3] },
    { name: "G#m", pitch: 6, frets: [4, 6, 6, 4, 4, 4] }
];
var scaleModes = [
    { name: 'Ionian', steps: /*      */ [0, 2, 4, 5, 7, 9, 11, 12], flat: false, priority: 7 } //C
    ,
    { name: 'Dorian', steps: /*    */ [0, 2, 3, 5, 7, 9, 10, 12], flat: true, priority: 5 } //D
    ,
    { name: 'Phrygian', steps: /*  */ [0, 1, 3, 5, 7, 8, 10, 12], flat: true, priority: 4 } //E
    ,
    { name: 'Lydian', steps: /*    */ [0, 2, 4, 6, 7, 9, 11, 12], flat: false, priority: 3 } //F
    ,
    { name: 'Mixolydian', steps: /**/ [0, 2, 4, 5, 7, 9, 10, 12], flat: false, priority: 2 } //G
    ,
    { name: 'Aeolian', steps: /*   */ [0, 2, 3, 5, 7, 8, 10, 12], flat: true, priority: 6 } //A
    ,
    { name: 'Locrian', steps: /*   */ [0, 1, 3, 5, 6, 8, 10, 12], flat: true, priority: 1 } //B
];
var progressionsList = [
    //{ category: 'test', name: '', chords: 'C-Ab-Bb-C' },
    //
    //{ category: 'minor', name: '', chords: 'D-C-Bb-F' }
    { category: 'minor', name: '', chords: 'Fmaj7-A' }
    //
    ,
    { category: 'minor', name: '', chords: 'Am-B-Gm' },
    { category: 'minor', name: '', chords: 'Am-Dm-E' },
    { category: 'blues', name: '', chords: 'C#m-E-B-A' }
    //
    ,
    { category: 'minor', name: '', chords: 'Am-C-Dm-Em' },
    { category: 'minor', name: '', chords: 'Am-D7-E7-Am' },
    { category: 'minor', name: '', chords: 'Am-D9-Fm-C' },
    { category: 'minor', name: '', chords: 'Am-Dm-F-G' },
    { category: 'minor', name: '', chords: 'Am-Dm-Fm-C' },
    { category: 'minor', name: '', chords: 'Am-Em-G-Dm' },
    { category: 'minor', name: '', chords: 'Am-F-C-G' },
    { category: 'minor', name: '', chords: 'Am-F-Em-Am' },
    { category: 'minor', name: '', chords: 'Am-G-Dm7' },
    { category: 'minor', name: '', chords: 'Am-G-Em-F' },
    { category: 'minor', name: '', chords: 'Am-G-F-E7' },
    { category: 'minor', name: '', chords: 'Bm-A-G-F#' },
    { category: 'minor', name: '', chords: 'C-Am-Dm-G' },
    { category: 'minor', name: '', chords: 'C-D7-Fm-C' },
    { category: 'minor', name: '', chords: 'C-D7-G7-C' },
    { category: 'minor', name: '', chords: 'C-E-Am7-F' },
    { category: 'minor', name: '', chords: 'Dm-Am-C-G' },
    { category: 'minor', name: '', chords: 'Dm-F-Am-G' },
    { category: 'minor', name: '', chords: 'Em-B-C-Am' },
    { category: 'minor', name: '', chords: 'Em-B-G-Em' },
    { category: 'minor', name: '', chords: 'Em-C-G-D' },
    { category: 'minor', name: '', chords: 'Em-D-C-D' },
    { category: 'minor', name: '', chords: 'Em-D-C-B' },
    { category: 'minor', name: '', chords: 'Em-G-C-Am' },
    { category: 'rock', name: '', chords: 'Em-G-Dsus4-A7sus4' },
    { category: 'minor', name: '', chords: 'F-Em7-Am-G' },
    { category: 'minor', name: '', chords: 'G-C-D-Em' }
    //
    ,
    { category: 'minor', name: '', chords: 'Dm-Gm-Dm-A-Dm' },
    { category: 'minor', name: '', chords: 'F-Em-Am-G-Am' }
    //, { category: 'rock', name: '', chords: 'F-Em-Am-G-Am' }
    //
    ,
    { category: 'minor', name: '', chords: 'Am-C-D-Am-C-Am' },
    { category: 'minor', name: '', chords: 'Am-Dsus4-Dm-F-G-Dm7' },
    { category: 'minor', name: '', chords: 'Am-F7-G-Em-F-G' },
    { category: 'minor', name: '', chords: 'Am-G-C-F-E-E7' },
    { category: 'minor', name: '', chords: 'Am-G-Dm-F-G-Am' }
    //
    ,
    { category: 'minor', name: '', chords: 'Am-E-Em-D-Dm-Am-Adim-E' },
    { category: 'minor', name: '', chords: 'Am-F-E7-Am-Dm7-Gsus4-F-E7' },
    { category: 'minor', name: '', chords: 'Gm-Cm-F-Bb-Eb-Adim-D-Gm' },
    { category: 'epic', name: '', chords: 'Dm-Bb-C-Gm-Bb-F-Gm-Dm' }
    ///////////////////////
    ,
    { category: 'jazz', name: '', chords: 'Am-G-D' },
    { category: 'jazz', name: '', chords: 'C-Gm-Dm' },
    { category: 'jazz', name: '', chords: 'Cmaj7-Cm7-F7' },
    { category: 'jazz', name: '', chords: 'Dm7-G7-Cmaj7' }
    //
    ,
    { category: 'nice', name: '', chords: 'Am7-Em7-Dsus4-Dm7' },
    { category: 'jazz', name: '', chords: 'Am-F7-D7-E7' },
    { category: 'minor', name: '', chords: 'Am7-F7-G-Em7' },
    { category: 'jazz', name: '', chords: 'C-Am-E-G' },
    { category: 'jazz', name: '', chords: 'C-D7-F-C' },
    { category: 'jazz', name: '', chords: 'C-F-G-G7' },
    { category: 'jazz', name: '', chords: 'Cm7-Ab7-G7' },
    { category: 'jazz', name: '', chords: 'Cmaj7-Gm7-C7-Fmaj7' },
    { category: 'jazz', name: '', chords: 'D7-G7-C7-F7' },
    { category: 'jazz', name: '', chords: 'Dm7-G7-Cmaj7-C6' },
    { category: 'pop', name: '', chords: 'F#m7-B7-E-A' }
    //
    ,
    { category: 'jazz', name: '', chords: 'Cmaj7-D7-Dm7-G7-Cmaj7' },
    { category: 'rock', name: '', chords: 'Em-G-D-C-A' }
    //
    ,
    { category: 'jazz', name: '', chords: 'Cmaj7-Am7-Dm7-G7-Em7-A7-Dm7-G7' }
    //
    ,
    { category: 'jazz', name: '', chords: 'Cmaj7-C7-Fmaj7-Fm7-Em7-A7-Dm7-G7-Cmaj7' }
    ///////////////////////////
    ,
    { category: 'major', name: '', chords: 'A-D-E' },
    { category: 'major', name: '', chords: 'Am-D-G' },
    { category: 'major', name: '', chords: 'C-Am-F' },
    { category: 'major', name: '', chords: 'C-F-G' },
    { category: 'rock', name: '', chords: 'D-C-G' },
    { category: 'nice', name: '', chords: 'F-Am-G' },
    { category: 'blues', name: '', chords: 'F-Bb-C' },
    { category: 'major', name: '', chords: 'G-C-D' }
    //
    ,
    { category: 'blues', name: '', chords: 'Am-G-D-F' },
    { category: 'triumphant', name: '', chords: 'C-Ab-Bb-C' },
    { category: 'major', name: '', chords: 'C-Am-Em-F' },
    { category: 'happy', name: '', chords: 'C-Am-F-G' },
    { category: 'major', name: '', chords: 'C-Dm-F-G' },
    { category: 'epic', name: '', chords: 'C-G-Am-F' },
    { category: 'nice', name: '', chords: 'C-F-G-Am' },
    { category: 'major', name: '', chords: 'C-F-C-G' },
    { category: 'major', name: '', chords: 'C-F-Dm-G' },
    { category: 'major', name: '', chords: 'C-F-G-F' },
    { category: 'epic', name: '', chords: 'C-Fm-Bb7-C' },
    { category: 'epic', name: '', chords: 'Cm-Ab-Eb-Bb' },
    { category: 'major', name: '', chords: 'D-A-C-G' },
    { category: 'major', name: '', chords: 'D-C-G-D' },
    { category: 'rock', name: '', chords: 'D-C-Bb-F' },
    { category: 'rock', name: '', chords: 'D-G-Bm-A' },
    { category: 'major', name: '', chords: 'E-B-C#m-A' },
    { category: 'major', name: '', chords: 'E-G-A-G' },
    { category: 'major', name: '', chords: 'F-Am-G-D' },
    { category: 'major', name: '', chords: 'F-C-Dm-Bb' },
    { category: 'major', name: '', chords: 'F-G-Am-Em' },
    { category: 'epic', name: '', chords: 'Fm-Db-Ab-Eb' },
    { category: 'major', name: '', chords: 'G-C-D-C' },
    { category: 'major', name: '', chords: 'G-C-F-C' },
    { category: 'major', name: '', chords: 'G-D-Em-C' },
    { category: 'major', name: '', chords: 'G-Em-C-D' }
    //
    ,
    { category: 'major', name: '', chords: 'C-G-F-G-C' },
    { category: 'rock', name: '', chords: 'D-F-G-C-G' },
    { category: 'major', name: '', chords: 'D-G-D-A-D' },
    { category: 'rock', name: '', chords: 'E-B-C#m-G#m-A' },
    { category: 'epic', name: '', chords: 'F-Am-F-G-C' }
    //
    ,
    { category: 'major', name: '', chords: 'A-E-F#m-D-A-E' },
    { category: 'major', name: '', chords: 'C-Dm-Am7-F-G-C' }
    //
    ,
    { category: 'epic', name: '', chords: 'Am-Em-G-D-Am-Cmaj7-G-D' },
    { category: 'epic', name: '', chords: 'C-G-Am-Em-F-C-F-G' },
    { category: 'major', name: '', chords: 'D-A-Bm-F#m-G-D-G-A' },
    { category: 'epic', name: '', chords: 'E-C-D-Em-Em-G-Am-Bm' },
    { category: 'major', name: '', chords: 'F-Bb-Edim-Am-Dm-Gm-C-F' },
    { category: 'major', name: '', chords: 'G-D-Em-Bm-C-G-C-D' }
];
var drumBeatPatterns = [
//new DrumTechno1().track()
//, new SimpleDrum1().track()
//, new SimpleDrum2().track()
];
var strumPatterns = [
    'V-A-X-A-',
    'V---A-V---A-V-A-'
];
function duration2seconds(bpm, duration384) {
    var n4 = 60 / bpm;
    //let part = duration.division / (4 * duration.count);
    var part = 384 / (4 * duration384);
    return n4 / part;
}
function durations2time(measures) {
    var t = 0;
    for (var i = 0; i < measures.length; i++) {
        t = t + duration2seconds(measures[i].tempo, duration384(measures[i].meter));
    }
    return t;
}
function seconds2Duration384(time, bpm) {
    var n4 = 60 / bpm;
    var n384 = n4 / 96;
    return Math.round(time / n384);
}
function duration384(meter) {
    return meter.count * (384 / meter.division);
}
function calculateEnvelopeDuration(envelope) {
    var d = { count: 0, division: 1 };
    for (var i = 0; i < envelope.pitches.length; i++) {
        d = plusMeter(d, envelope.pitches[i].duration);
    }
    return d;
}
function plusMeter(a, b) {
    if (a.division == b.division) {
        return { count: a.count + b.count, division: a.division };
    }
    else {
        var r = { count: a.count * b.division + b.count * a.division, division: a.division * b.division };
        return r;
    }
}
function minusMeter(a, b) {
    if (a.division == b.division) {
        return { count: a.count - b.count, division: a.division };
    }
    else {
        var r = { count: a.count * b.division - b.count * a.division, division: a.division * b.division };
        return r;
    }
}
function simplifyMeter(meter) {
    var r = { count: meter.count, division: meter.division };
    while (r.division % 2 == 0 && r.count % 2 == 0) {
        r.division = r.division / 2;
        r.count = r.count / 2;
    }
    return r;
}
function meterMore(a, b) {
    var a1 = { count: a.count, division: a.division };
    var b1 = { count: b.count, division: b.division };
    a1 = plusMeter(a1, { count: 0, division: b.division });
    b1 = plusMeter(b1, { count: 0, division: a.division });
    if (a1.count == b1.count) {
        return 0;
    }
    else {
        if (a1.count > b1.count) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
/*
function scheduleDuration(schedule: ZvoogSchedule): ZvoogMeter {
    let duration: ZvoogMeter = { count: 0, division: 1 };
    for (let i = 0; i < schedule.measures.length; i++) {
        duration = plusMeter(duration, schedule.measures[i].meter);
    }
    return duration;
}*/
function scheduleDuration(measures) {
    var duration = { count: 0, division: 1 };
    for (var i = 0; i < measures.length; i++) {
        duration = plusMeter(duration, measures[i].meter);
    }
    return duration;
}
function progressionDuration(progression) {
    var duration = { count: 0, division: 1 };
    for (var i = 0; i < progression.length; i++) {
        duration = plusMeter(duration, progression[i].duration);
    }
    return duration;
}
function adjustPartLeadPad(voice, fromPosition, toPosition, measures) {
    var lowest = 120;
    var highest = 0;
    var measurePosition = { count: 0, division: 1 };
    for (var m = 0; m < voice.measureChords.length; m++) {
        var mch = voice.measureChords[m].chords;
        for (var ch = 0; ch < mch.length; ch++) {
            var chord = mch[ch];
            var chordPosition = plusMeter(measurePosition, chord.when);
            if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
                for (var e = 0; e < chord.envelopes.length; e++) {
                    var envelope = chord.envelopes[e];
                    for (var p = 0; p < envelope.pitches.length; p++) {
                        var pitch = envelope.pitches[p];
                        if (pitch.pitch < lowest) {
                            lowest = pitch.pitch;
                        }
                        if (pitch.pitch > highest) {
                            highest = pitch.pitch;
                        }
                    }
                }
            }
        }
        measurePosition = plusMeter(measurePosition, measures[m].meter);
    }
    if (lowest < 3 * 12 + 4) {
        var shift = 1 * 12;
        if (lowest < 2 * 12 + 4)
            shift = 2 * 12;
        if (lowest < 1 * 12 + 4)
            shift = 3 * 12;
        if (lowest < 0 * 12 + 4)
            shift = 4 * 12;
        //console.log('adjustPartLeadPad', lowest, '>', highest, ':', shift, voice.title, fromPosition);
        var measurePosition_1 = { count: 0, division: 1 };
        for (var m = 0; m < voice.measureChords.length; m++) {
            var mch = voice.measureChords[m].chords;
            for (var ch = 0; ch < mch.length; ch++) {
                var chord = mch[ch];
                var chordPosition = plusMeter(measurePosition_1, chord.when);
                if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
                    for (var e = 0; e < chord.envelopes.length; e++) {
                        var envelope = chord.envelopes[e];
                        for (var p = 0; p < envelope.pitches.length; p++) {
                            var pitch = envelope.pitches[p];
                            pitch.pitch = pitch.pitch + shift;
                        }
                    }
                }
            }
            measurePosition_1 = plusMeter(measurePosition_1, measures[m].meter);
        }
    }
    if (highest > 8 * 12 + 4) {
        var shift = 1 * 12;
        if (highest > 9 * 12 + 4)
            shift = 2 * 12;
        if (highest > 10 * 12 + 4)
            shift = 3 * 12;
        if (highest > 11 * 12 + 4)
            shift = 4 * 12;
        //console.log('adjustPartLeadPad', lowest, '>', highest, ':', shift, voice.title, fromPosition);
        var measurePosition_2 = { count: 0, division: 1 };
        for (var m = 0; m < voice.measureChords.length; m++) {
            var mch = voice.measureChords[m].chords;
            for (var ch = 0; ch < mch.length; ch++) {
                var chord = mch[ch];
                var chordPosition = plusMeter(measurePosition_2, chord.when);
                if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
                    for (var e = 0; e < chord.envelopes.length; e++) {
                        var envelope = chord.envelopes[e];
                        for (var p = 0; p < envelope.pitches.length; p++) {
                            var pitch = envelope.pitches[p];
                            pitch.pitch = pitch.pitch - shift;
                        }
                    }
                }
            }
            measurePosition_2 = plusMeter(measurePosition_2, measures[m].meter);
        }
    }
}
function adjustPartBass(voice, fromPosition, toPosition, measures) {
    var lowest = 120;
    var measurePosition = { count: 0, division: 1 };
    for (var m = 0; m < voice.measureChords.length; m++) {
        var mch = voice.measureChords[m].chords;
        for (var ch = 0; ch < mch.length; ch++) {
            var chord = mch[ch];
            var chordPosition = plusMeter(measurePosition, chord.when);
            if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
                for (var e = 0; e < chord.envelopes.length; e++) {
                    var envelope = chord.envelopes[e];
                    for (var p = 0; p < envelope.pitches.length; p++) {
                        var pitch = envelope.pitches[p];
                        if (pitch.pitch < lowest) {
                            lowest = pitch.pitch;
                        }
                    }
                }
            }
        }
        measurePosition = plusMeter(measurePosition, measures[m].meter);
    }
    if (lowest < 12 + 12 + 4) { //let shift=36;
        var shift = 12;
        if (lowest < 12 + 4)
            shift = 24;
        if (lowest < 4)
            shift = 36;
        //shift=shift+24;
        //console.log('adjustPartBass',lowest, '+', shift, voice.title,fromPosition);
        var measurePosition_3 = { count: 0, division: 1 };
        for (var m = 0; m < voice.measureChords.length; m++) {
            var mch = voice.measureChords[m].chords;
            for (var ch = 0; ch < mch.length; ch++) {
                var chord = mch[ch];
                var chordPosition = plusMeter(measurePosition_3, chord.when);
                if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
                    for (var e = 0; e < chord.envelopes.length; e++) {
                        var envelope = chord.envelopes[e];
                        for (var p = 0; p < envelope.pitches.length; p++) {
                            var pitch = envelope.pitches[p];
                            pitch.pitch = pitch.pitch + shift;
                        }
                    }
                }
            }
            measurePosition_3 = plusMeter(measurePosition_3, measures[m].meter);
        }
    }
}
function createBreakList(originalProg, targetProg, measures) {
    var list = [{ count: 0, division: 1 }];
    var fromPosition = { count: 0, division: 1 };
    for (var i = 0; i < originalProg.length; i++) {
        var part = originalProg[i];
        var toPosition = plusMeter(fromPosition, part.duration);
        list.push({ count: toPosition.count, division: toPosition.division });
        fromPosition = toPosition;
    }
    fromPosition = { count: 0, division: 1 };
    for (var i = 0; i < targetProg.length; i++) {
        var part = targetProg[i];
        var toPosition = plusMeter(fromPosition, part.duration);
        for (var kk = 0; kk < list.length - 1; kk++) {
            var kkPos = list[kk];
            var nxtPos = list[kk + 1];
            if (meterMore(kkPos, toPosition) == 0) {
                break;
            }
            else {
                if (meterMore(kkPos, toPosition) < 0 && meterMore(nxtPos, toPosition) > 0) {
                    list.splice(kk + 1, 0, { count: toPosition.count, division: toPosition.division });
                    break;
                }
            }
        }
        fromPosition = toPosition;
    }
    return list;
}
function adjustVoiceLowHigh(voice, originalProg, targetProg, measures, trackIsBass) {
    var list = createBreakList(originalProg, targetProg, measures);
    for (var i = 0; i < list.length - 1; i++) {
        if (trackIsBass) {
            adjustPartBass(voice, list[i], list[i + 1], measures);
        }
        else {
            adjustPartLeadPad(voice, list[i], list[i + 1], measures);
        }
    }
}
function addIns(insDef, track, beat, length, shift, pitch) {
    if (!(insDef[track]))
        insDef[track] = [];
    var measure = Math.floor(beat / 16);
    if (!(insDef[track][measure]))
        insDef[track][measure] = [];
    var step = beat % 16;
    insDef[track][measure].push({
        step: step,
        length: length,
        shift: shift,
        pitch: pitch
    });
}
function addDrumBeat(drumDef, drum, beat) {
    if (!(drumDef[drum]))
        drumDef[drum] = [];
    var measure = Math.floor(beat / 16);
    if (!(drumDef[drum][measure]))
        drumDef[drum][measure] = [];
    var step = beat % 16;
    drumDef[drum][measure].push(step);
}
function fromRiffShare(riffurl) {
    var drumInfo = [];
    var trackInfo = [];
    trackInfo.push({ kind: 'Distortion guitar', octave: 3, num: 339, volumeRatio: 0.7 });
    trackInfo.push({ kind: 'Acoustic guitar', octave: 3, num: 258, volumeRatio: 0.5 });
    trackInfo.push({ kind: 'Percussive Organ', octave: 4, num: 175, volumeRatio: 0.7 });
    trackInfo.push({ kind: 'PalmMute guitar', octave: 3, num: 305, volumeRatio: 1.0 });
    trackInfo.push({ kind: 'Acoustic Piano', octave: 3, num: 7, volumeRatio: 0.5 });
    trackInfo.push({ kind: 'Bass guitar', octave: 2, num: 384, volumeRatio: 0.75 });
    trackInfo.push({ kind: 'String Ensemble', octave: 3, num: 545, volumeRatio: 0.3 });
    trackInfo.push({ kind: 'Synth Bass', octave: 3, num: 437, volumeRatio: 0.5 });
    drumInfo.push({ kind: 'Bass drum', num: 1, pitch: 35, volumeRatio: 0.95 });
    drumInfo.push({ kind: 'Low Tom', num: 41, pitch: 41, volumeRatio: 0.5 });
    drumInfo.push({ kind: 'Snare drum', num: 16, pitch: 38, volumeRatio: 1.0 });
    drumInfo.push({ kind: 'Mid Tom', num: 51, pitch: 45, volumeRatio: 0.75 });
    drumInfo.push({ kind: 'Closed Hi-hat', num: 36, pitch: 42, volumeRatio: 0.5 });
    drumInfo.push({ kind: 'Open Hi-hat', num: 56, pitch: 46, volumeRatio: 0.5 });
    drumInfo.push({ kind: 'Ride Cymbal', num: 81, pitch: 51, volumeRatio: 0.3 });
    drumInfo.push({ kind: 'Splash Cymbal', num: 71, pitch: 49, volumeRatio: 0.3 });
    var strings = (riffurl.split('=')[1]).split('-');
    for (var i = 0; i < 8; i++) {
        var n = 10 * parseInt(strings[1].substring(i, i + 1), 16);
        trackInfo[i].volumeRatio = trackInfo[i].volumeRatio * n / 100.0;
    }
    for (var i = 0; i < 8; i++) {
        var n = 10 * parseInt(strings[2].substring(i, i + 1), 16);
        drumInfo[i].volumeRatio = drumInfo[i].volumeRatio * n / 100.0;
    }
    var convertedSchedule = {
        title: 'converted',
        tracks: [], effects: [], measures: [],
        harmony: { tone: 'C', mode: 'Ionian', progression: [] }
    };
    var tempo = parseInt(strings[0], 16);
    var drumDef = [];
    var cnt = strings[4].length / 4;
    var eq = [];
    for (var i = 0; i < 10; i++) {
        var t = strings[3].substring(i * 2, i * 2 + 2);
        var n = parseInt(t, 16) - 10;
        eq.push(1 * n);
    }
    for (var i = 0; i < cnt; i++) {
        var key = parseInt(strings[4].substring(i * 4, i * 4 + 2), 16);
        var data = parseInt(strings[4].substring(i * 4 + 2, i * 4 + 4), 16);
        var drum = key >> 5;
        var i32 = key & parseInt('11111', 2);
        var beat = -1;
        if ((data | parseInt('00000001', 2)) == data)
            addDrumBeat(drumDef, drum, i32 * 8 + 0);
        if ((data | parseInt('00000010', 2)) == data)
            addDrumBeat(drumDef, drum, i32 * 8 + 1);
        if ((data | parseInt('00000100', 2)) == data)
            addDrumBeat(drumDef, drum, i32 * 8 + 2);
        if ((data | parseInt('00001000', 2)) == data)
            addDrumBeat(drumDef, drum, i32 * 8 + 3);
        if ((data | parseInt('00010000', 2)) == data)
            addDrumBeat(drumDef, drum, i32 * 8 + 4);
        if ((data | parseInt('00100000', 2)) == data)
            addDrumBeat(drumDef, drum, i32 * 8 + 5);
        if ((data | parseInt('01000000', 2)) == data)
            addDrumBeat(drumDef, drum, i32 * 8 + 6);
        if ((data | parseInt('10000000', 2)) == data)
            addDrumBeat(drumDef, drum, i32 * 8 + 7);
    }
    var insDef = [];
    cnt = strings[5].length / 9;
    for (var i = 0; i < cnt; i++) {
        var beat = parseInt(strings[5].substring(i * 9, i * 9 + 2), 16);
        var track = parseInt(strings[5].substring(i * 9 + 2, i * 9 + 2 + 1), 16);
        var length = parseInt(strings[5].substring(i * 9 + 3, i * 9 + 3 + 2), 16);
        var pitch = parseInt(strings[5].substring(i * 9 + 5, i * 9 + 5 + 2), 16);
        var shift = parseInt(strings[5].substring(i * 9 + 7, i * 9 + 7 + 2), 16) - 64;
        addIns(insDef, track, beat, length, shift, pitch);
    }
    if (strings[6]) {
        for (var i = 0; i < 8; i++) {
            var r = parseInt(strings[6].substring(i * 3, i * 3 + 3), 16);
            if (r > 0) {
                drumInfo[i].num = r - 1;
            }
        }
    }
    if (strings[7]) {
        for (var i = 0; i < 8; i++) {
            var r = parseInt(strings[7].substring(i * 3, i * 3 + 3), 16);
            if (r > 0) {
                trackInfo[7 - i].num = r - 1;
            }
        }
    }
    var measureCount = 0;
    for (var i = 0; i < 8; i++) {
        if (drumDef[i])
            if (drumDef[i].length > measureCount)
                measureCount = drumDef[i].length;
        if (insDef[i])
            if (insDef[i].length > measureCount)
                measureCount = insDef[i].length;
    }
    var drumTrackDef = {
        title: 'drums',
        voices: [],
        effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }] }]
    };
    convertedSchedule.tracks.push(drumTrackDef);
    for (var nn = 0; nn < 8; nn++) {
        if (drumDef[nn]) {
            var voice = {
                measureChords: [],
                source: { pluginSource: null, kind: "wafdrum", initial: '' + drumInfo[nn].num, parameters: [] },
                effects: [
                    { pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 * (drumInfo[nn].volumeRatio) }] }] },
                    {
                        pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[0] / 10 * 60 + 60 }] } //32';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[1] / 10 * 60 + 60 }] } //64';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[2] / 10 * 60 + 60 }] } //128';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[3] / 10 * 60 + 60 }] } //256';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[4] / 10 * 60 + 60 }] } //512';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[5] / 10 * 60 + 60 }] } //1k';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[6] / 10 * 60 + 60 }] } //2k';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[7] / 10 * 60 + 60 }] } //4k';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[8] / 10 * 60 + 60 }] } //8k';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[9] / 10 * 60 + 60 }] } //16k';
                        ]
                    }
                ]
                //, bass: false
                ,
                title: drumInfo[nn].kind,
                stringPattern: null,
                strumPattern: null,
                keyPattern: null
            };
            drumTrackDef.voices.push(voice);
            for (var i = 0; i < measureCount; i++) {
                var chords = { chords: [] };
                voice.measureChords.push(chords);
                if (drumDef[nn][i]) {
                    for (var k = 0; k < drumDef[nn][i].length; k++) {
                        chords.chords.push({
                            when: { count: drumDef[nn][i][k], division: 16 },
                            variation: 0, envelopes: [{ pitches: [{ duration: { count: 4, division: 16 }, pitch: drumInfo[nn].pitch }] }]
                        });
                    }
                }
            }
        }
    }
    var insTrackDef = {
        title: 'melody',
        voices: [],
        effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }] }]
    };
    convertedSchedule.tracks.push(insTrackDef);
    for (var nn = 0; nn < 8; nn++) {
        if (insDef[nn]) {
            var voice = {
                measureChords: [],
                source: { pluginSource: null, kind: "wafinstrument", initial: '' + trackInfo[nn].num, parameters: [] },
                effects: [
                    { pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 * (trackInfo[nn].volumeRatio) }] }] },
                    {
                        pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[0] / 10 * 60 + 60 }] } //32';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[1] / 10 * 60 + 60 }] } //64';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[2] / 10 * 60 + 60 }] } //128';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[3] / 10 * 60 + 60 }] } //256';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[4] / 10 * 60 + 60 }] } //512';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[5] / 10 * 60 + 60 }] } //1k';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[6] / 10 * 60 + 60 }] } //2k';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[7] / 10 * 60 + 60 }] } //4k';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[8] / 10 * 60 + 60 }] } //8k';
                            ,
                            { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[9] / 10 * 60 + 60 }] } //16k';
                        ]
                    }
                ]
                //, bass: (nn == 5 || nn == 7)
                ,
                title: trackInfo[nn].kind,
                stringPattern: null,
                strumPattern: null,
                keyPattern: null
            };
            insTrackDef.voices.push(voice);
            for (var i = 0; i < measureCount; i++) {
                var chords = { chords: [] };
                voice.measureChords.push(chords);
                if (insDef[nn][i]) {
                    var stepLengthShiftPitch = [];
                    for (var k = 0; k < insDef[nn][i].length; k++) {
                        var chordAt = null;
                        for (var ss = 0; ss < stepLengthShiftPitch.length; ss++) {
                            if (stepLengthShiftPitch[ss].step == insDef[nn][i][k].step) {
                                chordAt = stepLengthShiftPitch[ss];
                                break;
                            }
                        }
                        if (!(chordAt)) {
                            chordAt = { step: insDef[nn][i][k].step, items: [] };
                            stepLengthShiftPitch.push(chordAt);
                        }
                        chordAt.items.push(insDef[nn][i][k]);
                    }
                    for (var pp = 0; pp < stepLengthShiftPitch.length; pp++) {
                        var one = {
                            when: { count: stepLengthShiftPitch[pp].step, division: 16 },
                            envelopes: [],
                            variation: 0
                        };
                        chords.chords.push(one);
                        for (var ii = 0; ii < stepLengthShiftPitch[pp].items.length; ii++) {
                            one.envelopes.push({
                                pitches: [{
                                        duration: { count: stepLengthShiftPitch[pp].items[ii].length, division: 16 },
                                        pitch: (stepLengthShiftPitch[pp].items[ii].pitch + 12 * trackInfo[nn].octave)
                                    }]
                            });
                        }
                    }
                }
            }
        }
    }
    console.log('echo/compressor');
    convertedSchedule.effects.push({
        pluginEffect: null, kind: "echo", initial: "", parameters: [
            { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.25 * 119 }] } //reverberator';
            ,
            { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.5 * 119 }] } //threshold';
            ,
            { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.9 * 119 }] } //knee';
            ,
            { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.5 * 119 }] } //ratio';
            ,
            { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.02 * 119 }] } //attack';
            ,
            { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.25 * 119 }] } //release';
        ]
    });
    convertedSchedule.effects.push({ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }] });
    for (var i = 0; i < measureCount; i++) {
        convertedSchedule.measures.push({ meter: { count: 4, division: 4 }, tempo: tempo });
    }
    //convertedSchedule.harmony.progression.push({ duration: { count: measureCount, division: 1 }, chord: "C" });
    var pitches = [];
    for (var t_1 = 1; t_1 < convertedSchedule.tracks.length; t_1++) {
        var track_1 = convertedSchedule.tracks[t_1];
        for (var v = 0; v < track_1.voices.length; v++) {
            var voice = track_1.voices[v];
            for (var mc = 0; mc < voice.measureChords.length; mc++) {
                var meaChord = voice.measureChords[mc];
                for (var ch = 0; ch < meaChord.chords.length; ch++) {
                    var chord = meaChord.chords[ch];
                    for (var e = 0; e < chord.envelopes.length; e++) {
                        var envelope = chord.envelopes[e];
                        var firstPitch = envelope.pitches[0].pitch % 12;
                        //if (pitches.indexOf(firstPitch) < 0) {
                        //pitches.push(firstPitch);
                        //}
                        var found = null;
                        for (var kk = 0; kk < pitches.length; kk++) {
                            if (pitches[kk].pitch == firstPitch) {
                                found = pitches[kk];
                            }
                        }
                        if (found == null) {
                            found = { pitch: firstPitch, count: 0 };
                            pitches.push(found);
                        }
                        found.count++;
                    }
                }
            }
        }
    }
    pitches.sort(function (a, b) {
        return b.count - a.count;
    });
    console.log('pitches', pitches);
    var fit = [];
    /*for (var b = 0; b < 12; b++) {
        for (let m = 0; m < scaleModes.length; m++) {
            let c = calcFitCount(b, scaleModes[m], pitches);
            fit.push({ basePitch: b, baseChord: absChordSymbol(b), mode: scaleModes[m], counter: c });
        }
    }*/
    if (pitches[0]) {
        var bb = pitches[0].pitch;
        for (var m = 0; m < scaleModes.length; m++) {
            var c = calcFitCount(bb, scaleModes[m], pitches);
            fit.push({ basePitch: bb, baseChord: absChordSymbol(bb), mode: scaleModes[m], counter: c });
        }
        if (pitches.length > 1) {
            if (pitches[1].count / pitches[0].count > 0.75) {
                bb = pitches[1].pitch;
                for (var m = 0; m < scaleModes.length; m++) {
                    var c = calcFitCount(bb, scaleModes[m], pitches);
                    fit.push({ basePitch: bb, baseChord: absChordSymbol(bb), mode: scaleModes[m], counter: c });
                }
            }
        }
        if (pitches.length > 2) {
            if (pitches[2].count / pitches[0].count > 0.75) {
                bb = pitches[2].pitch;
                for (var m = 0; m < scaleModes.length; m++) {
                    var c = calcFitCount(bb, scaleModes[m], pitches);
                    fit.push({ basePitch: bb, baseChord: absChordSymbol(bb), mode: scaleModes[m], counter: c });
                }
            }
        }
        fit.sort(function (v1, v2) {
            return (v2.counter * 1000 + v2.mode.priority) - (v1.counter * 1000 + v1.mode.priority);
        });
        console.log('fit', fit);
        var ha = fit[0];
        convertedSchedule.harmony.progression.push({
            duration: { count: measureCount, division: 1 },
            chord: ha.baseChord
        });
        convertedSchedule.harmony.tone = ha.baseChord;
        convertedSchedule.harmony.mode = ha.mode.name;
    }
    else {
        convertedSchedule.harmony.progression.push({
            duration: { count: measureCount, division: 1 },
            chord: 'C'
        });
        convertedSchedule.harmony.tone = 'C';
        convertedSchedule.harmony.mode = 'Ionian';
    }
    return convertedSchedule;
}
function absChordSymbol(absstep) {
    if (absstep == 0)
        return 'C';
    if (absstep == 1)
        return 'C#';
    if (absstep == 2)
        return 'D';
    if (absstep == 3)
        return 'D#';
    if (absstep == 4)
        return 'E';
    if (absstep == 5)
        return 'F';
    if (absstep == 6)
        return 'F#';
    if (absstep == 7)
        return 'G';
    if (absstep == 8)
        return 'G#';
    if (absstep == 9)
        return 'A';
    if (absstep == 10)
        return 'A#';
    if (absstep == 11)
        return 'B';
    return '?';
}
;
function pitchExistsAsStep(basePitch, pitch, steps) {
    var p = pitch - basePitch;
    if (p < 0)
        p = p + 12;
    p = p % 12;
    //console.log(basePitch,pitch,p,steps);
    for (var i = 0; i < steps.length; i++) {
        if (p == steps[i]) {
            return true;
        }
    }
    return false;
}
function calcFitCount(basePitch, mode, pitches) {
    var counter = 0;
    for (var i = 0; i < pitches.length; i++) {
        if (pitchExistsAsStep(basePitch, pitches[i].pitch, mode.steps)) {
            counter++;
        }
    }
    return counter;
}
function exportMIDIAndroid(schedule) {
    console.log('exportMIDIAndroid', schedule);
    var drumTrack = createDrumEvents(schedule);
    var alltracks = createInsEvents(schedule);
    var tracks = [];
    for (var i = 0; i < alltracks.length; i++) {
        tracks.push(alltracks[i]);
    }
    tracks.push(drumTrack);
    //console.log('tracks', tracks);
    //console.log('drumTrack', drumTrack);
    //console.log('alltracks', alltracks);
    //var midiwriter = new MIDIWriter(tracks);
    var midiwriter = createNewMIDIwriter(tracks);
    var uInt8Array = midiwriter.buildFile();
    //https://stackoverflow.com/questions/8586691/how-to-open-file-save-dialog-in-android
    //https://www.youtube.com/watch?v=GRGaGCYKpMY
    //exportFile(uInt8Array);
    var data64 = int8ArrayToBase64(uInt8Array);
    promptExportFile(data64, 'RockDice.mid', 'audio/midi');
}
function exportMIDIDesktop(schedule) {
    console.log('exportMIDIDesktop', schedule);
    var drumTrack = createDrumEvents(schedule);
    var alltracks = createInsEvents(schedule);
    var tracks = [];
    for (var i = 0; i < alltracks.length; i++) {
        tracks.push(alltracks[i]);
    }
    tracks.push(drumTrack);
    var midiwriter = createNewMIDIwriter(tracks);
    var uInt8Array = midiwriter.buildFile();
    var a = document.createElement('a');
    var dataObj = new Blob([uInt8Array.buffer], {
        type: 'application/octet-stream'
    });
    a.href = URL.createObjectURL(dataObj);
    a.download = 'rockdice.mid';
    a.click();
}
function createInsEvents(schedule) {
    var wafpl = new WebAudioFontPlayer();
    var alltracks = [];
    var chanCount = 0;
    for (var t = 1; t < schedule.tracks.length; t++) {
        var fromTrack = schedule.tracks[t];
        var bassUp = 0;
        //if(t==1)bassUp=12;
        for (var vv = 0; vv < fromTrack.voices.length; vv++) {
            var iTrack = createNewMIDItrack(); //new Track();
            iTrack.setTempo(schedule.measures[0].tempo);
            alltracks.push(iTrack);
            var voice = fromTrack.voices[vv];
            //console.log('voice', voice.title);
            //var nn = 1 * voice.source.initial;
            //var insMIDI = 1 + parseInt(wafpl.loader.instrumentInfo(nn).variable.substr(6, 3));
            var loaderNum = parseInt(voice.source.initial);
            var iurl = wafpl.loader.instrumentKeys()[loaderNum];
            var insMIDI = parseInt(iurl.substr(0, 3));
            //console.log(voice.source.initial,voice.title,iurl,midinum);
            /*iTrack.addEvent(new ProgramChangeEvent({
                instrument: insMIDI,
                channel: tt
            }));*/
            iTrack.addEvent(createNewMIDIProgramChangeEvent({
                instrument: insMIDI,
                channel: chanCount
            }));
            //console.log(tt, nn, wafpl.loader.instrumentInfo(nn).title, insMIDI);
            var onOff = [];
            var measurePosition = {
                count: 0,
                division: 1
            };
            for (var i = 0; i < schedule.measures.length; i++) {
                if (voice.measureChords.length > i && (voice.measureChords[i])) {
                    var measureChord = voice.measureChords[i];
                    for (var k = 0; k < measureChord.chords.length; k++) {
                        var chord = measureChord.chords[k];
                        var chordPosition = plusMeter(measurePosition, chord.when);
                        var start = Math.floor(duration384(chordPosition) / (384 / 16));
                        var duration = Math.floor(duration384(chord.envelopes[0].pitches[0].duration) / (384 / 16));
                        for (var kk = 0; kk < chord.envelopes.length; kk++) {
                            onOff.push({
                                nn: start,
                                pitch: chord.envelopes[kk].pitches[0].pitch + bassUp,
                                begin: 1
                            });
                            onOff.push({
                                nn: start + duration,
                                pitch: chord.envelopes[kk].pitches[0].pitch + bassUp,
                                begin: 0
                            });
                        }
                    }
                }
                measurePosition = plusMeter(measurePosition, schedule.measures[i].meter);
            }
            onOff.sort(function (a, b) {
                //return a.nn - b.nn;
                return (a.nn * 1000 + a.begin) - (b.nn * 1000 + a.begin);
            });
            var preNN = 0;
            for (var ii = 0; ii < onOff.length; ii++) {
                var wait = onOff[ii].nn - preNN;
                if (onOff[ii].begin) {
                    var on = createNewMIDINoteOnEvent({
                        pitch: onOff[ii].pitch,
                        velocity: 99,
                        channel: chanCount + 1,
                        wait: n16(wait)
                    });
                    /*var nn = new NoteOnEvent({
                        pitch: onOff[ii].pitch,
                        velocity: 99,
                        channel: tt + 1,
                        wait: n16(wait)
                    });*/
                    iTrack.addEvent(on);
                }
                else {
                    var off = createNewMIDINoteOffEvent({
                        pitch: onOff[ii].pitch,
                        velocity: 99,
                        channel: chanCount + 1,
                        duration: n16(wait)
                    });
                    /*var nn = new NoteOffEvent({
                        pitch: onOff[ii].pitch,
                        velocity: 99,
                        channel: tt + 1,
                        duration: n16(wait)
                    })*/
                    iTrack.addEvent(off);
                }
                preNN = onOff[ii].nn;
            }
            chanCount++;
        }
    }
    return alltracks;
}
function n16(nn) {
    if (nn) {
        var r = [];
        for (var i = 0; i < nn; i++) {
            r.push('16');
        }
        return r;
    }
    else {
        return 0;
    }
}
function createDrumEvents(schedule) {
    var wafpl = new WebAudioFontPlayer();
    //var drumTrack = new Track();
    var drumTrack = createNewMIDItrack();
    drumTrack.setTempo(schedule.measures[0].tempo);
    var fromTrack = schedule.tracks[0];
    var onOff = [];
    for (var v = 0; v < fromTrack.voices.length; v++) {
        var voice = fromTrack.voices[v];
        //console.log('voice', voice.title);
        //var nn = 1 * voice.source.initial;
        var loaderNum = parseInt(voice.source.initial);
        var iurl = wafpl.loader.drumKeys()[loaderNum];
        var drMIDI = parseInt(iurl.substr(0, 2));
        //console.log(voice.source.initial, voice.title, iurl, drMIDI);
        var measurePosition = {
            count: 0,
            division: 1
        };
        for (var i = 0; i < schedule.measures.length; i++) {
            if (voice.measureChords.length > i && (voice.measureChords[i])) {
                var measureChord = voice.measureChords[i];
                for (var k = 0; k < measureChord.chords.length; k++) {
                    var chord = measureChord.chords[k];
                    var chordPosition = plusMeter(measurePosition, chord.when);
                    var start = Math.floor(duration384(chordPosition) / (384 / 16));
                    var duration = Math.floor(duration384(chord.envelopes[0].pitches[0].duration) / (384 / 16));
                    onOff.push({
                        nn: start,
                        drum: drMIDI,
                        begin: 1
                    });
                    onOff.push({
                        nn: start + duration,
                        drum: drMIDI,
                        begin: 0
                    });
                }
            }
            measurePosition = plusMeter(measurePosition, schedule.measures[i].meter);
        }
    }
    onOff.sort(function (a, b) {
        return (a.nn * 1000 + a.begin) - (b.nn * 1000 + a.begin);
    });
    //console.log('onOff',onOff);
    var preNN = 0;
    for (var ii = 0; ii < onOff.length; ii++) {
        var wait = onOff[ii].nn - preNN;
        if (onOff[ii].begin) {
            /*var nn = new NoteOnEvent({
                pitch: onOff[ii].drum,
                velocity: 99,
                channel: 10,
                wait: n16(wait)
            });*/
            var on = createNewMIDINoteOnEvent({
                pitch: onOff[ii].drum,
                velocity: 99,
                channel: 10,
                wait: n16(wait)
            });
            drumTrack.addEvent(on);
        }
        else {
            /*var nn = new NoteOffEvent({
                pitch: onOff[ii].drum,
                velocity: 99,
                channel: 10,
                duration: n16(wait)
            })*/
            var off = createNewMIDINoteOffEvent({
                pitch: onOff[ii].drum,
                velocity: 99,
                channel: 10,
                duration: n16(wait)
            });
            drumTrack.addEvent(off);
        }
        preNN = onOff[ii].nn;
    }
    return drumTrack;
}
var ZvoogFxGain = /** @class */ (function () {
    function ZvoogFxGain() {
        this.lockedState = new ZvoogPluginLock();
    }
    ZvoogFxGain.prototype.state = function () {
        return this.lockedState;
    };
    ZvoogFxGain.prototype.prepare = function (audioContext, data) {
        if (this.base) {
            //
        }
        else {
            this.base = audioContext.createGain();
            this.params = [];
            //this.params.push((this.base.gain as any) as ZvoogAudioParam);
            this.params.push(new RangedAudioParam120(this.base.gain, 0, 1));
        }
    };
    ZvoogFxGain.prototype.getInput = function () {
        return this.base;
    };
    ZvoogFxGain.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogFxGain.prototype.getParams = function () {
        return this.params;
    };
    ZvoogFxGain.prototype.busy = function () {
        return 0;
    };
    return ZvoogFxGain;
}());
var WAFEcho = /** @class */ (function () {
    function WAFEcho() {
        this.lockedState = new ZvoogPluginLock();
    }
    WAFEcho.prototype.state = function () {
        return this.lockedState;
    };
    WAFEcho.prototype.setData = function (data) {
    };
    WAFEcho.prototype.prepare = function (audioContext, data) {
        if (this.inpt) {
            //
        }
        else {
            var me_1 = this;
            this.inpt = audioContext.createGain();
            this.outpt = audioContext.createGain();
            this.params = [];
            this.initWAF();
            this.rvrbrtr = window.wafPlayer.createReverberator(audioContext);
            this.params.push(new RangedAudioParam120(this.rvrbrtr.wet.gain, 0, 1));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.threshold, -100, 0));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.knee, 0, 40));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.ratio, 2, 20));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.attack, 0, 1));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.release, 0, 1));
            //this.params=[];
            this.rvrbrtr.compressorDry.gain.setValueAtTime(1, 0);
            this.rvrbrtr.compressorWet.gain.setValueAtTime(0, 0);
            //console.log(this.rvrbrtr);
            this.params.push({
                cancelScheduledValues: function (cancelTime) {
                    me_1.rvrbrtr.compressorDry.gain.cancelScheduledValues(cancelTime);
                    me_1.rvrbrtr.compressorWet.gain.cancelScheduledValues(cancelTime);
                },
                linearRampToValueAtTime: function (value, endTime) {
                    var wet = value / 119;
                    if (wet < 0)
                        wet = 0;
                    if (wet > 1)
                        wet = 1;
                    var dry = 1 - wet;
                    me_1.rvrbrtr.compressorDry.gain.linearRampToValueAtTime(dry, endTime);
                    me_1.rvrbrtr.compressorWet.gain.linearRampToValueAtTime(wet, endTime);
                },
                setValueAtTime: function (value, startTime) {
                    var wet = value / 119;
                    if (wet < 0)
                        wet = 0;
                    if (wet > 1)
                        wet = 1;
                    var dry = 1 - wet;
                    //console.log('compression setValueAtTime',value,startTime,dry,wet);
                    me_1.rvrbrtr.compressorDry.gain.setValueAtTime(dry, startTime);
                    me_1.rvrbrtr.compressorWet.gain.setValueAtTime(wet, startTime);
                }
            });
        }
        this.inpt.connect(this.rvrbrtr.input);
        this.rvrbrtr.output.connect(this.outpt);
    };
    WAFEcho.prototype.getInput = function () {
        return this.inpt;
    };
    WAFEcho.prototype.getOutput = function () {
        return this.outpt;
    };
    WAFEcho.prototype.getParams = function () {
        return this.params;
    };
    WAFEcho.prototype.busy = function () {
        return 0;
    };
    WAFEcho.prototype.initWAF = function () {
        if (!(window.wafPlayer)) {
            window.wafPlayer = new WebAudioFontPlayer();
        }
    };
    return WAFEcho;
}());
var WAFEqualizer = /** @class */ (function () {
    function WAFEqualizer() {
        this.lockedState = new ZvoogPluginLock();
    }
    WAFEqualizer.prototype.state = function () {
        return this.lockedState;
    };
    WAFEqualizer.prototype.prepare = function (audioContext, data) {
        if (this.inpt) {
            //
        }
        else {
            this.inpt = audioContext.createGain();
            this.outpt = audioContext.createGain();
            this.params = [];
            this.initWAF();
            this.chnl = window.wafPlayer.createChannel(audioContext);
            this.params.push(new RangedAudioParam120(this.chnl.band32.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band64.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band128.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band256.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band512.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band1k.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band2k.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band4k.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band8k.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band16k.gain, -10, 10));
        }
        this.inpt.connect(this.chnl.input);
        this.chnl.output.connect(this.outpt);
    };
    WAFEqualizer.prototype.getInput = function () {
        return this.inpt;
    };
    WAFEqualizer.prototype.getOutput = function () {
        return this.outpt;
    };
    WAFEqualizer.prototype.getParams = function () {
        return this.params;
    };
    WAFEqualizer.prototype.busy = function () {
        return 0;
    };
    WAFEqualizer.prototype.initWAF = function () {
        if (!(window.wafPlayer)) {
            window.wafPlayer = new WebAudioFontPlayer();
        }
    };
    return WAFEqualizer;
}());
var ZvoogSineSource = /** @class */ (function () {
    function ZvoogSineSource() {
        this.lockedState = new ZvoogPluginLock();
    }
    ZvoogSineSource.prototype.state = function () {
        return this.lockedState;
    };
    ZvoogSineSource.prototype.prepare = function (audioContext, data) {
        if (this.out) {
            //
        }
        else {
            this.out = audioContext.createGain();
            this.params = [];
            this.poll = [];
            this.audioContext = audioContext;
        }
    };
    ZvoogSineSource.prototype.getOutput = function () {
        return this.out;
    };
    ZvoogSineSource.prototype.getParams = function () {
        return this.params;
    };
    ZvoogSineSource.prototype.cancelSchedule = function () {
        for (var i = 0; i < this.poll.length; i++) {
            this.poll[i].node.stop();
        }
    };
    ZvoogSineSource.prototype.addSchedule = function (when, tempo, chord, variation) {
        this.cleanup();
        for (var i = 0; i < chord.length; i++) {
            this.sendLine(when, tempo, chord[i]);
        }
    };
    ZvoogSineSource.prototype.sendLine = function (when, tempo, line) {
        //console.log('sendLine',when,tempo,line);
        var oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        var seconds = duration2seconds(tempo, duration384(line.pitches[0].duration));
        //console.log('start',when,line.pitches[0].pitch);
        oscillator.frequency.setValueAtTime(this.freq(line.pitches[0].pitch), when);
        var nextPointSeconds = when + seconds;
        for (var i = 1; i < line.pitches.length; i++) {
            var seconds_1 = duration2seconds(tempo, duration384(line.pitches[i].duration));
            oscillator.frequency.linearRampToValueAtTime(this.freq(line.pitches[i].pitch), nextPointSeconds);
            //console.log('change',nextPointSeconds,line.pitches[i].pitch);
            nextPointSeconds = nextPointSeconds + seconds_1;
        }
        oscillator.connect(this.out);
        oscillator.start(when);
        oscillator.stop(nextPointSeconds);
        //console.log('sine',when,nextPointSeconds);
        this.poll.push({ node: oscillator, end: nextPointSeconds });
    };
    ZvoogSineSource.prototype.busy = function () {
        return 0;
    };
    ZvoogSineSource.prototype.freq = function (key) {
        var O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
        var half = Math.floor(key % 12);
        var octave = Math.floor(key / 12);
        var freq0 = O4[half] / (2 * 2 * 2 * 2);
        return freq0 * Math.pow(2, octave);
    };
    ZvoogSineSource.prototype.nextClear = function () {
        for (var i = 0; i < this.poll.length; i++) {
            if (this.poll[i].end < this.audioContext.currentTime) {
                try {
                    this.poll[i].node.stop();
                    this.poll[i].node.disconnect();
                }
                catch (x) {
                    console.log(x);
                }
                this.poll.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    ZvoogSineSource.prototype.cleanup = function () {
        while (this.nextClear()) {
            //
        }
        ;
    };
    return ZvoogSineSource;
}());
var WAFInsSource = /** @class */ (function () {
    function WAFInsSource() {
        this.ins = 0;
        this.lockedState = new ZvoogPluginLock();
    }
    WAFInsSource.prototype.state = function () {
        return this.lockedState;
    };
    WAFInsSource.prototype.cancelSchedule = function () {
        window.wafPlayer.cancelQueue(this.audioContext);
    };
    WAFInsSource.prototype.addSchedule = function (when, tempo, chord, variation) {
        /*for (let i = 0; i < chord.length; i++) {
            let envelope: ZvoogEnvelope = chord[i];
            let slides: { pitch: number, when: number }[] = [];
            let duration: number = duration2seconds(tempo, duration384(envelope.pitches[0].duration));
            let t = 0;
            for (let n = 1; n < envelope.pitches.length; n++) {
                t = t + duration2seconds(tempo, duration384(envelope.pitches[n - 1].duration));
                slides.push({
                    pitch: envelope.pitches[n].pitch
                    , when: t
                });
                duration = duration + duration2seconds(tempo, duration384(envelope.pitches[n].duration));
            }
            (window as any).wafPlayer.queueWaveTable(this.audioContext
                , this.out, this.zones, when, envelope.pitches[0].pitch, duration, 1.0, slides);
        }*/
        //if (this.busy()==0) {
        var pitches = [];
        for (var i = 0; i < chord.length; i++) {
            var envelope_1 = chord[i];
            pitches.push(envelope_1.pitches[0].pitch);
        }
        var envelope = chord[0];
        var duration = duration2seconds(tempo, duration384(envelope.pitches[0].duration));
        var slides = [];
        var tt = 0;
        for (var n = 1; n < envelope.pitches.length; n++) {
            tt = tt + duration2seconds(tempo, duration384(envelope.pitches[n - 1].duration));
            slides.push({
                pitch: envelope.pitches[n].pitch,
                when: tt
            });
            duration = duration + duration2seconds(tempo, duration384(envelope.pitches[n].duration));
        }
        if (variation == 1 || variation == 2 || variation == 3) {
            if (variation == 1) {
                window.wafPlayer.queueStrumDown(this.audioContext, this.out, this.zones, when, pitches, duration, 0.55, slides);
            }
            else {
                if (variation == 2) {
                    window.wafPlayer.queueStrumUp(this.audioContext, this.out, this.zones, when, pitches, duration, 0.55, slides);
                }
                else {
                    window.wafPlayer.queueSnap(this.audioContext, this.out, this.zones, when, pitches, duration, 0.55, slides);
                }
            }
        }
        else {
            //console.log(this.audioContext, this.out, this.zones, when, pitches, duration, 1.0, slides);
            window.wafPlayer.queueChord(this.audioContext, this.out, this.zones, when, pitches, duration, 0.55, slides);
        }
        //}
    };
    WAFInsSource.prototype.prepare = function (audioContext, data) {
        if (this.out) {
            //console.log('skip init');
        }
        else {
            this.out = audioContext.createGain();
            this.params = [];
            this.poll = [];
            this.audioContext = audioContext;
            this.initWAF();
        }
        this.zones = null;
        this.ins = parseInt(data);
        this.selectIns(this.ins);
        //console.log('prepare',data);
    };
    WAFInsSource.prototype.getOutput = function () {
        return this.out;
    };
    WAFInsSource.prototype.getParams = function () {
        return this.params;
    };
    WAFInsSource.prototype.busy = function () {
        if (this.zones) {
            if (this.zones.zones) {
                for (var i = 0; i < this.zones.zones.length; i++) {
                    if (this.zones.zones[i].buffer) {
                        //
                    }
                    else {
                        return 1;
                    }
                }
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            return 1;
        }
    };
    //constructor(insNum: number) {
    //	this.ins = insNum;
    //}
    WAFInsSource.prototype.initWAF = function () {
        if (!(window.wafPlayer)) {
            window.wafPlayer = new WebAudioFontPlayer();
        }
    };
    WAFInsSource.prototype.selectIns = function (nn) {
        var me = this;
        var info = window.wafPlayer.loader.instrumentInfo(nn);
        //console.log(info);
        window.wafPlayer.loader.startLoad(this.audioContext, info.url, info.variable);
        window.wafPlayer.loader.waitLoad(function () {
            me.zones = window[info.variable];
            //console.log(me.zones);
        });
    };
    return WAFInsSource;
}());
var WAFPercSource = /** @class */ (function () {
    function WAFPercSource() {
        this.ins = 0;
        this.lockedState = new ZvoogPluginLock();
    }
    WAFPercSource.prototype.state = function () {
        return this.lockedState;
    };
    WAFPercSource.prototype.cancelSchedule = function () {
        window.wafPlayer.cancelQueue(this.audioContext);
    };
    WAFPercSource.prototype.addSchedule = function (when, tempo, chord, variation) {
        //if (this.busy()==0) {
        for (var i = 0; i < chord.length; i++) {
            var envelope = chord[i];
            var slides = [];
            var duration = duration2seconds(tempo, duration384(envelope.pitches[0].duration));
            var t = 0;
            for (var n = 1; n < envelope.pitches.length; n++) {
                t = t + duration2seconds(tempo, duration384(envelope.pitches[n - 1].duration));
                slides.push({
                    pitch: envelope.pitches[n].pitch,
                    when: t
                });
                duration = duration + duration2seconds(tempo, duration384(envelope.pitches[n].duration));
            }
            window.wafPlayer.queueWaveTable(this.audioContext, this.out, this.zones, when, envelope.pitches[0].pitch, duration, 0.55, slides);
        }
        //}
    };
    WAFPercSource.prototype.prepare = function (audioContext, data) {
        if (this.out) {
            //
        }
        else {
            this.out = audioContext.createGain();
            this.params = [];
            this.poll = [];
            this.audioContext = audioContext;
            this.initWAF();
        }
        this.ins = parseInt(data);
        this.selectDrum(this.ins);
    };
    WAFPercSource.prototype.getOutput = function () {
        return this.out;
    };
    WAFPercSource.prototype.getParams = function () {
        return this.params;
    };
    WAFPercSource.prototype.busy = function () {
        if (this.zones) {
            if (this.zones.zones) {
                for (var i = 0; i < this.zones.zones.length; i++) {
                    if (this.zones.zones[i].buffer) {
                        //
                    }
                    else {
                        return 1;
                    }
                }
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            return 1;
        }
    };
    //constructor(insNum: number) {
    //	this.ins = insNum;
    //}
    WAFPercSource.prototype.initWAF = function () {
        if (!(window.wafPlayer)) {
            window.wafPlayer = new WebAudioFontPlayer();
        }
    };
    WAFPercSource.prototype.selectDrum = function (nn) {
        var me = this;
        var info = window.wafPlayer.loader.drumInfo(nn);
        window.wafPlayer.loader.startLoad(this.audioContext, info.url, info.variable);
        window.wafPlayer.loader.waitLoad(function () {
            me.zones = window[info.variable];
        });
    };
    return WAFPercSource;
}());
var AudioFileSource = /** @class */ (function () {
    function AudioFileSource() {
        this.afterTime = 0.008;
        //constructor(raw: Uint8Array) {
        //	this.rawData = raw;
        //}
        this.lockedState = new ZvoogPluginLock();
    }
    AudioFileSource.prototype.state = function () {
        return this.lockedState;
    };
    AudioFileSource.prototype.setData = function (base64file) {
        //https://base64.guru/converter/encode/file
        //474824__j3rryz808__hard-trap-female-vocal.mp3
        //var base64file = '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';
        //var t = [0, 1, 2];
        var t = [];
        try {
            var chars = atob(base64file);
            for (var i = 0; i < chars.length; i++) {
                var num = chars.charCodeAt(i);
                t.push(num);
            }
            var arr;
            arr = Uint8Array.from(t);
            this.rawData = arr;
        }
        catch (xx) {
            console.log(xx);
        }
    };
    AudioFileSource.prototype.prepare = function (audioContext, data) {
        if (this.out) {
            this.setData(data);
        }
        else {
            this.out = audioContext.createGain();
            this.params = [];
            this.waves = [];
            this.envelopes = [];
            this.audioContext = audioContext;
            var me_2 = this;
            this.setData(data);
            if (this.buffer) {
                //
            }
            else {
                if (this.rawData) {
                    this.audioContext.decodeAudioData(this.rawData.buffer, function (audioBuffer) {
                        me_2.buffer = audioBuffer;
                    });
                }
            }
        }
    };
    AudioFileSource.prototype.getOutput = function () {
        return this.out;
    };
    AudioFileSource.prototype.getParams = function () {
        return this.params;
    };
    AudioFileSource.prototype.cancelSchedule = function () {
        for (var i = 0; i < this.waves.length; i++) {
            this.waves[i].audio.stop();
        }
    };
    AudioFileSource.prototype.addSchedule = function (when, tempo, chord, variation) {
        this.cleanup();
        for (var i = 0; i < chord.length; i++) {
            this.single(when, tempo, chord[i]);
        }
    };
    AudioFileSource.prototype.busy = function () {
        if (this.buffer) {
            return 0;
        }
        else {
            return 1;
        }
    };
    AudioFileSource.prototype.nextClear = function () {
        for (var i = 0; i < this.waves.length; i++) {
            if (this.waves[i].end < this.audioContext.currentTime) {
                try {
                    this.waves[i].audio.stop();
                    this.waves[i].audio.disconnect();
                }
                catch (x) {
                    console.log(x);
                }
                this.waves.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    AudioFileSource.prototype.cleanup = function () {
        while (this.nextClear()) {
            //
        }
        ;
    };
    AudioFileSource.prototype.findEnvelope = function (when, duration) {
        var envelope = null;
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (this.audioContext.currentTime > e.when + e.duration + this.afterTime) {
                envelope = e;
                break;
            }
        }
        if (!(envelope)) {
            envelope = {
                base: this.audioContext.createGain(),
                when: 0,
                duration: 0
            };
            this.envelopes.push(envelope);
            envelope.base.connect(this.out);
        }
        envelope.when = when;
        envelope.duration = duration;
        envelope.base.gain.setValueAtTime(0, 0);
        envelope.base.gain.setValueAtTime(0, when);
        envelope.base.gain.linearRampToValueAtTime(1, when + this.afterTime);
        envelope.base.gain.setValueAtTime(1, when + duration);
        envelope.base.gain.linearRampToValueAtTime(0, when + duration + this.afterTime);
        return envelope;
    };
    ;
    AudioFileSource.prototype.single = function (when, tempo, line) {
        var seconds = duration2seconds(tempo, duration384(line.pitches[0].duration));
        var nextPointSeconds = when + seconds;
        for (var i = 1; i < line.pitches.length; i++) {
            var seconds_2 = duration2seconds(tempo, duration384(line.pitches[i].duration));
            nextPointSeconds = nextPointSeconds + seconds_2;
        }
        var e = this.findEnvelope(when, nextPointSeconds - when);
        var audioBufferSourceNode = this.audioContext.createBufferSource();
        audioBufferSourceNode.buffer = this.buffer;
        audioBufferSourceNode.connect(e.base);
        audioBufferSourceNode.start(when);
        audioBufferSourceNode.stop(nextPointSeconds + this.afterTime);
        this.waves.push({ audio: audioBufferSourceNode, end: nextPointSeconds + this.afterTime });
    };
    return AudioFileSource;
}());
var ZvoogTicker = /** @class */ (function () {
    function ZvoogTicker() {
        this.onAir = false;
        this.scheduledPosition = 0;
        this.scheduledTick = 0;
        this.defTickDuration = 0.25;
        this.watcher = function () { };
        this.waitNextPositionTime = 0;
        this.waitLoopStart = 0;
        this.waitLoopDuration = 0;
    }
    ZvoogTicker.prototype.setParamCurve = function (measureStarts, fxParam, curve, nextAudioTime, nextPositionTime, tickDuration) {
        var pointStarts = this.calculateParamPointStarts(curve, measureStarts);
        for (var p = 0; p < pointStarts.length; p++) {
            if (pointStarts[p] > nextPositionTime && pointStarts[p] <= nextPositionTime + tickDuration) {
                var when = nextAudioTime + pointStarts[p] - nextPositionTime;
                if (p + 1 < pointStarts.length) {
                    when = nextAudioTime + pointStarts[p + 1] - nextPositionTime;
                    //console.log(nextAudioTime, 'from', (nextAudioTime + pointStarts[p] - nextPositionTime), 'to', (nextAudioTime + pointStarts[p + 1] - nextPositionTime), curve.points[p + 1].velocity, 'point', (p + 1));
                    fxParam.linearRampToValueAtTime(curve.points[p + 1].velocity, when - 0.000001);
                }
                if (pointStarts[p] >= nextPositionTime + tickDuration) {
                    break;
                }
            }
        }
    };
    ZvoogTicker.prototype.calculateParamPointStarts = function (curve, measureStarts) {
        var times = [];
        var curMeasureNum = curve.points[0].skipMeasures;
        var curSkip384 = curve.points[0].skip384;
        var t = measureStarts[curMeasureNum] + duration2seconds(this.scheduleDefinition.measures[curMeasureNum].tempo, curSkip384);
        times.push(t);
        for (var i = 1; i < curve.points.length; i++) {
            var p = curve.points[i];
            if (p.skipMeasures) {
                curSkip384 = 0;
                curMeasureNum = curMeasureNum + p.skipMeasures;
            }
            else {
                curSkip384 = curSkip384 + p.skip384;
            }
            var t_2 = measureStarts[curMeasureNum] + duration2seconds(this.scheduleDefinition.measures[curMeasureNum].tempo, curSkip384);
            times.push(t_2);
        }
        return times;
    };
    ZvoogTicker.prototype.calculateMeasureStarts = function () {
        var times = [];
        var t = 0;
        times.push(0);
        for (var m = 0; m < this.scheduleDefinition.measures.length; m++) {
            var measure = this.scheduleDefinition.measures[m];
            var measureSeconds = duration2seconds(measure.tempo, duration384(measure.meter));
            t = t + measureSeconds;
            times.push(t);
        }
        return times;
    };
    ZvoogTicker.prototype.restartParamCurve = function (measureStarts, fxParam, curve, nextAudioTime, nextPositionTime, tickDuration) {
        var pointStarts = this.calculateParamPointStarts(curve, measureStarts);
        //console.log('restartParamCurve', nextAudioTime, pointStarts);
        fxParam.cancelScheduledValues(nextAudioTime);
        for (var p = 0; p < pointStarts.length; p++) {
            if (pointStarts[p] >= nextPositionTime) {
                if (pointStarts[p] == nextPositionTime) {
                    fxParam.setValueAtTime(curve.points[p].velocity, nextAudioTime);
                    //console.log(nextAudioTime, 'exact', curve.points[p].velocity);
                    if (p + 1 < pointStarts.length) {
                        var when = nextAudioTime + pointStarts[p + 1] - nextPositionTime;
                        //console.log(nextAudioTime, 'nxt', when, curve.points[p + 1].velocity);
                        fxParam.linearRampToValueAtTime(curve.points[p + 1].velocity, when - 0.000001);
                    }
                }
                else {
                    if (p > 0) {
                        var startSeconds = pointStarts[p - 1];
                        var startVelocity = curve.points[p - 1].velocity;
                        var velodiff = curve.points[p].velocity - startVelocity;
                        var timediff = pointStarts[p] - startSeconds;
                        var fromVelocity = (nextPositionTime - startSeconds) * velodiff / timediff;
                        fxParam.setValueAtTime(fromVelocity, nextAudioTime);
                        var when = nextAudioTime + pointStarts[p] - nextPositionTime;
                        fxParam.linearRampToValueAtTime(curve.points[p].velocity, when - 0.000001);
                        //console.log(nextAudioTime, 'cut', fromVelocity, 'to', curve.points[p].velocity, 'at', when);
                    }
                    else {
                        fxParam.setValueAtTime(0, nextAudioTime);
                        var when = nextAudioTime + pointStarts[p] - nextPositionTime;
                        fxParam.linearRampToValueAtTime(curve.points[p].velocity, when - 0.000001);
                        //console.log(nextAudioTime, 'from zero', nextAudioTime, curve.points[p].velocity, when);
                    }
                }
                break;
            }
        }
    };
    ZvoogTicker.prototype.setEffectParameters = function (measureStarts, fx, nextAudioTime, nextPositionTime, tickDuration) {
        if (fx.pluginEffect) {
            var audioParams = fx.pluginEffect.getParams();
            for (var i = 0; i < audioParams.length; i++) {
                var fxParam = audioParams[i];
                if (fx.parameters.length > i) {
                    var curve = fx.parameters[i];
                    //console.log('setEffectParameters',curve);
                    this.setParamCurve(measureStarts, fxParam, curve, nextAudioTime, nextPositionTime, tickDuration);
                }
            }
        }
    };
    ZvoogTicker.prototype.restartEffectParameters = function (measureStarts, fx, nextAudioTime, nextPositionTime, tickDuration) {
        if (fx.pluginEffect) {
            var audioParams = fx.pluginEffect.getParams();
            for (var i = 0; i < audioParams.length; i++) {
                var fxParam = audioParams[i];
                if (fx.parameters.length > i) {
                    var curve = fx.parameters[i];
                    //console.log('restartEffectParameters',curve);
                    this.restartParamCurve(measureStarts, fxParam, curve, nextAudioTime, nextPositionTime, tickDuration);
                }
            }
        }
    };
    ZvoogTicker.prototype.ready = function () {
        for (var i = 0; i < this.scheduleDefinition.effects.length; i++) {
            var pluginEffect = this.scheduleDefinition.effects[i].pluginEffect;
            if (pluginEffect) {
                var busy = pluginEffect.busy();
                if (busy > 0) {
                    console.log('master', i, 'is', busy);
                    return false;
                }
            }
        }
        for (var k = 0; k < this.scheduleDefinition.tracks.length; k++) {
            var track = this.scheduleDefinition.tracks[k];
            for (var i = 0; i < track.effects.length; i++) {
                var pluginEffect = track.effects[i].pluginEffect;
                if (pluginEffect) {
                    var busy = pluginEffect.busy();
                    if (busy > 0) {
                        console.log('not ready track', k, 'fx', i, 'is', busy);
                        return false;
                    }
                }
            }
            for (var s = 0; s < track.voices.length; s++) {
                var voice = track.voices[s];
                var pluginSource = voice.source.pluginSource;
                if (pluginSource) {
                    var busy = pluginSource.busy();
                    if (busy > 0) {
                        console.log('not ready track', k, 'voice', s, voice.title, 'source is', busy);
                        return false;
                    }
                }
                for (var f = 0; f < voice.effects.length; f++) {
                    var pluginEffect = voice.effects[f].pluginEffect;
                    if (pluginEffect) {
                        var busy = pluginEffect.busy();
                        if (busy > 0) {
                            console.log('not ready track', k, 'voice', s, voice.title, 'fx', f, 'is', busy);
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };
    ZvoogTicker.prototype.sendAll = function (measureStarts, nextAudioTime, nextPositionTime, tickDuration) {
        this.sendKeys(nextAudioTime, nextPositionTime, tickDuration);
        this.sendParams(measureStarts, nextAudioTime, nextPositionTime, tickDuration);
        this.scheduledPosition = nextPositionTime;
    };
    ZvoogTicker.prototype.sendKeys = function (nextAudioTime, nextPositionTime, tickDuration) {
        var t = 0;
        for (var m = 0; m < this.scheduleDefinition.measures.length; m++) {
            var measure = this.scheduleDefinition.measures[m];
            var measureSeconds = duration2seconds(measure.tempo, duration384(measure.meter));
            if (nextPositionTime < t + measureSeconds && nextPositionTime + tickDuration >= t) {
                for (var i = 0; i < this.scheduleDefinition.tracks.length; i++) {
                    var track = this.scheduleDefinition.tracks[i];
                    for (var v = 0; v < track.voices.length; v++) {
                        var voice = track.voices[v];
                        if (voice.measureChords) {
                            var measureChords = voice.measureChords;
                            if (measureChords.length > m && (measureChords[m])) {
                                var keyChords = measureChords[m];
                                if (keyChords) {
                                    for (var k = 0; k < keyChords.chords.length; k++) {
                                        var chord = keyChords.chords[k];
                                        var chordSeconds = duration2seconds(measure.tempo, duration384(chord.when));
                                        if (t + chordSeconds >= nextPositionTime && t + chordSeconds < nextPositionTime + tickDuration) {
                                            var chordPosTime = t + chordSeconds;
                                            //console.log(chord.envelopes);
                                            if (chord.envelopes.length > 0) {
                                                if (voice.source.pluginSource) {
                                                    //console.log(voice.source.pluginSource.busy());
                                                    if (voice.source.pluginSource.busy() == 0) {
                                                        voice.source.pluginSource.addSchedule(nextAudioTime + chordPosTime - nextPositionTime, measure.tempo, chord.envelopes, chord.variation);
                                                    }
                                                    else {
                                                        console.log('source is busy');
                                                        //this.cancel();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            t = t + measureSeconds;
        }
    };
    ZvoogTicker.prototype.sendParams = function (measureStarts, nextAudioTime, nextPositionTime, tickDuration) {
        for (var i = 0; i < this.scheduleDefinition.effects.length; i++) {
            this.setEffectParameters(measureStarts, this.scheduleDefinition.effects[i], nextAudioTime, nextPositionTime, tickDuration);
        }
        for (var k = 0; k < this.scheduleDefinition.tracks.length; k++) {
            var track = this.scheduleDefinition.tracks[k];
            for (var i = 0; i < track.effects.length; i++) {
                this.setEffectParameters(measureStarts, track.effects[i], nextAudioTime, nextPositionTime, tickDuration);
            }
            for (var v = 0; v < track.voices.length; v++) {
                var voice = track.voices[v];
                for (var k_1 = 0; k_1 < voice.effects.length; k_1++) {
                    this.setEffectParameters(measureStarts, voice.effects[k_1], nextAudioTime, nextPositionTime, tickDuration);
                }
            }
        }
    };
    ZvoogTicker.prototype.restartParams = function (measureStarts, nextAudioTime, nextPositionTime, tickDuration) {
        for (var i = 0; i < this.scheduleDefinition.effects.length; i++) {
            this.restartEffectParameters(measureStarts, this.scheduleDefinition.effects[i], nextAudioTime, nextPositionTime, tickDuration);
        }
        for (var k = 0; k < this.scheduleDefinition.tracks.length; k++) {
            var track = this.scheduleDefinition.tracks[k];
            for (var i = 0; i < track.effects.length; i++) {
                this.restartEffectParameters(measureStarts, track.effects[i], nextAudioTime, nextPositionTime, tickDuration);
            }
            for (var v = 0; v < track.voices.length; v++) {
                var voice = track.voices[v];
                for (var k_2 = 0; k_2 < voice.effects.length; k_2++) {
                    this.restartEffectParameters(measureStarts, voice.effects[k_2], nextAudioTime, nextPositionTime, tickDuration);
                }
            }
        }
    };
    ZvoogTicker.prototype.scheduleNext = function (measureStarts, nextAudioTime, nextPositionTime, loopStart, loopDuration, tickDuration) {
        if (nextPositionTime + tickDuration > loopStart + loopDuration) {
            var t1 = (loopStart + loopDuration) - nextPositionTime;
            var t2 = (nextPositionTime + tickDuration) - loopDuration - loopStart;
            this.sendAll(measureStarts, nextAudioTime, nextPositionTime, t1);
            this.restartParams(measureStarts, nextAudioTime + t1, loopStart, t2);
            this.sendAll(measureStarts, nextAudioTime + t1, loopStart, t2);
        }
        else {
            this.sendAll(measureStarts, nextAudioTime, nextPositionTime, tickDuration);
        }
        //console.log(nextPositionTime);
        this.watcher(nextPositionTime);
    };
    ZvoogTicker.prototype.tick = function (me, nextPositionTime, loopStart, loopDuration, nextAudioTime, tickDuration) {
        if (me.onAir) {
            var a_1 = nextAudioTime;
            var p_1 = nextPositionTime;
            if (this.audioContext.currentTime + tickDuration > nextAudioTime) {
                var measureStarts = this.calculateMeasureStarts();
                this.scheduleNext(measureStarts, nextAudioTime, nextPositionTime, loopStart, loopDuration, tickDuration);
                a_1 = nextAudioTime + tickDuration;
                if (a_1 < this.audioContext.currentTime) {
                    a_1 = this.audioContext.currentTime;
                }
                p_1 = nextPositionTime + tickDuration;
                while (p_1 > loopStart + loopDuration) {
                    p_1 = p_1 - loopDuration;
                }
            }
            this.scheduledTick = window.requestAnimationFrame(function (t) {
                me.waitNextPositionTime = p_1;
                me.tick(me, p_1, loopStart, loopDuration, a_1, tickDuration);
            });
        }
        else {
            this.cancel();
        }
    };
    ZvoogTicker.prototype.cancel = function () {
        window.cancelAnimationFrame(this.scheduledTick);
        for (var t = 0; t < this.scheduleDefinition.tracks.length; t++) {
            var track = this.scheduleDefinition.tracks[t];
            for (var i = 0; i < track.voices.length; i++) {
                var voice = track.voices[i];
                var pluginSource = voice.source.pluginSource;
                if (pluginSource) {
                    pluginSource.cancelSchedule();
                }
                for (var f = 0; f < voice.effects.length; f++) {
                    var pluginEffect = voice.effects[f].pluginEffect;
                    if (pluginEffect) {
                        var fx = pluginEffect.getParams();
                        for (var p = 0; p < fx.length; p++) {
                            fx[p].cancelScheduledValues(0);
                        }
                    }
                }
            }
            for (var f = 0; f < track.effects.length; f++) {
                var pluginEffect = track.effects[f].pluginEffect;
                if (pluginEffect) {
                    var fx = pluginEffect.getParams();
                    for (var p = 0; p < fx.length; p++) {
                        fx[p].cancelScheduledValues(0);
                    }
                }
            }
        }
        for (var f = 0; f < this.scheduleDefinition.effects.length; f++) {
            var pluginEffect = this.scheduleDefinition.effects[f].pluginEffect;
            if (pluginEffect) {
                var fx = pluginEffect.getParams();
                for (var p = 0; p < fx.length; p++) {
                    fx[p].cancelScheduledValues(0);
                }
            }
        }
    };
    ZvoogTicker.prototype.restart = function () {
        if (this.onAir) {
            this.cancel();
            var nextAudioTime = this.audioContext.currentTime;
            var measureStarts = this.calculateMeasureStarts();
            var tickDuration = this.defTickDuration;
            this.restartParams(measureStarts, nextAudioTime, 0, tickDuration);
            this.tick(this, this.waitNextPositionTime, this.waitLoopStart, this.waitLoopDuration, nextAudioTime, tickDuration);
        }
    };
    ZvoogTicker.prototype.start = function (nextPositionTime, loopStart, loopDuration) {
        if (this.onAir) {
            //console.log('skip start');
            return false;
        }
        var tickDuration = this.defTickDuration;
        if (tickDuration < loopDuration) {
            this.onAir = true;
            var nextAudioTime = this.audioContext.currentTime;
            var measureStarts = this.calculateMeasureStarts();
            this.restartParams(measureStarts, nextAudioTime, nextPositionTime, tickDuration);
            this.waitLoopStart = loopStart;
            this.waitLoopDuration = loopDuration;
            this.tick(this, nextPositionTime, loopStart, loopDuration, nextAudioTime, tickDuration);
        }
        return true;
    };
    ZvoogTicker.prototype.stop = function () {
        this.onAir = false;
        this.cancel();
    };
    ZvoogTicker.prototype.unconnectVoice = function (voice) {
        //console.log('unconncetVoice', voice.title);
        var pluginSource = voice.source.pluginSource;
        if (pluginSource) {
            pluginSource.getOutput().disconnect();
            pluginSource.state().unlock();
            for (var i = 0; i < voice.effects.length; i++) {
                var pluginEffect = voice.effects[i].pluginEffect;
                if (pluginEffect) {
                    pluginEffect.getOutput().disconnect();
                    pluginEffect.getInput().disconnect();
                    //console.log('disconnect', i);
                    pluginEffect.state().unlock();
                }
                else {
                    //console.log('skip disconnect', i);
                }
                voice.effects[i].pluginEffect = null;
            }
            //console.log('unconncetVoice', voice.title);
        }
        else {
            //console.log('skip unconncetVoice', voice.title);
        }
        voice.source.pluginSource = null;
    };
    ZvoogTicker.prototype.connectVoice = function (voice, track) {
        if (!(voice.source.pluginSource)) {
            voice.source.pluginSource
                = createPluginSource(voice.source.kind
                //, voice.source.initial
                );
        }
        var pluginSource = voice.source.pluginSource;
        if (pluginSource) {
            pluginSource.prepare(this.audioContext, voice.source.initial);
            var voiceNode = pluginSource.getOutput();
            for (var i = 0; i < voice.effects.length; i++) {
                if (!(voice.effects[i].pluginEffect)) {
                    voice.effects[i].pluginEffect
                        = createPluginEffect(voice.effects[i].kind
                        //, voice.effects[i].initial
                        );
                }
                var pluginEffect = voice.effects[i].pluginEffect;
                if (pluginEffect) {
                    pluginEffect.prepare(this.audioContext, voice.effects[i].initial);
                    voiceNode.connect(pluginEffect.getInput());
                    voiceNode = pluginEffect.getOutput();
                    //console.log('connect track', track, 'voice', s, 'effect', i);
                }
            }
            var target = void 0;
            if (track.effects.length > 0) {
                var pluginEffect = track.effects[0].pluginEffect;
                if (pluginEffect) {
                    target = pluginEffect.getOutput();
                }
                else {
                    target = this.masterNode;
                }
            }
            else {
                target = this.masterNode;
            }
            voiceNode.connect(target);
            //console.log('connectVoice', voice.title);
        }
        else {
            //console.log('skip connectVoice', voice.title);
        }
    };
    ZvoogTicker.prototype.connectTrack = function (track) {
        //let trackNode: AudioNode = this.audioContext.createGain();
        //for (let s = 0; s < track.voices.length; s++) {
        //	let voice: ZvoogVoice = track.voices[s];
        //	this.connectVoice(voice,track);
        /*if (!(voice.source.pluginSource)) {
            voice.source.pluginSource
                = createPluginSource(voice.source.kind
                    , voice.source.initial);
        }
        let pluginSource = voice.source.pluginSource;
        if (pluginSource) {
            pluginSource.prepare(this.audioContext);
            let voiceNode: AudioNode = pluginSource.getOutput();
            for (let i = 0; i < voice.effects.length; i++) {
                if (!(voice.effects[i].pluginEffect)) {
                    voice.effects[i].pluginEffect
                        = createPluginEffect(voice.effects[i].kind
                            , voice.effects[i].initial);
                }
                let pluginEffect = voice.effects[i].pluginEffect;
                if (pluginEffect) {
                    pluginEffect.prepare(this.audioContext);
                    voiceNode.connect(pluginEffect.getInput());
                    voiceNode = pluginEffect.getOutput();
                    //console.log('connect track', track, 'voice', s, 'effect', i);
                }
            }
            voiceNode.connect(trackNode);
            //console.log('connect source', track, 'voice', s);
        }*/
        //}
        var trackNode = null;
        for (var i = 0; i < track.effects.length; i++) {
            if (!(track.effects[i].pluginEffect)) {
                track.effects[i].pluginEffect
                    = createPluginEffect(track.effects[i].kind
                    //, track.effects[i].initial
                    );
            }
            var pluginEffect = track.effects[i].pluginEffect;
            if (pluginEffect) {
                pluginEffect.prepare(this.audioContext, track.effects[i].initial);
                if (trackNode) {
                    trackNode.connect(pluginEffect.getInput());
                }
                trackNode = pluginEffect.getOutput();
                //console.log('connect track', track);
            }
        }
        //let voiceTarget: AudioNode;
        if (trackNode) {
            trackNode.connect(this.masterNode);
            //voiceTarget = trackNode;
        } //else {
        //voiceTarget = this.masterNode;
        //}
        for (var s = 0; s < track.voices.length; s++) {
            var voice = track.voices[s];
            this.connectVoice(voice, track);
        }
        //console.log('connect track', track, 'to master');
    };
    ZvoogTicker.prototype.prepareProject = function (project, audioCtxt, target) {
        this.scheduleDefinition = project;
        this.audioContext = audioCtxt;
        this.masterNode = this.audioContext.createGain();
        //let currentNode: AudioNode = this.masterNode;
        this.preDestinationNode = this.masterNode;
        for (var i = 0; i < this.scheduleDefinition.effects.length; i++) {
            if (!(this.scheduleDefinition.effects[i].pluginEffect)) {
                this.scheduleDefinition.effects[i].pluginEffect
                    = createPluginEffect(this.scheduleDefinition.effects[i].kind
                    //, this.scheduleDefinition.effects[i].initial
                    );
            }
            var pluginEffect = this.scheduleDefinition.effects[i].pluginEffect;
            if (pluginEffect) {
                pluginEffect.prepare(this.audioContext, this.scheduleDefinition.effects[i].initial);
                //currentNode.connect(pluginEffect.getInput());
                //currentNode = pluginEffect.getOutput();
                this.preDestinationNode.connect(pluginEffect.getInput());
                this.preDestinationNode = pluginEffect.getOutput();
            }
        }
        //currentNode.connect(target);
        this.preDestinationNode.connect(target);
        //console.log('connect destination');
        for (var t = 0; t < this.scheduleDefinition.tracks.length; t++) {
            var track = this.scheduleDefinition.tracks[t];
            this.connectTrack(track);
            /*let trackNode: AudioNode = audioContext.createGain();
            for (let s = 0; s < track.voices.length; s++) {
                let voice: ZvoogVoice = track.voices[s];
                if (!(voice.source.pluginSource)) {
                    voice.source.pluginSource
                        = createPluginSource(voice.source.kind
                            , voice.source.initial);
                }
                let pluginSource = voice.source.pluginSource;
                if (pluginSource) {
                    pluginSource.prepare(audioContext);
                    let voiceNode: AudioNode = pluginSource.getOutput();
                    for (let i = 0; i < voice.effects.length; i++) {
                        if (!(voice.effects[i].pluginEffect)) {
                            voice.effects[i].pluginEffect
                                = createPluginEffect(voice.effects[i].kind
                                    , voice.effects[i].initial);
                        }
                        let pluginEffect = voice.effects[i].pluginEffect;
                        if (pluginEffect) {
                            pluginEffect.prepare(audioContext);
                            voiceNode.connect(pluginEffect.getInput());
                            voiceNode = pluginEffect.getOutput();
                            console.log('connect track', t, 'voice', s, 'effect', i);
                        }
                    }
                    voiceNode.connect(trackNode);
                    console.log('connect source', t, 'voice', s);
                }
            }
            for (let i = 0; i < track.effects.length; i++) {
                if (!(track.effects[i].pluginEffect)) {
                    track.effects[i].pluginEffect
                        = createPluginEffect(track.effects[i].kind
                            , track.effects[i].initial);
                }
                let pluginEffect = track.effects[i].pluginEffect;
                if (pluginEffect) {
                    pluginEffect.prepare(audioContext);
                    trackNode.connect(pluginEffect.getInput());
                    trackNode = pluginEffect.getOutput();
                    console.log('connect track', t);
                }
            }
            trackNode.connect(this.masterNode);
            console.log('connect track', t, 'to master');*/
        }
    };
    ZvoogTicker.prototype.unconnectAllVoices = function (track) {
        for (var v = 0; v < track.voices.length; v++) {
            var voice = track.voices[v];
            this.unconnectVoice(voice);
        }
        track.voices = [];
    };
    return ZvoogTicker;
}());
;
var ZvoogApp = /** @class */ (function () {
    function ZvoogApp() {
        this.versionCode = 'v2.84';
        this.stateName = 'lastSaved';
        this.counterName = 'num';
        this.undoName = 'historyList';
        this.lastTyped = 'lastTyped';
        this.selectedTempo = 120;
        this.selectedProgression = 0;
        this.selectedDrums = 0;
        this.curDrumVolume = 0;
        this.selectedBass = 0;
        this.curBassVolume = 0;
        this.selectedLead = 0;
        this.curLeadVolume = 0;
        this.selectedPad = 0;
        this.curPadVolume = 0;
        this.loadedSchedules = [];
        this.undoList = [];
        //adsCounter: number = 7;
        //adsLimit: number = 10;
        this.drumsSchedules = [
            { name: 'big room 1', path: './patterns/drums/dance/hardbass1.js' },
            { name: 'big room 2', path: './patterns/drums/dance/hardbass2.js' },
            { name: 'big room 3', path: './patterns/drums/dance/hardbass3.js' },
            { name: 'big room 4', path: './patterns/drums/dance/hardbass4.js' },
            { name: 'big room 5', path: './patterns/drums/dance/hardbass5.js' },
            { name: 'mumbai 1', path: './patterns/drums/dance/mumbai1.js' },
            { name: 'disco 1', path: './patterns/drums/dance/disco1.js' },
            { name: 'slow rock 1', path: './patterns/drums/trap/rockslow.js' },
            { name: 'trap 1', path: './patterns/drums/trap/trap1.js' },
            { name: 'trap 2', path: './patterns/drums/trap/trap2.js' },
            { name: 'trap 3', path: './patterns/drums/trap/trap3.js' },
            { name: 'hip-hop 1', path: './patterns/drums/hiphop/rap.js' },
            { name: 'hip-hop 2', path: './patterns/drums/hiphop/funk.js' },
            { name: 'hip-hop 3', path: './patterns/drums/hiphop/prodigy.js' },
            { name: 'hip-hop 4', path: './patterns/drums/hiphop/funkypresident.js' },
            { name: 'power 1', path: './patterns/drums/rock/simplehihat1.js' },
            { name: 'power 2', path: './patterns/drums/rock/drumbase.js' },
            { name: 'power 3', path: './patterns/drums/rock/rock1.js' },
            { name: 'power 4', path: './patterns/drums/rock/ride1.js' },
            { name: 'power 5', path: './patterns/drums/rock/ledzepleevesbreak.js' },
            { name: 'power 6', path: './patterns/drums/rock/rock2.js' },
            { name: 'power 7', path: './patterns/drums/rock/rock3.js' },
            { name: 'power 8', path: './patterns/drums/rock/hard1.js' },
            { name: 'power 9', path: './patterns/drums/rock/hard2.js' },
            { name: 'alternative 1', path: './patterns/drums/alternative/alatriplet.js' },
            { name: 'alternative 2', path: './patterns/drums/alternative/motowngroove.js' },
            { name: 'alternative 3', path: './patterns/drums/alternative/benny.js' },
            { name: 'alternative 4', path: './patterns/drums/alternative/punk2.js' },
            { name: 'alternative 5', path: './patterns/drums/alternative/power.js' }
        ];
        this.bassSchedules = [
            { name: 'edm 1', path: './patterns/bass/octave1_synth.js' },
            { name: 'edm 2', path: './patterns/bass/octave2.js' },
            { name: 'edm 3', path: './patterns/bass/octaveii.js' },
            { name: 'edm 4', path: './patterns/bass/strange.js' },
            { name: 'atc 1', path: './patterns/lead/atc.js' },
            { name: 'odd 1', path: './patterns/bass/octave32off.js' },
            { name: 'odd 2', path: './patterns/bass/octave31off.js' },
            { name: 'odd 3', path: './patterns/bass/ozo.js' },
            { name: 'odd 4', path: './patterns/bass/mission.js' },
            { name: 'steady 1', path: './patterns/bass/tonic1.js' },
            { name: 'steady 2', path: './patterns/bass/tonic2.js' },
            { name: 'steady 3', path: './patterns/bass/octave4terc.js' },
            { name: 'steady 4', path: './patterns/bass/tnt.js' },
            { name: 'bass 1', path: './patterns/bass/manuchao.js' },
            { name: 'bass 2', path: './patterns/bass/funk.js' },
            { name: 'bass 3', path: './patterns/bass/rich1.js' },
            { name: 'bass 4', path: './patterns/bass/rich2.js' },
            { name: 'bass 5', path: './patterns/bass/rich4p.js' },
            { name: 'bass 6', path: './patterns/bass/rich5.js' },
            { name: 'bass 7', path: './patterns/bass/rich5a.js' },
            { name: 'freestyler 1', path: './patterns/lead/bomfunkmc.js' },
            { name: 'float 1', path: './patterns/bass/rich6.js' },
            { name: 'float 2', path: './patterns/bass/route66.js' },
            { name: 'float 3', path: './patterns/bass/rich3fun.js' }
        ];
        this.leadSchedules = [
            { name: 'piano 1', path: './patterns/piano/beat/slade.js' },
            { name: 'piano 2', path: './patterns/piano/beat/route66.js' },
            { name: 'piano 3', path: './patterns/piano/beat/abba.js' },
            { name: 'piano 4', path: './patterns/piano/beat/another.js' },
            { name: 'piano 5', path: './patterns/piano/beat/bronsky.js' },
            { name: 'piano 6', path: './patterns/piano/beat/chikago.js' },
            { name: 'piano 7', path: './patterns/piano/beat/ravel.js' },
            { name: 'piano 8', path: './patterns/piano/beat/sandstorm.js' },
            { name: 'piano 9', path: './patterns/piano/beat/second.js' },
            { name: 'clean guitar 1', path: './patterns/guitar/strum/strums1clear.js' },
            { name: 'clean guitar 2', path: './patterns/guitar/strum/strums3clear.js' },
            { name: 'clean guitar 3', path: './patterns/guitar/strum/strums5clear.js' },
            { name: 'clean guitar 4', path: './patterns/guitar/strum/strums7clear.js' },
            { name: 'clean guitar 5', path: './patterns/guitar/strum/strumsAux1clear.js' },
            { name: 'electro guitar 1', path: './patterns/guitar/strum/strums2rock.js' },
            { name: 'electro guitar 2', path: './patterns/guitar/strum/strums4rock.js' },
            { name: 'electro guitar 3', path: './patterns/guitar/strum/strums5rock.js' },
            { name: 'electro guitar 4', path: './patterns/guitar/strum/strums8rock.js' },
            { name: 'electro guitar 5', path: './patterns/guitar/strum/strumsAux1rock.js' },
            { name: 'reggae 1', path: './patterns/guitar/strum/reggae1.js' },
            { name: 'rust guitar 1', path: './patterns/guitar/arpeggio/arp1rust.js' },
            { name: 'rust guitar 2', path: './patterns/guitar/arpeggio/arp2rust.js' },
            { name: 'rust guitar 3', path: './patterns/guitar/arpeggio/arp3rust.js' },
            { name: 'atc 1', path: './patterns/lead/atc.js' },
            { name: 'jump 1', path: './patterns/lead/vanhalen.js' },
            { name: 'freestyler 1', path: './patterns/lead/bomfunkmc.js' },
            { name: 'arpeggio 1', path: './patterns/guitar/arpeggio/arp2rock.js' },
            { name: 'arpeggio 2', path: './patterns/guitar/arpeggio/arp3clear.js' },
            { name: 'arpeggio 3', path: './patterns/piano/arpeggio/arp1b.js' },
            { name: 'arpeggio 4', path: './patterns/piano/arpeggio/arp2b.js' },
            { name: 'arpeggio 5', path: './patterns/piano/arpeggio/arp3b.js' },
            { name: 'overdrive 1', path: './patterns/drive/long.js' },
            { name: 'overdrive 2', path: './patterns/drive/kickstart2.js' },
            { name: 'overdrive 3', path: './patterns/drive/sadbuttrue.js' },
            { name: 'overdrive 4', path: './patterns/drive/kickstart1.js' },
            { name: 'overdrive 5', path: './patterns/drive/route66.js' },
            { name: 'overdrive 6', path: './patterns/drive/gipsyroad.js' },
            { name: 'overdrive 7', path: './patterns/drive/volya.js' },
            { name: 'overdrive 8', path: './patterns/drive/california.js' }
        ];
        this.padSchedules = [
            { name: 'synth 1', path: './patterns/pad/viola1.js' },
            { name: 'synth 2', path: './patterns/pad/viola2.js' },
            { name: 'synth 3', path: './patterns/pad/viola3.js' },
            { name: 'synth 4', path: './patterns/pad/viola4.js' },
            { name: 'synth 5', path: './patterns/pad/viola5.js' },
            { name: 'synth 6', path: './patterns/pad/viola6.js' },
            { name: 'violin 1', path: './patterns/pad/violin1.js' },
            { name: 'violin 2', path: './patterns/pad/violin2.js' },
            { name: 'wind 1', path: './patterns/pad/wind1.js' },
            { name: 'wind 2', path: './patterns/pad/wind2.js' },
            { name: 'rock organ 1', path: './patterns/pad/organ1.js' },
            { name: 'rock organ 2', path: './patterns/pad/organ2.js' },
            { name: 'rock organ 3', path: './patterns/pad/organ3.js' },
            { name: 'rock organ 4', path: './patterns/pad/organ4.js' },
            { name: 'crystal 1', path: './patterns/pad/crystal1.js' },
            { name: 'crystal 2', path: './patterns/pad/organ5.js' },
            { name: 'aqua 1', path: './patterns/pad/aqua1.js' },
            { name: 'aqua 2', path: './patterns/pad/aqua2.js' },
            { name: 'aqua 3', path: './patterns/pad/aqua3.js' },
            { name: 'choir 1', path: './patterns/pad/choir1.js' },
            { name: 'choir 2', path: './patterns/pad/choir2.js' },
            { name: 'choir 3', path: './patterns/pad/choir3.js' },
            { name: 'choir 4', path: './patterns/pad/choir4.js' },
            { name: 'choir 5', path: './patterns/pad/choir5.js' },
            { name: 'choir 6', path: './patterns/pad/choir6.js' }
        ];
        this.cashedDrums = [];
        this.cashedIns = [];
        this.progVariants = [
            {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-',
                    '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-',
                    '0,-,-,1,-,-,-,-,0,-,-,1,-,-,-,-',
                    '0,-,-,-,-,-,1,-,0,-,-,-,-,-,1,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-',
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-',
                    '0,-,-,1,-,-,-,-,0,-,-,1,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,-,-,-,-,-',
                    '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,1,-,-,-,2,-,-,-',
                    '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-',
                    '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-',
                    '0,-,1,-,2,-,-,-,-,-,-,-,-,-,-,-',
                    '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-',
                    '0,-,1,-,-,-,-,-,2,-,3,-,-,-,-,-',
                    '0,-,1,-,-,-,-,-,-,-,-,-,-,-,-,-,2,-,3,-,-,-,-,-,-,-,-,-,-,-,-,-',
                    '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,-,-,-,-',
                    '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,3,-,-,-',
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,3,-,-,-,2,-,-,-,3,-,-,-',
                    '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-',
                    '0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-',
                    '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-',
                    '0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,4,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-',
                    '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-',
                    '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-',
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-,-,-,-,-',
                    '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-',
                    '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,-,-,-,-',
                    '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-',
                    '0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-',
                    '0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,4,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,5,-,-,6,-,-,-,-,5,-,-,6,-,-,-,-',
                    '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-',
                    '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-',
                    '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,8,-,-,-',
                    '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-,8,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-',
                    '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-,8,-,-,-,-,-,-,-,9,-,-,-,-,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-',
                    '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-,8,-,-,-,-,-,-,-,9,-,-,-,10,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-,12,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-,12,-,-,-,13,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-,12,-,-,-,13,-,-,-,14,-,-,-'
                ]
            }, {
                s: [
                    '0,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-,12,-,-,-,13,-,-,-,14,-,-,-,15,-,-,-'
                ]
            }
        ];
        this.waitLoadPath = '';
        console.log('ZvoogApp', this.versionCode);
        //this.checkUIMode();
        console.log('audio/mpeg', MediaRecorder.isTypeSupported('audio/mpeg'));
        console.log('audio/ogg', MediaRecorder.isTypeSupported('audio/ogg'));
        console.log('audio/mp4', MediaRecorder.isTypeSupported('audio/mp4'));
        var title = document.getElementById('titleVersion');
        if (title) {
            title.textContent = 'RockDice ' + this.versionCode;
        }
        this.initUndo();
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var seed = urlParams.get('seed');
        console.log('seed', seed);
        if (seed) {
            try {
                var param = JSON.parse(seed);
                var o = this.readObjectFromlocalStorage(this.stateName);
                if (o) {
                    var old = o;
                    old.comment = '' + new Date();
                    //let undo:StateSeed[]=[]
                    this.pushUndoState(old, this.undoList);
                }
                param.comment = '' + new Date();
                this.saveText2localStorage(this.stateName, JSON.stringify(param));
                window.location.replace("https://surikov.github.io/rockdice/main.html");
            }
            catch (xx) {
                console.log(xx);
            }
        }
        this.setUIMode();
        /*let cntr = this.readTextFromlocalStorage(this.counterName);
        this.adsCounter = parseInt(cntr);
        if (this.adsCounter) {
            //
        } else {
            this.adsCounter = this.adsLimit;
        }
        if (this.adsCounter < 1) {
            this.adsCounter = 1;
        }
        if (this.adsCounter > this.adsLimit) {
            this.adsCounter = this.adsLimit;
        }*/
    }
    //___checkUIMode() {
    //this.uiMode = 'web';
    //}
    ZvoogApp.prototype.setUIMode = function () {
        console.log('setUIMode ' + uiMode);
        //if (1 == 1) uiMode = 'web';
        var e = document.getElementById('diceStart');
        if (e) {
            if (uiMode == 'free') {
                //this.adsLimit = 33;
                //e.src = 'resources/buttonDiceFree.svg';
            }
            else {
                if (uiMode == 'pro') {
                    //setDivStyleDisplay('menuNoAdsButton', 'none');
                    //e.src = 'resources/buttonDicePro.svg';
                }
                else {
                    if (uiMode == 'web') {
                        //setDivStyleDisplay('menuNoAdsButton', 'none');
                        //this.adsLimit = 10;
                        //e.src = 'resources/buttonDiceWeb.svg';
                    }
                    else {
                        //e.src = 'resources/buttonPlus.svg';
                    }
                }
            }
        }
        if (uiMode == 'pro') {
            //let e: HTMLElement = document.getElementById('adMobCounter') as any;
            //e.style.display = 'none';
        }
        //setDivStyleDisplay('menuNoAdsButton', 'none');
    };
    ZvoogApp.prototype.dumpCashedInstruments = function () {
        this.dumpList(this.drumsSchedules);
        this.dumpList(this.bassSchedules);
        this.dumpList(this.leadSchedules);
        this.dumpList(this.padSchedules);
    };
    ZvoogApp.prototype.dumpList = function (list) {
        var me = this;
        this.wafpl = new WebAudioFontPlayer();
        for (var i = 0; i < list.length; i++) {
            var ss = list[i];
            this.doForCachedSchedule(ss.path, function (sch) {
                me.dumpPatterntInstruments(sch);
            });
        }
    };
    ZvoogApp.prototype.dumpPatterntInstruments = function (schedule) {
        this.dumpTrackDrums(schedule.tracks[0]);
        for (var i = 1; i < schedule.tracks.length; i++) {
            this.dumpTrackInstruments(schedule.tracks[i]);
        }
    };
    ZvoogApp.prototype.dumpTrackDrums = function (track) {
        for (var i = 0; i < track.voices.length; i++) {
            var loaderNum = parseInt(track.voices[i].source.initial);
            var iurl = this.wafpl.loader.drumKeys()[loaderNum];
            var url = 'https://surikov.github.io/webaudiofontdata/sound/128' + iurl + '.js';
            if (this.cashedDrums.indexOf(url) < 0) {
                this.cashedDrums.push(url);
                console.log(this.cashedDrums.length, 'drum', track.voices[i].source.initial, url);
            }
        }
    };
    ZvoogApp.prototype.dumpTrackInstruments = function (track) {
        for (var i = 0; i < track.voices.length; i++) {
            var loaderNum = parseInt(track.voices[i].source.initial);
            var iurl = this.wafpl.loader.instrumentKeys()[loaderNum];
            //https://surikov.github.io/webaudiofontdata/sound/0140_Chaos_sf2_file.html
            var url = 'https://surikov.github.io/webaudiofontdata/sound/' + iurl + '.js';
            if (this.cashedIns.indexOf(url) < 0) {
                this.cashedIns.push(url);
                console.log(this.cashedIns.length, 'instrument', track.voices[i].source.initial, url);
            }
        }
    };
    /*
    dumpCurrentState() {
        //console.log('dumpCurrentState');
        let state: StateSeed = {
            drumsSeed: this.selectedDrums
            , bassSeed: this.selectedBass
            , leadSeed: this.selectedLead
            , padSeed: this.selectedPad
            , progression: []
            , tempo: this.selectedTempo
            , mode: this.schedule.harmony.mode
            , tone: this.schedule.harmony.tone
        };
        for (let i = 0; i < this.schedule.harmony.progression.length; i++) {
            let mel: ZvoogChordMelody = {
                duration: {
                    count: this.schedule.harmony.progression[i].duration.count
                    , division: this.schedule.harmony.progression[i].duration.division
                }
                , chord: this.schedule.harmony.progression[i].chord
            };
            state.progression.push(mel);
        }

    }
    loadTestState() {
        this.loadFromState(
            {
                "drumsSeed": 16, "bassSeed": 20, "leadSeed": 23, "padSeed": 0, "progression": [
                    { "duration": { "count": 1, "division": 1 }, "chord": "Em" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "G" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "Dsus4" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "A7sus4" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "Em" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "G" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "Dsus4" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "A7sus4" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "Em" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "G" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "Dsus4" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "A7sus4" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "Em" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "G" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "Dsus4" }
                    , { "duration": { "count": 1, "division": 1 }, "chord": "A7sus4" }
                ], "tempo": 146, "mode": "Dorian", "tone": "E"
            }
        );
    }*/
    //loadFromState(state: StateSeed) {
    //	console.log('loadFromState', state);
    //}
    ZvoogApp.prototype.cutRepeatedProgPats = function (chords) {
        var half = Math.floor(chords.length / 2);
        for (var i = 0; i < half; i++) {
            if (chords[i] != chords[i + half]) {
                return;
            }
        }
        //console.log('cutRepeatedProgPats', chords.length, half);
        chords.length = half;
    };
    ZvoogApp.prototype.storeChangedStateNoStartAd = function () {
        this.pushUndoState(this.createCurrentState(), this.undoList);
        /*if (uiMode == 'web') {
            this.adsCounter--;
            if (this.adsCounter > 0) {
                this.updateAdsTicker();
                return true;
            } else {
                this.startAdsShow();
                return false;
            }
        } else {
            if (uiMode == 'free') {
                this.adsCounter--;
                if (this.adsCounter > 0) {
                    this.updateAdsTicker();
                    return true;
                } else {
                    this.startAdsShow();
                    return false;
                }
            } else {
                return true;
            }
        }*/
        return true;
    };
    /*updateAdsTicker() {
        let e: HTMLInputElement | null = document.getElementById('adMobInfo') as any;
        if (e) {
            e.textContent = '' + this.adsCounter;
        }
    }*/
    /*startAdsShow() {
        console.log('startAdsShow');
        this.cancelPlay();
        let me = this;
        saveState();
        if (uiMode == 'free') {
            setTimeout(() => {
                me.cancelPlay();
                invokeShowAd();
            }
                , 999
            );

        } else {
            if (uiMode == 'web') {
                window.open('https://play.google.com/store/apps/details?id=rockdice.chord.progression');//, '_system', 'location=yes');
                this.rewardAdsShow();
            } else {
                //
            }
        }
    }*/
    /*rewardAdsShow() {
        this.adsCounter = this.adsLimit;
        this.updateAdsTicker();
    }*/
    ZvoogApp.prototype.createCurrentState = function () {
        /*console.log('createCurrentState start');
        for(var ii=0;ii<this.schedule.harmony.progression.length;ii++){
            console.log(this.schedule.harmony.progression[ii].chord,this.schedule.harmony.progression[ii].duration.count,this.schedule.harmony.progression[ii].duration.division);
        }*/
        var state = {
            drumsSeed: this.selectedDrums,
            bassSeed: this.selectedBass,
            leadSeed: this.selectedLead,
            padSeed: this.selectedPad,
            drumsVolume: this.curDrumVolume,
            bassVolume: this.curBassVolume,
            leadVolume: this.curLeadVolume,
            padVolume: this.curPadVolume,
            chords: [],
            tempo: this.selectedTempo,
            mode: this.schedule.harmony.mode,
            tone: this.schedule.harmony.tone,
            version: this.versionCode,
            comment: '' + new Date(),
            ui: uiMode
        };
        //for (let i = 0; i < this.schedule.harmony.progression.length; i++) {
        //	state.chords.push(this.schedule.harmony.progression[i].chord);
        //	state.chords.push('' + this.schedule.harmony.progression[i].duration.count + '/' + this.schedule.harmony.progression[i].duration.division);
        //
        //		}
        //console.log('a', this.schedule.harmony.progression[2].chord, this.schedule.harmony.progression[2].duration.count, this.schedule.harmony.progression[2].duration.division);
        var current = null;
        for (var i = 0; i < this.schedule.harmony.progression.length; i++) {
            var item = {
                chord: this.schedule.harmony.progression[i].chord, duration: {
                    count: this.schedule.harmony.progression[i].duration.count,
                    division: this.schedule.harmony.progression[i].duration.division
                }
            };
            //this.schedule.harmony.progression[i];
            //console.log(i,item.chord,item.duration.count,item.duration.division);
            if (current) {
                if (current.chord == item.chord) {
                    current.duration = simplifyMeter(plusMeter(current.duration, item.duration));
                }
                else {
                    state.chords.push(current.chord);
                    state.chords.push('' + current.duration.count + '/' + current.duration.division);
                    //console.log('add',state.chords[state.chords.length-2],state.chords[state.chords.length-1]);
                    current = item;
                }
            }
            else {
                current = item;
            }
        }
        //console.log('b', this.schedule.harmony.progression[2].chord, this.schedule.harmony.progression[2].duration.count, this.schedule.harmony.progression[2].duration.division);
        if (current) {
            state.chords.push(current.chord);
            state.chords.push('' + current.duration.count + '/' + current.duration.division);
            //console.log('end',state.chords[state.chords.length-2],state.chords[state.chords.length-1]);
        }
        //console.log('c', this.schedule.harmony.progression[2].chord, this.schedule.harmony.progression[2].duration.count, this.schedule.harmony.progression[2].duration.division);
        this.cutRepeatedProgPats(state.chords);
        this.cutRepeatedProgPats(state.chords);
        //console.log('d', this.schedule.harmony.progression[2].chord, this.schedule.harmony.progression[2].duration.count, this.schedule.harmony.progression[2].duration.division);
        return state;
    };
    ZvoogApp.prototype.createShareLink = function (state) {
        var json = JSON.stringify(state);
        var tmp = JSON.parse(json);
        tmp.comment = '';
        json = JSON.stringify(tmp);
        var seed = encodeURIComponent(json);
        var url = 'https://mzxbox.ru/RockDice/share.php?seed=' + seed;
        console.log(url);
        return url;
    };
    ZvoogApp.prototype.pushUndoState = function (state, undo) {
        //let state = this.createCurrentState();
        undo.splice(0, 0, state);
        if (undo.length > 99) {
            undo.length = 99;
        }
        //console.log('storeChangedState', state);
        var txt = JSON.stringify(undo);
        this.saveText2localStorage(this.undoName, txt);
    };
    ZvoogApp.prototype.loadSongState = function (state) {
        var _this = this;
        console.log('loadSongState', state);
        this.selectedTempo = state.tempo;
        this.selectedDrums = state.drumsSeed;
        this.curDrumVolume = state.drumsVolume;
        this.selectedBass = state.bassSeed;
        this.curBassVolume = state.bassVolume;
        this.selectedLead = state.leadSeed;
        this.curLeadVolume = state.leadVolume;
        this.selectedPad = state.padSeed;
        this.curPadVolume = state.padVolume;
        this.schedule.harmony.mode = state.mode;
        this.schedule.harmony.tone = state.tone;
        this.schedule.effects[0].parameters[6].points[0].velocity = 119;
        for (var i = 0; i < this.schedule.measures.length; i++) {
            this.schedule.measures[i].tempo = this.selectedTempo;
        }
        this.schedule.harmony.progression = [];
        for (var i = 0; i < state.chords.length; i = i + 2) {
            var dur = state.chords[i + 1].split('/');
            this.schedule.harmony.progression.push({
                duration: {
                    count: parseInt(dur[0]),
                    division: parseInt(dur[1])
                },
                chord: state.chords[i]
            });
        }
        //this.ticker.prepare(this.schedule, this.audioContext, this.audioContext.destination);
        var duration = { count: 16, division: 1 };
        this.harmonizer.repeatAllVoices(this.schedule, duration);
        var me = this;
        this.setAllTracks(function () {
            //let duration: ZvoogMeter = { count: 16, division: 1 };
            //me.harmonizer.repeatAllVoices(this.schedule, duration);
            /*
            let newTime = durations2time(me.schedule.measures);
            me.ticker.waitLoopDuration = newTime;
            me.waitStart(null);
            */
            _this.setDrumsVolume(_this.curDrumVolume);
            _this.setBassVolume(_this.curBassVolume);
            _this.setLeadVolume(_this.curLeadVolume);
            _this.setPadVolume(_this.curPadVolume);
            //console.log(me.schedule);
            me.refitUndoList();
            /*
                        me.ticker.unconnectAllVoices(me.schedule.tracks[0]);
                        let t1=me.schedule.tracks[0]
                        for (let s = 0; s < t1.voices.length; s++) {
                            let voice: ZvoogVoice = t1.voices[s];
                            me.ticker.connectVoice(voice, t1);
                        }
                        me.ticker.unconnectAllVoices(me.schedule.tracks[1]);
                        me.ticker.unconnectAllVoices(me.schedule.tracks[2]);
                        me.ticker.unconnectAllVoices(me.schedule.tracks[3]);
            */
            rockDiceRestartOrStart();
        });
    };
    ZvoogApp.prototype.interStart = function () {
        if (this.harmonizer) {
            console.log('skip interStart');
        }
        else {
            this.harmonizer = new ZvoogHarmonizer();
            this.ticker = new ZvoogTicker();
            var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContextFunc();
            this.fillSelectors();
            this.schedule = this.harmonizer.createEmptyBaseSchedule();
            this.ticker.prepareProject(this.schedule, this.audioContext, this.audioContext.destination);
            var o = this.readObjectFromlocalStorage(this.stateName);
            if (o) {
                //console.log('state init');
                this.loadSongState(o);
                //console.log('done state init');
            }
            else {
                console.log('random init');
                this.setDefaultVolumes();
                //this.ticker.prepare(this.schedule, this.audioContext, this.audioContext.destination);
                this.chooseRandomSong();
            }
            //this.updateAdsTicker();
            //this.audioContext.audioWorklet.addModule('zvoogexportaudio.js');
            //console.log('started');
        }
    };
    ZvoogApp.prototype.setDefaultVolumes = function () {
        this.setDrumsVolume(111);
        this.setBassVolume(99);
        this.setLeadVolume(66);
        this.setPadVolume(77);
    };
    ZvoogApp.prototype.initUndo = function () {
        var o = this.readObjectFromlocalStorage(this.undoName);
        if (o) {
            if (o.length) {
                for (var k = 0; k < o.length; k++) {
                    this.undoList.push(o[k]);
                }
            }
        }
    };
    ZvoogApp.prototype.waitStart = function (afterStart) {
        var _this = this;
        if (this.ticker.ready()) {
            //this.ticker.start(0, 0, durations2time(this.schedule.measures));
            //let newTime = durations2time(this.schedule.measures);
            //this.ticker.waitLoopDuration = newTime;
            //this.ticker.restart();
            this.startPlay();
            if (afterStart)
                afterStart();
        }
        else {
            //console.log('waitStart');
            setTimeout(function () { _this.waitStart(afterStart); }, 999);
        }
    };
    ZvoogApp.prototype.chooseRandomDrums = function () {
        var _this = this;
        //let drumPatRange: HTMLSelectElement = document.getElementById('select_drums_pattern') as any;
        var rr = Math.floor(Math.random() * this.drumsSchedules.length);
        //drumPatRange.selectedIndex = rr;
        //console.log(rr, this.drumsSchedules.length);
        //handler.setValue(999 * (rr / (this.drumsSchedules.length - 1)));
        this.setDrumPattern(rr, function () {
            _this.ticker.restart();
        });
    };
    ZvoogApp.prototype.chooseRandomBass = function () {
        var _this = this;
        var bassPatRange = document.getElementById('select_bass_pattern');
        var rr = Math.floor(Math.random() * this.bassSchedules.length);
        bassPatRange.selectedIndex = rr;
        this.setBassPattern(rr, function () { _this.ticker.restart(); });
    };
    ZvoogApp.prototype.chooseRandomLead = function () {
        var _this = this;
        var leadPatRange = document.getElementById('select_lead_pattern');
        var rr = Math.floor(Math.random() * this.leadSchedules.length);
        leadPatRange.selectedIndex = rr;
        this.setLeadPattern(rr, function () { _this.ticker.restart(); });
    };
    ZvoogApp.prototype.chooseRandomPad = function () {
        var _this = this;
        var padPatRange = document.getElementById('select_pad_pattern');
        var rr = Math.floor(Math.random() * this.padSchedules.length);
        padPatRange.selectedIndex = rr;
        this.setPadPattern(rr, function () { _this.ticker.restart(); });
    };
    ZvoogApp.prototype.chooseRandomProgression = function () {
        var _this = this;
        var progPatRange = document.getElementById('select_prog_pattern');
        var rr = Math.floor(Math.random() * trackProgressions.length);
        progPatRange.selectedIndex = rr;
        this.setProgression(rr, function () { _this.ticker.restart(); });
    };
    ZvoogApp.prototype.chooseRandomSong = function () {
        //console.log('drums', this.drumsSchedules.length);
        //console.log('bass', this.bassSchedules.length);
        //console.log('lead', this.leadSchedules.length);
        //console.log('pad', this.padSchedules.length);
        //console.log('prog', trackProgressions.length);
        //for (var i = 0; i < trackProgressions.length; i++) {
        //console.log(',"', trackProgressions[i].title.split(' ')[0], '"');
        //}
        var drumN = Math.floor(Math.random() * this.drumsSchedules.length);
        var bassN = Math.floor(Math.random() * this.bassSchedules.length);
        var leadN = Math.floor(Math.random() * this.leadSchedules.length);
        var padN = Math.floor(Math.random() * this.padSchedules.length);
        var progN = Math.floor(Math.random() * trackProgressions.length);
        //let variantN = 0;
        var tempo = 130;
        //let compressor = 119;
        this.selectedDrums = drumN;
        this.selectedBass = bassN;
        this.selectedLead = leadN;
        this.selectedPad = padN;
        this.selectedProgression = progN;
        this.selectedTempo = tempo;
        this.setDrumsVolume(111);
        this.setBassVolume(99);
        this.setLeadVolume(66);
        this.setPadVolume(77);
        //	111 }] }] }] }
        //			, { title: 'Bass', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 99 }] }] }] }
        //			, { title: 'Lead', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 66 }] }] }] }
        //			, { title: 'Pad', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 77 }] }] }] }
        var me = this;
        var tp = trackProgressions[progN];
        if (tp.jspath) {
            me.doForCachedSchedule(tp.jspath, function (sch) {
                me.setTracksByRandom(sch.harmony); //, compressor);
            });
        }
        else {
            if (tp.harmony) {
                me.setTracksByRandom(tp.harmony); //, compressor);
            }
        }
        //me.schedule.title='Random v'+Math.round(Math.random()*1000);
        //me.schedule.effects[0]={};
        console.log('chooseRandomSong', me.schedule);
    };
    ZvoogApp.prototype.promptProgression = function () {
        var lastTypedProg = zapp.readTextFromlocalStorage(zapp.lastTyped);
        var txt = prompt('Am Dm G7, I iv III, etc.', lastTypedProg);
        if (txt) {
            zapp.saveText2localStorage(zapp.lastTyped, txt);
            //this.storeChangedStateAndCheck();
            this.pushUndoState(this.createCurrentState(), this.undoList);
            this.parseProgressionLine(txt);
        }
    };
    ZvoogApp.prototype.parseProgressionLine = function (txt) {
        //var txt = 'C - C/F# - Fmaj7 - F/G C - C/F# - Fmaj7 - Ab Bb';
        //i iv VII III VI ii° V
        //I–IV–♭VII–IV
        console.log('parseProgressionLine', txt);
        txt = txt.replace(/min/g, 'm');
        txt = txt.replace(/m/g, 'm');
        txt = txt.replace(/M/g, 'm');
        txt = txt.replace(/♭/g, 'b');
        txt = txt.replace(/♯/g, '#');
        txt = txt.replace(/\+/g, 'aug');
        txt = txt.replace(/ø/g, 'm7b5');
        txt = txt.replace(/°/g, 'dim7'); //, 'm7b5');
        txt = txt.replace(/º/g, 'dim7'); //, 'm7b5');
        txt = txt.replace(/0/g, 'm7b5');
        txt = txt.replace(/△/g, 'maj7');
        txt = txt.replace(/Δ/g, 'maj7');
        txt = txt.replace(/77/g, '7');
        txt = txt.replace(/-/g, ' ');
        txt = txt.replace(/—/g, ' ');
        txt = txt.replace(/–/g, ' ');
        txt = txt.replace(/\'/g, ' ');
        txt = txt.replace(/\"/g, ' ');
        txt = txt.replace(/\(/g, ' ');
        txt = txt.replace(/\)/g, ' ');
        txt = txt.replace(/#III/g, 'E#');
        txt = txt.replace(/#VII/g, 'B#');
        txt = txt.replace(/#IV/g, 'F#');
        txt = txt.replace(/#II/g, 'D#');
        txt = txt.replace(/#VI/g, 'A#');
        txt = txt.replace(/#V/g, 'G#');
        txt = txt.replace(/#I/g, 'C#');
        txt = txt.replace(/#iii/g, 'E#m');
        txt = txt.replace(/#vii/g, 'B#m');
        txt = txt.replace(/#iv/g, 'F#m');
        txt = txt.replace(/#ii/g, 'D#m');
        txt = txt.replace(/#vi/g, 'A#m');
        txt = txt.replace(/#v/g, 'G#m');
        txt = txt.replace(/#i/g, 'C#m');
        txt = txt.replace(/bIII/g, 'Eb');
        txt = txt.replace(/bVII/g, 'Bb');
        txt = txt.replace(/bIV/g, 'Fb');
        txt = txt.replace(/bII/g, 'Db');
        txt = txt.replace(/bVI/g, 'Ab');
        txt = txt.replace(/bV/g, 'Gb'); //i iv VII III VI ii° V
        txt = txt.replace(/bI/g, 'Cb');
        txt = txt.replace(/biii/g, 'Ebm');
        txt = txt.replace(/bvii/g, 'Bbm');
        txt = txt.replace(/biv/g, 'Fbm');
        txt = txt.replace(/bii/g, 'Dbm');
        txt = txt.replace(/bvi/g, 'Abm');
        txt = txt.replace(/bv/g, 'Gbm');
        txt = txt.replace(/bi/g, 'Cbm');
        txt = txt.replace(/III/g, 'E');
        txt = txt.replace(/VII/g, 'B');
        txt = txt.replace(/IV/g, 'F');
        txt = txt.replace(/II/g, 'D');
        txt = txt.replace(/VI/g, 'A');
        txt = txt.replace(/V/g, 'G');
        txt = txt.replace(/I/g, 'C');
        txt = txt.replace(/iii/g, 'Em');
        txt = txt.replace(/vii/g, 'Bm');
        txt = txt.replace(/iv/g, 'Fm');
        txt = txt.replace(/ii/g, 'Dm');
        txt = txt.replace(/vi/g, 'Am');
        txt = txt.replace(/v/g, 'Gm');
        txt = txt.replace(/i/g, 'Cm');
        txt = txt.replace(/dCmm/g, 'dim');
        //console.log(txt);
        var ss = txt.split(/[-,\n.\s|]+/);
        var chords = [];
        for (var i = 0; i < ss.length; i++) {
            var chordName = this.parseChordName(ss[i]);
            //console.log(i, ss[i], chordName);
            if (chordName != '-' && chords.length < 16) {
                chords.push(chordName);
            }
        }
        if (chords.length == 1) {
            chords.push(chords[0]);
        }
        if (chords.length > 1) {
            //console.log(chords);
            var harmony = {
                tone: '',
                mode: '',
                progression: this.createProgVariant(chords, true)
            };
            //let h:ZvoogHarmonizer=new ZvoogHarmonizer();
            var chordstring = chords.join('-');
            var exmo = this.harmonizer.extractMode(chordstring);
            //console.log(chords);
            console.log(exmo);
            //console.log(harmony);
            harmony.tone = exmo.name;
            harmony.mode = exmo.mode;
            //this.setTracksByRandom(harmony, 119);
            var me_3 = this;
            this.schedule.harmony = harmony;
            //this.schedule.effects[0].parameters[6].points[0].velocity = compressor;
            for (var i = 0; i < this.schedule.measures.length; i++) {
                this.schedule.measures[i].tempo = this.selectedTempo;
            }
            var duration = { count: 16, division: 1 };
            this.harmonizer.repeatAllVoices(this.schedule, duration);
            //console.log('start setAllTracks',me.schedule.harmony.progression);
            this.setAllTracks(function () {
                var newTime = durations2time(me_3.schedule.measures);
                me_3.ticker.waitLoopDuration = newTime;
                me_3.ticker.restart();
                //console.log('end of prompt', me.schedule.harmony.progression);
                //for (var ii = 0; ii < me.schedule.harmony.progression.length; ii++) {
                //	console.log(me.schedule.harmony.progression[ii].chord, me.schedule.harmony.progression[ii].duration.count, me.schedule.harmony.progression[ii].duration.division);
                //}
                //me.chooseVariantProg()
            });
        }
    };
    ZvoogApp.prototype.setTracksByRandom = function (harmony) {
        var me = this;
        this.schedule.harmony = JSON.parse(JSON.stringify(harmony));
        //this.schedule.effects[0].parameters[6].points[0].velocity = compressor;
        for (var i = 0; i < this.schedule.measures.length; i++) {
            this.schedule.measures[i].tempo = this.selectedTempo;
        }
        var duration = { count: 16, division: 1 };
        this.harmonizer.repeatAllVoices(this.schedule, duration);
        this.setAllTracks(function () {
            var newTime = durations2time(me.schedule.measures);
            me.ticker.waitLoopDuration = newTime;
            //me.ticker.restart();
            me.chooseVariantProg();
            //me.waitStart(null);
            rockDiceRestartOrStart();
        });
    };
    //__interInit() {
    //	this.schedule = this.harmonizer.createEmptyBaseSchedule();
    //	this.ticker.prepare(this.schedule, this.audioContext, this.audioContext.destination);
    //this.ticker.prepare(this.schedule, this.audioContext, this.audioContext.destination);
    //this.waitStart();
    //}
    //exportAsMIDIfile(): void {
    //	exportMIDI(this.schedule);
    //}
    ZvoogApp.prototype.createOptionItem = function (nn, txt) {
        var element = document.createElement('option');
        element.text = '' + nn + ': ' + txt;
        element.value = '' + nn;
        return element;
    };
    ZvoogApp.prototype.createDrumsClick = function (nn) {
        var me = this;
        return function () {
            //console.log('createDrumsClick',nn);
            if (me.storeChangedStateNoStartAd())
                me.setDrumPattern(nn, function () {
                    rockDiceRestartOrStart();
                });
        };
    };
    ZvoogApp.prototype.createBassClick = function (nn) {
        var me = this;
        return function () {
            if (me.storeChangedStateNoStartAd())
                me.setBassPattern(nn, rockDiceRestartOrStart);
        };
    };
    ZvoogApp.prototype.createLeadClick = function (nn) {
        var me = this;
        return function () {
            if (me.storeChangedStateNoStartAd())
                me.setLeadPattern(nn, rockDiceRestartOrStart);
        };
    };
    ZvoogApp.prototype.createPadClick = function (nn) {
        var me = this;
        return function () {
            if (me.storeChangedStateNoStartAd())
                me.setPadPattern(nn, rockDiceRestartOrStart);
        };
    };
    ZvoogApp.prototype.createProgClick = function (nn) {
        var me = this;
        return function () {
            if (me.storeChangedStateNoStartAd())
                me.setProgression(nn, rockDiceRestartOrStart);
        };
    };
    ZvoogApp.prototype.createUndoClick = function (nn) {
        var me = this;
        return function () {
            var ss = me.undoList[nn];
            //me.undoList.splice(nn,1);
            //console.log('undo', nn, ss);
            //me.storeChangedStateAndCheck();
            me.pushUndoState(me.createCurrentState(), me.undoList);
            me.loadSongState(ss);
        };
    };
    ZvoogApp.prototype.circleColor = function (value, maxValue) {
        if (value < 0) {
            return 'rgba(50,50,50,0.99)';
        }
        else {
            var part = value / maxValue;
            var r = Math.floor(255 * part); //Math.floor(255 * Math.cos(part * Math.PI / 2));
            var g = Math.floor(255 - 255 * part); //Math.floor(255 * Math.sin(part * Math.PI / 2));
            var b = Math.floor(2 * Math.abs(127 - 254 * part));
            //console.log(value,part, r, g, b);
            var rgba = 'rgba(' + r + ',' + g + ',' + b + ',1)';
            //this.colorcomp.style.stroke = rgba;
            return rgba;
        }
    };
    ZvoogApp.prototype.refitUndoList = function () {
        var list = document.getElementById('undoListContent');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.undoList.length; i++) {
            var state = this.undoList[i];
            var div = document.createElement('div');
            var item = document.createElement('a');
            var firstP = document.createElement('p');
            var secondP = document.createElement('div');
            secondP.textContent = state.comment;
            secondP.classList.add('verySmallFont');
            var spanDrums = document.createElement('span');
            spanDrums.textContent = '◯';
            spanDrums.style.color = this.circleColor(state.drumsSeed, this.drumsSchedules.length);
            firstP.appendChild(spanDrums);
            var spanBass = document.createElement('span');
            spanBass.textContent = '◯';
            spanBass.style.color = this.circleColor(state.bassSeed, this.bassSchedules.length);
            firstP.appendChild(spanBass);
            var spanLead = document.createElement('span');
            spanLead.textContent = '◯';
            spanLead.style.color = this.circleColor(state.leadSeed, this.leadSchedules.length);
            firstP.appendChild(spanLead);
            var spanPad = document.createElement('span');
            spanPad.textContent = '◯';
            spanPad.style.color = this.circleColor(state.padSeed, this.padSchedules.length);
            firstP.appendChild(spanPad);
            var spanChords = document.createElement('span');
            spanChords.classList.add('smallFont');
            var chordLine = '';
            var chordName = '';
            for (var k = 0; k < state.chords.length; k = k + 2) {
                if (chordName == state.chords[k]) {
                    //
                }
                else {
                    chordLine = chordLine + ' ' + state.chords[k];
                    chordName = state.chords[k];
                }
                //chordLine = chordLine + ' ' + state.chords[k];
            }
            spanChords.textContent = chordLine;
            firstP.appendChild(spanChords);
            item.appendChild(firstP);
            item.appendChild(secondP);
            item.onclick = this.createUndoClick(i);
            list.appendChild(div);
            div.appendChild(item);
        }
    };
    ZvoogApp.prototype.createExcerptClick = function (nn) {
        //var me2 = this;
        return function () {
            //console.log(extendedSchedulePath[-nn]);
            rockDiceRiffPromptExcerptOpen(extendedSchedulePath[-nn].title, nn);
            /*me2.selectedBass = nn;
            me2.selectedDrums = nn;
            me2.selectedLead = nn;
            me2.selectedPad = nn;
            me2.doForCachedSchedule(extendedSchedulePath[-nn].path, (sch: ZvoogSchedule) => {
                me2.setTempo(sch.measures[0].tempo);
                me2.setTracksByProg(nn, sch.harmony, () => {
                    //me2.ticker.restart();
                    rockDiceRestartOrStart();
                });
            });*/
        };
    };
    ZvoogApp.prototype.refiExcerptsList = function () {
        var list = document.getElementById('excerptsListContent');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        var xlist = [];
        for (var i = 1; i < extendedSchedulePath.length; i++) {
            //if (extendedSchedulePath[i].ready)
            xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i, ready: extendedSchedulePath[i].ready });
        }
        xlist.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });
        for (var i = 0; i < xlist.length; i++) {
            if (xlist[i].ready) {
                //console.log(this.selectedDrums , i,xlist[i]);
                var p = document.createElement('p');
                var a = document.createElement('a');
                a.textContent = xlist[i].title;
                if (this.selectedDrums == xlist[i].nn) {
                    a.classList.add('selectedListItem');
                }
                else {
                    a.classList.add('unselListItem');
                }
                a.onclick = this.createExcerptClick(xlist[i].nn);
                list.appendChild(p);
                p.appendChild(a);
            }
        }
    };
    ZvoogApp.prototype.refitDrumsList = function () {
        var list = document.getElementById('drumListContent');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.drumsSchedules.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.drumsSchedules[i].name;
            if (this.selectedDrums == i) {
                a.classList.add('selectedListItem');
            }
            else {
                a.classList.add('unselListItem');
            }
            a.onclick = this.createDrumsClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }
        /*
                let xlist: { title: string, path: string, nn: number }[] = [];
                for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
                xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
                for (var i = 0; i < xlist.length; i++) {
                    var p = document.createElement('p');
                    var a = document.createElement('a');
                    a.textContent = xlist[i].title;
                    if (this.selectedDrums == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
                    a.onclick = this.createDrumsClick(xlist[i].nn);
                    list.appendChild(p);
                    p.appendChild(a);
                }
        */
    };
    ZvoogApp.prototype.refitBassList = function () {
        var list = document.getElementById('bassListContent');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.bassSchedules.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.bassSchedules[i].name;
            if (this.selectedBass == i) {
                a.classList.add('selectedListItem');
            }
            else {
                a.classList.add('unselListItem');
            }
            a.onclick = this.createBassClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }
        /*
                let xlist: { title: string, path: string, nn: number }[] = [];
                for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
                xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
                for (var i = 0; i < xlist.length; i++) {
                    var p = document.createElement('p');
                    var a = document.createElement('a');
                    a.textContent = xlist[i].title;
                    if (this.selectedBass == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
                    a.onclick = this.createBassClick(xlist[i].nn);
                    list.appendChild(p);
                    p.appendChild(a);
                }*/
    };
    ZvoogApp.prototype.refitLeadList = function () {
        var list = document.getElementById('leadListContent');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.leadSchedules.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.leadSchedules[i].name;
            if (this.selectedLead == i) {
                a.classList.add('selectedListItem');
            }
            else {
                a.classList.add('unselListItem');
            }
            a.onclick = this.createLeadClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }
        /*
                let xlist: { title: string, path: string, nn: number }[] = [];
                for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
                xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
                for (var i = 0; i < xlist.length; i++) {
                    var p = document.createElement('p');
                    var a = document.createElement('a');
                    a.textContent = xlist[i].title;
                    if (this.selectedLead == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
                    a.onclick = this.createLeadClick(xlist[i].nn);
                    list.appendChild(p);
                    p.appendChild(a);
                }*/
    };
    ZvoogApp.prototype.refitPadList = function () {
        var list = document.getElementById('padListContent');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.padSchedules.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.padSchedules[i].name;
            if (this.selectedPad == i) {
                a.classList.add('selectedListItem');
            }
            else {
                a.classList.add('unselListItem');
            }
            a.onclick = this.createPadClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }
        /*
                let xlist: { title: string, path: string, nn: number }[] = [];
                for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
                xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
                for (var i = 0; i < xlist.length; i++) {
                    var p = document.createElement('p');
                    var a = document.createElement('a');
                    a.textContent = xlist[i].title;
                    if (this.selectedPad == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
                    a.onclick = this.createPadClick(xlist[i].nn);
                    list.appendChild(p);
                    p.appendChild(a);
                }*/
    };
    ZvoogApp.prototype.refitProgList = function () {
        var list = document.getElementById('progListContent');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < trackProgressions.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = trackProgressions[i].title;
            if (this.selectedProgression == i) {
                a.classList.add('selectedListItem');
            }
            else {
                a.classList.add('unselListItem');
            }
            a.onclick = this.createProgClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }
        /*
                let xlist: { title: string, path: string, nn: number }[] = [];
                for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
                xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
                for (var i = 0; i < xlist.length; i++) {
                    var p = document.createElement('p');
                    var a = document.createElement('a');
                    a.textContent = xlist[i].title;
                    //console.log(this.selectedProgression , xlist[i]);
                    if (-this.selectedProgression == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
                    a.onclick = this.createProgClick(xlist[i].nn);
                    list.appendChild(p);
                    p.appendChild(a);
                }*/
    };
    ZvoogApp.prototype.fillSelectors = function () {
        this.refitDrumsList();
        this.refitBassList();
        this.refitLeadList();
        this.refitPadList();
        this.refitProgList();
        /*
        let drumPatRange: HTMLSelectElement = document.getElementById('select_drums_pattern') as any;
        let bassPatRange: HTMLSelectElement = document.getElementById('select_bass_pattern') as any;
        let leadPatRange: HTMLSelectElement = document.getElementById('select_lead_pattern') as any;
        let padPatRange: HTMLSelectElement = document.getElementById('select_pad_pattern') as any;
        let progPatRange: HTMLSelectElement = document.getElementById('select_prog_pattern') as any;
        drumPatRange.options.length = 0;
        bassPatRange.options.length = 0;
        leadPatRange.options.length = 0;
        padPatRange.options.length = 0;
        progPatRange.options.length = 0;
        for (let i = 0; i < this.drumsSchedules.length; i++) drumPatRange.options.add(this.createOptionItem(i, this.drumsSchedules[i]));
        for (let i = 0; i < this.bassSchedules.length; i++) bassPatRange.options.add(this.createOptionItem(i, this.bassSchedules[i]));
        for (let i = 0; i < this.leadSchedules.length; i++) leadPatRange.options.add(this.createOptionItem(i, this.leadSchedules[i]));
        for (let i = 0; i < this.padSchedules.length; i++) padPatRange.options.add(this.createOptionItem(i, this.padSchedules[i]));
        for (let i = 0; i < trackProgressions.length; i++) {
            let title = trackProgressions[i].title;
            let jspath = trackProgressions[i].jspath;
            if (jspath) {
                title = jspath;
            }

            progPatRange.options.add(this.createOptionItem(i, title));
        }
        */
    };
    ZvoogApp.prototype.harmonyStep7Y = function (r) {
        if (r == 7)
            return 6;
        if (r == 5)
            return 5;
        if (r == 6)
            return 4;
        if (r == 1)
            return 3;
        if (r == 3)
            return 2;
        if (r == 4)
            return 1;
        if (r == 2)
            return 0;
        return -1;
    };
    ZvoogApp.prototype.dumpHarmony = function () {
        console.log('dumpHarmony', this.schedule.harmony);
        var tone = this.harmonizer.calculateProgressionMode(this.schedule.harmony.progression).name;
        //var tone = this.schedule.harmony.tone;
        var step8s = [];
        var y0 = 'II ';
        var y1 = 'IV ';
        var y2 = 'III';
        var y3 = 'I  ';
        var y4 = 'VI ';
        var y5 = 'V  ';
        var y6 = 'VII';
        for (var i = 0; i < this.schedule.harmony.progression.length; i++) {
            var chord = this.schedule.harmony.progression[i].chord;
            var step = 1 + this.harmonizer.chordStepDifference(tone, chord);
            var cnt = plusMeter(this.schedule.harmony.progression[i].duration, { count: 0, division: 8 }).count;
            //console.log(cnt, this.schedule.harmony.progression[i].duration, chord, step);
            var dlmtr = '-';
            var tofi = '-';
            var fll = 'O';
            for (var kk = 0; kk < cnt; kk++) {
                step8s.push(step);
                if (step8s.length % 32 == 0) {
                    dlmtr = '|';
                    tofi = '|';
                }
                else {
                    if (step8s.length % 8 == 0) {
                        dlmtr = ':';
                        tofi = ':';
                    }
                    else {
                        dlmtr = '-';
                        tofi = '~';
                    }
                }
                if (this.harmonyStep7Y(step) == 0) {
                    y0 = y0 + fll;
                }
                else {
                    y0 = y0 + dlmtr;
                }
                if (this.harmonyStep7Y(step) == 1) {
                    y1 = y1 + fll;
                }
                else {
                    y1 = y1 + dlmtr;
                }
                if (this.harmonyStep7Y(step) == 2) {
                    y2 = y2 + fll;
                }
                else {
                    y2 = y2 + tofi;
                }
                if (this.harmonyStep7Y(step) == 3) {
                    y3 = y3 + fll;
                }
                else {
                    y3 = y3 + tofi;
                }
                if (this.harmonyStep7Y(step) == 4) {
                    y4 = y4 + fll;
                }
                else {
                    y4 = y4 + tofi;
                }
                if (this.harmonyStep7Y(step) == 5) {
                    y5 = y5 + fll;
                }
                else {
                    y5 = y5 + dlmtr;
                }
                if (this.harmonyStep7Y(step) == 6) {
                    y6 = y6 + fll;
                }
                else {
                    y6 = y6 + dlmtr;
                }
            }
        }
        //console.log(step8s);
        console.log(y6);
        console.log(y5);
        console.log(y4);
        console.log(y3);
        console.log(y2);
        console.log(y1);
        console.log(y0);
    };
    ZvoogApp.prototype.startPlay = function () {
        //this.ticker.start(0, 0, durations2time(this.schedule.measures));
        this.ticker.start(0, 0, durations2time(this.schedule.measures));
        onAir = true;
        var e = document.getElementById('menuPlayButton');
        if (e) {
            e.src = 'resources/buttonPause.svg';
            rockDiceAdjustAnimation();
        }
    };
    ZvoogApp.prototype.cancelPlay = function () {
        console.log('cancelPlay', onAir);
        this.ticker.stop();
        onAir = false;
        var e = document.getElementById('menuPlayButton');
        if (e) {
            e.src = 'resources/buttonPlay.svg';
            rockDiceAdjustAnimation();
        }
    };
    ZvoogApp.prototype.setDrumsVolume = function (volume) {
        this.curDrumVolume = volume;
        this.schedule.tracks[0].effects[0].parameters[0].points[0].velocity = volume;
        //this.ticker.restart();
    };
    ZvoogApp.prototype.changeDrumVoices = function (fromSchedule) {
        var toDrumTrack = this.schedule.tracks[this.harmonizer.drumTrackNum];
        this.ticker.unconnectAllVoices(toDrumTrack);
        var duration = scheduleDuration(this.schedule.measures);
        var origin = this.harmonizer.clearCloneSchedule(fromSchedule);
        this.harmonizer.repeatAllVoices(origin, duration);
        var fromDrumTrack = origin.tracks[0];
        for (var i = 0; i < fromDrumTrack.voices.length; i++) {
            toDrumTrack.voices.push(fromDrumTrack.voices[i]);
        }
    };
    ZvoogApp.prototype.setPartBackground = function (id, path) {
        try {
            var htmlElement = document.getElementById(id);
            htmlElement.src = path;
        }
        catch (e) {
            console.log(e);
        }
    };
    ZvoogApp.prototype.setDrumPattern = function (v, onDone) {
        var nn = parseInt(v);
        //console.log('setDrumPattern',v,nn);
        /*if(this.selectedDrums == nn){
            if (onDone) onDone();
            return;
        }*/
        this.drumControl.setRoundedValue(nn, false);
        var path = 'bg/empty.png';
        if (nn == 0)
            path = 'bg/drums909.png';
        else if (nn == 1)
            path = 'bg/drumsMPC.png';
        else if (nn == 2)
            path = 'bg/drums909.png';
        else if (nn == 3)
            path = 'bg/drums909.png';
        else if (nn == 4)
            path = 'bg/drumsElectro.png';
        else if (nn == 5)
            path = 'bg/drums909.png';
        else if (nn == 6)
            path = 'bg/drumsElectro.png';
        else if (nn == 7)
            path = 'bg/drumsGreen.png';
        else if (nn == 8)
            path = 'bg/drumsMPC.png';
        else if (nn == 9)
            path = 'bg/drumsMPC.png';
        else if (nn == 10)
            path = 'bg/drumsMPC.png';
        else if (nn == 11)
            path = 'bg/drumsBig.png';
        else if (nn == 12)
            path = 'bg/drumsGreen.png';
        else if (nn == 13)
            path = 'bg/drumsBig.png';
        else if (nn == 14)
            path = 'bg/drumsBig.png';
        else if (nn == 15)
            path = 'bg/drumsBig.png';
        else if (nn == 16)
            path = 'bg/drumsBig.png';
        else if (nn == 17)
            path = 'bg/drumsGreen.png';
        else if (nn == 18)
            path = 'bg/drumsBig.png';
        else if (nn == 19)
            path = 'bg/drumsElectro.png';
        else if (nn == 20)
            path = 'bg/drumsBig.png';
        else if (nn == 21)
            path = 'bg/drumsBig.png';
        else if (nn == 22)
            path = 'bg/drumsBig.png';
        else if (nn == 23)
            path = 'bg/drumsGreen.png';
        else if (nn == 24)
            path = 'bg/drumsBig.png';
        else if (nn == 25)
            path = 'bg/drumsBig.png';
        else if (nn == 26)
            path = 'bg/drumsBig.png';
        else if (nn == 27)
            path = 'bg/drumsGreen.png';
        else if (nn == 28)
            path = 'bg/drumsGreen.png';
        this.setPartBackground('imgBgDrums', path);
        var toDrumTrack = this.schedule.tracks[this.harmonizer.drumTrackNum];
        var me = this;
        var e = document.getElementById('drumVolumeSlider');
        if (e) {
            e.value = '' + me.curDrumVolume;
        }
        var schedulePath = '';
        if (nn < 0) {
            schedulePath = extendedSchedulePath[-1 * nn].path;
        }
        else {
            schedulePath = me.drumsSchedules[nn].path;
        }
        me.doForCachedSchedule(schedulePath, function (sch) {
            me.changeDrumVoices(sch);
            for (var s = 0; s < toDrumTrack.voices.length; s++) {
                var voice = toDrumTrack.voices[s];
                me.ticker.connectVoice(voice, toDrumTrack);
            }
            //me.ticker.restart();
            me.selectedDrums = nn;
            me.refitDrumsList();
            if (onDone)
                onDone();
        });
    };
    ZvoogApp.prototype.setBassVolume = function (volume) {
        this.curBassVolume = volume;
        this.schedule.tracks[1].effects[0].parameters[0].points[0].velocity = volume;
        //this.ticker.restart();
    };
    ZvoogApp.prototype.addVoicePattern = function (toTrackNum, toTrack, fromSchedule, trackNum, voiceNum) {
        //console.log('setBassPattern',(toTrackNum==this.harmonizer.bassTrackNum));
        var duration = scheduleDuration(this.schedule.measures);
        var origin = this.harmonizer.clearCloneSchedule(fromSchedule);
        this.harmonizer.repeatAllVoices(origin, duration);
        this.harmonizer.morphSchedule(origin, this.schedule.harmony
        //,toTrackNum==this.harmonizer.bassTrackNum
        );
        var fromTrack = origin.tracks[trackNum];
        adjustVoiceLowHigh(fromTrack.voices[voiceNum], origin.harmony.progression, this.schedule.harmony.progression, this.schedule.measures, trackNum == this.harmonizer.bassTrackNum);
        toTrack.voices.push(fromTrack.voices[voiceNum]);
        this.harmonizer.fillVoiceByPattern(toTrackNum, toTrack.voices.length - 1, this.schedule);
    };
    ZvoogApp.prototype.setBassPattern = function (v, onDone) {
        var _this = this;
        var nn = parseInt(v);
        /*if(this.selectedBass == nn){
            if (onDone) onDone();
            return;
        }*/
        var path = 'bg/empty.png';
        if (nn == 0)
            path = 'bg/bassLine3.png';
        else if (nn == 1)
            path = 'bg/bassLine3.png';
        else if (nn == 2)
            path = 'bg/bassLine3.png';
        else if (nn == 3)
            path = 'bg/bass1.png';
        else if (nn == 4)
            path = 'bg/bassVolca.png';
        else if (nn == 5)
            path = 'bg/bass1.png';
        else if (nn == 6)
            path = 'bg/bass303.png';
        else if (nn == 7)
            path = 'bg/bassSlap.png';
        else if (nn == 8)
            path = 'bg/bassSlap.png';
        else if (nn == 9)
            path = 'bg/bass1.png';
        else if (nn == 10)
            path = 'bg/bassSlap.png';
        else if (nn == 11)
            path = 'bg/bass303.png';
        else if (nn == 12)
            path = 'bg/bass3.png';
        else if (nn == 13)
            path = 'bg/bass1.png';
        else if (nn == 14)
            path = 'bg/bass1.png';
        else if (nn == 15)
            path = 'bg/bassSlap.png';
        else if (nn == 16)
            path = 'bg/bassSlap.png';
        else if (nn == 17)
            path = 'bg/bassSlap.png';
        else if (nn == 18)
            path = 'bg/bass1.png';
        else if (nn == 19)
            path = 'bg/bassSlap.png';
        else if (nn == 20)
            path = 'bg/bassLine3.png';
        else if (nn == 21)
            path = 'bg/bass2.png';
        else if (nn == 22)
            path = 'bg/bass2.png';
        else if (nn == 23)
            path = 'bg/bass2.png';
        this.setPartBackground('imgBgBass', path);
        //console.log('setBassPattern',nn);
        this.bassControl.setRoundedValue(nn, false);
        var toTrack = this.schedule.tracks[this.harmonizer.bassTrackNum];
        var me = this;
        var e = document.getElementById('bassVolumeSlider');
        if (e) {
            e.value = '' + me.curBassVolume;
        }
        //console.log('wait',me.bassSchedules[nn].path);
        var schedulePath = '';
        if (nn < 0) {
            schedulePath = extendedSchedulePath[-1 * nn].path;
        }
        else {
            schedulePath = me.bassSchedules[nn].path;
        }
        me.doForCachedSchedule(schedulePath, function (sch) {
            //console.log('found',sch);
            _this.ticker.unconnectAllVoices(toTrack);
            for (var i = 0; i < sch.tracks[me.harmonizer.bassTrackNum].voices.length; i++) {
                //console.log(i,'setBassPattern addVoicePattern');
                me.addVoicePattern(me.harmonizer.bassTrackNum, toTrack, sch, me.harmonizer.bassTrackNum, i);
            }
            for (var s = 0; s < toTrack.voices.length; s++) {
                var voice = toTrack.voices[s];
                me.ticker.connectVoice(voice, toTrack);
            }
            //me.ticker.restart();
            me.selectedBass = nn;
            me.refitBassList();
            if (onDone)
                onDone();
        });
    };
    ZvoogApp.prototype.setLeadVolume = function (volume) {
        this.curLeadVolume = volume;
        this.schedule.tracks[2].effects[0].parameters[0].points[0].velocity = volume;
        //this.ticker.restart();
    };
    ZvoogApp.prototype.setLeadPattern = function (v, onDone) {
        var _this = this;
        var nn = parseInt(v);
        var path = 'bg/empty.png';
        if (nn == 0)
            path = 'bg/leadPiano1.png';
        else if (nn == 1)
            path = 'bg/leadPiano1.png';
        else if (nn == 2)
            path = 'bg/leadPiano1.png';
        else if (nn == 3)
            path = 'bg/leadPiano1.png';
        else if (nn == 4)
            path = 'bg/leadPiano1.png';
        else if (nn == 5)
            path = 'bg/leadPiano1.png';
        else if (nn == 6)
            path = 'bg/leadPiano1.png';
        else if (nn == 7)
            path = 'bg/leadPiano1.png';
        else if (nn == 8)
            path = 'bg/leadPiano1.png';
        else if (nn == 9)
            path = 'bg/leadAccu1.png';
        else if (nn == 10)
            path = 'bg/leadAccu1.png';
        else if (nn == 11)
            path = 'bg/leadAccu1.png';
        else if (nn == 12)
            path = 'bg/leadAccu1.png';
        else if (nn == 13)
            path = 'bg/leadAccu1.png';
        else if (nn == 14)
            path = 'bg/leadClean1.png';
        else if (nn == 15)
            path = 'bg/leadClean1.png';
        else if (nn == 16)
            path = 'bg/leadClean1.png';
        else if (nn == 17)
            path = 'bg/leadClean1.png';
        else if (nn == 18)
            path = 'bg/leadClean1.png';
        else if (nn == 19)
            path = 'bg/leadClean1.png';
        else if (nn == 20)
            path = 'bg/leadRust1.png';
        else if (nn == 21)
            path = 'bg/leadRust1.png';
        else if (nn == 22)
            path = 'bg/leadRust1.png';
        else if (nn == 23)
            path = 'bg/leadXylo.png';
        else if (nn == 24)
            path = 'bg/leadTrombone1.png';
        else if (nn == 25)
            path = 'bg/leadMarimba.png';
        else if (nn == 26)
            path = 'bg/leadClean1.png';
        else if (nn == 27)
            path = 'bg/leadAccu1.png';
        else if (nn == 28)
            path = 'bg/leadSynth1.png';
        else if (nn == 29)
            path = 'bg/leadSynth1.png';
        else if (nn == 30)
            path = 'bg/leadSynth1.png';
        else if (nn == 31)
            path = 'bg/leadDrive1.png';
        else if (nn == 32)
            path = 'bg/leadDrive1.png';
        else if (nn == 33)
            path = 'bg/leadDrive1.png';
        else if (nn == 34)
            path = 'bg/leadDrive1.png';
        else if (nn == 35)
            path = 'bg/leadDrive1.png';
        else if (nn == 36)
            path = 'bg/leadDrive1.png';
        else if (nn == 37)
            path = 'bg/leadDrive1.png';
        else if (nn == 38)
            path = 'bg/leadDrive1.png';
        this.setPartBackground('imgBgLead', path);
        //console.log('setLeadPattern',nn);
        /*if(this.selectedLead == nn){
            if (onDone) onDone();
            return;
        }*/
        this.leadControl.setRoundedValue(nn, false);
        var toTrack = this.schedule.tracks[this.harmonizer.leadTrackNum];
        var me = this;
        var e = document.getElementById('leadVolumeSlider');
        if (e) {
            e.value = '' + me.curLeadVolume;
        }
        var schedulePath = '';
        if (nn < 0) {
            schedulePath = extendedSchedulePath[-1 * nn].path;
        }
        else {
            schedulePath = me.leadSchedules[nn].path;
        }
        me.doForCachedSchedule(schedulePath, function (sch) {
            _this.ticker.unconnectAllVoices(toTrack);
            for (var i = 0; i < sch.tracks[me.harmonizer.leadTrackNum].voices.length; i++) {
                me.addVoicePattern(me.harmonizer.leadTrackNum, toTrack, sch, me.harmonizer.leadTrackNum, i);
            }
            for (var s = 0; s < toTrack.voices.length; s++) {
                var voice = toTrack.voices[s];
                me.ticker.connectVoice(voice, toTrack);
            }
            //me.ticker.restart();
            me.selectedLead = nn;
            me.refitLeadList();
            //console.log('setLeadPattern',nn);
            if (onDone)
                onDone();
        });
    };
    /*addPadPatter(toTrack: ZvoogTrack, nn: number, pattern: string) {
        
        let voice: ZvoogVoice = {
            measureChords: []
            , source: {
                pluginSource: null
                , parameters: []
                , kind: 'wafinstrument'
                , initial: '' + nn
            }
            , effects: []

            , title: ''
            , stringPattern: null
            , strumPattern: null
            , keyPattern: { octaves: pattern }
        };
        toTrack.voices.push(voice);
        if (voice.keyPattern) {
            this.harmonizer.fillVoiceByKeyPattern(voice, voice.keyPattern, this.schedule.measures, this.schedule.harmony.progression);
            this.harmonizer.splitTrackNotesByProgression(toTrack, this.schedule.measures, this.schedule.harmony, false);
        }

    }*/
    ZvoogApp.prototype.setPadVolume = function (volume) {
        //console.log('setPadVolume',volume);
        this.curPadVolume = volume;
        this.schedule.tracks[3].effects[0].parameters[0].points[0].velocity = volume;
        //this.ticker.restart();
    };
    ZvoogApp.prototype.setPadPattern = function (v, onDone) {
        var _this = this;
        //console.log('setPadPattern',v);
        var nn = parseInt(v);
        var path = 'bg/empty.png';
        if (nn == 0)
            path = 'bg/padStrings.png';
        else if (nn == 1)
            path = 'bg/padStrings.png';
        else if (nn == 2)
            path = 'bg/padStrings.png';
        else if (nn == 3)
            path = 'bg/padStrings.png';
        else if (nn == 4)
            path = 'bg/padStrings.png';
        else if (nn == 5)
            path = 'bg/padStrings.png';
        else if (nn == 6)
            path = 'bg/padViolin.png';
        else if (nn == 7)
            path = 'bg/padViolin.png';
        else if (nn == 8)
            path = 'bg/padFlute.png';
        else if (nn == 9)
            path = 'bg/padFlute.png';
        else if (nn == 10)
            path = 'bg/padOrgan.png';
        else if (nn == 11)
            path = 'bg/padOrgan.png';
        else if (nn == 12)
            path = 'bg/padOrgan.png';
        else if (nn == 13)
            path = 'bg/padOrgan.png';
        else if (nn == 14)
            path = 'bg/padBells.png';
        else if (nn == 15)
            path = 'bg/padBells.png';
        else if (nn == 16)
            path = 'bg/padHarm.png';
        else if (nn == 17)
            path = 'bg/padHarm.png';
        else if (nn == 18)
            path = 'bg/padHarm.png';
        else if (nn == 19)
            path = 'bg/padChoir1.png';
        else if (nn == 20)
            path = 'bg/padChoir1.png';
        else if (nn == 21)
            path = 'bg/padChoir1.png';
        else if (nn == 22)
            path = 'bg/padChoir1.png';
        else if (nn == 23)
            path = 'bg/padChoir1.png';
        else if (nn == 24)
            path = 'bg/padChoir1.png';
        this.setPartBackground('imgBgPad', path);
        //console.log('setPadPattern',nn);
        /*ZvoogApp 1.0.8if(this.selectedPad == nn){
            if (onDone) onDone();
            return;
        }*/
        this.padControl.setRoundedValue(nn, false);
        var toTrack = this.schedule.tracks[this.harmonizer.padTrackNum];
        var e = document.getElementById('padVolumeSlider');
        if (e) {
            e.value = '' + this.curPadVolume;
        }
        //console.log('voices length',toTrack.voices.length);
        var me = this;
        var schedulePath = '';
        if (nn < 0) {
            schedulePath = extendedSchedulePath[-1 * nn].path;
        }
        else {
            schedulePath = me.padSchedules[nn].path;
        }
        me.doForCachedSchedule(schedulePath, function (sch) {
            //console.log('start voices length',toTrack.voices.length);
            var fromTrack = sch.tracks[me.harmonizer.padTrackNum];
            _this.ticker.unconnectAllVoices(toTrack);
            for (var i = 0; i < fromTrack.voices.length; i++) {
                me.addVoicePattern(me.harmonizer.padTrackNum, toTrack, sch, me.harmonizer.padTrackNum, i);
            }
            //console.log('now voices length',toTrack.voices.length);
            for (var s = 0; s < toTrack.voices.length; s++) {
                var voice = toTrack.voices[s];
                me.ticker.connectVoice(voice, toTrack);
                //console.log('connectVoice',toTrack.title);
            }
            //me.ticker.restart();
            me.selectedPad = nn;
            me.refitPadList();
            if (onDone)
                onDone();
        });
    };
    ZvoogApp.prototype.setTempo = function (tempo) {
        for (var i = 0; i < this.schedule.measures.length; i++) {
            this.schedule.measures[i].tempo = tempo;
        }
        //let newTime = durations2time(this.schedule.measures);
        //this.ticker.waitLoopDuration = newTime;
        //this.ticker.restart();
        this.selectedTempo = tempo;
    };
    ZvoogApp.prototype.repeatForByFirstN = function (barCnt, harmony) {
        var chordArray = [];
        var progPosition = { count: 0, division: 8 };
        while (progPosition.count < 128) {
            var fch = this.harmonizer.findProgressionPart(progPosition, this.schedule.harmony.progression);
            if (fch) {
                var ch = fch.chord;
                chordArray.push(ch);
                progPosition.count++;
            }
            else {
                break;
            }
        }
        if (chordArray[0] == '-') {
            chordArray[0] = 'C';
        }
        for (var cc = 0; cc < (16 / barCnt - 1); cc++) {
            for (var nn_1 = 0; nn_1 < 8 * barCnt; nn_1++) {
                chordArray[nn_1 + 8 * barCnt * (1 + cc)] = chordArray[nn_1];
            }
        }
        var nn = 0;
        harmony.progression = [];
        while (nn < 128) {
            if (chordArray[nn] == '-') {
                nn++;
            }
            else {
                var len8 = 1;
                var zvoogChordMel = {
                    chord: chordArray[nn],
                    duration: { count: 1, division: 8 }
                };
                harmony.progression.push(zvoogChordMel);
                while (nn + 1 < 128 && chordArray[nn + 1] == '-') {
                    len8++;
                    nn++;
                }
                zvoogChordMel.duration.count = len8;
                nn++;
            }
        }
    };
    ZvoogApp.prototype.setCompression = function (ratio) {
        this.schedule.effects[0].parameters[6].points[0].velocity = ratio;
        this.ticker.restart();
    };
    ZvoogApp.prototype.setProgressionChord = function (start8th, chordName, harmony) {
        //console.log('setProgressionChord', start8th, chordName);
        var chordArray = [];
        var progPosition = { count: 0, division: 8 };
        while (progPosition.count < 128) {
            var fch = this.harmonizer.findProgressionPart(progPosition, this.schedule.harmony.progression);
            if (fch) {
                var ch = fch.chord;
                chordArray.push(ch);
                progPosition.count++;
            }
            else {
                break;
            }
        }
        var cuChord = '';
        for (var i = 0; i < 128; i++) {
            if (cuChord != chordArray[i]) {
                cuChord = chordArray[i];
            }
            else {
                chordArray[i] = '-';
            }
        }
        if (start8th >= 0 && start8th < chordArray.length) {
            chordArray[start8th] = chordName;
        }
        if (chordArray[0] == '-') {
            chordArray[0] = 'C';
        }
        var nn = 0;
        harmony.progression = [];
        while (nn < 128) {
            if (chordArray[nn] == '-') {
                nn++;
            }
            else {
                var len8 = 1;
                var zvoogChordMel = {
                    chord: chordArray[nn],
                    duration: { count: 1, division: 8 }
                };
                harmony.progression.push(zvoogChordMel);
                while (nn + 1 < 128 && chordArray[nn + 1] == '-') {
                    len8++;
                    nn++;
                }
                zvoogChordMel.duration.count = len8;
                nn++;
            }
        }
    };
    ZvoogApp.prototype.parseChordName = function (chordName) {
        var parts = chordName.trim().split('/');
        var bass = '';
        if (parts.length > 1) {
            var bassPart = parts[1].trim();
            if (bassPart.substr(0, 1).toUpperCase() == 'A'
                || bassPart.substr(0, 1).toUpperCase() == 'B'
                || bassPart.substr(0, 1).toUpperCase() == 'C'
                || bassPart.substr(0, 1).toUpperCase() == 'D'
                || bassPart.substr(0, 1).toUpperCase() == 'E'
                || bassPart.substr(0, 1).toUpperCase() == 'F'
                || bassPart.substr(0, 1).toUpperCase() == 'G') {
                if (bassPart.substr(1, 1) == '#') {
                    bass = '/' + bassPart.substr(0, 1).toUpperCase() + '#';
                }
                else {
                    if (bassPart.substr(1, 1) == 'b') {
                        bass = '/' + bassPart.substr(0, 1).toUpperCase() + 'b';
                    }
                    else {
                        bass = '/' + bassPart.substr(0, 1).toUpperCase();
                    }
                }
            }
        }
        var toFind = parts[0].trim();
        if (toFind == '' || toFind == '-') {
            //console.log(1, chordName, '-');
            return '-';
        }
        for (var k = 0; k < chordfretsData.length; k++) {
            if (chordfretsData[k].name == toFind) {
                //console.log(2, chordName, (toFind + bass));
                return toFind + bass;
            }
        }
        var composedName = '';
        if (toFind.substr(0, 1).toUpperCase() == 'A'
            || toFind.substr(0, 1).toUpperCase() == 'B'
            || toFind.substr(0, 1).toUpperCase() == 'C'
            || toFind.substr(0, 1).toUpperCase() == 'D'
            || toFind.substr(0, 1).toUpperCase() == 'E'
            || toFind.substr(0, 1).toUpperCase() == 'F'
            || toFind.substr(0, 1).toUpperCase() == 'G') {
            composedName = toFind.substr(0, 1).toUpperCase();
            var start = 1;
            if (toFind.substr(1, 1) == '#' || toFind.substr(1, 1) == 'b') {
                start = 2;
                composedName = composedName + toFind.substr(1, 1);
            }
            if (toFind.substr(start, 1) == 'm' && toFind.substr(start, 3) != 'maj') {
                composedName = composedName + 'm';
            }
            else {
                if (toFind.substr(start, 1) == '7') {
                    composedName = composedName + '7';
                }
            }
            //console.log(3, chordName, (composedName + bass));
            return composedName + bass;
        }
        //console.log(4, chordName, '-');
        return '-';
    };
    ZvoogApp.prototype.createProgVariant = function (chords, base) {
        var chordmelody = [];
        var lineIdx = chords.length - 2;
        var nthlines = this.progVariants[lineIdx];
        var r = Math.random();
        var rr = Math.floor(r * nthlines.s.length);
        if (base)
            rr = 0;
        var line = nthlines.s[rr];
        //console.log('createProgVariant',chords,line);
        var durations = line.split(',');
        //console.log(rr, chords, line);
        //console.log(lineIdx, durations);
        var idx = 0;
        while (idx < durations.length) {
            //console.log(idx,durations[idx]);
            var cuChordNum = parseInt(durations[idx]);
            var drtn = 1;
            idx++;
            while (durations[idx] == '-') {
                drtn++;
                idx++;
            }
            chordmelody.push({ duration: { count: drtn, division: 8 }, chord: chords[cuChordNum] });
            //console.log('	',chords[cuChordNum],drtn);
        }
        //console.log(chordmelody);
        //for (var kk = 0; kk < chordmelody.length; kk++) {
        //	console.log(chordmelody[kk].duration.count, chordmelody[kk].duration.division, chordmelody[kk].chord);
        //}
        return chordmelody;
    };
    ZvoogApp.prototype.simplifiedChords = function (harmony) {
        var chords = [];
        for (var i = 0; i < harmony.progression.length; i++) {
            chords.push(harmony.progression[i].chord);
        }
        //console.log(chords,harmony.progression);
        for (var ll = chords.length - 2; ll > 0; ll--) {
            for (var mm = 0; mm < chords.length - 1; mm++) {
                if (mm + ll + ll <= chords.length) {
                    var slice = chords.slice(mm, mm + ll);
                    var txtchords = ':' + chords.join(':') + ':';
                    var to = ':' + slice.join(':');
                    var from = to + to + ':';
                    to = to + ':';
                    //console.log(ll, mm, to, from, txtchords);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    //txtchords=txtchords.substr(1);
                    //txtchords=txtchords.substr(0,txtchords.length-2);
                    var rez = txtchords.split(':');
                    //chords = rez;
                    chords = [];
                    for (var kk = 0; kk < rez.length; kk++) {
                        if (rez[kk]) {
                            chords.push(rez[kk]);
                        }
                    }
                    //console.log('chords', txtchords, chords);
                }
            }
        }
        return chords;
    };
    ZvoogApp.prototype.refitProgrtession = function (harmony) {
        var chords = this.simplifiedChords(harmony);
        var resChord = this.createProgVariant(chords, false);
        return resChord;
    };
    ZvoogApp.prototype.chooseVariantProg = function () {
        var _this = this;
        var harmony = this.schedule.harmony;
        this.schedule.harmony.progression = this.refitProgrtession(harmony);
        //this.setProgression(v,function(){zapp.ticker.restart();});
        var duration = { count: 16, division: 1 };
        this.harmonizer.repeatAllVoices(this.schedule, duration);
        this.setAllTracks(function () {
            _this.ticker.restart();
        }); //function () {
    };
    //chooseVariantProg(){
    //	this.setVariantProg(this.schedule.harmony);
    //}
    /*chooseVariantProg() {
        let me = this;
        let progPatRange: HTMLSelectElement = document.getElementById('select_prog_pattern') as any;
        let nn = progPatRange.selectedIndex;
        let tp: TrackProgression = trackProgressions[nn];
        if (tp.jspath) {
            me.doForCachedSchedule(tp.jspath, (sch: ZvoogSchedule) => {
                me.setVariantProg(sch.harmony);
            });
        } else {
            if (tp.harmony) {
                me.setVariantProg(tp.harmony);
            }
        }
    }*/
    ZvoogApp.prototype.redefineProgGrid = function () {
        var fullDur = progressionDuration(this.schedule.harmony.progression);
        var progPosition = { count: 0, division: 8 };
        //let chordLine='';
        //let chordDlmtr='';
        var cuChord = '';
        while (meterMore(progPosition, fullDur) < 0 && progPosition.count < 16 * 8) {
            var mel = this.harmonizer.findProgressionPart(progPosition, this.schedule.harmony.progression);
            if (mel) {
                //let id = 'chord_' + (Math.floor(progPosition.count / 8)) + 'x' + (progPosition.count % 8) + '';
                var id = 'chord' + progPosition.count;
                try {
                    var aa = document.getElementById(id);
                    if (cuChord != mel.chord) {
                        cuChord = mel.chord;
                        aa.textContent = '' + cuChord;
                        //chordLine=chordLine+chordDlmtr+cuChord;
                        //chordDlmtr='|';
                    }
                    else {
                        aa.textContent = ' ___ ';
                    }
                }
                catch (xx) {
                    console.log(id, xx);
                }
                progPosition.count++;
            }
            else {
                break;
            }
        }
    };
    ZvoogApp.prototype.setTracksByProg = function (nn, harmony, onDone) {
        var me = this;
        this.schedule.harmony = JSON.parse(JSON.stringify(harmony));
        var duration = { count: 16, division: 1 };
        this.harmonizer.repeatAllVoices(this.schedule, duration);
        this.selectedProgression = nn;
        this.setAllTracks(onDone); //function () {
        //console.log('done setTracksByProg');
        /*let newTime = durations2time(me.schedule.measures);
        me.ticker.waitLoopDuration = newTime;
        if (me.ticker.ready()) {
            me.ticker.restart();
        }*/
        //});
        /*
        (document.getElementById('progNameRow') as any).innerHTML='wtg';
        console.log(document.getElementById('progNameRow'));
        console.dir(document.getElementById('progNameRow'));
        */
    };
    ZvoogApp.prototype.setProgression = function (v, onDone) {
        var nn = parseInt(v);
        var me = this;
        if (nn < 0) {
            me.doForCachedSchedule(extendedSchedulePath[-nn].path, function (sch) {
                me.setTracksByProg(-nn, sch.harmony, onDone);
            });
        }
        else {
            var tp = trackProgressions[nn];
            if (tp.jspath) {
                me.doForCachedSchedule(tp.jspath, function (sch) {
                    me.setTracksByProg(nn, sch.harmony, onDone);
                });
            }
            else {
                if (tp.harmony) {
                    me.setTracksByProg(nn, tp.harmony, onDone);
                }
            }
        }
    };
    ZvoogApp.prototype.setAllTracks = function (onDone) {
        var _this = this;
        //console.log('setAllTracks start');
        var me = this;
        me.setTempo(me.selectedTempo);
        document.getElementById('sliderProgression').value = Math.floor(1000 * this.selectedProgression / trackProgressions.length);
        me.refitProgList();
        this.fitCHordsTitle();
        var e = document.getElementById('tempoSlider');
        if (e) {
            e.value = '' + me.selectedTempo;
        }
        me.setBassPattern(me.selectedBass, function () {
            me.setDrumPattern(me.selectedDrums, function () {
                me.setLeadPattern(me.selectedLead, function () {
                    me.setPadPattern(me.selectedPad, function () {
                        //console.log('setAllTracks onDone');
                        _this.redefineProgGrid();
                        if (onDone)
                            onDone();
                        //console.log(me.schedule);
                        /*for (let tt = 0; tt < 4; tt++) {
                            console.log('=', me.schedule.tracks[tt].title);
                            for (let vv = 0; vv < me.schedule.tracks[tt].voices.length; vv++) {
                                console.log('---', me.schedule.tracks[tt].voices[vv].title);
                            }
                        }*/
                    });
                });
            });
        });
    };
    ZvoogApp.prototype.showChordInfo = function (name) {
        this.cancelPlay();
        console.log('info', name);
        var chordInfoTitle = document.getElementById('chordInfoTitle');
        if (chordInfoTitle) {
            chordInfoTitle.innerHTML = name;
        }
        rockDiceShowChord();
    };
    ZvoogApp.prototype.fitCHordsTitle = function () {
        var chords = this.simplifiedChords(this.schedule.harmony);
        var progNameRow = document.getElementById('progNameRow');
        if (progNameRow) {
            //progNameRow.innerHTML = chords.join(' - ');
            progNameRow.innerHTML = "";
            var me_4 = this;
            var _loop_1 = function (ii) {
                a = document.createElement('a');
                a.textContent = chords[ii];
                a.onclick = function () {
                    me_4.showChordInfo(chords[ii]);
                    //console.log('click', chords[ii]);
                };
                if (ii > 0) {
                    progNameRow.append(' - ');
                }
                progNameRow.appendChild(a);
            };
            var a;
            for (var ii = 0; ii < chords.length; ii++) {
                _loop_1(ii);
            }
        }
        /*try {
            (document.getElementById('progNameRow') as any).innerHTML = chords.join(' - ');
            //console.log(this.schedule.harmony.progression);
        } catch (xx) {
            console.log(xx);
        }*/
    };
    ZvoogApp.prototype.waitLoadImportedZvoogSchedule = function (//filePath: string, 
    app, afterDone) {
        if (window['importedZvoogSchedule']) {
            var s = app.harmonizer.clearCloneSchedule(window['importedZvoogSchedule']);
            afterDone(s);
        }
        else {
            setTimeout(function () {
                app.waitLoadImportedZvoogSchedule(app, afterDone);
            }, 333);
        }
    };
    ZvoogApp.prototype.loadScheduleFile = function (filePath, afterDone) {
        console.log('loadScheduleFile', filePath);
        window['importedZvoogSchedule'] = undefined;
        var r = document.createElement('script');
        r.setAttribute("type", "text/javascript");
        r.setAttribute("src", filePath);
        document.getElementsByTagName("head")[0].appendChild(r);
        this.waitLoadImportedZvoogSchedule(this, afterDone);
    };
    ZvoogApp.prototype.doForCachedSchedule = function (path, action) {
        //console.log('start doForCachedSchedule', path);
        for (var i = 0; i < this.loadedSchedules.length; i++) {
            if (this.loadedSchedules[i].path == path) {
                //console.log('found',path);
                action(this.loadedSchedules[i].schedule);
                return;
            }
        }
        var me = this;
        if (this.waitLoadPath) {
            //console.log('--===>', path, 'locked by', this.waitLoadPath);
            setTimeout(function () {
                me.doForCachedSchedule(path, action);
            }, 333);
            return;
        }
        this.waitLoadPath = path;
        this.loadScheduleFile(path, function (s) {
            me.loadedSchedules.push({ path: path, schedule: s });
            me.waitLoadPath = '';
            action(s);
        });
        //console.log('done doForCachedSchedule',path);
    };
    ZvoogApp.prototype.saveText2localStorage = function (name, text) {
        //console.log('saveText2localStorage', name, text);
        localStorage.setItem(name, text);
    };
    ZvoogApp.prototype.readTextFromlocalStorage = function (name) {
        try {
            var o = localStorage.getItem(name);
            if (o) {
                return o;
            }
            else {
                return '';
            }
        }
        catch (ex) {
            console.log(ex);
        }
        return '';
    };
    ZvoogApp.prototype.readObjectFromlocalStorage = function (name) {
        try {
            var txt = localStorage.getItem(name);
            if (txt) {
                var o = JSON.parse(txt);
                return o;
            }
            else {
                return null;
            }
        }
        catch (ex) {
            console.log(ex);
        }
        return null;
    };
    return ZvoogApp;
}());
/*
MIT License
Copyright (c) 2020 Egor Nepomnyaschih
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/*
// This constant can also be computed with the following algorithm:
const base64abc = [],
    A = "A".charCodeAt(0),
    a = "a".charCodeAt(0),
    n = "0".charCodeAt(0);
for (let i = 0; i < 26; ++i) {
    base64abc.push(String.fromCharCode(A + i));
}
for (let i = 0; i < 26; ++i) {
    base64abc.push(String.fromCharCode(a + i));
}
for (let i = 0; i < 10; ++i) {
    base64abc.push(String.fromCharCode(n + i));
}
base64abc.push("+");
base64abc.push("/");
*/
var base64abc = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
];
/*
// This constant can also be computed with the following algorithm:
const l = 256, base64codes = new Uint8Array(l);
for (let i = 0; i < l; ++i) {
    base64codes[i] = 255; // invalid character
}
base64abc.forEach((char, index) => {
    base64codes[char.charCodeAt(0)] = index;
});
base64codes["=".charCodeAt(0)] = 0; // ignored anyway, so we just need to prevent an error
*/
var base64codes = [
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255, 255, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255,
    255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255,
    255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
];
//function getBase64Code(charCode: number): number {
//if (charCode >= base64codes.length) {
//	throw new Error("Unable to parse base64 string.");
//}
//const code: number = base64codes[charCode];
//if (code === 255) {
//	throw new Error("Unable to parse base64 string.");
//}
//return code;
//}
//function bytesToBase64(bytes: number[]): string {
function int8ArrayToBase64(bytes) {
    var result = '';
    var i;
    var k = bytes.length;
    for (i = 2; i < k; i += 3) {
        result = result + base64abc[bytes[i - 2] >> 2];
        result = result + base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result = result + base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
        result = result + base64abc[bytes[i] & 0x3F];
    }
    if (i === k + 1) { // 1 octet yet to write
        result = result + base64abc[bytes[i - 2] >> 2];
        result = result + base64abc[(bytes[i - 2] & 0x03) << 4];
        result = result + "==";
    }
    if (i === k) { // 2 octets yet to write
        result = result + base64abc[bytes[i - 2] >> 2];
        result = result + base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result = result + base64abc[(bytes[i - 1] & 0x0F) << 2];
        result = result + "=";
    }
    return result;
}
function uInt8ArrayToBase64(bytes) {
    var result = '';
    var i;
    var k = bytes.length;
    for (i = 2; i < k; i += 3) {
        result = result + base64abc[bytes[i - 2] >> 2];
        result = result + base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result = result + base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
        result = result + base64abc[bytes[i] & 0x3F];
    }
    if (i === k + 1) { // 1 octet yet to write
        result = result + base64abc[bytes[i - 2] >> 2];
        result = result + base64abc[(bytes[i - 2] & 0x03) << 4];
        result = result + "==";
    }
    if (i === k) { // 2 octets yet to write
        result = result + base64abc[bytes[i - 2] >> 2];
        result = result + base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result = result + base64abc[(bytes[i - 1] & 0x0F) << 2];
        result = result + "=";
    }
    return result;
}
function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
function findChordStepByID(id, selectedMap) {
    for (var i = 0; i < selectedMap.length; i++) {
        if (selectedMap[i].id == id) {
            return selectedMap[i];
        }
    }
    return selectedMap[0];
}
function randomChordVariation(chords) {
    var varCount = chords.length;
    var num = Math.floor(Math.random() * varCount);
    return chords[num];
}
function dumpRandomProg() {
    var majorMap = [
        { id: 'I', exits: ['ii', 'iii', 'IV', 'V', 'vi', 'vii'], chords: ['C', 'C', 'C', 'Cmaj7'] },
        { id: 'ii', exits: ['I', 'V', 'vi', 'vii'], chords: ['Dm', 'Dm', 'Dm', 'Dm7'] },
        { id: 'iii', exits: ['ii', 'IV', 'vi'], chords: ['Em', 'Em', 'Em', 'Em7', 'Em9', 'Em/G'] },
        { id: 'IV', exits: ['I', 'ii', 'V', 'vi', 'vii',], chords: ['F', 'F', 'F', 'F7'] },
        { id: 'V', exits: ['I', 'ii', 'IV'], chords: ['G', 'G', 'G', 'G7', 'G/Db'] },
        { id: 'vi', exits: ['ii', 'IV', 'V', 'vii'], chords: ['Am', 'Am', 'Am', 'Am7', 'Am9', 'Am/C'] },
        { id: 'vii', exits: ['I', 'ii', 'IV', 'vi'], chords: ['Bm7b5', 'Bm7b5', 'Bm7b5', 'Bm/D'] }
    ];
    var majorMap2 = [
        { id: 'I', exits: ['ii', 'iii', 'IV', 'V', 'vi'], chords: ['C', 'C2', 'C6', 'Cmaj7', 'Csus'] },
        { id: 'ii', exits: ['iii', 'V'], chords: ['Dm', 'Dm7', 'Dm9'] },
        { id: 'iii', exits: ['ii', 'IV', 'vi'], chords: ['Em', 'Em7'] },
        { id: 'IV', exits: ['I', 'iii', 'V'], chords: ['F', 'F6', 'Fmaj7'] },
        { id: 'V', exits: ['I'], chords: ['G', 'G7', 'G9', 'G13', 'Gsus'] },
        { id: 'vi', exits: ['ii', 'IV'], chords: ['Am', 'Am7', 'Am9'] }
    ];
    //console.log('majorMap', majorMap);
    var selectedMap = majorMap;
    var curStep = selectedMap[Math.floor(Math.random() * selectedMap.length)];
    var chordProg = '' + randomChordVariation(selectedMap[0].chords);
    while (curStep.id != selectedMap[0].id) {
        chordProg = chordProg + ' ' + randomChordVariation(curStep.chords);
        var varCount = curStep.exits.length;
        var num = Math.floor(Math.random() * varCount);
        //console.log(num, 'curStep', curStep);
        curStep = findChordStepByID(curStep.exits[num], selectedMap);
        //console.log('found', curStep);
    }
    console.log('chordProg', chordProg);
}
