<script setup lang="ts">
import "~/assets/wordle.css";
import {parseSettings, type WordleSettings} from "~/utils/wordle";

const query = useRoute().query["w"];

const loadedSettings = ref<WordleSettings>();

if (query && typeof query !== 'object') {
  loadedSettings.value = parseSettings(query);
}

const settings = ref<WordleSettings | undefined>(loadedSettings.value ? JSON.parse(JSON.stringify(loadedSettings.value)) : undefined);

const settingsOpen = useLocalStorage("settings-open", true);
</script>

<template>
  <UApp>
    <UHeader :toggle="false">
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
          <UCollapsible v-model:open="settingsOpen" class="group flex flex-col gap-5 px-3 pb-7">
            <UButton
                class="text-muted"
                variant="soft" color="neutral"
                trailing-icon="material-symbols:arrow-drop-down-rounded"
                :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-300 ease-out' }"
                block
            >
              Settings
            </UButton>

            <template #content>
              <div class="flex flex-col gap-5 p-3 pt-5 rounded-md border border-default">
                <WordleGeneratorModal>
                  <UButton variant="subtle" label="Create custom link" icon="material-symbols:add" size="lg"/>
                </WordleGeneratorModal>

                <USeparator/>

                <div class="flex flex-col gap-7 py-3">
                  <USwitch v-model="settings.onlyValid" :disabled="loadedSettings?.onlyValid" :color="loadedSettings?.onlyValid ? 'neutral' : undefined" label="Only valid words" description="Only allow valid English words" variant="card"/>
                  <USwitch v-model="settings.hardMode" :disabled="loadedSettings?.hardMode" :color="loadedSettings?.hardMode ? 'neutral' : undefined" label="Hard mode" description="You are forced to always use already discovered letters" variant="card"/>
                  <USwitch v-model="settings.noHints" :disabled="loadedSettings?.noHints" :color="loadedSettings?.noHints ? 'neutral' : undefined" label="No keyboard hints" description="Discovered letters won't show on the keyboard" variant="card"/>
                  <USwitch v-model="settings.hidePrevious" :disabled="loadedSettings?.hidePrevious" :color="loadedSettings?.hidePrevious ? 'neutral' : undefined" label="Hide previous guesses" description="You will only be able to see the most recent guess" variant="card"/>
                </div>
              </div>
            </template>
          </UCollapsible>
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