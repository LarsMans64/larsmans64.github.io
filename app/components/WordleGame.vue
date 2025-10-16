<script setup lang="ts">
import {verifyWord} from "~/utils/wordle"

const props = defineProps<{
  word: string
  attempts: number
}>();

interface TileData {
  letter: string,
  state: "empty" | "wrong" | "wrong_position" | "correct";
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
      state: "empty",
    }
  }
}

const first = field.value[0];

for (let j = 0; j < wordLength; j++) {
  if (!first) continue;
  first[j] = {
    letter: props.word[j] ?? " ",
    state: "correct",
  }
}

const typedWord = ref("");
const typingRow = ref(1);

function keyPressed(key: string) {
  if (key === "Enter") {
    if (typedWord.value.length == wordLength) {

      console.log(verifyWord(typedWord.value, props.word));

      typingRow.value++;
      typedWord.value = "";
    }
  }
  else if (key === "Backspace") {
    typedWord.value = typedWord.value.slice(0, typedWord.value.length - 1);
  }
  else if (typedWord.value.length < wordLength) {
    typedWord.value = typedWord.value.concat(key);
  }

  const word = field.value[typingRow.value];

  for (let i = 0; i < wordLength; i++) {
    const letter = word?.[i];
    if (letter) {
      letter.letter = typedWord.value[i] ?? " ";
    }
  }

  // useToast().add({title: typedWord.value});
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-self-center">
    <div v-for="row in field" class="flex gap-2">
      <WordleTile v-for="tile in row" :letter="tile.letter" :state="tile.state"/>
    </div>
  </div>

  <div class="flex justify-center mt-10">
    <WordleKeyboard @key-pressed="keyPressed" :key-hints="{'H': 'correct', 'G': 'wrong', 'L': 'wrong_position'}"/>
  </div>
</template>

<style scoped>

</style>