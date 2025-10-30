<script setup lang="ts">
defineProps<{
  letter?: string,
  state: WordleLetterState,
}>();
</script>

<template>
  <div class="wordle-tile wordle-guess"
       :class="{
         'wordle-wrong': state == WordleLetterState.Wrong,
         'wordle-wrong-position': state == WordleLetterState.WrongPosition,
         'wordle-correct': state == WordleLetterState.Correct,
       }">{{letter ?? ' '}}</div>
</template>

<style scoped>

</style>