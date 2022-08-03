
declare function createNewMIDIwriter(tracks: any): any;
declare function createNewMIDItrack(): any;
declare function createNewMIDIProgramChangeEvent(o: any): any;
declare function createNewMIDINoteOnEvent(o: any): any;
declare function createNewMIDINoteOffEvent(o: any): any;

function exportMIDIAndroid(schedule:ZvoogSchedule) {
	console.log('exportMIDIAndroid', schedule);
	var drumTrack = createDrumEvents(schedule);
	var alltracks = createInsEvents(schedule);
	var tracks: any[] = [];
	for (var i = 0; i < alltracks.length; i++) {
		tracks.push(alltracks[i]);
	}
	tracks.push(drumTrack);
	//console.log('tracks', tracks);
	//console.log('drumTrack', drumTrack);
	//console.log('alltracks', alltracks);
	//var midiwriter = new MIDIWriter(tracks);
	var midiwriter = createNewMIDIwriter(tracks);
	var uInt8Array:Int8Array = midiwriter.buildFile();
	//https://stackoverflow.com/questions/8586691/how-to-open-file-save-dialog-in-android
	//https://www.youtube.com/watch?v=GRGaGCYKpMY
	//exportFile(uInt8Array);
	var data64=int8ArrayToBase64(uInt8Array);
	promptExportFile(data64,'RockDice.mid','audio/midi');
}
function exportMIDIDesktop (schedule:ZvoogSchedule) {
	console.log('exportMIDIDesktop', schedule);
	var drumTrack = createDrumEvents(schedule);
	var alltracks = createInsEvents(schedule);
	var tracks: any[] = [];
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
	var alltracks: any[] = [];
	let chanCount = 0;

	for (let t = 1; t < schedule.tracks.length; t++) {
		var fromTrack = schedule.tracks[t];
		var bassUp=0;
		//if(t==1)bassUp=12;
		for (var vv = 0; vv < fromTrack.voices.length; vv++) {
			
			var iTrack = createNewMIDItrack();//new Track();
			iTrack.setTempo(schedule.measures[0].tempo);
			alltracks.push(iTrack);
			var voice = fromTrack.voices[vv];
			//console.log('voice', voice.title);
			//var nn = 1 * voice.source.initial;
			//var insMIDI = 1 + parseInt(wafpl.loader.instrumentInfo(nn).variable.substr(6, 3));

			let loaderNum = parseInt(voice.source.initial);
			let iurl = wafpl.loader.instrumentKeys()[loaderNum];
			let insMIDI = parseInt(iurl.substr(0, 3));
			//console.log(voice.source.initial,voice.title,iurl,midinum);


			/*iTrack.addEvent(new ProgramChangeEvent({
				instrument: insMIDI,
				channel: tt
			}));*/
			iTrack.addEvent(createNewMIDIProgramChangeEvent({
				instrument: insMIDI,
				channel: chanCount
			}))
			//console.log(tt, nn, wafpl.loader.instrumentInfo(nn).title, insMIDI);
			var onOff: any[] = [];
			let measurePosition = {
				count: 0,
				division: 1
			};
			for (let i = 0; i < schedule.measures.length; i++) {
				if (voice.measureChords.length > i && (voice.measureChords[i])) {
					let measureChord = voice.measureChords[i];
					for (let k = 0; k < measureChord.chords.length; k++) {
						let chord = measureChord.chords[k];
						let chordPosition = plusMeter(measurePosition, chord.when);
						var start = Math.floor(duration384(chordPosition) / (384 / 16));
						var duration = Math.floor(duration384(chord.envelopes[0].pitches[0].duration) / (384 / 16));
						for (var kk = 0; kk < chord.envelopes.length; kk++) {
							onOff.push({
								nn: start,
								pitch: chord.envelopes[kk].pitches[0].pitch+bassUp,
								begin: 1
							});
							onOff.push({
								nn: start + duration,
								pitch: chord.envelopes[kk].pitches[0].pitch+bassUp,
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
					var on: any = createNewMIDINoteOnEvent({
						pitch: onOff[ii].pitch ,
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
				} else {
					var off: any = createNewMIDINoteOffEvent({
						pitch: onOff[ii].pitch ,
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
		var r: any[] = [];
		for (var i = 0; i < nn; i++) {
			r.push('16');
		}
		return r;
	} else {
		return 0;
	}
}

function createDrumEvents(schedule) {
	var wafpl = new WebAudioFontPlayer();
	//var drumTrack = new Track();
	var drumTrack = createNewMIDItrack();
	drumTrack.setTempo(schedule.measures[0].tempo);
	var fromTrack = schedule.tracks[0];
	var onOff: any[] = [];
	for (var v = 0; v < fromTrack.voices.length; v++) {
		var voice = fromTrack.voices[v];
		//console.log('voice', voice.title);
		//var nn = 1 * voice.source.initial;
		let loaderNum = parseInt(voice.source.initial);
		let iurl = wafpl.loader.drumKeys()[loaderNum];
		let drMIDI = parseInt(iurl.substr(0, 2));
		//console.log(voice.source.initial, voice.title, iurl, drMIDI);
		let measurePosition = {
			count: 0,
			division: 1
		};
		for (let i = 0; i < schedule.measures.length; i++) {
			if (voice.measureChords.length > i && (voice.measureChords[i])) {
				let measureChord = voice.measureChords[i];
				for (let k = 0; k < measureChord.chords.length; k++) {
					let chord = measureChord.chords[k];
					let chordPosition = plusMeter(measurePosition, chord.when);
					var start = Math.floor(duration384(chordPosition) / (384 / 16));
					var duration = Math.floor(duration384(chord.envelopes[0].pitches[0].duration) / (384 / 16));
					onOff.push({
						nn: start,
						drum: drMIDI,//wafpl.loader.drumInfo(nn).pitch,
						begin: 1
					});
					onOff.push({
						nn: start + duration,
						drum: drMIDI,//wafpl.loader.drumInfo(nn).pitch,
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
			var on: any = createNewMIDINoteOnEvent({
				pitch: onOff[ii].drum,
				velocity: 99,
				channel: 10,
				wait: n16(wait)
			});
			drumTrack.addEvent(on);
		} else {
			/*var nn = new NoteOffEvent({
				pitch: onOff[ii].drum,
				velocity: 99,
				channel: 10,
				duration: n16(wait)
			})*/
			var off: any = createNewMIDINoteOffEvent({
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
