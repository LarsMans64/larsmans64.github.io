<script setup lang="ts">
defineProps<{
  letter: string
}>();
</script>

<template>
  <div class="wordle-tile wordle-guess">{{letter}}</div>
</template>

<style scoped>

</style>