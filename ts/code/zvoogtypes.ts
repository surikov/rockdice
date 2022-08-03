type ZvoogCurvePoint = {
	skipMeasures: number
	, skip384: number
	, velocity: number
};
type ZvoogAudioParameter = {
	points: ZvoogCurvePoint[]
};
type ZvoogAudioEffect = {
	pluginEffect: ZvoogEffect | null
	, parameters: ZvoogAudioParameter[]
	, kind: string
	, initial: string
};
type ZvoogAudioSource = {
	pluginSource: ZvoogSource | null
	, parameters: ZvoogAudioParameter[]
	, kind: string
	, initial: string
};

type ZvoogMeter = {
	count: number
	, division: number
};
type ZvoogModeStep = {
	step: number
	, halfTones: number
	, shift: number
	, octave: number
};
type ZvoogPitch = {
	duration: ZvoogMeter
	, pitch: number
};
type ZvoogEnvelope = {
	pitches: ZvoogPitch[]
};
type ZvoogChord = {
	when: ZvoogMeter
	, envelopes: ZvoogEnvelope[]
	, variation: number
};
type ZvoogMeasureChord = {
	chords: ZvoogChord[]
};
type ZvoogStrumPattern = {
	directions: string;//'.' | '-' | 'V' | 'A' | 'X'
};
type ZvoogKeyPattern = {
	octaves: string;//'.' | '-' | 1-9
};
type ZvoogStringPattern = {
	strings: string[] | null;/*
	'	|*.....*'
	, '	|.*...*.'
	, '	|..*.*..'
	, '	|...*---'
	, '	*---....'
	, '	|.......'
	*/
};
type ZvoogVoice = {
	measureChords: ZvoogMeasureChord[]
	, source: ZvoogAudioSource
	, effects: ZvoogAudioEffect[]
	//, bass: boolean
	, title: string
	, stringPattern: ZvoogStringPattern | null//16th
	, strumPattern: ZvoogStrumPattern | null//16th
	, keyPattern: ZvoogKeyPattern | null//16th
};
type ZvoogTrack = {
	title:string
	,voices: ZvoogVoice[]
	, effects: ZvoogAudioEffect[]
};
type ZvoogMeasure = {
	meter: ZvoogMeter
	, tempo: number
};
type ZvoogChordMelody = {
	duration: ZvoogMeter
	, chord: string
};
type ZvoogProgression = {
	//base: number
	tone:string
	, mode: string
	, progression: ZvoogChordMelody[]
};
type ZvoogSchedule = {
	title:string
	,tracks: ZvoogTrack[]
	, effects: ZvoogAudioEffect[]
	, measures: ZvoogMeasure[]
	, harmony: ZvoogProgression
};
type ZvoogFretKeys = {
	pitch: number
	, name: string
	, frets: number[]
};
type ZvoogStepHalfTone={
	step:number
	,halftone:number
};
type ZvoogChordPitches = {
	name: string
	, pitches: ZvoogStepHalfTone[]//number[]
};
type IntervalMode = {
	name: string
	, steps: number[]
	, flat: boolean
	,priority:number
};

