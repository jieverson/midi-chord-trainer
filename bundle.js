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

midi.onchange = notes => {

}
},{"./midi.js":2,"./music/CircleOfFourths.js":4,"./music/chords/MajorSeventhChord.js":7}],2:[function(require,module,exports){
const Chord = require('./music/Chord.js')

let midi = {}

let notes = []

function onMIDIMessage( event ) {
    let data = event.data
    let on = data[0] === 0x90
    let key = data[1]
    let note = Note(key)
    //let oct = getOct(key)
    //let noteStr = getNoteStr(note)
    
    if(on){
        notes.push(note)
    }
    else{
        let index = notes.findIndex(x => x._key == key)
        if (index > -1) {
            notes.splice(index, 1);
        }
    }

    let chord = Chord(notes)
    console.log('Notes: ' + chord.str())

}

function onMIDISuccess( midiAccess ) {
    midiAccess.inputs.forEach( entry => entry.onmidimessage = onMIDIMessage )
}

navigator.requestMIDIAccess().then(onMIDISuccess)
},{"./music/Chord.js":3}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL21pZGkuanMiLCJzcmMvbXVzaWMvQ2hvcmQuanMiLCJzcmMvbXVzaWMvQ2lyY2xlT2ZGb3VydGhzLmpzIiwic3JjL211c2ljL05vdGUuanMiLCJzcmMvbXVzaWMvU2NhbGUuanMiLCJzcmMvbXVzaWMvY2hvcmRzL01ham9yU2V2ZW50aENob3JkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgbWlkaSA9IHJlcXVpcmUoJy4vbWlkaS5qcycpXHJcbmNvbnN0IENpcmNsZU9mRm91cnRocyA9IHJlcXVpcmUoJy4vbXVzaWMvQ2lyY2xlT2ZGb3VydGhzLmpzJylcclxuY29uc3QgTWFqb3JTZXZlbnRoQ2hvcmQgPSByZXF1aXJlKCcuL211c2ljL2Nob3Jkcy9NYWpvclNldmVudGhDaG9yZC5qcycpXHJcblxyXG5sZXQgcHJvZ3Jlc3Npb24gPSBDaXJjbGVPZkZvdXJ0aHMoTWFqb3JTZXZlbnRoQ2hvcmQpXHJcblxyXG5mdW5jdGlvbiByZW5kZXIoKXtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkJylcclxuICAgICAgICAuaW5uZXJUZXh0ID0gcHJvZ3Jlc3Npb25bMF0ubmFtZSgpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5leHQoKXtcclxuICAgIHByb2dyZXNzaW9uLnB1c2gocHJvZ3Jlc3Npb24uc2hpZnQoKSlcclxuICAgIHJlbmRlcigpXHJcbn1cclxuXHJcbnJlbmRlcigpXHJcblxyXG5taWRpLm9uY2hhbmdlID0gbm90ZXMgPT4ge1xyXG5cclxufSIsImNvbnN0IENob3JkID0gcmVxdWlyZSgnLi9tdXNpYy9DaG9yZC5qcycpXHJcblxyXG5sZXQgbWlkaSA9IHt9XHJcblxyXG5sZXQgbm90ZXMgPSBbXVxyXG5cclxuZnVuY3Rpb24gb25NSURJTWVzc2FnZSggZXZlbnQgKSB7XHJcbiAgICBsZXQgZGF0YSA9IGV2ZW50LmRhdGFcclxuICAgIGxldCBvbiA9IGRhdGFbMF0gPT09IDB4OTBcclxuICAgIGxldCBrZXkgPSBkYXRhWzFdXHJcbiAgICBsZXQgbm90ZSA9IE5vdGUoa2V5KVxyXG4gICAgLy9sZXQgb2N0ID0gZ2V0T2N0KGtleSlcclxuICAgIC8vbGV0IG5vdGVTdHIgPSBnZXROb3RlU3RyKG5vdGUpXHJcbiAgICBcclxuICAgIGlmKG9uKXtcclxuICAgICAgICBub3Rlcy5wdXNoKG5vdGUpXHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIGxldCBpbmRleCA9IG5vdGVzLmZpbmRJbmRleCh4ID0+IHguX2tleSA9PSBrZXkpXHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgbm90ZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNob3JkID0gQ2hvcmQobm90ZXMpXHJcbiAgICBjb25zb2xlLmxvZygnTm90ZXM6ICcgKyBjaG9yZC5zdHIoKSlcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uTUlESVN1Y2Nlc3MoIG1pZGlBY2Nlc3MgKSB7XHJcbiAgICBtaWRpQWNjZXNzLmlucHV0cy5mb3JFYWNoKCBlbnRyeSA9PiBlbnRyeS5vbm1pZGltZXNzYWdlID0gb25NSURJTWVzc2FnZSApXHJcbn1cclxuXHJcbm5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2VzcygpLnRoZW4ob25NSURJU3VjY2VzcykiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChub3RlcywgbmFtZSl7XHJcbiAgICBsZXQgY2hvcmQgPSB7XHJcbiAgICAgICAgbm90ZXM6IG5vdGVzLFxyXG4gICAgICAgIG5hbWU6ICgpID0+IFxyXG4gICAgICAgICAgICBub3Rlc1swXS5zdHIoKSArIG5hbWUsXHJcbiAgICAgICAgc3RyOiAoKSA9PlxyXG4gICAgICAgICAgICBub3Rlcy5tYXAoeCA9PiB4LnN0cigpKSxcclxuICAgICAgICBpbnZlcnQ6IGludiA9PiB7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpbnY7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBub3Rlcy5wdXNoKG5vdGVzLnNoaWZ0KCkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNob3JkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNob3JkXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjaG9yZF90eXBlKXtcclxuICAgIGNob3JkX3R5cGUgPSBjaG9yZF90eXBlID8gY2hvcmRfdHlwZSA6IE1ham9yQ2hvcmRcclxuXHJcbiAgICByZXR1cm4gQXJyYXkoMTIpLmZpbGwoMClcclxuICAgICAgICAucmVkdWNlKChwLCB4LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHAucHVzaChjaG9yZF90eXBlKGkgKiA1KSlcclxuICAgICAgICAgICAgcmV0dXJuIHBcclxuICAgICAgICB9LCBbXSlcclxufSIsImNvbnN0IG5vdGVzID0gWyAnQycsICdEYicsICdEJywgJ0ViJywgJ0UnLCAnRicsICdGIycsICdHJywgJ0FiJywgJ0EnLCAnQmInLCAnQicgXVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KXtcclxuICAgIGxldCBkYXRhID0gKDYwICsga2V5KSAlIDEyXHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBfa2V5OiBrZXksXHJcbiAgICAgICAgc3RyOiAoKSA9PlxyXG4gICAgICAgICAgICBub3Rlc1tkYXRhXVxyXG4gICAgfVxyXG59IiwiY29uc3QgTm90ZSA9IHJlcXVpcmUoJy4vTm90ZS5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b25lKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcm9vdDogKCkgPT4gTm90ZSh0b25lKSxcclxuICAgICAgICBtYWpvclRoaXJkOiAoKSA9PiBOb3RlKHRvbmUgKyA0KSxcclxuICAgICAgICBtaW5vclRoaXJkOiAoKSA9PiBOb3RlKHRvbmUgKyAzKSxcclxuICAgICAgICBwZXJmZWN0RmlmdGg6ICgpID0+IE5vdGUodG9uZSArIDcpLFxyXG4gICAgICAgIG1ham9yU2V2ZW50aDogKCkgPT4gTm90ZSh0b25lIC0gMSksXHJcbiAgICAgICAgbWlub3JTZXZlbnRoOiAoKSA9PiBOb3RlKHRvbmUgLSAyKVxyXG4gICAgfVxyXG59IiwiY29uc3QgU2NhbGUgPSByZXF1aXJlKCcuLi9TY2FsZS5qcycpXHJcbmNvbnN0IENob3JkID0gcmVxdWlyZSgnLi4vQ2hvcmQuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY2hvcmQpe1xyXG4gICAgbGV0IHNjYWxlID0gU2NhbGUoY2hvcmQpXHJcblxyXG4gICAgcmV0dXJuIENob3JkKFtcclxuICAgICAgICAgICAgc2NhbGUucm9vdCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5tYWpvclRoaXJkKCksXHJcbiAgICAgICAgICAgIHNjYWxlLnBlcmZlY3RGaWZ0aCgpLFxyXG4gICAgICAgICAgICBzY2FsZS5tYWpvclNldmVudGgoKVxyXG4gICAgICAgIF0sICdtYWo3JylcclxufSJdfQ==
