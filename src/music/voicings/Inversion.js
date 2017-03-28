module.exports = function (chord, inversion){
    inversion = inversion ? inversion : 1

    for(var i = 0; i < inversion; i++){
        chord.notes.push(chord.notes.shift())
    }
    return chord
}