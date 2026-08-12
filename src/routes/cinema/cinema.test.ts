import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import SeatMap from './SeatMap.svelte';
import type { Seat } from './SeatMap.svelte';

describe('Cinema Module - SeatMap Component', () => {
  let mockSeats: Seat[][];

  beforeEach(() => {
    mockSeats = [
      [
        { id: 'A1', row: 'A', col: 1, status: 'available' },
        { id: 'A2', row: 'A', col: 2, status: 'occupied' },
        { id: 'A3', row: 'A', col: 3, status: 'selected' }
      ]
    ];
  });

  it('renders seats correctly based on status', () => {
    render(SeatMap, { 
      props: {
        seats: mockSeats,
        onSeatToggle: () => {}
      }
    });
    
    // Buttons are accessible by aria-label
    const availableSeat = screen.getByLabelText('Asiento A1');
    const occupiedSeat = screen.getByLabelText('Asiento A2');
    const selectedSeat = screen.getByLabelText('Asiento A3');

    expect(availableSeat.classList.contains('available')).toBe(true);
    
    expect(occupiedSeat.classList.contains('occupied')).toBe(true);
    expect((occupiedSeat as HTMLButtonElement).disabled).toBe(true);

    expect(selectedSeat.classList.contains('selected')).toBe(true);
  });

  it('calls onSeatToggle when an available seat is clicked', async () => {
    let toggledSeat: Seat | null = null;
    
    render(SeatMap, { 
      props: {
        seats: mockSeats,
        onSeatToggle: (seat: Seat) => {
          toggledSeat = seat;
        }
      }
    });

    const availableSeat = screen.getByLabelText('Asiento A1');
    await fireEvent.click(availableSeat);

    expect(toggledSeat).not.toBeNull();
    expect((toggledSeat as unknown as Seat)?.id).toBe('A1');
  });
});
