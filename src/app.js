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