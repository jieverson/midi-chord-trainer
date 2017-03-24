module.exports = function (notes, name){
    let chord = {
        notes: notes,
        name: () => 
            notes[0].str() + name,
        str: () =>
            notes.map(x => x.str()),
        invert: inv => {
            for(var i = 0; i < inv; i++){
                notes.push(notes.shift())
            }
            return chord
        }
    }
    return chord
}