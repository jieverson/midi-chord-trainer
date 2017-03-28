const MajorSeventhChord = require('../chords/MajorSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(MajorSeventhChord(tone)), 2)
}