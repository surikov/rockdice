
type ProgDescript = {
	rate: number, name: string, mode: string
	, priority: number, steps: string
};
class ZvoogHarmonizer {

	drumTrackNum = 0;
	bassTrackNum = 1;
	leadTrackNum = 2;
	padTrackNum = 3;

	pitchC = 0;

	pitchCs = 1;
	pitchDb = 1;

	pitchD = 2;

	pitchDs = 3;
	pitchEb = 2;

	pitchE = 4;

	pitchF = 5;

	pitchFs = 6;
	pitchGb = 6;

	pitchG = 7;

	pitchGs = 8;
	pitchAb = 8;

	pitchA = 9;

	pitchAs = 10;
	pitchBb = 10;

	pitchB = 11;

	O12 = 12;

	S6 = this.O12 * 4 + this.pitchE;
	S5 = this.O12 * 4 + this.pitchA;
	S4 = this.O12 * 5 + this.pitchD;
	S3 = this.O12 * 5 + this.pitchG;
	S2 = this.O12 * 5 + this.pitchB;
	S1 = this.O12 * 6 + this.pitchE;

	guitarStrings6 = [this.S6, this.S5, this.S4, this.S3, this.S2, this.S1];

	findScaleMode(name: string): IntervalMode {
		for (let i = 0; i < scaleModes.length; i++) {
			if (scaleModes[i].name == name) {
				return scaleModes[i];
			}
		}
		console.log('no', name);
		return scaleModes[0];
	}

	createDrumsTrack(): ZvoogTrack {
		return {
			title: '',
			voices: []
			, effects: []
		};
	}
	createBassTrack(): ZvoogTrack {
		return {
			title: '',
			voices: []
			, effects: []
		};
	}
	createLeadTrack(): ZvoogTrack {
		return {
			title: '',
			voices: []
			, effects: []
		};
	}
	createPadTrack(): ZvoogTrack {
		return {
			title: '',
			voices: []
			, effects: []
		};
	}

	createEmptyBaseSchedule(): ZvoogSchedule {
		console.log('createEmptyBaseSchedule');
		let schedule: ZvoogSchedule = {
			title: 'Base 4 tracks',
			tracks: [
				{ title: 'Drums', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 111 }] }] }] }
				, { title: 'Bass', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 99 }] }] }] }
				, { title: 'Lead', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 66 }] }] }] }
				, { title: 'Pad', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 77 }] }] }] }
			]
			, effects: [
				{
					pluginEffect: null, kind: "echo", initial: "", parameters: [
						{ points: [{ skipMeasures: 0, skip384: 0, velocity: 0.11 * 119 }] }//reverberator';
						, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.55 * 119 }] }//threshold';
						, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.99 * 119 }] }//knee';
						, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.66 * 119 }] }//ratio';
						, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.01 * 119 }] }//attack';
						, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.25 * 119 }] }//release';
						, { points: [{ skipMeasures: 0, skip384: 0, velocity: 0.99 * 119 }] }//compression';
					]
				}
				, {
					pluginEffect: null, kind: "gain", initial: "", parameters: [
						{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }
					]
				}
			]
			, measures: [
				{ meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
				, { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
				, { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
				, { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
				, { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
				, { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
				, { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
				, { meter: { count: 1, division: 1 }, tempo: 120 }, { meter: { count: 1, division: 1 }, tempo: 120 }
			]
			, harmony: {
				tone: 'C', mode: 'Ionian'
				, progression: [{ duration: { count: 16, division: 1 }, chord: 'C' }]
			}
		};
		return schedule;
	}

	checkProgressionPoint(when: ZvoogMeter, progression: ZvoogChordMelody[]): ZvoogChordMelody | null {
		let position: ZvoogMeter = { count: 0, division: 1 };
		for (let i = 0; i < progression.length; i++) {
			let p = progression[i];

			if (meterMore(position, when) == 0) {
				return p;
			}
			position = plusMeter(position, p.duration);
		}
		return null;
	}
	findProgressionPart(when: ZvoogMeter, progression: ZvoogChordMelody[]): ZvoogChordMelody | null {
		let position: ZvoogMeter = { count: 0, division: 1 };
		for (let i = 0; i < progression.length; i++) {
			let p = progression[i];
			position = plusMeter(position, p.duration);
			if (meterMore(position, when) > 0) {
				return p;
			}
		}
		//console.trace();
		//console.log('not found', when.count, when.division, progression);
		return null;
	}
	findOrCreateChord(voice: ZvoogVoice, trackMeasures: ZvoogMeasure[], chordStartPosition: ZvoogMeter, variation: number): ZvoogChord | null {
		let measurePosition: ZvoogMeter = { count: 0, division: 1 };
		for (let i = 0; i < trackMeasures.length; i++) {
			let nextMeasurePosition = plusMeter(measurePosition, trackMeasures[i].meter);
			if (
				meterMore(chordStartPosition, measurePosition) >= 0
				&& meterMore(chordStartPosition, nextMeasurePosition) < 0
			) {

				while (voice.measureChords.length < i + 1) { voice.measureChords.push({ chords: [] }); }

				for (let ch = 0; ch < voice.measureChords[i].chords.length; ch++) {
					let chord: ZvoogChord = voice.measureChords[i].chords[ch];
					let pos = plusMeter(measurePosition, chord.when);
					if (meterMore(pos, chordStartPosition) == 0) {
						return chord;
					}
				}
				let newpos = minusMeter(chordStartPosition, measurePosition);
				let newchord: ZvoogChord = {
					when: newpos
					, envelopes: []
					, variation: variation
				};
				voice.measureChords[i].chords.push(newchord);
				return newchord;
			}
			measurePosition = nextMeasurePosition;
		}
		return null;
	}
	splitEnvelope(voice: ZvoogVoice, trackMeasures: ZvoogMeasure[], chordStartPosition: ZvoogMeter
		, chordSplitPosition: ZvoogMeter, envelope: ZvoogEnvelope, variation: number
		, cutNotSplit: boolean
	) {
		let curEnvelopePos: ZvoogMeter = { count: chordStartPosition.count, division: chordStartPosition.division };
		for (let pp = 0; pp < envelope.pitches.length; pp++) {
			let nextEnvelopePos: ZvoogMeter = plusMeter(curEnvelopePos, envelope.pitches[pp].duration);
			let diffPos = minusMeter(nextEnvelopePos, chordSplitPosition);
			if (diffPos.count > 0) {

				let part1: ZvoogMeter = simplifyMeter(minusMeter(chordSplitPosition, curEnvelopePos));
				let part2: ZvoogMeter = simplifyMeter(minusMeter(envelope.pitches[pp].duration, part1));

				envelope.pitches[pp].duration = part1;
				if (!cutNotSplit) {
					let addchord: ZvoogChord | null = this.findOrCreateChord(voice, trackMeasures, plusMeter(curEnvelopePos, part1), variation);
					if (addchord) {
						let newen: ZvoogEnvelope = { pitches: [{ duration: part2, pitch: envelope.pitches[pp].pitch }] };
						addchord.envelopes.push(newen);

						for (let kk = pp + 1; kk < envelope.pitches.length; kk++) {
							newen.pitches.push({ duration: envelope.pitches[kk].duration, pitch: envelope.pitches[kk].pitch });
						}


					}
				}
				envelope.pitches.length = pp + 1;
				break;
			}
			curEnvelopePos = nextEnvelopePos;
		}
	}
	splitTrackNotesByProgression(wholeTrack: ZvoogTrack, trackMeasures: ZvoogMeasure[]
		, toProg: ZvoogProgression, cutNotSplit: boolean) {

		let progPosition: ZvoogMeter = { count: 0, division: 1 };
		for (let pp = 0; pp < toProg.progression.length; pp++) {
			let nextProgPosition = plusMeter(progPosition, toProg.progression[pp].duration);
			for (let vv = 0; vv < wholeTrack.voices.length; vv++) {
				let voice = wholeTrack.voices[vv];

				let measurePosition: ZvoogMeter = { count: 0, division: 1 };
				for (let i = 0; i < trackMeasures.length; i++) {
					if (voice.measureChords) {
						let measureChords: ZvoogMeasureChord[] = voice.measureChords;
						if (measureChords.length > i && (measureChords[i])) {
							let measureChord = measureChords[i];
							for (let k = 0; k < measureChord.chords.length; k++) {
								let chord = measureChord.chords[k];
								let chordPosition = plusMeter(measurePosition, chord.when);
								for (let f = 0; f < chord.envelopes.length; f++) {
									let envelope = chord.envelopes[f];
									let envelopeDuration = calculateEnvelopeDuration(envelope);
									let envelopeEnd = plusMeter(chordPosition, envelopeDuration);
									if (
										meterMore(chordPosition, progPosition) >= 0
										&& meterMore(chordPosition, nextProgPosition) < 0
										&& meterMore(envelopeEnd, nextProgPosition) > 0
									) {

										this.splitEnvelope(voice, trackMeasures, chordPosition
											, nextProgPosition, envelope, chord.variation
											, cutNotSplit
										);
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
	}
	createMergedMode(modeTone: string, modeIntervals: IntervalMode, choosenChord: string): IntervalMode {
		let merged: IntervalMode = JSON.parse(JSON.stringify(modeIntervals)) as IntervalMode;
		let localMode: ZvoogChordPitches | null = this.stepsByName(choosenChord);
		if (localMode) {
			let stepDiff = this.chordStepDifference(modeTone, choosenChord);

			let localToneBase = modeIntervals.steps[stepDiff];
			let halfBase = this.chordAbsoluteHalftones(modeTone);
			let halfTarget = this.chordAbsoluteHalftones(choosenChord);
			let halfToneAux = halfTarget - ((halfBase + localToneBase) % 12);
			//console.log(halfBase, modeTone, '+', localToneBase, '=', choosenChord, halfTarget, ':', halfToneAux);

			//if(this.chordSymbol(envelope.pitches[p].pitch % 12).substr(1,1)=='#'){

			//}
			for (let i = 0; i < localMode.pitches.length; i++) {
				let mergedIdx = (localMode.pitches[i].step + stepDiff) % 7;
				let mergedHalftones = (merged.steps[stepDiff]
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
	}
	morphVoice(voice: ZvoogVoice, trackMeasures: ZvoogMeasure[], fromProg: ZvoogProgression
		, toProg: ZvoogProgression, trackIsBass: boolean
		//, isdebug: boolean
	): void {
		this.repeatProgression(fromProg, {
			count: 16
			, division: 1
		});
		//if (isdebug) {
		//console.log('morphVoice', voice.title, fromProg, toProg, trackIsBass);
		//}

		let fromIntervalMode: IntervalMode = this.findScaleMode(fromProg.mode);
		let toIntervalMode: IntervalMode = this.findScaleMode(toProg.mode);
		//console.log('toIntervalMode', toIntervalMode);
		//console.log('toProg', toProg);
		//console.log('tone', toProg.tone, 'halftones', this.chordAbsoluteHalftones(toProg.tone));
		let position: ZvoogMeter = { count: 0, division: 1 };
		for (let ii = 0; ii < trackMeasures.length; ii++) {
			if (voice.measureChords) {
				let measureChords: ZvoogMeasureChord[] = voice.measureChords;
				if (measureChords.length > ii && (measureChords[ii])) {
					let measureChord = measureChords[ii];
					for (let kk = 0; kk < measureChord.chords.length; kk++) {
						let chord = measureChord.chords[kk];
						let chordPosition = plusMeter(position, chord.when);
						let fromChord: ZvoogChordMelody | null = this.findProgressionPart(chordPosition, fromProg.progression);
						if (fromChord) {
							let toChord: ZvoogChordMelody | null = this.findProgressionPart(chordPosition, toProg.progression);
							if (toChord) {
								let fromChoosenChord = this.extractBassOrBase(fromChord.chord, trackIsBass);
								//console.log(chordPosition.count, chordPosition.division, toChord.chord,toProg.progression);
								let toSelChord = this.extractBassOrBase(toChord.chord, trackIsBass);

								let fromMergedMode = this.createMergedMode(fromProg.tone, fromIntervalMode, fromChoosenChord);
								let toMergedMode = this.createMergedMode(toProg.tone, toIntervalMode, toSelChord);
								let progSteps = '';
								let mergedSteps = '';
								for (var ss = 0; ss < 7; ss++) {
									progSteps = progSteps
										+ '/' + this.chordSymbol((this.chordAbsoluteHalftones(toProg.tone) + toIntervalMode.steps[ss]) % 12);
									mergedSteps = mergedSteps
										+ '/' + this.chordSymbol((this.chordAbsoluteHalftones(toProg.tone) + toMergedMode.steps[ss]) % 12);
								}
								for (let f = 0; f < chord.envelopes.length; f++) {
									let envelope = chord.envelopes[f];
									for (let p = 0; p < envelope.pitches.length; p++) {
										let curPitch = envelope.pitches[p].pitch;
										envelope.pitches[p].pitch = this.transposeNote(curPitch
											, fromProg.tone, fromMergedMode, fromChoosenChord
											, toProg.tone, toMergedMode, toSelChord
										);
									}
								}
							} else {
								console.log('toSelChord not found', chordPosition.count, chordPosition.division, toProg.progression);
							}
						}
					}
				}
			}
			position = plusMeter(position, trackMeasures[ii].meter);
		}

	}
	morphTrack(wholeTrack: ZvoogTrack, trackMeasures: ZvoogMeasure[], fromProg: ZvoogProgression
		, toProg: ZvoogProgression, trackIsBass: boolean
		//, isdebug: boolean
	): void {


		for (let vv = 0; vv < wholeTrack.voices.length; vv++) {
			let voice = wholeTrack.voices[vv];
			this.morphVoice(voice, trackMeasures, fromProg, toProg, trackIsBass
				//, isdebug
			);

		}
	}
	morphSchedule(schedule: ZvoogSchedule, newProg: ZvoogProgression
		//, isdebug: boolean
	) {
		//console.log('morphSchedule', schedule);
		this.repeatProgression(schedule.harmony, {
			count: 16
			, division: 1
		});
		for (let t = 1; t < schedule.tracks.length; t++) {
			let track = schedule.tracks[t];
			if (track.voices.length > 0) {
				this.splitTrackNotesByProgression(track, schedule.measures, newProg, false);
				this.morphTrack(track, schedule.measures, schedule.harmony, newProg, t == this.bassTrackNum
					//, isdebug
				);
			}
		}
	}
	transposeNote(pitch: number
		, fromRootTone: string, fromIntervalMode: IntervalMode, fromChordName: string
		, toRootTone: string, toIntervalMode: IntervalMode, toChordName: string): number {
		let fromStep = 0;
		let fromShift = 0;
		let fromRootHalftones = this.chordAbsoluteHalftones(fromRootTone);
		let fromPitchHalftones = (pitch - fromRootHalftones) % 12;
		for (let i = 0; i < fromIntervalMode.steps.length - 1; i++) {
			if (fromPitchHalftones == fromIntervalMode.steps[i]) {
				fromStep = i;
				break;
			} else {
				if (fromPitchHalftones > fromIntervalMode.steps[i] && fromPitchHalftones < fromIntervalMode.steps[i + 1]) {
					if (fromIntervalMode.flat) {
						fromStep = i;
						fromShift = 1;
					} else {
						fromStep = i + 1;
						fromShift = -1;
					}
					break;
				}
			}
		}
		let fromChordStep = this.chordStepDifference(fromRootTone, fromChordName);
		fromStep = this.roll7(fromStep - fromChordStep);
		let toChordStep = this.chordStepDifference(toRootTone, toChordName);
		let toStep = (fromStep + toChordStep) % 7;
		let toRootHalftones = this.chordAbsoluteHalftones(toRootTone);
		let resultPitch = toRootHalftones + toIntervalMode.steps[toStep];
		if (fromShift > 0) {
			if (toIntervalMode.steps[toStep] + 1 < toIntervalMode.steps[toStep + 1]) {
				resultPitch = resultPitch + 1;
			}
		} else {
			if (fromShift > 0) {
				let idx = toStep;
				if (toStep == 0) idx = 7;
				if (toIntervalMode.steps[idx] - 1 > toIntervalMode.steps[idx - 1]) {
					resultPitch = resultPitch - 1;
				}
			}
		}
		while (resultPitch < pitch) resultPitch = resultPitch + 12;
		if (Math.abs(resultPitch - pitch - 12) <= Math.abs(resultPitch - pitch)) resultPitch = resultPitch - 12;
		//console.log(fromRootTone+this.chordSymbol(pitch), '>', toRootTone,this.chordSymbol(resultPitch));
		return resultPitch;
	}
	clearCloneSchedule(schedule: ZvoogSchedule): ZvoogSchedule {
		var clone: ZvoogSchedule = JSON.parse(JSON.stringify(schedule)) as ZvoogSchedule;
		for (let i = 0; i < clone.effects.length; i++) {
			clone.effects[i].pluginEffect = null;
		}
		for (let t = 0; t < clone.tracks.length; t++) {
			for (let s = 0; s < clone.tracks[t].voices.length; s++) {
				clone.tracks[t].voices[s].source.pluginSource = null;
				for (let i = 0; i < clone.tracks[t].voices[s].effects.length; i++) {
					clone.tracks[t].voices[s].effects[i].pluginEffect = null;
				}
			}
			for (let i = 0; i < clone.tracks[t].effects.length; i++) {
				clone.tracks[t].effects[i].pluginEffect = null;
			}
		}
		return clone;
	}
	clearCloneTrack(track: ZvoogTrack): ZvoogTrack {
		var clone: ZvoogTrack = JSON.parse(JSON.stringify(track)) as ZvoogTrack;
		for (let s = 0; s < clone.voices.length; s++) {
			clone.voices[s].source.pluginSource = null;
			for (let i = 0; i < clone.voices[s].effects.length; i++) {
				clone.voices[s].effects[i].pluginEffect = null;
			}
		}
		for (let i = 0; i < clone.effects.length; i++) {
			clone.effects[i].pluginEffect = null;
		}
		return clone;
	}
	clearCloneVoice(voice: ZvoogTrack): ZvoogVoice {
		var clone: ZvoogVoice = JSON.parse(JSON.stringify(voice)) as ZvoogVoice;
		clone.source.pluginSource = null;
		for (let i = 0; i < clone.effects.length; i++) {
			clone.effects[i].pluginEffect = null;
		}
		return clone;
	}
	fillVoiceByPattern(t: number, s: number, schedule: ZvoogSchedule) {
		let voice: ZvoogVoice = schedule.tracks[t].voices[s];

		if (voice.strumPattern) {
			this.fillVoiceByStrumPattern(voice, voice.strumPattern, schedule.measures, schedule.harmony.progression);
		} else {
			if (voice.keyPattern) {
				this.fillVoiceByKeyPattern(voice, voice.keyPattern, schedule.measures, schedule.harmony.progression);
			} else {
				if (voice.stringPattern) {
					this.fillVoiceByStringPattern(voice, voice.stringPattern, schedule.measures, schedule.harmony.progression);
				}
			}
		}
	}
	fillTrackVoicesByPatterns(t: number, schedule: ZvoogSchedule) {
		for (let s = 0; s < schedule.tracks[t].voices.length; s++) {

			this.fillVoiceByPattern(t, s, schedule);

		}
	}
	fillScheduleVoicesByPatterns(schedule: ZvoogSchedule) {
		console.log('fillScheduleVoicesByPatterns');
		for (let t = 0; t < schedule.tracks.length; t++) {
			this.fillTrackVoicesByPatterns(t, schedule);
		}
	}
	isNumber(value: string | number): boolean {
		return ((value != null) &&
			(value !== '') &&
			!isNaN(Number(value.toString())));
	}









	fillVoiceByStringPattern(voice: ZvoogVoice, pattern: ZvoogStringPattern, measures: ZvoogMeasure[], progression: ZvoogChordMelody[]): void {

		let strings = pattern.strings;
		let fullDur = scheduleDuration(measures);
		if (strings) {
			voice.measureChords = [];
			for (var i = 0; i < strings.length; i++) {

				let singleString = strings[i].trim();

				let voicePosition: ZvoogMeter = { count: 0, division: 16 };
				while (meterMore(voicePosition, fullDur) < 0) {

					let sym = this.extractSymbol(singleString, voicePosition.count);
					if (sym == '*') {
						let curChordMelody: ZvoogChordMelody | null = this.findProgressionPart(voicePosition, progression);
						if (curChordMelody) {
							let curChordName = this.extractBassOrBase(curChordMelody.chord, false);

							let pitch = this.findStringPitch(curChordName, 5 - i);
							if (pitch >= 0) {
								let addchord: ZvoogChord | null = this.findOrCreateChord(voice, measures, voicePosition, 0);
								let len = 1;
								let kk = voicePosition.count + 1;
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
	}

	extractSymbol(str: string, num: number) {
		let idx = num;
		while (idx >= str.length) idx = idx - str.length;
		let r = str.substr(idx, 1);

		return r;
	}

	fillVoiceByKeyPattern(voice: ZvoogVoice, pattern: ZvoogKeyPattern, measures: ZvoogMeasure[], progression: ZvoogChordMelody[]): void {
		let point: ZvoogMeter = { count: 0, division: 1 };
		let strumIdx = 0;
		voice.measureChords = [];
		let lastOctave = 0;
		let lastChord = '';
		for (let i = 0; i < measures.length; i++) {
			let measure: ZvoogMeasure = measures[i];
			let chords: ZvoogMeasureChord = { chords: [] };
			voice.measureChords.push(chords);
			let nextpoint: ZvoogMeter = plusMeter(point, measure.meter);
			let chordPos: ZvoogMeter = { count: 0, division: 16 };
			while (meterMore(point, nextpoint) < 0) {
				let symbol: string = pattern.octaves.trim().substr(strumIdx, 1);
				let curChordMelody: ZvoogChordMelody | null = this.findProgressionPart(point, progression);
				if (curChordMelody) {
					let curChordName = this.extractBassOrBase(curChordMelody.chord, false);
					let cuOctave = 0;
					if (this.isNumber(symbol)) {
						cuOctave = parseInt(symbol);
						lastChord = curChordName;
					} else {
						if (symbol == '-' && lastChord != curChordName) {
							cuOctave = lastOctave;
							lastChord = curChordName;
						}
					}

					if (cuOctave) {
						lastOctave = cuOctave;
						let len = 1;
						let lenPos = plusMeter(point, { count: 1, division: 16 });
						let curLenMelody: ZvoogChordMelody | null = this.findProgressionPart(lenPos, progression);
						if (curLenMelody) {
							let curLenChordName = this.extractBassOrBase(curLenMelody.chord, false);
							while (this.extractSymbol(pattern.octaves.trim(), strumIdx + len) == '-'
								&& curLenChordName == lastChord
								//&& meterMore(progressionDuration(progression),lenPos)
							) {
								len++;
								lenPos = plusMeter(lenPos, { count: 1, division: 16 });
								curLenMelody = this.findProgressionPart(lenPos, progression);
								if (curLenMelody) {
									curLenChordName = this.extractBassOrBase(curLenMelody.chord, false);
								} else {
									break;
								}
							}
							let pitches = this.pianoKeysByName(lastChord);
							var str: ZvoogChord = {
								when: chordPos
								, envelopes: []
								, variation: 0
							};
							for (let ss = 0; ss < pitches.length; ss++) {
								str.envelopes.push(
									{
										pitches: [{
											duration: { count: len, division: 16 }
											, pitch: pitches[ss] + cuOctave * 12
										}]
									}
								);
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
	}
	fillVoiceByStrumPattern(voice: ZvoogVoice, pattern: ZvoogStrumPattern, measures: ZvoogMeasure[], progression: ZvoogChordMelody[]): void {

		let point: ZvoogMeter = { count: 0, division: 1 };
		let strumIdx = 0;
		voice.measureChords = [];
		for (let i = 0; i < measures.length; i++) {
			let measure: ZvoogMeasure = measures[i];
			let chords: ZvoogMeasureChord = { chords: [] };
			voice.measureChords.push(chords);
			let nextpoint: ZvoogMeter = plusMeter(point, measure.meter);
			let chordPos: ZvoogMeter = { count: 0, division: 16 };
			let lastVar = 0;
			let lastChord = '';
			while (meterMore(point, nextpoint) < 0) {
				let symbol: string = pattern.directions.trim().substr(strumIdx, 1);
				let curChordMelody: ZvoogChordMelody | null = this.findProgressionPart(point, progression);
				if (curChordMelody) {
					let curChordName = this.extractBassOrBase(curChordMelody.chord, false);
					let variation = 0;
					if (symbol == 'V') {
						variation = 1;
						lastChord = curChordName;//chordMelody.chord;
					} else {
						if (symbol == 'A') {
							variation = 2;
							lastChord = curChordName;//chordMelody.chord;
						} else {
							if (symbol == 'X') {
								variation = 3;
								lastChord = curChordName;//chordMelody.chord;
							} else {
								if (symbol == '-' && lastChord != curChordName) {//chordMelody.chord) {
									variation = lastVar;
									lastChord = curChordName;//chordMelody.chord;
								}
							}
						}
					}

					if (variation) {
						lastVar = variation;
						let len = 1;
						let lenPos = plusMeter(point, { count: 1, division: 16 });
						let lenChordMelody: ZvoogChordMelody | null = this.findProgressionPart(lenPos, progression);
						if (lenChordMelody) {
							let lenChordExtracted = this.extractBassOrBase(lenChordMelody.chord, false);
							while (pattern.directions.trim().substr(strumIdx + len, 1) == '-' && strumIdx + len < pattern.directions.trim().length && lenChordExtracted == lastChord) {
								len++;
								lenPos = plusMeter(lenPos, { count: 1, division: 16 });
								lenChordMelody = this.findProgressionPart(lenPos, progression);
								if (lenChordMelody) {
									lenChordExtracted = this.extractBassOrBase(lenChordMelody.chord, false);
								} else {
									break;
								}
							}
							let pitches = this.findChordPitches(lastChord);
							var str: ZvoogChord = {
								when: chordPos
								, envelopes: []
								, variation: variation
							};
							for (let ss = 0; ss < pitches.length; ss++) {
								str.envelopes.push(
									{
										pitches: [{
											duration: { count: len, division: 16 }
											, pitch: pitches[ss]
										}]
									}
								);

							}
							chords.chords.push(str);
						}
					} else {
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
	}

	tryToFindChordPitches(chordName: String): number[] | null {
		for (var i = 0; i < chordfretsData.length; i++) {
			if (chordfretsData[i].name == chordName) {
				var s: number[] = chordfretsData[i].frets;
				let pitches: number[] = [];
				for (var k = 0; k < this.guitarStrings6.length; k++) {
					if (s[k] < 0) {
						//pitches.push(-1);
					} else {
						pitches.push(this.guitarStrings6[k] + s[k] - 12);
					}
				}
				return pitches;
			}
		}

		return null;
	}
	tryToFindAllPitches(chordName: String): number[] | null {
		for (var i = 0; i < chordfretsData.length; i++) {
			if (chordfretsData[i].name == chordName) {
				var s: number[] = chordfretsData[i].frets;
				let pitches: number[] = [];
				for (var k = 0; k < this.guitarStrings6.length; k++) {
					if (s[k] < 0) {
						pitches.push(-1);
					} else {
						pitches.push(this.guitarStrings6[k] + s[k] - 12);
					}
				}
				return pitches;
			}
		}
		return null;
	}
	findStringPitch(chordName: String, stringHigh: number): number {
		let strings: number[] | null = this.tryToFindAllPitches(chordName);
		if (!(strings)) {
			if (chordName.substr(1, 1) == '#') {
				strings = this.tryToFindChordPitches(chordName.substr(0, 1) + chordName.substr(2));
				if (strings) {
					for (let i = 0; i < strings.length; i++) {
						if (strings[i] > -1) {
							strings[i] = strings[i] + 1;
						}
					}
				}
			} else {
				if (chordName.substr(1, 1) == 'b') {
					strings = this.tryToFindChordPitches(chordName.substr(0, 1) + chordName.substr(2));
					if (strings) {
						for (let i = 0; i < strings.length; i++) {
							if (strings[i] > -1) {
								strings[i] = strings[i] - 1;
							}
						}
					}
				}
			}
		}
		if (strings) {
			let r = strings[stringHigh];
			return r;
		}
		return -1;
	}
	findChordPitches(chordName: String): number[] {
		let strings: number[] | null = this.tryToFindChordPitches(chordName);
		if (strings) {
			return strings;
		}
		if (chordName.substr(1, 1) == '#') {
			strings = this.tryToFindChordPitches(chordName.substr(0, 1) + chordName.substr(2));
			if (strings) {
				for (let i = 0; i < strings.length; i++) {
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
				for (let i = 0; i < strings.length; i++) {
					if (strings[i] > -1) {
						strings[i] = strings[i] - 1;
					}
				}
				//console.log('found b',chordName);
				return strings;
			}
		}
		console.log('not found chord', chordName);
		return [];//-1, -1, -1, -1, -1, -1]
	}
	chordStepDifference(tone: string, chordName: string): number {
		let fromStep = -1;
		let fromA = tone.substr(0, 1);
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
		let a = chordName.substr(0, 1);
		let step = -1;
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
	}
	roll7(nn: number): number {
		let r = nn;
		while (r < 0) r = r + 7;
		while (r > 6) r = r - 7;
		return r;
	}
	chordAbsoluteHalftones(chordName: string): number {
		let a = chordName.substr(0, 1);
		let root = -1;
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
	}
	pianoKeysByName(chordName: string): number[] {
		let retarr: number[] = [];
		let root = this.chordAbsoluteHalftones(chordName);
		let start = 1;
		if (chordName.substr(1, 1) == '#') {
			start++;
		}
		if (chordName.substr(1, 1) == 'b') {
			start++;
		}
		if (root < 0) root = root + 12;
		if (root >= 120) root = root - 12;
		retarr.push(root);
		let chordKind = chordName.substr(start);
		for (var i = 0; i < chordPitchesData.length; i++) {
			if (chordPitchesData[i].name == chordKind) {
				for (var p = 0; p < chordPitchesData[i].pitches.length; p++) {
					retarr.push(root + chordPitchesData[i].pitches[p].halftone);
				}
				break;
			}
		}
		return retarr;
	}

	stepsByName(chordName: string): ZvoogChordPitches | null {
		let start = 1;
		if (chordName.substr(1, 1) == '#') {
			start++;
		}
		if (chordName.substr(1, 1) == 'b') {
			start++;
		}
		let chordKind = chordName.substr(start);
		for (var i = 0; i < chordPitchesData.length; i++) {
			if (chordPitchesData[i].name == chordKind) {
				return chordPitchesData[i];
			}
		}
		return null;
	}
	extractBassOrBase(chordName: string, bass: boolean): string {
		let parts = chordName.split('/');
		if (parts.length > 1) {
			if (bass) {
				return parts[1];
			} else {
				return parts[0];
			}
		} else {
			return chordName;
		}
	}

	repeatProgression(prog: ZvoogProgression, duration: ZvoogMeter) {
		let pidx = 0;
		//console.log('repeatProgression',duration,progressionDuration(prog.progression));
		while (meterMore(progressionDuration(prog.progression), duration) < 0) {
			let clone: ZvoogChordMelody = JSON.parse(JSON.stringify(prog.progression[pidx])) as ZvoogChordMelody;
			prog.progression.push(clone);
			pidx++;
		}
		//console.log(progressionDuration(prog.progression));
	}
	repeatAllVoices(schedule: ZvoogSchedule, duration: ZvoogMeter) {
		//console.log('repeatAllVoices',duration,progressionDuration(schedule.harmony.progression));
		this.repeatProgression(schedule.harmony, duration);
		let midx = 0;
		while (meterMore(scheduleDuration(schedule.measures), duration) < 0) {
			let clone: ZvoogMeasure = JSON.parse(JSON.stringify(schedule.measures[midx])) as ZvoogMeasure;
			schedule.measures.push(clone);

			for (let t = 0; t < schedule.tracks.length; t++) {
				let track = schedule.tracks[t];
				for (let s = 0; s < track.voices.length; s++) {
					let voice = track.voices[s];

					if (midx < voice.measureChords.length) {
						let chordclone: ZvoogMeasureChord = JSON.parse(JSON.stringify(voice.measureChords[midx])) as ZvoogMeasureChord;
						voice.measureChords.push(chordclone);

					}
				}
			}
			midx++;
		}
		//this.repeatProgression(schedule.harmony, duration);
		//console.log('repeatAllVoices done',progressionDuration(schedule.harmony.progression));
	}

	//extractMode
	chordSymbol(absolutestep: number): string {
		let absstep = absolutestep % 12;
		if (absstep == 0) return 'C';
		if (absstep == 1) return 'C#';
		if (absstep == 2) return 'D';
		if (absstep == 3) return 'D#';
		if (absstep == 4) return 'E';
		if (absstep == 5) return 'F';
		if (absstep == 6) return 'F#';
		if (absstep == 7) return 'G';
		if (absstep == 8) return 'G#';
		if (absstep == 9) return 'A';
		if (absstep == 10) return 'A#';
		if (absstep == 11) return 'B';
		return '?';
	}
	notInCount(base: number, modesteps: number[], progsteps: number[]): number {
		let cnt = 0;
		for (var i = 0; i < progsteps.length; i++) {
			var nn = progsteps[i];
			for (var k = 0; k < modesteps.length; k++) {
				let modehalftones = (base + modesteps[k]) % 12;
				if (nn == modehalftones) {
					cnt++;
					break;
				}
			}
		}
		return (progsteps.length - cnt) / progsteps.length;
	}
	addNewArrEl(arr: number[], el: number): void {
		for (var t = 0; t < arr.length; t++) {
			if (arr[t] == el) {
				return;
			}
		}
		arr.push(el);
	}
	calculateChordDiff(base: number, chordLine: string, scaleMode: IntervalMode): number {
		let chords = chordLine.split('-');
		let steps: number[] = [];
		for (var i = 0; i < chords.length; i++) {
			var pianokeys = this.pianoKeysByName(chords[i]);
			for (var k = 0; k < pianokeys.length; k++) {
				this.addNewArrEl(steps, pianokeys[k] % 12);
			}
		}
		var cnt = this.notInCount(base, scaleMode.steps, steps);
		return cnt;
	}
	calculateChordDiffFromArray(base: number, chords: { name: string, count: number }[], scaleMode: IntervalMode): number {
		let steps: number[] = [];
		for (var i = 0; i < chords.length; i++) {
			var pianokeys = this.pianoKeysByName(chords[i].name);
			for (var k = 0; k < pianokeys.length; k++) {
				this.addNewArrEl(steps, pianokeys[k] % 12);
			}
		}
		var cnt = this.notInCount(base, scaleMode.steps, steps);
		return cnt;
	}
	progIncludesChord(chords: string[], symbol: string): boolean {
		let symHL = this.chordAbsoluteHalftones(symbol);
		for (var i = 0; i < chords.length; i++) {
			var chHL = this.chordAbsoluteHalftones(chords[i]);
			if (symHL == chHL) {
				return true;
			}
		}
		return false;
	}
	progArrayIncludesChord(chords: { name: string, count: number }[], symbol: string): boolean {
		let symHL = this.chordAbsoluteHalftones(symbol);
		for (var i = 0; i < chords.length; i++) {
			var chHL = this.chordAbsoluteHalftones(chords[i].name);
			if (symHL == chHL) {
				return true;
			}
		}
		return false;
	}
	stepSymbol(chordName: string, stepNum: number): string {
		var start = 1;
		if (chordName.substr(1, 1) == '#') {
			start++;
		}
		if (chordName.substr(1, 1) == 'b') {
			start++;
		}

		if (chordName.substr(start, 1) == 'm' && chordName.substr(start + 1, 1) != 'a') {
			if (stepNum == 0) return 'i';
			if (stepNum == 1) return 'ii';
			if (stepNum == 2) return 'iii';
			if (stepNum == 3) return 'iv';
			if (stepNum == 4) return 'v';
			if (stepNum == 5) return 'vi';
			if (stepNum == 6) return 'vii';
		} else {
			if (stepNum == 0) return 'I';
			if (stepNum == 1) return 'II';
			if (stepNum == 2) return 'III';
			if (stepNum == 3) return 'IV';
			if (stepNum == 4) return 'V';
			if (stepNum == 5) return 'VI';
			if (stepNum == 6) return 'VII';
		}
		return '?';
	}
	stepProg(pi: number, chords: string[]): string {
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
	}
	stepArrProg(pitchHalfTone: number, chords: { name: string, count: number }[]): string {
		var stepLine = ''; + pitchHalfTone + ': ' + this.chordSymbol(pitchHalfTone) + ': ';
		var dlmtr = '';
		var stepSymb = '';
		for (var k = 0; k < chords.length; k++) {
			var stepNum = this.chordStepDifference(this.chordSymbol(pitchHalfTone), chords[k].name);
			if (this.stepSymbol(chords[k].name, stepNum) != stepSymb) {
				stepSymb = this.stepSymbol(chords[k].name, stepNum);
				stepLine = stepLine + dlmtr + chords[k].name+':'+chords[k].count;
				//stepLine = stepLine + dlmtr + stepSymb;
				dlmtr = '-';
			}
		}
		return stepLine;
	}
	extractMode(chordLine: string): ProgDescript {//'Am-G-D'

		let chords = chordLine.split('-');
		let pitches: { pitch: number, count: number }[] = [];
		for (let ii = 0; ii < chords.length; ii++) {

			let keys = this.pianoKeysByName(chords[ii]);
			for (let kk = 0; kk < keys.length; kk++) {
				let ikey = keys[kk] % 12;
				let foundIdx = -1;
				for (let pp = 0; pp < pitches.length; pp++) {
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

		let rates: ProgDescript[] = [];
		for (var pi = 0; pi < 12; pi++) {
			for (var mn = 0; mn < scaleModes.length; mn++) {
				var mode = scaleModes[mn];
				var base = pi;
				var ra = this.calculateChordDiff(base, chordLine, mode);
				if (this.progIncludesChord(chords, this.chordSymbol(base))) {

					rates.push({
						rate: ra, name: this.chordSymbol(base), mode: mode.name
						, priority: mode.priority, steps: this.stepProg(base, chords)
					});
				}

			}
		}
		rates.sort(function (a, b) {
			return (a.rate * 1000 + 7 - a.priority) - (b.rate * 1000 + 7 - b.priority);
		});
		console.log('extractMode', chordLine, rates);
		return rates[0];
	}
	calculateProgressionMode(chordMelody: ZvoogChordMelody[]): ProgDescript {
		//console.log('calculateProgressionMode', chordMelody);
		let counts: { name: string, count: number }[] = [];
		let chords: string[] = [];
		for (var i = 0; i < chordMelody.length; i++) {
			let found = counts.filter(function (one) {
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
		let pitches: { pitch: number, count: number }[] = [];
		for (let ii = 0; ii < counts.length; ii++) {

			let keys = this.pianoKeysByName(counts[ii].name);
			for (let kk = 0; kk < keys.length; kk++) {
				let ikey = keys[kk] % 12;
				let foundIdx = -1;
				for (let pp = 0; pp < pitches.length; pp++) {
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
		let rates: ProgDescript[] = [];
		for (var pi = 0; pi < 12; pi++) {
			for (var mn = 0; mn < scaleModes.length; mn++) {
				var mode = scaleModes[mn];
				var base = pi;
				var ra = this.calculateChordDiffFromArray(base, counts, mode);
				if (this.progArrayIncludesChord(counts, this.chordSymbol(base))) {

					let priorityCount = 0;
					for (let cc = 0; cc < counts.length; cc++) {
						if (this.chordAbsoluteHalftones(counts[cc].name) == base) {
							priorityCount = counts[cc].count;
							break;
						}
					}

					rates.push({
						rate: ra, name: this.chordSymbol(base), mode: mode.name
						, priority: priorityCount, steps: this.stepProg(base, chords)
						//this.stepArrProg(base, counts)
					});
				}

			}
		}
		rates.sort(function (a, b) {
			return (a.rate * 1000 + 7 - a.priority) - (b.rate * 1000 + 7 - b.priority);
		});
		let upper = rates.filter(function (one) {
			return one.rate == rates[0].rate && one.priority == rates[0].priority;
		});
		upper.sort(function (a, b) {
			return a.steps.localeCompare(b.steps);
		});
		console.log('calculateProgressionMode', rates,upper[0]);
		return upper[0];
	}

}
