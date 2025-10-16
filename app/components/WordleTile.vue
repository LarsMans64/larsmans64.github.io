<script setup lang="ts">
defineProps<{
  letter?: string
  state: string
}>();
</script>

<template>
  <div
      class="wordle-tile w-[2.3em] h-[2.3em] flex items-center justify-center text-2xl sm:text-3xl text-black dark:text-white font-semibold border-2 rounded-sm"
      :class="{
        'border-muted': state == 'empty',
        'wrong': state == 'wrong',
        'wrong-position': state == 'wrong_position',
        'correct': state == 'correct',
      }"
  >
    {{letter}}
  </div>
</template>

<style scoped>

</style>