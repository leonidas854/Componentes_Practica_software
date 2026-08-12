<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import { RoomReservationManager, type Reservation, type TimeSlot } from './reservation';
  import { Clock, Users, CalendarDays, CheckCircle } from 'lucide-svelte';

  const ROOMS = [
    { id: 'Sala A', capacity: 10, name: 'Sala Alpha' },
    { id: 'Sala B', capacity: 4, name: 'Sala Beta (Pequeña)' },
    { id: 'Sala C', capacity: 20, name: 'Sala Gamma (Directorio)' }
  ];

  // Initialize Manager
  const manager = new RoomReservationManager([
    // Add some dummy initial data for today
    {
      id: 'dummy1',
      roomName: 'Sala A',
      userName: 'John Doe',
      date: new Date().toISOString().split('T')[0],
      slot: { start: 9, end: 11 }
    }
  ]);

  // Form State
  let selectedRoom = $state(ROOMS[0].id);
  let selectedDate = $state(new Date().toISOString().split('T')[0]);
  let selectedStartTime = $state(9); // 9 AM
  let duration = $state(1); // 1 hour
  let userName = $state('');
  
  // App State
  let reservations = $state(manager.getReservations());
  let errorMsg = $state('');

  // Derived
  let todayReservations = $derived(
    reservations.filter(r => r.date === selectedDate)
  );

  function handleReserve() {
    errorMsg = '';
    
    if (!userName.trim()) {
      errorMsg = 'Por favor ingresa tu nombre.';
      return;
    }

    const slot: TimeSlot = {
      start: selectedStartTime,
      end: selectedStartTime + duration
    };

    const newRes: Reservation = {
      id: Math.random().toString(36).substring(2, 9),
      roomName: selectedRoom,
      userName: userName.trim(),
      date: selectedDate,
      slot
    };

    const result = manager.addReservation(newRes);
    
    if (result.success) {
      // Update state to trigger reactivity
      reservations = manager.getReservations();
      userName = ''; // reset form
      alert('Reserva creada exitosamente');
    } else {
      errorMsg = result.message || 'Error desconocido';
    }
  }

  function formatTime(hour: number) {
    return `${hour.toString().padStart(2, '0')}:00`;
  }
</script>

<Header title="WeWork - Reserva de Salas" backUrl="/" />

<main class="meetings-container">
  <div class="content-grid">
    <!-- Formulario de Reserva -->
    <section class="reservation-form glass-panel">
      <h2 class="section-title">Nueva Reserva</h2>
      
      {#if errorMsg}
        <div class="error-banner">
          {errorMsg}
        </div>
      {/if}

      <div class="form-group">
        <label for="room-select">Selecciona una Sala:</label>
        <div class="rooms-grid">
          {#each ROOMS as room}
            <button 
              class="room-card"
              class:selected={selectedRoom === room.id}
              onclick={() => selectedRoom = room.id}
            >
              <h3>{room.name}</h3>
              <div class="capacity">
                <Users size={16} />
                <span>Hasta {room.capacity} personas</span>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="date"><CalendarDays size={16}/> Fecha:</label>
          <input type="date" id="date" class="input-field" bind:value={selectedDate} />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="time"><Clock size={16}/> Hora Inicio:</label>
          <select id="time" class="input-field" bind:value={selectedStartTime}>
            {#each Array.from({ length: 11 }, (_, i) => i + 8) as hour}
              <!-- From 8 AM to 6 PM -->
              <option value={hour}>{formatTime(hour)}</option>
            {/each}
          </select>
        </div>
        
        <div class="form-group">
          <label for="duration">Duración (horas):</label>
          <input 
            type="number" 
            id="duration" 
            class="input-field" 
            bind:value={duration} 
            min="1" max="8" 
          />
        </div>
      </div>

      <div class="form-group">
        <label for="user">Nombre del Solicitante:</label>
        <Input 
          id="user"
          bind:value={userName} 
          placeholder="Ej. Juan Pérez"
        />
      </div>

      <Button variant="primary" onclick={handleReserve} style="width: 100%; margin-top: var(--spacing-md);">
        Confirmar Reserva
      </Button>
    </section>

    <!-- Agenda del día -->
    <aside class="agenda-section glass-panel">
      <h2 class="section-title">Agenda para {selectedDate}</h2>
      
      <div class="agenda-list">
        {#if todayReservations.length === 0}
          <div class="empty-state">
            <p>No hay reservas para este día.</p>
          </div>
        {:else}
          {#each todayReservations.sort((a,b) => a.slot.start - b.slot.start) as res}
            <div class="agenda-item">
              <div class="agenda-time">
                {formatTime(res.slot.start)} - {formatTime(res.slot.end)}
              </div>
              <div class="agenda-details">
                <div class="agenda-room">
                  <CheckCircle size={14} color="var(--success-color)" />
                  <strong>{res.roomName}</strong>
                </div>
                <div class="agenda-user">
                  Reservado por: {res.userName}
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </aside>
  </div>
</main>

<style>
  .meetings-container {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn var(--transition-normal);
  }

  .content-grid {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: var(--spacing-xl);
  }

  .glass-panel {
    padding: var(--spacing-xl);
  }

  .section-title {
    margin-bottom: var(--spacing-lg);
    font-size: 1.5rem;
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .form-group label {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-weight: 500;
    color: var(--text-muted);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  .input-field {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-main);
    font-size: 1rem;
    font-family: inherit;
    transition: all var(--transition-fast);
  }

  .input-field:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-glow);
  }

  /* Room selection cards */
  .rooms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }

  .room-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-main);
  }

  .room-card:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .room-card.selected {
    background: var(--primary-glow);
    border-color: var(--primary-color);
    box-shadow: 0 0 15px var(--primary-glow);
  }

  .room-card h3 {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: 1.1rem;
  }

  .capacity {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  .error-banner {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger-color);
    border: 1px solid rgba(239, 68, 68, 0.3);
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-lg);
    font-weight: 500;
  }

  /* Agenda */
  .agenda-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .agenda-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    background: rgba(0, 0, 0, 0.2);
    border-left: 3px solid var(--primary-color);
    padding: var(--spacing-md);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }

  .agenda-time {
    font-weight: 600;
    color: var(--primary-color);
    font-size: 0.95rem;
  }

  .agenda-room {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 1.05rem;
  }

  .agenda-user {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .empty-state {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    padding: var(--spacing-xl) 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 800px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
