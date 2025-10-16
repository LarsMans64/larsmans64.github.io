<script setup lang="ts">
const toast = useToast();

const open = ref(false);

const word = ref("");
const attempts = ref(6);

watch(word, () => {
  const upper = word.value.toUpperCase();
  if (upper != word.value) {
    word.value = upper;
  }
})

const valid = computed(() => {
  return /^[A-Z]+$/.test(word.value)
      && attempts.value > 0;
})

const linkPrefix = window?.location.origin + window?.location.pathname + "?w=";

const result = computed(() => btoa(attempts.value.toString() + word.value));
const link = computed(() => linkPrefix + result.value);

function copy() {
  navigator.clipboard.writeText(link.value);
  toast.add({
    title: "Copied to Clipboard!",
    icon: "material-symbols:check",
  })
}

function play() {
  reloadNuxtApp({path: link.value});
}

function close() {
  open.value = false;
}
</script>

<template>
  <UModal title="Generate a link" v-model:open="open">
    <slot/>

    <template #description>hahe</template>

    <template #body>
      <div class="flex flex-col gap-7">
        <UForm class="grid sm:grid-cols-2 gap-5">
          <UFormField label="Custom word" required>
            <UInput v-model.trim="word" variant="subtle" placeholder="Xnopyt" class="w-full"/>
          </UFormField>

          <UFormField label="Max number of attempts" required>
            <UInputNumber v-model="attempts" variant="subtle" class="w-full"/>
          </UFormField>
        </UForm>

        <USeparator/>

        <div class="grid gap-2">
          <div class="font-semibold">
            Output:
          </div>
          <div class="flex gap-5 overflow-hidden">
            <div
                class="bg-elevated border-1 border-accented rounded-md px-3 py-2 grow overflow-x-auto text-sm flex items-center text-nowrap"
                :class="{'text-muted': !valid}"
            >
              <span>{{ linkPrefix }}</span>
              <span class="text-primary font-semibold" v-if="valid">{{result}}</span>
            </div>

            <UButton @click="copy" :disabled="!valid" icon="material-symbols:content-copy-outline" variant="subtle" class="p-3"/>
          </div>
        </div>

        <div class="flex gap-5 justify-start">
          <UButton @click="close" variant="outline" size="lg">Cancel</UButton>
          <UButton @click="play" :disabled="!valid" size="lg" trailing-icon="material-symbols:arrow-forward">Play your custom Wordle</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>