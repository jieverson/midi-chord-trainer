const Scale = require('../Scale.js')
const Chord = require('../Chord.js')

module.exports = function (tone){
    let scale = Scale(tone)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth(),
            scale.majorSeventh()
        ], '<small>maj7</small>')
}