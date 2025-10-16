export enum WordleLetterState {
    Correct = "correct",
    WrongPosition = "wrong_position",
    Wrong = "wrong",
    Empty = "empty",
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

export const createWordleOpen = ref(false);
