const Note = require('./Note.js')

module.exports = function (tone){
    return {
        root: () => Note(tone),
        majorThird: () => Note(tone + 4),
        minorThird: () => Note(tone + 3),
        perfectFifth: () => Note(tone + 7),
        majorSeventh: () => Note(tone - 1),
        minorSeventh: () => Note(tone - 2)
    }
}