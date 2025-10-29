<script setup lang="ts">
import "~/assets/wordle.css";
import {parseSettings, type WordleSettings} from "~/utils/wordle";
import WordleSettingsSwitch from "~/components/WordleSettingsSwitch.vue";

const toast = useToast();

const query = useRoute().query["w"];
const loadedSettings = ref<WordleSettings>();

if (query && !Array.isArray(query)) {
  const parsedSettings = parseSettings(query);
  if (parsedSettings) {
    loadedSettings.value = parsedSettings;
  } else {
    toast.add({
      title: "There was an error parsing the link :(",
      color: "error",
      icon: "material-symbols:error",
    })
  }
}

const settings = ref<WordleSettings | undefined>(loadedSettings.value ? JSON.parse(JSON.stringify(loadedSettings.value)) : undefined);

const settingsOpen = useLocalStorage("settings-open", true);
</script>

<template>
  <UApp>
    <UHeader to="/wordle" :toggle="false">
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
          <div class="flex flex-col gap-5 px-2 pb-10">
            <WordleGeneratorModal>
              <UButton
                  variant="subtle"
                  label="Create custom link"
                  icon="material-symbols:add"
                  size="lg"
                  class="group"
                  :ui="{ leadingIcon: 'group-hover:rotate-90 transition-transform ease-in-out duration-500' }"
              />
            </WordleGeneratorModal>

            <UCollapsible v-model:open="settingsOpen" class="group">
              <UButton
                  label="Game Options"
                  variant="soft"
                  color="neutral"
                  trailing-icon="material-symbols:expand-more"
                  :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-300 ease-out group-hover:scale-120' }"
                  block
              />

              <template #content>
                <div class="flex flex-col gap-7 p-3 pt-5">
                  <WordleSettingsSwitch
                      v-model="settings.onlyValid"
                      :forced="loadedSettings?.onlyValid"
                      label="Only valid words"
                      description="Only allow valid English words"/>

                  <WordleSettingsSwitch
                      v-model="settings.hardMode"
                      :forced="loadedSettings?.hardMode"
                      label="Hard mode"
                      description="You are forced to always use already discovered letters"/>

                  <WordleSettingsSwitch
                      v-model="settings.noHints"
                      :forced="loadedSettings?.noHints"
                      label="No keyboard hints"
                      description="Discovered letters won't show on the keyboard"/>

                  <WordleSettingsSwitch
                      v-model="settings.hidePrevious"
                      :forced="loadedSettings?.hidePrevious"
                      label="Hide previous guesses"
                      description="You will only be able to see the most recent guess"/>

                </div>
              </template>
            </UCollapsible>
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