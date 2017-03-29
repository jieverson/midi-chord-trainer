//const audio = require('./audio.js')
const Note = require('./music/Note.js')

let midi = {
    notes: [],
    onchange: () => { }
}

function onMIDIMessage( event ) {
    let data = event.data
    let on = data[0] === 0x90
    let key = data[1]
    let note = Note(key)
    
    if(on){
        midi.notes.push(note)
        //audio.play(key)
    }
    else{
        let i = midi.notes.findIndex(
            x => x._key === key)
        if (i > -1) {
            midi.notes.splice(i, 1)
        }
        //audio.stop(key)
    }

    midi.notes.sort((a, b) => a._key > b._key)

    midi.onchange(midi.notes)
}

function onMIDISuccess( midiAccess ) {
    midiAccess.inputs.forEach( entry => entry.onmidimessage = onMIDIMessage )
}

navigator.requestMIDIAccess().then(onMIDISuccess)

module.exports = midi