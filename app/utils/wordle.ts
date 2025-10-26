export enum WordleLetterState {
    Empty = 0,
    Wrong = 1,
    WrongPosition = 2,
    Correct = 3,
}

export interface WordleSettings {
    word: string,
    attempts: number,
    onlyValid?: boolean,
    hardMode?: boolean,
    noHints?: boolean,
    hidePrevious?: boolean,
}

export function parseSettings(str: string): WordleSettings | undefined {
    const regex = /^(\d+)([A-Z]+)([01])?([01])?([01])?([01])?/;

    let result;

    try {
        result = regex.exec(atob(str));
    } catch (e) {
        console.error(e);
        return undefined;
    }

    if (!result || !result[1] || !result[2]) {
        return undefined;
    }

    const settings: WordleSettings = {
        word: result[2],
        attempts: Number.parseInt(result[1]),
    }

    if (result[3]) settings.onlyValid    = result[3] === '1';
    if (result[4]) settings.hardMode     = result[4] === '1';
    if (result[5]) settings.noHints      = result[5] === '1';
    if (result[6]) settings.hidePrevious = result[6] === '1';

    return settings;
}

export function serializeSettings(settings: WordleSettings) {
    return btoa(
        settings.attempts.toString()
        + settings.word
        + (settings.onlyValid ? "1" : "0")
        + (settings.hardMode ? "1" : "0")
        + (settings.noHints ? "1" : "0")
        + (settings.hidePrevious ? "1" : "0")
    );
}

export function verifyWord(inputWord: string, targetWord: string): WordleLetterState[] {
    const result: WordleLetterState[] = Array(inputWord.length).fill(WordleLetterState.Wrong);

    const inputWordArr = inputWord.split("");
    const targetWordArr = targetWord.split("");

    // check correct
    for (let i = 0; i < inputWordArr.length; i++) {
        if (inputWordArr[i] == targetWordArr[i]) {
            result[i] = WordleLetterState.Correct;
            inputWordArr[i] = "_";
            targetWordArr[i] = "_";
        }
    }

    // check wrong position
    for (let i = 0; i < inputWordArr.length; i++) {
        const letter = inputWordArr[i];
        if (!letter || letter == "_") continue;

        if (targetWordArr.includes(letter)) {
            console.log(letter, i)
            result[i] = WordleLetterState.WrongPosition;
            targetWordArr[targetWordArr.findIndex(l => l == letter)] = "_";
        }
    }

    return result;
}
