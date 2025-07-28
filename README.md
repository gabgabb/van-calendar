# Van Calendar

![Tests](https://github.com/gabgabb/van-calendar/actions/workflows/test.yml/badge.svg)

## Tech Stack

- **React with Next.js (App Router)** – Modern routing, server/client rendering support.
- **TypeScript** – Static typing for safer and more maintainable code.
- **Tailwind CSS** – Utility-first styling framework.
- **ShadCN UI** – Accessible and themeable components built on Radix.
- **@dnd-kit** – Advanced drag-and-drop toolkit.
- **Zustand** – Minimal and persistent state management (`localStorage`).
- **Jest + Testing Library** – Unit + integration testing framework.
- **Docker + Makefile** – Streamlined development and deployment workflow.

---

## Key Features

-  **Weekly calendar view** with drag-and-drop rescheduling.
-  **Station selection** stored in `localStorage` via Zustand and hydrated on reload.
-  **Booking details drawer**, with start/end info and customer details.
-  **Unit tests** for key components (`BookingCard`, `CalendarDay`, custom hooks...).
-  **Date handling**: the year from API data is intentionally ignored to ensure bookings remain relevant and functional.

---

## Getting Started Locally

### Prerequisites
- Docker (for containerized development)
- Yarn ≥ 4 (managed via Corepack)

### Quickstart with Makefile

```bash
make install   # Install dependencies
make start     # Start the dev container
```

### Run tests
````bash
make test
````

### Open http://localhost:3000 in your browser

## Live Demo

You can try Van Calendar live:

- **GitHub Pages**  
  [https://gabgabb.github.io/van-calendar](https://gabgabb.github.io/van-calendar)

- **VPS Deployment**  
  [https://van-calendar.gabriaile.dev](https://van-calendar.gabriaile.dev)
