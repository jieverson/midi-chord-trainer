const notes = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ]

function getNote(key){
    return (60 + key) % 12
}

function getOct(key){
    return Math.floor(key / 12)
}

function getRoot(chord){
    return chord
}

function getMajorThird(chord){
    return getNote(chord + 4)
}

function getMinorThird(chord){
    return getNote(chord + 3)
}

function getPerfectFifth(chord){
    return getNote(chord + 7)
}

function getMajorSeventh(chord){
    return getNote(chord - 1)
}

function getMinorSeventh(chord){
    return getNote(chord - 2)
}

function majorChord(chord){
    return [
        getRoot(chord), getMajorThird(chord), getPerfectFifth(chord)
        ]
}

function minorChord(chord){
    return [
        getRoot(chord), getMinorThird(chord), getPerfectFifth(chord)
        ]
}

function majorSeventhChord(chord){
    return [
        getRoot(chord), getMajorThird(chord), getPerfectFifth(chord), getMajorSeventh(chord)
        ]
}

function dominantSeventhChord(chord){
    return [
        getRoot(chord), getMajorThird(chord), getPerfectFifth(chord), getMinorSeventh(chord)
        ]
}

function minorSeventhChord(chord){
    return [
        getRoot(chord), getMinorThird(chord), getPerfectFifth(chord), getMinorSeventh(chord)
        ]
}

function inversion(chord, inv){
    for(var i = 0; i < inv; i++){
        chord.push(chord.shift())
    }
    return chord
}

function getNoteStr(note){
    return notes[note]
}

function onMIDIMessage( event ) {
    let data = event.data
    let on = data[0] === 0x90
    let key = data[1]
    let note = getNote(key)
    let oct = getOct(key)
    let noteStr = getNoteStr(note)
    
    if(on){
        console.log('note: ' + noteStr + oct)    
    }
}

function onMIDISuccess( midiAccess ) {
    midiAccess.inputs.forEach( entry => entry.onmidimessage = onMIDIMessage )
}

navigator.requestMIDIAccess().then(onMIDISuccess)