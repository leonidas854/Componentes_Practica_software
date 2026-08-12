<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';

  /**
   * Índice de la práctica: acceso a los tres módulos desarrollados.
   */
  interface PracticeModule {
    number: number;
    href: string;
    icon: string;
    accent: string;
    title: string;
    statement: string;
    highlights: string[];
    topics: string[];
  }

  const MODULES: PracticeModule[] = [
    {
      number: 1,
      href: '/cinema',
      icon: 'movie',
      accent: '#ffb800',
      title: 'Cine Center',
      statement:
        'Aplicación para la venta de entradas de cine utilizando componentes visuales y diferentes tipos de eventos.',
      highlights: [
        'Mapa de butacas con filas VIP y estándar',
        'Tarifas por entrada: general, estudiante, niño y tercera edad',
        'Cálculo automático de subtotal, cargo por servicio y total'
      ],
      topics: ['click', 'dblclick', 'change', 'input', 'submit', 'keydown', 'mouseenter']
    },
    {
      number: 2,
      href: '/cafe',
      icon: 'local_cafe',
      accent: '#d48135',
      title: 'Capresso',
      statement:
        'Sistema para registrar los pedidos de una cafetería: seleccionar productos, indicar cantidades, calcular el total y mostrar un resumen del pedido.',
      highlights: [
        'Carta filtrable por categoría y buscador en vivo',
        'Cantidades editables con descuento por volumen e impuesto',
        'Comprobante final con el detalle de lo solicitado'
      ],
      topics: ['click', 'change', 'input', 'keydown']
    },
    {
      number: 3,
      href: '/meetings',
      icon: 'meeting_room',
      accent: '#0056fd',
      title: 'MeetSpace',
      statement:
        'Aplicación gráfica para reservar salas de reuniones utilizando componentes visuales, eventos y clases.',
      highlights: [
        'Barra horaria por sala con tramos libres y ocupados',
        'Detección de colisiones, aforo y horario de apertura',
        'Agenda del día con cancelación y coste facturable'
      ],
      topics: ['click', 'change', 'input', 'submit', 'mouseenter']
    }
  ];

  const REQUIREMENTS = [
    { icon: 'widgets', label: 'Componentes visuales' },
    { icon: 'tune', label: 'Propiedades de los componentes' },
    { icon: 'bolt', label: 'Manejo de eventos' },
    { icon: 'account_tree', label: 'Clases y arquitectura por capas' }
  ];
</script>

<header class="home-nav">
  <div class="home-nav-inner">
    <span class="home-brand">Práctica · Componentes visuales y eventos</span>
  </div>
</header>

<main class="dashboard">
  <section class="hero">
    <h1>Tres aplicaciones, una misma arquitectura</h1>
    <p class="hero-subtitle">
      Cada módulo separa datos, modelo de dominio, componentes visuales y vista.
    </p>

    <ul class="requirements">
      {#each REQUIREMENTS as requirement (requirement.label)}
        <li>
          <span class="material-symbols-outlined" aria-hidden="true">{requirement.icon}</span>
          {requirement.label}
        </li>
      {/each}
    </ul>
  </section>

  <div class="grid">
    {#each MODULES as module (module.href)}
      <a class="module-card" href={module.href} style="--accent: {module.accent}">
        <header class="module-header">
          <span class="module-icon material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
            {module.icon}
          </span>
          <div class="module-title-block">
            <span class="module-number">Práctica {module.number}</span>
            <h2>{module.title}</h2>
          </div>
        </header>

        <p class="module-statement">{module.statement}</p>

        <ul class="module-highlights">
          {#each module.highlights as highlight (highlight)}
            <li>
              <span class="material-symbols-outlined" aria-hidden="true">check</span>
              {highlight}
            </li>
          {/each}
        </ul>

        <footer class="module-footer">
          <div class="module-topics">
            {#each module.topics as topic (topic)}
              <Badge tone="neutral">{topic}</Badge>
            {/each}
          </div>
          <span class="module-cta">
            Abrir módulo
            <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </span>
        </footer>
      </a>
    {/each}
  </div>
</main>

<style>
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
    font-size: 1rem;
    font-weight: 700;
    background-image: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

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

  /* Encabezado */
  .hero {
    text-align: center;
  }

  .hero h1 {
    font-size: 2.6rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    background-image: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hero-subtitle {
    color: var(--text-muted);
    font-size: 1.05rem;
    margin-top: var(--spacing-sm);
  }

  .requirements {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
    list-style: none;
  }

  .requirements li {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    background: var(--surface-color);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .requirements :global(.material-symbols-outlined) {
    font-size: 17px;
    color: var(--primary-color);
  }

  /* Tarjetas */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
    gap: var(--spacing-lg);
  }

  .module-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    background: var(--surface-color);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    color: var(--text-main);
    transition: all var(--transition-normal);
  }

  .module-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent);
    color: var(--text-main);
  }

  .module-card:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }

  .module-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .module-icon {
    font-size: 32px !important;
    color: var(--accent);
  }

  .module-number {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .module-title-block h2 {
    font-size: 1.35rem;
    font-weight: 700;
  }

  .module-statement {
    color: var(--text-muted);
    font-size: 0.85rem;
    line-height: 1.6;
  }

  .module-highlights {
    display: flex;
    flex-direction: column;
    gap: 6px;
    list-style: none;
  }

  .module-highlights li {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    font-size: 0.8rem;
    line-height: 1.45;
    color: var(--text-main);
  }

  .module-highlights :global(.material-symbols-outlined) {
    font-size: 16px;
    color: var(--accent);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .module-footer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-top: auto;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-color);
  }

  .module-topics {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .module-cta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--accent);
  }

  .module-cta :global(.material-symbols-outlined) {
    font-size: 18px;
    transition: transform var(--transition-fast);
  }

  .module-card:hover .module-cta :global(.material-symbols-outlined) {
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: var(--spacing-xl) var(--spacing-md);
    }

    .hero h1 {
      font-size: 1.8rem;
    }
  }
</style>
