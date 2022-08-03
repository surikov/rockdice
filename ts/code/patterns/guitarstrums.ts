let guitarstrums:string[]=[
'X'
];


//dumpriff v1.03
//https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=64-21003450-60804004-0c0d0e050709100f080e-00c3010302c3030304c3050306c307db4030413042304330443045304630472480fe81ff82ff83ff84ff85ff86ff87ffe001-000032e40001021b40001021d40001022240004032e40005030a40021021b40021021d40021022240041021b40041021d40041022240046010a40046011640056010840056011440061021b40061021d40061022240065020a40066020a40066021640081021840081021d400810220400850305400860305400860311400a10218400a1021d400a10220400a40229400c10218400c1021d400c10220400c40224400e10218400e1021d400e10220400e40220400e5020540101021840101021d40101022040104022940105030540121021840121021d40121022040124022440141021840141021d40141022040144042040146010a40146011640156010840156011440161021840161021d40161022040165020540166020a40166021640181021b40181021f401810222401850307401860307401860313401a1021b401a1021f401a10222401a40229401c1021b401c1021f401c10222401c40227401e1021b401e1021f401e10222401e40222401e5020740201021b40201021f40201022240204022940205030740221021b40221021f40221022240224022740241021b40241021f40241022240244042240246010a40246011640256010840256011440261021b40261021f40261022240265020740266020a40266021640281021b40281021d402810220402810224402850308402860308402860314402a0022c402a1021b402a1021d402a10220402a10224402a4022c402c0022b402c1021b402c1021d402c10220402c10224402c4022b402e00229402e1021b402e1021d402e10220402e10224402e40229402e5020840300022740301021b40301021d40301022040301022440304022740305030840320022440321021b40321021d40321022040321022440324022440340022240341021b40341021d40341022040341022440344022240360022040361021b40361021d40361022040361022440364022040365020840380022240381021b40381021d40381022240384022240385030a403a00222403a1021b403a1021d403a10222403a40222403c00222403c1021b403c1021d403c10222403c40222403e00226403e1021b403e1021d403e10222403e40226403e5020a40-000000000000000000000000-000000000000000000000000
function songcreate() {
    let sch:ZvoogSchedule = {title:'strums',
     tracks: [
       {title:'drums',effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 119}]}]}
       ],voices:[
           {bass:false, title: "Bass drum", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 67.83}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafdrum", initial: "1", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 1, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 7, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 9, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 1, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 7, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 9, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 1, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 7, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 9, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 1, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 7, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 9, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 11, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ,{when: {count: 15, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 35 }]}]}
                  ]}
               ]}
           ,{bass:false, title: "Snare drum", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 95.2}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafdrum", initial: "16", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 13, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 13, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 13, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ,{when: {count: 13, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 38 }]}]}
                  ]}
               ]}
           ,{bass:false, title: "Closed Hi-hat", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 23.8}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafdrum", initial: "36", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 1, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 3, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 7, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 9, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 11, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 13, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 15, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 1, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 3, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 7, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 9, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 11, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 13, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 15, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 1, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 3, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 7, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 9, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 11, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 13, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 15, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 1, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 3, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 7, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 9, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 11, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 13, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ,{when: {count: 15, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 42 }]}]}
                  ]}
               ]}
           ,{bass:false, title: "Splash Cymbal", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 14.28}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafdrum", initial: "71", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 49 }]}]}
                  ]}
               ,{chords: [
                  ]}
               ,{chords: [
                  ]}
               ,{chords: [
                  ]}
               ]}
           ]}
       ,{title:'melody',effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 119}]}]}
       ],voices:[
           {bass:false, title: "Distortion guitar", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 16.66}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafinstrument", initial: "339", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 82 }]}]}
                  ]}
               ,{chords: [
                  ]}
               ,{chords: [
                  {when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 80 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 79 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 77 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 75 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 74 }]}]}
                  ]}
               ]}
           ,{bass:false, title: "Acoustic guitar", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 5.95}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafinstrument", initial: "258", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 60 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 60 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 60 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 60 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 60 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 60 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 60 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 60 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 67 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 67 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 67 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 67 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 67 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 67 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 67 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 67 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 63 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 65 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ]}
               ]}
           ,{bass:false, title: "Acoustic Piano", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 17.849999999999998}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafinstrument", initial: "7", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 82 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 77 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 77 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 77 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 75 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 77 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 75 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 4, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 80 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 79 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 77 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 75 }]}]}
                  ,{when: {count: 2, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 72 }]}]}
                  ,{when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 68 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 10, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 12, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 70 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 74 }]}]}
                  ]}
               ]}
           ,{bass:true, title: "Bass guitar", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 35.699999999999996}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafinstrument", initial: "384", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 34 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 34 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 29 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 29 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 29 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 29 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 31 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 31 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 31 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 31 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 32 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 32 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 0, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 32 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 32 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 34 }]}]}
                  ,{when: {count: 14, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 34 }]}]}
                  ]}
               ]}
           ,{bass:false, title: "String Ensemble", effects: [{pluginEffect: null, kind: "gain", initial: "", parameters: [{points: [{skipMeasures: 0, skip384: 0, velocity: 17.849999999999998}]}]}
                  ,{pluginEffect: null, kind: "equalizer", initial: "", parameters: [
                      {points: [{skipMeasures: 0, skip384: 0, velocity: 2/10*60+60}]}//32
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 3/10*60+60}]}//64
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//128
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -5/10*60+60}]}//256
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -3/10*60+60}]}//512
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -1/10*60+60}]}//1k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 6/10*60+60}]}//2k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 5/10*60+60}]}//4k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: -2/10*60+60}]}//8k
                      ,{points: [{skipMeasures: 0, skip384: 0, velocity: 4/10*60+60}]}//16k
                  ]}]
              , source: { pluginSource: null, kind:"wafinstrument", initial: "545", parameters: []}
              , stringPattern:null
              , strumPattern:null
              , keyPattern:null
              , measureChords:[
               {chords: [
                  {when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 1, division: 16 }, pitch: 46 }]},{pitches: [{ duration: { count: 1, division: 16 }, pitch: 58 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 1, division: 16 }, pitch: 44 }]},{pitches: [{ duration: { count: 1, division: 16 }, pitch: 56 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 46 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 58 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 41 }]},{pitches: [{ duration: { count: 3, division: 16 }, pitch: 53 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 1, division: 16 }, pitch: 46 }]},{pitches: [{ duration: { count: 1, division: 16 }, pitch: 58 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 1, division: 16 }, pitch: 44 }]},{pitches: [{ duration: { count: 1, division: 16 }, pitch: 56 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 46 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 58 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 43 }]},{pitches: [{ duration: { count: 3, division: 16 }, pitch: 55 }]}]}
                  ]}
               ,{chords: [
                  {when: {count: 4, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 1, division: 16 }, pitch: 46 }]},{pitches: [{ duration: { count: 1, division: 16 }, pitch: 58 }]}]}
                  ,{when: {count: 5, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 1, division: 16 }, pitch: 44 }]},{pitches: [{ duration: { count: 1, division: 16 }, pitch: 56 }]}]}
                  ,{when: {count: 6, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 2, division: 16 }, pitch: 46 }]},{pitches: [{ duration: { count: 2, division: 16 }, pitch: 58 }]}]}
                  ,{when: {count: 8, division: 16},variation:0, envelopes: [{pitches: [{ duration: { count: 3, division: 16 }, pitch: 44 }]},{pitches: [{ duration: { count: 3, division: 16 }, pitch: 56 }]}]}
                  ]}
               ,{chords: [
                  ]}
               ]}
           ]}
       ]
     , effects: [
              {pluginEffect: null, kind: "echo", initial: "", parameters: [
                  {points: [{skipMeasures: 0, skip384: 0, velocity: 0.5*119}]}//reverberator
                  ,{points: [{skipMeasures: 0, skip384: 0, velocity: 0.5*119}]}//threshold
                  ,{points: [{skipMeasures: 0, skip384: 0, velocity: 0.9*119}]}//knee
                  ,{points: [{skipMeasures: 0, skip384: 0, velocity: 0.5*119}]}//ratio
                  ,{points: [{skipMeasures: 0, skip384: 0, velocity: 0.02*119}]}//attack
                  ,{points: [{skipMeasures: 0, skip384: 0, velocity: 0.25*119}]}//release
                  ]}
              ,{pluginEffect: null, kind: "gain", initial: "", parameters: [
                  {points: [{skipMeasures: 0, skip384: 0, velocity: 119}]}
                  ]}
             ]
     , measures: [
           {meter: { count: 4 , division: 4 } , tempo:100}
           ,{meter: { count: 4 , division: 4 } , tempo:100}
           ,{meter: { count: 4 , division: 4 } , tempo:100}
           ,{meter: { count: 4 , division: 4 } , tempo:100}
       ]
     , harmony: {
		 //base: 0
		 tone:"C"
         , mode: "Ionian"
         , progression: [
             { duration: { count: 4, division: 1 }, chord: "C" }
             ]
       }
   };
   return sch;
  }

