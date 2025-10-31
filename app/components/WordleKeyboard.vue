<script setup lang="ts">
const keys = ["QWERTYUIOP", "ASDFGHJKL", "eZXCVBNMb"];

defineProps<{
  keyHints?: Map<string, WordleLetterState>
}>();

const emit = defineEmits<{
  keyPressed: [key: string]
  enterPressed: []
  backspacePressed: []
  clearPressed: []
}>();

function press(key: string) {
  if (key === "e" || key === "Enter") {
    emit("enterPressed");
  } else if (key === "b" || key === "Backspace") {
    emit("backspacePressed");
  } else if (key === "c") {
    emit("clearPressed");
  } else {
    emit("keyPressed", key);
  }
}
const activeElement = useActiveElement();
const hasFocus = computed(() => activeElement.value?.tagName === 'BODY');

onMounted(() => {
  document.addEventListener("keydown", event => {
    if (!hasFocus.value || event.shiftKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.ctrlKey) {
      if (event.key === "Backspace") {
        press("c");
      }
      return;
    }

    if ("QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".includes(event.key)) {
      press(event.key.toUpperCase());
      return;
    }

    if (event.key === "Enter" || event.key === "Backspace") {
      press(event.key);
      return;
    }
  })
})

</script>

<template>
  <div class="grid gap-1">
    <div v-for="row in keys" class="flex justify-center gap-1">
      <UButton
          v-for="key in row"
          class="w-[1.5em] sm:w-[2em] h-[2.5em] text-lg sm:text-2xl text-highlighted flex justify-center items-center border-2 hover:-translate-y-0.5 transition"
          :class="{
            'grow': 'eb'.includes(key),
            'bg-slate-200 border-slate-300 dark:bg-slate-600 dark:border-slate-500 hover:bg-slate-200 hover:dark:bg-slate-600': !keyHints?.get(key),
            'wordle-correct': keyHints?.get(key) === WordleLetterState.Correct,
            'wordle-wrong-position': keyHints?.get(key) === WordleLetterState.WrongPosition,
            'text-inverted dark:text-muted bg-neutral-500 border-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 hover:bg-neutral-500 hover:dark:bg-neutral-800': keyHints?.get(key) === WordleLetterState.Wrong,
          }"
          @click="press(key)"
      >
        <template v-if="key.toUpperCase() == key">
          {{ key }}
        </template>
        <Icon v-if="key == 'b'" name="material-symbols:backspace-rounded" size="1.1em"/>
        <Icon v-if="key == 'e'" name="material-symbols:keyboard-return-rounded" size="1.3em"/>
      </UButton>
    </div>
  </div>
</template>

<style scoped>

</style>