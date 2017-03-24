const notes = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ]

function Note(key){
    let data = (60 + key) % 12
    
    return {
        data: data,
        str: () =>
            notes[data]
    }
}

function Scale(tone){
    return {
        root: () => Note(tone),
        majorThird: () => Note(tone + 4),
        minorThird: () => Note(tone + 3),
        perfectFifth: () => Note(tone + 7),
        majorSeventh: () => Note(tone - 1),
        minorSeventh: () => Note(tone - 2)
    }
}

function Chord(notes, name){
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

function MajorChord(chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth()
        ], '')
}

function MinorChord(chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.minorThird(),
            scale.perfectFifth()
        ], 'm')
}

function MajorSeventhChord(chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth(),
            scale.majorSeventh()
        ], 'maj7')
}

function MinorSeventhChord(chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.minorThird(),
            scale.perfectFifth(),
            scale.minorSeventh()
        ], 'm7')
}

function DominantSeventhChord(chord){
    let scale = Scale(chord)

    return Chord([
            scale.root(),
            scale.majorThird(),
            scale.perfectFifth(),
            scale.minorSeventh()
        ], '7')
}

function CircleOfFourths(chord_type){
    chord_type = chord_type ? chord_type : MajorChord

    return Array(12).fill(0)
        .reduce((p, x, i) => {
            p.push(chord_type(i * 5))
            return p
        }, [])
}

// C Major
C = MajorChord(0).str()
// D Minor
Dm = MinorChord(2).str()
// Cmaj7
Cmaj7 = MajorSeventhChord(0).str()
// Dm7
Dm7 = MinorSeventhChord(2).str()
// C7
C7 = DominantSeventhChord(0).str()
// Cmaj7 7-1-3-5 Inversion
C7135 = MajorSeventhChord(0).invert(3).str()