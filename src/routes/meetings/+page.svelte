<script lang="ts">
  import { RoomReservationManager, type Reservation, type TimeSlot } from './reservation';

  // Room Data matching the mockup
  const ROOMS = [
    { 
      id: 'r1', 
      name: 'Boardroom A', 
      capacity: 12, 
      price: 45,
      floor: 3,
      amenities: ['videocam', 'edit_note', 'coffee'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv3LKcHz9eAlu77gMHfEje04oQX-02vNqxyV2GqKSvEm6hrRqEPRNB-zsmIYI3q19ZeyR8uL5SURVt-VdhgOs3l1WtI87OtrpwJAGAcZmZaHwbtyhgiTbHAGx37BPBd6r8TQBFoESNzd3fqLHHvc4Yj0PRcFFqIlcBELcvhNJKeqY2_yPL-QhSh24-c3effBw_2fRCo-bx-ROyz0AGmTolv-S3hJCOrFZ6YZovHwPdkWmJ4TOINInEmA'
    },
    { 
      id: 'r2', 
      name: 'Huddle Studio', 
      capacity: 4, 
      price: 25,
      floor: 4,
      amenities: ['tv', 'edit_note'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYwB_NciIG5kIIOPXX2E_RUdOJ4ymetPcRvZyKrdmYuFUAuEkS5MZ1MfIPduZittc4asF9SWsFzs3f0-ZXWpBVNuCtJqzsc9ObM24SMHAkMIdl6515WBDmIy8wZtImrNFE5M0rwzS_MI-kSJEvNX-ABhiGS5f9tOk5Bv2ZNkRNDP3KcdwysNfOtozBN91gbgPtKdgtLimZZnX5KPKh4FDtEi8KZCTQTxynbp45-6C80cHY5-c_5kvi6w'
    }
  ];

  const START_HOUR = 9;
  const END_HOUR = 18; // 6 PM
  const TOTAL_HOURS = END_HOUR - START_HOUR;

  const DATES = [
    { day: 'Mon', date: 12, fullDate: '2023-10-12' },
    { day: 'Tue', date: 13, fullDate: '2023-10-13' },
    { day: 'Wed', date: 14, fullDate: '2023-10-14' },
    { day: 'Thu', date: 15, fullDate: '2023-10-15' },
    { day: 'Fri', date: 16, fullDate: '2023-10-16' }
  ];

  // Initialize Manager with some dummy data for Tue 13
  const manager = new RoomReservationManager([
    {
      id: 'dummy1',
      roomName: 'Boardroom A',
      userName: 'John Doe',
      date: '2023-10-13',
      slot: { start: 9, end: 11.25 } // 9 AM to 11:15 AM
    },
    {
      id: 'dummy2',
      roomName: 'Boardroom A',
      userName: 'María García',
      date: '2023-10-13',
      slot: { start: 16, end: 18 } // 4 PM to 6 PM
    },
    {
      id: 'dummy3',
      roomName: 'Huddle Studio',
      userName: 'Design Team',
      date: '2023-10-13',
      slot: { start: 12.5, end: 14 } // 12:30 PM to 2 PM
    }
  ]);

  // State
  let selectedDate = $state(DATES[1].fullDate); // default to Tue 13
  let reservations = $state(manager.getReservations());
  
  // Modal State
  let showModal = $state(false);
  let modalRoomId = $state('');
  let modalTitle = $state('');
  let modalStartHour = $state(9);
  let modalEndHour = $state(10);
  let modalAttendees = $state(2);
  let modalError = $state('');

  let activeRoom = $derived(ROOMS.find(r => r.id === modalRoomId));

  // Timeline Helper
  function getTimelineSegments(roomId: string, date: string) {
    const roomRes = reservations.filter(r => r.roomName === ROOMS.find(ro => ro.id === roomId)?.name && r.date === date);
    roomRes.sort((a, b) => a.slot.start - b.slot.start);

    const segments = [];
    let currentHour = START_HOUR;

    for (const res of roomRes) {
      if (res.slot.start > currentHour) {
        // Available block before reservation
        segments.push({
          type: 'available',
          start: currentHour,
          end: res.slot.start,
          widthPercent: ((res.slot.start - currentHour) / TOTAL_HOURS) * 100
        });
      }
      
      // Occupied block
      segments.push({
        type: 'occupied',
        start: res.slot.start,
        end: res.slot.end,
        widthPercent: ((res.slot.end - res.slot.start) / TOTAL_HOURS) * 100,
        reservation: res
      });
      
      currentHour = res.slot.end;
    }

    if (currentHour < END_HOUR) {
      // Final available block
      segments.push({
        type: 'available',
        start: currentHour,
        end: END_HOUR,
        widthPercent: ((END_HOUR - currentHour) / TOTAL_HOURS) * 100
      });
    }

    return segments;
  }

  function formatTime(hourNum: number) {
    const h = Math.floor(hourNum);
    const m = (hourNum - h) * 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h;
    const displayM = m === 0 ? '00' : Math.round(m).toString().padStart(2, '0');
    return `${displayH}:${displayM} ${ampm}`;
  }

  function openModal(roomId: string, startHour: number) {
    modalRoomId = roomId;
    modalStartHour = startHour;
    modalEndHour = startHour + 1; // Default 1 hour duration
    modalTitle = '';
    modalError = '';
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function handleReserve() {
    if (!activeRoom) return;
    if (!modalTitle.trim()) {
      modalError = 'Please enter a meeting title';
      return;
    }
    if (modalEndHour <= modalStartHour) {
      modalError = 'End time must be after start time';
      return;
    }

    const result = manager.addReservation({
      id: Math.random().toString(36).substring(2, 9),
      roomName: activeRoom.name,
      userName: modalTitle.trim(), // Storing title in userName for simplicity in this demo
      date: selectedDate,
      slot: { start: modalStartHour, end: modalEndHour }
    });

    if (result.success) {
      reservations = manager.getReservations();
      closeModal();
    } else {
      modalError = result.message || 'Time slot is already occupied';
    }
  }

  // Generate options for time selects
  const timeOptions = Array.from({ length: (END_HOUR - START_HOUR) * 2 + 1 }, (_, i) => START_HOUR + i * 0.5);
</script>

<!-- Top Navigation Bar -->
<nav class="top-nav">
  <div class="nav-inner">
    <div class="brand-section">
      <button class="icon-btn menu-btn">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <div class="brand-logo">WEWORK</div>
      <button class="avatar-btn">
        <img class="avatar-img" alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA6mhtHfzD7c5CIEHcSauEQrVJwoZYM0AqEWvfCv0tsho4pKwGu-EeM8kut0HaEpYdQD6wX4c7y1w84KebOWJTY_gP6brp5hp5kieODk33B_4kzKIUFLKCM9WOOTpaxxQawfuwqP9tcVlqu_qfxBPkyvHTddg_Ub7yPp_EcNHcQ6TnAWnkxAQS5geFoilySSdZca0sSgg2dwP1VX4zKtBAtw12oGWEcJ2rfsZ2c8PZqMSnQp58Wm7qnA" />
      </button>
    </div>
  </div>
</nav>

<div class="main-layout">
  <!-- Desktop Sidebar Nav -->
  <aside class="sidebar-nav">
    <a href="/meetings" class="nav-item">
      <span class="material-symbols-outlined">search</span>
      <span>Search</span>
    </a>
    <a href="/meetings" class="nav-item active">
      <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">event_available</span>
      <span>Bookings</span>
    </a>
    <a href="/meetings" class="nav-item">
      <span class="material-symbols-outlined">settings</span>
      <span>Settings</span>
    </a>
  </aside>

  <!-- Center Content -->
  <main class="content-area scrollbar-hide">
    <div class="page-header">
      <h1 class="page-title">Meeting Rooms</h1>
      <p class="page-subtitle">Find and book your perfect space.</p>
    </div>

    <!-- Date & Filter Row -->
    <div class="filter-row">
      <!-- Horizontal Date Picker -->
      <div class="date-picker scrollbar-hide">
        {#each DATES as d}
          <button 
            class="date-btn {selectedDate === d.fullDate ? 'active' : ''}"
            onclick={() => selectedDate = d.fullDate}
          >
            <span class="date-day">{d.day}</span>
            <span class="date-num">{d.date}</span>
          </button>
        {/each}
      </div>
      
      <!-- Filters -->
      <div class="filter-actions scrollbar-hide">
        <button class="filter-btn">
          <span class="material-symbols-outlined icon-sm">group</span>
          Capacity
        </button>
        <button class="filter-btn">
          <span class="material-symbols-outlined icon-sm">wifi</span>
          Amenities
        </button>
      </div>
    </div>

    <!-- Room Listing -->
    <div class="room-list">
      {#each ROOMS as room}
        <div class="room-card">
          <!-- Image -->
          <div class="room-image-col">
            <div class="room-image" style="background-image: url('{room.image}')"></div>
          </div>
          
          <!-- Content & Timeline -->
          <div class="room-content-col">
            <div class="room-info">
              <div class="room-header">
                <div>
                  <h2 class="room-name">{room.name}</h2>
                  <p class="room-meta">FLOOR {room.floor} • CAPACITY: {room.capacity}</p>
                </div>
                <div class="room-price-box">
                  <span class="room-price">${room.price}</span>
                  <span class="room-price-unit">/ HR</span>
                </div>
              </div>
              <div class="room-amenities">
                {#each room.amenities as am}
                  <span class="material-symbols-outlined icon-md">{am}</span>
                {/each}
              </div>
            </div>

            <!-- Timeline Bar -->
            <div class="timeline-container">
              <div class="timeline-labels">
                <span>9 AM</span>
                <span>12 PM</span>
                <span>3 PM</span>
                <span>6 PM</span>
              </div>
              <div class="timeline-bar">
                {#each getTimelineSegments(room.id, selectedDate) as segment}
                  {#if segment.type === 'available'}
                    <button 
                      class="timeline-segment available" 
                      style="width: {segment.widthPercent}%"
                      title="Available"
                      onclick={() => openModal(room.id, segment.start)}
                    >
                      <span class="segment-label">BOOK</span>
                    </button>
                  {:else}
                    <div 
                      class="timeline-segment occupied" 
                      style="width: {segment.widthPercent}%"
                      title={segment.reservation?.userName}
                    >
                      <span class="segment-label">OCCUPIED</span>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </main>
</div>

<!-- BottomNavBar (Mobile Only) -->
<nav class="mobile-nav">
  <button class="mobile-nav-item">
    <span class="material-symbols-outlined">search</span>
    <span>Search</span>
  </button>
  <button class="mobile-nav-item active">
    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">event_available</span>
    <span>Bookings</span>
  </button>
  <button class="mobile-nav-item">
    <span class="material-symbols-outlined">settings</span>
    <span>Settings</span>
  </button>
</nav>

<!-- Reservation Modal -->
{#if showModal && activeRoom}
  <div class="modal-overlay">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <h2 class="modal-title">New Reservation</h2>
          <p class="modal-subtitle">{activeRoom.name} • {DATES.find(d => d.fullDate === selectedDate)?.day}, Oct {DATES.find(d => d.fullDate === selectedDate)?.date}</p>
        </div>
        <button class="icon-btn close-btn" onclick={closeModal}>
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <!-- Modal Body -->
      <div class="modal-body">
        {#if modalError}
          <div class="error-banner">{modalError}</div>
        {/if}

        <div class="form-group">
          <label for="title" class="form-label">Meeting Title</label>
          <input id="title" class="form-input" type="text" placeholder="e.g. Brainstorming Session" bind:value={modalTitle} />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="start" class="form-label">Start Time</label>
            <select id="start" class="form-select" bind:value={modalStartHour}>
              {#each timeOptions as time}
                {#if time < END_HOUR}
                  <option value={time}>{formatTime(time)}</option>
                {/if}
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label for="end" class="form-label">End Time</label>
            <select id="end" class="form-select" bind:value={modalEndHour}>
              {#each timeOptions as time}
                {#if time > modalStartHour}
                  <option value={time}>{formatTime(time)}</option>
                {/if}
              {/each}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="attendees" class="form-label">Attendees</label>
          <div class="attendees-input-group">
            <input id="attendees" class="form-input number-input" type="number" min="1" max={activeRoom.capacity} bind:value={modalAttendees} />
            <span class="form-hint">Max capacity: {activeRoom.capacity}</span>
          </div>
        </div>
      </div>
      
      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="btn btn-outline" onclick={closeModal}>Cancel</button>
        <button class="btn btn-primary" onclick={handleReserve}>
          <span class="material-symbols-outlined" style="font-size: 18px;">event_available</span>
          Confirm Reservation
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* ===== Variables & Fonts specific to this UI ===== */
  :global(.theme-wework) {
    font-family: 'Hanken Grotesk', sans-serif;
  }

  .font-mono {
    font-family: 'Geist', monospace;
  }

  /* ===== Top Navigation ===== */
  .top-nav {
    position: sticky;
    top: 0;
    width: 100%;
    background-color: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
    z-index: 40;
    height: 64px;
  }

  .nav-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--spacing-md);
    height: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }

  .brand-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .icon-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    padding: 8px;
    border-radius: var(--radius-full);
    transition: background-color var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-btn:hover {
    background-color: var(--surface-high);
  }

  .brand-logo {
    font-family: 'Hanken Grotesk', sans-serif;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--primary-color);
  }

  .avatar-btn {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    overflow: hidden;
    padding: 0;
    border: none;
    cursor: pointer;
    background: none;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* ===== Main Layout ===== */
  .main-layout {
    display: flex;
    max-width: 1280px;
    margin: 0 auto;
    padding: var(--spacing-sm) var(--spacing-md) 96px var(--spacing-md);
    gap: var(--spacing-md);
  }

  @media (min-width: 768px) {
    .main-layout {
      padding-bottom: var(--spacing-xl);
    }
  }

  /* ===== Desktop Sidebar ===== */
  .sidebar-nav {
    display: none;
    flex-direction: column;
    width: 200px;
    flex-shrink: 0;
    border-right: 1px solid var(--border-color);
    padding-right: var(--spacing-md);
    padding-top: var(--spacing-lg);
    gap: 16px;
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;
  }

  @media (min-width: 768px) {
    .sidebar-nav {
      display: flex;
    }
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: var(--radius-sm);
    color: var(--primary-color);
    font-size: 16px;
    font-weight: 500;
    transition: background-color var(--transition-fast);
  }

  .nav-item:hover {
    background-color: var(--surface-high);
  }

  .nav-item.active {
    color: var(--secondary-color);
    background-color: var(--surface-high);
    font-weight: 600;
  }

  /* ===== Center Content ===== */
  .content-area {
    flex: 1;
    min-width: 0;
    padding-top: var(--spacing-sm);
  }

  .page-header {
    margin-bottom: var(--spacing-lg);
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
  }

  @media (min-width: 768px) {
    .page-title {
      font-size: 32px;
    }
  }

  .page-subtitle {
    font-size: 16px;
    color: var(--text-muted);
    margin-top: 8px;
  }

  /* ===== Filter Row ===== */
  .filter-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--spacing-md);
  }

  @media (min-width: 768px) {
    .filter-row {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .date-picker {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .date-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 60px;
    padding: 8px;
    border-radius: var(--radius-xs);
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .date-btn:hover {
    background: var(--surface-high);
  }

  .date-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-on-primary);
    transform: scale(1.05);
    box-shadow: var(--shadow-sm);
  }

  .date-day {
    font-family: 'Geist', monospace;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 500;
  }

  .date-num {
    font-size: 24px;
    font-weight: 600;
    margin-top: 4px;
  }

  .filter-actions {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .filter-btn {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: 0;
    font-family: 'Geist', monospace;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color var(--transition-fast);
  }

  .filter-btn:hover {
    background-color: var(--surface-high);
  }

  .icon-sm {
    font-size: 18px;
    margin-right: 8px;
  }

  /* ===== Room List ===== */
  .room-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .room-card {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
  }

  .room-card:first-child {
    padding-top: 0;
    border-top: none;
  }

  @media (min-width: 1024px) {
    .room-card {
      grid-template-columns: 5fr 7fr;
    }
  }

  .room-image-col {
    height: 250px;
    border-radius: var(--radius-xs);
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .room-image-col {
      height: 100%;
      min-height: 250px;
    }
  }

  .room-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    border: 1px solid var(--border-color);
  }

  .room-content-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-md);
    height: 100%;
  }

  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .room-name {
    font-size: 24px;
    font-weight: 700;
  }

  .room-meta {
    font-family: 'Geist', monospace;
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .room-price-box {
    text-align: right;
  }

  .room-price {
    font-size: 24px;
    font-weight: 700;
    display: block;
  }

  .room-price-unit {
    font-family: 'Geist', monospace;
    font-size: 12px;
    color: var(--text-muted);
  }

  .room-amenities {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    color: var(--text-muted);
  }

  .icon-md {
    font-size: 20px;
  }

  /* ===== Timeline Bar ===== */
  .timeline-container {
    width: 100%;
  }

  .timeline-labels {
    display: flex;
    justify-content: space-between;
    font-family: 'Geist', monospace;
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .timeline-bar {
    display: flex;
    width: 100%;
    height: 32px;
    border: 1px solid var(--border-color);
    background-color: var(--surface-high);
  }

  .timeline-segment {
    height: 100%;
    border-right: 1px solid var(--border-color);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: none;
    border-bottom: none;
    border-left: none;
    padding: 0;
  }

  .timeline-segment:last-child {
    border-right: none;
  }

  .timeline-segment.available {
    background-color: var(--surface-high);
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .timeline-segment.available:hover {
    background-color: #dce1ff; /* hover blue from mockup */
  }

  .timeline-segment.available .segment-label {
    color: var(--secondary-color);
    opacity: 0;
  }

  .timeline-segment.available:hover .segment-label {
    opacity: 1;
  }

  .timeline-segment.occupied {
    background-color: var(--surface-hover); /* grey out */
    cursor: not-allowed;
  }

  .timeline-segment.occupied .segment-label {
    color: var(--text-muted);
    opacity: 0;
  }

  .timeline-segment.occupied:hover .segment-label {
    opacity: 1;
  }

  .segment-label {
    font-family: 'Geist', monospace;
    font-size: 10px;
    font-weight: 500;
    transition: opacity var(--transition-fast);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 4px;
  }

  /* ===== Bottom Mobile Nav ===== */
  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: var(--surface-color);
    border-top: 1px solid var(--border-color);
    z-index: 50;
    justify-content: space-around;
    align-items: center;
    padding-bottom: env(safe-area-inset-bottom);
  }

  @media (min-width: 768px) {
    .mobile-nav {
      display: none;
    }
  }

  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    transition: transform var(--transition-fast), background-color var(--transition-fast);
  }

  .mobile-nav-item:active {
    transform: scale(0.9);
  }

  .mobile-nav-item.active {
    color: var(--secondary-color);
  }

  .mobile-nav-item span:last-child {
    font-family: 'Geist', monospace;
    font-size: 12px;
    margin-top: 4px;
  }

  /* ===== Modal ===== */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(27, 28, 28, 0.4);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: fadeIn var(--transition-fast);
  }

  .modal-content {
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    width: 100%;
    max-width: 448px;
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    animation: fadeInUp var(--transition-fast);
  }

  .modal-header {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--surface-color);
  }

  .modal-title {
    font-size: 24px;
    font-weight: 600;
  }

  .modal-subtitle {
    font-size: 16px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .close-btn {
    color: var(--text-muted);
  }

  .close-btn:hover {
    color: var(--primary-color);
  }

  .modal-body {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .error-banner {
    background-color: var(--danger-color);
    color: white;
    padding: 12px;
    border-radius: var(--radius-xs);
    font-size: 14px;
    font-weight: 500;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-label {
    font-family: 'Geist', monospace;
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
  }

  .form-input, .form-select {
    width: 100%;
    padding: 12px 16px;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xs);
    font-size: 16px;
    font-family: inherit;
    color: var(--text-main);
    transition: all var(--transition-fast);
  }

  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }

  .attendees-input-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .number-input {
    width: 96px;
    text-align: center;
  }

  .form-hint {
    font-size: 16px;
    color: var(--text-muted);
  }

  .modal-footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border-color);
    background-color: var(--surface-color);
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }

  .btn {
    padding: 10px 24px;
    border-radius: var(--radius-xs);
    font-family: 'Geist', monospace;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-outline {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--primary-color);
  }

  .btn-outline:hover {
    background-color: var(--surface-high);
  }

  .btn-primary {
    background-color: var(--secondary-color);
    border: 1px solid var(--secondary-color);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .btn-primary:hover {
    background-color: var(--secondary-container);
  }
</style>
