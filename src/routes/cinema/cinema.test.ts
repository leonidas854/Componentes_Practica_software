import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import SeatMap from './components/SeatMap.svelte';
import ShowtimeSelector from './components/ShowtimeSelector.svelte';
import { Auditorium } from './models/Auditorium.svelte';
import type { Showtime } from './models/types';

const SHOWTIMES: Showtime[] = [
  { id: 's1', movieId: 'm1', hour: 16.5, format: '2D', hall: 'Sala 1', basePrice: 12 },
  { id: 's2', movieId: 'm1', hour: 19, format: '3D', hall: 'Sala 4', basePrice: 15 }
];

describe('PRÁCTICA 1 — Componente SeatMap', () => {
  it('dibuja todas las butacas de la sala', () => {
    const auditorium = new Auditorium('s1');
    render(SeatMap, { props: { auditorium, onToggle: () => {} } });

    expect(screen.getByLabelText(/^Butaca A1,/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Butaca H10,/)).toBeInTheDocument();
  });

  it('deshabilita las butacas ocupadas', () => {
    const auditorium = new Auditorium('s1');
    const occupied = auditorium.seats.find((seat) => seat.status === 'occupied')!;

    render(SeatMap, { props: { auditorium, onToggle: () => {} } });

    const button = screen.getByLabelText(new RegExp(`^Butaca ${occupied.id},`));
    expect(button).toBeDisabled();
    expect(button).toHaveClass('occupied');
  });

  it('EVENTO CLICK: avisa al seleccionar una butaca libre', async () => {
    const auditorium = new Auditorium('s1');
    const free = auditorium.seats.find((seat) => seat.status === 'available')!;
    const onToggle = vi.fn();

    render(SeatMap, { props: { auditorium, onToggle } });
    await fireEvent.click(screen.getByLabelText(new RegExp(`^Butaca ${free.id},`)));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle.mock.calls[0][0].id).toBe(free.id);
  });

  it('EVENTOS MOUSEENTER / MOUSELEAVE: informan de la butaca bajo el cursor', async () => {
    const auditorium = new Auditorium('s1');
    const free = auditorium.seats.find((seat) => seat.status === 'available')!;
    const onHover = vi.fn();

    render(SeatMap, { props: { auditorium, onToggle: () => {}, onHover } });
    const button = screen.getByLabelText(new RegExp(`^Butaca ${free.id},`));

    await fireEvent.mouseEnter(button);
    expect(onHover).toHaveBeenLastCalledWith(expect.objectContaining({ id: free.id }));

    await fireEvent.mouseLeave(button);
    expect(onHover).toHaveBeenLastCalledWith(null);
  });

  it('EVENTO KEYDOWN: las flechas saltan a la siguiente butaca seleccionable', async () => {
    const auditorium = new Auditorium('s1');
    const row = auditorium.rows[0];

    const startIndex = row.findIndex((seat) => seat.isSelectable);
    const nextIndex = row.findIndex((seat, index) => index > startIndex && seat.isSelectable);
    expect(nextIndex).toBeGreaterThan(-1);

    render(SeatMap, { props: { auditorium, onToggle: () => {} } });

    const start = screen.getByLabelText(new RegExp(`^Butaca ${row[startIndex].id},`));
    start.focus();

    await fireEvent.keyDown(start, { key: 'ArrowRight' });

    // Se salta cualquier butaca ocupada que haya en medio.
    expect(document.activeElement).toBe(
      screen.getByLabelText(new RegExp(`^Butaca ${row[nextIndex].id},`))
    );
  });

  it('EVENTO KEYDOWN: el foco no se sale de la rejilla', async () => {
    const auditorium = new Auditorium('s1');
    const row = auditorium.rows[0];
    // A la izquierda de la primera butaca seleccionable no hay ninguna disponible.
    const firstSelectable = row.find((seat) => seat.isSelectable)!;

    render(SeatMap, { props: { auditorium, onToggle: () => {} } });

    const start = screen.getByLabelText(new RegExp(`^Butaca ${firstSelectable.id},`));
    start.focus();

    await fireEvent.keyDown(start, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(start);
  });

  it('refleja el estado seleccionado de la butaca', async () => {
    const auditorium = new Auditorium('s1');
    const free = auditorium.seats.find((seat) => seat.status === 'available')!;

    render(SeatMap, { props: { auditorium, onToggle: (seat) => seat.toggle() } });
    const button = screen.getByLabelText(new RegExp(`^Butaca ${free.id},`));

    await fireEvent.click(button);

    expect(screen.getByLabelText(new RegExp(`^Butaca ${free.id}.*seleccionada`))).toHaveClass(
      'selected'
    );
  });
});

describe('PRÁCTICA 1 — Componente ShowtimeSelector', () => {
  it('muestra la hora, el formato y el precio de cada función', () => {
    render(ShowtimeSelector, {
      props: { showtimes: SHOWTIMES, selectedId: 's1', onSelect: () => {} }
    });

    expect(screen.getByText('4:30 PM')).toBeInTheDocument();
    expect(screen.getByText('2D · $12.00')).toBeInTheDocument();
    expect(screen.getByText('3D · $15.00')).toBeInTheDocument();
  });

  it('marca la función activa', () => {
    render(ShowtimeSelector, {
      props: { showtimes: SHOWTIMES, selectedId: 's2', onSelect: () => {} }
    });

    expect(screen.getByText('7:00 PM').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('4:30 PM').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('EVENTO CLICK: avisa de la función elegida', async () => {
    const onSelect = vi.fn();
    render(ShowtimeSelector, { props: { showtimes: SHOWTIMES, selectedId: 's1', onSelect } });

    await fireEvent.click(screen.getByText('7:00 PM'));

    expect(onSelect).toHaveBeenCalledWith(SHOWTIMES[1]);
  });
});
