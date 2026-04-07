# 🗓️ WallCal - Interactive Aesthetic Wall Calendar

Welcome to **WallCal**, a beautifully designed, highly interactive web-based wall calendar. Inspired by the premium feel of physical analog planners, WallCal combines smooth modern web animations with practical scheduling tools.

This project was built from the ground up to provide a stunning aesthetic experience, featuring dynamic CSS 3D page-flipping, responsive design, and intuitive selection workflows.

---

## ✨ Key Features

- **Aesthetic First Design:** A premium UI utilizing glassmorphism, tailored monthly gradients, and high-quality seasonal hero imagery.
- **Interactive Page Flipping:** Navigate between months with a deeply satisfying, 3D CSS-powered calendar page flip animation, complete with seasonal "particle" effects.
- **Smart Date Selection:**
  - Click a date to select it. Click again to unselect.
  - Click two different dates to create a persistent **Date Range**.
  - **Double Click** any date to instantly pop open a sleek "Add Event" modal.
- **Mobile-Friendly Architecture:** Fully responsive. Tooltips and events seamlessly switch from a desktop "hover" model to a persistent "tap-to-view" model on mobile aspect ratios. 
- **Notepad System:** A dedicated, ruled notepad section for each month. Checking off a task triggers a satisfying strike-through animation before automatically fading the task away.
- **Guided Onboarding:** A built-in popup tour dynamically teaches first-time visitors how to use the app.
- **Zero-Backend Persistence:** All your notes, events, and date ranges are smoothly preserved in the browser's `localStorage` so you never lose your data upon refreshing.

---

## 🛠️ Technology Stack & Architectual Choices

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) + React 19.
- **Styling:**
  - **Tailwind CSS:** Used for overarching responsive layouts, utility classes, and layout scaffolding.
  - **Vanilla CSS (`index.css`):** Used extensively for complex logic that Tailwind isn't suited for—specifically the heavy 3D transforms (`rotateX`) for the page flips, the custom keyframe strike-through animations on the notes, and structural grid styling.
- **Icons:** [Lucide-React](https://lucide.dev/) for crisp, uniform iconography.
- **State Management:** React `useState` and `useEffect` hooks paired with a robust custom `localStorage` sync mechanism to mimic a backend database. 

### Why Browser Storage (`localStorage`)?
To keep the application lightweight, blazing fast, and instantly deployable without complex database orchestration, all state (Notes, Events, Selected Ranges, and Onboarding Status) is securely saved in the user's browser. This guarantees ultimate privacy while retaining total functionality across page reloads.

---

## 🚀 How to Run Locally

If you'd like to run WallCal on your own machine, follow these simple steps:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18.17 or higher recommended).

### 2. Clone the Repository
```bash
git clone https://github.com/JeetDev2104/TUF.git
cd TUF
```

### 3. Install Dependencies
Install the required packages using npm:
```bash
npm install
```

### 4. Start the Development Server
Kick off the local Next.js server with:
```bash
npm run dev
```

### 5. Access the App
Open your browser and navigate to:
```
http://localhost:3000/wallcalander
```
*(Note: Ensure you include `/wallcalander` in your path as that is the primary routing directory!)*

---

### Enjoy planning your year with WallCal! ✨
