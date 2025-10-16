<script setup lang="ts">
const keys = ["QWERTYUIOP", "ASDFGHJKL", "eZXCVBNMb"];

const props = defineProps<{
  keyHints: Record<string, string>
}>();

const emit = defineEmits<{
  keyPressed: [key: string]
}>();

function press(key: string) {
  if (key === "e") {
    key = "Enter";
  }
  if (key === "b") {
    key = "Backspace";
  }
  emit("keyPressed", key);
}

onMounted(() => {
  document.addEventListener("keydown", event => {
    if (event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) {
      return;
    }

    if ("QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".includes(event.key)) {
      press(event.key.toUpperCase());
    }
    else if (event.key === "Enter" || event.key === "Backspace") {
      press(event.key);
    }
  })
})
</script>

<template>
  <div class="grid gap-1">
    <div v-for="row in keys" class="flex justify-center gap-1">
      <UButton
          v-for="key in row"
          class="wordle-tile w-[1.5em] sm:w-[2em] h-[2.5em] text-lg sm:text-2xl text-highlighted flex justify-center items-center border-2"
          :class="{
            'grow': 'eb'.includes(key),
            'bg-slate-200 border-slate-300 dark:bg-slate-600 dark:border-slate-500': !keyHints?.[key],
            'correct': keyHints?.[key] === 'correct',
            'wrong-position': keyHints?.[key] === 'wrong_position',
            'bg-neutral-500 border-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 text-inverted dark:text-muted': keyHints?.[key] === 'wrong',
          }"
          @click="press(key)"
      >
        <template v-if="key.toUpperCase() == key">
          {{ key }}
        </template>
        <Icon v-if="key == 'b'" name="material-symbols:backspace-outline-rounded" size="1.3em"/>
        <Icon v-if="key == 'e'" name="material-symbols:check-rounded" size="1.3em"/>
      </UButton>
    </div>
  </div>
</template>

<style scoped>

</style>