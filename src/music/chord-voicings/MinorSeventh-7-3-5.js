const MinorSeventhChord = require('../chords/MinorSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(MinorSeventhChord(tone)), 2)
}