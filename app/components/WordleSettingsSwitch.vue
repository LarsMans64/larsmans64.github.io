<script setup lang="ts">
defineProps<{
  forced?: boolean,
  label: string,
  description: string,
}>();

const value = defineModel<boolean>();
</script>

<template>
  <UTooltip :disabled="!forced" text="You cannot disable an option that the original creator enabled" arrow :delay-duration="300">
    <label>
      <USwitch v-model="value" :disabled="forced" :color="forced ? 'neutral' : 'primary'" :label="label" :description="description"/>
    </label>
  </UTooltip>
</template>

<style scoped>

</style>