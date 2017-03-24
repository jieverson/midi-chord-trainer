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

console.log('call "next()" for change chord using circle of fourths')