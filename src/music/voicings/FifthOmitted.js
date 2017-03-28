const Scale = require('../Scale.js')

module.exports = function (chord){
    chord.notes = chord.notes.filter(x => 
        x.data !== Scale(chord.root.data).perfectFifth().data)
    return chord
}