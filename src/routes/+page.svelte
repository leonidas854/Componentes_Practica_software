<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { goto } from '$app/navigation';
</script>

<header class="home-nav">
  <div class="home-nav-inner">
    <span class="home-brand">Sistema Multipropósito</span>
  </div>
</header>

<main class="dashboard">
  <div class="hero">
    <h1 class="text-gradient">Bienvenido al Sistema</h1>
    <p class="subtitle">Selecciona un módulo para comenzar</p>
  </div>

  <div class="grid">
    <Card 
      interactive 
      onclick={() => goto('/cinema')} 
      class="module-card"
    >
      {#snippet header()}
        <div class="card-title">
          <span class="material-symbols-outlined card-icon cinema-icon" style="font-size: 28px; font-variation-settings: 'FILL' 1;">movie</span>
          <h2>Cine Center</h2>
        </div>
      {/snippet}
      
      <p class="card-desc">Venta de entradas de cine, selección de asientos y cálculo de total.</p>
      <div class="card-tags">
        <span class="tag">Eventos</span>
        <span class="tag">Componentes</span>
      </div>
    </Card>

    <Card 
      interactive 
      onclick={() => goto('/cafe')} 
      class="module-card"
    >
      {#snippet header()}
        <div class="card-title">
          <span class="material-symbols-outlined card-icon cafe-icon" style="font-size: 28px; font-variation-settings: 'FILL' 1;">local_cafe</span>
          <h2>Capresso</h2>
        </div>
      {/snippet}
      
      <p class="card-desc">Registro de pedidos, gestión de carrito y cálculo automático de importe.</p>
      <div class="card-tags">
        <span class="tag">Propiedades</span>
        <span class="tag">Estado</span>
      </div>
    </Card>

    <Card 
      interactive 
      onclick={() => goto('/meetings')} 
      class="module-card"
    >
      {#snippet header()}
        <div class="card-title">
          <span class="material-symbols-outlined card-icon meetings-icon" style="font-size: 28px; font-variation-settings: 'FILL' 1;">meeting_room</span>
          <h2>MeetSpace</h2>
        </div>
      {/snippet}
      
      <p class="card-desc">Reserva de salas, selección de horarios y prevención de colisiones.</p>
      <div class="card-tags">
        <span class="tag">Clases</span>
        <span class="tag">OOP</span>
      </div>
    </Card>
  </div>
</main>

<style>
  /* Home Nav */
  .home-nav {
    background: var(--surface-color);
    backdrop-filter: var(--glass-blur);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .home-nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md) var(--spacing-xl);
  }

  .home-brand {
    font-size: 1.25rem;
    font-weight: 700;
    background-image: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  /* Dashboard */
  .dashboard {
    padding: var(--spacing-2xl) var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    animation: fadeIn var(--transition-normal);
  }

  .hero {
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  .hero h1 {
    font-size: 3rem;
    margin-bottom: var(--spacing-sm);
    font-weight: 900;
    letter-spacing: -0.03em;
  }

  .subtitle {
    color: var(--text-muted);
    font-size: 1.25rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .card-title h2 {
    font-size: 1.5rem;
    margin: 0;
  }

  .card-icon {
    border-radius: var(--radius-sm);
    padding: 4px;
  }

  .cinema-icon {
    color: #E3001B;
  }

  .cafe-icon {
    color: #D48135;
  }

  .meetings-icon {
    color: #00A8E8;
  }

  .card-desc {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
  }

  .card-tags {
    display: flex;
    gap: var(--spacing-sm);
  }

  .tag {
    padding: 4px 12px;
    border-radius: var(--radius-full);
    background: var(--primary-glow);
    color: var(--primary-color);
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid var(--border-color);
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2rem;
    }
  }
</style>
