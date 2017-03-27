const notes = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ]

module.exports = function (key){
    let data = (60 + key) % 12
    
    return {
        data: data,
        _key: key,
        str: () =>
            notes[data]
    }
}