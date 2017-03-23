function onMIDIMessage( event ) {
    let data = event.data
    let on = data[0] === 0x90
    let key = data[1]
    let note = Note(key)
    //let oct = getOct(key)
    //let noteStr = getNoteStr(note)
    
    if(on){
        console.log('note: ' + note.str())    
    }
}

function onMIDISuccess( midiAccess ) {
    midiAccess.inputs.forEach( entry => entry.onmidimessage = onMIDIMessage )
}

navigator.requestMIDIAccess().then(onMIDISuccess)