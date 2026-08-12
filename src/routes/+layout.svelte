<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import Toast from '$lib/components/Toast.svelte';

  let { children } = $props();

  /** Cada módulo aplica su propio tema visual a través de una clase en el contenedor raíz. */
  let themeClass = $derived(
    $page.url.pathname.startsWith('/cinema')
      ? 'theme-cine-center'
      : $page.url.pathname.startsWith('/cafe')
        ? 'theme-capresso'
        : $page.url.pathname.startsWith('/meetings')
          ? 'theme-wework'
          : ''
  );
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
    rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
    rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Geist:wght@500&display=swap"
    rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    rel="stylesheet" />
</svelte:head>

<div class="app-container {themeClass}">
  {@render children()}
  <Toast />
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--bg-color);
    background-image: var(--gradient-bg);
    background-attachment: fixed;
    transition: background-color var(--transition-normal);
  }
</style>
