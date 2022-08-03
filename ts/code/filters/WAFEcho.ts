class WAFEcho implements ZvoogEffect {
	inpt: GainNode;
	outpt: GainNode;
	rvrbrtr: any;
	params: ZvoogAudioParam[];
	lockedState = new ZvoogPluginLock();
	state(): ZvoogPluginLock {
		return this.lockedState;
	}
	setData(data: string): void {

	}
	prepare(audioContext: AudioContext, data: string): void {
		if (this.inpt) {
			//
		} else {
			let me = this;
			this.inpt = audioContext.createGain();
			this.outpt = audioContext.createGain();
			this.params = [];
			this.initWAF();
			this.rvrbrtr = (window as any).wafPlayer.createReverberator(audioContext);

			this.params.push(new RangedAudioParam120(((this.rvrbrtr.wet.gain as any) as ZvoogAudioParam), 0, 1));
			this.params.push(new RangedAudioParam120(((this.rvrbrtr.compressor.threshold as any) as ZvoogAudioParam), -100, 0));
			this.params.push(new RangedAudioParam120(((this.rvrbrtr.compressor.knee as any) as ZvoogAudioParam), 0, 40));
			this.params.push(new RangedAudioParam120(((this.rvrbrtr.compressor.ratio as any) as ZvoogAudioParam), 2, 20));
			this.params.push(new RangedAudioParam120(((this.rvrbrtr.compressor.attack as any) as ZvoogAudioParam), 0, 1));
			this.params.push(new RangedAudioParam120(((this.rvrbrtr.compressor.release as any) as ZvoogAudioParam), 0, 1));
			//this.params=[];
			this.rvrbrtr.compressorDry.gain.setValueAtTime(1, 0);
			this.rvrbrtr.compressorWet.gain.setValueAtTime(0, 0);
			//console.log(this.rvrbrtr);
			this.params.push({
				cancelScheduledValues: (cancelTime: number): void => {
					me.rvrbrtr.compressorDry.gain.cancelScheduledValues(cancelTime);
					me.rvrbrtr.compressorWet.gain.cancelScheduledValues(cancelTime);
				}
				, linearRampToValueAtTime: (value: number, endTime: number): void => {
					let wet = value / 119;
					if (wet < 0) wet = 0;
					if (wet > 1) wet = 1;
					let dry = 1 - wet;
					me.rvrbrtr.compressorDry.gain.linearRampToValueAtTime(dry, endTime);
					me.rvrbrtr.compressorWet.gain.linearRampToValueAtTime(wet, endTime);
				}
				, setValueAtTime: (value: number, startTime: number): void => {

					let wet = value / 119;
					if (wet < 0) wet = 0;
					if (wet > 1) wet = 1;
					let dry = 1 - wet;
					//console.log('compression setValueAtTime',value,startTime,dry,wet);
					me.rvrbrtr.compressorDry.gain.setValueAtTime(dry, startTime);
					me.rvrbrtr.compressorWet.gain.setValueAtTime(wet, startTime);
				}
			});
		}
		this.inpt.connect(this.rvrbrtr.input);
		this.rvrbrtr.output.connect(this.outpt);
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
