<script setup lang="ts">
import "~/assets/wordle.css";
import type {WordleSettings} from "~/utils/wordle";

const query = useRoute().query["w"];

const loadedSettings = ref<WordleSettings>();

if (query && typeof query !== 'object') {
  const regex = /^(\d+)([A-Z]+)([01])([01])$/;
  const str = atob(query);

  const result = regex.exec(str);

  if (result && result[1] && result[2] && result[3] && result[4]) {
    loadedSettings.value = {
      word: result[2],
      attempts: Number.parseInt(result[1]),
      hardMode: result[3] === '1',
      noHints: result[4] === '1',
    }
  }
}

const settings = ref<WordleSettings | undefined>(JSON.parse(JSON.stringify(loadedSettings.value)));
</script>

<template>
  <UApp>
    <UHeader title="Custom Wordle" to="/wordle" mode="slideover">

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
      <UPage>
        <div class="overflow-hidden">
          <WordleGame v-if="settings" :settings="settings"/>
        </div>

        <template #left>
          <div class="flex flex-col items-start gap-8 px-3 pb-6">
            <WordleGeneratorModal>
              <UButton label="Create link" icon="material-symbols:add" size="lg"/>
            </WordleGeneratorModal>
            <template v-if="settings">
              <USwitch v-model="settings.hardMode" :disabled="loadedSettings?.hardMode" label="Hard mode" description="You are forced to always use already discovered letters"/>
              <USwitch v-model="settings.noHints" :disabled="loadedSettings?.noHints" label="No keyboard hints" description="Discovered letters won't show on the keyboard"/>
            </template>
          </div>
        </template>

        <template #right><div></div></template>
      </UPage>
    </UMain>
  </UApp>
</template>

<style scoped>

</style>