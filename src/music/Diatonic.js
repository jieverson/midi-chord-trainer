const Scale = require('./Scale.js')

module.exports = function(tone, major, minor, dominant, halfDiminished){
    let scale = Scale(tone)
    let chords = [
        major(tone),
        minor(tone + 2),
        minor(tone + 4),
        major(tone + 5),
        dominant(tone + 7),
        minor(tone + 9),
        halfDiminished(tone - 1)
    ]
    return chords.concat([chords[0]]).concat(chords.reverse())
}