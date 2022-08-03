declare function WebAudioFontPlayer(): void;
class WAFPercSource implements ZvoogSource {
	out: GainNode;
	params: ZvoogAudioParam[];
	audioContext: AudioContext;
	poll: { node: OscillatorNode, end: number }[];
	ins: number = 0;
	zones: any;
	lockedState = new ZvoogPluginLock();
	state(): ZvoogPluginLock {
		return this.lockedState;
	}

	cancelSchedule(): void {
		(window as any).wafPlayer.cancelQueue(this.audioContext);
	}
	addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void {
		//if (this.busy()==0) {
		for (let i = 0; i < chord.length; i++) {
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
				, this.out, this.zones, when, envelope.pitches[0].pitch, duration, 0.55, slides);
		}
		//}
	}
	prepare(audioContext: AudioContext, data: string): void {
		if (this.out) {
			//
		} else {
			this.out = audioContext.createGain();
			this.params = [];
			this.poll = [];
			this.audioContext = audioContext;
			this.initWAF();
		}
		this.ins = parseInt(data);
		this.selectDrum(this.ins);
	}
	getOutput(): AudioNode {
		return this.out;
	}
	getParams(): ZvoogAudioParam[] {
		return this.params;
	}
	busy(): number {
		if (this.zones) {
			if (this.zones.zones) {
				for (var i = 0; i < this.zones.zones.length; i++) {
					if (this.zones.zones[i].buffer) {
						//
					} else {
						return 1;
					}
				}
				return 0;
			} else {
				return 1;
			}
		} else {
			return 1;
		}
	}
	//constructor(insNum: number) {
	//	this.ins = insNum;
	//}
	initWAF() {
		if (!((window as any).wafPlayer)) {
			(window as any).wafPlayer = new WebAudioFontPlayer();
		}
	}
	selectDrum(nn: number): void {
		let me = this;
		let info = (window as any).wafPlayer.loader.drumInfo(nn);
		(window as any).wafPlayer.loader.startLoad(this.audioContext, info.url, info.variable);
		(window as any).wafPlayer.loader.waitLoad(function () {
			me.zones = window[info.variable];
		});
	}
}