<script setup lang="ts">
import WordleAnswerTile from "~/components/WordleAnswerTile.vue";

const props = defineProps<{
  index: number,
  state: WordleLetterState,
  letter: string | undefined,
  hide?: boolean,
}>();

const plop = refAutoReset(false, 500);
watch(() => props.letter, (val, old) => {
  if (!old && val) {
    plop.value = true;
  }
})

const displayState = ref(WordleLetterState.Empty);

const swap = ref(false);
watch(() => props.state, () => {
  setTimeout(() => {
    swap.value = true;

    setTimeout(() => {
      displayState.value = props.state;
    }, 200);

  }, props.index * 150)
})
</script>

<template>
  <div :class="{plop, swap}">
    <WordleTextTile v-if="(hide || displayState == WordleLetterState.Empty) && letter" :letter="hide ? '?' : letter"/>
    <WordleEmptyTile v-else-if="displayState == WordleLetterState.Empty && !letter"/>
    <WordleAnswerTile v-else :letter="letter" :state="displayState"/>
  </div>
</template>

<style scoped>
.plop {
  animation: plop 150ms ease-out;
}

@keyframes plop {
  0% {
    scale: 110%;
  }

  100% {
    scale: unset;
  }
}

.swap {
  animation: swap 400ms ease-in-out;
}

@keyframes swap {
  50% {
    transform: scaleY(0%);
  }

  100% {
    transform: scaleY(100%);
  }
}
</style>