class ZvoogSineSource implements ZvoogSource {
	out: GainNode;
	params: ZvoogAudioParam[];
	audioContext: AudioContext;
	poll: { node: OscillatorNode, end: number }[];
	lockedState = new ZvoogPluginLock();
	state(): ZvoogPluginLock {
		return this.lockedState;
	}

	prepare(audioContext: AudioContext, data: string): void {
		if (this.out) {
			//
		} else {
			this.out = audioContext.createGain();
			this.params = [];
			this.poll = [];
			this.audioContext = audioContext;
		}
	}
	getOutput(): AudioNode {
		return this.out;
	}
	getParams(): ZvoogAudioParam[] {
		return this.params;
	}
	cancelSchedule(): void {
		for (let i = 0; i < this.poll.length; i++) {
			this.poll[i].node.stop();
		}
	}
	addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void {
		this.cleanup();
		for (let i = 0; i < chord.length; i++) {
			this.sendLine(when, tempo, chord[i]);
		}
	}
	sendLine(when: number, tempo: number, line: ZvoogEnvelope): void {
		//console.log('sendLine',when,tempo,line);
		let oscillator = this.audioContext.createOscillator();
		oscillator.type = 'sine';
		let seconds = duration2seconds(tempo, duration384(line.pitches[0].duration));
		//console.log('start',when,line.pitches[0].pitch);
		oscillator.frequency.setValueAtTime(this.freq(line.pitches[0].pitch), when);
		let nextPointSeconds = when + seconds;
		for (let i = 1; i < line.pitches.length; i++) {
			let seconds = duration2seconds(tempo, duration384(line.pitches[i].duration));
			oscillator.frequency.linearRampToValueAtTime(this.freq(line.pitches[i].pitch), nextPointSeconds);
			//console.log('change',nextPointSeconds,line.pitches[i].pitch);
			nextPointSeconds = nextPointSeconds + seconds;
		}
		oscillator.connect(this.out);
		oscillator.start(when);
		oscillator.stop(nextPointSeconds);
		//console.log('sine',when,nextPointSeconds);
		this.poll.push({ node: oscillator, end: nextPointSeconds });
	}
	busy(): number {
		return 0;
	}
	freq(key: number): number {
		let O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
		let half = Math.floor(key % 12);
		let octave = Math.floor(key / 12);
		let freq0 = O4[half] / (2 * 2 * 2 * 2);
		return freq0 * Math.pow(2, octave);
	}
	nextClear(): boolean {
		for (let i = 0; i < this.poll.length; i++) {
			if (this.poll[i].end < this.audioContext.currentTime) {
				try {
					this.poll[i].node.stop();
					this.poll[i].node.disconnect();
				} catch (x) {
					console.log(x);
				}
				this.poll.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	cleanup(): void {
		while (this.nextClear()) {
			//
		};
	}


}