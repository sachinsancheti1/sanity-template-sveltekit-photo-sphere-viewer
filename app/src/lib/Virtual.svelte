<script>
  let wrapper
  import {Viewer} from '@photo-sphere-viewer/core'
  import {VirtualTourPlugin} from '@photo-sphere-viewer/virtual-tour-plugin'
  import {GalleryPlugin} from '@photo-sphere-viewer/gallery-plugin'
  import {onMount} from 'svelte'

  export let virtualTourItem
  export let virtualTourPageBlocks
    
  onMount(() => {
    const viewer = new Viewer({
      container: wrapper,
      loadingImg: virtualTourPageBlocks.loader,
      defaultYaw: '0deg',
      
      navbar: 'zoom move gallery caption fullscreen',

      plugins: [
        [
          GalleryPlugin,
          {
            thumbnailSize: {width: 100, height: 100}
          }
        ],
        [
          VirtualTourPlugin,
          {
            renderMode: '3d',
            positionMode: 'manual'
          }
        ]
      ]
    })

    const virtualTour = viewer.getPlugin(VirtualTourPlugin)

    virtualTour.setNodes(
      virtualTourItem,
      virtualTourPageBlocks.start._id
    )
  })
</script>

<div id="viewer" bind:this={wrapper} style="width: 100vw; height: 100vh;" />

<style>
  @import 'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5/index.css';
  @import 'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/virtual-tour-plugin@5/index.css';
  @import 'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/gallery-plugin@5/index.css';

  :global(.psv-tooltip-content > img, .psv-tooltip-content > p) {
    display: none;
  }
  :global(.psv-tooltip-content > h3) {
    font-size: 12px;
  }
  :global(html, body) {
    margin: 0;
    width: 100vw;
    height: 100vh;
    font-family: sans-serif;
  }
  #viewer {
    margin: 0;
    width: 100vw;
    height: 100vh;
    font-family: sans-serif;
  }
</style>
