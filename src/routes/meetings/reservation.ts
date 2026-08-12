export interface TimeSlot {
  start: number; // Hour in 24h format (e.g., 9 for 9:00 AM)
  end: number;   // Hour in 24h format (e.g., 10 for 10:00 AM)
}

export interface Reservation {
  id: string;
  roomName: string;
  userName: string;
  date: string; // YYYY-MM-DD
  slot: TimeSlot;
}

export class RoomReservationManager {
  private reservations: Reservation[] = [];

  constructor(initialReservations: Reservation[] = []) {
    this.reservations = [...initialReservations];
  }

  public getReservations(): Reservation[] {
    return [...this.reservations];
  }

  public getReservationsForRoom(roomName: string, date: string): Reservation[] {
    return this.reservations.filter(
      res => res.roomName === roomName && res.date === date
    );
  }

  public isSlotAvailable(roomName: string, date: string, slot: TimeSlot): boolean {
    const dailyReservations = this.getReservationsForRoom(roomName, date);
    
    // Check for collisions
    // A collision occurs if the requested slot overlaps with any existing reservation
    // Requested: [req.start, req.end)
    // Existing:  [ex.start, ex.end)
    // Overlap if: req.start < ex.end AND ex.start < req.end
    
    const hasCollision = dailyReservations.some(ex => {
      return (slot.start < ex.slot.end) && (ex.slot.start < slot.end);
    });

    return !hasCollision;
  }

  public addReservation(reservation: Reservation): { success: boolean; message?: string } {
    if (!this.isSlotAvailable(reservation.roomName, reservation.date, reservation.slot)) {
      return { 
        success: false, 
        message: 'El horario seleccionado no está disponible (colisión detectada).' 
      };
    }

    if (reservation.slot.start >= reservation.slot.end) {
      return {
        success: false,
        message: 'El horario de inicio debe ser anterior al de fin.'
      }
    }

    this.reservations.push(reservation);
    return { success: true };
  }

  public removeReservation(id: string): void {
    this.reservations = this.reservations.filter(res => res.id !== id);
  }
}
