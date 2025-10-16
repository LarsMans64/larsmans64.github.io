export enum WordleLetterState {
    Correct = "correct",
    WrongPosition = "wrong_position",
    Wrong = "wrong",
}

export function verifyWord(inputWord: string, targetWord: string): WordleLetterState[] {
    const result: WordleLetterState[] = Array(inputWord.length).fill(WordleLetterState.Wrong);

    const inputWordArr = targetWord.split("");
    const targetWordArr = inputWord.split("");

    // check correct
    for (let i = 0; i < inputWordArr.length; i++) {
        if (inputWordArr[i] == targetWordArr[i]) {
            result[i] = WordleLetterState.Correct;
            inputWordArr[i] = "*";
            targetWordArr[i] = "_";
        }
    }

    console.log(targetWordArr)
    console.log(result)

    // check wrong position
    for (let i = 0; i < inputWordArr.length; i++) {
        const letter = inputWordArr[i];
        if (!letter) continue;

        if (targetWordArr.includes(letter)) {
            result[i] = WordleLetterState.WrongPosition;
            targetWordArr[targetWordArr.findIndex(l => l == letter)] = "_";
        }
    }

    return result;
}