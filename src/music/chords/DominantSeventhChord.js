const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth(),
            scale.minorSeventh()
        ], '7')
}