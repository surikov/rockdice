type InOutChord = {
	id: string;
	chords: string[];
	exits: string[];
};
function findChordStepByID(id: string, selectedMap: InOutChord[]): InOutChord {
	for (var i = 0; i < selectedMap.length; i++) {
		if (selectedMap[i].id == id) {
			return selectedMap[i];
		}
	}
	return selectedMap[0];
}
function randomChordVariation(chords: string[]): string {
	var varCount = chords.length;
	var num = Math.floor(Math.random() * varCount);
	return chords[num];
}
function dumpRandomProg() {
	var majorMap: InOutChord[] = [
		{ id: 'I', exits: ['ii', 'iii', 'IV', 'V', 'vi', 'vii'], chords: ['C','C','C', 'Cmaj7'] }
		, { id: 'ii', exits: ['I', 'V', 'vi', 'vii'], chords: ['Dm','Dm','Dm', 'Dm7'] }
		, { id: 'iii', exits: ['ii', 'IV', 'vi'], chords: ['Em','Em','Em', 'Em7', 'Em9','Em/G'] }
		, { id: 'IV', exits: ['I', 'ii', 'V', 'vi', 'vii',], chords: ['F','F','F','F7'] }
		, { id: 'V', exits: ['I', 'ii', 'IV'], chords: ['G','G','G','G7','G/Db'] }
		, { id: 'vi', exits: ['ii', 'IV', 'V', 'vii'], chords: ['Am','Am','Am','Am7','Am9','Am/C'] }
		, { id: 'vii', exits: ['I', 'ii', 'IV', 'vi'], chords: ['Bm7b5','Bm7b5','Bm7b5','Bm/D'] }
	];
	var majorMap2: InOutChord[] = [
		{ id: 'I', exits: ['ii', 'iii', 'IV', 'V', 'vi'], chords: ['C', 'C2', 'C6', 'Cmaj7', 'Csus'] }
		, { id: 'ii', exits: ['iii', 'V'], chords: ['Dm', 'Dm7', 'Dm9'] }
		, { id: 'iii', exits: ['ii', 'IV', 'vi'], chords: ['Em', 'Em7'] }
		, { id: 'IV', exits: ['I', 'iii', 'V'], chords: ['F', 'F6', 'Fmaj7'] }
		, { id: 'V', exits: ['I'], chords: ['G', 'G7', 'G9', 'G13', 'Gsus'] }
		, { id: 'vi', exits: ['ii', 'IV'], chords: ['Am', 'Am7', 'Am9'] }
	];
	//console.log('majorMap', majorMap);
	var selectedMap: InOutChord[] = majorMap;
	var curStep = selectedMap[Math.floor(Math.random() * selectedMap.length)];
	var chordProg = '' + randomChordVariation(selectedMap[0].chords);
	while (curStep.id != selectedMap[0].id) {
		chordProg = chordProg + ' ' + randomChordVariation(curStep.chords);
		var varCount = curStep.exits.length;
		var num = Math.floor(Math.random() * varCount);
		//console.log(num, 'curStep', curStep);
		curStep = findChordStepByID(curStep.exits[num], selectedMap);
		//console.log('found', curStep);
	}
	console.log('chordProg', chordProg);
}
