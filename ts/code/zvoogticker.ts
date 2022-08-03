class ZvoogTicker {
	onAir: boolean = false;
	scheduleDefinition: ZvoogSchedule;
	audioContext: AudioContext;
	scheduledPosition: number = 0;
	scheduledTick: number = 0;
	defTickDuration: number = 0.25;
	masterNode: AudioNode;
	watcher: (position: number) => void = () => { };
	setParamCurve(measureStarts: number[], fxParam: ZvoogAudioParam, curve: ZvoogAudioParameter, nextAudioTime: number, nextPositionTime: number, tickDuration: number) {
		let pointStarts = this.calculateParamPointStarts(curve, measureStarts);
		for (let p = 0; p < pointStarts.length; p++) {
			if (pointStarts[p] > nextPositionTime && pointStarts[p] <= nextPositionTime + tickDuration) {
				let when = nextAudioTime + pointStarts[p] - nextPositionTime;
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
	}
	calculateParamPointStarts(curve: ZvoogAudioParameter, measureStarts: number[]): number[] {
		let times: number[] = [];
		let curMeasureNum = curve.points[0].skipMeasures;
		let curSkip384 = curve.points[0].skip384;
		let t: number = measureStarts[curMeasureNum] + duration2seconds(this.scheduleDefinition.measures[curMeasureNum].tempo, curSkip384);
		times.push(t);
		for (let i = 1; i < curve.points.length; i++) {
			let p: ZvoogCurvePoint = curve.points[i];
			if (p.skipMeasures) {
				curSkip384 = 0;
				curMeasureNum = curMeasureNum + p.skipMeasures;
			} else {
				curSkip384 = curSkip384 + p.skip384;
			}
			let t: number = measureStarts[curMeasureNum] + duration2seconds(this.scheduleDefinition.measures[curMeasureNum].tempo, curSkip384);
			times.push(t);
		}
		return times;
	}
	calculateMeasureStarts(): number[] {
		let times: number[] = [];
		let t: number = 0;
		times.push(0);
		for (let m = 0; m < this.scheduleDefinition.measures.length; m++) {
			let measure: ZvoogMeasure = this.scheduleDefinition.measures[m];
			let measureSeconds = duration2seconds(measure.tempo, duration384(measure.meter));
			t = t + measureSeconds;
			times.push(t);
		}
		return times;
	}
	restartParamCurve(measureStarts: number[], fxParam: ZvoogAudioParam, curve: ZvoogAudioParameter, nextAudioTime: number, nextPositionTime: number, tickDuration: number) {
		let pointStarts = this.calculateParamPointStarts(curve, measureStarts);
		//console.log('restartParamCurve', nextAudioTime, pointStarts);
		fxParam.cancelScheduledValues(nextAudioTime);
		for (let p = 0; p < pointStarts.length; p++) {
			if (pointStarts[p] >= nextPositionTime) {
				if (pointStarts[p] == nextPositionTime) {
					fxParam.setValueAtTime(curve.points[p].velocity, nextAudioTime);
					//console.log(nextAudioTime, 'exact', curve.points[p].velocity);
					if (p + 1 < pointStarts.length) {
						let when = nextAudioTime + pointStarts[p + 1] - nextPositionTime;
						//console.log(nextAudioTime, 'nxt', when, curve.points[p + 1].velocity);
						fxParam.linearRampToValueAtTime(curve.points[p + 1].velocity, when - 0.000001);
					}
				} else {
					if (p > 0) {
						let startSeconds = pointStarts[p - 1];
						let startVelocity = curve.points[p - 1].velocity;
						let velodiff = curve.points[p].velocity - startVelocity;
						let timediff = pointStarts[p] - startSeconds;
						let fromVelocity = (nextPositionTime - startSeconds) * velodiff / timediff;
						fxParam.setValueAtTime(fromVelocity, nextAudioTime);
						let when = nextAudioTime + pointStarts[p] - nextPositionTime;
						fxParam.linearRampToValueAtTime(curve.points[p].velocity, when - 0.000001);
						//console.log(nextAudioTime, 'cut', fromVelocity, 'to', curve.points[p].velocity, 'at', when);
					} else {
						fxParam.setValueAtTime(0, nextAudioTime);
						let when = nextAudioTime + pointStarts[p] - nextPositionTime;
						fxParam.linearRampToValueAtTime(curve.points[p].velocity, when - 0.000001);
						//console.log(nextAudioTime, 'from zero', nextAudioTime, curve.points[p].velocity, when);
					}
				}
				break;
			}
		}
	}
	setEffectParameters(measureStarts: number[], fx: ZvoogAudioEffect, nextAudioTime: number, nextPositionTime: number, tickDuration: number) {
		if (fx.pluginEffect) {
			let audioParams: ZvoogAudioParam[] = fx.pluginEffect.getParams();
			for (let i = 0; i < audioParams.length; i++) {
				let fxParam: ZvoogAudioParam = audioParams[i];
				if (fx.parameters.length > i) {
					let curve: ZvoogAudioParameter = fx.parameters[i];
					//console.log('setEffectParameters',curve);
					this.setParamCurve(measureStarts, fxParam, curve, nextAudioTime, nextPositionTime, tickDuration);
				}
			}
		}
	}
	restartEffectParameters(measureStarts: number[], fx: ZvoogAudioEffect, nextAudioTime: number, nextPositionTime: number, tickDuration: number) {
		if (fx.pluginEffect) {
			let audioParams: ZvoogAudioParam[] = fx.pluginEffect.getParams();
			for (let i = 0; i < audioParams.length; i++) {
				let fxParam: ZvoogAudioParam = audioParams[i];
				if (fx.parameters.length > i) {
					let curve: ZvoogAudioParameter = fx.parameters[i];
					//console.log('restartEffectParameters',curve);
					this.restartParamCurve(measureStarts, fxParam, curve, nextAudioTime, nextPositionTime, tickDuration);
				}
			}
		}
	}
	ready(): boolean {
		for (let i = 0; i < this.scheduleDefinition.effects.length; i++) {
			let pluginEffect = this.scheduleDefinition.effects[i].pluginEffect;
			if (pluginEffect) {
				let busy: number = pluginEffect.busy();
				if (busy > 0) {
					console.log('master', i, 'is', busy);
					return false;
				}
			}
		}
		for (let k = 0; k < this.scheduleDefinition.tracks.length; k++) {
			let track: ZvoogTrack = this.scheduleDefinition.tracks[k];
			for (let i = 0; i < track.effects.length; i++) {
				let pluginEffect = track.effects[i].pluginEffect;
				if (pluginEffect) {
					let busy: number = pluginEffect.busy();
					if (busy > 0) {
						console.log('not ready track', k, 'fx', i, 'is', busy);
						return false;
					}
				}
			}
			for (let s = 0; s < track.voices.length; s++) {
				let voice: ZvoogVoice = track.voices[s];
				let pluginSource = voice.source.pluginSource;
				if (pluginSource) {
					let busy: number = pluginSource.busy();
					if (busy > 0) {
						console.log('not ready track', k, 'voice', s, voice.title, 'source is', busy);
						return false;
					}
				}
				for (let f = 0; f < voice.effects.length; f++) {
					let pluginEffect = voice.effects[f].pluginEffect;
					if (pluginEffect) {
						let busy: number = pluginEffect.busy();
						if (busy > 0) {
							console.log('not ready track', k, 'voice', s, voice.title, 'fx', f, 'is', busy);
							return false;
						}
					}
				}
			}
		}
		return true;
	}
	sendAll(measureStarts: number[], nextAudioTime: number, nextPositionTime: number, tickDuration: number) {
		this.sendKeys(nextAudioTime, nextPositionTime, tickDuration);
		this.sendParams(measureStarts, nextAudioTime, nextPositionTime, tickDuration);
		this.scheduledPosition = nextPositionTime;
	}

	sendKeys(nextAudioTime: number, nextPositionTime: number, tickDuration: number) {
		let t = 0;
		for (let m = 0; m < this.scheduleDefinition.measures.length; m++) {
			let measure: ZvoogMeasure = this.scheduleDefinition.measures[m];
			let measureSeconds = duration2seconds(measure.tempo, duration384(measure.meter));
			if (nextPositionTime < t + measureSeconds && nextPositionTime + tickDuration >= t) {
				for (let i = 0; i < this.scheduleDefinition.tracks.length; i++) {
					let track: ZvoogTrack = this.scheduleDefinition.tracks[i];
					for (let v = 0; v < track.voices.length; v++) {
						let voice: ZvoogVoice = track.voices[v];
						if (voice.measureChords) {
							let measureChords: ZvoogMeasureChord[] = voice.measureChords;
							if (measureChords.length > m && (measureChords[m])) {
								let keyChords: ZvoogMeasureChord = measureChords[m];
								if (keyChords) {
									for (let k = 0; k < keyChords.chords.length; k++) {
										let chord: ZvoogChord = keyChords.chords[k];
										let chordSeconds = duration2seconds(measure.tempo, duration384(chord.when));
										if (t + chordSeconds >= nextPositionTime && t + chordSeconds < nextPositionTime + tickDuration) {
											let chordPosTime = t + chordSeconds;
											//console.log(chord.envelopes);
											if (chord.envelopes.length > 0) {
												if (voice.source.pluginSource) {
													//console.log(voice.source.pluginSource.busy());
													if (voice.source.pluginSource.busy() == 0) {
														voice.source.pluginSource.addSchedule(
															nextAudioTime + chordPosTime - nextPositionTime
															, measure.tempo
															, chord.envelopes
															, chord.variation
														);
													}else{
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
	}
	sendParams(measureStarts: number[], nextAudioTime: number, nextPositionTime: number, tickDuration: number) {
		for (let i = 0; i < this.scheduleDefinition.effects.length; i++) {
			this.setEffectParameters(measureStarts, this.scheduleDefinition.effects[i], nextAudioTime, nextPositionTime, tickDuration);
		}
		for (let k = 0; k < this.scheduleDefinition.tracks.length; k++) {
			let track: ZvoogTrack = this.scheduleDefinition.tracks[k];
			for (let i = 0; i < track.effects.length; i++) {
				this.setEffectParameters(measureStarts, track.effects[i], nextAudioTime, nextPositionTime, tickDuration);
			}
			for (let v = 0; v < track.voices.length; v++) {
				let voice: ZvoogVoice = track.voices[v];
				for (let k = 0; k < voice.effects.length; k++) {
					this.setEffectParameters(measureStarts, voice.effects[k], nextAudioTime, nextPositionTime, tickDuration);
				}
			}
		}
	}
	restartParams(measureStarts: number[], nextAudioTime: number, nextPositionTime: number, tickDuration: number) {
		for (let i = 0; i < this.scheduleDefinition.effects.length; i++) {
			this.restartEffectParameters(measureStarts, this.scheduleDefinition.effects[i], nextAudioTime, nextPositionTime, tickDuration);
		}
		for (let k = 0; k < this.scheduleDefinition.tracks.length; k++) {
			let track: ZvoogTrack = this.scheduleDefinition.tracks[k];
			for (let i = 0; i < track.effects.length; i++) {
				this.restartEffectParameters(measureStarts, track.effects[i], nextAudioTime, nextPositionTime, tickDuration);
			}
			for (let v = 0; v < track.voices.length; v++) {
				let voice: ZvoogVoice = track.voices[v];
				for (let k = 0; k < voice.effects.length; k++) {
					this.restartEffectParameters(measureStarts, voice.effects[k], nextAudioTime, nextPositionTime, tickDuration);
				}
			}
		}
	}
	scheduleNext(measureStarts: number[], nextAudioTime: number, nextPositionTime: number, loopStart: number, loopDuration: number, tickDuration: number) {
		if (nextPositionTime + tickDuration > loopStart + loopDuration) {
			let t1 = (loopStart + loopDuration) - nextPositionTime;
			let t2 = (nextPositionTime + tickDuration) - loopDuration - loopStart;
			this.sendAll(measureStarts, nextAudioTime, nextPositionTime, t1);
			this.restartParams(measureStarts, nextAudioTime + t1, loopStart, t2);
			this.sendAll(measureStarts, nextAudioTime + t1, loopStart, t2);
		} else {
			this.sendAll(measureStarts, nextAudioTime, nextPositionTime, tickDuration);
		}
		//console.log(nextPositionTime);
		this.watcher(nextPositionTime);
	}
	waitNextPositionTime: number = 0;
	tick(me: ZvoogTicker, nextPositionTime: number, loopStart: number, loopDuration: number, nextAudioTime: number, tickDuration: number): void {

		if (me.onAir) {
			let a = nextAudioTime;
			let p = nextPositionTime;
			if (this.audioContext.currentTime + tickDuration > nextAudioTime) {
				let measureStarts: number[] = this.calculateMeasureStarts();
				this.scheduleNext(measureStarts, nextAudioTime, nextPositionTime, loopStart, loopDuration, tickDuration);
				a = nextAudioTime + tickDuration;
				if (a < this.audioContext.currentTime) {
					a = this.audioContext.currentTime;
				}
				p = nextPositionTime + tickDuration;
				while (p > loopStart + loopDuration) {
					p = p - loopDuration;
				}
			}
			this.scheduledTick = window.requestAnimationFrame(function (t) {
				me.waitNextPositionTime = p;
				me.tick(me, p, loopStart, loopDuration, a, tickDuration);
			});
		}
		else {
			this.cancel();
		}
	}
	cancel() {
		window.cancelAnimationFrame(this.scheduledTick);
		for (let t = 0; t < this.scheduleDefinition.tracks.length; t++) {
			let track: ZvoogTrack = this.scheduleDefinition.tracks[t];
			for (let i = 0; i < track.voices.length; i++) {
				let voice: ZvoogVoice = track.voices[i];
				let pluginSource = voice.source.pluginSource;
				if (pluginSource) {
					pluginSource.cancelSchedule();
				}
				for (let f = 0; f < voice.effects.length; f++) {
					let pluginEffect = voice.effects[f].pluginEffect;
					if (pluginEffect) {
						let fx: ZvoogAudioParam[] = pluginEffect.getParams();
						for (let p = 0; p < fx.length; p++) {
							fx[p].cancelScheduledValues(0);
						}
					}
				}
			}
			for (let f = 0; f < track.effects.length; f++) {
				let pluginEffect = track.effects[f].pluginEffect;
				if (pluginEffect) {
					let fx: ZvoogAudioParam[] = pluginEffect.getParams();
					for (let p = 0; p < fx.length; p++) {
						fx[p].cancelScheduledValues(0);
					}
				}
			}
		}
		for (let f = 0; f < this.scheduleDefinition.effects.length; f++) {
			let pluginEffect = this.scheduleDefinition.effects[f].pluginEffect;
			if (pluginEffect) {
				let fx: ZvoogAudioParam[] = pluginEffect.getParams();
				for (let p = 0; p < fx.length; p++) {
					fx[p].cancelScheduledValues(0);
				}
			}
		}
	}
	restart() {
		if (this.onAir) {
			this.cancel();
			let nextAudioTime: number = this.audioContext.currentTime;
			let measureStarts: number[] = this.calculateMeasureStarts();
			let tickDuration = this.defTickDuration;
			this.restartParams(measureStarts, nextAudioTime, 0, tickDuration);
			this.tick(this, this.waitNextPositionTime, this.waitLoopStart, this.waitLoopDuration, nextAudioTime, tickDuration);
		}
	}
	waitLoopStart = 0;
	waitLoopDuration = 0;
	start(nextPositionTime: number, loopStart: number, loopDuration: number): boolean {
		if (this.onAir) {
			//console.log('skip start');
			return false;
		}
		let tickDuration = this.defTickDuration;
		if (tickDuration < loopDuration) {
			this.onAir = true;
			let nextAudioTime: number = this.audioContext.currentTime;
			let measureStarts: number[] = this.calculateMeasureStarts();
			this.restartParams(measureStarts, nextAudioTime, nextPositionTime, tickDuration);
			this.waitLoopStart = loopStart;
			this.waitLoopDuration = loopDuration;
			this.tick(this, nextPositionTime, loopStart, loopDuration, nextAudioTime, tickDuration);
		}
		return true;
	}
	stop(): void {
		this.onAir = false;
		this.cancel();
	}
	unconnectVoice(voice: ZvoogVoice): void {
		//console.log('unconncetVoice', voice.title);
		let pluginSource = voice.source.pluginSource;
		if (pluginSource) {
			pluginSource.getOutput().disconnect();
			pluginSource.state().unlock();
			for (let i = 0; i < voice.effects.length; i++) {
				let pluginEffect = voice.effects[i].pluginEffect;
				if (pluginEffect) {
					pluginEffect.getOutput().disconnect();
					pluginEffect.getInput().disconnect();
					//console.log('disconnect', i);
					pluginEffect.state().unlock();
				} else {
					//console.log('skip disconnect', i);
				}
				voice.effects[i].pluginEffect = null;
			}
			//console.log('unconncetVoice', voice.title);
		} else {
			//console.log('skip unconncetVoice', voice.title);
		}
		voice.source.pluginSource = null;
	}

	connectVoice(voice: ZvoogVoice, track: ZvoogTrack): void {
		if (!(voice.source.pluginSource)) {
			voice.source.pluginSource
				= createPluginSource(voice.source.kind
					//, voice.source.initial
				);
		}
		let pluginSource = voice.source.pluginSource;
		if (pluginSource) {
			pluginSource.prepare(this.audioContext, voice.source.initial);
			let voiceNode: AudioNode = pluginSource.getOutput();
			for (let i = 0; i < voice.effects.length; i++) {
				if (!(voice.effects[i].pluginEffect)) {
					voice.effects[i].pluginEffect
						= createPluginEffect(voice.effects[i].kind
							//, voice.effects[i].initial
						);
				}
				let pluginEffect = voice.effects[i].pluginEffect;
				if (pluginEffect) {
					pluginEffect.prepare(this.audioContext, voice.effects[i].initial);
					voiceNode.connect(pluginEffect.getInput());
					voiceNode = pluginEffect.getOutput();
					//console.log('connect track', track, 'voice', s, 'effect', i);
				}
			}
			let target: AudioNode;
			if (track.effects.length > 0) {
				let pluginEffect = track.effects[0].pluginEffect;
				if (pluginEffect) {
					target = pluginEffect.getOutput();
				} else {
					target = this.masterNode;
				}
			} else {
				target = this.masterNode;
			}
			voiceNode.connect(target);
			//console.log('connectVoice', voice.title);
		} else {
			//console.log('skip connectVoice', voice.title);
		}
	}
	connectTrack(track: ZvoogTrack) {
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
		let trackNode: AudioNode | null = null;
		for (let i = 0; i < track.effects.length; i++) {
			if (!(track.effects[i].pluginEffect)) {
				track.effects[i].pluginEffect
					= createPluginEffect(track.effects[i].kind
						//, track.effects[i].initial
					);
			}
			let pluginEffect = track.effects[i].pluginEffect;
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

		for (let s = 0; s < track.voices.length; s++) {
			let voice: ZvoogVoice = track.voices[s];
			this.connectVoice(voice, track);
		}
		//console.log('connect track', track, 'to master');
	}
	preDestinationNode: AudioNode;// = this.masterNode;
	prepareProject(project: ZvoogSchedule, audioCtxt: AudioContext, target: AudioNode) {
		this.scheduleDefinition = project;
		this.audioContext = audioCtxt;
		this.masterNode = this.audioContext.createGain();
		//let currentNode: AudioNode = this.masterNode;
		this.preDestinationNode = this.masterNode;
		for (let i = 0; i < this.scheduleDefinition.effects.length; i++) {
			if (!(this.scheduleDefinition.effects[i].pluginEffect)) {
				this.scheduleDefinition.effects[i].pluginEffect
					= createPluginEffect(this.scheduleDefinition.effects[i].kind
						//, this.scheduleDefinition.effects[i].initial
					);
			}
			let pluginEffect = this.scheduleDefinition.effects[i].pluginEffect;
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
		for (let t = 0; t < this.scheduleDefinition.tracks.length; t++) {
			let track: ZvoogTrack = this.scheduleDefinition.tracks[t];
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
	}
	unconnectAllVoices(track: ZvoogTrack) {
		for (let v = 0; v < track.voices.length; v++) {
			let voice = track.voices[v];
			this.unconnectVoice(voice);
		}
		track.voices = [];
	}
};