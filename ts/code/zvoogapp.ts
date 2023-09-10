//declare function invokeShowAd(): void;
type LoadedSchedule = {
    path: string
    , schedule: ZvoogSchedule
};
type NamedPath = {
    name: string, path: string
};
type StateSeed = {
    drumsSeed: number
    , ui: string
    , bassSeed: number
    , leadSeed: number
    , padSeed: number
    , drumsVolume: number
    , bassVolume: number
    , leadVolume: number
    , padVolume: number
    , chords: string[]
    , tempo: number
    , mode: string
    , tone: string
    , version: string
    , comment: string
};

class ZvoogApp {

    versionCode: string = 'v2.85';
    stateName: string = 'lastSaved';
    counterName: string = 'num';
    undoName: string = 'historyList';
    lastTyped: string = 'lastTyped';

    //uiMode: 'web' | 'free' | 'pro' = 'pro';

    ticker: ZvoogTicker;
    schedule: ZvoogSchedule;
    harmonizer: ZvoogHarmonizer;
    audioContext: AudioContext;

    selectedTempo = 120;
    selectedProgression = 0;
    selectedDrums = 0;
    curDrumVolume = 0;
    selectedBass = 0;
    curBassVolume = 0;
    selectedLead = 0;
    curLeadVolume = 0;
    selectedPad = 0;
    curPadVolume = 0;

    drumControl: RoundedHandler;
    bassControl: RoundedHandler;
    leadControl: RoundedHandler;
    padControl: RoundedHandler;

    loadedSchedules: LoadedSchedule[] = [];

    undoList: StateSeed[] = [];

    //adsCounter: number = 7;
    //adsLimit: number = 10;

    drumsSchedules: NamedPath[] = [
        { name: 'big room 1', path: './patterns/drums/dance/hardbass1.js' }
        , { name: 'big room 2', path: './patterns/drums/dance/hardbass2.js' }
        , { name: 'big room 3', path: './patterns/drums/dance/hardbass3.js' }
        , { name: 'big room 4', path: './patterns/drums/dance/hardbass4.js' }
        , { name: 'big room 5', path: './patterns/drums/dance/hardbass5.js' }
        , { name: 'mumbai 1', path: './patterns/drums/dance/mumbai1.js' }
        , { name: 'disco 1', path: './patterns/drums/dance/disco1.js' }
        , { name: 'slow rock 1', path: './patterns/drums/trap/rockslow.js' }
        , { name: 'trap 1', path: './patterns/drums/trap/trap1.js' }
        , { name: 'trap 2', path: './patterns/drums/trap/trap2.js' }
        , { name: 'trap 3', path: './patterns/drums/trap/trap3.js' }
        , { name: 'hip-hop 1', path: './patterns/drums/hiphop/rap.js' }
        , { name: 'hip-hop 2', path: './patterns/drums/hiphop/funk.js' }
        , { name: 'hip-hop 3', path: './patterns/drums/hiphop/prodigy.js' }
        , { name: 'hip-hop 4', path: './patterns/drums/hiphop/funkypresident.js' }
        , { name: 'power 1', path: './patterns/drums/rock/simplehihat1.js' }
        , { name: 'power 2', path: './patterns/drums/rock/drumbase.js' }
        , { name: 'power 3', path: './patterns/drums/rock/rock1.js' }
        , { name: 'power 4', path: './patterns/drums/rock/ride1.js' }
        , { name: 'power 5', path: './patterns/drums/rock/ledzepleevesbreak.js' }
        , { name: 'power 6', path: './patterns/drums/rock/rock2.js' }
        , { name: 'power 7', path: './patterns/drums/rock/rock3.js' }
        , { name: 'power 8', path: './patterns/drums/rock/hard1.js' }
        , { name: 'power 9', path: './patterns/drums/rock/hard2.js' }
        , { name: 'alternative 1', path: './patterns/drums/alternative/alatriplet.js' }
        , { name: 'alternative 2', path: './patterns/drums/alternative/motowngroove.js' }
        , { name: 'alternative 3', path: './patterns/drums/alternative/benny.js' }
        , { name: 'alternative 4', path: './patterns/drums/alternative/punk2.js' }
        , { name: 'alternative 5', path: './patterns/drums/alternative/power.js' }
    ];
    bassSchedules: NamedPath[] = [
        { name: 'edm 1', path: './patterns/bass/octave1_synth.js' }
        , { name: 'edm 2', path: './patterns/bass/octave2.js' }
        , { name: 'edm 3', path: './patterns/bass/octaveii.js' }
        , { name: 'edm 4', path: './patterns/bass/strange.js' }
        , { name: 'atc 1', path: './patterns/lead/atc.js' }
        , { name: 'odd 1', path: './patterns/bass/octave32off.js' }
        , { name: 'odd 2', path: './patterns/bass/octave31off.js' }
        , { name: 'odd 3', path: './patterns/bass/ozo.js' }
        , { name: 'odd 4', path: './patterns/bass/mission.js' }
        , { name: 'steady 1', path: './patterns/bass/tonic1.js' }
        , { name: 'steady 2', path: './patterns/bass/tonic2.js' }
        , { name: 'steady 3', path: './patterns/bass/octave4terc.js' }
        , { name: 'steady 4', path: './patterns/bass/tnt.js' }
        , { name: 'bass 1', path: './patterns/bass/manuchao.js' }
        , { name: 'bass 2', path: './patterns/bass/funk.js' }
        , { name: 'bass 3', path: './patterns/bass/rich1.js' }
        , { name: 'bass 4', path: './patterns/bass/rich2.js' }
        , { name: 'bass 5', path: './patterns/bass/rich4p.js' }
        , { name: 'bass 6', path: './patterns/bass/rich5.js' }
        , { name: 'bass 7', path: './patterns/bass/rich5a.js' }
        , { name: 'freestyler 1', path: './patterns/lead/bomfunkmc.js' }
        , { name: 'float 1', path: './patterns/bass/rich6.js' }
        , { name: 'float 2', path: './patterns/bass/route66.js' }
        , { name: 'float 3', path: './patterns/bass/rich3fun.js' }
    ];
    leadSchedules: NamedPath[] = [
        { name: 'piano 1', path: './patterns/piano/beat/slade.js' }
        , { name: 'piano 2', path: './patterns/piano/beat/route66.js' }
        , { name: 'piano 3', path: './patterns/piano/beat/abba.js' }
        , { name: 'piano 4', path: './patterns/piano/beat/another.js' }
        , { name: 'piano 5', path: './patterns/piano/beat/bronsky.js' }
        , { name: 'piano 6', path: './patterns/piano/beat/chikago.js' }
        , { name: 'piano 7', path: './patterns/piano/beat/ravel.js' }
        , { name: 'piano 8', path: './patterns/piano/beat/sandstorm.js' }
        , { name: 'piano 9', path: './patterns/piano/beat/second.js' }
        , { name: 'clean guitar 1', path: './patterns/guitar/strum/strums1clear.js' }
        , { name: 'clean guitar 2', path: './patterns/guitar/strum/strums3clear.js' }
        , { name: 'clean guitar 3', path: './patterns/guitar/strum/strums5clear.js' }
        , { name: 'clean guitar 4', path: './patterns/guitar/strum/strums7clear.js' }
        , { name: 'clean guitar 5', path: './patterns/guitar/strum/strumsAux1clear.js' }
        , { name: 'electro guitar 1', path: './patterns/guitar/strum/strums2rock.js' }
        , { name: 'electro guitar 2', path: './patterns/guitar/strum/strums4rock.js' }
        , { name: 'electro guitar 3', path: './patterns/guitar/strum/strums5rock.js' }
        , { name: 'electro guitar 4', path: './patterns/guitar/strum/strums8rock.js' }
        , { name: 'electro guitar 5', path: './patterns/guitar/strum/strumsAux1rock.js' }
        , { name: 'reggae 1', path: './patterns/guitar/strum/reggae1.js' }
        , { name: 'rust guitar 1', path: './patterns/guitar/arpeggio/arp1rust.js' }
        , { name: 'rust guitar 2', path: './patterns/guitar/arpeggio/arp2rust.js' }
        , { name: 'rust guitar 3', path: './patterns/guitar/arpeggio/arp3rust.js' }
        , { name: 'atc 1', path: './patterns/lead/atc.js' }
        , { name: 'jump 1', path: './patterns/lead/vanhalen.js' }
        , { name: 'freestyler 1', path: './patterns/lead/bomfunkmc.js' }
        , { name: 'arpeggio 1', path: './patterns/guitar/arpeggio/arp2rock.js' }
        , { name: 'arpeggio 2', path: './patterns/guitar/arpeggio/arp3clear.js' }
        , { name: 'arpeggio 3', path: './patterns/piano/arpeggio/arp1b.js' }
        , { name: 'arpeggio 4', path: './patterns/piano/arpeggio/arp2b.js' }
        , { name: 'arpeggio 5', path: './patterns/piano/arpeggio/arp3b.js' }
        , { name: 'overdrive 1', path: './patterns/drive/long.js' }
        , { name: 'overdrive 2', path: './patterns/drive/kickstart2.js' }
        , { name: 'overdrive 3', path: './patterns/drive/sadbuttrue.js' }
        , { name: 'overdrive 4', path: './patterns/drive/kickstart1.js' }
        , { name: 'overdrive 5', path: './patterns/drive/route66.js' }
        , { name: 'overdrive 6', path: './patterns/drive/gipsyroad.js' }
        , { name: 'overdrive 7', path: './patterns/drive/volya.js' }
        , { name: 'overdrive 8', path: './patterns/drive/california.js' }


    ];
    padSchedules: NamedPath[] = [


        { name: 'synth 1', path: './patterns/pad/viola1.js' }
        , { name: 'synth 2', path: './patterns/pad/viola2.js' }
        , { name: 'synth 3', path: './patterns/pad/viola3.js' }
        , { name: 'synth 4', path: './patterns/pad/viola4.js' }
        , { name: 'synth 5', path: './patterns/pad/viola5.js' }
        , { name: 'synth 6', path: './patterns/pad/viola6.js' }
        , { name: 'violin 1', path: './patterns/pad/violin1.js' }
        , { name: 'violin 2', path: './patterns/pad/violin2.js' }
        , { name: 'wind 1', path: './patterns/pad/wind1.js' }
        , { name: 'wind 2', path: './patterns/pad/wind2.js' }
        , { name: 'rock organ 1', path: './patterns/pad/organ1.js' }
        , { name: 'rock organ 2', path: './patterns/pad/organ2.js' }
        , { name: 'rock organ 3', path: './patterns/pad/organ3.js' }
        , { name: 'rock organ 4', path: './patterns/pad/organ4.js' }
        , { name: 'crystal 1', path: './patterns/pad/crystal1.js' }
        , { name: 'crystal 2', path: './patterns/pad/organ5.js' }
        , { name: 'aqua 1', path: './patterns/pad/aqua1.js' }
        , { name: 'aqua 2', path: './patterns/pad/aqua2.js' }
        , { name: 'aqua 3', path: './patterns/pad/aqua3.js' }
        , { name: 'choir 1', path: './patterns/pad/choir1.js' }
        , { name: 'choir 2', path: './patterns/pad/choir2.js' }
        , { name: 'choir 3', path: './patterns/pad/choir3.js' }
        , { name: 'choir 4', path: './patterns/pad/choir4.js' }
        , { name: 'choir 5', path: './patterns/pad/choir5.js' }
        , { name: 'choir 6', path: './patterns/pad/choir6.js' }
    ];


    constructor() {
        console.log('ZvoogApp', this.versionCode);

        //this.checkUIMode();
        console.log('audio/mpeg', MediaRecorder.isTypeSupported('audio/mpeg'));
        console.log('audio/ogg', MediaRecorder.isTypeSupported('audio/ogg'));
        console.log('audio/mp4', MediaRecorder.isTypeSupported('audio/mp4'));

        let title: HTMLElement = document.getElementById('titleVersion') as any;
        if (title) {
            title.textContent = 'RockDice ' + this.versionCode;
        }

        this.initUndo();

        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let seed = urlParams.get('seed')
        console.log('seed', seed);
        if (seed) {
            try {
                let param = JSON.parse(seed);
                let o = this.readObjectFromlocalStorage(this.stateName);
                if (o) {
                    let old: StateSeed = o as StateSeed;
                    old.comment = '' + new Date();
                    //let undo:StateSeed[]=[]
                    this.pushUndoState(old, this.undoList);
                }
                param.comment = '' + new Date();
                this.saveText2localStorage(this.stateName, JSON.stringify(param));
                window.location.replace("https://surikov.github.io/rockdice/main.html");
            } catch (xx) {
                console.log(xx);
            }
        }
        this.setUIMode();
		/*let cntr = this.readTextFromlocalStorage(this.counterName);
		this.adsCounter = parseInt(cntr);
		if (this.adsCounter) {
			//
		} else {
			this.adsCounter = this.adsLimit;
		}
		if (this.adsCounter < 1) {
			this.adsCounter = 1;
		}
		if (this.adsCounter > this.adsLimit) {
			this.adsCounter = this.adsLimit;
		}*/
    }
    //___checkUIMode() {
    //this.uiMode = 'web';



    //}
    setUIMode() {
        console.log('setUIMode ' + uiMode);
        //if (1 == 1) uiMode = 'web';
        let e: HTMLInputElement | null = document.getElementById('diceStart') as HTMLInputElement;
        if (e) {
            if (uiMode == 'free') {
                //this.adsLimit = 33;
                //e.src = 'resources/buttonDiceFree.svg';
            } else {
                if (uiMode == 'pro') {
                    //setDivStyleDisplay('menuNoAdsButton', 'none');
                    //e.src = 'resources/buttonDicePro.svg';
                } else {
                    if (uiMode == 'web') {
                        //setDivStyleDisplay('menuNoAdsButton', 'none');
                        //this.adsLimit = 10;
                        //e.src = 'resources/buttonDiceWeb.svg';
                    } else {
                        //e.src = 'resources/buttonPlus.svg';
                    }
                }
            }
        }
        if (uiMode == 'pro') {
            //let e: HTMLElement = document.getElementById('adMobCounter') as any;
            //e.style.display = 'none';
        }
        //setDivStyleDisplay('menuNoAdsButton', 'none');
    }
    cashedDrums: string[] = [];
    cashedIns: string[] = [];
    wafpl: any;
    dumpCashedInstruments() {
        this.dumpList(this.drumsSchedules);
        this.dumpList(this.bassSchedules);
        this.dumpList(this.leadSchedules);
        this.dumpList(this.padSchedules);
    }
    dumpList(list: NamedPath[]) {
        let me = this;
        this.wafpl = new WebAudioFontPlayer() as any;
        for (let i = 0; i < list.length; i++) {
            let ss = list[i];
            this.doForCachedSchedule(ss.path, (sch: ZvoogSchedule) => {
                me.dumpPatterntInstruments(sch);
            });
        }
    }
    dumpPatterntInstruments(schedule: ZvoogSchedule) {
        this.dumpTrackDrums(schedule.tracks[0]);
        for (let i = 1; i < schedule.tracks.length; i++) {
            this.dumpTrackInstruments(schedule.tracks[i]);
        }
    }
    dumpTrackDrums(track: ZvoogTrack) {
        for (let i = 0; i < track.voices.length; i++) {
            let loaderNum = parseInt(track.voices[i].source.initial);
            let iurl = this.wafpl.loader.drumKeys()[loaderNum];
            let url = 'https://surikov.github.io/webaudiofontdata/sound/128' + iurl + '.js';

            if (this.cashedDrums.indexOf(url) < 0) {
                this.cashedDrums.push(url);
                console.log(this.cashedDrums.length, 'drum', track.voices[i].source.initial, url);
            }
        }
    }
    dumpTrackInstruments(track: ZvoogTrack) {
        for (let i = 0; i < track.voices.length; i++) {
            let loaderNum = parseInt(track.voices[i].source.initial);
            let iurl = this.wafpl.loader.instrumentKeys()[loaderNum];
            //https://surikov.github.io/webaudiofontdata/sound/0140_Chaos_sf2_file.html
            let url = 'https://surikov.github.io/webaudiofontdata/sound/' + iurl + '.js';

            if (this.cashedIns.indexOf(url) < 0) {
                this.cashedIns.push(url);
                console.log(this.cashedIns.length, 'instrument', track.voices[i].source.initial, url);
            }
        }
    }
	/*
	dumpCurrentState() {
		//console.log('dumpCurrentState');
		let state: StateSeed = {
			drumsSeed: this.selectedDrums
			, bassSeed: this.selectedBass
			, leadSeed: this.selectedLead
			, padSeed: this.selectedPad
			, progression: []
			, tempo: this.selectedTempo
			, mode: this.schedule.harmony.mode
			, tone: this.schedule.harmony.tone
		};
		for (let i = 0; i < this.schedule.harmony.progression.length; i++) {
			let mel: ZvoogChordMelody = {
				duration: {
					count: this.schedule.harmony.progression[i].duration.count
					, division: this.schedule.harmony.progression[i].duration.division
				}
				, chord: this.schedule.harmony.progression[i].chord
			};
			state.progression.push(mel);
		}

	}
	loadTestState() {
		this.loadFromState(
			{
				"drumsSeed": 16, "bassSeed": 20, "leadSeed": 23, "padSeed": 0, "progression": [
					{ "duration": { "count": 1, "division": 1 }, "chord": "Em" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "G" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "Dsus4" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "A7sus4" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "Em" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "G" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "Dsus4" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "A7sus4" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "Em" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "G" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "Dsus4" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "A7sus4" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "Em" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "G" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "Dsus4" }
					, { "duration": { "count": 1, "division": 1 }, "chord": "A7sus4" }
				], "tempo": 146, "mode": "Dorian", "tone": "E"
			}
		);
	}*/
    //loadFromState(state: StateSeed) {
    //	console.log('loadFromState', state);
    //}
    cutRepeatedProgPats(chords: string[]) {
        let half = Math.floor(chords.length / 2);
        for (var i = 0; i < half; i++) {
            if (chords[i] != chords[i + half]) {
                return;
            }
        }
        //console.log('cutRepeatedProgPats', chords.length, half);
        chords.length = half;
    }
    storeChangedStateNoStartAd(): boolean {
        this.pushUndoState(this.createCurrentState(), this.undoList);
		/*if (uiMode == 'web') {
			this.adsCounter--;
			if (this.adsCounter > 0) {
				this.updateAdsTicker();
				return true;
			} else {
				this.startAdsShow();
				return false;
			}
		} else {
			if (uiMode == 'free') {
				this.adsCounter--;
				if (this.adsCounter > 0) {
					this.updateAdsTicker();
					return true;
				} else {
					this.startAdsShow();
					return false;
				}
			} else {
				return true;
			}
		}*/
        return true;
    }
	/*updateAdsTicker() {
		let e: HTMLInputElement | null = document.getElementById('adMobInfo') as any;
		if (e) {
			e.textContent = '' + this.adsCounter;
		}
	}*/

	/*startAdsShow() {
		console.log('startAdsShow');
		this.cancelPlay();
		let me = this;
		saveState();
		if (uiMode == 'free') {
			setTimeout(() => {
				me.cancelPlay();
				invokeShowAd();
			}
				, 999
			);

		} else {
			if (uiMode == 'web') {
				window.open('https://play.google.com/store/apps/details?id=rockdice.chord.progression');//, '_system', 'location=yes');
				this.rewardAdsShow();
			} else {
				//
			}
		}
	}*/
	/*rewardAdsShow() {
		this.adsCounter = this.adsLimit;
		this.updateAdsTicker();
	}*/
    createCurrentState(): StateSeed {
		/*console.log('createCurrentState start');
		for(var ii=0;ii<this.schedule.harmony.progression.length;ii++){
			console.log(this.schedule.harmony.progression[ii].chord,this.schedule.harmony.progression[ii].duration.count,this.schedule.harmony.progression[ii].duration.division);
		}*/

        let state: StateSeed = {
            drumsSeed: this.selectedDrums
            , bassSeed: this.selectedBass
            , leadSeed: this.selectedLead
            , padSeed: this.selectedPad

            , drumsVolume: this.curDrumVolume
            , bassVolume: this.curBassVolume
            , leadVolume: this.curLeadVolume
            , padVolume: this.curPadVolume

            , chords: []
            , tempo: this.selectedTempo
            , mode: this.schedule.harmony.mode
            , tone: this.schedule.harmony.tone
            , version: this.versionCode
            , comment: '' + new Date()
            , ui: uiMode
        };
        //for (let i = 0; i < this.schedule.harmony.progression.length; i++) {
        //	state.chords.push(this.schedule.harmony.progression[i].chord);
        //	state.chords.push('' + this.schedule.harmony.progression[i].duration.count + '/' + this.schedule.harmony.progression[i].duration.division);
        //
        //		}
        //console.log('a', this.schedule.harmony.progression[2].chord, this.schedule.harmony.progression[2].duration.count, this.schedule.harmony.progression[2].duration.division);
        let current: ZvoogChordMelody | null = null;
        for (let i = 0; i < this.schedule.harmony.progression.length; i++) {

            let item: ZvoogChordMelody = {
                chord: this.schedule.harmony.progression[i].chord, duration: {
                    count: this.schedule.harmony.progression[i].duration.count
                    , division: this.schedule.harmony.progression[i].duration.division
                }
            };
            //this.schedule.harmony.progression[i];
            //console.log(i,item.chord,item.duration.count,item.duration.division);
            if (current) {
                if (current.chord == item.chord) {
                    current.duration = simplifyMeter(plusMeter(current.duration, item.duration));
                } else {
                    state.chords.push(current.chord);
                    state.chords.push('' + current.duration.count + '/' + current.duration.division);
                    //console.log('add',state.chords[state.chords.length-2],state.chords[state.chords.length-1]);
                    current = item;
                }
            } else {
                current = item;
            }
        }
        //console.log('b', this.schedule.harmony.progression[2].chord, this.schedule.harmony.progression[2].duration.count, this.schedule.harmony.progression[2].duration.division);
        if (current) {
            state.chords.push(current.chord);
            state.chords.push('' + current.duration.count + '/' + current.duration.division);
            //console.log('end',state.chords[state.chords.length-2],state.chords[state.chords.length-1]);
        }
        //console.log('c', this.schedule.harmony.progression[2].chord, this.schedule.harmony.progression[2].duration.count, this.schedule.harmony.progression[2].duration.division);
        this.cutRepeatedProgPats(state.chords);
        this.cutRepeatedProgPats(state.chords);
        //console.log('d', this.schedule.harmony.progression[2].chord, this.schedule.harmony.progression[2].duration.count, this.schedule.harmony.progression[2].duration.division);


        return state;
    }
    createShareLink(state: StateSeed): string {
        let json = JSON.stringify(state);
        let tmp = JSON.parse(json);
        tmp.comment = '';
        json = JSON.stringify(tmp);
        let seed = encodeURIComponent(json);

        let url = 'https://mzxbox.ru/RockDice/share.php?seed=' + seed;
        console.log(url);
        return url;
    }
    pushUndoState(state: StateSeed, undo: StateSeed[]) {
        //let state = this.createCurrentState();
        undo.splice(0, 0, state);
        if (undo.length > 99) {
            undo.length = 99;
        }
        //console.log('storeChangedState', state);
        let txt = JSON.stringify(undo);
        this.saveText2localStorage(this.undoName, txt);
    }
    loadSongState(state: StateSeed) {

        console.log('loadSongState', state);

        this.selectedTempo = state.tempo;

        this.selectedDrums = state.drumsSeed;
        this.curDrumVolume = state.drumsVolume;

        this.selectedBass = state.bassSeed;
        this.curBassVolume = state.bassVolume;

        this.selectedLead = state.leadSeed;
        this.curLeadVolume = state.leadVolume;

        this.selectedPad = state.padSeed;
        this.curPadVolume = state.padVolume;

        this.schedule.harmony.mode = state.mode;
        this.schedule.harmony.tone = state.tone;

        this.schedule.effects[0].parameters[6].points[0].velocity = 119;

        for (let i = 0; i < this.schedule.measures.length; i++) {
            this.schedule.measures[i].tempo = this.selectedTempo;
        }

        this.schedule.harmony.progression = [];
        for (let i = 0; i < state.chords.length; i = i + 2) {
            let dur = state.chords[i + 1].split('/');

            this.schedule.harmony.progression.push({
                duration: {
                    count: parseInt(dur[0])
                    , division: parseInt(dur[1])
                }
                , chord: state.chords[i]
            });
        }




        //this.ticker.prepare(this.schedule, this.audioContext, this.audioContext.destination);

        let duration: ZvoogMeter = { count: 16, division: 1 };
        this.harmonizer.repeatAllVoices(this.schedule, duration);



        let me = this;
        this.setAllTracks(() => {
            //let duration: ZvoogMeter = { count: 16, division: 1 };
            //me.harmonizer.repeatAllVoices(this.schedule, duration);
			/*
			let newTime = durations2time(me.schedule.measures);
			me.ticker.waitLoopDuration = newTime;
			me.waitStart(null);
			*/
            this.setDrumsVolume(this.curDrumVolume);
            this.setBassVolume(this.curBassVolume);
            this.setLeadVolume(this.curLeadVolume);
            this.setPadVolume(this.curPadVolume);

            //console.log(me.schedule);

            me.refitUndoList();
			/*
						me.ticker.unconnectAllVoices(me.schedule.tracks[0]);
						let t1=me.schedule.tracks[0]
						for (let s = 0; s < t1.voices.length; s++) {
							let voice: ZvoogVoice = t1.voices[s];
							me.ticker.connectVoice(voice, t1);
						}
						me.ticker.unconnectAllVoices(me.schedule.tracks[1]);
						me.ticker.unconnectAllVoices(me.schedule.tracks[2]);
						me.ticker.unconnectAllVoices(me.schedule.tracks[3]);
			*/
            rockDiceRestartOrStart();
        });

    }


    interStart() {
        if (this.harmonizer) {
            console.log('skip interStart');
        } else {
            this.harmonizer = new ZvoogHarmonizer();
            this.ticker = new ZvoogTicker();

            let AudioContextFunc = (window as any).AudioContext || (window as any).webkitAudioContext;
            this.audioContext = new AudioContextFunc();
            this.fillSelectors();
            this.schedule = this.harmonizer.createEmptyBaseSchedule();
            this.ticker.prepareProject(this.schedule, this.audioContext, this.audioContext.destination);
            let o = this.readObjectFromlocalStorage(this.stateName);
            if (o) {
                //console.log('state init');

                this.loadSongState(o as StateSeed);
                //console.log('done state init');
            } else {
                console.log('random init');
                this.setDefaultVolumes();
                //this.ticker.prepare(this.schedule, this.audioContext, this.audioContext.destination);
                this.chooseRandomSong();
            }
            //this.updateAdsTicker();
            //this.audioContext.audioWorklet.addModule('zvoogexportaudio.js');
            //console.log('started');
        }
    }
    setDefaultVolumes() {
        this.setDrumsVolume(111);
        this.setBassVolume(99);
        this.setLeadVolume(66);
        this.setPadVolume(77);
    }
    initUndo() {
        let o = this.readObjectFromlocalStorage(this.undoName);
        if (o) {
            if (o.length) {
                for (let k = 0; k < o.length; k++) {
                    this.undoList.push(o[k] as StateSeed);
                }
            }
        }
    }
    waitStart(afterStart: null | (() => void)) {
        if (this.ticker.ready()) {
            //this.ticker.start(0, 0, durations2time(this.schedule.measures));
            //let newTime = durations2time(this.schedule.measures);
            //this.ticker.waitLoopDuration = newTime;
            //this.ticker.restart();
            this.startPlay();
            if (afterStart) afterStart();
        } else {
            //console.log('waitStart');
            setTimeout(() => { this.waitStart(afterStart); }, 999);
        }
    }
    chooseRandomDrums() {
        //let drumPatRange: HTMLSelectElement = document.getElementById('select_drums_pattern') as any;
        let rr = Math.floor(Math.random() * this.drumsSchedules.length);
        //drumPatRange.selectedIndex = rr;
        //console.log(rr, this.drumsSchedules.length);
        //handler.setValue(999 * (rr / (this.drumsSchedules.length - 1)));
        this.setDrumPattern(rr, () => {
            this.ticker.restart();

        });
    }
    chooseRandomBass() {
        let bassPatRange: HTMLSelectElement = document.getElementById('select_bass_pattern') as any;
        let rr = Math.floor(Math.random() * this.bassSchedules.length);
        bassPatRange.selectedIndex = rr;
        this.setBassPattern(rr, () => { this.ticker.restart(); });
    }
    chooseRandomLead() {
        let leadPatRange: HTMLSelectElement = document.getElementById('select_lead_pattern') as any;
        let rr = Math.floor(Math.random() * this.leadSchedules.length);
        leadPatRange.selectedIndex = rr;
        this.setLeadPattern(rr, () => { this.ticker.restart(); });
    }
    chooseRandomPad() {
        let padPatRange: HTMLSelectElement = document.getElementById('select_pad_pattern') as any;
        let rr = Math.floor(Math.random() * this.padSchedules.length);
        padPatRange.selectedIndex = rr;
        this.setPadPattern(rr, () => { this.ticker.restart(); });
    }
    chooseRandomProgression() {
        let progPatRange: HTMLSelectElement = document.getElementById('select_prog_pattern') as any;
        let rr = Math.floor(Math.random() * trackProgressions.length);
        progPatRange.selectedIndex = rr;
        this.setProgression(rr, () => { this.ticker.restart(); });
    }
    chooseRandomSong() {
        //console.log('drums', this.drumsSchedules.length);
        //console.log('bass', this.bassSchedules.length);
        //console.log('lead', this.leadSchedules.length);
        //console.log('pad', this.padSchedules.length);
        //console.log('prog', trackProgressions.length);
        //for (var i = 0; i < trackProgressions.length; i++) {
        //console.log(',"', trackProgressions[i].title.split(' ')[0], '"');
        //}
        let drumN = Math.floor(Math.random() * this.drumsSchedules.length);
        let bassN = Math.floor(Math.random() * this.bassSchedules.length);
        let leadN = Math.floor(Math.random() * this.leadSchedules.length);
        let padN = Math.floor(Math.random() * this.padSchedules.length);
        let progN = Math.floor(Math.random() * trackProgressions.length);
        //let variantN = 0;
        let tempo = 130;
        //let compressor = 119;

        this.selectedDrums = drumN;
        this.selectedBass = bassN;
        this.selectedLead = leadN;
        this.selectedPad = padN;
        this.selectedProgression = progN;
        this.selectedTempo = tempo;

        this.setDrumsVolume(111);
        this.setBassVolume(99);
        this.setLeadVolume(66);
        this.setPadVolume(77);

        //	111 }] }] }] }
        //			, { title: 'Bass', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 99 }] }] }] }
        //			, { title: 'Lead', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 66 }] }] }] }
        //			, { title: 'Pad', voices: [], effects: [{ pluginEffect: null, kind: "gain", initial: "", parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 77 }] }] }] }

        let me = this;
        let tp: TrackProgression = trackProgressions[progN];
        if (tp.jspath) {
            me.doForCachedSchedule(tp.jspath, (sch: ZvoogSchedule) => {
                me.setTracksByRandom(sch.harmony);//, compressor);
            });
        } else {
            if (tp.harmony) {
                me.setTracksByRandom(tp.harmony);//, compressor);
            }
        }
        //me.schedule.title='Random v'+Math.round(Math.random()*1000);
        //me.schedule.effects[0]={};
        console.log('chooseRandomSong', me.schedule);
    }
    promptProgression() {
        let lastTypedProg = zapp.readTextFromlocalStorage(zapp.lastTyped);
        let txt = prompt('Am Dm G7, I iv III, etc.', lastTypedProg);
        if (txt) {
            zapp.saveText2localStorage(zapp.lastTyped, txt);
            //this.storeChangedStateAndCheck();
            this.pushUndoState(this.createCurrentState(), this.undoList);
            this.parseProgressionLine(txt);
        }
    }
    parseProgressionLine(txt: string) {
        //var txt = 'C - C/F# - Fmaj7 - F/G C - C/F# - Fmaj7 - Ab Bb';
        //i iv VII III VI ii° V
        //I–IV–♭VII–IV
        console.log('parseProgressionLine', txt);

        txt = txt.replace(/min/g, 'm');
        txt = txt.replace(/m/g, 'm');
        txt = txt.replace(/M/g, 'm');
        txt = txt.replace(/♭/g, 'b');
        txt = txt.replace(/♯/g, '#');
        txt = txt.replace(/\+/g, 'aug');
        txt = txt.replace(/ø/g, 'm7b5');
        txt = txt.replace(/°/g, 'dim7');//, 'm7b5');
        txt = txt.replace(/º/g, 'dim7');//, 'm7b5');
        txt = txt.replace(/0/g, 'm7b5');
        txt = txt.replace(/△/g, 'maj7');
        txt = txt.replace(/Δ/g, 'maj7');

        txt = txt.replace(/77/g, '7');

        txt = txt.replace(/-/g, ' ');
        txt = txt.replace(/—/g, ' ');
        txt = txt.replace(/–/g, ' ');
        txt = txt.replace(/\'/g, ' ');
        txt = txt.replace(/\"/g, ' ');
        txt = txt.replace(/\(/g, ' ');
        txt = txt.replace(/\)/g, ' ');

        txt = txt.replace(/#III/g, 'E#');
        txt = txt.replace(/#VII/g, 'B#');
        txt = txt.replace(/#IV/g, 'F#');
        txt = txt.replace(/#II/g, 'D#');
        txt = txt.replace(/#VI/g, 'A#');
        txt = txt.replace(/#V/g, 'G#');
        txt = txt.replace(/#I/g, 'C#');

        txt = txt.replace(/#iii/g, 'E#m');
        txt = txt.replace(/#vii/g, 'B#m');
        txt = txt.replace(/#iv/g, 'F#m');
        txt = txt.replace(/#ii/g, 'D#m');
        txt = txt.replace(/#vi/g, 'A#m');
        txt = txt.replace(/#v/g, 'G#m');
        txt = txt.replace(/#i/g, 'C#m');

        txt = txt.replace(/bIII/g, 'Eb');
        txt = txt.replace(/bVII/g, 'Bb');
        txt = txt.replace(/bIV/g, 'Fb');
        txt = txt.replace(/bII/g, 'Db');
        txt = txt.replace(/bVI/g, 'Ab');
        txt = txt.replace(/bV/g, 'Gb');//i iv VII III VI ii° V
        txt = txt.replace(/bI/g, 'Cb');

        txt = txt.replace(/biii/g, 'Ebm');
        txt = txt.replace(/bvii/g, 'Bbm');
        txt = txt.replace(/biv/g, 'Fbm');
        txt = txt.replace(/bii/g, 'Dbm');
        txt = txt.replace(/bvi/g, 'Abm');
        txt = txt.replace(/bv/g, 'Gbm');
        txt = txt.replace(/bi/g, 'Cbm');

        txt = txt.replace(/III/g, 'E');
        txt = txt.replace(/VII/g, 'B');
        txt = txt.replace(/IV/g, 'F');
        txt = txt.replace(/II/g, 'D');
        txt = txt.replace(/VI/g, 'A');
        txt = txt.replace(/V/g, 'G');
        txt = txt.replace(/I/g, 'C');

        txt = txt.replace(/iii/g, 'Em');
        txt = txt.replace(/vii/g, 'Bm');
        txt = txt.replace(/iv/g, 'Fm');
        txt = txt.replace(/ii/g, 'Dm');
        txt = txt.replace(/vi/g, 'Am');
        txt = txt.replace(/v/g, 'Gm');
        txt = txt.replace(/i/g, 'Cm');

        txt = txt.replace(/dCmm/g, 'dim');


        //console.log(txt);
        let ss = txt.split(/[-,\n.\s|]+/);
        let chords: string[] = [];
        for (let i = 0; i < ss.length; i++) {
            let chordName = this.parseChordName(ss[i]);
            //console.log(i, ss[i], chordName);
            if (chordName != '-' && chords.length < 16) {
                chords.push(chordName);
            }
        }
        if (chords.length == 1) {
            chords.push(chords[0]);
        }
        if (chords.length > 1) {
            //console.log(chords);
            let harmony: ZvoogProgression = {
                tone: ''
                , mode: ''
                , progression: this.createProgVariant(chords, true)
            };
            //let h:ZvoogHarmonizer=new ZvoogHarmonizer();
            let chordstring = chords.join('-');
            let exmo = this.harmonizer.extractMode(chordstring);
            //console.log(chords);
            console.log(exmo);
            //console.log(harmony);
            harmony.tone = exmo.name;
            harmony.mode = exmo.mode;
            //this.setTracksByRandom(harmony, 119);

            let me = this;
            this.schedule.harmony = harmony;
            //this.schedule.effects[0].parameters[6].points[0].velocity = compressor;
            for (let i = 0; i < this.schedule.measures.length; i++) {
                this.schedule.measures[i].tempo = this.selectedTempo;
            }
            let duration: ZvoogMeter = { count: 16, division: 1 };
            this.harmonizer.repeatAllVoices(this.schedule, duration);
            //console.log('start setAllTracks',me.schedule.harmony.progression);
            this.setAllTracks(() => {
                let newTime = durations2time(me.schedule.measures);
                me.ticker.waitLoopDuration = newTime;
                me.ticker.restart();
                //console.log('end of prompt', me.schedule.harmony.progression);
                //for (var ii = 0; ii < me.schedule.harmony.progression.length; ii++) {
                //	console.log(me.schedule.harmony.progression[ii].chord, me.schedule.harmony.progression[ii].duration.count, me.schedule.harmony.progression[ii].duration.division);
                //}
                //me.chooseVariantProg()
            });
        }
    }
    setTracksByRandom(harmony: ZvoogProgression) {//}, compressor: number) {
        let me = this;
        this.schedule.harmony = JSON.parse(JSON.stringify(harmony)) as ZvoogProgression;
        //this.schedule.effects[0].parameters[6].points[0].velocity = compressor;
        for (let i = 0; i < this.schedule.measures.length; i++) {
            this.schedule.measures[i].tempo = this.selectedTempo;
        }
        let duration: ZvoogMeter = { count: 16, division: 1 };
        this.harmonizer.repeatAllVoices(this.schedule, duration);

        this.setAllTracks(() => {
            let newTime = durations2time(me.schedule.measures);
            me.ticker.waitLoopDuration = newTime;
            //me.ticker.restart();
            me.chooseVariantProg();
            //me.waitStart(null);
            rockDiceRestartOrStart();
        });
    }
    //__interInit() {

    //	this.schedule = this.harmonizer.createEmptyBaseSchedule();
    //	this.ticker.prepare(this.schedule, this.audioContext, this.audioContext.destination);

    //this.ticker.prepare(this.schedule, this.audioContext, this.audioContext.destination);

    //this.waitStart();

    //}

    //exportAsMIDIfile(): void {
    //	exportMIDI(this.schedule);
    //}
    createOptionItem(nn: number, txt: string): HTMLOptionElement {
        let element: HTMLOptionElement = document.createElement('option') as any;
        element.text = '' + nn + ': ' + txt;
        element.value = '' + nn;
        return element;
    }
    createDrumsClick(nn: number): () => void {
        var me = this;
        return function () {
            //console.log('createDrumsClick',nn);

            if (me.storeChangedStateNoStartAd()) me.setDrumPattern(nn, () => {
                rockDiceRestartOrStart();
            });
        };
    }
    createBassClick(nn: number): () => void {
        var me = this;
        return function () {
            if (me.storeChangedStateNoStartAd())
                me.setBassPattern(nn, rockDiceRestartOrStart);
        };
    }
    createLeadClick(nn: number): () => void {
        var me = this;
        return function () {
            if (me.storeChangedStateNoStartAd())
                me.setLeadPattern(nn, rockDiceRestartOrStart);
        };
    }
    createPadClick(nn: number): () => void {
        var me = this;
        return function () {
            if (me.storeChangedStateNoStartAd())
                me.setPadPattern(nn, rockDiceRestartOrStart);
        };
    }
    createProgClick(nn: number): () => void {
        var me = this;
        return function () {
            if (me.storeChangedStateNoStartAd())
                me.setProgression(nn, rockDiceRestartOrStart);
        };
    }
    createUndoClick(nn: number): () => void {
        var me = this;
        return function () {

            let ss = me.undoList[nn];
            //me.undoList.splice(nn,1);
            //console.log('undo', nn, ss);
            //me.storeChangedStateAndCheck();
            me.pushUndoState(me.createCurrentState(), me.undoList);
            me.loadSongState(ss);
        };
    }
    circleColor(value: number, maxValue: number): string {
        if (value < 0) {
            return 'rgba(50,50,50,0.99)';
        } else {
            let part = value / maxValue;
            let r = Math.floor(255 * part);//Math.floor(255 * Math.cos(part * Math.PI / 2));
            let g = Math.floor(255 - 255 * part);//Math.floor(255 * Math.sin(part * Math.PI / 2));
            let b = Math.floor(2 * Math.abs(127 - 254 * part));
            //console.log(value,part, r, g, b);
            let rgba = 'rgba(' + r + ',' + g + ',' + b + ',1)';
            //this.colorcomp.style.stroke = rgba;
            return rgba;
        }
    }

    refitUndoList() {
        let list: HTMLElement = document.getElementById('undoListContent') as any;
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.undoList.length; i++) {
            let state: StateSeed = this.undoList[i];
            var div = document.createElement('div');
            var item = document.createElement('a');
            var firstP = document.createElement('p');
            var secondP = document.createElement('div');
            secondP.textContent = state.comment;
            secondP.classList.add('verySmallFont');
            var spanDrums = document.createElement('span');
            spanDrums.textContent = '◯';
            spanDrums.style.color = this.circleColor(state.drumsSeed, this.drumsSchedules.length);
            firstP.appendChild(spanDrums);
            var spanBass = document.createElement('span');
            spanBass.textContent = '◯';
            spanBass.style.color = this.circleColor(state.bassSeed, this.bassSchedules.length);
            firstP.appendChild(spanBass);
            var spanLead = document.createElement('span');
            spanLead.textContent = '◯';
            spanLead.style.color = this.circleColor(state.leadSeed, this.leadSchedules.length);
            firstP.appendChild(spanLead);
            var spanPad = document.createElement('span');
            spanPad.textContent = '◯';
            spanPad.style.color = this.circleColor(state.padSeed, this.padSchedules.length);
            firstP.appendChild(spanPad);

            var spanChords = document.createElement('span');
            spanChords.classList.add('smallFont');
            let chordLine = '';
            let chordName = '';
            for (let k = 0; k < state.chords.length; k = k + 2) {
                if (chordName == state.chords[k]) {
                    //
                } else {
                    chordLine = chordLine + ' ' + state.chords[k];
                    chordName = state.chords[k]
                }
                //chordLine = chordLine + ' ' + state.chords[k];
            }
            spanChords.textContent = chordLine;
            firstP.appendChild(spanChords);
            item.appendChild(firstP);
            item.appendChild(secondP);

            item.onclick = this.createUndoClick(i);
            list.appendChild(div);
            div.appendChild(item);
        }
    }
    createExcerptClick(nn: number): () => void {
        //var me2 = this;
        return function () {
            //console.log(extendedSchedulePath[-nn]);
            rockDiceRiffPromptExcerptOpen(extendedSchedulePath[-nn].title, nn);
			/*me2.selectedBass = nn;
			me2.selectedDrums = nn;
			me2.selectedLead = nn;
			me2.selectedPad = nn;
			me2.doForCachedSchedule(extendedSchedulePath[-nn].path, (sch: ZvoogSchedule) => {
				me2.setTempo(sch.measures[0].tempo);
				me2.setTracksByProg(nn, sch.harmony, () => {
					//me2.ticker.restart();
					rockDiceRestartOrStart();
				});
			});*/
        };
    }
    refiExcerptsList() {
        let list: HTMLElement = document.getElementById('excerptsListContent') as any;
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        let xlist: { ready: boolean, title: string, path: string, nn: number }[] = [];
        for (var i = 1; i < extendedSchedulePath.length; i++) {
            //if (extendedSchedulePath[i].ready)
            xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i, ready: extendedSchedulePath[i].ready });
        }
        xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => {
            return a.title.localeCompare(b.title);
        });
        for (var i = 0; i < xlist.length; i++) {
            if (xlist[i].ready) {
                //console.log(this.selectedDrums , i,xlist[i]);
                var p = document.createElement('p');
                var a = document.createElement('a');
                a.textContent = xlist[i].title;
                if (this.selectedDrums == xlist[i].nn) {
                    a.classList.add('selectedListItem');
                } else {
                    a.classList.add('unselListItem');
                }

                a.onclick = this.createExcerptClick(xlist[i].nn);
                list.appendChild(p);
                p.appendChild(a);
            }
        }
    }
    refitDrumsList() {
        let list: HTMLElement = document.getElementById('drumListContent') as any;
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.drumsSchedules.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.drumsSchedules[i].name;
            if (this.selectedDrums == i) {
                a.classList.add('selectedListItem');
            } else {
                a.classList.add('unselListItem');
            }
            a.onclick = this.createDrumsClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }

		/*
				let xlist: { title: string, path: string, nn: number }[] = [];
				for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
				xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
				for (var i = 0; i < xlist.length; i++) {
					var p = document.createElement('p');
					var a = document.createElement('a');
					a.textContent = xlist[i].title;
					if (this.selectedDrums == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
					a.onclick = this.createDrumsClick(xlist[i].nn);
					list.appendChild(p);
					p.appendChild(a);
				}
		*/


    }
    refitBassList() {
        let list: HTMLElement = document.getElementById('bassListContent') as any;
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.bassSchedules.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.bassSchedules[i].name;
            if (this.selectedBass == i) {
                a.classList.add('selectedListItem');
            } else {
                a.classList.add('unselListItem');
            }

            a.onclick = this.createBassClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }

		/*
				let xlist: { title: string, path: string, nn: number }[] = [];
				for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
				xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
				for (var i = 0; i < xlist.length; i++) {
					var p = document.createElement('p');
					var a = document.createElement('a');
					a.textContent = xlist[i].title;
					if (this.selectedBass == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
					a.onclick = this.createBassClick(xlist[i].nn);
					list.appendChild(p);
					p.appendChild(a);
				}*/
    }
    refitLeadList() {
        let list: HTMLElement = document.getElementById('leadListContent') as any;
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.leadSchedules.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.leadSchedules[i].name;
            if (this.selectedLead == i) {
                a.classList.add('selectedListItem');
            } else {
                a.classList.add('unselListItem');
            }

            a.onclick = this.createLeadClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }
		/*
				let xlist: { title: string, path: string, nn: number }[] = [];
				for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
				xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
				for (var i = 0; i < xlist.length; i++) {
					var p = document.createElement('p');
					var a = document.createElement('a');
					a.textContent = xlist[i].title;
					if (this.selectedLead == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
					a.onclick = this.createLeadClick(xlist[i].nn);
					list.appendChild(p);
					p.appendChild(a);
				}*/
    }
    refitPadList() {
        let list: HTMLElement = document.getElementById('padListContent') as any;
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.padSchedules.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.padSchedules[i].name;
            if (this.selectedPad == i) {
                a.classList.add('selectedListItem');
            } else {
                a.classList.add('unselListItem');
            }

            a.onclick = this.createPadClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }
		/*
				let xlist: { title: string, path: string, nn: number }[] = [];
				for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
				xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
				for (var i = 0; i < xlist.length; i++) {
					var p = document.createElement('p');
					var a = document.createElement('a');
					a.textContent = xlist[i].title;
					if (this.selectedPad == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
					a.onclick = this.createPadClick(xlist[i].nn);
					list.appendChild(p);
					p.appendChild(a);
				}*/
    }
    refitProgList() {
        let list: HTMLElement = document.getElementById('progListContent') as any;
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < trackProgressions.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = trackProgressions[i].title;
            if (this.selectedProgression == i) {
                a.classList.add('selectedListItem');
            } else {
                a.classList.add('unselListItem');
            }
            a.onclick = this.createProgClick(i);
            list.appendChild(p);
            p.appendChild(a);
        }
		/*
				let xlist: { title: string, path: string, nn: number }[] = [];
				for (var i = 1; i < extendedSchedulePath.length; i++) { xlist.push({ title: extendedSchedulePath[i].title, path: extendedSchedulePath[i].path, nn: -i }); }
				xlist.sort((a: { title: string, path: string }, b: { title: string, path: string }) => { return a.title.localeCompare(b.title); });
				for (var i = 0; i < xlist.length; i++) {
					var p = document.createElement('p');
					var a = document.createElement('a');
					a.textContent = xlist[i].title;
					//console.log(this.selectedProgression , xlist[i]);
					if (-this.selectedProgression == xlist[i].nn) { a.classList.add('selectedListItem'); } else { a.classList.add('unselListItem'); }
					a.onclick = this.createProgClick(xlist[i].nn);
					list.appendChild(p);
					p.appendChild(a);
				}*/
    }

    fillSelectors() {
        this.refitDrumsList();
        this.refitBassList();
        this.refitLeadList();
        this.refitPadList();
        this.refitProgList();
		/*
		let drumPatRange: HTMLSelectElement = document.getElementById('select_drums_pattern') as any;
		let bassPatRange: HTMLSelectElement = document.getElementById('select_bass_pattern') as any;
		let leadPatRange: HTMLSelectElement = document.getElementById('select_lead_pattern') as any;
		let padPatRange: HTMLSelectElement = document.getElementById('select_pad_pattern') as any;
		let progPatRange: HTMLSelectElement = document.getElementById('select_prog_pattern') as any;
		drumPatRange.options.length = 0;
		bassPatRange.options.length = 0;
		leadPatRange.options.length = 0;
		padPatRange.options.length = 0;
		progPatRange.options.length = 0;
		for (let i = 0; i < this.drumsSchedules.length; i++) drumPatRange.options.add(this.createOptionItem(i, this.drumsSchedules[i]));
		for (let i = 0; i < this.bassSchedules.length; i++) bassPatRange.options.add(this.createOptionItem(i, this.bassSchedules[i]));
		for (let i = 0; i < this.leadSchedules.length; i++) leadPatRange.options.add(this.createOptionItem(i, this.leadSchedules[i]));
		for (let i = 0; i < this.padSchedules.length; i++) padPatRange.options.add(this.createOptionItem(i, this.padSchedules[i]));
		for (let i = 0; i < trackProgressions.length; i++) {
			let title = trackProgressions[i].title;
			let jspath = trackProgressions[i].jspath;
			if (jspath) {
				title = jspath;
			}

			progPatRange.options.add(this.createOptionItem(i, title));
		}
		*/
    }
    harmonyStep7Y(r: number): number {
        if (r == 7) return 6;
        if (r == 5) return 5;
        if (r == 6) return 4;
        if (r == 1) return 3;
        if (r == 3) return 2;
        if (r == 4) return 1;
        if (r == 2) return 0;
        return -1;
    }
    dumpHarmony() {
        console.log('dumpHarmony', this.schedule.harmony);
        var tone = this.harmonizer.calculateProgressionMode(this.schedule.harmony.progression).name;
        //var tone = this.schedule.harmony.tone;
        var step8s: number[] = [];
        var y0: string = 'II ';
        var y1: string = 'IV ';
        var y2: string = 'III';
        var y3: string = 'I  ';
        var y4: string = 'VI ';
        var y5: string = 'V  ';
        var y6: string = 'VII';
        for (var i = 0; i < this.schedule.harmony.progression.length; i++) {
            var chord = this.schedule.harmony.progression[i].chord;
            var step = 1 + this.harmonizer.chordStepDifference(tone, chord);
            var cnt = plusMeter(this.schedule.harmony.progression[i].duration, { count: 0, division: 8 }).count;
            //console.log(cnt, this.schedule.harmony.progression[i].duration, chord, step);
            var dlmtr = '-';
            var tofi = '-';
            var fll = 'O';
            for (var kk = 0; kk < cnt; kk++) {
                step8s.push(step);
                if (step8s.length % 32 == 0) {
                    dlmtr = '|';
                    tofi = '|';
                } else {
                    if (step8s.length % 8 == 0) {
                        dlmtr = ':';
                        tofi = ':';
                    } else {
                        dlmtr = '-';
                        tofi = '~';
                    }
                }

                if (this.harmonyStep7Y(step) == 0) { y0 = y0 + fll; } else { y0 = y0 + dlmtr; }
                if (this.harmonyStep7Y(step) == 1) { y1 = y1 + fll; } else { y1 = y1 + dlmtr; }
                if (this.harmonyStep7Y(step) == 2) { y2 = y2 + fll; } else { y2 = y2 + tofi; }
                if (this.harmonyStep7Y(step) == 3) { y3 = y3 + fll; } else { y3 = y3 + tofi; }
                if (this.harmonyStep7Y(step) == 4) { y4 = y4 + fll; } else { y4 = y4 + tofi; }
                if (this.harmonyStep7Y(step) == 5) { y5 = y5 + fll; } else { y5 = y5 + dlmtr; }
                if (this.harmonyStep7Y(step) == 6) { y6 = y6 + fll; } else { y6 = y6 + dlmtr; }
            }
        }
        //console.log(step8s);
        console.log(y6);
        console.log(y5);
        console.log(y4);
        console.log(y3);
        console.log(y2);
        console.log(y1);
        console.log(y0);
    }

    startPlay() {
        //this.ticker.start(0, 0, durations2time(this.schedule.measures));

        this.ticker.start(0, 0, durations2time(this.schedule.measures));
        onAir = true;
        let e: HTMLInputElement | null = document.getElementById('menuPlayButton') as HTMLInputElement;
        if (e) {
            e.src = 'resources/buttonPause.svg';
            rockDiceAdjustAnimation();

        }

    }
    cancelPlay() {
        console.log('cancelPlay', onAir);
        this.ticker.stop();
        onAir = false;
        let e: HTMLInputElement | null = document.getElementById('menuPlayButton') as HTMLInputElement;
        if (e) {
            e.src = 'resources/buttonPlay.svg';
            rockDiceAdjustAnimation();
        }

    }




    setDrumsVolume(volume: number): void {
        this.curDrumVolume = volume;
        this.schedule.tracks[0].effects[0].parameters[0].points[0].velocity = volume;
        //this.ticker.restart();
    }
    changeDrumVoices(fromSchedule: ZvoogSchedule) {
        let toDrumTrack = this.schedule.tracks[this.harmonizer.drumTrackNum];
        this.ticker.unconnectAllVoices(toDrumTrack);
        let duration = scheduleDuration(this.schedule.measures);
        let origin = this.harmonizer.clearCloneSchedule(fromSchedule);
        this.harmonizer.repeatAllVoices(origin, duration);
        let fromDrumTrack = origin.tracks[0];
        for (let i = 0; i < fromDrumTrack.voices.length; i++) {
            toDrumTrack.voices.push(fromDrumTrack.voices[i]);
        }
    }
    setPartBackground(id: string, path: string) {
        try {
            var htmlElement = document.getElementById(id);
            (htmlElement as any).src = path;
        } catch (e) {
            console.log(e);
        }
    }
    setDrumPattern(v: any, onDone: () => void | undefined): void {

        var nn = parseInt(v);
        //console.log('setDrumPattern',v,nn);
		/*if(this.selectedDrums == nn){
			if (onDone) onDone();
			return;
		}*/
        this.drumControl.setRoundedValue(nn, false);
        var path = 'bg/empty.png';
        if (nn == 0) path = 'bg/drums909.png'
        else if (nn == 1) path = 'bg/drumsMPC.png'
        else if (nn == 2) path = 'bg/drums909.png'
        else if (nn == 3) path = 'bg/drums909.png'
        else if (nn == 4) path = 'bg/drumsElectro.png'
        else if (nn == 5) path = 'bg/drums909.png'
        else if (nn == 6) path = 'bg/drumsElectro.png'
        else if (nn == 7) path = 'bg/drumsGreen.png'
        else if (nn == 8) path = 'bg/drumsMPC.png'
        else if (nn == 9) path = 'bg/drumsMPC.png'
        else if (nn == 10) path = 'bg/drumsMPC.png'
        else if (nn == 11) path = 'bg/drumsBig.png'
        else if (nn == 12) path = 'bg/drumsGreen.png'
        else if (nn == 13) path = 'bg/drumsBig.png'
        else if (nn == 14) path = 'bg/drumsBig.png'
        else if (nn == 15) path = 'bg/drumsBig.png'
        else if (nn == 16) path = 'bg/drumsBig.png'
        else if (nn == 17) path = 'bg/drumsGreen.png'
        else if (nn == 18) path = 'bg/drumsBig.png'
        else if (nn == 19) path = 'bg/drumsElectro.png'
        else if (nn == 20) path = 'bg/drumsBig.png'
        else if (nn == 21) path = 'bg/drumsBig.png'
        else if (nn == 22) path = 'bg/drumsBig.png'
        else if (nn == 23) path = 'bg/drumsGreen.png'
        else if (nn == 24) path = 'bg/drumsBig.png'
        else if (nn == 25) path = 'bg/drumsBig.png'
        else if (nn == 26) path = 'bg/drumsBig.png'
        else if (nn == 27) path = 'bg/drumsGreen.png'
        else if (nn == 28) path = 'bg/drumsGreen.png'




        this.setPartBackground('imgBgDrums', path);

        let toDrumTrack = this.schedule.tracks[this.harmonizer.drumTrackNum];


        let me = this;
        let e: HTMLInputElement | null = document.getElementById('drumVolumeSlider') as any;
        if (e) {
            e.value = '' + me.curDrumVolume;
        }

        let schedulePath = '';
        if (nn < 0) {
            schedulePath = extendedSchedulePath[-1 * nn].path;
        } else {
            schedulePath = me.drumsSchedules[nn].path;
        }

        me.doForCachedSchedule(schedulePath, (sch: ZvoogSchedule) => {
            me.changeDrumVoices(sch);
            for (let s = 0; s < toDrumTrack.voices.length; s++) {
                let voice: ZvoogVoice = toDrumTrack.voices[s];
                me.ticker.connectVoice(voice, toDrumTrack);
            }
            //me.ticker.restart();
            me.selectedDrums = nn;
            me.refitDrumsList();
            if (onDone) onDone();
        });
    }
    setBassVolume(volume: number): void {
        this.curBassVolume = volume;
        this.schedule.tracks[1].effects[0].parameters[0].points[0].velocity = volume;
        //this.ticker.restart();
    }
    addVoicePattern(toTrackNum: number, toTrack: ZvoogTrack, fromSchedule: ZvoogSchedule, trackNum: number, voiceNum: number) {
        //console.log('setBassPattern',(toTrackNum==this.harmonizer.bassTrackNum));
        let duration = scheduleDuration(this.schedule.measures);
        let origin = this.harmonizer.clearCloneSchedule(fromSchedule);
        this.harmonizer.repeatAllVoices(origin, duration);
        this.harmonizer.morphSchedule(origin, this.schedule.harmony
            //,toTrackNum==this.harmonizer.bassTrackNum
        );

        let fromTrack = origin.tracks[trackNum];
        adjustVoiceLowHigh(fromTrack.voices[voiceNum], origin.harmony.progression, this.schedule.harmony.progression, this.schedule.measures, trackNum == this.harmonizer.bassTrackNum);
        toTrack.voices.push(fromTrack.voices[voiceNum]);

        this.harmonizer.fillVoiceByPattern(toTrackNum, toTrack.voices.length - 1, this.schedule);
    }
    setBassPattern(v: any, onDone: (() => void) | undefined) {

        var nn = parseInt(v);
		/*if(this.selectedBass == nn){
			if (onDone) onDone();
			return;
		}*/

        var path = 'bg/empty.png';
        if (nn == 0) path = 'bg/bassLine3.png'
        else if (nn == 1) path = 'bg/bassLine3.png'
        else if (nn == 2) path = 'bg/bassLine3.png'
        else if (nn == 3) path = 'bg/bass1.png'
        else if (nn == 4) path = 'bg/bassVolca.png'
        else if (nn == 5) path = 'bg/bass1.png'
        else if (nn == 6) path = 'bg/bass303.png'
        else if (nn == 7) path = 'bg/bassSlap.png'
        else if (nn == 8) path = 'bg/bassSlap.png'
        else if (nn == 9) path = 'bg/bass1.png'
        else if (nn == 10) path = 'bg/bassSlap.png'
        else if (nn == 11) path = 'bg/bass303.png'
        else if (nn == 12) path = 'bg/bass3.png'
        else if (nn == 13) path = 'bg/bass1.png'
        else if (nn == 14) path = 'bg/bass1.png'
        else if (nn == 15) path = 'bg/bassSlap.png'
        else if (nn == 16) path = 'bg/bassSlap.png'
        else if (nn == 17) path = 'bg/bassSlap.png'
        else if (nn == 18) path = 'bg/bass1.png'
        else if (nn == 19) path = 'bg/bassSlap.png'
        else if (nn == 20) path = 'bg/bassLine3.png'
        else if (nn == 21) path = 'bg/bass2.png'
        else if (nn == 22) path = 'bg/bass2.png'
        else if (nn == 23) path = 'bg/bass2.png'


        this.setPartBackground('imgBgBass', path);
        //console.log('setBassPattern',nn);

        this.bassControl.setRoundedValue(nn, false);
        let toTrack = this.schedule.tracks[this.harmonizer.bassTrackNum];


        let me = this;
        let e: HTMLInputElement | null = document.getElementById('bassVolumeSlider') as any;
        if (e) {
            e.value = '' + me.curBassVolume;
        }
        //console.log('wait',me.bassSchedules[nn].path);
        let schedulePath = '';
        if (nn < 0) {
            schedulePath = extendedSchedulePath[-1 * nn].path;
        } else {
            schedulePath = me.bassSchedules[nn].path;
        }
        me.doForCachedSchedule(schedulePath, (sch: ZvoogSchedule) => {
            //console.log('found',sch);
            this.ticker.unconnectAllVoices(toTrack);
            for (let i = 0; i < sch.tracks[me.harmonizer.bassTrackNum].voices.length; i++) {
                //console.log(i,'setBassPattern addVoicePattern');
                me.addVoicePattern(me.harmonizer.bassTrackNum, toTrack, sch, me.harmonizer.bassTrackNum, i);
            }
            for (let s = 0; s < toTrack.voices.length; s++) {
                let voice: ZvoogVoice = toTrack.voices[s];
                me.ticker.connectVoice(voice, toTrack);
            }
            //me.ticker.restart();
            me.selectedBass = nn;
            me.refitBassList();

            if (onDone) onDone();
        });
    }
    setLeadVolume(volume: number): void {
        this.curLeadVolume = volume;
        this.schedule.tracks[2].effects[0].parameters[0].points[0].velocity = volume;
        //this.ticker.restart();
    }

    setLeadPattern(v: any, onDone: () => void | undefined): void {

        var nn = parseInt(v);

        var path = 'bg/empty.png';
        if (nn == 0) path = 'bg/leadPiano1.png'
        else if (nn == 1) path = 'bg/leadPiano1.png'
        else if (nn == 2) path = 'bg/leadPiano1.png'
        else if (nn == 3) path = 'bg/leadPiano1.png'
        else if (nn == 4) path = 'bg/leadPiano1.png'
        else if (nn == 5) path = 'bg/leadPiano1.png'
        else if (nn == 6) path = 'bg/leadPiano1.png'
        else if (nn == 7) path = 'bg/leadPiano1.png'
        else if (nn == 8) path = 'bg/leadPiano1.png'
        else if (nn == 9) path = 'bg/leadAccu1.png'
        else if (nn == 10) path = 'bg/leadAccu1.png'
        else if (nn == 11) path = 'bg/leadAccu1.png'
        else if (nn == 12) path = 'bg/leadAccu1.png'
        else if (nn == 13) path = 'bg/leadAccu1.png'
        else if (nn == 14) path = 'bg/leadClean1.png'
        else if (nn == 15) path = 'bg/leadClean1.png'
        else if (nn == 16) path = 'bg/leadClean1.png'
        else if (nn == 17) path = 'bg/leadClean1.png'
        else if (nn == 18) path = 'bg/leadClean1.png'
        else if (nn == 19) path = 'bg/leadClean1.png'
        else if (nn == 20) path = 'bg/leadRust1.png'
        else if (nn == 21) path = 'bg/leadRust1.png'
        else if (nn == 22) path = 'bg/leadRust1.png'
        else if (nn == 23) path = 'bg/leadXylo.png'
        else if (nn == 24) path = 'bg/leadTrombone1.png'
        else if (nn == 25) path = 'bg/leadMarimba.png'
        else if (nn == 26) path = 'bg/leadClean1.png'
        else if (nn == 27) path = 'bg/leadAccu1.png'
        else if (nn == 28) path = 'bg/leadSynth1.png'
        else if (nn == 29) path = 'bg/leadSynth1.png'
        else if (nn == 30) path = 'bg/leadSynth1.png'
        else if (nn == 31) path = 'bg/leadDrive1.png'
        else if (nn == 32) path = 'bg/leadDrive1.png'
        else if (nn == 33) path = 'bg/leadDrive1.png'
        else if (nn == 34) path = 'bg/leadDrive1.png'
        else if (nn == 35) path = 'bg/leadDrive1.png'
        else if (nn == 36) path = 'bg/leadDrive1.png'
        else if (nn == 37) path = 'bg/leadDrive1.png'
        else if (nn == 38) path = 'bg/leadDrive1.png'



        this.setPartBackground('imgBgLead', path);
        //console.log('setLeadPattern',nn);

		/*if(this.selectedLead == nn){
			if (onDone) onDone();
			return;
		}*/
        this.leadControl.setRoundedValue(nn, false);
        let toTrack = this.schedule.tracks[this.harmonizer.leadTrackNum];


        let me = this;
        let e: HTMLInputElement | null = document.getElementById('leadVolumeSlider') as any;
        if (e) {
            e.value = '' + me.curLeadVolume;
        }
        let schedulePath = '';
        if (nn < 0) {
            schedulePath = extendedSchedulePath[-1 * nn].path;
        } else {
            schedulePath = me.leadSchedules[nn].path;
        }
        me.doForCachedSchedule(schedulePath, (sch: ZvoogSchedule) => {
            this.ticker.unconnectAllVoices(toTrack);
            for (let i = 0; i < sch.tracks[me.harmonizer.leadTrackNum].voices.length; i++) {
                me.addVoicePattern(me.harmonizer.leadTrackNum, toTrack, sch, me.harmonizer.leadTrackNum, i);
            }
            for (let s = 0; s < toTrack.voices.length; s++) {
                let voice: ZvoogVoice = toTrack.voices[s];
                me.ticker.connectVoice(voice, toTrack);
            }
            //me.ticker.restart();
            me.selectedLead = nn;
            me.refitLeadList();
            //console.log('setLeadPattern',nn);
            if (onDone) onDone();
        });
    }
	/*addPadPatter(toTrack: ZvoogTrack, nn: number, pattern: string) {
		
		let voice: ZvoogVoice = {
			measureChords: []
			, source: {
				pluginSource: null
				, parameters: []
				, kind: 'wafinstrument'
				, initial: '' + nn
			}
			, effects: []

			, title: ''
			, stringPattern: null
			, strumPattern: null
			, keyPattern: { octaves: pattern }
		};
		toTrack.voices.push(voice);
		if (voice.keyPattern) {
			this.harmonizer.fillVoiceByKeyPattern(voice, voice.keyPattern, this.schedule.measures, this.schedule.harmony.progression);
			this.harmonizer.splitTrackNotesByProgression(toTrack, this.schedule.measures, this.schedule.harmony, false);
		}

	}*/
    setPadVolume(volume: number): void {
        //console.log('setPadVolume',volume);
        this.curPadVolume = volume;
        this.schedule.tracks[3].effects[0].parameters[0].points[0].velocity = volume;
        //this.ticker.restart();
    }
    setPadPattern(v: any, onDone: (() => void) | undefined): void {
        //console.log('setPadPattern',v);
        var nn = parseInt(v);


        var path = 'bg/empty.png';
        if (nn == 0) path = 'bg/padStrings.png'
        else if (nn == 1) path = 'bg/padStrings.png'
        else if (nn == 2) path = 'bg/padStrings.png'
        else if (nn == 3) path = 'bg/padStrings.png'
        else if (nn == 4) path = 'bg/padStrings.png'
        else if (nn == 5) path = 'bg/padStrings.png'
        else if (nn == 6) path = 'bg/padViolin.png'
        else if (nn == 7) path = 'bg/padViolin.png'
        else if (nn == 8) path = 'bg/padFlute.png'
        else if (nn == 9) path = 'bg/padFlute.png'
        else if (nn == 10) path = 'bg/padOrgan.png'
        else if (nn == 11) path = 'bg/padOrgan.png'
        else if (nn == 12) path = 'bg/padOrgan.png'
        else if (nn == 13) path = 'bg/padOrgan.png'
        else if (nn == 14) path = 'bg/padBells.png'
        else if (nn == 15) path = 'bg/padBells.png'
        else if (nn == 16) path = 'bg/padHarm.png'
        else if (nn == 17) path = 'bg/padHarm.png'
        else if (nn == 18) path = 'bg/padHarm.png'
        else if (nn == 19) path = 'bg/padChoir1.png'
        else if (nn == 20) path = 'bg/padChoir1.png'
        else if (nn == 21) path = 'bg/padChoir1.png'
        else if (nn == 22) path = 'bg/padChoir1.png'
        else if (nn == 23) path = 'bg/padChoir1.png'
        else if (nn == 24) path = 'bg/padChoir1.png'

        this.setPartBackground('imgBgPad', path);
        //console.log('setPadPattern',nn);


		/*ZvoogApp 1.0.8if(this.selectedPad == nn){
			if (onDone) onDone();
			return;
		}*/
        this.padControl.setRoundedValue(nn, false);
        let toTrack = this.schedule.tracks[this.harmonizer.padTrackNum];

        let e: HTMLInputElement | null = document.getElementById('padVolumeSlider') as any;
        if (e) {
            e.value = '' + this.curPadVolume;
        }
        //console.log('voices length',toTrack.voices.length);
        let me = this;
        let schedulePath = '';
        if (nn < 0) {
            schedulePath = extendedSchedulePath[-1 * nn].path;
        } else {
            schedulePath = me.padSchedules[nn].path;
        }
        me.doForCachedSchedule(schedulePath, (sch: ZvoogSchedule) => {
            //console.log('start voices length',toTrack.voices.length);
            let fromTrack = sch.tracks[me.harmonizer.padTrackNum];
            this.ticker.unconnectAllVoices(toTrack);
            for (let i = 0; i < fromTrack.voices.length; i++) {

                me.addVoicePattern(me.harmonizer.padTrackNum, toTrack, sch, me.harmonizer.padTrackNum, i);
            }
            //console.log('now voices length',toTrack.voices.length);
            for (let s = 0; s < toTrack.voices.length; s++) {
                let voice: ZvoogVoice = toTrack.voices[s];
                me.ticker.connectVoice(voice, toTrack);
                //console.log('connectVoice',toTrack.title);
            }
            //me.ticker.restart();
            me.selectedPad = nn;
            me.refitPadList();
            if (onDone) onDone();
        });
    }
    setTempo(tempo: number): void {
        for (let i = 0; i < this.schedule.measures.length; i++) {
            this.schedule.measures[i].tempo = tempo;
        }
        //let newTime = durations2time(this.schedule.measures);
        //this.ticker.waitLoopDuration = newTime;
        //this.ticker.restart();
        this.selectedTempo = tempo;
    }

    repeatForByFirstN(barCnt: number, harmony: ZvoogProgression) {
        let chordArray: string[] = [];
        let progPosition: ZvoogMeter = { count: 0, division: 8 };
        while (progPosition.count < 128) {
            let fch = this.harmonizer.findProgressionPart(progPosition, this.schedule.harmony.progression);
            if (fch) {
                let ch = fch.chord;
                chordArray.push(ch);
                progPosition.count++;
            } else {
                break;
            }
        }
        if (chordArray[0] == '-') {
            chordArray[0] = 'C';
        }
        for (let cc = 0; cc < (16 / barCnt - 1); cc++) {
            for (let nn = 0; nn < 8 * barCnt; nn++) {
                chordArray[nn + 8 * barCnt * (1 + cc)] = chordArray[nn]

            }
        }

        let nn = 0;
        harmony.progression = [];
        while (nn < 128) {
            if (chordArray[nn] == '-') {
                nn++;
            } else {
                let len8 = 1;
                let zvoogChordMel: ZvoogChordMelody = {
                    chord: chordArray[nn]
                    , duration: { count: 1, division: 8 }
                };
                harmony.progression.push(zvoogChordMel);
                while (nn + 1 < 128 && chordArray[nn + 1] == '-') {
                    len8++;
                    nn++;
                }
                zvoogChordMel.duration.count = len8;
                nn++;
            }
        }
    }

    setCompression(ratio: number): void {
        this.schedule.effects[0].parameters[6].points[0].velocity = ratio;
        this.ticker.restart();
    }
    setProgressionChord(start8th: number, chordName: string, harmony: ZvoogProgression) {
        //console.log('setProgressionChord', start8th, chordName);
        let chordArray: string[] = [];
        let progPosition: ZvoogMeter = { count: 0, division: 8 };
        while (progPosition.count < 128) {
            let fch = this.harmonizer.findProgressionPart(progPosition, this.schedule.harmony.progression);
            if (fch) {
                let ch = fch.chord;
                chordArray.push(ch);
                progPosition.count++;
            } else {
                break;
            }
        }
        let cuChord = '';
        for (let i = 0; i < 128; i++) {
            if (cuChord != chordArray[i]) {
                cuChord = chordArray[i];
            } else {
                chordArray[i] = '-';
            }
        }
        if (start8th >= 0 && start8th < chordArray.length) {
            chordArray[start8th] = chordName;
        }
        if (chordArray[0] == '-') {
            chordArray[0] = 'C';
        }

        let nn = 0;
        harmony.progression = [];
        while (nn < 128) {
            if (chordArray[nn] == '-') {
                nn++;
            } else {
                let len8 = 1;
                let zvoogChordMel: ZvoogChordMelody = {
                    chord: chordArray[nn]
                    , duration: { count: 1, division: 8 }
                };
                harmony.progression.push(zvoogChordMel);
                while (nn + 1 < 128 && chordArray[nn + 1] == '-') {
                    len8++;
                    nn++;
                }
                zvoogChordMel.duration.count = len8;
                nn++;
            }
        }

    }
    parseChordName(chordName: string): string {
        let parts = chordName.trim().split('/');
        let bass = '';

        if (parts.length > 1) {

            let bassPart = parts[1].trim();
            if (bassPart.substr(0, 1).toUpperCase() == 'A'
                || bassPart.substr(0, 1).toUpperCase() == 'B'
                || bassPart.substr(0, 1).toUpperCase() == 'C'
                || bassPart.substr(0, 1).toUpperCase() == 'D'
                || bassPart.substr(0, 1).toUpperCase() == 'E'
                || bassPart.substr(0, 1).toUpperCase() == 'F'
                || bassPart.substr(0, 1).toUpperCase() == 'G'
            ) {
                if (bassPart.substr(1, 1) == '#') {
                    bass = '/' + bassPart.substr(0, 1).toUpperCase() + '#';
                } else {
                    if (bassPart.substr(1, 1) == 'b') {
                        bass = '/' + bassPart.substr(0, 1).toUpperCase() + 'b';
                    } else {
                        bass = '/' + bassPart.substr(0, 1).toUpperCase();
                    }
                }
            }

        }
        let toFind = parts[0].trim();
        if (toFind == '' || toFind == '-') {
            //console.log(1, chordName, '-');
            return '-';
        }
        for (var k = 0; k < chordfretsData.length; k++) {
            if (chordfretsData[k].name == toFind) {
                //console.log(2, chordName, (toFind + bass));
                return toFind + bass;
            }
        }
        let composedName = '';
        if (toFind.substr(0, 1).toUpperCase() == 'A'
            || toFind.substr(0, 1).toUpperCase() == 'B'
            || toFind.substr(0, 1).toUpperCase() == 'C'
            || toFind.substr(0, 1).toUpperCase() == 'D'
            || toFind.substr(0, 1).toUpperCase() == 'E'
            || toFind.substr(0, 1).toUpperCase() == 'F'
            || toFind.substr(0, 1).toUpperCase() == 'G'
        ) {
            composedName = toFind.substr(0, 1).toUpperCase();
            let start = 1;
            if (toFind.substr(1, 1) == '#' || toFind.substr(1, 1) == 'b') {
                start = 2;
                composedName = composedName + toFind.substr(1, 1);
            }

            if (toFind.substr(start, 1) == 'm' && toFind.substr(start, 3) != 'maj') {
                composedName = composedName + 'm';
            } else {
                if (toFind.substr(start, 1) == '7') {
                    composedName = composedName + '7';
                }
            }
            //console.log(3, chordName, (composedName + bass));
            return composedName + bass;
        }
        //console.log(4, chordName, '-');
        return '-';
    }
    progVariants: { s: string[] }[] = [
        {
            s: [//2
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-',
                '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-',
                '0,-,-,1,-,-,-,-,0,-,-,1,-,-,-,-',
                '0,-,-,-,-,-,1,-,0,-,-,-,-,-,1,-'
            ]
        }, {
            s: [//3
                '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-',
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-',
                '0,-,-,1,-,-,-,-,0,-,-,1,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,-,-,-,-,-',
                '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,1,-,-,-,2,-,-,-',
                '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-',
                '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-',
                '0,-,1,-,2,-,-,-,-,-,-,-,-,-,-,-',
                '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-'
            ]
        }, {
            s: [//4
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-',
                '0,-,1,-,-,-,-,-,2,-,3,-,-,-,-,-',
                '0,-,1,-,-,-,-,-,-,-,-,-,-,-,-,-,2,-,3,-,-,-,-,-,-,-,-,-,-,-,-,-',
                '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,-,-,-,-',
                '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,3,-,-,-',
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,3,-,-,-,2,-,-,-,3,-,-,-',
                '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-',
                '0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-',
                '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
            ]
        }, {
            s: [//5
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-',
                '0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,4,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-',
                '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-',
                '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-',
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-,-,-,-,-',
                '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-'
            ]
        }, {
            s: [//6
                '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-',
                '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,-,-,-,-',
                '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-',
                '0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-'
            ]
        }, {
            s: [//7
                '0,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-',
                '0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,0,-,-,1,-,-,-,-,2,-,-,3,-,-,-,-,4,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,5,-,-,6,-,-,-,-,5,-,-,6,-,-,-,-',
                '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
            ]
        }, {
            s: [//8
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-',
                '0,-,-,-,1,-,-,-,0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-',
                '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
            ]
        }, {
            s: [//9
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,8,-,-,-',
                '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-,8,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
            ]
        }, {
            s: [//10
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-',
                '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-,8,-,-,-,-,-,-,-,9,-,-,-,-,-,-,-'
            ]
        }, {
            s: [//11
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,-,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-',
                '0,-,-,-,1,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,-,-,-,-,6,-,-,-,-,-,-,-,7,-,-,-,-,-,-,-,8,-,-,-,-,-,-,-,9,-,-,-,10,-,-,-'
            ]
        }, {
            s: [//12
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,-,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-'
            ]
        }, {
            s: [//13
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,-,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-,12,-,-,-'
            ]
        }, {
            s: [//14
                '0,-,-,-,-,-,-,-,1,-,-,-,-,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-,12,-,-,-,13,-,-,-'
            ]
        }, {
            s: [//15
                '0,-,-,-,-,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-,12,-,-,-,13,-,-,-,14,-,-,-'
            ]
        }, {
            s: [//16
                '0,-,-,-,1,-,-,-,2,-,-,-,3,-,-,-,4,-,-,-,5,-,-,-,6,-,-,-,7,-,-,-,8,-,-,-,9,-,-,-,10,-,-,-,11,-,-,-,12,-,-,-,13,-,-,-,14,-,-,-,15,-,-,-'
            ]
        }


    ];
    createProgVariant(chords: string[], base: boolean): ZvoogChordMelody[] {
        let chordmelody: ZvoogChordMelody[] = [];
        let lineIdx = chords.length - 2;
        let nthlines: { s: string[] } = this.progVariants[lineIdx];
        let r = Math.random();
        let rr = Math.floor(r * nthlines.s.length);
        if (base) rr = 0;
        let line = nthlines.s[rr];
        //console.log('createProgVariant',chords,line);

        let durations = line.split(',');
        //console.log(rr, chords, line);
        //console.log(lineIdx, durations);
        let idx = 0;
        while (idx < durations.length) {

            //console.log(idx,durations[idx]);
            let cuChordNum = parseInt(durations[idx]);
            let drtn = 1;
            idx++;
            while (durations[idx] == '-') {
                drtn++;
                idx++;
            }
            chordmelody.push({ duration: { count: drtn, division: 8 }, chord: chords[cuChordNum] });
            //console.log('	',chords[cuChordNum],drtn);
        }
        //console.log(chordmelody);
        //for (var kk = 0; kk < chordmelody.length; kk++) {
        //	console.log(chordmelody[kk].duration.count, chordmelody[kk].duration.division, chordmelody[kk].chord);
        //}
        return chordmelody;
    }

    simplifiedChords(harmony: ZvoogProgression): string[] {
        let chords: string[] = [];
        for (let i = 0; i < harmony.progression.length; i++) {
            chords.push(harmony.progression[i].chord);
        }
        //console.log(chords,harmony.progression);
        for (let ll = chords.length - 2; ll > 0; ll--) {
            for (let mm = 0; mm < chords.length - 1; mm++) {

                if (mm + ll + ll <= chords.length) {
                    let slice = chords.slice(mm, mm + ll);

                    let txtchords = ':' + chords.join(':') + ':';
                    let to = ':' + slice.join(':');
                    let from = to + to + ':';
                    to = to + ':';
                    //console.log(ll, mm, to, from, txtchords);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    txtchords = txtchords.replace(from, to);
                    //txtchords=txtchords.substr(1);
                    //txtchords=txtchords.substr(0,txtchords.length-2);
                    let rez: string[] = txtchords.split(':');
                    //chords = rez;
                    chords = [];
                    for (let kk = 0; kk < rez.length; kk++) {
                        if (rez[kk]) {
                            chords.push(rez[kk]);
                        }
                    }
                    //console.log('chords', txtchords, chords);
                }
            }
        }
        return chords;
    }
    refitProgrtession(harmony: ZvoogProgression): ZvoogChordMelody[] {
        let chords: string[] = this.simplifiedChords(harmony);
        let resChord = this.createProgVariant(chords, false);

        return resChord;
    }
    chooseVariantProg() {
        let harmony: ZvoogProgression = this.schedule.harmony;


        this.schedule.harmony.progression = this.refitProgrtession(harmony);

        //this.setProgression(v,function(){zapp.ticker.restart();});
        let duration: ZvoogMeter = { count: 16, division: 1 };
        this.harmonizer.repeatAllVoices(this.schedule, duration);
        this.setAllTracks(() => {
            this.ticker.restart();
        });//function () {
    }
    //chooseVariantProg(){
    //	this.setVariantProg(this.schedule.harmony);
    //}
	/*chooseVariantProg() {
		let me = this;
		let progPatRange: HTMLSelectElement = document.getElementById('select_prog_pattern') as any;
		let nn = progPatRange.selectedIndex;
		let tp: TrackProgression = trackProgressions[nn];
		if (tp.jspath) {
			me.doForCachedSchedule(tp.jspath, (sch: ZvoogSchedule) => {
				me.setVariantProg(sch.harmony);
			});
		} else {
			if (tp.harmony) {
				me.setVariantProg(tp.harmony);
			}
		}
	}*/
    redefineProgGrid() {

        let fullDur = progressionDuration(this.schedule.harmony.progression);

        let progPosition: ZvoogMeter = { count: 0, division: 8 };
        //let chordLine='';
        //let chordDlmtr='';
        let cuChord = '';
        while (meterMore(progPosition, fullDur) < 0 && progPosition.count < 16 * 8) {
            let mel = this.harmonizer.findProgressionPart(progPosition, this.schedule.harmony.progression);
            if (mel) {
                //let id = 'chord_' + (Math.floor(progPosition.count / 8)) + 'x' + (progPosition.count % 8) + '';
                let id = 'chord' + progPosition.count;
                try {
                    let aa: HTMLLinkElement = document.getElementById(id) as any;
                    if (cuChord != mel.chord) {
                        cuChord = mel.chord;
                        aa.textContent = '' + cuChord;
                        //chordLine=chordLine+chordDlmtr+cuChord;
                        //chordDlmtr='|';
                    } else {
                        aa.textContent = ' ___ ';
                    }
                } catch (xx) {
                    console.log(id, xx);
                }
                progPosition.count++;
            } else {
                break;
            }
        }

    }
    setTracksByProg(nn: number, harmony: ZvoogProgression, onDone: (() => void) | undefined) {
        let me = this;
        this.schedule.harmony = JSON.parse(JSON.stringify(harmony)) as ZvoogProgression;

        let duration: ZvoogMeter = { count: 16, division: 1 };
        this.harmonizer.repeatAllVoices(this.schedule, duration);
        this.selectedProgression = nn;
        this.setAllTracks(onDone);//function () {
        //console.log('done setTracksByProg');
		/*let newTime = durations2time(me.schedule.measures);
		me.ticker.waitLoopDuration = newTime;
		if (me.ticker.ready()) {
			me.ticker.restart();
		}*/
        //});
		/*
		(document.getElementById('progNameRow') as any).innerHTML='wtg';
		console.log(document.getElementById('progNameRow'));
		console.dir(document.getElementById('progNameRow'));
		*/
    }
    setProgression(v: any, onDone: (() => void) | undefined): void {
        var nn = parseInt(v);
        let me = this;
        if (nn < 0) {
            me.doForCachedSchedule(extendedSchedulePath[-nn].path, (sch: ZvoogSchedule) => {
                me.setTracksByProg(-nn, sch.harmony, onDone);
            });
        } else {
            let tp: TrackProgression = trackProgressions[nn];
            if (tp.jspath) {
                me.doForCachedSchedule(tp.jspath, (sch: ZvoogSchedule) => {
                    me.setTracksByProg(nn, sch.harmony, onDone);
                });
            } else {
                if (tp.harmony) {
                    me.setTracksByProg(nn, tp.harmony, onDone);
                }
            }
        }
    }
    setAllTracks(onDone: (() => void) | undefined) {
        //console.log('setAllTracks start');
        let me = this;
        me.setTempo(me.selectedTempo);
        (document.getElementById('sliderProgression') as any).value = Math.floor(1000 * this.selectedProgression / trackProgressions.length);

        me.refitProgList();

        this.fitCHordsTitle();
        let e: HTMLInputElement | null = document.getElementById('tempoSlider') as any;
        if (e) {
            e.value = '' + me.selectedTempo;
        }
        rockDiceUpdateTempoNumFromSong();




        me.setBassPattern(me.selectedBass, () => {
            me.setDrumPattern(me.selectedDrums, () => {
                me.setLeadPattern(me.selectedLead, () => {
                    me.setPadPattern(me.selectedPad, () => {
                        //console.log('setAllTracks onDone');
                        this.redefineProgGrid();
                        if (onDone) onDone();
                        //console.log(me.schedule);
						/*for (let tt = 0; tt < 4; tt++) {
							console.log('=', me.schedule.tracks[tt].title);
							for (let vv = 0; vv < me.schedule.tracks[tt].voices.length; vv++) {
								console.log('---', me.schedule.tracks[tt].voices[vv].title);
							}
						}*/
                    });
                });
            });
        });
    }

    showChordInfo(name: string) {
        this.cancelPlay();
        console.log('info', name);
        let chordInfoTitle: HTMLElement | null = document.getElementById('chordInfoTitle');
        if (chordInfoTitle) {
            chordInfoTitle.innerHTML = name;
        }
        let chordInfoContent = document.getElementById('chordInfoContent');
        if (chordInfoContent) {
            while (chordInfoContent.firstChild) {
                chordInfoContent.removeChild(chordInfoContent.firstChild);
            }
            let pPiano=document.createElement("p");
            chordInfoContent.appendChild(pPiano);
            let svgPiano=document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgPiano.setAttribute('width', '300');
            svgPiano.setAttribute('height', '100');
            pPiano.appendChild(svgPiano);
            
        }
        rockDiceShowChord();
    }
    fitCHordsTitle() {
        let chords: string[] = this.simplifiedChords(this.schedule.harmony);
        let progNameRow: HTMLElement | null = document.getElementById('progNameRow');
        if (progNameRow) {
            //progNameRow.innerHTML = chords.join(' - ');
            progNameRow.innerHTML = "";
            let me = this;
            for (let ii = 0; ii < chords.length; ii++) {
                var a = document.createElement('a');
                a.textContent = chords[ii];
                a.onclick = function () {
                    me.showChordInfo(chords[ii]);
                    //console.log('click', chords[ii]);
                };
                if (ii > 0) {
                    progNameRow.append(' - ');
                }
                progNameRow.appendChild(a);
            }
        }
		/*try {
			(document.getElementById('progNameRow') as any).innerHTML = chords.join(' - ');
			//console.log(this.schedule.harmony.progression);
		} catch (xx) {
			console.log(xx);
		}*/
    }

    waitLoadPath: string = '';
    waitLoadImportedZvoogSchedule(//filePath: string, 
        app: ZvoogApp, afterDone: (loaded: ZvoogSchedule) => void) {
        if (window['importedZvoogSchedule']) {
            let s = app.harmonizer.clearCloneSchedule(window['importedZvoogSchedule']);

            afterDone(s);
        } else {
            setTimeout(function () {
                app.waitLoadImportedZvoogSchedule(app, afterDone);
            }, 333);
        }
    }
    loadScheduleFile(filePath: string, afterDone: (loaded: ZvoogSchedule) => void) {
        console.log('loadScheduleFile', filePath);
        window['importedZvoogSchedule'] = undefined;

        var r = document.createElement('script');
        r.setAttribute("type", "text/javascript");
        r.setAttribute("src", filePath);
        document.getElementsByTagName("head")[0].appendChild(r);
        this.waitLoadImportedZvoogSchedule(this, afterDone);
    }
    doForCachedSchedule(path: string, action: (shedule: ZvoogSchedule) => void) {
        //console.log('start doForCachedSchedule', path);
        for (let i = 0; i < this.loadedSchedules.length; i++) {
            if (this.loadedSchedules[i].path == path) {
                //console.log('found',path);
                action(this.loadedSchedules[i].schedule);
                return;
            }
        }
        let me = this;
        if (this.waitLoadPath) {
            //console.log('--===>', path, 'locked by', this.waitLoadPath);
            setTimeout(function () {
                me.doForCachedSchedule(path, action);
            }, 333);
            return;
        }
        this.waitLoadPath = path;
        this.loadScheduleFile(path, (s: ZvoogSchedule) => {
            me.loadedSchedules.push({ path: path, schedule: s });
            me.waitLoadPath = '';
            action(s);
        });
        //console.log('done doForCachedSchedule',path);
    }
    saveText2localStorage(name: string, text: string) {
        //console.log('saveText2localStorage', name, text);
        localStorage.setItem(name, text);
    }

    readTextFromlocalStorage(name: string): string {
        try {
            let o = localStorage.getItem(name);
            if (o) {
                return o;
            } else {
                return '';
            }
        } catch (ex) {
            console.log(ex);
        }
        return '';
    }
    readObjectFromlocalStorage(name: string): any {
        try {
            let txt = localStorage.getItem(name);
            if (txt) {
                let o = JSON.parse(txt);
                return o;
            } else {
                return null;
            }
        } catch (ex) {
            console.log(ex);

        }
        return null;
    }


}