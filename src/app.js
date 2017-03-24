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