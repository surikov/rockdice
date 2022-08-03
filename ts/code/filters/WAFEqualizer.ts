class WAFEqualizer implements ZvoogEffect {
	inpt: GainNode;
	outpt: GainNode;
	chnl: any;
	params: ZvoogAudioParam[];
	lockedState = new ZvoogPluginLock();
	state(): ZvoogPluginLock {
		return this.lockedState;
	}

	prepare(audioContext: AudioContext, data: string): void {
		if (this.inpt) {
			//
		} else {
			this.inpt = audioContext.createGain();
			this.outpt = audioContext.createGain();
			this.params = [];
			this.initWAF();
			this.chnl = (window as any).wafPlayer.createChannel(audioContext);
			this.params.push(new RangedAudioParam120(((this.chnl.band32.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band64.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band128.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band256.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band512.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band1k.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band2k.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band4k.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band8k.gain as any) as ZvoogAudioParam), -10, 10));
			this.params.push(new RangedAudioParam120(((this.chnl.band16k.gain as any) as ZvoogAudioParam), -10, 10));
		}
		this.inpt.connect(this.chnl.input);
		this.chnl.output.connect(this.outpt);
	}
	getInput(): AudioNode {
		return this.inpt;
	}
	getOutput(): AudioNode {
		return this.outpt;
	}
	getParams(): ZvoogAudioParam[] {
		return this.params;
	}

	busy(): number {
		return 0;
	}
	initWAF() {
		if (!((window as any).wafPlayer)) {
			(window as any).wafPlayer = new WebAudioFontPlayer();
		}
	}
}
