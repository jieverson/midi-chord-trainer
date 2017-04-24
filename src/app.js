const midi = require('./midi.js')
const Chord = require('./music/Chord.js')
const CircleOfFourths735 = require('./music/progressions/CircleOfFourths-7-3-5.js')
const Diatonic735 = require('./music/progressions/Diatonic-7-3-5.js')

let progression = Diatonic735(6)

let currentChord = progression.chords[0]
let voicing = document.getElementById('voicing') 
let card = document.getElementById('card')
let keys = document.getElementById('keys')

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

    keys.innerHTML = '';
    notes.forEach(note => {
        let key = document.createElement('span')
        key.innerHTML = nota.data
        key.classList.add(
            currentChord.some(x => 
                x.data == nota.data)
            ? 'right'
            : 'wrong')
        keys.appendChild(key)
    })
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