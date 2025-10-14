<script setup lang="ts">

</script>

<template>
  <div class="page">
    <h1>LarsMans</h1>
    <div class="card">
      <h1>⚠️ Work in progress ⚠️</h1>
      <p>This will have to get redesigned some time soon :)</p>
      <p>If you came here looking for the planet thing: <a href="https://larsmans.nl/planets">here</a>.</p>
    </div>
    <p>
      <a href="https://github.com/LarsMans64">GitHub</a>
      |
      <a href="https://teamdiopside.nl">Diopside</a>
      |
      <a href="https://portalmod.net">PortalMod</a>
      |
      <a href="https://modrinth.com/user/LarsMans">Modrinth</a>
      |
      <a href="https://www.curseforge.com/members/larsmans/projects">CurseForge</a>
    </p>
  </div>
</template>

<style scoped>
.page {
  --bg: rgb(20, 20, 34);
  --bg-light: rgb(29, 29, 44);
  --border: rgb(68, 68, 90);
  --heading: #dde;
  --text: #ccd;
  --link: #a9c4ff;

  padding: 2em;
  height: 100svh;

  background: var(--bg);
  color: var(--text);
  font-family: "Google Sans Code", monospace;
  font-size: 1.1rem;
  font-weight: 500;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
}

.card {
  background: var(--bg-light);
  border: .3em dashed var(--border);
  border-radius: 2em;

  padding: 1em 4em 2em;
}

h1 {
  color: var(--heading);
  margin-block: 2rem;
  text-wrap: balance;
}

a {
  color: var(--link);
  font-weight: 600;
}

@media (width < 600px) {
  .page {
    font-size: .7rem;
  }

  .card {
    margin: 1em;
    padding: 0 2em 1em;
  }
}
</style>