
function duration2seconds(bpm: number, duration384: number): number {
	let n4 = 60 / bpm;
	//let part = duration.division / (4 * duration.count);
	let part = 384 / (4 * duration384);
	return n4 / part;
}
function durations2time(measures: ZvoogMeasure[]): number {
	let t = 0;
	for (let i = 0; i < measures.length; i++) {
		t = t + duration2seconds(measures[i].tempo, duration384(measures[i].meter));
	}
	return t;
}
function seconds2Duration384(time: number, bpm: number): number {
	let n4 = 60 / bpm;
	let n384 = n4 / 96;
	return Math.round(time / n384);
}
function duration384(meter: ZvoogMeter): number {
	return meter.count * (384 / meter.division);
}
function calculateEnvelopeDuration(envelope: ZvoogEnvelope): ZvoogMeter {
	let d: ZvoogMeter = { count: 0, division: 1 };
	for (let i = 0; i < envelope.pitches.length; i++) {
		d = plusMeter(d, envelope.pitches[i].duration);
	}
	return d;
}
function plusMeter(a: ZvoogMeter, b: ZvoogMeter): ZvoogMeter {
	if (a.division == b.division) {
		return { count: a.count + b.count, division: a.division };
	} else {
		let r = { count: a.count * b.division + b.count * a.division, division: a.division * b.division };
		return r;
	}
}
function minusMeter(a: ZvoogMeter, b: ZvoogMeter): ZvoogMeter {
	if (a.division == b.division) {
		return { count: a.count - b.count, division: a.division };
	} else {
		let r = { count: a.count * b.division - b.count * a.division, division: a.division * b.division };
		return r;
	}
}
function simplifyMeter(meter: ZvoogMeter): ZvoogMeter {
	let r = { count: meter.count, division: meter.division };
	while (r.division % 2 == 0 && r.count % 2 == 0) {
		r.division = r.division / 2;
		r.count = r.count / 2;
	}
	return r;
}
function meterMore(a: ZvoogMeter, b: ZvoogMeter): number {
	let a1 = { count: a.count, division: a.division };
	let b1 = { count: b.count, division: b.division };
	a1 = plusMeter(a1, { count: 0, division: b.division });
	b1 = plusMeter(b1, { count: 0, division: a.division });
	if (a1.count == b1.count) {
		return 0;
	} else {
		if (a1.count > b1.count) {
			return 1;
		} else {
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
function scheduleDuration(measures: ZvoogMeasure[]): ZvoogMeter {
	let duration: ZvoogMeter = { count: 0, division: 1 };
	for (let i = 0; i < measures.length; i++) {
		duration = plusMeter(duration, measures[i].meter);
	}
	return duration;
}
function progressionDuration(progression: ZvoogChordMelody[]): ZvoogMeter {
	let duration: ZvoogMeter = { count: 0, division: 1 };
	for (let i = 0; i < progression.length; i++) {
		duration = plusMeter(duration, progression[i].duration);
	}
	return duration;
}
function adjustPartLeadPad(voice: ZvoogVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]) {
	let lowest = 120;
	let highest = 0;
	let measurePosition: ZvoogMeter = { count: 0, division: 1 };
	for (let m = 0; m < voice.measureChords.length; m++) {
		let mch = voice.measureChords[m].chords;
		for (let ch = 0; ch < mch.length; ch++) {
			let chord = mch[ch];
			let chordPosition = plusMeter(measurePosition, chord.when);
			if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
				for (let e = 0; e < chord.envelopes.length; e++) {
					let envelope = chord.envelopes[e];
					for (let p = 0; p < envelope.pitches.length; p++) {
						let pitch = envelope.pitches[p];
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
		let shift = 1 * 12;
		if (lowest < 2 * 12 + 4) shift = 2 * 12;
		if (lowest < 1 * 12 + 4) shift = 3 * 12;
		if (lowest < 0 * 12 + 4) shift = 4 * 12;
		//console.log('adjustPartLeadPad', lowest, '>', highest, ':', shift, voice.title, fromPosition);
		let measurePosition: ZvoogMeter = { count: 0, division: 1 };
		for (let m = 0; m < voice.measureChords.length; m++) {
			let mch = voice.measureChords[m].chords;
			for (let ch = 0; ch < mch.length; ch++) {
				let chord = mch[ch];
				let chordPosition = plusMeter(measurePosition, chord.when);
				if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
					for (let e = 0; e < chord.envelopes.length; e++) {
						let envelope = chord.envelopes[e];
						for (let p = 0; p < envelope.pitches.length; p++) {
							let pitch = envelope.pitches[p];
							pitch.pitch = pitch.pitch + shift;
						}
					}
				}
			}
			measurePosition = plusMeter(measurePosition, measures[m].meter);
		}
	}
	if (highest > 8 * 12 + 4) {
		let shift = 1 * 12;
		if (highest > 9 * 12 + 4) shift = 2 * 12;
		if (highest > 10 * 12 + 4) shift = 3 * 12;
		if (highest > 11 * 12 + 4) shift = 4 * 12;
		//console.log('adjustPartLeadPad', lowest, '>', highest, ':', shift, voice.title, fromPosition);
		let measurePosition: ZvoogMeter = { count: 0, division: 1 };
		for (let m = 0; m < voice.measureChords.length; m++) {
			let mch = voice.measureChords[m].chords;
			for (let ch = 0; ch < mch.length; ch++) {
				let chord = mch[ch];
				let chordPosition = plusMeter(measurePosition, chord.when);
				if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
					for (let e = 0; e < chord.envelopes.length; e++) {
						let envelope = chord.envelopes[e];
						for (let p = 0; p < envelope.pitches.length; p++) {
							let pitch = envelope.pitches[p];
							pitch.pitch = pitch.pitch - shift;
						}
					}
				}
			}
			measurePosition = plusMeter(measurePosition, measures[m].meter);
		}
	}
}
function adjustPartBass(voice: ZvoogVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]) {
	let lowest = 120;
	let measurePosition: ZvoogMeter = { count: 0, division: 1 };
	for (let m = 0; m < voice.measureChords.length; m++) {
		let mch = voice.measureChords[m].chords;
		for (let ch = 0; ch < mch.length; ch++) {
			let chord = mch[ch];
			let chordPosition = plusMeter(measurePosition, chord.when);
			if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
				for (let e = 0; e < chord.envelopes.length; e++) {
					let envelope = chord.envelopes[e];
					for (let p = 0; p < envelope.pitches.length; p++) {
						let pitch = envelope.pitches[p];
						if (pitch.pitch < lowest) {
							lowest = pitch.pitch;
						}
					}
				}
			}
		}
		measurePosition = plusMeter(measurePosition, measures[m].meter);
	}
	if (lowest < 12 + 12 + 4) {//let shift=36;
		let shift = 12;
		if (lowest < 12 + 4) shift = 24;
		if (lowest < 4) shift = 36;
		//shift=shift+24;
		//console.log('adjustPartBass',lowest, '+', shift, voice.title,fromPosition);
		let measurePosition: ZvoogMeter = { count: 0, division: 1 };
		for (let m = 0; m < voice.measureChords.length; m++) {
			let mch = voice.measureChords[m].chords;
			for (let ch = 0; ch < mch.length; ch++) {
				let chord = mch[ch];
				let chordPosition = plusMeter(measurePosition, chord.when);
				if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
					for (let e = 0; e < chord.envelopes.length; e++) {
						let envelope = chord.envelopes[e];
						for (let p = 0; p < envelope.pitches.length; p++) {
							let pitch = envelope.pitches[p];
							pitch.pitch = pitch.pitch + shift;
						}
					}
				}
			}
			measurePosition = plusMeter(measurePosition, measures[m].meter);
		}
	}
}
function createBreakList(originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[]): ZvoogMeter[] {
	let list: ZvoogMeter[] = [{ count: 0, division: 1 }];
	let fromPosition: ZvoogMeter = { count: 0, division: 1 };
	for (let i = 0; i < originalProg.length; i++) {
		let part = originalProg[i];
		let toPosition = plusMeter(fromPosition, part.duration);
		list.push({ count: toPosition.count, division: toPosition.division });
		fromPosition = toPosition;
	}
	fromPosition = { count: 0, division: 1 };
	for (let i = 0; i < targetProg.length; i++) {
		let part = targetProg[i];
		let toPosition = plusMeter(fromPosition, part.duration);
		for (let kk = 0; kk < list.length - 1; kk++) {
			let kkPos = list[kk];
			let nxtPos = list[kk + 1];
			if (meterMore(kkPos, toPosition) == 0) {
				break;
			} else {
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
function adjustVoiceLowHigh(voice: ZvoogVoice, originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[], trackIsBass: boolean) {
	let list = createBreakList(originalProg, targetProg, measures);
	for (let i = 0; i < list.length - 1; i++) {
		if (trackIsBass) {
			adjustPartBass(voice, list[i], list[i + 1], measures);
		} else {
			adjustPartLeadPad(voice, list[i], list[i + 1], measures);
		}
	}
}
