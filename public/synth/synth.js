function playNote(note) {
    let hertz = 261.625565 * 2 ** (note / 12)
    console.log("note: " + note + " hertz: " + hertz);
    // const synth = new Tone.Synth().toDestination();
    // synth.triggerAttackRelease(hertz, "8n");

    const ampEnv = new Tone.AmplitudeEnvelope({
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.4
    }).toDestination();

    const osc = new Tone.Oscillator(hertz, "sine");
    osc.partials = [1, .9, .1, .9, .1, .9, .1];
    osc.connect(ampEnv).start();
    // oscillator.volume.value = -10;
    // oscillator.start();
    // oscillator.stop("+0.5");
    ampEnv.triggerAttackRelease("8n");
}