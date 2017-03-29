(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const midi = require('./midi.js')
const Chord = require('./music/Chord.js')
const Progression = require('./music/Progression.js')
const CircleOfFourths = require('./music/CircleOfFourths.js')
const MajorSeventh735 = require('./music/chord-voicings/MajorSeventh-7-3-5.js')
const DominantSeventh735 = require('./music/chord-voicings/DominantSeventh-7-3-5.js')
const MinorSeventh735 = require('./music/chord-voicings/MinorSeventh-7-3-5.js')

let progression = Progression('Rootless 7-3-5',
    CircleOfFourths(MajorSeventh735)
    .concat(CircleOfFourths(DominantSeventh735))
    .concat(CircleOfFourths(MinorSeventh735)))

let currentChord = progression.chords[0]
let title = document.getElementById('title') 
let card = document.getElementById('card')

function render(){
    title.innerText = progression.name,
    card.innerText = currentChord.name()
    clean()
}


function next(){
    progression.chords.push(progression.chords.shift())
    currentChord = progression.chords[0]
    render()
}

render()

midi.onchange = notes => {
    console.log(Chord(notes).str())

    if(notes.some(x => !currentChord.notes.find(y => x.data === y.data))){
        wrong()
    }
    else{
        if(notes.length === currentChord.notes.length
            && currentChord.notes.every(
                (x, i) => notes[i].data === x.data)){
                right()
                setTimeout(next, 1000)
        }
        else if(notes.length > 0){
            reading()
        }
        else {
            clean()
        }
    }
}

function clean(){
    card.classList.remove('right')
    card.classList.remove('wrong')
    card.classList.remove('reading')
}

function state(state){
    clean()
    card.classList.add(state)
}

function reading(){
    state('reading')
}

function right(){
    state('right')
}

function wrong(){
    state('wrong')
}

context = new AudioContext;
oscillator = context.createOscillator();
//oscillator.frequency.value = 200;

oscillator.connect(context.destination);

oscillator.start(0);
oscillator.stop(0);
},{"./midi.js":3,"./music/Chord.js":4,"./music/CircleOfFourths.js":5,"./music/Progression.js":7,"./music/chord-voicings/DominantSeventh-7-3-5.js":9,"./music/chord-voicings/MajorSeventh-7-3-5.js":10,"./music/chord-voicings/MinorSeventh-7-3-5.js":11}],2:[function(require,module,exports){
const context = new AudioContext

let notes = []

module.exports = {
    play: key => {
        return
        let oscillator = context.createOscillator()

        let frequency = 440
        let dif = key - 57
        if(dif > 0){
            for(let i = 0; i < dif; i++){
                frequency = frequency * 1.05946
            }
        }
        else {
            for(let i = dif; i < 0; i++){
                frequency = frequency / 1.05946
            }
        }
        oscillator.frequency.value = frequency
        
        oscillator.connect(context.destination)
        oscillator.start(0)
        notes.push({
            key: key,
            oscillator: oscillator
        })
    },
    stop: key => {
        return
        let note = notes.find(x => x.key === key)
        note.oscillator.stop(0)
        notes.splice(notes.indexOf(note), 1)
    }
}
},{}],3:[function(require,module,exports){
const audio = require('./audio.js')
const Note = require('./music/Note.js')
const Chord = require('./music/Chord.js')

let midi = {
    notes: [],
    onchange: () => console.log(Chord(midi.notes).str())
}

function onMIDIMessage( event ) {
    let data = event.data
    let on = data[0] === 0x90
    let key = data[1]
    let note = Note(key)
    
    if(on){
        midi.notes.push(note)
        audio.play(key)
    }
    else{
        let i = midi.notes.findIndex(
            x => x._key === key)
        if (i > -1) {
            midi.notes.splice(i, 1)
        }
        audio.stop(key)
    }

    midi.notes.sort((a, b) => a._key > b._key)

    midi.onchange(midi.notes)
}

function onMIDISuccess( midiAccess ) {
    midiAccess.inputs.forEach( entry => entry.onmidimessage = onMIDIMessage )
}

navigator.requestMIDIAccess().then(onMIDISuccess)

module.exports = midi
},{"./audio.js":2,"./music/Chord.js":4,"./music/Note.js":6}],4:[function(require,module,exports){
module.exports = function (notes, name){
    let chord = {
        notes: notes,
        root: notes[0]
    }
    
    chord.name = () => 
        chord.root.str() + name

    chord.str = () =>
        chord.notes.map(x => x.str())

    return chord
}
},{}],5:[function(require,module,exports){
module.exports = function (chord_type){
    chord_type = chord_type ? chord_type : MajorChord

    return Array(12).fill(0)
        .reduce((p, x, i) => {
            p.push(chord_type(i * 5))
            return p
        }, [])
}
},{}],6:[function(require,module,exports){
const notes = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ]

module.exports = function (key){
    let data = (60 + key) % 12
    
    return {
        data: data,
        _key: key,
        str: () =>
            notes[data]
    }
}
},{}],7:[function(require,module,exports){
module.exports = function(name, chords){
    return {
        name: name,
        chords: chords
    }
}
},{}],8:[function(require,module,exports){
const Note = require('./Note.js')

module.exports = function (tone){
    return {
        root: () => Note(tone),
        majorThird: () => Note(tone + 4),
        minorThird: () => Note(tone + 3),
        perfectFifth: () => Note(tone + 7),
        majorSeventh: () => Note(tone - 1),
        minorSeventh: () => Note(tone - 2)
    }
}
},{"./Note.js":6}],9:[function(require,module,exports){
const DominantSeventhChord = require('../chords/DominantSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(DominantSeventhChord(tone)), 2)
}
},{"../chords/DominantSeventhChord.js":12,"../voicings/Inversion.js":15,"../voicings/Rootless.js":16}],10:[function(require,module,exports){
const MajorSeventhChord = require('../chords/MajorSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(MajorSeventhChord(tone)), 2)
}
},{"../chords/MajorSeventhChord.js":13,"../voicings/Inversion.js":15,"../voicings/Rootless.js":16}],11:[function(require,module,exports){
const MinorSeventhChord = require('../chords/MinorSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(MinorSeventhChord(tone)), 2)
}
},{"../chords/MinorSeventhChord.js":14,"../voicings/Inversion.js":15,"../voicings/Rootless.js":16}],12:[function(require,module,exports){
const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth(),
            scale.minorSeventh()
        ], '7')
}
},{"../Chord.js":4,"../Scale.js":8}],13:[function(require,module,exports){
const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth(),
            scale.majorSeventh()
        ], 'maj7')
}
},{"../Chord.js":4,"../Scale.js":8}],14:[function(require,module,exports){
const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.minorThird(),
            scale.perfectFifth(),
            scale.minorSeventh()
        ], 'm7')
}
},{"../Chord.js":4,"../Scale.js":8}],15:[function(require,module,exports){
module.exports = function (chord, inversion){
    inversion = inversion ? inversion : 1

    for(var i = 0; i < inversion; i++){
        chord.notes.push(chord.notes.shift())
    }
    return chord
}
},{}],16:[function(require,module,exports){
module.exports = function (chord){
    chord.notes = chord.notes.filter(x => x.data !== chord.root.data)
    return chord
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2F1ZGlvLmpzIiwic3JjL21pZGkuanMiLCJzcmMvbXVzaWMvQ2hvcmQuanMiLCJzcmMvbXVzaWMvQ2lyY2xlT2ZGb3VydGhzLmpzIiwic3JjL211c2ljL05vdGUuanMiLCJzcmMvbXVzaWMvUHJvZ3Jlc3Npb24uanMiLCJzcmMvbXVzaWMvU2NhbGUuanMiLCJzcmMvbXVzaWMvY2hvcmQtdm9pY2luZ3MvRG9taW5hbnRTZXZlbnRoLTctMy01LmpzIiwic3JjL211c2ljL2Nob3JkLXZvaWNpbmdzL01ham9yU2V2ZW50aC03LTMtNS5qcyIsInNyYy9tdXNpYy9jaG9yZC12b2ljaW5ncy9NaW5vclNldmVudGgtNy0zLTUuanMiLCJzcmMvbXVzaWMvY2hvcmRzL0RvbWluYW50U2V2ZW50aENob3JkLmpzIiwic3JjL211c2ljL2Nob3Jkcy9NYWpvclNldmVudGhDaG9yZC5qcyIsInNyYy9tdXNpYy9jaG9yZHMvTWlub3JTZXZlbnRoQ2hvcmQuanMiLCJzcmMvbXVzaWMvdm9pY2luZ3MvSW52ZXJzaW9uLmpzIiwic3JjL211c2ljL3ZvaWNpbmdzL1Jvb3RsZXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBtaWRpID0gcmVxdWlyZSgnLi9taWRpLmpzJylcclxuY29uc3QgQ2hvcmQgPSByZXF1aXJlKCcuL211c2ljL0Nob3JkLmpzJylcclxuY29uc3QgUHJvZ3Jlc3Npb24gPSByZXF1aXJlKCcuL211c2ljL1Byb2dyZXNzaW9uLmpzJylcclxuY29uc3QgQ2lyY2xlT2ZGb3VydGhzID0gcmVxdWlyZSgnLi9tdXNpYy9DaXJjbGVPZkZvdXJ0aHMuanMnKVxyXG5jb25zdCBNYWpvclNldmVudGg3MzUgPSByZXF1aXJlKCcuL211c2ljL2Nob3JkLXZvaWNpbmdzL01ham9yU2V2ZW50aC03LTMtNS5qcycpXHJcbmNvbnN0IERvbWluYW50U2V2ZW50aDczNSA9IHJlcXVpcmUoJy4vbXVzaWMvY2hvcmQtdm9pY2luZ3MvRG9taW5hbnRTZXZlbnRoLTctMy01LmpzJylcclxuY29uc3QgTWlub3JTZXZlbnRoNzM1ID0gcmVxdWlyZSgnLi9tdXNpYy9jaG9yZC12b2ljaW5ncy9NaW5vclNldmVudGgtNy0zLTUuanMnKVxyXG5cclxubGV0IHByb2dyZXNzaW9uID0gUHJvZ3Jlc3Npb24oJ1Jvb3RsZXNzIDctMy01JyxcclxuICAgIENpcmNsZU9mRm91cnRocyhNYWpvclNldmVudGg3MzUpXHJcbiAgICAuY29uY2F0KENpcmNsZU9mRm91cnRocyhEb21pbmFudFNldmVudGg3MzUpKVxyXG4gICAgLmNvbmNhdChDaXJjbGVPZkZvdXJ0aHMoTWlub3JTZXZlbnRoNzM1KSkpXHJcblxyXG5sZXQgY3VycmVudENob3JkID0gcHJvZ3Jlc3Npb24uY2hvcmRzWzBdXHJcbmxldCB0aXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZScpIFxyXG5sZXQgY2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkJylcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpe1xyXG4gICAgdGl0bGUuaW5uZXJUZXh0ID0gcHJvZ3Jlc3Npb24ubmFtZSxcclxuICAgIGNhcmQuaW5uZXJUZXh0ID0gY3VycmVudENob3JkLm5hbWUoKVxyXG4gICAgY2xlYW4oKVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbmV4dCgpe1xyXG4gICAgcHJvZ3Jlc3Npb24uY2hvcmRzLnB1c2gocHJvZ3Jlc3Npb24uY2hvcmRzLnNoaWZ0KCkpXHJcbiAgICBjdXJyZW50Q2hvcmQgPSBwcm9ncmVzc2lvbi5jaG9yZHNbMF1cclxuICAgIHJlbmRlcigpXHJcbn1cclxuXHJcbnJlbmRlcigpXHJcblxyXG5taWRpLm9uY2hhbmdlID0gbm90ZXMgPT4ge1xyXG4gICAgY29uc29sZS5sb2coQ2hvcmQobm90ZXMpLnN0cigpKVxyXG5cclxuICAgIGlmKG5vdGVzLnNvbWUoeCA9PiAhY3VycmVudENob3JkLm5vdGVzLmZpbmQoeSA9PiB4LmRhdGEgPT09IHkuZGF0YSkpKXtcclxuICAgICAgICB3cm9uZygpXHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIGlmKG5vdGVzLmxlbmd0aCA9PT0gY3VycmVudENob3JkLm5vdGVzLmxlbmd0aFxyXG4gICAgICAgICAgICAmJiBjdXJyZW50Q2hvcmQubm90ZXMuZXZlcnkoXHJcbiAgICAgICAgICAgICAgICAoeCwgaSkgPT4gbm90ZXNbaV0uZGF0YSA9PT0geC5kYXRhKSl7XHJcbiAgICAgICAgICAgICAgICByaWdodCgpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KG5leHQsIDEwMDApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYobm90ZXMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIHJlYWRpbmcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2xlYW4oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYW4oKXtcclxuICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgncmlnaHQnKVxyXG4gICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd3cm9uZycpXHJcbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3JlYWRpbmcnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0ZShzdGF0ZSl7XHJcbiAgICBjbGVhbigpXHJcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoc3RhdGUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRpbmcoKXtcclxuICAgIHN0YXRlKCdyZWFkaW5nJylcclxufVxyXG5cclxuZnVuY3Rpb24gcmlnaHQoKXtcclxuICAgIHN0YXRlKCdyaWdodCcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyb25nKCl7XHJcbiAgICBzdGF0ZSgnd3JvbmcnKVxyXG59XHJcblxyXG5jb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dDtcclxub3NjaWxsYXRvciA9IGNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xyXG4vL29zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gMjAwO1xyXG5cclxub3NjaWxsYXRvci5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pO1xyXG5cclxub3NjaWxsYXRvci5zdGFydCgwKTtcclxub3NjaWxsYXRvci5zdG9wKDApOyIsImNvbnN0IGNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0XHJcblxyXG5sZXQgbm90ZXMgPSBbXVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBwbGF5OiBrZXkgPT4ge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICAgIGxldCBvc2NpbGxhdG9yID0gY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKClcclxuXHJcbiAgICAgICAgbGV0IGZyZXF1ZW5jeSA9IDQ0MFxyXG4gICAgICAgIGxldCBkaWYgPSBrZXkgLSA1N1xyXG4gICAgICAgIGlmKGRpZiA+IDApe1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZGlmOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgZnJlcXVlbmN5ID0gZnJlcXVlbmN5ICogMS4wNTk0NlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSBkaWY7IGkgPCAwOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgZnJlcXVlbmN5ID0gZnJlcXVlbmN5IC8gMS4wNTk0NlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gZnJlcXVlbmN5XHJcbiAgICAgICAgXHJcbiAgICAgICAgb3NjaWxsYXRvci5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pXHJcbiAgICAgICAgb3NjaWxsYXRvci5zdGFydCgwKVxyXG4gICAgICAgIG5vdGVzLnB1c2goe1xyXG4gICAgICAgICAgICBrZXk6IGtleSxcclxuICAgICAgICAgICAgb3NjaWxsYXRvcjogb3NjaWxsYXRvclxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgc3RvcDoga2V5ID0+IHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgICBsZXQgbm90ZSA9IG5vdGVzLmZpbmQoeCA9PiB4LmtleSA9PT0ga2V5KVxyXG4gICAgICAgIG5vdGUub3NjaWxsYXRvci5zdG9wKDApXHJcbiAgICAgICAgbm90ZXMuc3BsaWNlKG5vdGVzLmluZGV4T2Yobm90ZSksIDEpXHJcbiAgICB9XHJcbn0iLCJjb25zdCBhdWRpbyA9IHJlcXVpcmUoJy4vYXVkaW8uanMnKVxyXG5jb25zdCBOb3RlID0gcmVxdWlyZSgnLi9tdXNpYy9Ob3RlLmpzJylcclxuY29uc3QgQ2hvcmQgPSByZXF1aXJlKCcuL211c2ljL0Nob3JkLmpzJylcclxuXHJcbmxldCBtaWRpID0ge1xyXG4gICAgbm90ZXM6IFtdLFxyXG4gICAgb25jaGFuZ2U6ICgpID0+IGNvbnNvbGUubG9nKENob3JkKG1pZGkubm90ZXMpLnN0cigpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBvbk1JRElNZXNzYWdlKCBldmVudCApIHtcclxuICAgIGxldCBkYXRhID0gZXZlbnQuZGF0YVxyXG4gICAgbGV0IG9uID0gZGF0YVswXSA9PT0gMHg5MFxyXG4gICAgbGV0IGtleSA9IGRhdGFbMV1cclxuICAgIGxldCBub3RlID0gTm90ZShrZXkpXHJcbiAgICBcclxuICAgIGlmKG9uKXtcclxuICAgICAgICBtaWRpLm5vdGVzLnB1c2gobm90ZSlcclxuICAgICAgICBhdWRpby5wbGF5KGtleSlcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgbGV0IGkgPSBtaWRpLm5vdGVzLmZpbmRJbmRleChcclxuICAgICAgICAgICAgeCA9PiB4Ll9rZXkgPT09IGtleSlcclxuICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgIG1pZGkubm90ZXMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF1ZGlvLnN0b3Aoa2V5KVxyXG4gICAgfVxyXG5cclxuICAgIG1pZGkubm90ZXMuc29ydCgoYSwgYikgPT4gYS5fa2V5ID4gYi5fa2V5KVxyXG5cclxuICAgIG1pZGkub25jaGFuZ2UobWlkaS5ub3RlcylcclxufVxyXG5cclxuZnVuY3Rpb24gb25NSURJU3VjY2VzcyggbWlkaUFjY2VzcyApIHtcclxuICAgIG1pZGlBY2Nlc3MuaW5wdXRzLmZvckVhY2goIGVudHJ5ID0+IGVudHJ5Lm9ubWlkaW1lc3NhZ2UgPSBvbk1JRElNZXNzYWdlIClcclxufVxyXG5cclxubmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzKCkudGhlbihvbk1JRElTdWNjZXNzKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtaWRpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobm90ZXMsIG5hbWUpe1xyXG4gICAgbGV0IGNob3JkID0ge1xyXG4gICAgICAgIG5vdGVzOiBub3RlcyxcclxuICAgICAgICByb290OiBub3Rlc1swXVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaG9yZC5uYW1lID0gKCkgPT4gXHJcbiAgICAgICAgY2hvcmQucm9vdC5zdHIoKSArIG5hbWVcclxuXHJcbiAgICBjaG9yZC5zdHIgPSAoKSA9PlxyXG4gICAgICAgIGNob3JkLm5vdGVzLm1hcCh4ID0+IHguc3RyKCkpXHJcblxyXG4gICAgcmV0dXJuIGNob3JkXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjaG9yZF90eXBlKXtcclxuICAgIGNob3JkX3R5cGUgPSBjaG9yZF90eXBlID8gY2hvcmRfdHlwZSA6IE1ham9yQ2hvcmRcclxuXHJcbiAgICByZXR1cm4gQXJyYXkoMTIpLmZpbGwoMClcclxuICAgICAgICAucmVkdWNlKChwLCB4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHAucHVzaChjaG9yZF90eXBlKGkgKiA1KSlcclxuICAgICAgICAgICAgcmV0dXJuIHBcclxuICAgICAgICB9LCBbXSlcclxufSIsImNvbnN0IG5vdGVzID0gWyAnQycsICdEYicsICdEJywgJ0ViJywgJ0UnLCAnRicsICdGIycsICdHJywgJ0FiJywgJ0EnLCAnQmInLCAnQicgXVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KXtcclxuICAgIGxldCBkYXRhID0gKDYwICsga2V5KSAlIDEyXHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBfa2V5OiBrZXksXHJcbiAgICAgICAgc3RyOiAoKSA9PlxyXG4gICAgICAgICAgICBub3Rlc1tkYXRhXVxyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lLCBjaG9yZHMpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgIGNob3JkczogY2hvcmRzXHJcbiAgICB9XHJcbn0iLCJjb25zdCBOb3RlID0gcmVxdWlyZSgnLi9Ob3RlLmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRvbmUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByb290OiAoKSA9PiBOb3RlKHRvbmUpLFxyXG4gICAgICAgIG1ham9yVGhpcmQ6ICgpID0+IE5vdGUodG9uZSArIDQpLFxyXG4gICAgICAgIG1pbm9yVGhpcmQ6ICgpID0+IE5vdGUodG9uZSArIDMpLFxyXG4gICAgICAgIHBlcmZlY3RGaWZ0aDogKCkgPT4gTm90ZSh0b25lICsgNyksXHJcbiAgICAgICAgbWFqb3JTZXZlbnRoOiAoKSA9PiBOb3RlKHRvbmUgLSAxKSxcclxuICAgICAgICBtaW5vclNldmVudGg6ICgpID0+IE5vdGUodG9uZSAtIDIpXHJcbiAgICB9XHJcbn0iLCJjb25zdCBEb21pbmFudFNldmVudGhDaG9yZCA9IHJlcXVpcmUoJy4uL2Nob3Jkcy9Eb21pbmFudFNldmVudGhDaG9yZC5qcycpXHJcbmNvbnN0IFJvb3RsZXNzID0gcmVxdWlyZSgnLi4vdm9pY2luZ3MvUm9vdGxlc3MuanMnKVxyXG5jb25zdCBJbnZlcnNpb24gPSByZXF1aXJlKCcuLi92b2ljaW5ncy9JbnZlcnNpb24uanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodG9uZSl7XHJcbiAgICByZXR1cm4gSW52ZXJzaW9uKFJvb3RsZXNzKERvbWluYW50U2V2ZW50aENob3JkKHRvbmUpKSwgMilcclxufSIsImNvbnN0IE1ham9yU2V2ZW50aENob3JkID0gcmVxdWlyZSgnLi4vY2hvcmRzL01ham9yU2V2ZW50aENob3JkLmpzJylcclxuY29uc3QgUm9vdGxlc3MgPSByZXF1aXJlKCcuLi92b2ljaW5ncy9Sb290bGVzcy5qcycpXHJcbmNvbnN0IEludmVyc2lvbiA9IHJlcXVpcmUoJy4uL3ZvaWNpbmdzL0ludmVyc2lvbi5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b25lKXtcclxuICAgIHJldHVybiBJbnZlcnNpb24oUm9vdGxlc3MoTWFqb3JTZXZlbnRoQ2hvcmQodG9uZSkpLCAyKVxyXG59IiwiY29uc3QgTWlub3JTZXZlbnRoQ2hvcmQgPSByZXF1aXJlKCcuLi9jaG9yZHMvTWlub3JTZXZlbnRoQ2hvcmQuanMnKVxyXG5jb25zdCBSb290bGVzcyA9IHJlcXVpcmUoJy4uL3ZvaWNpbmdzL1Jvb3RsZXNzLmpzJylcclxuY29uc3QgSW52ZXJzaW9uID0gcmVxdWlyZSgnLi4vdm9pY2luZ3MvSW52ZXJzaW9uLmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRvbmUpe1xyXG4gICAgcmV0dXJuIEludmVyc2lvbihSb290bGVzcyhNaW5vclNldmVudGhDaG9yZCh0b25lKSksIDIpXHJcbn0iLCJjb25zdCBTY2FsZSA9IHJlcXVpcmUoJy4uL1NjYWxlLmpzJylcclxuY29uc3QgQ2hvcmQgPSByZXF1aXJlKCcuLi9DaG9yZC5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjaG9yZCl7XHJcbiAgICBsZXQgc2NhbGUgPSBTY2FsZShjaG9yZClcclxuXHJcbiAgICByZXR1cm4gQ2hvcmQoW1xyXG4gICAgICAgICAgICBzY2FsZS5yb290KCksXHJcbiAgICAgICAgICAgIHNjYWxlLm1ham9yVGhpcmQoKSxcclxuICAgICAgICAgICAgc2NhbGUucGVyZmVjdEZpZnRoKCksXHJcbiAgICAgICAgICAgIHNjYWxlLm1pbm9yU2V2ZW50aCgpXHJcbiAgICAgICAgXSwgJzcnKVxyXG59IiwiY29uc3QgU2NhbGUgPSByZXF1aXJlKCcuLi9TY2FsZS5qcycpXHJcbmNvbnN0IENob3JkID0gcmVxdWlyZSgnLi4vQ2hvcmQuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY2hvcmQpe1xyXG4gICAgbGV0IHNjYWxlID0gU2NhbGUoY2hvcmQpXHJcblxyXG4gICAgcmV0dXJuIENob3JkKFtcclxuICAgICAgICAgICAgc2NhbGUucm9vdCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5tYWpvclRoaXJkKCksXHJcbiAgICAgICAgICAgIHNjYWxlLnBlcmZlY3RGaWZ0aCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5tYWpvclNldmVudGgoKVxyXG4gICAgICAgIF0sICdtYWo3JylcclxufSIsImNvbnN0IFNjYWxlID0gcmVxdWlyZSgnLi4vU2NhbGUuanMnKVxyXG5jb25zdCBDaG9yZCA9IHJlcXVpcmUoJy4uL0Nob3JkLmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNob3JkKXtcclxuICAgIGxldCBzY2FsZSA9IFNjYWxlKGNob3JkKVxyXG5cclxuICAgIHJldHVybiBDaG9yZChbXHJcbiAgICAgICAgICAgIHNjYWxlLnJvb3QoKSxcclxuICAgICAgICAgICAgc2NhbGUubWlub3JUaGlyZCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5wZXJmZWN0RmlmdGgoKSxcclxuICAgICAgICAgICAgc2NhbGUubWlub3JTZXZlbnRoKClcclxuICAgICAgICBdLCAnbTcnKVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY2hvcmQsIGludmVyc2lvbil7XHJcbiAgICBpbnZlcnNpb24gPSBpbnZlcnNpb24gPyBpbnZlcnNpb24gOiAxXHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGludmVyc2lvbjsgaSsrKXtcclxuICAgICAgICBjaG9yZC5ub3Rlcy5wdXNoKGNob3JkLm5vdGVzLnNoaWZ0KCkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hvcmRcclxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNob3JkKXtcclxuICAgIGNob3JkLm5vdGVzID0gY2hvcmQubm90ZXMuZmlsdGVyKHggPT4geC5kYXRhICE9PSBjaG9yZC5yb290LmRhdGEpXHJcbiAgICByZXR1cm4gY2hvcmRcclxufSJdfQ==
