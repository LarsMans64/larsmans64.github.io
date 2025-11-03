<script setup lang="ts">
import {actuallyCorrectWords, type TileData, verifyWord, WordleLetterState} from "~/utils/wordle"
import type {Toast} from "#ui/composables/useToast";

const toasts = useToast();

const props = defineProps<{
  settings: WordleSettings
}>();

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

const isSolved = computed(() => field.value.some(row => row.every(tile => tile.state == WordleLetterState.Correct)));
const isDone = computed(() => isSolved.value || typingRow.value >= props.settings.attempts);
const resultsOpen = ref(false);

whenever(isDone, () => setTimeout(() => resultsOpen.value = true, 1500));

function keyPressed(key: string) {
  if (!isDone.value && typedWord.length < wordLength && typingRow.value < props.settings.attempts) {
    typedWord = typedWord.concat(key);
    updateField();
  }
}

function backspacePressed() {
  typedWord = typedWord.slice(0, typedWord.length - 1);
  updateField();
}

function clearPressed() {
  typedWord = "";
  updateField();
}

function updateField() {
  field.value[typingRow.value]?.forEach((letter, index) => {
    letter.letter = typedWord[index] ?? undefined;
  })
}

const keyHints = ref<Map<string, WordleLetterState>>(new Map());
const correctLetters = ref<Map<number, string>>(new Map());
const invalidWordCache: string[] = [];

async function enterPressed() {
  if (typedWord.length != wordLength) {
    invalidWord({
      title: "Really?",
      duration: 1000,
      progress: false,
    });
    return;
  }

  if (props.settings.hardMode && !containsAllHints(typedWord)) {
    invalidWord({
      title: "You need to re-use all discovered letters in hard mode!",
      icon: "material-symbols:info-outline",
    });
    return;
  }

  if (typedWord !== props.settings.word && !actuallyCorrectWords.includes(typedWord) && props.settings.onlyValid) {
    const toast: Partial<Toast> = {
      title: `${typedWord} is an invalid word!`,
      color: "warning",
      icon: "material-symbols:warning-rounded"
    };

    if (invalidWordCache.includes(typedWord)) {
      invalidWord(toast);
      return;
    }

    try {
      // if 200, the word is valid
      await $fetch<any>("https://api.dictionaryapi.dev/api/v2/entries/en/" + typedWord.toLowerCase());
    } catch (e) {
      invalidWordCache.push(typedWord);
      invalidWord(toast);
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

const shake = refAutoReset(false, 800);

function invalidWord(toast?: Partial<Toast>) {
  if (toast) {
    toasts.add(toast);
  }
  shake.value = true;
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
  // Check correct letters
  for (const [index, letter] of correctLetters.value.entries()) {
    if (word[index] !== letter) {
      return false;
    }
  }

  // Check almost correct letters
  for (const [letter, state] of keyHints.value.entries()) {
    if (state === WordleLetterState.WrongPosition && !word.includes(letter)) {
      return false;
    }
  }

  return true;
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-2 justify-self-center overflow-auto p-3 select-none">
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
          @clear-pressed="clearPressed"
          :key-hints="settings.noHints ? undefined : keyHints"/>
    </div>

    <div class="flex justify-center mt-10">
      <WordleResultsModal
          :field="field"
          :won="isSolved"
          :attempts="typingRow"
          :total-attempts="settings.attempts"
          v-model="resultsOpen"
      >
        <Transition name="fade">
          <div v-if="isDone">
            <UButton label="Open Results" size="xl"/>
          </div>
        </Transition>
      </WordleResultsModal>
    </div>
  </div>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

/*noinspection CssUnusedSymbol*/
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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