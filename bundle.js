(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const midi = require('./midi.js')
const Chord = require('./music/Chord.js')
const CircleOfFourths735 = require('./music/progressions/CircleOfFourths-7-3-5.js')
const Diatonic735 = require('./music/progressions/Diatonic-7-3-5.js')

let progression = Diatonic735(6)

let currentChord = progression.chords[0]
let voicing = document.getElementById('voicing') 
let card = document.getElementById('card')

function render(){
    voicing.innerHTML = progression.name,
    card.innerHTML = currentChord.name()
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
},{"./midi.js":3,"./music/Chord.js":4,"./music/progressions/CircleOfFourths-7-3-5.js":18,"./music/progressions/Diatonic-7-3-5.js":19}],2:[function(require,module,exports){
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
},{"./audio.js":2,"./music/Chord.js":4,"./music/Note.js":7}],4:[function(require,module,exports){
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
const Scale = require('./Scale.js')

module.exports = function(tone, major, minor, dominant, halfDiminished){
    let scale = Scale(tone)
    let chords = [
        major(tone),
        minor(tone + 2),
        minor(tone + 4),
        major(tone + 5),
        dominant(tone + 7),
        minor(tone + 9),
        halfDiminished(tone - 1)
    ]
    return chords.concat([chords[0]]).concat(chords.reverse())
}
},{"./Scale.js":9}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
module.exports = function(name, chords){
    return {
        name: name,
        chords: chords
    }
}
},{}],9:[function(require,module,exports){
const Note = require('./Note.js')

module.exports = function (tone){
    return {
        root: () => Note(tone),
        minorThird: () => Note(tone + 3),
        majorThird: () => Note(tone + 4),
        diminishedFifth: () => Note(tone + 6),
        perfectFifth: () => Note(tone + 7),
        majorSeventh: () => Note(tone - 1),
        minorSeventh: () => Note(tone - 2)
    }
}
},{"./Note.js":7}],10:[function(require,module,exports){
const DominantSeventhChord = require('../chords/DominantSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(DominantSeventhChord(tone)), 2)
}
},{"../chords/DominantSeventhChord.js":14,"../voicings/Inversion.js":20,"../voicings/Rootless.js":21}],11:[function(require,module,exports){
const HalfDiminishedChord = require('../chords/HalfDiminishedChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(HalfDiminishedChord(tone)), 2)
}
},{"../chords/HalfDiminishedChord.js":15,"../voicings/Inversion.js":20,"../voicings/Rootless.js":21}],12:[function(require,module,exports){
const MajorSeventhChord = require('../chords/MajorSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(MajorSeventhChord(tone)), 2)
}
},{"../chords/MajorSeventhChord.js":16,"../voicings/Inversion.js":20,"../voicings/Rootless.js":21}],13:[function(require,module,exports){
const MinorSeventhChord = require('../chords/MinorSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(MinorSeventhChord(tone)), 2)
}
},{"../chords/MinorSeventhChord.js":17,"../voicings/Inversion.js":20,"../voicings/Rootless.js":21}],14:[function(require,module,exports){
const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (tone){
    let scale = Scale(tone)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth(),
            scale.minorSeventh()
        ], '<small>7</small>')
}
},{"../Chord.js":4,"../Scale.js":9}],15:[function(require,module,exports){
const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (tone){
    let scale = Scale(tone)

    return Chord([
            scale.root(),
            scale.minorThird(),
            scale.diminishedFifth(),
            scale.minorSeventh()
        ], '<small>&#8709;</small>')
}
},{"../Chord.js":4,"../Scale.js":9}],16:[function(require,module,exports){
const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (tone){
    let scale = Scale(tone)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth(),
            scale.majorSeventh()
        ], '<small>maj7</small>')
}
},{"../Chord.js":4,"../Scale.js":9}],17:[function(require,module,exports){
const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (tone){
    let scale = Scale(tone)

    return Chord([
            scale.root(),
            scale.minorThird(),
            scale.perfectFifth(),
            scale.minorSeventh()
        ], '<small>m7</small>')
}
},{"../Chord.js":4,"../Scale.js":9}],18:[function(require,module,exports){
const Progression = require('../Progression.js')
const CircleOfFourths = require('../CircleOfFourths.js')
const MajorSeventh735 = require('../chord-voicings/MajorSeventh-7-3-5.js')
const DominantSeventh735 = require('../chord-voicings/DominantSeventh-7-3-5.js')
const MinorSeventh735 = require('../chord-voicings/MinorSeventh-7-3-5.js')

module.exports = function(){
    return Progression('Rootless 7-3-5',
        CircleOfFourths(MajorSeventh735)
        .concat(CircleOfFourths(DominantSeventh735))
        .concat(CircleOfFourths(MinorSeventh735))
    )
}
},{"../CircleOfFourths.js":5,"../Progression.js":8,"../chord-voicings/DominantSeventh-7-3-5.js":10,"../chord-voicings/MajorSeventh-7-3-5.js":12,"../chord-voicings/MinorSeventh-7-3-5.js":13}],19:[function(require,module,exports){
const Progression = require('../Progression.js')
const Diatonic = require('../Diatonic.js')
const MajorSeventh735 = require('../chord-voicings/MajorSeventh-7-3-5.js')
const MinorSeventh735 = require('../chord-voicings/MinorSeventh-7-3-5.js')
const DominantSeventh735 = require('../chord-voicings/DominantSeventh-7-3-5.js')
const HalfDiminished735 = require('../chord-voicings/HalfDiminished-7-3-5.js')

module.exports = function(tone){
    return Progression('Rootless 7-3-5',
        Diatonic(tone, MajorSeventh735, MinorSeventh735, DominantSeventh735, HalfDiminished735)
    )
}
},{"../Diatonic.js":6,"../Progression.js":8,"../chord-voicings/DominantSeventh-7-3-5.js":10,"../chord-voicings/HalfDiminished-7-3-5.js":11,"../chord-voicings/MajorSeventh-7-3-5.js":12,"../chord-voicings/MinorSeventh-7-3-5.js":13}],20:[function(require,module,exports){
module.exports = function (chord, inversion){
    inversion = inversion ? inversion : 1

    for(var i = 0; i < inversion; i++){
        chord.notes.push(chord.notes.shift())
    }
    return chord
}
},{}],21:[function(require,module,exports){
module.exports = function (chord){
    chord.notes = chord.notes.filter(x => x.data !== chord.root.data)
    return chord
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2F1ZGlvLmpzIiwic3JjL21pZGkuanMiLCJzcmMvbXVzaWMvQ2hvcmQuanMiLCJzcmMvbXVzaWMvQ2lyY2xlT2ZGb3VydGhzLmpzIiwic3JjL211c2ljL0RpYXRvbmljLmpzIiwic3JjL211c2ljL05vdGUuanMiLCJzcmMvbXVzaWMvUHJvZ3Jlc3Npb24uanMiLCJzcmMvbXVzaWMvU2NhbGUuanMiLCJzcmMvbXVzaWMvY2hvcmQtdm9pY2luZ3MvRG9taW5hbnRTZXZlbnRoLTctMy01LmpzIiwic3JjL211c2ljL2Nob3JkLXZvaWNpbmdzL0hhbGZEaW1pbmlzaGVkLTctMy01LmpzIiwic3JjL211c2ljL2Nob3JkLXZvaWNpbmdzL01ham9yU2V2ZW50aC03LTMtNS5qcyIsInNyYy9tdXNpYy9jaG9yZC12b2ljaW5ncy9NaW5vclNldmVudGgtNy0zLTUuanMiLCJzcmMvbXVzaWMvY2hvcmRzL0RvbWluYW50U2V2ZW50aENob3JkLmpzIiwic3JjL211c2ljL2Nob3Jkcy9IYWxmRGltaW5pc2hlZENob3JkLmpzIiwic3JjL211c2ljL2Nob3Jkcy9NYWpvclNldmVudGhDaG9yZC5qcyIsInNyYy9tdXNpYy9jaG9yZHMvTWlub3JTZXZlbnRoQ2hvcmQuanMiLCJzcmMvbXVzaWMvcHJvZ3Jlc3Npb25zL0NpcmNsZU9mRm91cnRocy03LTMtNS5qcyIsInNyYy9tdXNpYy9wcm9ncmVzc2lvbnMvRGlhdG9uaWMtNy0zLTUuanMiLCJzcmMvbXVzaWMvdm9pY2luZ3MvSW52ZXJzaW9uLmpzIiwic3JjL211c2ljL3ZvaWNpbmdzL1Jvb3RsZXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgbWlkaSA9IHJlcXVpcmUoJy4vbWlkaS5qcycpXHJcbmNvbnN0IENob3JkID0gcmVxdWlyZSgnLi9tdXNpYy9DaG9yZC5qcycpXHJcbmNvbnN0IENpcmNsZU9mRm91cnRoczczNSA9IHJlcXVpcmUoJy4vbXVzaWMvcHJvZ3Jlc3Npb25zL0NpcmNsZU9mRm91cnRocy03LTMtNS5qcycpXHJcbmNvbnN0IERpYXRvbmljNzM1ID0gcmVxdWlyZSgnLi9tdXNpYy9wcm9ncmVzc2lvbnMvRGlhdG9uaWMtNy0zLTUuanMnKVxyXG5cclxubGV0IHByb2dyZXNzaW9uID0gRGlhdG9uaWM3MzUoNilcclxuXHJcbmxldCBjdXJyZW50Q2hvcmQgPSBwcm9ncmVzc2lvbi5jaG9yZHNbMF1cclxubGV0IHZvaWNpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndm9pY2luZycpIFxyXG5sZXQgY2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkJylcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpe1xyXG4gICAgdm9pY2luZy5pbm5lckhUTUwgPSBwcm9ncmVzc2lvbi5uYW1lLFxyXG4gICAgY2FyZC5pbm5lckhUTUwgPSBjdXJyZW50Q2hvcmQubmFtZSgpXHJcbiAgICBjbGVhbigpXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBuZXh0KCl7XHJcbiAgICBwcm9ncmVzc2lvbi5jaG9yZHMucHVzaChwcm9ncmVzc2lvbi5jaG9yZHMuc2hpZnQoKSlcclxuICAgIGN1cnJlbnRDaG9yZCA9IHByb2dyZXNzaW9uLmNob3Jkc1swXVxyXG4gICAgcmVuZGVyKClcclxufVxyXG5cclxucmVuZGVyKClcclxuXHJcbm1pZGkub25jaGFuZ2UgPSBub3RlcyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhDaG9yZChub3Rlcykuc3RyKCkpXHJcblxyXG4gICAgaWYobm90ZXMuc29tZSh4ID0+ICFjdXJyZW50Q2hvcmQubm90ZXMuZmluZCh5ID0+IHguZGF0YSA9PT0geS5kYXRhKSkpe1xyXG4gICAgICAgIHdyb25nKClcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgaWYobm90ZXMubGVuZ3RoID09PSBjdXJyZW50Q2hvcmQubm90ZXMubGVuZ3RoXHJcbiAgICAgICAgICAgICYmIGN1cnJlbnRDaG9yZC5ub3Rlcy5ldmVyeShcclxuICAgICAgICAgICAgICAgICh4LCBpKSA9PiBub3Rlc1tpXS5kYXRhID09PSB4LmRhdGEpKXtcclxuICAgICAgICAgICAgICAgIHJpZ2h0KClcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQobmV4dCwgMTAwMClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihub3Rlcy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgcmVhZGluZygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjbGVhbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhbigpe1xyXG4gICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdyaWdodCcpXHJcbiAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJylcclxuICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgncmVhZGluZycpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXRlKHN0YXRlKXtcclxuICAgIGNsZWFuKClcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZChzdGF0ZSlcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZGluZygpe1xyXG4gICAgc3RhdGUoJ3JlYWRpbmcnKVxyXG59XHJcblxyXG5mdW5jdGlvbiByaWdodCgpe1xyXG4gICAgc3RhdGUoJ3JpZ2h0JylcclxufVxyXG5cclxuZnVuY3Rpb24gd3JvbmcoKXtcclxuICAgIHN0YXRlKCd3cm9uZycpXHJcbn1cclxuXHJcbmNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0O1xyXG5vc2NpbGxhdG9yID0gY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XHJcbi8vb3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSAyMDA7XHJcblxyXG5vc2NpbGxhdG9yLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7XHJcblxyXG5vc2NpbGxhdG9yLnN0YXJ0KDApO1xyXG5vc2NpbGxhdG9yLnN0b3AoMCk7IiwiY29uc3QgY29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHRcclxuXHJcbmxldCBub3RlcyA9IFtdXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHBsYXk6IGtleSA9PiB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgbGV0IG9zY2lsbGF0b3IgPSBjb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKVxyXG5cclxuICAgICAgICBsZXQgZnJlcXVlbmN5ID0gNDQwXHJcbiAgICAgICAgbGV0IGRpZiA9IGtleSAtIDU3XHJcbiAgICAgICAgaWYoZGlmID4gMCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBkaWY7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBmcmVxdWVuY3kgPSBmcmVxdWVuY3kgKiAxLjA1OTQ2XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IGRpZjsgaSA8IDA7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBmcmVxdWVuY3kgPSBmcmVxdWVuY3kgLyAxLjA1OTQ2XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSBmcmVxdWVuY3lcclxuICAgICAgICBcclxuICAgICAgICBvc2NpbGxhdG9yLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbilcclxuICAgICAgICBvc2NpbGxhdG9yLnN0YXJ0KDApXHJcbiAgICAgICAgbm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgIGtleToga2V5LFxyXG4gICAgICAgICAgICBvc2NpbGxhdG9yOiBvc2NpbGxhdG9yXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBzdG9wOiBrZXkgPT4ge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICAgIGxldCBub3RlID0gbm90ZXMuZmluZCh4ID0+IHgua2V5ID09PSBrZXkpXHJcbiAgICAgICAgbm90ZS5vc2NpbGxhdG9yLnN0b3AoMClcclxuICAgICAgICBub3Rlcy5zcGxpY2Uobm90ZXMuaW5kZXhPZihub3RlKSwgMSlcclxuICAgIH1cclxufSIsImNvbnN0IGF1ZGlvID0gcmVxdWlyZSgnLi9hdWRpby5qcycpXHJcbmNvbnN0IE5vdGUgPSByZXF1aXJlKCcuL211c2ljL05vdGUuanMnKVxyXG5jb25zdCBDaG9yZCA9IHJlcXVpcmUoJy4vbXVzaWMvQ2hvcmQuanMnKVxyXG5cclxubGV0IG1pZGkgPSB7XHJcbiAgICBub3RlczogW10sXHJcbiAgICBvbmNoYW5nZTogKCkgPT4gY29uc29sZS5sb2coQ2hvcmQobWlkaS5ub3Rlcykuc3RyKCkpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uTUlESU1lc3NhZ2UoIGV2ZW50ICkge1xyXG4gICAgbGV0IGRhdGEgPSBldmVudC5kYXRhXHJcbiAgICBsZXQgb24gPSBkYXRhWzBdID09PSAweDkwXHJcbiAgICBsZXQga2V5ID0gZGF0YVsxXVxyXG4gICAgbGV0IG5vdGUgPSBOb3RlKGtleSlcclxuICAgIFxyXG4gICAgaWYob24pe1xyXG4gICAgICAgIG1pZGkubm90ZXMucHVzaChub3RlKVxyXG4gICAgICAgIGF1ZGlvLnBsYXkoa2V5KVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICBsZXQgaSA9IG1pZGkubm90ZXMuZmluZEluZGV4KFxyXG4gICAgICAgICAgICB4ID0+IHguX2tleSA9PT0ga2V5KVxyXG4gICAgICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICAgICAgbWlkaS5ub3Rlcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYXVkaW8uc3RvcChrZXkpXHJcbiAgICB9XHJcblxyXG4gICAgbWlkaS5ub3Rlcy5zb3J0KChhLCBiKSA9PiBhLl9rZXkgPiBiLl9rZXkpXHJcblxyXG4gICAgbWlkaS5vbmNoYW5nZShtaWRpLm5vdGVzKVxyXG59XHJcblxyXG5mdW5jdGlvbiBvbk1JRElTdWNjZXNzKCBtaWRpQWNjZXNzICkge1xyXG4gICAgbWlkaUFjY2Vzcy5pbnB1dHMuZm9yRWFjaCggZW50cnkgPT4gZW50cnkub25taWRpbWVzc2FnZSA9IG9uTUlESU1lc3NhZ2UgKVxyXG59XHJcblxyXG5uYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3MoKS50aGVuKG9uTUlESVN1Y2Nlc3MpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1pZGkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChub3RlcywgbmFtZSl7XHJcbiAgICBsZXQgY2hvcmQgPSB7XHJcbiAgICAgICAgbm90ZXM6IG5vdGVzLFxyXG4gICAgICAgIHJvb3Q6IG5vdGVzWzBdXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNob3JkLm5hbWUgPSAoKSA9PiBcclxuICAgICAgICBjaG9yZC5yb290LnN0cigpICsgbmFtZVxyXG5cclxuICAgIGNob3JkLnN0ciA9ICgpID0+XHJcbiAgICAgICAgY2hvcmQubm90ZXMubWFwKHggPT4geC5zdHIoKSlcclxuXHJcbiAgICByZXR1cm4gY2hvcmRcclxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNob3JkX3R5cGUpe1xyXG4gICAgY2hvcmRfdHlwZSA9IGNob3JkX3R5cGUgPyBjaG9yZF90eXBlIDogTWFqb3JDaG9yZFxyXG5cclxuICAgIHJldHVybiBBcnJheSgxMikuZmlsbCgwKVxyXG4gICAgICAgIC5yZWR1Y2UoKHAsIHgsIGkpID0+IHtcclxuICAgICAgICAgICAgcC5wdXNoKGNob3JkX3R5cGUoaSAqIDUpKVxyXG4gICAgICAgICAgICByZXR1cm4gcFxyXG4gICAgICAgIH0sIFtdKVxyXG59IiwiY29uc3QgU2NhbGUgPSByZXF1aXJlKCcuL1NjYWxlLmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odG9uZSwgbWFqb3IsIG1pbm9yLCBkb21pbmFudCwgaGFsZkRpbWluaXNoZWQpe1xyXG4gICAgbGV0IHNjYWxlID0gU2NhbGUodG9uZSlcclxuICAgIGxldCBjaG9yZHMgPSBbXHJcbiAgICAgICAgbWFqb3IodG9uZSksXHJcbiAgICAgICAgbWlub3IodG9uZSArIDIpLFxyXG4gICAgICAgIG1pbm9yKHRvbmUgKyA0KSxcclxuICAgICAgICBtYWpvcih0b25lICsgNSksXHJcbiAgICAgICAgZG9taW5hbnQodG9uZSArIDcpLFxyXG4gICAgICAgIG1pbm9yKHRvbmUgKyA5KSxcclxuICAgICAgICBoYWxmRGltaW5pc2hlZCh0b25lIC0gMSlcclxuICAgIF1cclxuICAgIHJldHVybiBjaG9yZHMuY29uY2F0KFtjaG9yZHNbMF1dKS5jb25jYXQoY2hvcmRzLnJldmVyc2UoKSlcclxufSIsImNvbnN0IG5vdGVzID0gWyAnQycsICdEYicsICdEJywgJ0ViJywgJ0UnLCAnRicsICdGIycsICdHJywgJ0FiJywgJ0EnLCAnQmInLCAnQicgXVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KXtcclxuICAgIGxldCBkYXRhID0gKDYwICsga2V5KSAlIDEyXHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBfa2V5OiBrZXksXHJcbiAgICAgICAgc3RyOiAoKSA9PlxyXG4gICAgICAgICAgICBub3Rlc1tkYXRhXVxyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lLCBjaG9yZHMpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgIGNob3JkczogY2hvcmRzXHJcbiAgICB9XHJcbn0iLCJjb25zdCBOb3RlID0gcmVxdWlyZSgnLi9Ob3RlLmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRvbmUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByb290OiAoKSA9PiBOb3RlKHRvbmUpLFxyXG4gICAgICAgIG1pbm9yVGhpcmQ6ICgpID0+IE5vdGUodG9uZSArIDMpLFxyXG4gICAgICAgIG1ham9yVGhpcmQ6ICgpID0+IE5vdGUodG9uZSArIDQpLFxyXG4gICAgICAgIGRpbWluaXNoZWRGaWZ0aDogKCkgPT4gTm90ZSh0b25lICsgNiksXHJcbiAgICAgICAgcGVyZmVjdEZpZnRoOiAoKSA9PiBOb3RlKHRvbmUgKyA3KSxcclxuICAgICAgICBtYWpvclNldmVudGg6ICgpID0+IE5vdGUodG9uZSAtIDEpLFxyXG4gICAgICAgIG1pbm9yU2V2ZW50aDogKCkgPT4gTm90ZSh0b25lIC0gMilcclxuICAgIH1cclxufSIsImNvbnN0IERvbWluYW50U2V2ZW50aENob3JkID0gcmVxdWlyZSgnLi4vY2hvcmRzL0RvbWluYW50U2V2ZW50aENob3JkLmpzJylcclxuY29uc3QgUm9vdGxlc3MgPSByZXF1aXJlKCcuLi92b2ljaW5ncy9Sb290bGVzcy5qcycpXHJcbmNvbnN0IEludmVyc2lvbiA9IHJlcXVpcmUoJy4uL3ZvaWNpbmdzL0ludmVyc2lvbi5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b25lKXtcclxuICAgIHJldHVybiBJbnZlcnNpb24oUm9vdGxlc3MoRG9taW5hbnRTZXZlbnRoQ2hvcmQodG9uZSkpLCAyKVxyXG59IiwiY29uc3QgSGFsZkRpbWluaXNoZWRDaG9yZCA9IHJlcXVpcmUoJy4uL2Nob3Jkcy9IYWxmRGltaW5pc2hlZENob3JkLmpzJylcclxuY29uc3QgUm9vdGxlc3MgPSByZXF1aXJlKCcuLi92b2ljaW5ncy9Sb290bGVzcy5qcycpXHJcbmNvbnN0IEludmVyc2lvbiA9IHJlcXVpcmUoJy4uL3ZvaWNpbmdzL0ludmVyc2lvbi5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b25lKXtcclxuICAgIHJldHVybiBJbnZlcnNpb24oUm9vdGxlc3MoSGFsZkRpbWluaXNoZWRDaG9yZCh0b25lKSksIDIpXHJcbn0iLCJjb25zdCBNYWpvclNldmVudGhDaG9yZCA9IHJlcXVpcmUoJy4uL2Nob3Jkcy9NYWpvclNldmVudGhDaG9yZC5qcycpXHJcbmNvbnN0IFJvb3RsZXNzID0gcmVxdWlyZSgnLi4vdm9pY2luZ3MvUm9vdGxlc3MuanMnKVxyXG5jb25zdCBJbnZlcnNpb24gPSByZXF1aXJlKCcuLi92b2ljaW5ncy9JbnZlcnNpb24uanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodG9uZSl7XHJcbiAgICByZXR1cm4gSW52ZXJzaW9uKFJvb3RsZXNzKE1ham9yU2V2ZW50aENob3JkKHRvbmUpKSwgMilcclxufSIsImNvbnN0IE1pbm9yU2V2ZW50aENob3JkID0gcmVxdWlyZSgnLi4vY2hvcmRzL01pbm9yU2V2ZW50aENob3JkLmpzJylcclxuY29uc3QgUm9vdGxlc3MgPSByZXF1aXJlKCcuLi92b2ljaW5ncy9Sb290bGVzcy5qcycpXHJcbmNvbnN0IEludmVyc2lvbiA9IHJlcXVpcmUoJy4uL3ZvaWNpbmdzL0ludmVyc2lvbi5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b25lKXtcclxuICAgIHJldHVybiBJbnZlcnNpb24oUm9vdGxlc3MoTWlub3JTZXZlbnRoQ2hvcmQodG9uZSkpLCAyKVxyXG59IiwiY29uc3QgU2NhbGUgPSByZXF1aXJlKCcuLi9TY2FsZS5qcycpXHJcbmNvbnN0IENob3JkID0gcmVxdWlyZSgnLi4vQ2hvcmQuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodG9uZSl7XHJcbiAgICBsZXQgc2NhbGUgPSBTY2FsZSh0b25lKVxyXG5cclxuICAgIHJldHVybiBDaG9yZChbXHJcbiAgICAgICAgICAgIHNjYWxlLnJvb3QoKSxcclxuICAgICAgICAgICAgc2NhbGUubWFqb3JUaGlyZCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5wZXJmZWN0RmlmdGgoKSxcclxuICAgICAgICAgICAgc2NhbGUubWlub3JTZXZlbnRoKClcclxuICAgICAgICBdLCAnPHNtYWxsPjc8L3NtYWxsPicpXHJcbn0iLCJjb25zdCBTY2FsZSA9IHJlcXVpcmUoJy4uL1NjYWxlLmpzJylcclxuY29uc3QgQ2hvcmQgPSByZXF1aXJlKCcuLi9DaG9yZC5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b25lKXtcclxuICAgIGxldCBzY2FsZSA9IFNjYWxlKHRvbmUpXHJcblxyXG4gICAgcmV0dXJuIENob3JkKFtcclxuICAgICAgICAgICAgc2NhbGUucm9vdCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5taW5vclRoaXJkKCksXHJcbiAgICAgICAgICAgIHNjYWxlLmRpbWluaXNoZWRGaWZ0aCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5taW5vclNldmVudGgoKVxyXG4gICAgICAgIF0sICc8c21hbGw+JiM4NzA5Ozwvc21hbGw+JylcclxufSIsImNvbnN0IFNjYWxlID0gcmVxdWlyZSgnLi4vU2NhbGUuanMnKVxyXG5jb25zdCBDaG9yZCA9IHJlcXVpcmUoJy4uL0Nob3JkLmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRvbmUpe1xyXG4gICAgbGV0IHNjYWxlID0gU2NhbGUodG9uZSlcclxuXHJcbiAgICByZXR1cm4gQ2hvcmQoW1xyXG4gICAgICAgICAgICBzY2FsZS5yb290KCksXHJcbiAgICAgICAgICAgIHNjYWxlLm1ham9yVGhpcmQoKSxcclxuICAgICAgICAgICAgc2NhbGUucGVyZmVjdEZpZnRoKCksXHJcbiAgICAgICAgICAgIHNjYWxlLm1ham9yU2V2ZW50aCgpXHJcbiAgICAgICAgXSwgJzxzbWFsbD5tYWo3PC9zbWFsbD4nKVxyXG59IiwiY29uc3QgU2NhbGUgPSByZXF1aXJlKCcuLi9TY2FsZS5qcycpXHJcbmNvbnN0IENob3JkID0gcmVxdWlyZSgnLi4vQ2hvcmQuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodG9uZSl7XHJcbiAgICBsZXQgc2NhbGUgPSBTY2FsZSh0b25lKVxyXG5cclxuICAgIHJldHVybiBDaG9yZChbXHJcbiAgICAgICAgICAgIHNjYWxlLnJvb3QoKSxcclxuICAgICAgICAgICAgc2NhbGUubWlub3JUaGlyZCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5wZXJmZWN0RmlmdGgoKSxcclxuICAgICAgICAgICAgc2NhbGUubWlub3JTZXZlbnRoKClcclxuICAgICAgICBdLCAnPHNtYWxsPm03PC9zbWFsbD4nKVxyXG59IiwiY29uc3QgUHJvZ3Jlc3Npb24gPSByZXF1aXJlKCcuLi9Qcm9ncmVzc2lvbi5qcycpXHJcbmNvbnN0IENpcmNsZU9mRm91cnRocyA9IHJlcXVpcmUoJy4uL0NpcmNsZU9mRm91cnRocy5qcycpXHJcbmNvbnN0IE1ham9yU2V2ZW50aDczNSA9IHJlcXVpcmUoJy4uL2Nob3JkLXZvaWNpbmdzL01ham9yU2V2ZW50aC03LTMtNS5qcycpXHJcbmNvbnN0IERvbWluYW50U2V2ZW50aDczNSA9IHJlcXVpcmUoJy4uL2Nob3JkLXZvaWNpbmdzL0RvbWluYW50U2V2ZW50aC03LTMtNS5qcycpXHJcbmNvbnN0IE1pbm9yU2V2ZW50aDczNSA9IHJlcXVpcmUoJy4uL2Nob3JkLXZvaWNpbmdzL01pbm9yU2V2ZW50aC03LTMtNS5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gUHJvZ3Jlc3Npb24oJ1Jvb3RsZXNzIDctMy01JyxcclxuICAgICAgICBDaXJjbGVPZkZvdXJ0aHMoTWFqb3JTZXZlbnRoNzM1KVxyXG4gICAgICAgIC5jb25jYXQoQ2lyY2xlT2ZGb3VydGhzKERvbWluYW50U2V2ZW50aDczNSkpXHJcbiAgICAgICAgLmNvbmNhdChDaXJjbGVPZkZvdXJ0aHMoTWlub3JTZXZlbnRoNzM1KSlcclxuICAgIClcclxufSIsImNvbnN0IFByb2dyZXNzaW9uID0gcmVxdWlyZSgnLi4vUHJvZ3Jlc3Npb24uanMnKVxyXG5jb25zdCBEaWF0b25pYyA9IHJlcXVpcmUoJy4uL0RpYXRvbmljLmpzJylcclxuY29uc3QgTWFqb3JTZXZlbnRoNzM1ID0gcmVxdWlyZSgnLi4vY2hvcmQtdm9pY2luZ3MvTWFqb3JTZXZlbnRoLTctMy01LmpzJylcclxuY29uc3QgTWlub3JTZXZlbnRoNzM1ID0gcmVxdWlyZSgnLi4vY2hvcmQtdm9pY2luZ3MvTWlub3JTZXZlbnRoLTctMy01LmpzJylcclxuY29uc3QgRG9taW5hbnRTZXZlbnRoNzM1ID0gcmVxdWlyZSgnLi4vY2hvcmQtdm9pY2luZ3MvRG9taW5hbnRTZXZlbnRoLTctMy01LmpzJylcclxuY29uc3QgSGFsZkRpbWluaXNoZWQ3MzUgPSByZXF1aXJlKCcuLi9jaG9yZC12b2ljaW5ncy9IYWxmRGltaW5pc2hlZC03LTMtNS5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRvbmUpe1xyXG4gICAgcmV0dXJuIFByb2dyZXNzaW9uKCdSb290bGVzcyA3LTMtNScsXHJcbiAgICAgICAgRGlhdG9uaWModG9uZSwgTWFqb3JTZXZlbnRoNzM1LCBNaW5vclNldmVudGg3MzUsIERvbWluYW50U2V2ZW50aDczNSwgSGFsZkRpbWluaXNoZWQ3MzUpXHJcbiAgICApXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjaG9yZCwgaW52ZXJzaW9uKXtcclxuICAgIGludmVyc2lvbiA9IGludmVyc2lvbiA/IGludmVyc2lvbiA6IDFcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgaW52ZXJzaW9uOyBpKyspe1xyXG4gICAgICAgIGNob3JkLm5vdGVzLnB1c2goY2hvcmQubm90ZXMuc2hpZnQoKSlcclxuICAgIH1cclxuICAgIHJldHVybiBjaG9yZFxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY2hvcmQpe1xyXG4gICAgY2hvcmQubm90ZXMgPSBjaG9yZC5ub3Rlcy5maWx0ZXIoeCA9PiB4LmRhdGEgIT09IGNob3JkLnJvb3QuZGF0YSlcclxuICAgIHJldHVybiBjaG9yZFxyXG59Il19
