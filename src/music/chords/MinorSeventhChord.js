const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.minorThird(),
            scale.perfectFifth(),
            scale.minorSeventh()
        ], 'm7')
}