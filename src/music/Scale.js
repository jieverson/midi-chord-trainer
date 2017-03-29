const Note = require('./Note.js')

module.exports = function (tone){
    return {
        root: () => Note(tone),
        minorThird: () => Note(tone + 3),
        majorThird: () => Note(tone + 4),
        diminishedFifth: () => Note(tone + 6),
        perfectFifth: () => Note(tone + 7),
        majorSeventh: () => Note(tone - 1),
        minorSeventh: () => Note(tone - 2)
    }
}