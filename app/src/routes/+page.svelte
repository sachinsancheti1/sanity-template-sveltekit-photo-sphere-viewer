<script>
  import Virtual from '$lib/Virtual.svelte'

  export let data

  let e = data.e
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta property="og:title" content={e.virtualTourPageBlocks.title} />
  <meta property="og:description" content={e.virtualTourPageBlocks.description} />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="app">
  <Virtual virtualTourPageBlocks={e.virtualTourPageBlocks} virtualTourItem={e.virtualTourItem}/>
</div>

<style>
  .app {
    margin: 0;
    width: 100vw;
    height: 100vh;
    font-family: sans-serif;
  }
</style>
