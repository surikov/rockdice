'use strict';



// util
function fillStr (s, num) { return Array(num + 1).join(s) }
function isNum (x) { return typeof x === 'number' }
function isStr (x) { return typeof x === 'string' }
function isDef (x) { return typeof x !== 'undefined' }
function midiToFreq (midi, tuning) {
  return Math.pow(2, (midi - 69) / 12) * (tuning || 440)
}

var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/
/**
 * A regex for matching note strings in scientific notation.
 *
 * @name regex
 * @function
 * @return {RegExp} the regexp used to parse the note name
 *
 * The note string should have the form `letter[accidentals][octave][element]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * The executed regex contains (by array index):
 *
 * - 0: the complete string
 * - 1: the note letter
 * - 2: the optional accidentals
 * - 3: the optional octave
 * - 4: the rest of the string (trimmed)
 *
 * @example
 * var parser = require('note-parser')
 * parser.regex.exec('c#4')
 * // => ['c#4', 'c', '#', '4', '']
 * parser.regex.exec('c#4 major')
 * // => ['c#4major', 'c', '#', '4', 'major']
 * parser.regex().exec('CMaj7')
 * // => ['CMaj7', 'C', '', '', 'Maj7']
 */
//export 
function regex () { return REGEX }

var SEMITONES = [0, 2, 4, 5, 7, 9, 11]
/**
 * Parse a note name in scientific notation an return it's components,
 * and some numeric properties including midi number and frequency.
 *
 * @name parse
 * @function
 * @param {String} note - the note string to be parsed
 * @param {Boolean} isTonic - true the strings it's supposed to contain a note number
 * and some category (for example an scale: 'C# major'). It's false by default,
 * but when true, en extra tonicOf property is returned with the category ('major')
 * @param {Float} tunning - The frequency of A4 note to calculate frequencies.
 * By default it 440.
 * @return {Object} the parsed note name or null if not a valid note
 *
 * The parsed note name object will ALWAYS contains:
 * - letter: the uppercase letter of the note
 * - acc: the accidentals of the note (only sharps or flats)
 * - pc: the pitch class (letter + acc)
 * - step: s a numeric representation of the letter. It's an integer from 0 to 6
 * where 0 = C, 1 = D ... 6 = B
 * - alt: a numeric representation of the accidentals. 0 means no alteration,
 * positive numbers are for sharps and negative for flats
 * - chroma: a numeric representation of the pitch class. It's like midi for
 * pitch classes. 0 = C, 1 = C#, 2 = D ... 11 = B. Can be used to find enharmonics
 * since, for example, chroma of 'Cb' and 'B' are both 11
 *
 * If the note has octave, the parser object will contain:
 * - oct: the octave number (as integer)
 * - midi: the midi number
 * - freq: the frequency (using tuning parameter as base)
 *
 * If the parameter `isTonic` is set to true, the parsed object will contain:
 * - tonicOf: the rest of the string that follows note name (left and right trimmed)
 *
 * @example
 * var parse = require('note-parser').parse
 * parse('Cb4')
 * // => { letter: 'C', acc: 'b', pc: 'Cb', step: 0, alt: -1, chroma: -1,
 *         oct: 4, midi: 59, freq: 246.94165062806206 }
 * // if no octave, no midi, no freq
 * parse('fx')
 * // => { letter: 'F', acc: '##', pc: 'F##', step: 3, alt: 2, chroma: 7 })
 */
//export 
function parse (str, isTonic, tuning) {
  if (typeof str !== 'string') return null
  var m = REGEX.exec(str)
  if (!m || (!isTonic && m[4])) return null

  var p = { letter: m[1].toUpperCase(), acc: m[2].replace(/x/g, '##') }
  p.pc = p.letter + p.acc
  p.step = (p.letter.charCodeAt(0) + 3) % 7
  p.alt = p.acc[0] === 'b' ? -p.acc.length : p.acc.length
  var pos = SEMITONES[p.step] + p.alt
  p.chroma = pos < 0 ? 12 + pos : pos % 12
  if (m[3]) { // has octave
    p.oct = +m[3]
    p.midi = pos + 12 * (p.oct + 1)
    p.freq = midiToFreq(p.midi, tuning)
  }
  if (isTonic) p.tonicOf = m[4]
  return p
}

var LETTERS = 'CDEFGAB'
function accStr (n) { return !isNum(n) ? '' : n < 0 ? fillStr('b', -n) : fillStr('#', n) }
function octStr (n) { return !isNum(n) ? '' : '' + n }

/**
 * Create a string from a parsed object or `step, alteration, octave` parameters
 * @param {Object} obj - the parsed data object
 * @return {String} a note string or null if not valid parameters
 * @since 1.2
 * @example
 * parser.build(parser.parse('cb2')) // => 'Cb2'
 *
 * @example
 * // it accepts (step, alteration, octave) parameters:
 * parser.build(3) // => 'F'
 * parser.build(3, -1) // => 'Fb'
 * parser.build(3, -1, 4) // => 'Fb4'
 */
//export 
function build (s, a, o) {
  if (s === null || typeof s === 'undefined') return null
  if (s.step) return build(s.step, s.alt, s.oct)
  if (s < 0 || s > 6) return null
  return LETTERS.charAt(s) + accStr(a) + octStr(o)
}

/**
 * Get midi of a note
 *
 * @name midi
 * @function
 * @param {String|Integer} note - the note name or midi number
 * @return {Integer} the midi number of the note or null if not a valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.midi('A4') // => 69
 * parser.midi('A') // => null
 * @example
 * // midi numbers are bypassed (even as strings)
 * parser.midi(60) // => 60
 * parser.midi('60') // => 60
 */
//export 
function midi (note) {
  if ((isNum(note) || isStr(note)) && note >= 0 && note < 128) return +note
  var p = parse(note)
  return p && isDef(p.midi) ? p.midi : null
}

/**
 * Get freq of a note in hertzs (in a well tempered 440Hz A4)
 *
 * @name freq
 * @function
 * @param {String} note - the note name or note midi number
 * @param {String} tuning - (Optional) the A4 frequency (440 by default)
 * @return {Float} the freq of the number if hertzs or null if not valid note
 * @example
 * var parser = require('note-parser')
 * parser.freq('A4') // => 440
 * parser.freq('A') // => null
 * @example
 * // can change tuning (440 by default)
 * parser.freq('A4', 444) // => 444
 * parser.freq('A3', 444) // => 222
 * @example
 * // it accepts midi numbers (as numbers and as strings)
 * parser.freq(69) // => 440
 * parser.freq('69', 442) // => 442
 */
//export 
function freq (note, tuning) {
  var m = midi(note)
  return m === null ? null : midiToFreq(m, tuning)
}

//export 
function letter (src) { return (parse(src) || {}).letter }
//export 
function acc (src) { return (parse(src) || {}).acc }
//export 
function pc (src) { return (parse(src) || {}).pc }
//export 
function step (src) { return (parse(src) || {}).step }
//export 
function alt (src) { return (parse(src) || {}).alt }
//export 
function chroma (src) { return (parse(src) || {}).chroma }
//export 
function oct (src) { return (parse(src) || {}).oct }


//Object.defineProperty(exports, '__esModule', { value: true });

//var noteParser = require('note-parser');

/**
 * A midi note number is a number representation of a note pitch. It can be
 * integers so it's equal tempered tuned, or float to indicate it's not
 * tuned into equal temepered scale.
 *
 * This module contains functions to convert to and from midi notes.
 *
 * @example
 * var midi = require('tonal-midi')
 * midi.toMidi('A4') // => 69
 * midi.note(69) // => 'A4'
 * midi.note(61) // => 'Db4'
 * midi.note(61, true) // => 'C#4'
 *
 * @module midi
 */

/**
 * Convert the given note to a midi note number. If you pass a midi number it
 * will returned as is.
 *
 * @param {Array|String|Number} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi.toMidi('C4') // => 60
 * midi.toMidi(60) // => 60
 * midi.toMidi('60') // => 60
 */
function toMidi(val) {
  if (Array.isArray(val) && val.length === 2) return val[0] * 7 + val[1] * 12 + 12
  //return //noteParser.
  return midi(val);
}

var FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');
var SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {Integer} midi - the midi note number
 * @param {Boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {String} the note name
 * @example
 * var midi = require('tonal-midi')
 * midi.note(61) // => 'Db4'
 * midi.note(61, true) // => 'C#4'
 * // it rounds to nearest note
 * midi.note(61.7) // => 'D4'
 */
function note(num, sharps) {
  if (num === true || num === false) return function (m) { return note(m, num) }
  num = Math.round(num);
  var pcs = sharps === true ? SHARPS : FLATS;
  var pc = pcs[num % 12];
  var o = Math.floor(num / 12) - 1;
  return pc + o
}

//exports.toMidi = toMidi;
//exports.note = note;

//var tonalMidi = require('tonal-midi');

/**
 * MIDI file format constants.
 * @return {Constants}
 */
var Constants = {
  //VERSION: require('../package.json').version,
  HEADER_CHUNK_TYPE: [0x4d, 0x54, 0x68, 0x64],
  // Mthd
  HEADER_CHUNK_LENGTH: [0x00, 0x00, 0x00, 0x06],
  // Header size for SMF
  HEADER_CHUNK_FORMAT0: [0x00, 0x00],
  // Midi Type 0 id
  HEADER_CHUNK_FORMAT1: [0x00, 0x01],
  // Midi Type 1 id
  HEADER_CHUNK_DIVISION: [0x00, 0x80],
  // Defaults to 128 ticks per beat
  TRACK_CHUNK_TYPE: [0x4d, 0x54, 0x72, 0x6b],
  // MTrk,
  META_EVENT_ID: 0xFF,
  META_TEXT_ID: 0x01,
  META_COPYRIGHT_ID: 0x02,
  META_TRACK_NAME_ID: 0x03,
  META_INSTRUMENT_NAME_ID: 0x04,
  META_LYRIC_ID: 0x05,
  META_MARKER_ID: 0x06,
  META_CUE_POINT: 0x07,
  META_TEMPO_ID: 0x51,
  META_SMTPE_OFFSET: 0x54,
  META_TIME_SIGNATURE_ID: 0x58,
  META_KEY_SIGNATURE_ID: 0x59,
  META_END_OF_TRACK_ID: [0x2F, 0x00],
  CONTROLLER_CHANGE_STATUS: 0xB0,
  // includes channel number (0)
  PROGRAM_CHANGE_STATUS: 0xC0,
  // includes channel number (0)
  PITCH_BEND_STATUS: 0xE0 // includes channel number (0)

};

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * Static utility functions used throughout the library.
 */

var Utils = /*#__PURE__*/function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "version",

    /**
     * Gets MidiWriterJS version number.
     * @return {string}
     */
    value: function version() {
      return Constants.VERSION;
    }
    /**
     * Convert a string to an array of bytes
     * @param {string} string
     * @return {array}
     */

  }, {
    key: "stringToBytes",
    value: function stringToBytes(string) {
      return string.split('').map(function (_char) {
        return _char.charCodeAt();
      });
    }
    /**
     * Checks if argument is a valid number.
     * @param {*} n - Value to check
     * @return {boolean}
     */

  }, {
    key: "isNumeric",
    value: function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    /**
     * Returns the correct MIDI number for the specified pitch.
     * Uses Tonal Midi - https://github.com/danigb/tonal/tree/master/packages/midi
     * @param {(string|number)} pitch - 'C#4' or midi note code
     * @return {number}
     */

  }, {
    key: "getPitch",
    value: function getPitch(pitch) {
      //return //tonalMidi.
      return toMidi(pitch);
    }
    /**
     * Translates number of ticks to MIDI timestamp format, returning an array of
     * hex strings with the time values. Midi has a very particular time to express time,
     * take a good look at the spec before ever touching this function.
     * Thanks to https://github.com/sergi/jsmidi
     *
     * @param {number} ticks - Number of ticks to be translated
     * @return {array} - Bytes that form the MIDI time value
     */

  }, {
    key: "numberToVariableLength",
    value: function numberToVariableLength(ticks) {
      var buffer = ticks & 0x7F;

      while (ticks = ticks >> 7) {
        buffer <<= 8;
        buffer |= ticks & 0x7F | 0x80;
      }

      var bList = [];

      while (true) {
        bList.push(buffer & 0xff);
        if (buffer & 0x80) buffer >>= 8; else {
          break;
        }
      }

      return bList;
    }
    /**
     * Counts number of bytes in string
     * @param {string} s
     * @return {array}
     */

  }, {
    key: "stringByteCount",
    value: function stringByteCount(s) {
      return encodeURI(s).split(/%..|./).length - 1;
    }
    /**
     * Get an int from an array of bytes.
     * @param {array} bytes
     * @return {number}
     */

  }, {
    key: "numberFromBytes",
    value: function numberFromBytes(bytes) {
      var hex = '';
      var stringResult;
      bytes.forEach(function (_byte) {
        stringResult = _byte.toString(16); // ensure string is 2 chars

        if (stringResult.length == 1) stringResult = "0" + stringResult;
        hex += stringResult;
      });
      return parseInt(hex, 16);
    }
    /**
     * Takes a number and splits it up into an array of bytes.  Can be padded by passing a number to bytesNeeded
     * @param {number} number
     * @param {number} bytesNeeded
     * @return {array} - Array of bytes
     */

  }, {
    key: "numberToBytes",
    value: function numberToBytes(number, bytesNeeded) {
      bytesNeeded = bytesNeeded || 1;
      var hexString = number.toString(16);

      if (hexString.length & 1) {
        // Make sure hex string is even number of chars
        hexString = '0' + hexString;
      } // Split hex string into an array of two char elements


      var hexArray = hexString.match(/.{2}/g); // Now parse them out as integers

      hexArray = hexArray.map(function (item) {
        return parseInt(item, 16);
      }); // Prepend empty bytes if we don't have enough

      if (hexArray.length < bytesNeeded) {
        while (bytesNeeded - hexArray.length > 0) {
          hexArray.unshift(0);
        }
      }

      return hexArray;
    }
    /**
     * Converts value to array if needed.
     * @param {string} value
     * @return {array}
     */

  }, {
    key: "toArray",
    value: function toArray(value) {
      if (Array.isArray(value)) return value;
      return [value];
    }
    /**
     * Converts velocity to value 0-127
     * @param {number} velocity - Velocity value 1-100
     * @return {number}
     */

  }, {
    key: "convertVelocity",
    value: function convertVelocity(velocity) {
      // Max passed value limited to 100
      velocity = velocity > 100 ? 100 : velocity;
      return Math.round(velocity / 100 * 127);
    }
    /**
     * Gets the total number of ticks of a specified duration.
     * Note: type=='note' defaults to quarter note, type==='rest' defaults to 0
     * @param {(string|array)} duration
     * @return {number}
     */

  }, {
    key: "getTickDuration",
    value: function getTickDuration(duration) {
      if (Array.isArray(duration)) {
        // Recursively execute this method for each item in the array and return the sum of tick durations.
        return duration.map(function (value) {
          return Utils.getTickDuration(value);
        }).reduce(function (a, b) {
          return a + b;
        }, 0);
      }

      duration = duration.toString();

      if (duration.toLowerCase().charAt(0) === 't') {
        // If duration starts with 't' then the number that follows is an explicit tick count
        return parseInt(duration.substring(1));
      } // Need to apply duration here.  Quarter note == Constants.HEADER_CHUNK_DIVISION
      // Rounding only applies to triplets, which the remainder is handled below


      var quarterTicks = Utils.numberFromBytes(Constants.HEADER_CHUNK_DIVISION);
      return Math.round(quarterTicks * Utils.getDurationMultiplier(duration));
    }
    /**
     * Gets what to multiple ticks/quarter note by to get the specified duration.
     * Note: type=='note' defaults to quarter note, type==='rest' defaults to 0
     * @param {string} duration
     * @return {number}
     */

  }, {
    key: "getDurationMultiplier",
    value: function getDurationMultiplier(duration) {
      // Need to apply duration here.  Quarter note == Constants.HEADER_CHUNK_DIVISION
      switch (duration) {
        case '0':
          return 0;

        case '1':
          return 4;

        case '2':
          return 2;

        case 'd2':
          // Dotted half
          return 3;

        case 'dd2':
          // Double dotted half
          return 3.5;

        case '4':
          return 1;

        case '4t':
          return 0.666;

        case 'd4':
          // Dotted quarter
          return 1.5;

        case 'dd4':
          // Double dotted quarter
          return 1.75;

        case '8':
          return 0.5;

        case '8t':
          // For 8th triplets, let's divide a quarter by 3, round to the nearest int, and substract the remainder to the last one.
          return 0.33;

        case 'd8':
          // Dotted eighth
          return 0.75;

        case 'dd8':
          // Double dotted eighth
          return 0.875;

        case '16':
          return 0.25;

        case '16t':
          return 0.166;

        case '32':
          return 0.125;

        case '64':
          return 0.0625;
        //return type === 'note' ? 1 : 0;

      }

      throw duration + ' is not a valid duration.';
    }
  }]);

  return Utils;
}();

/**
 * Holds all data for a "note on" MIDI event
 * @param {object} fields {data: []}
 * @return {NoteOnEvent}
 */

var NoteOnEvent = /*#__PURE__*/function () {
  function NoteOnEvent(fields) {
    _classCallCheck(this, NoteOnEvent);

    // Set default fields
    fields = Object.assign({
      channel: 1,
      startTick: null,
      velocity: 50,
      wait: 0
    }, fields);
    this.type = 'note-on';
    this.channel = fields.channel;
    this.pitch = fields.pitch;
    this.wait = fields.wait;
    this.velocity = fields.velocity;
    this.startTick = fields.startTick;
    this.midiNumber = Utils.getPitch(this.pitch);
    this.tick = null;
    this.delta = null;
    this.data = fields.data;
  }
  /**
   * Builds int array for this event.
   * @param {Track} track - parent track
   * @return {NoteOnEvent}
   */


  _createClass(NoteOnEvent, [{
    key: "buildData",
    value: function buildData(track) {
		
      this.data = []; // Explicitly defined startTick event

      if (this.startTick) {
        this.tick = this.startTick; // If this is the first event in the track then use event's starting tick as delta.

        if (track.tickPointer == 0) {
          this.delta = this.tick;
        }
      } else {
        this.delta = Utils.getTickDuration(this.wait);
        this.tick = track.tickPointer + this.delta;
      }

	  this.data = Utils.numberToVariableLength(this.delta).concat(this.getStatusByte(), this.midiNumber, Utils.convertVelocity(this.velocity));
	  //console.log('buildData',this.getStatusByte(),this);
      return this;
    }
    /**
     * Gets the note on status code based on the selected channel. 0x9{0-F}
     * Note on at channel 0 is 0x90 (144)
     * 0 = Ch 1
     * @return {number}
     */

  }, {
    key: "getStatusByte",
    value: function getStatusByte() {
      return 144 + this.channel - 1;
    }
  }]);

  return NoteOnEvent;
}();

/**
 * Holds all data for a "note off" MIDI event
 * @param {object} fields {data: []}
 * @return {NoteOffEvent}
 */

var NoteOffEvent = /*#__PURE__*/function () {
  function NoteOffEvent(fields) {
    _classCallCheck(this, NoteOffEvent);

    // Set default fields
    fields = Object.assign({
      channel: 1,
      velocity: 50,
      tick: null
    }, fields);
    this.type = 'note-off';
    this.channel = fields.channel;
    this.pitch = fields.pitch;
    this.duration = fields.duration;
    this.velocity = fields.velocity;
    this.midiNumber = Utils.getPitch(this.pitch);
    this.tick = fields.tick;
    this.delta = Utils.getTickDuration(this.duration);
    this.data = fields.data;
  }
  /**
   * Builds int array for this event.
   * @param {Track} track - parent track
   * @return {NoteOffEvent}
   */


  _createClass(NoteOffEvent, [{
    key: "buildData",
    value: function buildData(track) {
      if (this.tick === null) {
        this.tick = this.delta + track.tickPointer;
      }

      this.data = Utils.numberToVariableLength(this.delta).concat(this.getStatusByte(), this.midiNumber, Utils.convertVelocity(this.velocity));
      return this;
    }
    /**
     * Gets the note off status code based on the selected channel. 0x8{0-F}
     * Note off at channel 0 is 0x80 (128)
     * 0 = Ch 1
     * @return {number}
     */

  }, {
    key: "getStatusByte",
    value: function getStatusByte() {
      return 128 + this.channel - 1;
    }
  }]);

  return NoteOffEvent;
}();

/**
 * Wrapper for noteOnEvent/noteOffEvent objects that builds both events.
 * @param {object} fields - {pitch: '[C4]', duration: '4', wait: '4', velocity: 1-100}
 * @return {NoteEvent}
 */

var NoteEvent = /*#__PURE__*/function () {
  function NoteEvent(fields) {
    _classCallCheck(this, NoteEvent);
//console.log('fields',fields);
    // Set default fields
    fields = Object.assign({
      channel: 1,
      repeat: 1,
      sequential: false,
      startTick: null,
      velocity: 50,
      wait: 0
    }, fields);
    this.data = [];
    this.type = 'note';
    this.pitch = Utils.toArray(fields.pitch);
    //console.log('this.pitch',this.pitch);
    this.channel = fields.channel;
    this.duration = fields.duration;
    this.grace = fields.grace;
    this.repeat = fields.repeat;
    this.sequential = fields.sequential;
    this.startTick = fields.startTick;
    this.velocity = fields.velocity;
    this.wait = fields.wait;
    this.tickDuration = Utils.getTickDuration(this.duration);
    this.restDuration = Utils.getTickDuration(this.wait);
    this.events = []; // Hold actual NoteOn/NoteOff events
  }
  /**
   * Builds int array for this event.
   * @return {NoteEvent}
   */


  _createClass(NoteEvent, [{
    key: "buildData",
    value: function buildData() {
      var _this = this;

      // Reset data array
      this.data = [];
      var tickDuration = this.tickDuration;
      var restDuration = this.restDuration; // Apply grace note(s) and subtract ticks (currently 1 tick per grace note) from tickDuration so net value is the same
      //console.log('note',this);
      //this.pitch.forEach(function (p, i) {console.log(p,i);});
      if (this.grace) {
        var graceDuration = 1;
        this.grace = Utils.toArray(this.grace);
        this.grace.forEach(function (pitch) {
          var noteEvent = new NoteEvent({
            pitch: _this.grace,
            duration: 'T' + graceDuration
          });
          _this.data = _this.data.concat(noteEvent.data);
          tickDuration -= graceDuration;
        });
      } // fields.pitch could be an array of pitches.
      // If this.sequential === true then it's a sequential string of notes that requires separate NoteOnEvents.

      if (!this.sequential) {
        // Handle repeat
        for (var j = 0; j < this.repeat; j++) {
          // Note on
          this.pitch.forEach(function (p, i) {
            if (i == 0) {
              var noteOnNew = new NoteOnEvent({
                channel: _this.channel,
                wait: _this.wait,
                velocity: _this.velocity,
                pitch: p,
                startTick: _this.startTick
              });
            } else {
              // Running status (can ommit the note on status)
              //noteOn = new NoteOnEvent({data: [0, Utils.getPitch(p), Utils.convertVelocity(this.velocity)]});
              var noteOnNew = new NoteOnEvent({
                channel: _this.channel,
                wait: 0,
                velocity: _this.velocity,
                pitch: p,
                startTick: _this.startTick
              });
            }

            _this.events.push(noteOnNew);
          }); // Note off

          this.pitch.forEach(function (p, i) {
            if (i == 0) {
              //noteOff = new NoteOffEvent({data: Utils.numberToVariableLength(tickDuration).concat(this.getNoteOffStatus(), Utils.getPitch(p), Utils.convertVelocity(this.velocity))});
              var noteOffNew = new NoteOffEvent({
                channel: _this.channel,
                duration: _this.duration,
                velocity: _this.velocity,
                pitch: p,
                tick: _this.startTick !== null ? Utils.getTickDuration(_this.duration) - _this.startTick : null
              });
            } else {
              // Running status (can ommit the note off status)
              //noteOff = new NoteOffEvent({data: [0, Utils.getPitch(p), Utils.convertVelocity(this.velocity)]});
              var noteOffNew = new NoteOffEvent({
                channel: _this.channel,
                duration: 0,
                velocity: _this.velocity,
                pitch: p,
                tick: _this.startTick !== null ? Utils.getTickDuration(_this.duration) - _this.startTick : null
              });
            }

            _this.events.push(noteOffNew);
          });
        }
      } else {
        // Handle repeat
        for (var j = 0; j < this.repeat; j++) {
          this.pitch.forEach(function (p, i) {
            // restDuration only applies to first note
            if (i > 0) {
              restDuration = 0;
            } // If duration is 8th triplets we need to make sure that the total ticks == quarter note.
            // So, the last one will need to be the remainder


            if (_this.duration === '8t' && i == _this.pitch.length - 1) {
              var quarterTicks = Utils.numberFromBytes(Constants.HEADER_CHUNK_DIVISION);
              tickDuration = quarterTicks - tickDuration * 2;
            }

            var noteOnNew = new NoteOnEvent({
              channel: _this.channel,
              wait: i > 0 ? 0 : _this.wait,
              // wait only applies to first note in repetition
              velocity: _this.velocity,
              pitch: p,
              startTick: _this.startTick
            });
            var noteOffNew = new NoteOffEvent({
              channel: _this.channel,
              duration: _this.duration,
              velocity: _this.velocity,
              pitch: p
            });

            _this.events.push(noteOnNew, noteOffNew);
          });
        }
      }

      return this;
    }
  }]);

  return NoteEvent;
}();

/**
 * Holds all data for a "Pitch Bend" MIDI event
 * [ -1.0, 0, 1.0 ] ->  [ 0, 8192, 16383]
 * @param {object} fields { bend : float, channel : int }
 * @return {PitchBendEvent}
 */

var scale14bits = function scale14bits(zeroOne) {
  if (zeroOne <= 0) {
    return Math.floor(16384 * (zeroOne + 1) / 2);
  }

  return Math.floor(16383 * (zeroOne + 1) / 2);
};

var PitchBendEvent = function PitchBendEvent(fields) {
  _classCallCheck(this, PitchBendEvent);

  this.type = 'pitch-bend';
  var bend14 = scale14bits(fields.bend);
  var channel = fields.channel || 0;
  var lsbValue = bend14 & 0x7f;
  var msbValue = bend14 >> 7 & 0x7f;
  this.data = Utils.numberToVariableLength(0x00).concat(Constants.PITCH_BEND_STATUS | channel, lsbValue, msbValue);
};

/**
 * Holds all data for a "program change" MIDI event
 * @param {object} fields {instrument: integer}
 * @return {ProgramChangeEvent}
 */

var ProgramChangeEvent = function ProgramChangeEvent(fields) {
  _classCallCheck(this, ProgramChangeEvent);

  this.type = 'program'; // delta time defaults to 0.

  //this.data = Utils.numberToVariableLength(0x00).concat(Constants.PROGRAM_CHANGE_STATUS, fields.instrument);
  this.data = Utils.numberToVariableLength(0x00).concat(Constants.PROGRAM_CHANGE_STATUS+fields.channel, fields.instrument);
};

/**
 * Holds all data for a "controller change" MIDI event
 * @param {object} fields {controllerNumber: integer, controllerValue: integer}
 * @return {ControllerChangeEvent}
 */

var ControllerChangeEvent = function ControllerChangeEvent(fields) {
  _classCallCheck(this, ControllerChangeEvent);

  this.type = 'controller'; // delta time defaults to 0.

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.CONTROLLER_CHANGE_STATUS, fields.controllerNumber, fields.controllerValue);
};

/**
 * Object representation of a tempo meta event.
 * @param {string} text - Copyright text
 * @return {CopyrightEvent}
 */

var CopyrightEvent = function CopyrightEvent(text) {
  _classCallCheck(this, CopyrightEvent);

  this.type = 'copyright';
  var textBytes = Utils.stringToBytes(text); // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_COPYRIGHT_ID, Utils.numberToVariableLength(textBytes.length), // Size
    textBytes // Text
  );
};

/**
 * Object representation of a cue point meta event.
 * @param {string} text - Cue point text
 * @return {CuePointEvent}
 */

var CuePointEvent = function CuePointEvent(text) {
  _classCallCheck(this, CuePointEvent);

  this.type = 'marker';
  var textBytes = Utils.stringToBytes(text); // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_CUE_POINT, Utils.numberToVariableLength(textBytes.length), // Size
    textBytes // Text
  );
};

/**
 * Object representation of a end track meta event.
 * @return {EndTrackEvent}
 */

var EndTrackEvent = function EndTrackEvent() {
  _classCallCheck(this, EndTrackEvent);

  this.type = 'end-track'; // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_END_OF_TRACK_ID);
};

/**
 * Object representation of an instrument name meta event.
 * @param {number} bpm - Beats per minute
 * @return {InstrumentNameEvent}
 */

var InstrumentNameEvent = function InstrumentNameEvent(text) {
  _classCallCheck(this, InstrumentNameEvent);

  this.type = 'instrument-name';
  var textBytes = Utils.stringToBytes(text); // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_INSTRUMENT_NAME_ID, Utils.numberToVariableLength(textBytes.length), // Size
    textBytes // Instrument name
  );
};

/**
 * Object representation of a key signature meta event.
 * @return {KeySignatureEvent}
 */

var KeySignatureEvent = function KeySignatureEvent(sf, mi) {
  _classCallCheck(this, KeySignatureEvent);

  this.type = 'key-signature';
  var mode = mi || 0;
  sf = sf || 0; //	Function called with string notation

  if (typeof mi === 'undefined') {
    var fifths = [['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'], ['ab', 'eb', 'bb', 'f', 'c', 'g', 'd', 'a', 'e', 'b', 'f#', 'c#', 'g#', 'd#', 'a#']];
    var _sflen = sf.length;
    var note = sf || 'C';
    if (sf[0] === sf[0].toLowerCase()) mode = 1;

    if (_sflen > 1) {
      switch (sf.charAt(_sflen - 1)) {
        case 'm':
          mode = 1;
          note = sf.charAt(0).toLowerCase();
          note = note.concat(sf.substring(1, _sflen - 1));
          break;

        case '-':
          mode = 1;
          note = sf.charAt(0).toLowerCase();
          note = note.concat(sf.substring(1, _sflen - 1));
          break;

        case 'M':
          mode = 0;
          note = sf.charAt(0).toUpperCase();
          note = note.concat(sf.substring(1, _sflen - 1));
          break;

        case '+':
          mode = 0;
          note = sf.charAt(0).toUpperCase();
          note = note.concat(sf.substring(1, _sflen - 1));
          break;
      }
    }

    var fifthindex = fifths[mode].indexOf(note);
    sf = fifthindex === -1 ? 0 : fifthindex - 7;
  } // Start with zero time delta


  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_KEY_SIGNATURE_ID, [0x02], // Size
    Utils.numberToBytes(sf, 1), // Number of sharp or flats ( < 0 flat; > 0 sharp)
    Utils.numberToBytes(mode, 1) // Mode: 0 major, 1 minor
  );
};

/**
 * Object representation of a lyric meta event.
 * @param {string} text - Lyric text
 * @return {LyricEvent}
 */

var LyricEvent = function LyricEvent(text) {
  _classCallCheck(this, LyricEvent);

  this.type = 'marker';
  var textBytes = Utils.stringToBytes(text); // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_LYRIC_ID, Utils.numberToVariableLength(textBytes.length), // Size
    textBytes // Text
  );
};

/**
 * Object representation of a marker meta event.
 * @param {string} text - Marker text
 * @return {MarkerEvent}
 */

var MarkerEvent = function MarkerEvent(text) {
  _classCallCheck(this, MarkerEvent);

  this.type = 'marker';
  var textBytes = Utils.stringToBytes(text); // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_MARKER_ID, Utils.numberToVariableLength(textBytes.length), // Size
    textBytes // Text
  );
};

/**
 * Object representation of a tempo meta event.
 * @param {number} bpm - Beats per minute
 * @return {TempoEvent}
 */

var TempoEvent = function TempoEvent(bpm) {
  _classCallCheck(this, TempoEvent);

  this.type = 'tempo';
  var tempo = Math.round(60000000 / bpm); // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_TEMPO_ID, [0x03], // Size
    Utils.numberToBytes(tempo, 3) // Tempo, 3 bytes
  );
};

/**
 * Object representation of a tempo meta event.
 * @param {number} bpm - Beats per minute
 * @return {TextEvent}
 */

var TextEvent = function TextEvent(text) {
  _classCallCheck(this, TextEvent);

  this.type = 'text';
  var textBytes = Utils.stringToBytes(text); // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_TEXT_ID, Utils.numberToVariableLength(textBytes.length), // Size
    textBytes // Text
  );
};

/**
 * Object representation of a time signature meta event.
 * @return {TimeSignatureEvent}
 */

var TimeSignatureEvent = function TimeSignatureEvent(numerator, denominator, midiclockspertick, notespermidiclock) {
  _classCallCheck(this, TimeSignatureEvent);

  this.type = 'time-signature'; // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_TIME_SIGNATURE_ID, [0x04], // Size
    Utils.numberToBytes(numerator, 1), // Numerator, 1 bytes
    Utils.numberToBytes(Math.log2(denominator), 1), // Denominator is expressed as pow of 2, 1 bytes
    Utils.numberToBytes(midiclockspertick || 24, 1), // MIDI Clocks per tick, 1 bytes
    Utils.numberToBytes(notespermidiclock || 8, 1) // Number of 1/32 notes per MIDI clocks, 1 bytes
  );
};

/**
 * Object representation of a tempo meta event.
 * @param {number} bpm - Beats per minute
 * @return {TrackNameEvent}
 */

var TrackNameEvent = function TrackNameEvent(text) {
  _classCallCheck(this, TrackNameEvent);

  this.type = 'track-name';
  var textBytes = Utils.stringToBytes(text); // Start with zero time delta

  this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, Constants.META_TRACK_NAME_ID, Utils.numberToVariableLength(textBytes.length), // Size
    textBytes // Text
  );
};

/**
 * Holds all data for a track.
 * @param {object} fields {type: number, data: array, size: array, events: array}
 * @return {Track}
 */

var Track = /*#__PURE__*/function () {
  function Track() {
    _classCallCheck(this, Track);

    this.type = Constants.TRACK_CHUNK_TYPE;
    this.data = [];
    this.size = [];
    this.events = [];
    this.explicitTickEvents = []; // If there are any events with an explicit tick defined then we will create a "sub" track for those
    // and merge them in and the end.

    this.tickPointer = 0; // Each time an event is added this will increase
  }
  /**
   * Adds any event type to the track.
   * Events without a specific startTick property are assumed to be added in order of how they should output.
   * Events with a specific startTick property are set aside for now will be merged in during build process.
   * @param {(NoteEvent|ProgramChangeEvent)} events - Event object or array of Event objects.
   * @param {function} mapFunction - Callback which can be used to apply specific properties to all events.
   * @return {Track}
   */


  _createClass(Track, [{
    key: "addEvent",
    value: function addEvent(events, mapFunction) {
      var _this = this;

      Utils.toArray(events).forEach(function (event, i) {
        if (event instanceof NoteEvent) {
			
          // Handle map function if provided
          if (typeof mapFunction === 'function') {
            var properties = mapFunction(i, event);
			
            if (_typeof(properties) === 'object') {
              for (var j in properties) {
                switch (j) {
                  case 'channel':
					event.channel = properties[j];
					
                    break;

                  case 'duration':
                    event.duration = properties[j];
                    break;

                  case 'sequential':
                    event.sequential = properties[j];
                    break;

                  case 'velocity':
                    event.velocity = Utils.convertVelocity(properties[j]);
                    break;
                }
              }
            }
          } // If this note event has an explicit startTick then we need to set aside for now


          if (event.startTick !== null) {
            _this.explicitTickEvents.push(event);
          } else {
            // Push each on/off event to track's event stack
            event.buildData().events.forEach(function (e) {
              return _this.events.push(e);
            });
          }
        } else {
          _this.events.push(event);
        }
      });
      return this;
    }
    /**
     * Builds int array of all events.
     * @return {Track}
     */

  }, {
    key: "buildData",
    value: function buildData() {
      var _this2 = this;

      // Remove existing end track event and add one.
      // This makes sure it's at the very end of the event list.
      this.removeEventsByType('end-track').addEvent(new EndTrackEvent()); // Reset

      this.data = [];
      this.size = [];
      this.tickPointer = 0;
      this.events.forEach(function (event, eventIndex) {
        // Build event & add to total tick duration
        if (event instanceof NoteOnEvent || event instanceof NoteOffEvent) {
          _this2.data = _this2.data.concat(event.buildData(_this2).data);
          _this2.tickPointer = event.tick;
        } else {
          _this2.data = _this2.data.concat(event.data);
        }
      });
      this.mergeExplicitTickEvents();
      this.size = Utils.numberToBytes(this.data.length, 4); // 4 bytes long

      return this;
    }
  }, {
    key: "mergeExplicitTickEvents",
    value: function mergeExplicitTickEvents() {
      var _this3 = this;

      if (!this.explicitTickEvents.length) return; // First sort asc list of events by startTick

      this.explicitTickEvents.sort(function (a, b) {
        return a.startTick - b.startTick;
      }); // Now this.explicitTickEvents is in correct order, and so is this.events naturally.
      // For each explicit tick event, splice it into the main list of events and
      // adjust the delta on the following events so they still play normally.

      this.explicitTickEvents.forEach(function (noteEvent) {
        // Convert NoteEvent to it's respective NoteOn/NoteOff events
        // Note that as we splice in events the delta for the NoteOff ones will
        // Need to change based on what comes before them after the splice.
        noteEvent.buildData().events.forEach(function (e) {
          return e.buildData(_this3);
        }); // Merge each event indivually into this track's event list.

        noteEvent.events.forEach(function (event) {
          return _this3.mergeSingleEvent(event);
        });
      }); // Hacky way to rebuild track with newly spliced events.  Need better solution.

      this.explicitTickEvents = [];
      this.buildData();
    }
    /**
     * Merges another track's events with this track.
     * @param {Track} track
     * @return {Track}
     */

  }, {
    key: "mergeTrack",
    value: function mergeTrack(track) {
      var _this4 = this;

      // First build this track to populate each event's tick property
      this.buildData(); // Then build track to be merged so that tick property is populated on all events & merge each event.

      track.buildData().events.forEach(function (event) {
        return _this4.mergeSingleEvent(event);
      });
    }
    /**
     * Merges a single event into this track's list of events based on event.tick property.
     * @param {NoteOnEvent|NoteOffEvent} - event
     * @return {Track}
     */

  }, {
    key: "mergeSingleEvent",
    value: function mergeSingleEvent(event) {
      // Find index of existing event we need to follow with
      var lastEventIndex = 0;

      for (var i = 0; i < this.events.length; i++) {
        if (this.events[i].tick > event.tick) break;
        lastEventIndex = i;
      }

      var splicedEventIndex = lastEventIndex + 1; // Need to adjust the delta of this event to ensure it falls on the correct tick.

      event.delta = event.tick - this.events[lastEventIndex].tick; // Splice this event at lastEventIndex + 1

      this.events.splice(splicedEventIndex, 0, event); // Now adjust delta of all following events

      for (var i = splicedEventIndex + 1; i < this.events.length; i++) {
        // Since each existing event should have a tick value at this point we just need to
        // adjust delta to that the event still falls on the correct tick.
        this.events[i].delta = this.events[i].tick - this.events[i - 1].tick;
      }
    }
    /**
     * Removes all events matching specified type.
     * @param {string} eventType - Event type
     * @return {Track}
     */

  }, {
    key: "removeEventsByType",
    value: function removeEventsByType(eventType) {
      var _this5 = this;

      this.events.forEach(function (event, index) {
        if (event.type === eventType) {
          _this5.events.splice(index, 1);
        }
      });
      return this;
    }
    /**
     * Sets tempo of the MIDI file.
     * @param {number} bpm - Tempo in beats per minute.
     * @return {Track}
     */

  }, {
    key: "setTempo",
    value: function setTempo(bpm) {
      return this.addEvent(new TempoEvent(bpm));
    }
    /**
     * Sets time signature.
     * @param {number} numerator - Top number of the time signature.
     * @param {number} denominator - Bottom number of the time signature.
     * @param {number} midiclockspertick - Defaults to 24.
     * @param {number} notespermidiclock - Defaults to 8.
     * @return {Track}
     */

  }, {
    key: "setTimeSignature",
    value: function setTimeSignature(numerator, denominator, midiclockspertick, notespermidiclock) {
      return this.addEvent(new TimeSignatureEvent(numerator, denominator, midiclockspertick, notespermidiclock));
    }
    /**
     * Sets key signature.
     * @param {*} sf -
     * @param {*} mi -
     * @return {Track}
     */

  }, {
    key: "setKeySignature",
    value: function setKeySignature(sf, mi) {
      return this.addEvent(new KeySignatureEvent(sf, mi));
    }
    /**
     * Adds text to MIDI file.
     * @param {string} text - Text to add.
     * @return {Track}
     */

  }, {
    key: "addText",
    value: function addText(text) {
      return this.addEvent(new TextEvent(text));
    }
    /**
     * Adds copyright to MIDI file.
     * @param {string} text - Text of copyright line.
     * @return {Track}
     */

  }, {
    key: "addCopyright",
    value: function addCopyright(text) {
      return this.addEvent(new CopyrightEvent(text));
    }
    /**
     * Adds Sequence/Track Name.
     * @param {string} text - Text of track name.
     * @return {Track}
     */

  }, {
    key: "addTrackName",
    value: function addTrackName(text) {
      return this.addEvent(new TrackNameEvent(text));
    }
    /**
     * Sets instrument name of track.
     * @param {string} text - Name of instrument.
     * @return {Track}
     */

  }, {
    key: "addInstrumentName",
    value: function addInstrumentName(text) {
      return this.addEvent(new InstrumentNameEvent(text));
    }
    /**
     * Adds marker to MIDI file.
     * @param {string} text - Marker text.
     * @return {Track}
     */

  }, {
    key: "addMarker",
    value: function addMarker(text) {
      return this.addEvent(new MarkerEvent(text));
    }
    /**
     * Adds cue point to MIDI file.
     * @param {string} text - Text of cue point.
     * @return {Track}
     */

  }, {
    key: "addCuePoint",
    value: function addCuePoint(text) {
      return this.addEvent(new CuePointEvent(text));
    }
    /**
     * Adds lyric to MIDI file.
     * @param {string} text - Lyric text to add.
     * @return {Track}
     */

  }, {
    key: "addLyric",
    value: function addLyric(text) {
      return this.addEvent(new LyricEvent(text));
    }
    /**
     * Channel mode messages
     * @return {Track}
     */

  }, {
    key: "polyModeOn",
    value: function polyModeOn() {
      var event = new NoteOnEvent({
        data: [0x00, 0xB0, 0x7E, 0x00]
      });
      return this.addEvent(event);
    }
    /**
     * Sets a pitch bend.
     * @param {float} bend - Bend value ranging [-1,1], zero meaning no bend.
     * @return {Track}
     */

  }, {
    key: "setPitchBend",
    value: function setPitchBend(bend) {
      return this.addEvent(new PitchBendEvent({
        bend: bend
      }));
    }
    /**
     * Adds a controller change event
     * @param {number} number - Control number.
     * @param {number} value - Control value.
     * @return {Track}
     */

  }, {
    key: "controllerChange",
    value: function controllerChange(number, value) {
      return this.addEvent(new ControllerChangeEvent({
        controllerNumber: number,
        controllerValue: value
      }));
    }
  }]);

  return Track;
}();

var VexFlow = /*#__PURE__*/function () {
  function VexFlow() {
    _classCallCheck(this, VexFlow);
  } // code...

  /**
   * Support for converting VexFlow voice into MidiWriterJS track
   * @return MidiWritier.Track object
   */


  _createClass(VexFlow, [{
    key: "trackFromVoice",
    value: function trackFromVoice(voice) {
      var _this = this;

      var track = new Track();
      var wait;
      var pitches = [];
      voice.tickables.forEach(function (tickable) {
        pitches = [];

        if (tickable.noteType === 'n') {
          tickable.keys.forEach(function (key) {
            // build array of pitches
            pitches.push(_this.convertPitch(key));
          });
        } else if (tickable.noteType === 'r') {
          // move on to the next tickable and use this rest as a `wait` property for the next event
          wait = _this.convertDuration(tickable);
          return;
        }

        track.addEvent(new NoteEvent({
          pitch: pitches,
          duration: _this.convertDuration(tickable),
          wait: wait
        })); // reset wait

        wait = 0;
      });
      return track;
    }
    /**
     * Converts VexFlow pitch syntax to MidiWriterJS syntax
     * @param pitch string
     */

  }, {
    key: "convertPitch",
    value: function convertPitch(pitch) {
      return pitch.replace('/', '');
    }
    /**
     * Converts VexFlow duration syntax to MidiWriterJS syntax
     * @param note struct from VexFlow
     */

  }, {
    key: "convertDuration",
    value: function convertDuration(note) {
      switch (note.duration) {
        case 'w':
          return '1';

        case 'h':
          return note.isDotted() ? 'd2' : '2';

        case 'q':
          return note.isDotted() ? 'd4' : '4';

        case '8':
          return note.isDotted() ? 'd8' : '8';
      }

      return note.duration;
    }
  }]);

  return VexFlow;
}();

/**
 * Object representation of a header chunk section of a MIDI file.
 * @param {number} numberOfTracks - Number of tracks
 * @return {HeaderChunk}
 */

var HeaderChunk = function HeaderChunk(numberOfTracks) {
  _classCallCheck(this, HeaderChunk);

  this.type = Constants.HEADER_CHUNK_TYPE;
  var trackType = numberOfTracks > 1 ? Constants.HEADER_CHUNK_FORMAT1 : Constants.HEADER_CHUNK_FORMAT0;
  this.data = trackType.concat(Utils.numberToBytes(numberOfTracks, 2), // two bytes long,
    Constants.HEADER_CHUNK_DIVISION);
  this.size = [0, 0, 0, this.data.length];
};

/**
 * Object that puts together tracks and provides methods for file output.
 * @param {array|Track} tracks - A single {Track} object or an array of {Track} objects.
 * @return {Writer}
 */

var MIDIWriter = /*#__PURE__*/function () {
  function MIDIWriter(tracks) {
    //console.log('MIDIWriter',tracks.length);
    var _this = this;

    _classCallCheck(this, MIDIWriter);

    // Ensure track is an array
    tracks = Utils.toArray(tracks);
    this.data = [];
    this.data.push(new HeaderChunk(tracks.length)); // For each track add final end of track event and build data

    tracks.forEach(function (track, i) {
      //console.log(i,track);
      _this.data.push(track.buildData());
    });
  }
  /**
   * Builds the file into a Uint8Array
   * @return {Uint8Array}
   */


  _createClass(MIDIWriter, [{
    key: "buildFile",
    value: function buildFile() {
      var build = []; // Data consists of chunks which consists of data

      this.data.forEach(function (d) {
        return build = build.concat(d.type, d.size, d.data);
      });
      return new Uint8Array(build);
    }
    /**
     * Convert file buffer to a base64 string.  Different methods depending on if browser or node.
     * @return {string}
     */

  }, {
    key: "base64",
    value: function base64() {
      if (typeof btoa === 'function') return btoa(String.fromCharCode.apply(null, this.buildFile()));
      return Buffer.from(this.buildFile()).toString('base64');
    }
    /**
     * Get the data URI.
     * @return {string}
     */

  }, {
    key: "dataUri",
    value: function dataUri() {
      return 'data:audio/midi;base64,' + this.base64();
    }
    /**
     * Output to stdout
     * @return {string}
     */

  }, {
    key: "stdout",
    value: function stdout() {
      return process.stdout.write(new Buffer(this.buildFile()));
    }
    /**
     * Save to MIDI file
     * @param {string} filename
     */

  }, {
    key: "saveMIDI",
    value: function saveMIDI(filename) {
      var fs = require('fs');

      var buffer = new Buffer.from(this.buildFile());
      fs.writeFile(filename + '.mid', buffer, function (err) {
        if (err) throw err;
      });
    }
  }]);

  return MIDIWriter;
}();

var main = {
  Constants: Constants,
  NoteOnEvent: NoteOnEvent,
  NoteOffEvent: NoteOffEvent,
  NoteEvent: NoteEvent,
  PitchBendEvent: PitchBendEvent,
  ProgramChangeEvent: ProgramChangeEvent,
  Track: Track,
  Utils: Utils,
  VexFlow: VexFlow,
  MIDIWriter: MIDIWriter
};

//module.exports = main;
var midiwrite = main;

function createNewMIDIwriter(tracks){
  return new MIDIWriter(tracks);
}
function createNewMIDItrack(){
  return new Track();
}
function createNewMIDIProgramChangeEvent(o){
  return new ProgramChangeEvent(o);
}
function createNewMIDINoteOnEvent(o){
  return new NoteOnEvent(o);
}
function createNewMIDINoteOffEvent(o){
  return new NoteOffEvent(o);
}


