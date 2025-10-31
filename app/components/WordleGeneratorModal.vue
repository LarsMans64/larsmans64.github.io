<script setup lang="ts">
import {serializeSettings} from "~/utils/wordle";

const toast = useToast();
const wordInput = useTemplateRef("wordInput");

const isOpen = ref(false);

const settings = reactive<WordleSettings>({
  word: "",
  attempts: 6,
  onlyValid: true,
})

watch(settings, () => {
  const upper = settings.word.toUpperCase();
  if (upper != settings.word) {
    settings.word = upper;
  }
});

const useRandomWord = useLocalStorage("new-random", false);
const randomWord = computedAsync(async () => {
  if (!useRandomWord.value) {
    return undefined;
  }

  const randomLength = Math.floor(Math.random() * 3 + 4);
  const randomWords = await $fetch<string[]>("https://random-word-api.herokuapp.com/word?length=" + randomLength);
  return randomWords[0]?.toUpperCase();
}, undefined);

const result = computed(() => serializeSettings(settings, randomWord.value));

const linkPrefix = window?.location.origin + window?.location.pathname + "?w=";
const link = computed(() => linkPrefix + result.value);

const isValidWord = computed(() => (useRandomWord.value && randomWord.value || /^[A-Z]+$/.test(settings.word)) && settings.attempts > 0);

function copy() {
  navigator.clipboard.writeText(link.value);
  toast.add({
    title: "Copied to Clipboard!",
    icon: "material-symbols:check",
  })
}

function close() {
  isOpen.value = false;
}

function play() {
  reloadNuxtApp({path: link.value});
}

// Autofocus word input
whenever(isOpen, () => {
  setTimeout(() => {
    wordInput.value?.inputRef?.focus();
  }, 100);
})
</script>

<template>
  <UModal title="Generate a link" v-model:open="isOpen" :ui="{content: 'max-w-xl'}">
    <slot/>

    <template #description>
      Create a custom Wordle and share it with your friends
    </template>

    <template #body>
      <div class="flex flex-col gap-7">
        <UForm class="grid sm:grid-cols-2 gap-x-5 gap-y-8">
          <div>
            <UFormField label="Custom word" required>
              <UInput v-model.trim="settings.word" ref="wordInput" variant="subtle" placeholder="Xnopyt" :disabled="useRandomWord" class="w-full"/>
            </UFormField>

            <USwitch v-model="useRandomWord" label="Random word" class="mt-3"/>
          </div>

          <UFormField label="Max number of attempts" required>
            <UInputNumber v-model="settings.attempts" variant="subtle" class="w-full"/>
          </UFormField>

          <label><UCheckbox v-model="settings.onlyValid" label="Only valid words" description="Allow only valid English words"/></label>
          <label><UCheckbox v-model="settings.hardMode" label="Forced hard mode" description="You are forced to always use already discovered letters"/></label>
          <label><UCheckbox v-model="settings.noHints" label="No keyboard hints" description="Discovered letters won't show on the keyboard"/></label>
          <label><UCheckbox v-model="settings.hidePrevious" label="Hide previous guesses" description="You will only be able to see the most recent guess"/></label>
        </UForm>

        <USeparator/>

        <div class="grid gap-2">
          <div class="font-semibold">
            Unique link:
          </div>
          <div class="flex gap-5 overflow-hidden">
            <div
                class="result bg-elevated border-1 border-accented rounded-md px-3 py-2 grow overflow-x-auto text-sm flex items-center text-nowrap"
                :class="{'text-muted': !isValidWord}"
            >
              <span>{{ linkPrefix }}</span>
              <span class="text-primary font-semibold" v-if="isValidWord">{{result}}</span>
            </div>

            <UButton @click="copy" :disabled="!isValidWord" icon="material-symbols:content-copy-outline" variant="subtle" class="p-3"/>
          </div>
        </div>

        <div class="flex gap-5 justify-start">
          <UButton @click="close" variant="outline" size="lg">Cancel</UButton>
          <UButton @click="play" :disabled="!isValidWord" size="lg" trailing-icon="material-symbols:arrow-forward">Play your custom Wordle</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.result {
  scrollbar-width: thin;
  scrollbar-color: var(--color-neutral-400) var(--ui-bg-elevated);
}
</style>