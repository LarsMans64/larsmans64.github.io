function playNote(note) {
    let hertz = 260 * 2 ** (note / 12)
    console.log("note " + note + " " + hertz);
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(hertz, "8n");
}

/*

0   12  6
2   4   

*/