const context = new AudioContext

let notes = []

module.exports = {
    play: key => {
        let oscillator = context.createOscillator()

        let frequency = 440
        let dif = key - 57
        if(dif > 0){
            for(let i = 0; i < dif; i++){
                frequency = frequency * 1.05946
            }
        }
        else {
            for(let i = dif; i < 0; i++){
                frequency = frequency / 1.05946
            }
        }
        oscillator.frequency.value = frequency
        
        oscillator.connect(context.destination)
        oscillator.start(0)
        notes.push({
            key: key,
            oscillator: oscillator
        })
    },
    stop: key => {
        let note = notes.find(x => x.key === key)
        note.oscillator.stop(0)
        notes.splice(notes.indexOf(note), 1)
    }
}