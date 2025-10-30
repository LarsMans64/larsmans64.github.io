<script setup lang="ts">
import {verifyWord, WordleLetterState} from "~/utils/wordle"

const props = defineProps<{
  settings: WordleSettings
}>();

interface TileData {
  letter?: string,
  state: WordleLetterState;
}

const wordLength = props.settings.word.length;

const field = ref<TileData[][]>([]);

for (let i = 0; i < props.settings.attempts; i++) {
  field.value[i] = [];
  for (let j = 0; j < wordLength; j++) {
    const word = field.value[i];
    if (!word) continue;
    word[j] = {
      state: WordleLetterState.Empty,
    }
  }
}

let typedWord = "";
const typingRow = ref(0);

function keyPressed(key: string) {
  if (typedWord.length < wordLength && typingRow.value < props.settings.attempts) {
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
    letter.letter = typedWord[index] ?? undefined;
  })
}

const keyHints = ref<Map<string, WordleLetterState>>(new Map());
const correctLetters = ref<Map<number, string>>(new Map());

const toast = useToast();

async function enterPressed() {
  if (typedWord.length != wordLength) {
    toast.add({
      title: "Really?",
      duration: 1000,
      progress: false
    });
    doShake();
    return;
  }

  if (props.settings.hardMode && !containsAllHints(typedWord)) {
    toast.add({
      title: "You need to re-use all discovered letters in hard mode!",
      icon: "material-symbols:info-outline",
    });
    doShake();
    return;
  }

  if (typedWord !== props.settings.word && props.settings.onlyValid) {
    try {
      // if 200, the word is valid
      await $fetch<any>("https://api.dictionaryapi.dev/api/v2/entries/en/" + typedWord.toLowerCase());
    } catch (e) {
      toast.add({
        title: `${typedWord} is an invalid word!`,
        color: "warning",
        icon: "material-symbols:warning-rounded"
      });
      doShake();
      return;
    }
  }

  const verified = verifyWord(typedWord, props.settings.word);

  verified.forEach((value, index) => {
    const letter = field.value[typingRow.value]?.[index]
    if (!letter || !letter.letter) return;
    letter.state = value;
    addKeyHint(letter.letter, index, value);
  })

  typingRow.value++;
  typedWord = "";
}

function addKeyHint(letter: string, index: number, state: WordleLetterState) {
  const saved = keyHints.value.get(letter);
  if (!saved || saved < state) {
    keyHints.value.set(letter, state);
  }
  if (state === WordleLetterState.Correct) {
    correctLetters.value.set(index, letter);
  }
}

function containsAllHints(word: string) {
  for (const [index, letter] of correctLetters.value.entries()) {
    if (word[index] !== letter) {
      return false;
    }
  }

  for (const [letter, state] of keyHints.value.entries()) {
    if (state === WordleLetterState.WrongPosition && !word.includes(letter)) {
      return false;
    }
  }

  return true;
}

const shake = refAutoReset(false, 800);
function doShake() {
  shake.value = true;
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-2 justify-self-center overflow-auto p-3">
      <div v-for="(row, i) in field" class="flex gap-2" :class="{'shake': shake && i == typingRow}">
        <WordleTile
            v-for="(tile, j) in row"
            :index="j"
            :letter="tile.letter"
            :state="tile.state"
            :hide="settings.hidePrevious && i + 1 < typingRow"
        />
      </div>
    </div>

    <div class="flex justify-center mt-10">
      <WordleKeyboard
          @key-pressed="keyPressed"
          @enter-pressed="enterPressed"
          @backspace-pressed="backspacePressed"
          :key-hints="settings.noHints ? undefined : keyHints"/>
    </div>
  </div>
</template>

<style scoped>
.shake {
  animation: shake 500ms linear;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>