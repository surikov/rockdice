/*type ZvoogValue = {
	data: string
	, label: string
	, hint: string
};*/
interface ZvoogAudioParam {
	cancelScheduledValues(cancelTime: number): void;
	linearRampToValueAtTime(value: number, endTime: number): void;
	setValueAtTime(value: number, startTime: number): void;
}
class RangedAudioParam120 implements ZvoogAudioParam {
	baseParam: ZvoogAudioParam;
	minValue: number;
	maxValue: number;
	constructor(base: ZvoogAudioParam, min: number, max: number) {
		this.baseParam = base;
		this.minValue = min;
		this.maxValue = max;
	}
	recalulate(value: number): number {
		if (value < 0) console.log('wrong 1-119', value);
		if (value < 0) value = 0;
		if (value > 119) value = 119;
		let ratio = (this.maxValue - this.minValue) / 119;
		let nn = this.minValue + value * ratio;
		//console.log('recalulate', value, 'min', this.minValue, 'max', this.maxValue, 'result', nn);
		return nn;
	}
	cancelScheduledValues(cancelTime: number): void {
		this.baseParam.cancelScheduledValues(cancelTime);
	}
	linearRampToValueAtTime(value: number, endTime: number): void {
		this.baseParam.linearRampToValueAtTime(this.recalulate(value), endTime);
	}
	setValueAtTime(value: number, startTime: number): void {
		this.baseParam.setValueAtTime(this.recalulate(value), startTime);
	}
}
interface ZvoogPlugin {
	//id(): string; //plugin id
	getParams(): ZvoogAudioParam[]; //parameters automation
	//, getValues: () => ZvoogValue[] //properties from UI
	getOutput(): AudioNode;
	prepare(audioContext: AudioContext, data: string): void;
	busy(): number;
	state(): ZvoogPluginLock;
	//setData(data:string):void;
}
type ZvoogEffect = ZvoogPlugin & {
	getInput: () => AudioNode

}
type ZvoogSource = ZvoogPlugin & {
	addSchedule: (when: number, tempo: number, envelopes: ZvoogEnvelope[], variation: number) => void
	, cancelSchedule: () => void
}
class ZvoogPluginLock {
	lockedState: boolean;
	lock(): void {
		this.lockedState = true;
	}
	unlock(): void {
		this.lockedState = false;
	}
	locked(): boolean {
		return this.lockedState;
	}
}
class ZvoogFilterSourceEmpty implements ZvoogSource, ZvoogEffect {
	base: GainNode;
	params: ZvoogAudioParam[];
	//values: ZvoogValue[];
	//ZvoogPlugin
	lockedState = new ZvoogPluginLock();
	setData(data: string): void {

	}
	state(): ZvoogPluginLock {
		return this.lockedState;
	}
	prepare(audioContext: AudioContext): void {
		if (this.base) {

		} else {
			this.base = audioContext.createGain();
		}
		this.params = [];
		//this.values = [];
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
	/*id(): string {
		return 'empty';
	}*/
	//getValues(): ZvoogValue[] {
	//	return this.values;
	//}
	//ZvoogPlugin
	cancelSchedule(): void {
		//
	}
	addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void {
		//
	}
	//ZvoogEffect
	getInput(): AudioNode {
		return this.base;
	}
}

let cachedFilterSourceEmptyPlugins: ZvoogFilterSourceEmpty[] = [];
function takeZvoogFilterSourceEmpty(): ZvoogFilterSourceEmpty {
	for (let i = 0; i < cachedFilterSourceEmptyPlugins.length; i++) {
		if (!cachedFilterSourceEmptyPlugins[i].state().locked()) {
			cachedFilterSourceEmptyPlugins[i].state().lock();
			return cachedFilterSourceEmptyPlugins[i];
		}
	}
	let plugin = new ZvoogFilterSourceEmpty();
	plugin.state().lock();
	cachedFilterSourceEmptyPlugins.push(plugin);
	return plugin;
}
let cachedWAFEchoPlugins: WAFEcho[] = [];
function takeWAFEcho(): WAFEcho {
	for (let i = 0; i < cachedWAFEchoPlugins.length; i++) {
		if (!cachedWAFEchoPlugins[i].state().locked()) {
			cachedWAFEchoPlugins[i].state().lock();
			return cachedWAFEchoPlugins[i];
		}
	}
	let plugin = new WAFEcho();
	plugin.state().lock();
	cachedWAFEchoPlugins.push(plugin);
	return plugin;
}
let cachedWAFEqualizerPlugins: WAFEqualizer[] = [];
function takeWAFEqualizer(): WAFEqualizer {
	for (let i = 0; i < cachedWAFEqualizerPlugins.length; i++) {
		if (!cachedWAFEqualizerPlugins[i].state().locked()) {
			cachedWAFEqualizerPlugins[i].state().lock();
			return cachedWAFEqualizerPlugins[i];
		}
	}
	let plugin = new WAFEqualizer();
	plugin.state().lock();
	cachedWAFEqualizerPlugins.push(plugin);
	return plugin;
}
let cachedZvoogFxGainPlugins: ZvoogFxGain[] = [];
function takeZvoogFxGain(): ZvoogFxGain {
	for (let i = 0; i < cachedZvoogFxGainPlugins.length; i++) {
		if (!cachedZvoogFxGainPlugins[i].state().locked()) {
			cachedZvoogFxGainPlugins[i].state().lock();
			return cachedZvoogFxGainPlugins[i];
		}
	}
	let plugin = new ZvoogFxGain();
	plugin.state().lock();
	cachedZvoogFxGainPlugins.push(plugin);
	return plugin;
}
let cachedAudioFileSourcePlugins: AudioFileSource[] = [];
function takeAudioFileSource(): AudioFileSource {
	for (let i = 0; i < cachedAudioFileSourcePlugins.length; i++) {
		if (!cachedAudioFileSourcePlugins[i].state().locked()) {
			cachedAudioFileSourcePlugins[i].state().lock();
			return cachedAudioFileSourcePlugins[i];
		}
	}
	let plugin = new AudioFileSource();//arr);
	plugin.state().lock();
	cachedAudioFileSourcePlugins.push(plugin);
	return plugin;
}
let cachedWAFInsSourcePlugins: WAFInsSource[] = [];
function takeWAFInsSource(): WAFInsSource {
	for (let i = 0; i < cachedWAFInsSourcePlugins.length; i++) {
		if (!cachedWAFInsSourcePlugins[i].state().locked()) {
			cachedWAFInsSourcePlugins[i].state().lock();
			return cachedWAFInsSourcePlugins[i];
		}
	}
	let plugin = new WAFInsSource();//parseInt(data));
	plugin.state().lock();
	cachedWAFInsSourcePlugins.push(plugin);
	return plugin;
}
let cachedWAFPercSourcePlugins: WAFPercSource[] = [];
function takeWAFPercSource(): WAFPercSource {
	for (let i = 0; i < cachedWAFPercSourcePlugins.length; i++) {
		if (!cachedWAFPercSourcePlugins[i].state().locked()) {
			cachedWAFPercSourcePlugins[i].state().lock();
			return cachedWAFPercSourcePlugins[i];
		}
	}
	let plugin = new WAFPercSource();//parseInt(data));
	plugin.state().lock();
	cachedWAFPercSourcePlugins.push(plugin);
	return plugin;
}
let cachedZvoogSineSourcePlugins: ZvoogSineSource[] = [];
function takeZvoogSineSource(): ZvoogSineSource {
	for (let i = 0; i < cachedZvoogSineSourcePlugins.length; i++) {
		if (!cachedZvoogSineSourcePlugins[i].state().locked()) {
			cachedZvoogSineSourcePlugins[i].state().lock();
			return cachedZvoogSineSourcePlugins[i];
		}
	}
	let plugin = new ZvoogSineSource();
	plugin.state().lock();
	cachedZvoogSineSourcePlugins.push(plugin);
	return plugin;
}
function createPluginEffect(id: string): ZvoogEffect {
	//console.log('createPluginEffect', id, cachedZvoogFxGainPlugins.length, cachedWAFEqualizerPlugins.length);
	if (id == 'echo') return takeWAFEcho();//new WAFEcho();
	if (id == 'equalizer') return takeWAFEqualizer();//new WAFEqualizer();
	if (id == 'gain') return takeZvoogFxGain();//new ZvoogFxGain();
	//console.log('empty plugin effect for', id);
	//return new ZvoogFilterSourceEmpty();
	return takeZvoogFilterSourceEmpty();
}
function createPluginSource(id: string): ZvoogSource {
	//console.log('createPluginSource', id, cachedWAFInsSourcePlugins.length, cachedWAFPercSourcePlugins.length);
	if (id == 'audio') {
		//var t = [0, 1, 2];
		//var arr: Uint8Array;
		//arr = Uint8Array.from(t);
		return takeAudioFileSource();//new AudioFileSource(arr);
	}
	if (id == 'wafinstrument') return takeWAFInsSource();//new WAFInsSource(parseInt(data));
	if (id == 'wafdrum') return takeWAFPercSource();//new WAFPercSource(parseInt(data));
	if (id == 'sine') return takeZvoogSineSource();//new ZvoogSineSource();
	//console.log('empty plugin source for', id);
	//return new ZvoogFilterSourceEmpty();
	return takeZvoogFilterSourceEmpty();
}
