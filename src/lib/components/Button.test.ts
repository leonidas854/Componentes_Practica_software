import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Componente compartido — Button', () => {
  it('usa la variante y el tamaño por defecto', () => {
    const { getByRole } = render(Button);
    const button = getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-md');
    expect(button).not.toBeDisabled();
  });

  it('aplica la propiedad variant', () => {
    const { getByRole } = render(Button, { variant: 'danger' });
    expect(getByRole('button')).toHaveClass('btn-danger');
  });

  it('aplica la propiedad size', () => {
    const { getByRole } = render(Button, { size: 'lg' });
    expect(getByRole('button')).toHaveClass('btn-lg');
  });

  it('ocupa todo el ancho con fullWidth', () => {
    const { getByRole } = render(Button, { fullWidth: true });
    expect(getByRole('button')).toHaveClass('full-width');
  });

  it('lanza el evento click', async () => {
    const handleClick = vi.fn();
    const { getByRole } = render(Button, { onclick: handleClick });

    await fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no lanza el evento click cuando está deshabilitado', () => {
    const handleClick = vi.fn();
    const { getByRole } = render(Button, { disabled: true, onclick: handleClick });

    const button = getByRole('button');
    expect(button).toBeDisabled();

    // `HTMLElement.click()` respeta el atributo disabled, a diferencia de
    // `fireEvent.click`, que despacha el evento directamente sobre el nodo.
    button.click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('lanza los eventos de ratón', async () => {
    const onmouseenter = vi.fn();
    const onmouseleave = vi.fn();
    const { getByRole } = render(Button, { onmouseenter, onmouseleave });

    await fireEvent.mouseEnter(getByRole('button'));
    await fireEvent.mouseLeave(getByRole('button'));

    expect(onmouseenter).toHaveBeenCalledTimes(1);
    expect(onmouseleave).toHaveBeenCalledTimes(1);
  });
});
