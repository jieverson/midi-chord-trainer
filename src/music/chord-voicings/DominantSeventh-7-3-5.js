const DominantSeventhChord = require('../chords/DominantSeventhChord.js')
const Rootless = require('../voicings/Rootless.js')
const Inversion = require('../voicings/Inversion.js')

module.exports = function (tone){
    return Inversion(Rootless(DominantSeventhChord(tone)), 2)
}