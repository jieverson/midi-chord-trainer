const Progression = require('../Progression.js')
const Diatonic = require('../Diatonic.js')
const MajorSeventh735 = require('../chord-voicings/MajorSeventh-7-3-5.js')
const MinorSeventh735 = require('../chord-voicings/MinorSeventh-7-3-5.js')
const DominantSeventh735 = require('../chord-voicings/DominantSeventh-7-3-5.js')
const HalfDiminished735 = require('../chord-voicings/HalfDiminished-7-3-5.js')

module.exports = function(tone){
    return Progression('Rootless 7-3-5',
        Diatonic(tone, MajorSeventh735, MinorSeventh735, DominantSeventh735, HalfDiminished735)
    )
}