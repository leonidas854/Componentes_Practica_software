import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import AgendaList from './components/AgendaList.svelte';
import DatePicker from './components/DatePicker.svelte';
import RoomTimeline from './components/RoomTimeline.svelte';
import { buildCalendar } from './data/rooms';
import { Reservation } from './models/Reservation';
import { ReservationManager } from './models/ReservationManager.svelte';
import { Room } from './models/Room';
import { TimeSlot } from './models/TimeSlot';

const BOARDROOM = new Room({
  id: 'r1',
  name: 'Boardroom A',
  capacity: 12,
  floor: 3,
  pricePerHour: 45,
  amenities: ['wifi'],
  image: ''
});

const DATE = '2026-03-10';

function managerWith(...reservations: Reservation[]) {
  return new ReservationManager([BOARDROOM], reservations);
}

describe('PRÁCTICA 3 — Generación del calendario', () => {
  it('crea los días solicitados a partir de la fecha indicada', () => {
    const calendar = buildCalendar(5, new Date(2026, 2, 10));

    expect(calendar).toHaveLength(5);
    expect(calendar[0].value).toBe('2026-03-10');
    expect(calendar[0].isToday).toBe(true);
    expect(calendar[4].value).toBe('2026-03-14');
    expect(calendar[4].isToday).toBe(false);
  });

  it('cruza correctamente el cambio de mes', () => {
    const calendar = buildCalendar(3, new Date(2026, 2, 30));
    expect(calendar.map((day) => day.value)).toEqual(['2026-03-30', '2026-03-31', '2026-04-01']);
  });
});

describe('PRÁCTICA 3 — Componente DatePicker', () => {
  const days = buildCalendar(4, new Date(2026, 2, 10));

  it('marca el día seleccionado', () => {
    render(DatePicker, { props: { days, selected: days[1].value, onSelect: () => {} } });

    expect(screen.getByText('11').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('10').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('EVENTO CLICK: comunica la fecha elegida', async () => {
    const onSelect = vi.fn();
    render(DatePicker, { props: { days, selected: days[0].value, onSelect } });

    await fireEvent.click(screen.getByText('12'));
    expect(onSelect).toHaveBeenCalledWith('2026-03-12');
  });
});

describe('PRÁCTICA 3 — Componente RoomTimeline', () => {
  it('muestra un único tramo libre cuando la sala está vacía', () => {
    const manager = managerWith();
    render(RoomTimeline, {
      props: { segments: manager.timeline(BOARDROOM.id, DATE), onPickFree: () => {} }
    });

    expect(screen.getAllByText('Libre')).toHaveLength(1);
  });

  it('dibuja el tramo ocupado con el título de la reunión', () => {
    const manager = managerWith(
      new Reservation('res-1', {
        roomId: BOARDROOM.id,
        title: 'Revisión trimestral',
        organizer: 'Laura',
        date: DATE,
        slot: new TimeSlot(9, 11),
        attendees: 6
      })
    );

    render(RoomTimeline, {
      props: { segments: manager.timeline(BOARDROOM.id, DATE), onPickFree: () => {} }
    });

    expect(screen.getByText('Revisión trimestral')).toBeInTheDocument();
    expect(screen.getAllByText('Libre')).toHaveLength(2);
  });

  it('EVENTO CLICK: propone reservar el tramo libre seleccionado', async () => {
    const manager = managerWith(
      new Reservation('res-1', {
        roomId: BOARDROOM.id,
        title: 'Daily',
        organizer: 'Equipo',
        date: DATE,
        slot: new TimeSlot(9, 11),
        attendees: 4
      })
    );
    const onPickFree = vi.fn();

    render(RoomTimeline, {
      props: { segments: manager.timeline(BOARDROOM.id, DATE), onPickFree }
    });

    // Primer tramo libre: de la apertura (8) hasta el inicio de la reunión (9).
    await fireEvent.click(screen.getAllByText('Libre')[0]);
    expect(onPickFree).toHaveBeenCalledWith(8, 9);

    // Segundo tramo libre: del fin de la reunión (11) al cierre (20).
    await fireEvent.click(screen.getAllByText('Libre')[1]);
    expect(onPickFree).toHaveBeenCalledWith(11, 20);
  });

  it('EVENTO CLICK: abre el detalle de un tramo ocupado', async () => {
    const reservation = new Reservation('res-1', {
      roomId: BOARDROOM.id,
      title: 'Entrevista',
      organizer: 'Marc',
      date: DATE,
      slot: new TimeSlot(12, 13),
      attendees: 3
    });
    const onPickBusy = vi.fn();

    render(RoomTimeline, {
      props: {
        segments: managerWith(reservation).timeline(BOARDROOM.id, DATE),
        onPickFree: () => {},
        onPickBusy
      }
    });

    await fireEvent.click(screen.getByText('Entrevista'));
    expect(onPickBusy).toHaveBeenCalledWith(reservation);
  });
});

describe('PRÁCTICA 3 — Componente AgendaList', () => {
  const reservation = new Reservation('res-1', {
    roomId: BOARDROOM.id,
    title: 'Revisión trimestral',
    organizer: 'Laura Pérez',
    date: DATE,
    slot: new TimeSlot(9, 11),
    attendees: 6
  });

  it('muestra el estado vacío sin reuniones', () => {
    render(AgendaList, { props: { reservations: [], rooms: [BOARDROOM], onCancel: () => {} } });

    expect(screen.getByText('Sin reuniones')).toBeInTheDocument();
    expect(screen.queryByText('Total facturable')).not.toBeInTheDocument();
  });

  it('detalla la reunión con su sala, horario y coste', () => {
    render(AgendaList, {
      props: { reservations: [reservation], rooms: [BOARDROOM], onCancel: () => {} }
    });

    expect(screen.getByText('Revisión trimestral')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM – 11:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Boardroom A · Laura Pérez')).toBeInTheDocument();
    // 2 h × $45 = $90.00
    expect(screen.getByText('$90.00')).toBeInTheDocument();
  });

  it('suma el total facturable del día', () => {
    const second = new Reservation('res-2', {
      roomId: BOARDROOM.id,
      title: 'Retro',
      organizer: 'Equipo',
      date: DATE,
      slot: new TimeSlot(15, 16),
      attendees: 5
    });

    render(AgendaList, {
      props: { reservations: [reservation, second], rooms: [BOARDROOM], onCancel: () => {} }
    });

    // 90 + 45 = 135
    expect(screen.getByText('$135.00')).toBeInTheDocument();
  });

  it('EVENTO CLICK: cancela una reunión', async () => {
    const onCancel = vi.fn();
    render(AgendaList, { props: { reservations: [reservation], rooms: [BOARDROOM], onCancel } });

    await fireEvent.click(screen.getByLabelText('Cancelar Revisión trimestral'));
    expect(onCancel).toHaveBeenCalledWith(reservation);
  });
});
