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