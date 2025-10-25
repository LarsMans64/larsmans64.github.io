<script setup lang="ts">
defineProps<{
  state: WordleLetterState,
  letter?: string,
  hide?: boolean,
}>();
</script>

<template>
<!--  <Transition>-->
  <WordleTextTile v-if="(hide || state == WordleLetterState.Empty) && letter" :letter="hide ? '?' : letter"/>
  <WordleEmptyTile v-else-if="state == WordleLetterState.Empty && !letter"/>
  <div v-else
       class="wordle-tile"
       :class="{
      'border-muted': state == WordleLetterState.Empty,
      'wordle-wrong': state == WordleLetterState.Wrong,
      'wordle-wrong-position': state == WordleLetterState.WrongPosition,
      'wordle-correct': state == WordleLetterState.Correct,
    }"
  >
    {{letter ?? " "}}
  </div>
<!--  </Transition>-->
</template>

<style scoped>
.v-enter-from {
  scale: 150%;
}

.v-enter-active {
  transition: scale 1000ms ease-out;
}
</style>