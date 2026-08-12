<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Header from '$lib/components/Header.svelte';
  import { Film, Coffee, Calendar } from 'lucide-svelte';
  import { goto } from '$app/navigation';
</script>

<Header title="Sistema Multipropósito" />

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
          <Film size={24} color="var(--primary-color)" />
          <h2>Cine Center</h2>
        </div>
      {/snippet}
      
      <p class="card-desc">Venta de entradas de cine, selección de asientos y cálculo de total.</p>
    </Card>

    <Card 
      interactive 
      onclick={() => goto('/cafe')} 
      class="module-card"
    >
      {#snippet header()}
        <div class="card-title">
          <Coffee size={24} color="var(--secondary-color)" />
          <h2>Capresso</h2>
        </div>
      {/snippet}
      
      <p class="card-desc">Registro de pedidos, gestión de carrito y cálculo automático de importe.</p>
    </Card>

    <Card 
      interactive 
      onclick={() => goto('/meetings')} 
      class="module-card"
    >
      {#snippet header()}
        <div class="card-title">
          <Calendar size={24} color="var(--success-color)" />
          <h2>WeWork (Salas)</h2>
        </div>
      {/snippet}
      
      <p class="card-desc">Reserva de salas, selección de horarios y prevención de colisiones.</p>
    </Card>
  </div>
</main>

<style>
  .dashboard {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    animation: fadeIn var(--transition-normal);
  }

  .hero {
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  .hero h1 {
    font-size: 3rem;
    margin-bottom: var(--spacing-sm);
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

  .card-desc {
    color: var(--text-muted);
    line-height: 1.6;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
