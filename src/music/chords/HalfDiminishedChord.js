const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (tone){
    let scale = Scale(tone)

    return Chord([
            scale.root(),
            scale.minorThird(),
            scale.diminishedFifth(),
            scale.minorSeventh()
        ], '<small>&#8709;</small>')
}