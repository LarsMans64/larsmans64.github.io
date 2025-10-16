<script setup lang="ts">
import {verifyWord, WordleLetterState} from "~/utils/wordle"

const props = defineProps<{
  word: string
  attempts: number
}>();

interface TileData {
  letter: string,
  state: WordleLetterState;
}

const wordLength = props.word.length;

const field = ref<TileData[][]>([]);

for (let i = 0; i < props.attempts; i++) {
  field.value[i] = [];
  for (let j = 0; j < wordLength; j++) {
    const word = field.value[i];
    if (!word) continue;
    word[j] = {
      letter: " ",
      state: WordleLetterState.Empty,
    }
  }
}

let typedWord = "";
const typingRow = ref(0);

function keyPressed(key: string) {
  if (typedWord.length < wordLength) {
    typedWord = typedWord.concat(key);
    updateField();
  }
}

function backspacePressed() {
  typedWord = typedWord.slice(0, typedWord.length - 1);
  updateField();
}

function updateField() {
  field.value[typingRow.value]?.forEach((letter, index) => {
    letter.letter = typedWord[index] ?? " ";
  })
}

function enterPressed() {
  if (typedWord.length != wordLength) {
    useToast().add({title: "bruh", duration: 1000});
    return;
  }

  const verified = verifyWord(typedWord, props.word);

  verified.forEach((value, index) => {
    const letter = field.value[typingRow.value]?.[index]
    if (!letter) return;
    letter.state = value;
  })

  typingRow.value++;
  typedWord = "";
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-self-center">
    <div v-for="row in field" class="flex gap-2">
      <WordleTile v-for="tile in row" :letter="tile.letter" :state="tile.state"/>
    </div>
  </div>

  <div class="flex justify-center mt-10">
    <WordleKeyboard
        @key-pressed="keyPressed"
        @enter-pressed="enterPressed"
        @backspace-pressed="backspacePressed"
        :key-hints="{'H': WordleLetterState.Correct, 'G': WordleLetterState.Wrong, 'L': WordleLetterState.WrongPosition}"/>
  </div>
</template>

<style scoped>

</style>