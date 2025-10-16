<script setup lang="ts">
import "~/assets/wordle.css";

const query = useRoute().query["w"];

const word = ref<string>();
const attempts = ref<number>();

if (query && typeof query !== 'object') {
  const regex = /^(\d+)([A-Z]+)$/;
  const str = atob(query);

  const result = regex.exec(str);

  if (result && result[1] && result[2]) {
    attempts.value = Number.parseInt(result[1]);
    word.value = result[2];
  }
}
</script>

<template>
  <UApp>
    <UHeader title="Custom Wordle" to="/wordle" mode="slideover">
      <WordleGeneratorModal>
        <UButton label="Create link" icon="material-symbols:add" size="lg"/>
      </WordleGeneratorModal>

      <template #body>
        <WordleGeneratorModal>
          <UButton label="Create link" icon="material-symbols:add" size="lg"/>
        </WordleGeneratorModal>
      </template>

      <template #right>
        <UColorModeButton/>
      </template>
    </UHeader>

    <UMain class="p-2 py-6">
      <WordleGame v-if="word && attempts" :word="word" :attempts="attempts"/>
    </UMain>
  </UApp>
</template>

<style scoped>

</style>