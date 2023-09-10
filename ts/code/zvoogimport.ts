function addIns(insDef: { step: number, length: number, shift: number, pitch: number }[][][], track: number, beat: number, length: number, shift: number, pitch: number) {
	if (!(insDef[track])) insDef[track] = [];
	var measure = Math.floor(beat / 16);
	if (!(insDef[track][measure])) insDef[track][measure] = [];
	var step = beat % 16;
	insDef[track][measure].push({
		step: step,
		length: length,
		shift: shift,
		pitch: pitch
	});
}
function addDrumBeat(drumDef: number[][][], drum: number, beat: number) {
	if (!(drumDef[drum])) drumDef[drum] = [];
	var measure = Math.floor(beat / 16);
	if (!(drumDef[drum][measure])) drumDef[drum][measure] = [];
	var step = beat % 16;
	drumDef[drum][measure].push(step);
}
function fromRiffShare(riffurl: string): ZvoogSchedule {
	var drumInfo: { kind: string, pitch: number, num: number, volumeRatio: number }[] = [];
	var trackInfo: { kind: string, octave: number, num: number, volumeRatio: number }[] = [];
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
	var strings: string[] = (riffurl.split('=')[1]).split('-');
	for (var i = 0; i < 8; i++) {
		var n = 10 * parseInt(strings[1].substring(i, i + 1), 16);
		trackInfo[i].volumeRatio = trackInfo[i].volumeRatio * n / 100.0;
	}
	for (var i = 0; i < 8; i++) {
		var n = 10 * parseInt(strings[2].substring(i, i + 1), 16);
		drumInfo[i].volumeRatio = drumInfo[i].volumeRatio * n / 100.0;
	}
	let convertedSchedule: ZvoogSchedule = {
		title: 'converted',
		tracks: [], effects: [], measures: []
		, harmony: { tone: 'C', mode: 'Ionian', progression: [] }
	};
	var tempo = parseInt(strings[0], 16);
	
	var drumDef: number[][][] = [];
	var cnt = strings[4].length / 4;
	var eq: number[] = [];
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
		if ((data | parseInt('00000001', 2)) == data) addDrumBeat(drumDef, drum, i32 * 8 + 0);
		if ((data | parseInt('00000010', 2)) == data) addDrumBeat(drumDef, drum, i32 * 8 + 1);
		if ((data | parseInt('00000100', 2)) == data) addDrumBeat(drumDef, drum, i32 * 8 + 2);
		if ((data | parseInt('00001000', 2)) == data) addDrumBeat(drumDef, drum, i32 * 8 + 3);
		if ((data | parseInt('00010000', 2)) == data) addDrumBeat(drumDef, drum, i32 * 8 + 4);
		if ((data | parseInt('00100000', 2)) == data) addDrumBeat(drumDef, drum, i32 * 8 + 5);
		if ((data | parseInt('01000000', 2)) == data) addDrumBeat(drumDef, drum, i32 * 8 + 6);
		if ((data | parseInt('10000000', 2)) == data) addDrumBeat(drumDef, drum, i32 * 8 + 7);
	}
	
	var insDef: { step: number, length: number, shift: number, pitch: number }[][][] = [];
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
		if (drumDef[i]) if (drumDef[i].length > measureCount) measureCount = drumDef[i].length;
		if (insDef[i]) if (insDef[i].length > measureCount) measureCount = insDef[i].length;
	}
	var drumTrackDef: ZvoogTrack = {
		title: 'drums',
		voices: []
		, effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }] }]
	};
	convertedSchedule.tracks.push(drumTrackDef);
	for (var nn = 0; nn < 8; nn++) {
		if (drumDef[nn]) {
			let voice: ZvoogVoice = {
				measureChords: []
				, source: { pluginSource: null, kind: "wafdrum", initial: '' + drumInfo[nn].num, parameters: [] }
				, effects: [
					{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 * (drumInfo[nn].volumeRatio) }] }] }
					, {
						pluginEffect: null, kind: "equalizer", initial: "", parameters: [
							{ points: [{ skipMeasures: 0, skip384: 0, velocity: eq[0] / 10 * 60 + 60 }] }//32';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[1] / 10 * 60 + 60 }] }//64';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[2] / 10 * 60 + 60 }] }//128';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[3] / 10 * 60 + 60 }] }//256';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[4] / 10 * 60 + 60 }] }//512';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[5] / 10 * 60 + 60 }] }//1k';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[6] / 10 * 60 + 60 }] }//2k';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[7] / 10 * 60 + 60 }] }//4k';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[8] / 10 * 60 + 60 }] }//8k';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[9] / 10 * 60 + 60 }] }//16k';
						]
					}
				]
				//, bass: false
				, title: drumInfo[nn].kind
				, stringPattern: null
				, strumPattern: null
				, keyPattern: null
			};
			drumTrackDef.voices.push(voice);
			for (var i = 0; i < measureCount; i++) {
				let chords: ZvoogMeasureChord = { chords: [] };
				voice.measureChords.push(chords);
				if (drumDef[nn][i]) {
					for (var k = 0; k < drumDef[nn][i].length; k++) {
						chords.chords.push({
							when: { count: drumDef[nn][i][k], division: 16 }
							, variation: 0, envelopes: [{ pitches: [{ duration: { count: 4, division: 16 }, pitch: drumInfo[nn].pitch }] }]
						});
					}

				}
			}
		}
	}
	var insTrackDef: ZvoogTrack = {
		title: 'melody',
		voices: []
		, effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }] }]
	};
	convertedSchedule.tracks.push(insTrackDef);
	for (var nn = 0; nn < 8; nn++) {
		if (insDef[nn]) {
			let voice: ZvoogVoice = {
				measureChords: []
				, source: { pluginSource: null, kind: "wafinstrument", initial: '' + trackInfo[nn].num, parameters: [] }
				, effects: [
					{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 * (trackInfo[nn].volumeRatio) }] }] }
					, {
						pluginEffect: null, kind: "equalizer", initial: "", parameters: [
							{ points: [{ skipMeasures: 0, skip384: 0, velocity: eq[0] / 10 * 60 + 60 }] }//32';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[1] / 10 * 60 + 60 }] }//64';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[2] / 10 * 60 + 60 }] }//128';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[3] / 10 * 60 + 60 }] }//256';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[4] / 10 * 60 + 60 }] }//512';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[5] / 10 * 60 + 60 }] }//1k';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[6] / 10 * 60 + 60 }] }//2k';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[7] / 10 * 60 + 60 }] }//4k';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[8] / 10 * 60 + 60 }] }//8k';
							, { points: [{ skipMeasures: 0, skip384: 0, velocity: eq[9] / 10 * 60 + 60 }] }//16k';
						]
					}
				]
				//, bass: (nn == 5 || nn == 7)
				, title: trackInfo[nn].kind
				, stringPattern: null
				, strumPattern: null
				, keyPattern: null
			};
			insTrackDef.voices.push(voice);
			for (var i = 0; i < measureCount; i++) {
				let chords: ZvoogMeasureChord = { chords: [] };
				voice.measureChords.push(chords);
				if (insDef[nn][i]) {
					var stepLengthShiftPitch: { step: number, items: { step: number, length: number, shift: number, pitch: number }[] }[] = [];
					for (var k = 0; k < insDef[nn][i].length; k++) {
						var chordAt: { step: number, items: { step: number, length: number, shift: number, pitch: number }[] } | null = null;
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
						let one: ZvoogChord = {
							when: { count: stepLengthShiftPitch[pp].step, division: 16 }
							, envelopes: []
							, variation: 0
						};
						chords.chords.push(one);
						for (var ii = 0; ii < stepLengthShiftPitch[pp].items.length; ii++) {
							one.envelopes.push({
								pitches: [{
									duration: { count: stepLengthShiftPitch[pp].items[ii].length, division: 16 }
									, pitch: (stepLengthShiftPitch[pp].items[ii].pitch + 12 * trackInfo[nn].octave)
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
			{ points: [{ skipMeasures: 0, skip384: 0, velocity: 0.25 * 119 }] }//reverberator';
			, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.5 * 119 }] }//threshold';
			, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.9 * 119 }] }//knee';
			, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.5 * 119 }] }//ratio';
			, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.02 * 119 }] }//attack';
			, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.25 * 119 }] }//release';
		]
	});
	convertedSchedule.effects.push({ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }] });
	for (var i = 0; i < measureCount; i++) {
		convertedSchedule.measures.push({ meter: { count: 4, division: 4 }, tempo: tempo });
	}
	//convertedSchedule.harmony.progression.push({ duration: { count: measureCount, division: 1 }, chord: "C" });
	let pitches: { pitch: number, count: number }[] = [];
	for (let t = 1; t < convertedSchedule.tracks.length; t++) {
		let track = convertedSchedule.tracks[t];
		for (let v = 0; v < track.voices.length; v++) {
			let voice = track.voices[v];
			for (let mc = 0; mc < voice.measureChords.length; mc++) {
				let meaChord = voice.measureChords[mc];
				for (let ch = 0; ch < meaChord.chords.length; ch++) {
					let chord = meaChord.chords[ch];
					for (let e = 0; e < chord.envelopes.length; e++) {
						let envelope = chord.envelopes[e];
						let firstPitch = envelope.pitches[0].pitch % 12;

						//if (pitches.indexOf(firstPitch) < 0) {
						//pitches.push(firstPitch);
						//}
						let found: { pitch: number, count: number } | null = null;
						for (let kk = 0; kk < pitches.length; kk++) {
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
	pitches.sort(function (a: { pitch: number, count: number }
		, b: { pitch: number, count: number }): number {
		return b.count - a.count;
	});
	console.log('pitches', pitches);
	let fit: { basePitch: number, baseChord: string, mode: IntervalMode, counter: number }[] = [];
	/*for (var b = 0; b < 12; b++) {
		for (let m = 0; m < scaleModes.length; m++) {
			let c = calcFitCount(b, scaleModes[m], pitches);
			fit.push({ basePitch: b, baseChord: absChordSymbol(b), mode: scaleModes[m], counter: c });
		}
	}*/
	if (pitches[0]) {
		let bb = pitches[0].pitch;
		for (let m = 0; m < scaleModes.length; m++) {
			let c = calcFitCount(bb, scaleModes[m], pitches);
			fit.push({ basePitch: bb, baseChord: absChordSymbol(bb), mode: scaleModes[m], counter: c });
		}
		if (pitches.length > 1) {
			if (pitches[1].count / pitches[0].count > 0.75) {
				bb = pitches[1].pitch;
				for (let m = 0; m < scaleModes.length; m++) {
					let c = calcFitCount(bb, scaleModes[m], pitches);
					fit.push({ basePitch: bb, baseChord: absChordSymbol(bb), mode: scaleModes[m], counter: c });
				}
			}
		}
		if (pitches.length > 2) {
			if (pitches[2].count / pitches[0].count > 0.75) {
				bb = pitches[2].pitch;
				for (let m = 0; m < scaleModes.length; m++) {
					let c = calcFitCount(bb, scaleModes[m], pitches);
					fit.push({ basePitch: bb, baseChord: absChordSymbol(bb), mode: scaleModes[m], counter: c });
				}
			}
		}

		fit.sort(function (v1: { basePitch: number, baseChord: string, mode: IntervalMode, counter: number }
			, v2: { basePitch: number, baseChord: string, mode: IntervalMode, counter: number }): number {
			return (v2.counter * 1000 + v2.mode.priority) - (v1.counter * 1000 + v1.mode.priority);
		});
		console.log('fit', fit);
		let ha = fit[0];
		convertedSchedule.harmony.progression.push({
			duration: { count: measureCount, division: 1 }
			, chord: ha.baseChord
		});
		convertedSchedule.harmony.tone = ha.baseChord;
		convertedSchedule.harmony.mode = ha.mode.name;
	}else{
		convertedSchedule.harmony.progression.push({
			duration: { count: measureCount, division: 1 }
			, chord: 'C'
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
};
function pitchExistsAsStep(basePitch: number, pitch: number, steps: number[]): boolean {
	let p = pitch - basePitch;
	if (p < 0) p = p + 12;
	p = p % 12;
	//console.log(basePitch,pitch,p,steps);
	for (let i = 0; i < steps.length; i++) {
		if (p == steps[i]) {
			return true;
		}
	}
	return false;
}
function calcFitCount(basePitch: number, mode: IntervalMode, pitches: { pitch: number, count: number }[]): number {
	let counter = 0;
	for (let i = 0; i < pitches.length; i++) {
		if (pitchExistsAsStep(basePitch, pitches[i].pitch, mode.steps)) {
			counter++;
		}
	}
	return counter;
}