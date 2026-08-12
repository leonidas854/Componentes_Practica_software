import { describe, it, expect, beforeEach } from 'vitest';
import { RoomReservationManager, type Reservation } from './reservation';

describe('Meetings Module - RoomReservationManager', () => {
  let manager: RoomReservationManager;

  beforeEach(() => {
    manager = new RoomReservationManager();
  });

  it('adds a valid reservation', () => {
    const res: Reservation = {
      id: '1',
      roomName: 'Sala A',
      userName: 'John Doe',
      date: '2025-10-10',
      slot: { start: 9, end: 11 }
    };

    const result = manager.addReservation(res);
    
    expect(result.success).toBe(true);
    expect(manager.getReservations()).toHaveLength(1);
  });

  it('prevents overlapping reservations (collision)', () => {
    const res1: Reservation = {
      id: '1',
      roomName: 'Sala A',
      userName: 'John Doe',
      date: '2025-10-10',
      slot: { start: 9, end: 11 }
    };

    manager.addReservation(res1);

    // Colliding reservation (starts during res1)
    const res2: Reservation = {
      id: '2',
      roomName: 'Sala A',
      userName: 'Jane Doe',
      date: '2025-10-10',
      slot: { start: 10, end: 12 }
    };

    const result = manager.addReservation(res2);
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('colisión');
    expect(manager.getReservations()).toHaveLength(1);
  });

  it('allows adjacent reservations', () => {
    const res1: Reservation = {
      id: '1',
      roomName: 'Sala A',
      userName: 'John',
      date: '2025-10-10',
      slot: { start: 9, end: 11 }
    };

    manager.addReservation(res1);

    // Starts exactly when res1 ends
    const res2: Reservation = {
      id: '2',
      roomName: 'Sala A',
      userName: 'Jane',
      date: '2025-10-10',
      slot: { start: 11, end: 13 }
    };

    const result = manager.addReservation(res2);
    
    expect(result.success).toBe(true);
    expect(manager.getReservations()).toHaveLength(2);
  });
});
