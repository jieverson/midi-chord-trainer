module.exports = function (notes, name){
    let chord = {
        notes: notes,
        root: notes[0]
    }
    
    chord.name = () => 
        chord.root.str() + name

    chord.str = () =>
        chord.notes.map(x => x.str())

    return chord
}