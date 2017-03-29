const Progression = require('../Progression.js')
const CircleOfFourths = require('../CircleOfFourths.js')
const MajorSeventh735 = require('../chord-voicings/MajorSeventh-7-3-5.js')
const DominantSeventh735 = require('../chord-voicings/DominantSeventh-7-3-5.js')
const MinorSeventh735 = require('../chord-voicings/MinorSeventh-7-3-5.js')

module.exports = function(){
    return Progression('Rootless 7-3-5',
        CircleOfFourths(MajorSeventh735)
        .concat(CircleOfFourths(DominantSeventh735))
        .concat(CircleOfFourths(MinorSeventh735))
    )
}