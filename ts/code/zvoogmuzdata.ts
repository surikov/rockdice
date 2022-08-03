//simple drums
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65755365-0e100d090c0d100f080f-00010101020103010401050106010701274040104110421043104410451046104790670880548155825583558455855586558715a180a380a402a580a780e001--00101f01a03302503a051065-000000000000000000000000
//
//hat drums
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65654465-0e0e0d090f090e0f080f-00010101020103010401050106810701274040104110421043104410451046104794672080ea81ee82ee83ee84ea85ee86ee87eea015a111a211a311a415a511a611a711--00101f01a033024038051065-000000000000000000000000
//
//motown groove
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65758465-100e0c0d070d0809000d-000101400201034004010540068127404010411142104311441045114610479567208055815582558355845585558655a721--00101f01a033024038051065-000000000000000000000000
//
//disco groova
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65854464-0e0e0e090b0e090f000d-0001010102010301040105010681276040104110421043104410451046104781670ca044a144a244a344a444a544a644a720e001--00101f01a033024038051066-000000000000000000000000
//
//trap beat
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=8c-00005a30-65956364-0e0e0c090b0e090f000d-00410110021003100441051006100744410143014501472180718171827183718471857186718771a004a104a204a304a404a504a604a704--00a01f019033024038051066-000000000000000000000000
//
//simple 2
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-a5556264-1212100b09080e0b000e-0001010502010305040105050681070840104110421043104410451046104771a054a155a255a355a455a555a655a715e001--00601f01b033024038051066-000000000000000000000000
//
//lzLeevebreaks
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=8c-00005a30-a555a264-11110d0d090e0e0b050e-0081010c0281030c0481050c06a107094010411042104310441045104610475480548155825583558455855586558755e001--00601f01b033024038051066-000000000000000000000000
//
//James Brown: Funky President
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=64-00005a30-7555a464-0e0e0b080e080d0c050e-008901060289030604890506068907084010411042104310441045104610475180548151825483518454855186548751a001a104a201a304a401a504a601a704--00101f013033024038051066-000000000000000000000000
//
//The Winstons: Amen, Brother
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-65a5aa64-0e0e0b080e080d0c050e-0005010402050344040505040605072a4090411242904312449045124610479180548155825583558455855586558701a120a320a520a754e001--00101f013033025038051066-000000000000000000000000
//
//Kendrick Lamar: Swimming Pools (Drank)
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-5585a464-0e0e0d0d0c0b0a08050e-004901080249030804490508064907684010411042104310441045104610471180548155825583558455855586558755a620a722e001--00a01f01c033024038051066-000000000000000000000000
//
//techno
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=78-00005a30-5513a464-0e0e0d0d0c0b0a090f0e-001101110211031104110511061107f54010411042104310441045104610471080448144824483448444854486448744e001--00a01f01c033024038051066-000000000000000000000000


type TrackProgression = { title: string, harmony: ZvoogProgression | null, jspath: string | null };
let dd21 = { "count": 2, "division": 1 };
let dd11 = { "count": 1, "division": 1 };
let dd12 = { "count": 1, "division": 2 };
let dd14 = { "count": 1, "division": 4 };
let dd18 = { "count": 1, "division": 8 };
let trackProgressions: TrackProgression[] = [
	{ title: "Fmaj7-A minor", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Fmaj7" }, { duration: { count: 2, division: 1 }, "chord": "A" }] }, jspath: null }
	//
	, { title: "Am-B-Gm minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }] }, jspath: null }
	, { title: "Am-Dm-E minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "E" }] }, jspath: null }
	, { title: "C#m-E-B-A blues", harmony: { "tone": "C#", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C#m" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null }
	, { title: "Am-C-Dm-Em minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null }
	, { title: "Am-D7-E7-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	, { title: "Am-D9-Fm-C minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D9" }, { duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "Am-Dm-F-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "Am-Dm-Fm-C minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "Am-Em-G-Dm minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }] }, jspath: null }
	, { title: "Am-F-C-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "Am-F-Em-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	, { title: "Am-G-Dm7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }] }, jspath: null }
	//
	, { title: "Am-G-Em-F minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "Am-G-F-E7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null }
	, { title: "Am-C-G-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	, { title: "Am-C-G-Dm minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }] }, jspath: null }
	, { title: "Bm-A-G-F#m minor", harmony: { "tone": "B", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Bm" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F#m" }] }, jspath: null }
	, { title: "C-Am-Dm-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "Cm-Ab-Eb-Bb epic", harmony: { "tone": "C", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cm" }, { duration: { count: 1, division: 1 }, "chord": "Ab" }, { duration: { count: 1, division: 1 }, "chord": "Eb" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }] }, jspath: null }
	, { title: "C-D7-Fm-C minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "C-D7-G7-C minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "C-E-Am7-F minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "C-Fm-Bb7-C epic", harmony: { "tone": "F", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "Bb7" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "Dm-Am-C-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "Dm-F-Am-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "Em-B-C-Am minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	, { title: "Em-B-G-Em minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null }
	, { title: "Em-C-G-D minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "Em-D-C-D minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "Em-D-C-B7 minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "B7" }] }, jspath: null }
	, { title: "Em-G-C-Am minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	, { title: "Em-G-Dsus4-A7sus4 rock", harmony: { "tone": "E", "mode": "Dorian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dsus4" }, { duration: { count: 1, division: 1 }, "chord": "A7sus4" }] }, jspath: null }
	, { title: "Em-G-D-Em minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null }
	, { title: "Em-G-D-Am minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	, { title: "Fm-Db-Ab-Eb epic", harmony: { "tone": "F", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Fm" }, { duration: { count: 1, division: 1 }, "chord": "Db" }, { duration: { count: 1, division: 1 }, "chord": "Ab" }, { duration: { count: 1, division: 1 }, "chord": "Eb" }] }, jspath: null }
	, { title: "F-Em7-Am-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "G-B-C-Cm creep", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Cm" }] }, jspath: null }
	, { title: "G-C-D-Em minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null }
	//
	, { title: "Dm-Gm-Dm-A-Dm minor", harmony: { "tone": "D", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 2 }, "chord": "A" }, { duration: { count: 1, division: 2 }, "chord": "Dm" }] }, jspath: null }
	, { title: "F-Em-Am-G-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 2 }, "chord": "G" }, { duration: { count: 1, division: 2 }, "chord": "Am" }] }, jspath: null }
	//
	, { title: "Am-C-D-Am-C-Am minor", harmony: { "tone": "A", "mode": "Dorian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	, { title: "Am-Dsus4-Dm-F-G-Dm7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dsus4" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }] }, jspath: null }
	, { title: "Am-F7-G-Em-F-G minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 2, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "Am-G-C-F-E-E7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null }
	, { title: "Am-G-Dm-F-G-Am minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	//
	, { title: "Am-E-Em-D-Dm-Am-Adim-E minor", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Adim" }, { duration: { count: 1, division: 1 }, "chord": "E" }] }, jspath: null }
	, { title: "Am-E7-G-D-F-C-Dm-E7 eagles", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null }
	, { title: "Am-Em-G-D-Am-Cmaj7-G-D epic", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "Am-F-E7-Am-Dm7-Gsus4-F-E7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "Gsus4" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null }
	, { title: "Gm-Cm-F-Bb-Eb-Adim-D-Gm minor", harmony: { "tone": "G", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Cm" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "Eb" }, { duration: { count: 1, division: 1 }, "chord": "Adim" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }] }, jspath: null }
	, { title: "Dm-Bb-C-Gm-Bb-F-Gm-Dm epic", harmony: { "tone": "G", "mode": "Dorian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }] }, jspath: null }
	//-----------------------------------------
	, { title: "Am-G-D jazz", harmony: { "tone": "A", "mode": "Dorian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "C-Gm-Dm jazz", harmony: { "tone": "D", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }] }, jspath: null }
	, { title: "Cmaj7-Cm7-F7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "Cm7" }, { duration: { count: 1, division: 1 }, "chord": "F7" }] }, jspath: null }
	, { title: "Dm7-G7-Cmaj7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "Cmaj7" }] }, jspath: null }
	//
	, { title: "Am7-D7-G-C major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "Am7-Em7-Dsus4-Dm7 nice", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "Dsus4" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }] }, jspath: null }
	, { title: "Am-F7-D7-E7 jazz", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "E7" }] }, jspath: null }
	, { title: "Am7-F7-G-Em7 minor", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "F7" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }] }, jspath: null }
	, { title: "Bm7-Em7-Am7-D7 major", harmony: { "tone": "G", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Bm7" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }] }, jspath: null }
	, { title: "C-Am-E-G jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-D7-F-C jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "C-F-G-G7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "G7" }] }, jspath: null }
	, { title: "Cm7-Ab7-G7 jazz", harmony: { "tone": "C", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Cm7" }, { duration: { count: 1, division: 1 }, "chord": "Ab7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }] }, jspath: null }
	, { title: "Cmaj7-Gm7-C7-Fmaj7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "Gm7" }, { duration: { count: 1, division: 1 }, "chord": "C7" }, { duration: { count: 1, division: 1 }, "chord": "Fmaj7" }] }, jspath: null }
	, { title: "D7-G7-C7-F7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "C7" }, { duration: { count: 1, division: 1 }, "chord": "F7" }] }, jspath: null }
	, { title: "Dm7-G7-Cmaj7-C6 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "C6" }] }, jspath: null }
	, { title: "F#m7-B7-E-A pop", harmony: { "tone": "E", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F#m7" }, { duration: { count: 1, division: 1 }, "chord": "B7" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null }
	, { title: "G-E7-A7-D7 major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "A7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }] }, jspath: null }
	, { title: "G-E7-Am7-D7 major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "E7" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }] }, jspath: null }
	//
	, { title: "Cmaj7-D7-Dm7-G7-Cmaj7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "D7" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 2 }, "chord": "G7" }, { duration: { count: 1, division: 2 }, "chord": "Cmaj7" }] }, jspath: null }
	, { title: "Em-G-D-C-A rock", harmony: { "tone": "E", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 2 }, "chord": "C" }, { duration: { count: 1, division: 2 }, "chord": "A" }] }, jspath: null }
	//
	, { title: "Cmaj7-Am7-Dm7-G7-Em7-A7-Dm7-G7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "A7" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 1 }, "chord": "G7" }] }, jspath: null }
	//
	, { title: "Cmaj7-C7-Fmaj7-Fm7-Em7-A7-Dm7-G7-Cmaj7 jazz", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Cmaj7" }, { duration: { count: 1, division: 1 }, "chord": "C7" }, { duration: { count: 1, division: 1 }, "chord": "Fmaj7" }, { duration: { count: 1, division: 1 }, "chord": "Fm7" }, { duration: { count: 1, division: 1 }, "chord": "Em7" }, { duration: { count: 1, division: 1 }, "chord": "A7" }, { duration: { count: 1, division: 1 }, "chord": "Dm7" }, { duration: { count: 1, division: 2 }, "chord": "G7" }, { duration: { count: 1, division: 2 }, "chord": "Cmaj7" }] }, jspath: null }
	//--------------------------------------
	, { title: "A-D-E major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "E" }] }, jspath: null }
	, { title: "Am-D-G major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-Am-F major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "C-F-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-G-F major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "D-C-G rock", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "F-Am-G nice", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "F-Bb-C blues", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "G-C-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	//
	, { title: "Am-D-G-Em major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null }
	, { title: "Am-G-D-F blues", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "A-Eb-G-D major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "Eb" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "A-G-D-A blues", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null }
	, { title: "C-Ab-Bb-C triumphant", harmony: { "tone": "C", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Ab" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "C-Am-Em-F major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "C-Am-Dm-G blue", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-Am-F-G happy", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-Dm-F-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-G-Am-F epic", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "C-F-G-Am nice", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }] }, jspath: null }
	, { title: "C-F-C-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-F-Am-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-F-Dm-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-F-G-F major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "D-A-C-G major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "D-A-Em-G major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "D-C-G-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "D-C-Bb-F rock", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "D-Em-G-D rock", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "D-G-Bm-A rock", harmony: { "tone": "D", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Bm" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null }
	, { title: "E-B-C#m-A major", harmony: { "tone": "E", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "C#m" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null }
	, { title: "E-G-A-G major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "F-Am-G-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "F-C-Dm-Bb major", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }] }, jspath: null }
	, { title: "F-G-Am-Em major", harmony: { "tone": "A", "mode": "Aeolian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }] }, jspath: null }
	, { title: "G-Am-C-G major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "G-C-Em-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "G-C-D-C major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "G-C-F-C major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "G-D-Am-C major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "G-D-Em-C major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	, { title: "G-Em-Am-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "G-Em-C-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	//
	, { title: "C-G-F-G-C major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 2 }, "chord": "G" }, { duration: { count: 1, division: 2 }, "chord": "C" }] }, jspath: null }
	, { title: "D-F-G-C-G rock", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 2 }, "chord": "C" }, { duration: { count: 1, division: 2 }, "chord": "G" }] }, jspath: null }
	, { title: "D-G-D-A-D major", harmony: { "tone": "D", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 2 }, "chord": "A" }, { duration: { count: 1, division: 2 }, "chord": "D" }] }, jspath: null }
	, { title: "E-B-C#m-G#m-A rock", harmony: { "tone": "E", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "B" }, { duration: { count: 1, division: 1 }, "chord": "C#m" }, { duration: { count: 1, division: 2 }, "chord": "G#m" }, { duration: { count: 1, division: 2 }, "chord": "A" }] }, jspath: null }
	, { title: "F-Am-F-G-C epic", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 2 }, "chord": "G" }, { duration: { count: 1, division: 2 }, "chord": "C" }] }, jspath: null }
	//
	, { title: "A-E-F#m-D-A-E major", harmony: { "tone": "A", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "F#m" }, { duration: { count: 2, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "E" }] }, jspath: null }
	, { title: "C-Dm-Am7-F-G-C major", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 2, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Am7" }, { duration: { count: 2, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }] }, jspath: null }
	//
	, { title: "C-G-Am-Em-F-C-F-G epic", harmony: { "tone": "C", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "C-G-Am-F-C-F-C-G major", harmony: { "tone": "C", "mode": "Ionian", "progression": [
		{ duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }
		, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "F" }
		, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }
		, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }] }, jspath: null }
	, { title: "D-A-Bm-F#m-G-D-G-A major", harmony: { "tone": "D", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "A" }, { duration: { count: 1, division: 1 }, "chord": "Bm" }, { duration: { count: 1, division: 1 }, "chord": "F#m" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "A" }] }, jspath: null }
	, { title: "E-C-D-Em-Em-G-Am-Bm epic", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "E" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Bm" }] }, jspath: null }
	, { title: "F-Bb-Edim-Am-Dm-Gm-C-F major", harmony: { "tone": "F", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "F" }, { duration: { count: 1, division: 1 }, "chord": "Bb" }, { duration: { count: 1, division: 1 }, "chord": "Edim" }, { duration: { count: 1, division: 1 }, "chord": "Am" }, { duration: { count: 1, division: 1 }, "chord": "Dm" }, { duration: { count: 1, division: 1 }, "chord": "Gm" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "F" }] }, jspath: null }
	, { title: "G-D-Em-Bm-C-G-C-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "Bm" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
	, { title: "G-D-Em-C-G-C-G-D major", harmony: { "tone": "G", "mode": "Ionian", "progression": [
		{ duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }
		, { duration: { count: 1, division: 1 }, "chord": "Em" }, { duration: { count: 1, division: 1 }, "chord": "C" }
		, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "C" }
		, { duration: { count: 1, division: 1 }, "chord": "G" }, { duration: { count: 1, division: 1 }, "chord": "D" }] }, jspath: null }
];

type ProgDescr = { category: string, name: string, chords: string };
let chordPitchesData: ZvoogChordPitches[] = [
	//{ name: '', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }] }//[4, 7] },

	{ name: '', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }] }
	, { name: '5', pitches: [{ step: 4, halftone: 7 }, { step: 0, halftone: 12 }] }
	, { name: '6', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }] }
	, { name: '69', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] }
	, { name: '6add9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] }
	, { name: '6sus4', pitches: [{ step: 3, halftone: 5 }, { step: 5, halftone: 9 }] }
	, { name: '7', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] }
	, { name: '7sus4', pitches: [{ step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] }
	, { name: '7b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] }
	, { name: '7-5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] }
	, { name: '7#9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 2, halftone: 15 }] }
	, { name: '7+9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 2, halftone: 15 }] }
	, { name: '7b9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 13 }] }
	, { name: '9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] }
	, { name: '9#11', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] }
	, { name: '9b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] }
	, { name: '11', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }] }
	, { name: '13', pitches: [{ step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }, { step: 5, halftone: 21 }] }
	, { name: 'add9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 1, halftone: 14 }] }
	, { name: 'alt', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }] }
	, { name: 'aug', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }] }
	, { name: '+', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }] }
	, { name: 'aug7', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] }
	, { name: '+7', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] }
	, { name: 'aug9', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] }
	, { name: '+9', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] }
	, { name: 'dim', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }] }
	, { name: 'dim7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 5, halftone: 9 }] }
	, { name: 'm', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }] }
	, { name: 'm6', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }] }
	, { name: 'm69', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] }
	, { name: 'm6add9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] }
	, { name: 'm7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] }
	, { name: 'm7b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] }
	, { name: '0', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] }
	, { name: 'm9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] }
	, { name: 'm9b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] }
	, { name: 'm11', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }] }
	, { name: 'madd9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 1, halftone: 14 }] }
	, { name: 'maj7', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] }
	, { name: 'maj7#5', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 11 }] }
	, { name: 'maj7b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 11 }] }
	, { name: 'maj9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }, { step: 1, halftone: 14 }] }
	, { name: 'maj11', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] }
	, { name: 'maj13', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 6, halftone: 11 }] }
	, { name: 'mmaj7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] }
	, { name: 'mmaj7b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 11 }] }
	, { name: 'mmaj9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }, { step: 1, halftone: 14 }] }
	, { name: 'mmaj11', pitches: [{ step: 2, halftone: 3 }, { step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] }
	, { name: 'sus2', pitches: [{ step: 1, halftone: 2 }, { step: 4, halftone: 7 }] }
	, { name: 'sus4', pitches: [{ step: 3, halftone: 5 }, { step: 4, halftone: 7 }] }
	/*
	,{ name: '5', pitches: [7, 12] },
	{ name: '6', pitches: [4, 7, 9] },
	{ name: '69', pitches: [4, 7, 9, 14] },
	{ name: '6add9', pitches: [4, 7, 9, 14] },
	{ name: '6sus4', pitches: [5, 9] },
	{ name: '7', pitches: [4, 7, 10] },
	{ name: '7sus4', pitches: [5, 7, 10] },
	{ name: '7b5', pitches: [4, 6, 10] },
	{ name: '7-5', pitches: [4, 6, 10] },
	{ name: '7#9', pitches: [4, 7, 10, 15] },
	{ name: '7+9', pitches: [4, 7, 10, 15] },
	{ name: '7b9', pitches: [4, 7, 10, 13] },
	{ name: '9', pitches: [4, 7, 10, 14] },
	{ name: '9#11', pitches: [2, 4, 6, 7, 10] },
	{ name: '9b5', pitches: [4, 6, 10, 14] },
	{ name: '11', pitches: [4, 7, 10, 14, 17] },
	{ name: '13', pitches: [10, 14, 17, 21] },
	{ name: 'add9', pitches: [4, 7, 14] },
	{ name: 'alt', pitches: [4, 6] },
	{ name: 'aug', pitches: [4, 8] },
	{ name: '+', pitches: [4, 8] },
	{ name: 'aug7', pitches: [4, 8, 10] },
	{ name: '+7', pitches: [4, 8, 10] },
	{ name: 'aug9', pitches: [2, 4, 8, 10] },
	{ name: '+9', pitches: [2, 4, 8, 10] },
	{ name: 'dim', pitches: [3, 6] },
	{ name: 'dim7', pitches: [3, 6, 9] },
	{ name: 'm', pitches: [3, 7] },
	{ name: 'm6', pitches: [3, 7, 9] },
	{ name: 'm69', pitches: [3, 7, 9, 14] },
	{ name: 'm6add9', pitches: [3, 7, 9, 14] },
	{ name: 'm7', pitches: [3, 7, 10] },
	{ name: 'm7b5', pitches: [3, 6, 10] },
	{ name: '0', pitches: [3, 6, 10] },
	{ name: 'm9', pitches: [3, 7, 10, 14] },
	{ name: 'm9b5', pitches: [3, 6, 10, 14] },
	{ name: 'm11', pitches: [3, 7, 10, 14, 17] },
	{ name: 'madd9', pitches: [3, 7, 14] },
	{ name: 'maj7', pitches: [4, 7, 11] },
	{ name: 'maj7#5', pitches: [4, 8, 11] },
	{ name: 'maj7b5', pitches: [4, 6, 11] },
	{ name: 'maj9', pitches: [4, 7, 11, 14] },
	{ name: 'maj11', pitches: [2, 4, 5, 7, 11] },
	{ name: 'maj13', pitches: [2, 4, 7, 9, 11] },
	{ name: 'mmaj7', pitches: [3, 7, 11] },
	{ name: 'mmaj7b5', pitches: [3, 6, 11] },
	{ name: 'mmaj9', pitches: [3, 7, 11, 14] },
	{ name: 'mmaj11', pitches: [3, 5, 7, 11] },
	{ name: 'sus2', pitches: [2, 7] },
	{ name: 'sus4', pitches: [5, 7] }
*/
];
let chordfretsData: ZvoogFretKeys[] = [
	{ name: "A#", pitch: 9, frets: [-1, 1, 3, 3, 3, 1] },
	{ name: "Bb", pitch: 9, frets: [-1, 1, 3, 3, 3, 1] },
	{ name: "A69", pitch: 9, frets: [-1, 0, 4, 4, 2, 2] },
	{ name: "A6", pitch: 9, frets: [-1, 0, 2, 2, 2, 2] },
	{ name: "A11", pitch: 9, frets: [-1, 0, 0, 0, 2, 0] },
	{ name: "A7b9", pitch: 9, frets: [-1, 0, 2, 3, 2, 3] },
	{ name: "A13", pitch: 9, frets: [-1, 0, 2, 0, 2, 2] },
	{ name: "A7#9", pitch: 9, frets: [5, 7, 5, 6, 8, 8] },
	{ name: "A7", pitch: 9, frets: [-1, 0, 2, 0, 2, 0] },
	{ name: "A9", pitch: 9, frets: [5, 4, 2, 0, 0, 0] },
	{ name: "A7b5", pitch: 9, frets: [-1, 0, 1, 2, 2, 3] },
	{ name: "A9b5", pitch: 9, frets: [-1, 0, 1, 4, 2, 3] },
	{ name: "A7sus4", pitch: 9, frets: [-1, 0, 2, 0, 3, 0] },
	{ name: "A9#11", pitch: 9, frets: [-1, 0, 1, 0, 2, 0] },
	{ name: "Aadd9", pitch: 9, frets: [-1, 0, 2, 4, 2, 0] },
	{ name: "Aaug", pitch: 9, frets: [-1, 0, 3, 2, 2, 1] },
	{ name: "Aaug9", pitch: 9, frets: [-1, 0, 3, 4, 2, 3] },
	{ name: "Aalt", pitch: 9, frets: [-1, 0, 1, 2, 2, -1] },
	{ name: "Aaug7", pitch: 9, frets: [-1, 0, 3, 0, 2, 1] },
	{ name: "Am6", pitch: 9, frets: [-1, 0, 2, 2, 1, 2] },
	{ name: "Adim", pitch: 9, frets: [-1, 0, 1, 2, 1, -1] },
	{ name: "Adim7", pitch: 9, frets: [-1, 0, 1, 2, 1, 2] },
	{ name: "Am69", pitch: 9, frets: [-1, 0, 4, 5, 0, 0] },
	{ name: "Am9", pitch: 9, frets: [-1, 0, 2, 4, 1, 3] },
	{ name: "Am11", pitch: 9, frets: [-1, 0, 0, 0, 1, 0] },
	{ name: "Am7b5", pitch: 9, frets: [-1, 0, 1, 0, 1, -1] },
	{ name: "Amadd9", pitch: 9, frets: [-1, 0, 2, 4, 1, 0] },
	{ name: "Am7", pitch: 9, frets: [-1, 0, 2, 0, 1, 0] },
	{ name: "Amaj13", pitch: 9, frets: [-1, 0, 2, 1, 2, 2] },
	{ name: "Amaj11", pitch: 9, frets: [-1, 0, 0, 1, 2, 0] },
	{ name: "Amaj7b5", pitch: 9, frets: [-1, 0, 1, 1, 2, 4] },
	{ name: "Amaj7", pitch: 9, frets: [-1, 0, 2, 1, 2, 0] },
	{ name: "Amaj7#5", pitch: 9, frets: [-1, 0, 3, 1, 2, 1] },
	{ name: "A", pitch: 9, frets: [-1, 0, 2, 2, 2, 0] },
	{ name: "Am", pitch: 9, frets: [-1, 0, 2, 2, 1, 0] },
	{ name: "Amaj9", pitch: 9, frets: [-1, 0, 2, 4, 2, 4] },
	{ name: "Ammaj11", pitch: 9, frets: [-1, 0, 0, 1, 1, 0] },
	{ name: "Ammaj7b5", pitch: 9, frets: [-1, 0, 1, 1, 1, 4] },
	{ name: "Asus2", pitch: 9, frets: [-1, 0, 2, 2, 0, 0] },
	{ name: "Ammaj7", pitch: 9, frets: [-1, 0, 2, 1, 1, 0] },
	{ name: "Ammaj9", pitch: 9, frets: [5, 3, 6, 4, 0, 0] },
	{ name: "Ab11", pitch: 8, frets: [4, 4, 4, 5, 4, 4] },
	{ name: "Asus4", pitch: 9, frets: [-1, 0, 2, 2, 3, 0] },
	{ name: "Ab6", pitch: 8, frets: [-1, 3, 1, 1, 1, 1] },
	{ name: "Ab13", pitch: 8, frets: [4, 1, 3, 1, 1, 2] },
	{ name: "Ab69", pitch: 8, frets: [-1, 1, 1, 1, 1, 1] },
	{ name: "Ab7#9", pitch: 8, frets: [4, 3, 4, 4, 4, 4] },
	{ name: "Ab7b5", pitch: 8, frets: [4, -1, 4, 5, 3, -1] },
	{ name: "Ab7b9", pitch: 8, frets: [-1, 0, 1, 1, 1, 2] },
	{ name: "Ab7", pitch: 8, frets: [-1, -1, 1, 1, 1, 2] },
	{ name: "Ab7sus4", pitch: 8, frets: [-1, -1, 1, 1, 2, 2] },
	{ name: "Ab9#11", pitch: 8, frets: [4, -1, 4, 5, 3, -1] },
	{ name: "Ab9", pitch: 8, frets: [4, 3, 4, 3, 4, -1] },
	{ name: "Abadd9", pitch: 8, frets: [4, 3, -1, 3, 4, -1] },
	{ name: "Abalt", pitch: 8, frets: [-1, -1, 6, 5, 3, 4] },
	{ name: "Ab9b5", pitch: 8, frets: [4, 3, 0, 3, -1, 2] },
	{ name: "Abaug", pitch: 8, frets: [4, 3, 2, 1, 1, -1] },
	{ name: "Abaug7", pitch: 8, frets: [4, -1, 4, 5, 5, 0] },
	{ name: "Abdim", pitch: 8, frets: [4, 2, -1, 4, 3, -1] },
	{ name: "Abaug9", pitch: 8, frets: [2, 1, 2, 1, 1, 2] },
	{ name: "Abdim7", pitch: 8, frets: [-1, -1, 0, 1, 0, 1] },
	{ name: "Abm11", pitch: 8, frets: [4, 2, 4, 3, 2, 2] },
	{ name: "Abm6", pitch: 8, frets: [4, -1, 3, 4, 4, -1] },
	{ name: "Abm69", pitch: 8, frets: [4, -1, 3, 4, 4, 6] },
	{ name: "Abm7", pitch: 8, frets: [4, 6, 4, 4, 4, 4] },
	{ name: "Abm7b5", pitch: 8, frets: [-1, -1, 0, 1, 0, 2] },
	{ name: "Abm9", pitch: 8, frets: [4, 1, 1, 1, 0, 2] },
	{ name: "Abmaj11", pitch: 8, frets: [4, 3, 1, 0, 2, -1] },
	{ name: "Abmadd9", pitch: 8, frets: [4, 2, -1, 3, 4, -1] },
	{ name: "Abmaj13", pitch: 8, frets: [4, 3, 3, 3, 4, 3] },
	{ name: "Abmaj7#5", pitch: 8, frets: [4, 3, 2, 0, 1, 0] },
	{ name: "Ab", pitch: 8, frets: [4, 3, 1, 1, 1, -1] },
	{ name: "Abmaj7b5", pitch: 8, frets: [4, 3, 5, 5, 3, 3] },
	{ name: "Abmaj7", pitch: 8, frets: [4, 6, 5, 5, 4, 4] },
	{ name: "Abmaj9", pitch: 8, frets: [-1, 1, 1, 1, 1, 3] },
	{ name: "Abm", pitch: 8, frets: [4, 6, 6, 4, 4, 4] },
	{ name: "Abmmaj11", pitch: 8, frets: [4, 4, 5, 4, 4, 6] },
	{ name: "Abmmaj7", pitch: 8, frets: [-1, 2, 1, 1, 4, 3] },
	{ name: "Abmmaj9", pitch: 8, frets: [4, -1, 5, 3, 0, 4] },
	{ name: "Abmmaj7b5", pitch: 8, frets: [4, 5, 5, 4, -1, 4] },
	{ name: "Absus4", pitch: 8, frets: [-1, -1, 1, 1, 2, 4] },
	{ name: "Absus2", pitch: 8, frets: [4, -1, -1, 3, 4, 4] },
	{ name: "B11", pitch: 11, frets: [-1, 2, 1, 2, 0, 0] },
	{ name: "B13", pitch: 11, frets: [-1, 2, 1, 2, 4, 4] },
	{ name: "B6", pitch: 11, frets: [-1, 2, 1, 1, 0, -1] },
	{ name: "B69", pitch: 11, frets: [-1, 2, 1, 1, 2, 2] },
	{ name: "B7", pitch: 11, frets: [-1, 2, 1, 2, 0, 2] },
	{ name: "B7#9", pitch: 11, frets: [-1, 2, 1, 2, 3, -1] },
	{ name: "B7b9", pitch: 11, frets: [-1, 2, 1, 2, 1, 2] },
	{ name: "B7b5", pitch: 11, frets: [-1, 2, 1, 2, 0, 1] },
	{ name: "B7sus4", pitch: 11, frets: [-1, 2, 2, 2, 0, 0] },
	{ name: "B9b5", pitch: 11, frets: [-1, 2, 1, 2, 2, 1] },
	{ name: "B9", pitch: 11, frets: [-1, 2, 1, 2, 2, 2] },
	{ name: "Balt", pitch: 11, frets: [-1, 2, 3, 4, 4, -1] },
	{ name: "B9#11", pitch: 11, frets: [-1, 2, 1, 2, 2, 1] },
	{ name: "Badd9", pitch: 11, frets: [-1, 2, 1, -1, 2, 2] },
	{ name: "Baug", pitch: 11, frets: [-1, 2, 1, 0, 0, -1] },
	{ name: "Baug7", pitch: 11, frets: [-1, 2, 1, 2, 0, 3] },
	{ name: "Baug9", pitch: 11, frets: [-1, 2, 1, 2, 2, 3] },
	{ name: "Bdim7", pitch: 11, frets: [-1, 2, 3, 1, 3, 1] },
	{ name: "Bdim", pitch: 11, frets: [-1, 2, 0, -1, 0, 1] },
	{ name: "Bm11", pitch: 11, frets: [-1, 2, 0, 2, 2, 0] },
	{ name: "Bm6", pitch: 11, frets: [2, 2, 0, 1, 0, 2] },
	{ name: "Bm69", pitch: 11, frets: [-1, 2, 0, 1, 2, 2] },
	{ name: "Bm7", pitch: 11, frets: [2, 2, 4, 2, 3, 2] },
	{ name: "Bm7b5", pitch: 11, frets: [-1, 2, 3, 2, 3, -1] },
	{ name: "Bm9", pitch: 11, frets: [-1, 2, 0, 2, 2, 2] },
	{ name: "Bmadd9", pitch: 11, frets: [-1, 5, 4, 4, 2, -1] },
	{ name: "Bmaj11", pitch: 11, frets: [-1, 2, 1, 3, 0, 0] },
	{ name: "Bmaj13", pitch: 11, frets: [-1, 2, 2, 3, 4, 4] },
	{ name: "Bmaj7", pitch: 11, frets: [2, 2, 4, 3, 4, 2] },
	{ name: "Bmaj7#5", pitch: 11, frets: [-1, 2, 1, 3, 0, 3] },
	{ name: "Bmaj9", pitch: 11, frets: [2, 2, 1, 3, 2, -1] },
	{ name: "Bmaj7b5", pitch: 11, frets: [-1, 2, 3, 3, 4, -1] },
	{ name: "B", pitch: 11, frets: [2, 2, 4, 4, 4, 2] },
	{ name: "Bmmaj7", pitch: 11, frets: [-1, 2, 0, 3, 0, 2] },
	{ name: "Bmmaj11", pitch: 11, frets: [-1, 2, 0, 3, 2, 0] },
	{ name: "Bmmaj7b5", pitch: 11, frets: [-1, 2, 3, 3, 3, -1] },
	{ name: "Bmmaj9", pitch: 11, frets: [-1, 2, 0, 3, 2, 2] },
	{ name: "Bsus2", pitch: 11, frets: [2, 2, 4, 4, 2, 2] },
	{ name: "Bsus4", pitch: 11, frets: [2, 2, 4, 4, 5, 2] },
	{ name: "Bm", pitch: 11, frets: [2, 2, 4, 4, 3, 2] },
	{ name: "Bb11", pitch: 10, frets: [-1, 1, 1, 1, 3, 1] },
	{ name: "Bb13", pitch: 10, frets: [-1, 1, 0, 1, 3, 3] },
	{ name: "Bb6", pitch: 10, frets: [-1, 1, 3, 3, 3, 3] },
	{ name: "Bb69", pitch: 10, frets: [-1, 1, 0, 0, 1, 1] },
	{ name: "Bb7", pitch: 10, frets: [-1, 1, 3, 1, 3, 1] },
	{ name: "Bb7#9", pitch: 10, frets: [-1, 1, 0, 1, 2, -1] },
	{ name: "Bb7b5", pitch: 10, frets: [-1, 1, 2, 1, 3, -1] },
	{ name: "Bb9#11", pitch: 10, frets: [-1, 1, 0, 1, 1, 0] },
	{ name: "Bb7sus4", pitch: 10, frets: [-1, 1, 3, 1, 4, 1] },
	{ name: "Bb9", pitch: 10, frets: [-1, 1, 0, 1, 1, 1] },
	{ name: "Bb7b9", pitch: 10, frets: [-1, 1, 0, 1, 0, 1] },
	{ name: "Bb9b5", pitch: 10, frets: [-1, 1, 0, 1, 1, 0] },
	{ name: "Bbadd9", pitch: 10, frets: [-1, 1, 0, 3, 1, 1] },
	{ name: "Bbalt", pitch: 10, frets: [-1, 1, 2, 3, 3, 0] },
	{ name: "Bbaug7", pitch: 10, frets: [-1, 1, 4, 1, 3, 2] },
	{ name: "Bbaug", pitch: 10, frets: [-1, 1, 4, 3, 3, -1] },
	{ name: "Bbaug9", pitch: 10, frets: [-1, 1, 0, 1, 1, 2] },
	{ name: "Bbdim", pitch: 10, frets: [-1, 1, 2, 3, 2, -1] },
	{ name: "Bbm11", pitch: 10, frets: [6, 4, 6, 5, 4, 4] },
	{ name: "Bbm6", pitch: 10, frets: [-1, 1, 3, -1, 2, 3] },
	{ name: "Bbm69", pitch: 10, frets: [6, -1, 5, 6, 6, 8] },
	{ name: "Bbdim7", pitch: 10, frets: [-1, 1, 2, 0, 2, 0] },
	{ name: "Bbm7b5", pitch: 10, frets: [-1, 1, 2, 1, 2, -1] },
	{ name: "Bbm7", pitch: 10, frets: [-1, 1, 3, 1, 2, 1] },
	{ name: "Bbm9", pitch: 10, frets: [-1, -1, 3, 5, 2, 4] },
	{ name: "Bbmadd9", pitch: 10, frets: [-1, 4, 3, 3, 1, -1] },
	{ name: "Bbmaj11", pitch: 10, frets: [-1, 1, 1, 2, 3, 1] },
	{ name: "Bbmaj13", pitch: 10, frets: [-1, 1, 1, 2, 3, 3] },
	{ name: "Bbmaj7#5", pitch: 10, frets: [-1, 1, 0, 2, 3, 2] },
	{ name: "Bbmaj7", pitch: 10, frets: [-1, 1, 3, 2, 3, 1] },
	{ name: "Bb", pitch: 10, frets: [-1, 1, 3, 3, 3, 1] },
	{ name: "Bbmaj7b5", pitch: 10, frets: [-1, 1, 2, 2, 3, -1] },
	{ name: "Bbm", pitch: 10, frets: [-1, 1, 3, 3, 2, 1] },
	{ name: "Bbmmaj11", pitch: 10, frets: [-1, 1, 1, 2, 2, 1] },
	{ name: "Bbmmaj7", pitch: 10, frets: [-1, 1, 3, 2, 2, 1] },
	{ name: "Bbmaj9", pitch: 10, frets: [1, 1, 0, 2, 1, -1] },
	{ name: "Bbmmaj7b5", pitch: 10, frets: [-1, 1, 2, 2, 2, 0] },
	{ name: "Bbmmaj9", pitch: 10, frets: [6, 4, -1, 5, 6, 5] },
	{ name: "Bbsus4", pitch: 10, frets: [-1, 1, 3, 3, 4, 1] },
	{ name: "Bbsus2", pitch: 10, frets: [1, 1, 3, 3, 1, 1] },
	{ name: "C13", pitch: 0, frets: [-1, 3, 2, 3, 5, 5] },
	{ name: "C11", pitch: 0, frets: [-1, 3, 2, 3, 1, 1] },
	{ name: "C6", pitch: 0, frets: [-1, 3, 2, 2, 1, 0] },
	{ name: "C69", pitch: 0, frets: [-1, 3, 2, 2, 3, 3] },
	{ name: "C7", pitch: 0, frets: [-1, 3, 2, 3, 1, 0] },
	{ name: "C7b5", pitch: 0, frets: [-1, -1, 2, 3, 1, 2] },
	{ name: "C7#9", pitch: 0, frets: [-1, 3, 2, 3, 4, -1] },
	{ name: "C7b9", pitch: 0, frets: [-1, 3, 2, 3, 2, 3] },
	{ name: "C7sus4", pitch: 0, frets: [-1, 3, 3, 3, 1, 1] },
	{ name: "C9b5", pitch: 0, frets: [-1, 3, 2, 3, 3, 2] },
	{ name: "C9#11", pitch: 0, frets: [-1, 3, 2, 3, 3, 2] },
	{ name: "C9", pitch: 0, frets: [3, 3, 2, 3, 3, 3] },
	{ name: "Cadd9", pitch: 0, frets: [-1, 3, 2, 0, 3, 0] },
	{ name: "Calt", pitch: 0, frets: [-1, 3, 2, 5, 5, 2] },
	{ name: "Caug", pitch: 0, frets: [-1, 3, 2, 1, 1, -1] },
	{ name: "Caug9", pitch: 0, frets: [-1, 3, 2, 3, 3, 4] },
	{ name: "Cdim", pitch: 0, frets: [-1, 3, 1, -1, 1, 2] },
	{ name: "Caug7", pitch: 0, frets: [-1, 3, 2, 3, -1, 4] },
	{ name: "Cdim7", pitch: 0, frets: [-1, -1, 1, 2, 1, 2] },
	{ name: "Cm11", pitch: 0, frets: [-1, 3, 1, 3, 3, 1] },
	{ name: "Cm6", pitch: 0, frets: [-1, 3, 1, 2, 1, 3] },
	{ name: "Cm7", pitch: 0, frets: [-1, 3, 1, 3, 4, -1] },
	{ name: "Cm69", pitch: 0, frets: [-1, 3, 1, 2, 3, 3] },
	{ name: "Cm9", pitch: 0, frets: [-1, 3, 1, 3, 3, 3] },
	{ name: "Cm7b5", pitch: 0, frets: [-1, 3, 4, 3, 4, -1] },
	{ name: "Cmadd9", pitch: 0, frets: [-1, 3, 1, 0, 3, 3] },
	{ name: "Cmaj11", pitch: 0, frets: [-1, 3, 2, 0, 0, 1] },
	{ name: "Cmaj13", pitch: 0, frets: [-1, 3, 2, 2, 0, 1] },
	{ name: "Cmaj7#5", pitch: 0, frets: [-1, 3, 2, 1, 0, 0] },
	{ name: "Cmaj7", pitch: 0, frets: [3, 3, 2, 0, 0, 0] },
	{ name: "Cmaj9", pitch: 0, frets: [-1, 3, 0, 0, 0, 0] },
	{ name: "C", pitch: 0, frets: [-1, 3, 2, 0, 1, 0] },
	{ name: "Cm", pitch: 0, frets: [-1, 3, 1, 0, 1, 3] },
	{ name: "Cmaj7b5", pitch: 0, frets: [-1, 3, 2, 4, 0, 2] },
	{ name: "Cmmaj11", pitch: 0, frets: [-1, 3, 1, 0, 0, 1] },
	{ name: "Cmmaj7b5", pitch: 0, frets: [-1, 3, -1, 4, 4, 2] },
	{ name: "Cmmaj7", pitch: 0, frets: [-1, 3, 1, 0, 0, -1] },
	{ name: "Cmmaj9", pitch: 0, frets: [-1, 3, 1, 4, 3, -1] },
	{ name: "Csus2", pitch: 0, frets: [-1, 3, 0, 0, 1, 3] },
	{ name: "Csus4", pitch: 0, frets: [-1, 3, 3, 0, 1, 1] },
	{ name: "C#11", pitch: 1, frets: [-1, 4, 3, 0, 0, 4] },
	{ name: "C#6", pitch: 1, frets: [-1, 4, 3, 3, 2, -1] },
	{ name: "C#13", pitch: 1, frets: [-1, 4, 3, 3, 0, 2] },
	{ name: "C#7#9", pitch: 1, frets: [-1, 4, 3, 4, 2, 0] },
	{ name: "C#69", pitch: 1, frets: [-1, 4, 1, 3, 2, 1] },
	{ name: "C#7", pitch: 1, frets: [-1, 4, 3, 4, 2, -1] },
	{ name: "C#7b9", pitch: 1, frets: [-1, 4, 3, 4, 3, 4] },
	{ name: "C#7sus4", pitch: 1, frets: [-1, 4, 4, 4, 2, 2] },
	{ name: "C#7b5", pitch: 1, frets: [-1, 4, 3, 0, 0, 1] },
	{ name: "C#9#11", pitch: 1, frets: [-1, 3, 2, 0, 0, 3] },
	{ name: "C#9", pitch: 1, frets: [4, 4, 3, 4, 4, 4] },
	{ name: "C#alt", pitch: 1, frets: [-1, 4, 3, 0, 2, 1] },
	{ name: "C#add9", pitch: 1, frets: [-1, 4, 3, 1, 4, 1] },
	{ name: "C#9b5", pitch: 1, frets: [-1, 4, 3, 4, 4, 3] },
	{ name: "C#aug", pitch: 1, frets: [-1, 4, 4, 4, 2, 2] },
	{ name: "C#aug7", pitch: 1, frets: [-1, 4, 3, 2, 0, 1] },
	{ name: "C#dim", pitch: 1, frets: [-1, 4, 2, -1, 2, 3] },
	{ name: "C#aug9", pitch: 1, frets: [-1, 4, 3, 4, 4, 5] },
	{ name: "C#dim7", pitch: 1, frets: [-1, -1, 2, 3, 2, 3] },
	{ name: "C#m11", pitch: 1, frets: [-1, 4, 2, 4, 2, 2] },
	{ name: "C#m6", pitch: 1, frets: [-1, 4, 2, 3, 2, 4] },
	{ name: "C#m7", pitch: 1, frets: [-1, 4, 6, 4, 5, 4] },
	{ name: "C#m7b5", pitch: 1, frets: [-1, 4, 5, 4, 5, -1] },
	{ name: "C#m69", pitch: 1, frets: [-1, 4, 1, 3, 2, 0] },
	{ name: "C#m9", pitch: 1, frets: [-1, 4, 2, 4, 4, 4] },
	{ name: "C#madd9", pitch: 1, frets: [-1, 4, 2, 1, 4, -1] },
	{ name: "C#maj11", pitch: 1, frets: [-1, 4, 3, 5, 2, 2] },
	{ name: "C#maj7#5", pitch: 1, frets: [1, 4, 3, 2, 1, 1] },
	{ name: "C#maj13", pitch: 1, frets: [-1, 4, 1, 3, 1, 1] },
	{ name: "C#maj7", pitch: 1, frets: [-1, 4, 3, 1, 1, 1] },
	{ name: "C#maj7b5", pitch: 1, frets: [-1, 4, 3, 5, 6, 3] },
	{ name: "C#maj9", pitch: 1, frets: [-1, 4, 1, 1, 1, 1] },
	{ name: "C#m", pitch: 1, frets: [-1, 4, 2, 1, 2, -1] },
	{ name: "C#mmaj11", pitch: 1, frets: [-1, 4, 2, 5, 4, 2] },
	{ name: "C#", pitch: 1, frets: [-1, 4, 3, 1, 2, 1] },
	{ name: "C#mmaj7", pitch: 1, frets: [-1, 4, 2, 1, 1, -1] },
	{ name: "C#mmaj7b5", pitch: 1, frets: [-1, 4, 2, 0, 1, 0] },
	{ name: "C#mmaj9", pitch: 1, frets: [-1, 4, 1, 1, 1, 0] },
	{ name: "C#sus2", pitch: 1, frets: [4, 4, 6, 6, 4, 4] },
	{ name: "C#sus4", pitch: 1, frets: [-1, 4, 4, 1, 2, -1] },
	{ name: "Db", pitch: 1, frets: [-1, 4, 3, 1, 2, 1] },
	{ name: "D6sus4", pitch: 2, frets: [-1, -1, 0, 2, 0, 3] },
	{ name: "D11", pitch: 2, frets: [-1, -1, 0, 0, 1, 2] },
	{ name: "D69", pitch: 2, frets: [-1, 5, 4, 2, 0, 0] },
	{ name: "D13", pitch: 2, frets: [-1, -1, 0, 4, 1, 2] },
	{ name: "D7#9", pitch: 2, frets: [-1, 5, 4, 5, 6, -1] },
	{ name: "D7b5", pitch: 2, frets: [-1, -1, 0, 1, 1, 2] },
	{ name: "D6", pitch: 2, frets: [-1, -1, 0, 2, 0, 2] },
	{ name: "D7", pitch: 2, frets: [-1, -1, 0, 2, 1, 2] },
	{ name: "D7b9", pitch: 2, frets: [-1, -1, 0, 5, 4, 2] },
	{ name: "D7sus4", pitch: 2, frets: [-1, -1, 0, 2, 1, 3] },
	{ name: "D9", pitch: 2, frets: [5, 5, 4, 5, 5, 5] },
	{ name: "D9#11", pitch: 2, frets: [-1, -1, 0, 1, 1, 2] },
	{ name: "D9b5", pitch: 2, frets: [-1, 5, 4, 5, 5, 4] },
	{ name: "Dadd9", pitch: 2, frets: [-1, 5, 4, 2, 5, 2] },
	{ name: "Dalt", pitch: 2, frets: [-1, -1, 0, 1, 3, 2] },
	{ name: "Daug7", pitch: 2, frets: [-1, -1, 0, 3, 1, 2] },
	{ name: "Daug", pitch: 2, frets: [-1, -1, 0, 3, 3, 2] },
	{ name: "Daug9", pitch: 2, frets: [-1, 5, 4, 5, 5, 6] },
	{ name: "Ddim", pitch: 2, frets: [-1, -1, 0, 1, -1, 1] },
	{ name: "Ddim7", pitch: 2, frets: [-1, -1, 0, 1, 0, 1] },
	{ name: "Dm6", pitch: 2, frets: [-1, -1, 0, 2, 0, 1] },
	{ name: "Dm11", pitch: 2, frets: [-1, -1, 0, 0, 1, 1] },
	{ name: "Dm69", pitch: 2, frets: [-1, 5, 3, 2, 0, 0] },
	{ name: "Dm7", pitch: 2, frets: [-1, -1, 0, 2, 1, 1] },
	{ name: "Dm7b5", pitch: 2, frets: [-1, -1, 0, 1, 1, 1] },
	{ name: "Dmadd9", pitch: 2, frets: [-1, 5, 3, 2, 3, 0] },
	{ name: "Dm9", pitch: 2, frets: [1, 0, 0, 2, 1, 0] },
	{ name: "Dmaj11", pitch: 2, frets: [-1, -1, 0, 0, 2, 2] },
	{ name: "Dmaj13", pitch: 2, frets: [-1, -1, 0, 4, 2, 2] },
	{ name: "Dmaj7#5", pitch: 2, frets: [-1, -1, 0, 3, 2, 2] },
	{ name: "Dm", pitch: 2, frets: [-1, -1, 0, 2, 3, 1] },
	{ name: "Dmaj7b5", pitch: 2, frets: [-1, -1, 0, 1, 2, 2] },
	{ name: "Dmaj7", pitch: 2, frets: [-1, -1, 0, 2, 2, 2] },
	{ name: "D", pitch: 2, frets: [-1, -1, 0, 2, 3, 2] },
	{ name: "Dmaj9", pitch: 2, frets: [-1, 5, 2, 2, 2, 2] },
	{ name: "Dmmaj11", pitch: 2, frets: [-1, -1, 0, 0, 2, 1] },
	{ name: "Dsus4", pitch: 2, frets: [-1, -1, 0, 2, 3, 3] },
	{ name: "Dmmaj7", pitch: 2, frets: [-1, -1, 0, 2, 2, 1] },
	{ name: "Dmmaj7b5", pitch: 2, frets: [-1, -1, 0, 1, 2, 1] },
	{ name: "Dmmaj9", pitch: 2, frets: [-1, 5, 3, 6, 5, 0] },
	{ name: "Dsus2", pitch: 2, frets: [-1, -1, 0, 2, 3, 0] },
	{ name: "Dsus6", pitch: 2, frets: [-1, -1, 0, 0, 0, 3] },
	{ name: "E13", pitch: 4, frets: [0, 2, 0, 1, 2, 0] },
	{ name: "E6", pitch: 4, frets: [0, 2, 2, 1, 2, 0] },
	{ name: "E11", pitch: 4, frets: [0, 0, 0, 1, 0, 0] },
	{ name: "E69", pitch: 4, frets: [0, 2, 2, 1, 2, 2] },
	{ name: "E7#9", pitch: 4, frets: [0, 2, 0, 1, 0, 3] },
	{ name: "E7", pitch: 4, frets: [0, 2, 0, 1, 0, 0] },
	{ name: "E7b9", pitch: 4, frets: [0, 2, 0, 1, 0, 1] },
	{ name: "E7b5", pitch: 4, frets: [0, 1, 0, 1, 3, 0] },
	{ name: "E7sus4", pitch: 4, frets: [0, 2, 0, 2, 0, 0] },
	{ name: "E9#11", pitch: 4, frets: [0, 1, 0, 1, 0, 0] },
	{ name: "E9b5", pitch: 4, frets: [0, 1, 2, 1, 3, 2] },
	{ name: "Eadd9", pitch: 4, frets: [0, 2, 2, 1, 0, 2] },
	{ name: "Ealt", pitch: 4, frets: [0, 1, 2, 1, -1, -1] },
	{ name: "E9", pitch: 4, frets: [0, 2, 0, 1, 0, 2] },
	{ name: "Eaug7", pitch: 4, frets: [0, 3, 0, 1, 1, 0] },
	{ name: "Eaug", pitch: 4, frets: [0, 3, 2, 1, 1, 0] },
	{ name: "Eaug9", pitch: 4, frets: [0, 3, 0, 1, 3, 2] },
	{ name: "Em11", pitch: 4, frets: [0, 0, 0, 0, 0, 2] },
	{ name: "Edim", pitch: 4, frets: [-1, -1, 2, 3, -1, 3] },
	{ name: "Edim7", pitch: 4, frets: [0, 1, 2, 0, 2, 0] },
	{ name: "Em6", pitch: 4, frets: [0, 2, 2, 0, 2, 0] },
	{ name: "Em69", pitch: 4, frets: [0, 2, 2, 0, 2, 2] },
	{ name: "Em7", pitch: 4, frets: [0, 2, 0, 0, 0, 0] },
	{ name: "Em9", pitch: 4, frets: [0, 2, 0, 0, 0, 2] },
	{ name: "Em7b5", pitch: 4, frets: [0, 1, 2, 3, 3, 3] },
	{ name: "Emadd9", pitch: 4, frets: [-1, -1, 3, 1, 1, 3] },
	{ name: "Emaj13", pitch: 4, frets: [0, 2, 1, 1, 2, 2] },
	{ name: "Emaj11", pitch: 4, frets: [0, 0, 1, 1, 0, 0] },
	{ name: "Emaj7", pitch: 4, frets: [0, 2, 1, 1, 0, 0] },
	{ name: "Emaj7#5", pitch: 4, frets: [0, 3, 2, 1, 4, 4] },
	{ name: "Emaj7b5", pitch: 4, frets: [0, 1, 1, 1, 4, 0] },
	{ name: "Emaj9", pitch: 4, frets: [0, 2, 1, 1, 0, 2] },
	{ name: "E", pitch: 4, frets: [0, 2, 2, 1, 0, 0] },
	{ name: "Emmaj11", pitch: 4, frets: [0, 0, 1, 0, 0, 2] },
	{ name: "Em", pitch: 4, frets: [0, 2, 2, 0, 0, 0] },
	{ name: "Emmaj7", pitch: 4, frets: [0, 2, 1, 0, 0, 0] },
	{ name: "Emmaj7b5", pitch: 4, frets: [0, 1, 1, 0, -1, 0] },
	{ name: "Esus2", pitch: 4, frets: [2, 2, 2, 4, 5, 2] },
	{ name: "Esus4", pitch: 4, frets: [0, 2, 2, 2, 0, 0] },
	{ name: "Eb13", pitch: 3, frets: [-1, 6, 5, 6, 8, 8] },
	{ name: "Emmaj9", pitch: 4, frets: [0, 2, 1, 0, 0, 2] },
	{ name: "Eb11", pitch: 3, frets: [1, 1, 1, 1, 2, 3] },
	{ name: "Eb6", pitch: 3, frets: [-1, -1, 1, 3, 1, 3] },
	{ name: "Eb69", pitch: 3, frets: [-1, -1, 1, 0, 1, 1] },
	{ name: "Eb7", pitch: 3, frets: [-1, -1, 1, 3, 2, 3] },
	{ name: "Eb7#9", pitch: 3, frets: [-1, -1, 1, 0, 2, 2] },
	{ name: "Eb7b5", pitch: 3, frets: [-1, -1, 1, 2, 2, 3] },
	{ name: "Eb7b9", pitch: 3, frets: [-1, -1, 1, 0, 2, 0] },
	{ name: "Eb7sus4", pitch: 3, frets: [-1, -1, 1, 3, 2, 4] },
	{ name: "Eb9", pitch: 3, frets: [-1, -1, 1, 0, 2, 1] },
	{ name: "Eb9b5", pitch: 3, frets: [-1, 6, 5, 6, 6, 5] },
	{ name: "Eb9#11", pitch: 3, frets: [-1, -1, 1, 2, 2, 3] },
	{ name: "Ebadd9", pitch: 3, frets: [-1, 6, 5, 3, 6, 3] },
	{ name: "Ebalt", pitch: 3, frets: [-1, -1, 1, 2, 4, 3] },
	{ name: "Ebaug", pitch: 3, frets: [-1, -1, 5, 4, 4, 3] },
	{ name: "Ebaug9", pitch: 3, frets: [3, 4, 3, 4, 4, 3] },
	{ name: "Ebaug7", pitch: 3, frets: [-1, -1, 1, 4, 2, 3] },
	{ name: "Ebdim", pitch: 3, frets: [-1, -1, 1, 2, -1, 2] },
	{ name: "Ebdim7", pitch: 3, frets: [-1, -1, 1, 2, 1, 2] },
	{ name: "Ebm11", pitch: 3, frets: [-1, -1, 1, 1, 2, 2] },
	{ name: "Ebm69", pitch: 3, frets: [2, -1, 1, 3, 1, 1] },
	{ name: "Ebm7", pitch: 3, frets: [-1, -1, 1, 3, 2, 2] },
	{ name: "Ebm6", pitch: 3, frets: [-1, 1, 1, 3, 1, 2] },
	{ name: "Ebm7b5", pitch: 3, frets: [-1, -1, 1, 2, 2, 2] },
	{ name: "Ebm9", pitch: 3, frets: [-1, 6, 4, 6, 6, 6] },
	{ name: "Ebmadd9", pitch: 3, frets: [-1, -1, 4, 3, 4, 1] },
	{ name: "Ebmaj11", pitch: 3, frets: [-1, -1, 1, 1, 3, 3] },
	{ name: "Ebmaj13", pitch: 3, frets: [-1, 3, 1, 0, 3, -1] },
	{ name: "Ebmaj7#5", pitch: 3, frets: [3, 6, 5, 4, 3, 3] },
	{ name: "Ebmaj7", pitch: 3, frets: [-1, 1, 1, 3, 3, 3] },
	{ name: "Ebmaj9", pitch: 3, frets: [-1, 6, 3, 3, 3, 3] },
	{ name: "Ebm", pitch: 3, frets: [-1, -1, 1, 3, 4, 2] },
	{ name: "Ebmaj7b5", pitch: 3, frets: [-1, -1, 1, 2, 3, 3] },
	{ name: "Ebmmaj11", pitch: 3, frets: [-1, 1, 1, 1, 3, 2] },
	{ name: "Eb", pitch: 3, frets: [-1, -1, 1, 3, 4, 3] },
	{ name: "Ebmmaj7", pitch: 3, frets: [-1, -1, 1, 3, 3, 2] },
	{ name: "Ebmmaj7b5", pitch: 3, frets: [-1, -1, 1, 2, 3, 2] },
	{ name: "Ebsus2", pitch: 3, frets: [1, 1, 1, 3, 4, 1] },
	{ name: "Ebmmaj9", pitch: 3, frets: [-1, 6, 4, 7, 6, -1] },
	{ name: "F13", pitch: 5, frets: [1, 3, 1, 2, 3, 1] },
	{ name: "Ebsus4", pitch: 3, frets: [-1, -1, 1, 3, 4, 4] },
	{ name: "F6", pitch: 5, frets: [1, -1, 3, 2, 3, 1] },
	{ name: "F11", pitch: 5, frets: [1, 1, 1, 2, 1, 1] },
	{ name: "F69", pitch: 5, frets: [1, 0, 0, 0, 1, 1] },
	{ name: "F7b5", pitch: 5, frets: [1, 0, 1, 2, 0, 1] },
	{ name: "F7#9", pitch: 5, frets: [1, 3, 1, 2, 1, 4] },
	{ name: "F7", pitch: 5, frets: [1, 3, 1, 2, 1, 1] },
	{ name: "F7sus4", pitch: 5, frets: [1, 3, 1, 3, 1, 1] },
	{ name: "F7b9", pitch: 5, frets: [1, 3, 1, 2, 1, 2] },
	{ name: "F9#11", pitch: 5, frets: [1, 0, 1, 0, 0, 1] },
	{ name: "F9b5", pitch: 5, frets: [1, 0, 1, 0, 0, 1] },
	{ name: "Falt", pitch: 5, frets: [1, 2, 3, 2, 0, -1] },
	{ name: "Fadd9", pitch: 5, frets: [-1, -1, 3, 2, 1, 3] },
	{ name: "Faug7", pitch: 5, frets: [1, 0, 1, 2, 2, -1] },
	{ name: "Faug9", pitch: 5, frets: [1, 0, 1, 0, 2, 1] },
	{ name: "Faug", pitch: 5, frets: [-1, -1, 3, 2, 2, 1] },
	{ name: "Fdim", pitch: 5, frets: [-1, -1, 3, 4, -1, 4] },
	{ name: "Fdim7", pitch: 5, frets: [1, -1, 0, 1, 0, 1] },
	{ name: "F9", pitch: 5, frets: [1, 3, 1, 2, 1, 3] },
	{ name: "Fm11", pitch: 5, frets: [1, 1, 1, 1, 1, 3] },
	{ name: "Fm69", pitch: 5, frets: [1, 3, 3, 1, 3, 3] },
	{ name: "Fm6", pitch: 5, frets: [1, -1, 0, 1, 1, 1] },
	{ name: "Fm7", pitch: 5, frets: [1, 3, 1, 1, 1, 1] },
	{ name: "Fm7b5", pitch: 5, frets: [1, -1, 1, 1, 0, -1] },
	{ name: "Fmaj11", pitch: 5, frets: [1, 1, 2, 2, 1, 1] },
	{ name: "Fm9", pitch: 5, frets: [1, 3, 1, 1, 1, 3] },
	{ name: "Fmadd9", pitch: 5, frets: [-1, -1, 3, 1, 1, 3] },
	{ name: "Fmaj13", pitch: 5, frets: [1, 0, 0, 0, 1, 0] },
	{ name: "Fmaj7#5", pitch: 5, frets: [1, 0, 2, 2, 2, 0] },
	{ name: "Fmaj7", pitch: 5, frets: [-1, -1, 3, 2, 1, 0] },
	{ name: "Fmaj7b5", pitch: 5, frets: [1, 0, 2, 2, 0, 0] },
	{ name: "Fmaj9", pitch: 5, frets: [1, 0, 2, 0, 1, 0] },
	{ name: "Fmmaj11", pitch: 5, frets: [1, 1, 2, 1, 1, 3] },
	{ name: "F", pitch: 5, frets: [1, 3, 3, 2, 1, 1] },
	{ name: "Fm", pitch: 5, frets: [1, 3, 3, 1, 1, 1] },
	{ name: "Fmmaj7", pitch: 5, frets: [1, 3, 2, 1, 1, 1] },
	{ name: "Fmmaj7b5", pitch: 5, frets: [1, 2, 2, 1, 0, 0] },
	{ name: "F#11", pitch: 6, frets: [2, 1, 2, 1, 0, 0] },
	{ name: "Fmmaj9", pitch: 5, frets: [1, 3, 2, 1, 1, 3] },
	{ name: "Fsus2", pitch: 5, frets: [1, 3, 3, -1, 1, 3] },
	{ name: "F#6", pitch: 6, frets: [2, -1, 1, 3, 2, -1] },
	{ name: "F#13", pitch: 6, frets: [2, 2, 1, 3, 0, 0] },
	{ name: "Fsus4", pitch: 5, frets: [1, 3, 3, 3, 1, 1] },
	{ name: "F#69", pitch: 6, frets: [2, 1, 1, 1, 2, 2] },
	{ name: "F#7#9", pitch: 6, frets: [2, 1, 2, 2, 2, 2] },
	{ name: "F#7", pitch: 6, frets: [2, 4, 2, 3, 2, 2] },
	{ name: "F#7b9", pitch: 6, frets: [2, 1, 2, 0, 2, 0] },
	{ name: "F#7sus4", pitch: 6, frets: [2, 4, 2, 4, 2, 2] },
	{ name: "F#9#11", pitch: 6, frets: [2, 1, 2, 1, 1, 2] },
	{ name: "F#7b5", pitch: 6, frets: [2, -1, 2, 3, 1, -1] },
	{ name: "F#aug", pitch: 6, frets: [-1, -1, 4, 3, 3, 2] },
	{ name: "F#add9", pitch: 6, frets: [2, 1, -1, 1, 2, 2] },
	{ name: "F#9", pitch: 6, frets: [2, 4, 2, 3, 2, 4] },
	{ name: "F#9b5", pitch: 6, frets: [2, 1, 2, 1, 1, 2] },
	{ name: "F#alt", pitch: 6, frets: [-1, -1, 4, 3, 1, 2] },
	{ name: "F#aug7", pitch: 6, frets: [2, -1, 2, 3, 3, -1] },
	{ name: "F#aug9", pitch: 6, frets: [2, 1, 2, 1, 3, 0] },
	{ name: "F#dim7", pitch: 6, frets: [2, -1, 1, 2, 1, -1] },
	{ name: "F#dim", pitch: 6, frets: [2, 0, -1, 2, 1, -1] },
	{ name: "F#m6", pitch: 6, frets: [2, -1, 1, 2, 2, 2] },
	{ name: "F#m11", pitch: 6, frets: [2, 0, 2, 1, 0, 0] },
	{ name: "F#m69", pitch: 6, frets: [2, 0, 1, 1, 2, 2] },
	{ name: "F#m7b5", pitch: 6, frets: [2, 0, 2, 2, 1, 0] },
	{ name: "F#madd9", pitch: 6, frets: [-1, -1, 4, 2, 2, 4] },
	{ name: "F#m9", pitch: 6, frets: [2, 0, 2, 1, 2, 0] },
	{ name: "F#m7", pitch: 6, frets: [2, 4, 2, 2, 2, 2] },
	{ name: "F#maj13", pitch: 6, frets: [2, 1, 1, 1, 2, 1] },
	{ name: "F#maj11", pitch: 6, frets: [2, 2, 3, 3, 2, 2] },
	{ name: "F#maj7#5", pitch: 6, frets: [2, -1, 3, 3, 3, -1] },
	{ name: "F#maj7b5", pitch: 6, frets: [2, 1, 3, 3, 1, 1] },
	{ name: "F#maj7", pitch: 6, frets: [2, 4, 3, 3, 2, 2] },
	{ name: "F#maj9", pitch: 6, frets: [2, 1, 3, 1, 2, 1] },
	{ name: "F#", pitch: 6, frets: [2, 4, 4, 3, 2, 2] },
	{ name: "F#mmaj11", pitch: 6, frets: [2, 2, 3, 2, 2, 4] },
	{ name: "F#m", pitch: 6, frets: [2, 4, 4, 2, 2, 2] },
	{ name: "F#mmaj7b5", pitch: 6, frets: [2, 3, 3, 2, -1, 2] },
	{ name: "F#mmaj7", pitch: 6, frets: [2, 4, 3, 2, 2, 2] },
	{ name: "F#sus2", pitch: 6, frets: [2, -1, -1, 1, 2, 2] },
	{ name: "F#sus4", pitch: 6, frets: [2, 4, 4, 4, 2, 2] },
	{ name: "F#mmaj9", pitch: 6, frets: [2, 0, 3, 1, 2, 1] },
	{ name: "G13", pitch: 7, frets: [3, 0, 2, 0, 0, 1] },
	{ name: "G11", pitch: 7, frets: [3, 2, 0, 0, 1, 1] },
	{ name: "G6", pitch: 7, frets: [3, 2, 0, 0, 0, 0] },
	{ name: "G69", pitch: 7, frets: [3, 0, 0, 0, 0, 0] },
	{ name: "G7#9", pitch: 7, frets: [3, 2, 0, 3, 0, 1] },
	{ name: "G7b9", pitch: 7, frets: [3, 2, 0, 1, 3, 1] },
	{ name: "G7", pitch: 7, frets: [3, 2, 0, 0, 0, 1] },
	{ name: "G7b5", pitch: 7, frets: [3, -1, 3, 4, 2, -1] },
	{ name: "G7sus4", pitch: 7, frets: [3, 3, 0, 0, 1, 1] },
	{ name: "G9#11", pitch: 7, frets: [3, 2, 3, 2, 2, 3] },
	{ name: "G9", pitch: 7, frets: [3, 0, 0, 0, 0, 1] },
	{ name: "G9b5", pitch: 7, frets: [3, 2, 3, 2, 2, 3] },
	{ name: "Galt", pitch: 7, frets: [3, 2, -1, 0, 2, 3] },
	{ name: "Gaug", pitch: 7, frets: [3, 2, 1, 0, 0, -1] },
	{ name: "Gadd9", pitch: 7, frets: [3, 0, 0, 2, 0, 3] },
	{ name: "Gaug7", pitch: 7, frets: [3, 2, 1, 0, 0, 1] },
	{ name: "Gaug9", pitch: 7, frets: [3, 0, 1, 0, 0, 1] },
	{ name: "Gm11", pitch: 7, frets: [3, -1, 3, 3, 1, -1] },
	{ name: "Gdim", pitch: 7, frets: [3, 1, -1, 3, 2, -1] },
	{ name: "Gm6", pitch: 7, frets: [3, -1, 2, 3, 3, 3] },
	{ name: "Gm7", pitch: 7, frets: [3, 5, 3, 3, 3, 3] },
	{ name: "Gm69", pitch: 7, frets: [3, 1, 0, 2, 3, 0] },
	{ name: "Gm7b5", pitch: 7, frets: [3, -1, -1, 3, 2, 1] },
	{ name: "Gm9", pitch: 7, frets: [3, 0, 0, 3, 3, 1] },
	{ name: "Gdim7", pitch: 7, frets: [3, 1, -1, 3, 2, 0] },
	{ name: "Gmaj11", pitch: 7, frets: [3, 2, 0, 0, 1, 2] },
	{ name: "Gmadd9", pitch: 7, frets: [3, 1, 0, 2, 3, 3] },
	{ name: "Gmaj13", pitch: 7, frets: [3, 2, 2, 2, 3, 2] },
	{ name: "Gmaj7b5", pitch: 7, frets: [3, 2, 4, 4, 2, 2] },
	{ name: "Gmaj7", pitch: 7, frets: [3, 2, 0, 0, 0, 2] },
	{ name: "Gmaj7#5", pitch: 7, frets: [-1, -1, 1, 0, 0, 2] },
	{ name: "Gm", pitch: 7, frets: [3, 1, 0, 0, 3, 3] },
	{ name: "Gmmaj11", pitch: 7, frets: [3, 3, 4, 3, 3, 5] },
	{ name: "G", pitch: 7, frets: [3, 2, 0, 0, 0, 3] },
	{ name: "Gmaj9", pitch: 7, frets: [3, 0, 0, 0, 0, 2] },
	{ name: "Gmmaj7b5", pitch: 7, frets: [3, 4, 4, 3, -1, 3] },
	{ name: "Gmmaj7", pitch: 7, frets: [3, 1, 0, 0, 3, 2] },
	{ name: "Gsus2", pitch: 7, frets: [3, 0, 0, 0, 3, 3] },
	{ name: "Gmmaj9", pitch: 7, frets: [3, 0, 0, 3, 3, 2] },
	{ name: "Gsus4", pitch: 7, frets: [3, 3, 0, 0, 1, 3] },
	{ name: "G#m", pitch: 6, frets: [4, 6, 6, 4, 4, 4] }
];



let scaleModes: IntervalMode[] = [
	{ name: 'Ionian', steps: /*      */[0, 2, 4, 5, 7, 9, 11, 12], flat: false, priority: 7 }//C
	, { name: 'Dorian', steps: /*    */[0, 2, 3, 5, 7, 9, 10, 12], flat: true, priority: 5 }//D
	, { name: 'Phrygian', steps: /*  */[0, 1, 3, 5, 7, 8, 10, 12], flat: true, priority: 4 }//E
	, { name: 'Lydian', steps: /*    */[0, 2, 4, 6, 7, 9, 11, 12], flat: false, priority: 3 }//F
	, { name: 'Mixolydian', steps: /**/[0, 2, 4, 5, 7, 9, 10, 12], flat: false, priority: 2 }//G
	, { name: 'Aeolian', steps: /*   */[0, 2, 3, 5, 7, 8, 10, 12], flat: true, priority: 6 }//A
	, { name: 'Locrian', steps: /*   */[0, 1, 3, 5, 6, 8, 10, 12], flat: true, priority: 1 }//B
];

let progressionsList: ProgDescr[] = [
	//{ category: 'test', name: '', chords: 'C-Ab-Bb-C' },
	//
	//{ category: 'minor', name: '', chords: 'D-C-Bb-F' }
	{ category: 'minor', name: '', chords: 'Fmaj7-A' }
	//
	, { category: 'minor', name: '', chords: 'Am-B-Gm' }
	, { category: 'minor', name: '', chords: 'Am-Dm-E' }
	, { category: 'blues', name: '', chords: 'C#m-E-B-A' }
	//
	, { category: 'minor', name: '', chords: 'Am-C-Dm-Em' }
	, { category: 'minor', name: '', chords: 'Am-D7-E7-Am' }
	, { category: 'minor', name: '', chords: 'Am-D9-Fm-C' }
	, { category: 'minor', name: '', chords: 'Am-Dm-F-G' }
	, { category: 'minor', name: '', chords: 'Am-Dm-Fm-C' }
	, { category: 'minor', name: '', chords: 'Am-Em-G-Dm' }
	, { category: 'minor', name: '', chords: 'Am-F-C-G' }
	, { category: 'minor', name: '', chords: 'Am-F-Em-Am' }
	, { category: 'minor', name: '', chords: 'Am-G-Dm7' }
	, { category: 'minor', name: '', chords: 'Am-G-Em-F' }
	, { category: 'minor', name: '', chords: 'Am-G-F-E7' }

	, { category: 'minor', name: '', chords: 'Bm-A-G-F#' }
	, { category: 'minor', name: '', chords: 'C-Am-Dm-G' }
	, { category: 'minor', name: '', chords: 'C-D7-Fm-C' }
	, { category: 'minor', name: '', chords: 'C-D7-G7-C' }
	, { category: 'minor', name: '', chords: 'C-E-Am7-F' }
	, { category: 'minor', name: '', chords: 'Dm-Am-C-G' }
	, { category: 'minor', name: '', chords: 'Dm-F-Am-G' }
	, { category: 'minor', name: '', chords: 'Em-B-C-Am' }
	, { category: 'minor', name: '', chords: 'Em-B-G-Em' }
	, { category: 'minor', name: '', chords: 'Em-C-G-D' }
	, { category: 'minor', name: '', chords: 'Em-D-C-D' }
	, { category: 'minor', name: '', chords: 'Em-D-C-B' }
	, { category: 'minor', name: '', chords: 'Em-G-C-Am' }
	, { category: 'rock', name: '', chords: 'Em-G-Dsus4-A7sus4' }
	, { category: 'minor', name: '', chords: 'F-Em7-Am-G' }
	, { category: 'minor', name: '', chords: 'G-C-D-Em' }
	//
	, { category: 'minor', name: '', chords: 'Dm-Gm-Dm-A-Dm' }
	, { category: 'minor', name: '', chords: 'F-Em-Am-G-Am' }
	//, { category: 'rock', name: '', chords: 'F-Em-Am-G-Am' }
	//
	, { category: 'minor', name: '', chords: 'Am-C-D-Am-C-Am' }
	, { category: 'minor', name: '', chords: 'Am-Dsus4-Dm-F-G-Dm7' }
	, { category: 'minor', name: '', chords: 'Am-F7-G-Em-F-G' }
	, { category: 'minor', name: '', chords: 'Am-G-C-F-E-E7' }
	, { category: 'minor', name: '', chords: 'Am-G-Dm-F-G-Am' }
	//
	, { category: 'minor', name: '', chords: 'Am-E-Em-D-Dm-Am-Adim-E' }
	, { category: 'minor', name: '', chords: 'Am-F-E7-Am-Dm7-Gsus4-F-E7' }
	, { category: 'minor', name: '', chords: 'Gm-Cm-F-Bb-Eb-Adim-D-Gm' }
	, { category: 'epic', name: '', chords: 'Dm-Bb-C-Gm-Bb-F-Gm-Dm' }
	///////////////////////
	, { category: 'jazz', name: '', chords: 'Am-G-D' }
	, { category: 'jazz', name: '', chords: 'C-Gm-Dm' }
	, { category: 'jazz', name: '', chords: 'Cmaj7-Cm7-F7' }
	, { category: 'jazz', name: '', chords: 'Dm7-G7-Cmaj7' }
	//
	, { category: 'nice', name: '', chords: 'Am7-Em7-Dsus4-Dm7' }
	, { category: 'jazz', name: '', chords: 'Am-F7-D7-E7' }
	, { category: 'minor', name: '', chords: 'Am7-F7-G-Em7' }

	, { category: 'jazz', name: '', chords: 'C-Am-E-G' }
	, { category: 'jazz', name: '', chords: 'C-D7-F-C' }
	, { category: 'jazz', name: '', chords: 'C-F-G-G7' }
	, { category: 'jazz', name: '', chords: 'Cm7-Ab7-G7' }
	, { category: 'jazz', name: '', chords: 'Cmaj7-Gm7-C7-Fmaj7' }
	, { category: 'jazz', name: '', chords: 'D7-G7-C7-F7' }
	, { category: 'jazz', name: '', chords: 'Dm7-G7-Cmaj7-C6' }
	, { category: 'pop', name: '', chords: 'F#m7-B7-E-A' }
	//
	, { category: 'jazz', name: '', chords: 'Cmaj7-D7-Dm7-G7-Cmaj7' }
	, { category: 'rock', name: '', chords: 'Em-G-D-C-A' }

	//
	, { category: 'jazz', name: '', chords: 'Cmaj7-Am7-Dm7-G7-Em7-A7-Dm7-G7' }
	//
	, { category: 'jazz', name: '', chords: 'Cmaj7-C7-Fmaj7-Fm7-Em7-A7-Dm7-G7-Cmaj7' }
	///////////////////////////
	, { category: 'major', name: '', chords: 'A-D-E' }
	, { category: 'major', name: '', chords: 'Am-D-G' }
	, { category: 'major', name: '', chords: 'C-Am-F' }
	, { category: 'major', name: '', chords: 'C-F-G' }
	, { category: 'rock', name: '', chords: 'D-C-G' }
	, { category: 'nice', name: '', chords: 'F-Am-G' }
	, { category: 'blues', name: '', chords: 'F-Bb-C' }
	, { category: 'major', name: '', chords: 'G-C-D' }
	//
	, { category: 'blues', name: '', chords: 'Am-G-D-F' }
	, { category: 'triumphant', name: '', chords: 'C-Ab-Bb-C' }
	, { category: 'major', name: '', chords: 'C-Am-Em-F' }
	, { category: 'happy', name: '', chords: 'C-Am-F-G' }
	, { category: 'major', name: '', chords: 'C-Dm-F-G' }
	, { category: 'epic', name: '', chords: 'C-G-Am-F' }
	, { category: 'nice', name: '', chords: 'C-F-G-Am' }
	, { category: 'major', name: '', chords: 'C-F-C-G' }
	, { category: 'major', name: '', chords: 'C-F-Dm-G' }
	, { category: 'major', name: '', chords: 'C-F-G-F' }
	, { category: 'epic', name: '', chords: 'C-Fm-Bb7-C' }
	, { category: 'epic', name: '', chords: 'Cm-Ab-Eb-Bb' }
	, { category: 'major', name: '', chords: 'D-A-C-G' }
	, { category: 'major', name: '', chords: 'D-C-G-D' }
	, { category: 'rock', name: '', chords: 'D-C-Bb-F' }
	, { category: 'rock', name: '', chords: 'D-G-Bm-A' }
	, { category: 'major', name: '', chords: 'E-B-C#m-A' }
	, { category: 'major', name: '', chords: 'E-G-A-G' }
	, { category: 'major', name: '', chords: 'F-Am-G-D' }
	, { category: 'major', name: '', chords: 'F-C-Dm-Bb' }
	, { category: 'major', name: '', chords: 'F-G-Am-Em' }
	, { category: 'epic', name: '', chords: 'Fm-Db-Ab-Eb' }
	, { category: 'major', name: '', chords: 'G-C-D-C' }
	, { category: 'major', name: '', chords: 'G-C-F-C' }
	, { category: 'major', name: '', chords: 'G-D-Em-C' }
	, { category: 'major', name: '', chords: 'G-Em-C-D' }
	//
	, { category: 'major', name: '', chords: 'C-G-F-G-C' }
	, { category: 'rock', name: '', chords: 'D-F-G-C-G' }
	, { category: 'major', name: '', chords: 'D-G-D-A-D' }
	, { category: 'rock', name: '', chords: 'E-B-C#m-G#m-A' }
	, { category: 'epic', name: '', chords: 'F-Am-F-G-C' }
	//
	, { category: 'major', name: '', chords: 'A-E-F#m-D-A-E' }
	, { category: 'major', name: '', chords: 'C-Dm-Am7-F-G-C' }
	//
	, { category: 'epic', name: '', chords: 'Am-Em-G-D-Am-Cmaj7-G-D' }
	, { category: 'epic', name: '', chords: 'C-G-Am-Em-F-C-F-G' }
	, { category: 'major', name: '', chords: 'D-A-Bm-F#m-G-D-G-A' }

	, { category: 'epic', name: '', chords: 'E-C-D-Em-Em-G-Am-Bm' }
	, { category: 'major', name: '', chords: 'F-Bb-Edim-Am-Dm-Gm-C-F' }
	, { category: 'major', name: '', chords: 'G-D-Em-Bm-C-G-C-D' }
];

let drumBeatPatterns: ZvoogTrack[] = [
	//new DrumTechno1().track()
	//, new SimpleDrum1().track()
	//, new SimpleDrum2().track()
];
let strumPatterns: string[] = [
	'V-A-X-A-'
	, 'V---A-V---A-V-A-'
];


