<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  let { children } = $props();

  let themeClass = $derived(
    $page.url.pathname.startsWith('/cinema') ? 'theme-cine-center' :
    $page.url.pathname.startsWith('/cafe') ? 'theme-capresso' :
    $page.url.pathname.startsWith('/meetings') ? 'theme-wework' :
    ''
  );
</script>

<div class="app-container {themeClass}">
  {@render children()}
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
