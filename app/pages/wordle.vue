<script setup lang="ts">
import "~/assets/wordle.css";
import {parseSettings, type WordleSettings} from "~/utils/wordle";

const query = useRoute().query["w"];

const loadedSettings = ref<WordleSettings>();

if (query && typeof query !== 'object') {
  loadedSettings.value = parseSettings(query);
}

const settings = ref<WordleSettings | undefined>(loadedSettings.value ? JSON.parse(JSON.stringify(loadedSettings.value)) : undefined);
</script>

<template>
  <UApp>
    <UHeader to="/wordle">

      <template #title>
        <h1>Cust<span class="text-yellow-500 dark:text-yellow-300">o</span>m W<span class="text-green-600 dark:text-green-400">o</span>rdle</h1>
      </template>

      <template #right>
        <UColorModeButton/>
      </template>
    </UHeader>

    <UMain class="p-2 py-6">
      <UPage v-if="settings">
        <template #left>
          <div class="flex flex-col gap-10 px-5 py-5">
            <WordleGeneratorModal>
              <UButton class="w-fit" label="Create custom link" icon="material-symbols:add" size="lg"/>
            </WordleGeneratorModal>

            <USeparator/>

            <USwitch v-model="settings.onlyValid" :disabled="loadedSettings?.onlyValid" :color="loadedSettings?.onlyValid ? 'neutral' : undefined" label="Only valid words" description="Only allow valid English words" variant="card"/>
            <USwitch v-model="settings.hardMode" :disabled="loadedSettings?.hardMode" :color="loadedSettings?.hardMode ? 'neutral' : undefined" label="Hard mode" description="You are forced to always use already discovered letters" variant="card"/>
            <USwitch v-model="settings.noHints" :disabled="loadedSettings?.noHints" :color="loadedSettings?.noHints ? 'neutral' : undefined" label="No keyboard hints" description="Discovered letters won't show on the keyboard" variant="card"/>
            <USwitch v-model="settings.hidePrevious" :disabled="loadedSettings?.hidePrevious" :color="loadedSettings?.hidePrevious ? 'neutral' : undefined" label="Hide previous guesses" description="You will only be able to see the most recent guess" variant="card"/>
          </div>
        </template>

        <div class="overflow-hidden">
          <WordleGame :settings="settings"/>
        </div>

        <template #right><div></div></template>
      </UPage>

      <div v-else class="min-h-[75vh] flex flex-col gap-4 justify-center items-center text-center">
        <h1 class="text-4xl text-accented font-bold">Custom Wordle</h1>
        <h2 class="text-lg text-toned font-semibold text-balance">Create a custom Wordle and send a unique link to your friends!</h2>

        <WordleGeneratorModal class="my-4">
          <UButton label="Create custom link" icon="material-symbols:add" size="xl"/>
        </WordleGeneratorModal>

        <div class="text-muted">
          Created by LarsMans
        </div>
      </div>
    </UMain>
  </UApp>
</template>

<style scoped>

</style>