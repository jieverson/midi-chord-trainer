module.exports = function (chord){
    chord.notes = chord.notes.filter(x => x.data !== chord.root.data)
    return chord
}