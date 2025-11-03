<script setup lang="ts">
import {copyText, type TileData, WordleLetterState} from "~/utils/wordle";

const props = defineProps<{
  field: TileData[][],
  won?: boolean,
  attempts: number,
  totalAttempts: number,
}>();

const isOpen = defineModel<boolean>();

function close() {
  isOpen.value = false;
}

const showLetters = ref(false);

function getShareText() {
  return props.field.map(row => {
    return row.map(tile => {
      switch (tile.state) {
        case WordleLetterState.Correct:
          return "🟩";
        case WordleLetterState.WrongPosition:
          return "🟨";
        case WordleLetterState.Wrong:
          return "⬛";
      }
      return "";
    }).join("");
  }).filter(row => row).join("\n").concat(`\n\nLars' Custom Wordle - ${props.attempts}/${props.totalAttempts}\n` + window.location.href);
}

function share() {
  navigator.share({ text: getShareText() });
}

function copy() {
  copyText(getShareText());
}
</script>

<template>
  <UModal title="Results" description="Maybe you did well, or maybe not" v-model:open="isOpen">
    <slot/>

    <template #body>
      <div class="flex flex-col gap-5 items-center">
        <h2 class="text-xl font-semibold">
          {{ won ? "Congratulations!" : "Better luck next time :)" }}
        </h2>

        <div class="flex flex-col gap-1 items-center select-none">
          <div v-for="row in field" class="flex gap-1">
            <div
                v-for="tile in row"
                class="w-10 aspect-square flex justify-center items-center text-xl text-transparent font-semibold border-2 rounded transition-all duration-200"
                :class="{
                  'wordle-empty': tile.state == WordleLetterState.Empty,
                  'wordle-wrong': tile.state == WordleLetterState.Wrong,
                  'wordle-wrong-position': tile.state == WordleLetterState.WrongPosition,
                  'wordle-correct': tile.state == WordleLetterState.Correct,
                  'text-black dark:text-white': showLetters,
                }"
            >
              {{tile.letter}}
            </div>
          </div>
        </div>

        <USwitch label="Show letters" v-model="showLetters"/>

        <div class="flex gap-3">
          <UButton label="Share" icon="material-symbols:share" @click="share"/>
          <UButton label="Copy" icon="material-symbols:content-copy-outline" variant="subtle" @click="copy"/>
        </div>
      </div>

    </template>

    <template #footer>
      <div class="flex gap-5 justify-start">
        <UButton @click="close" variant="outline" size="lg">Close</UButton>

        <WordleGeneratorModal>
          <UButton size="lg" leading-icon="material-symbols:add">Create new link</UButton>
        </WordleGeneratorModal>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>