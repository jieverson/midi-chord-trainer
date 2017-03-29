const HalfDiminishedChord = require('../chords/HalfDiminishedChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(HalfDiminishedChord(tone)), 2)
}