# Práctica — Componentes visuales, propiedades, eventos y clases

Tres aplicaciones desarrolladas con **SvelteKit 2 + Svelte 5 (runas) + TypeScript**, cada una
resolviendo uno de los enunciados de la práctica y todas compartiendo la misma arquitectura por
capas.

| # | Módulo | Ruta | Enunciado |
|---|--------|------|-----------|
| 1 | **Cine Center** | `/cinema` | Venta de entradas de cine con componentes visuales y diferentes tipos de eventos. |
| 2 | **Capresso** | `/cafe` | Registro de pedidos de una cafetería: seleccionar productos, indicar cantidades, calcular el total y mostrar un resumen. |
| 3 | **MeetSpace** | `/meetings` | Reserva de salas de reuniones con componentes visuales, eventos y clases. |

---

## Puesta en marcha

```sh
npm install          # instalar dependencias
npm run dev          # servidor de desarrollo  → http://localhost:5173
npm run build        # compilación de producción
npm run preview      # previsualizar la compilación → http://localhost:4173

npm run check        # comprobación de tipos (svelte-check)
npm run test         # pruebas unitarias y de componentes (Vitest)
npm run test:e2e     # pruebas end-to-end (Playwright)
```

> La primera ejecución de `npm run test:e2e` requiere descargar el navegador:
> `npx playwright install chromium`.

---

## Arquitectura

Cada módulo está dividido en cuatro capas con responsabilidades separadas. La regla que las
mantiene ordenadas es sencilla: **la vista no calcula ni valida nada**; sólo escucha eventos y
muestra lo que devuelve el modelo.

```text
src/
├─ lib/                          BIBLIOTECA COMPARTIDA
│  ├─ components/                componentes visuales reutilizables
│  │   Badge · Button · Card · EmptyState · Input · Modal
│  │   QuantityStepper · Select · Toast · TopNav
│  ├─ stores/toast.svelte.ts     estado global de avisos (clase + runas)
│  └─ utils/format.ts            formato de importes, horas y fechas
│
└─ routes/
   ├─ cinema/   ← PRÁCTICA 1
   │   ├─ data/catalog.ts        cartelera, funciones y tarifas
   │   ├─ models/                Seat · Auditorium · TicketOrder · types
   │   ├─ components/            MovieList · ShowtimeSelector · SeatMap
   │   │                         OrderSummary · CheckoutDialog
   │   └─ +page.svelte           vista: coordina componentes y eventos
   │
   ├─ cafe/     ← PRÁCTICA 2
   │   ├─ data/menu.ts           carta, categorías, filtrado y recuentos
   │   ├─ models/                Order · types
   │   ├─ components/            CategoryNav · ProductCard
   │   │                         CartSummary · ReceiptDialog
   │   └─ +page.svelte
   │
   └─ meetings/ ← PRÁCTICA 3
       ├─ data/rooms.ts          salas, calendario y agenda inicial
       ├─ models/                TimeSlot · Room · Reservation
       │                         ReservationManager
       ├─ components/            DatePicker · RoomCard · RoomTimeline
       │                         ReservationForm · AgendaList
       └─ +page.svelte
```

### Por qué hay archivos `.svelte.ts`

Las clases que necesitan **estado reactivo** (que la interfaz se redibuje sola al cambiar) viven en
archivos `.svelte.ts`, lo que permite declarar campos con `$state` dentro de la clase. Las clases
puramente lógicas (`TimeSlot`, `Room`, `Reservation`) son `.ts` normales.

---

## Cómo se cubre cada requisito

### Componentes visuales

Diez componentes reutilizables en `src/lib/components/` más los componentes propios de cada módulo.
Todos reciben sus datos por propiedades y comunican los cambios mediante funciones de retrollamada,
sin acceder al estado de la página.

### Propiedades de los componentes

Cada componente declara una interfaz TypeScript con sus propiedades. Ejemplos:

| Componente | Propiedades destacadas |
|------------|------------------------|
| `Button` | `variant`, `size`, `disabled`, `fullWidth`, `type`, `form` |
| `Input` | `value` (enlazable), `type`, `label`, `error`, `hint`, `icon`, `required` |
| `Modal` | `open`, `title`, `subtitle`, `size`, `closeOnBackdrop` |
| `QuantityStepper` | `value`, `min`, `max`, `size`, `editable` |
| `Badge` | `tone`, `icon`, `size` |
| `SeatMap` | `auditorium`, `onToggle`, `onHover` |

### Manejo de eventos

| Evento | Dónde se usa |
|--------|--------------|
| `click` | Butacas, funciones, películas, productos, categorías, tramos horarios, botones |
| `dblclick` | Doble clic en una película salta a su primera función (Práctica 1) |
| `change` | Tarifa por entrada, orden de la carta, cantidad escrita a mano, horas de la reserva, filtro de aforo |
| `input` | Buscador de la carta, notas de cocina, validación en vivo del formulario |
| `submit` | Confirmación de compra (Práctica 1) y alta de reserva (Práctica 3) |
| `keydown` | Flechas para recorrer el mapa de butacas, `Escape` para cerrar el modal y limpiar el buscador |
| `mouseenter` / `mouseleave` | Vista previa del precio de la butaca y del tramo horario |
| `focus` / `blur` | Marcado de campos "tocados" antes de mostrar errores |

### Clases

| Clase | Módulo | Responsabilidad |
|-------|--------|-----------------|
| `Seat` | Cine | Estado de una butaca, recargo VIP, selección y venta |
| `Auditorium` | Cine | Rejilla de butacas, ocupación determinista por función, búsqueda por posición |
| `TicketOrder` | Cine | Líneas del pedido, precio por tarifa, subtotal, cargo por servicio y total |
| `Order` | Cafetería | Líneas, cantidades, notas, descuento por volumen, impuesto, total y comprobante |
| `TimeSlot` | Salas | Franja `[inicio, fin)`, duración y detección de solapamientos |
| `Room` | Salas | Aforo, tarifa y cálculo del coste de una franja |
| `Reservation` | Salas | Reunión confirmada (inmutable) |
| `ReservationManager` | Salas | Reglas de negocio: colisiones, horario, duración, aforo, agenda y barra horaria |
| `ToastStore` | Compartido | Cola de avisos de la interfaz |

---

## Detalle de cada práctica

### Práctica 1 — Cine Center (`/cinema`)

- Cartelera con tres películas y varias funciones por película (2D, 3D, IMAX) con **precio base distinto**.
- Sala de 8 × 10 butacas con **filas VIP** (recargo fijo de $3) y ocupación **determinista por función**:
  cada horario tiene su propio mapa, estable entre el renderizado del servidor y el del navegador.
- Cuatro **tarifas** (general, estudiante, niño y tercera edad) asignables **por butaca** desde el resumen.
- Cálculo automático de subtotal, cargo por servicio (5 %) y total, con desglose por tarifa.
- Límite de 8 entradas por compra y formulario de compra con validación de nombre y correo.
- El mapa de butacas es navegable con el teclado: las flechas **saltan las butacas vendidas**, que
  al estar deshabilitadas no admiten el foco.

### Práctica 2 — Capresso (`/cafe`)

Resuelve el problema del enunciado —importes calculados a mano y falta de resumen— así:

- Carta de 18 productos en 5 categorías, con **filtro por categoría** y **buscador en vivo**
  (por nombre y descripción), además de ordenación por nombre o precio.
- Selección de productos e **indicación de cantidades** con el selector `- N +`, que también admite
  escribir la cifra directamente (se acota al rango permitido).
- **Cálculo automático**: subtotal, descuento por volumen del 10 % a partir de $25, impuesto del 8 %
  sobre la base ya descontada, y total.
- **Resumen del pedido** en un comprobante final que detalla producto, precio unitario, cantidad,
  nota para cocina e importe de cada línea.
- Modalidad "en local" / "para llevar", notas por línea y numeración correlativa de pedidos.

### Práctica 3 — MeetSpace (`/meetings`)

- Calendario de 7 días generado a partir de la fecha actual.
- Tres salas con aforo y tarifa propios; filtros por nombre y por aforo mínimo.
- **Barra horaria** por sala (8:00 – 20:00) que dibuja los tramos libres y ocupados; al pulsar un
  tramo libre se abre el formulario con esa franja precargada.
- El formulario delega toda la validación en `ReservationManager`, que comprueba:
  - solapamiento con reservas existentes de la misma sala y día,
  - horario de apertura,
  - duración entre 30 minutos y 4 horas,
  - aforo de la sala,
  - título y organizador con contenido.
- Agenda del día con el coste de cada reunión, cancelación y total facturable.

> Las franjas son intervalos **semiabiertos**: una reunión de 9:00 a 11:00 y otra de 11:00 a 13:00
> son consecutivas, no colisionan.

---

## Pruebas

```text
npm run test        # 118 pruebas en 8 archivos
```

| Archivo | Cubre |
|---------|-------|
| `src/lib/utils/format.test.ts` | Formato de importes, horas, duraciones y fechas |
| `src/lib/components/Button.test.ts` | Propiedades y eventos del botón compartido |
| `src/routes/cinema/models/cinema.models.test.ts` | `Seat`, `Auditorium` y `TicketOrder` |
| `src/routes/cinema/cinema.test.ts` | `SeatMap` (click, hover, teclado) y `ShowtimeSelector` |
| `src/routes/cafe/models/order.test.ts` | `Order`: importes, descuento, impuesto y comprobante |
| `src/routes/cafe/cafe.test.ts` | Filtrado de la carta, `ProductCard`, `CategoryNav`, `CartSummary` |
| `src/routes/meetings/models/meetings.models.test.ts` | `TimeSlot`, `Room`, `Reservation`, `ReservationManager` |
| `src/routes/meetings/meetings.test.ts` | Calendario, `DatePicker`, `RoomTimeline`, `AgendaList` |

Las pruebas end-to-end (`tests/test.ts`) recorren los tres módulos en un navegador real: selección
de butacas, cálculo del pedido de la cafetería, filtros y alta de una reserva con validación.

---

## Temas visuales

Cada ruta activa su propio tema mediante una clase en el contenedor raíz (`src/routes/+layout.svelte`),
sobre variables CSS definidas en `src/app.css`:

- `/cinema` → `theme-cine-center` (oscuro, ámbar)
- `/cafe` → `theme-capresso` (claro, café)
- `/meetings` → `theme-wework` (claro, profesional)
