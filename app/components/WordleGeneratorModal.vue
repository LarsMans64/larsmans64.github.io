<script setup lang="ts">

const toast = useToast();
const wordInput = useTemplateRef("wordInput");

const isOpen = ref(false);

const settings = reactive<WordleSettings>({
  word: "",
  attempts: 6,
  hardMode: false,
  noHints: false,
})

watch(settings, () => {
  const upper = settings.word.toUpperCase();
  if (upper != settings.word) {
    settings.word = upper;
  }
});

const linkPrefix = window?.location.origin + window?.location.pathname + "?w=";

const result = computed(() => {
  return btoa(
      settings.attempts.toString()
      + settings.word
      + (settings.hardMode ? "1" : "0")
      + (settings.noHints ? "1" : "0")
  ).replaceAll(/\?/g, "%3F");
});

const link = computed(() => linkPrefix + result.value);

const isValidWord = computed(() => {
  return /^[A-Z]+$/.test(settings.word)
      && settings.attempts > 0;
})

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
watch(isOpen, (val) => {
  setTimeout(() => {
    if (val) {
      wordInput.value?.inputRef?.focus();
    }
  }, 100);
})
</script>

<template>
  <UModal title="Generate a link" v-model:open="isOpen">
    <slot/>

    <template #description>
      Create a custom Wordle and share it with your friends.
    </template>

    <template #body>
      <div class="flex flex-col gap-7">
        <UForm class="grid sm:grid-cols-2 gap-x-5 gap-y-8">
          <UFormField label="Custom word" required>
            <UInput v-model.trim="settings.word" ref="wordInput" variant="subtle" placeholder="Xnopyt" class="w-full"/>
          </UFormField>

          <UFormField label="Max number of attempts" required>
            <UInputNumber v-model="settings.attempts" variant="subtle" class="w-full"/>
          </UFormField>

          <UCheckbox v-model="settings.hardMode" label="Forced hard mode" description="You are forced to always use already discovered letters"/>
          <UCheckbox v-model="settings.noHints" label="No keyboard hints" description="Discovered letters won't show on the keyboard"/>

          <!-- maybe disappearing previous guesses -->
        </UForm>

        <USeparator/>

        <div class="grid gap-2">
          <div class="font-semibold">
            Unique link:
          </div>
          <div class="flex gap-5 overflow-hidden">
            <div
                class="bg-elevated border-1 border-accented rounded-md px-3 py-2 grow overflow-x-auto text-sm flex items-center text-nowrap"
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

</style>