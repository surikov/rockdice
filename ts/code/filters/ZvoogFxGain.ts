class ZvoogFxGain implements ZvoogEffect {
	base: GainNode;
	params: ZvoogAudioParam[];
	lockedState = new ZvoogPluginLock();
	state(): ZvoogPluginLock {
		return this.lockedState;
	}

	prepare(audioContext: AudioContext, data: string): void {
		if (this.base) {
			//
		} else {
			this.base = audioContext.createGain();
			this.params = [];
			//this.params.push((this.base.gain as any) as ZvoogAudioParam);
			this.params.push(new RangedAudioParam120(((this.base.gain as any) as ZvoogAudioParam), 0, 1));
		}
	}
	getInput(): AudioNode {
		return this.base;
	}
	getOutput(): AudioNode {
		return this.base;
	}
	getParams(): ZvoogAudioParam[] {
		return this.params;
	}

	busy(): number {
		return 0;
	}
}
