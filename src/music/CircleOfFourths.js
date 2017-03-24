module.exports = function (chord_type){
    chord_type = chord_type ? chord_type : MajorChord

    return Array(12).fill(0)
        .reduce((p, x, i) => {
            p.push(chord_type(i * 5))
            return p
        }, [])
}