(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const midi = require('./midi.js')
const CircleOfFourths = require('./music/CircleOfFourths.js')
const MajorSeventhChord = require('./music/chords/MajorSeventhChord.js')

let progression = CircleOfFourths(MajorSeventhChord)

function render(){
    document.getElementById('card')
        .innerText = progression[0].name()
}

function next(){
    progression.push(progression.shift())
    render()
}

render()

/*midi.onchange = notes => {
    console.log('blee')
}*/
},{"./midi.js":2,"./music/CircleOfFourths.js":4,"./music/chords/MajorSeventhChord.js":7}],2:[function(require,module,exports){
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
    }
    else{
        let i = midi.notes.findIndex(
            x => x._key === key)
        if (i > -1) {
            midi.notes.splice(i, 1)
        }
    }

    midi.onchange()
}

function onMIDISuccess( midiAccess ) {
    midiAccess.inputs.forEach( entry => entry.onmidimessage = onMIDIMessage )
}

navigator.requestMIDIAccess().then(onMIDISuccess)

module.exports = midi
},{"./music/Chord.js":3,"./music/Note.js":5}],3:[function(require,module,exports){
module.exports = function (notes, name){
    let chord = {
        notes: notes,
        name: () => 
            notes[0].str() + name,
        str: () =>
            notes.map(x => x.str()),
        invert: inv => {
            for(var i = 0; i < inv; i++){
                notes.push(notes.shift())
            }
            return chord
        }
    }
    return chord
}
},{}],4:[function(require,module,exports){
module.exports = function (chord_type){
    chord_type = chord_type ? chord_type : MajorChord

    return Array(12).fill(0)
        .reduce((p, x, i) => {
            p.push(chord_type(i * 5))
            return p
        }, [])
}
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"./Note.js":5}],7:[function(require,module,exports){
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
},{"../Chord.js":3,"../Scale.js":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL21pZGkuanMiLCJzcmMvbXVzaWMvQ2hvcmQuanMiLCJzcmMvbXVzaWMvQ2lyY2xlT2ZGb3VydGhzLmpzIiwic3JjL211c2ljL05vdGUuanMiLCJzcmMvbXVzaWMvU2NhbGUuanMiLCJzcmMvbXVzaWMvY2hvcmRzL01ham9yU2V2ZW50aENob3JkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBtaWRpID0gcmVxdWlyZSgnLi9taWRpLmpzJylcclxuY29uc3QgQ2lyY2xlT2ZGb3VydGhzID0gcmVxdWlyZSgnLi9tdXNpYy9DaXJjbGVPZkZvdXJ0aHMuanMnKVxyXG5jb25zdCBNYWpvclNldmVudGhDaG9yZCA9IHJlcXVpcmUoJy4vbXVzaWMvY2hvcmRzL01ham9yU2V2ZW50aENob3JkLmpzJylcclxuXHJcbmxldCBwcm9ncmVzc2lvbiA9IENpcmNsZU9mRm91cnRocyhNYWpvclNldmVudGhDaG9yZClcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcigpe1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQnKVxyXG4gICAgICAgIC5pbm5lclRleHQgPSBwcm9ncmVzc2lvblswXS5uYW1lKClcclxufVxyXG5cclxuZnVuY3Rpb24gbmV4dCgpe1xyXG4gICAgcHJvZ3Jlc3Npb24ucHVzaChwcm9ncmVzc2lvbi5zaGlmdCgpKVxyXG4gICAgcmVuZGVyKClcclxufVxyXG5cclxucmVuZGVyKClcclxuXHJcbi8qbWlkaS5vbmNoYW5nZSA9IG5vdGVzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdibGVlJylcclxufSovIiwiY29uc3QgTm90ZSA9IHJlcXVpcmUoJy4vbXVzaWMvTm90ZS5qcycpXHJcbmNvbnN0IENob3JkID0gcmVxdWlyZSgnLi9tdXNpYy9DaG9yZC5qcycpXHJcblxyXG5sZXQgbWlkaSA9IHtcclxuICAgIG5vdGVzOiBbXSxcclxuICAgIG9uY2hhbmdlOiAoKSA9PiBjb25zb2xlLmxvZyhDaG9yZChtaWRpLm5vdGVzKS5zdHIoKSlcclxufVxyXG5cclxuZnVuY3Rpb24gb25NSURJTWVzc2FnZSggZXZlbnQgKSB7XHJcbiAgICBsZXQgZGF0YSA9IGV2ZW50LmRhdGFcclxuICAgIGxldCBvbiA9IGRhdGFbMF0gPT09IDB4OTBcclxuICAgIGxldCBrZXkgPSBkYXRhWzFdXHJcbiAgICBsZXQgbm90ZSA9IE5vdGUoa2V5KVxyXG4gICAgXHJcbiAgICBpZihvbil7XHJcbiAgICAgICAgbWlkaS5ub3Rlcy5wdXNoKG5vdGUpXHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIGxldCBpID0gbWlkaS5ub3Rlcy5maW5kSW5kZXgoXHJcbiAgICAgICAgICAgIHggPT4geC5fa2V5ID09PSBrZXkpXHJcbiAgICAgICAgaWYgKGkgPiAtMSkge1xyXG4gICAgICAgICAgICBtaWRpLm5vdGVzLnNwbGljZShpLCAxKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtaWRpLm9uY2hhbmdlKClcclxufVxyXG5cclxuZnVuY3Rpb24gb25NSURJU3VjY2VzcyggbWlkaUFjY2VzcyApIHtcclxuICAgIG1pZGlBY2Nlc3MuaW5wdXRzLmZvckVhY2goIGVudHJ5ID0+IGVudHJ5Lm9ubWlkaW1lc3NhZ2UgPSBvbk1JRElNZXNzYWdlIClcclxufVxyXG5cclxubmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzKCkudGhlbihvbk1JRElTdWNjZXNzKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtaWRpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobm90ZXMsIG5hbWUpe1xyXG4gICAgbGV0IGNob3JkID0ge1xyXG4gICAgICAgIG5vdGVzOiBub3RlcyxcclxuICAgICAgICBuYW1lOiAoKSA9PiBcclxuICAgICAgICAgICAgbm90ZXNbMF0uc3RyKCkgKyBuYW1lLFxyXG4gICAgICAgIHN0cjogKCkgPT5cclxuICAgICAgICAgICAgbm90ZXMubWFwKHggPT4geC5zdHIoKSksXHJcbiAgICAgICAgaW52ZXJ0OiBpbnYgPT4ge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgaW52OyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbm90ZXMucHVzaChub3Rlcy5zaGlmdCgpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjaG9yZFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjaG9yZFxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY2hvcmRfdHlwZSl7XHJcbiAgICBjaG9yZF90eXBlID0gY2hvcmRfdHlwZSA/IGNob3JkX3R5cGUgOiBNYWpvckNob3JkXHJcblxyXG4gICAgcmV0dXJuIEFycmF5KDEyKS5maWxsKDApXHJcbiAgICAgICAgLnJlZHVjZSgocCwgeCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBwLnB1c2goY2hvcmRfdHlwZShpICogNSkpXHJcbiAgICAgICAgICAgIHJldHVybiBwXHJcbiAgICAgICAgfSwgW10pXHJcbn0iLCJjb25zdCBub3RlcyA9IFsgJ0MnLCAnRGInLCAnRCcsICdFYicsICdFJywgJ0YnLCAnRiMnLCAnRycsICdBYicsICdBJywgJ0JiJywgJ0InIF1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSl7XHJcbiAgICBsZXQgZGF0YSA9ICg2MCArIGtleSkgJSAxMlxyXG4gICAgXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgX2tleToga2V5LFxyXG4gICAgICAgIHN0cjogKCkgPT5cclxuICAgICAgICAgICAgbm90ZXNbZGF0YV1cclxuICAgIH1cclxufSIsImNvbnN0IE5vdGUgPSByZXF1aXJlKCcuL05vdGUuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodG9uZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJvb3Q6ICgpID0+IE5vdGUodG9uZSksXHJcbiAgICAgICAgbWFqb3JUaGlyZDogKCkgPT4gTm90ZSh0b25lICsgNCksXHJcbiAgICAgICAgbWlub3JUaGlyZDogKCkgPT4gTm90ZSh0b25lICsgMyksXHJcbiAgICAgICAgcGVyZmVjdEZpZnRoOiAoKSA9PiBOb3RlKHRvbmUgKyA3KSxcclxuICAgICAgICBtYWpvclNldmVudGg6ICgpID0+IE5vdGUodG9uZSAtIDEpLFxyXG4gICAgICAgIG1pbm9yU2V2ZW50aDogKCkgPT4gTm90ZSh0b25lIC0gMilcclxuICAgIH1cclxufSIsImNvbnN0IFNjYWxlID0gcmVxdWlyZSgnLi4vU2NhbGUuanMnKVxyXG5jb25zdCBDaG9yZCA9IHJlcXVpcmUoJy4uL0Nob3JkLmpzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNob3JkKXtcclxuICAgIGxldCBzY2FsZSA9IFNjYWxlKGNob3JkKVxyXG5cclxuICAgIHJldHVybiBDaG9yZChbXHJcbiAgICAgICAgICAgIHNjYWxlLnJvb3QoKSxcclxuICAgICAgICAgICAgc2NhbGUubWFqb3JUaGlyZCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5wZXJmZWN0RmlmdGgoKSxcclxuICAgICAgICAgICAgc2NhbGUubWFqb3JTZXZlbnRoKClcclxuICAgICAgICBdLCAnbWFqNycpXHJcbn0iXX0=
