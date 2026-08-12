<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import type { Movie } from '../models/types';

  /**
   * Componente visual: Cartelera lateral.
   * PROPIEDADES: movies, selectedId.
   * EVENTOS: click (seleccionar), dblclick (seleccionar y saltar a la primera función).
   */
  interface MovieListProps {
    movies: Movie[];
    selectedId: string;
    onSelect: (movie: Movie) => void;
    onQuickPick?: (movie: Movie) => void;
  }

  let { movies, selectedId, onSelect, onQuickPick }: MovieListProps = $props();
</script>

<div class="movie-list-panel">
  <div class="panel-header">
    <h2>En cartelera</h2>
    <p class="panel-hint">Doble clic: primera función</p>
  </div>

  <div class="movie-list">
    {#each movies as movie (movie.id)}
      <button
        type="button"
        class="movie-card"
        class:active={selectedId === movie.id}
        aria-pressed={selectedId === movie.id}
        onclick={() => onSelect(movie)}
        ondblclick={() => onQuickPick?.(movie)}
      >
        <img class="movie-poster" src={movie.poster} alt="Cartel de {movie.title}" />
        <div class="movie-info">
          <span class="movie-title">{movie.title}</span>
          <span class="movie-meta">{movie.genre} · {movie.durationMin} min</span>
          <div class="movie-tags">
            <span class="movie-rating">
              <span
                class="material-symbols-outlined star-icon"
                style="font-variation-settings: 'FILL' 1;"
                aria-hidden="true">star</span>
              {movie.rating}
            </span>
            <Badge tone="neutral">{movie.ageRating}</Badge>
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .movie-list-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .panel-header {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    background: var(--bg-color);
    z-index: 5;
  }

  .panel-header h2 {
    font-size: 1.05rem;
    font-weight: 700;
  }

  .panel-hint {
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .movie-list {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
  }

  .movie-card {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    color: var(--text-main);
    font-family: inherit;
  }

  .movie-card:hover {
    background: var(--surface-hover);
  }

  .movie-card:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .movie-card.active {
    background: var(--surface-high);
    border-color: var(--primary-color);
  }

  .movie-poster {
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    flex-shrink: 0;
    background: var(--surface-high);
  }

  .movie-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    min-width: 0;
  }

  .movie-title {
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .movie-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .movie-tags {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: 2px;
  }

  .movie-rating {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .star-icon {
    font-size: 14px !important;
    color: var(--primary-color);
  }

  /* Por debajo de 1200px la cartelera se convierte en una tira horizontal. */
  @media (max-width: 1200px) {
    .panel-header {
      position: static;
    }

    .movie-list {
      flex-direction: row;
      overflow-x: auto;
      scrollbar-width: thin;
      padding-bottom: var(--spacing-md);
    }

    .movie-card {
      min-width: 250px;
      flex-shrink: 0;
    }
  }
</style>
