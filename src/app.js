const midi = require('./midi.js')
const CircleOfFourths = require('./music/CircleOfFourths.js')
const Chord = require('./music/Chord.js')
const MajorSeventhChord = require('./music/chords/MajorSeventhChord.js')

let progression = CircleOfFourths(MajorSeventhChord)
let currentChord = progression[0]
let card = document.getElementById('card')

function render(){
    card.innerText = currentChord.name()
    clean()
}

function next(){
    progression.push(progression.shift())
    currentChord = progression[0]
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
        else{
            clean()
        }
    }
}

function clean(){
    card.classList.remove('right')
    card.classList.remove('wrong')
}

function right(){
    clean()
    card.classList.add('right')
}

function wrong(){
    clean()
    card.classList.add('wrong')
}