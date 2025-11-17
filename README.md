# TaskFlow – Algonive Internship Project

<div align="center">
  <img src="./ui/assets/favicon.svg" alt="TaskFlow logo" width="72" />
  <h3 style="margin-top: 0.5rem;">Smart personal task manager crafted during the Algonive Internship Program.</h3>
  <p style="max-width: 680px;">Track work, stay focused, and document progress with an elegant dashboard experience built to showcase front-end engineering skills.</p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <a href="https://<YOUR_NETLIFY_DEPLOYMENT_URL>" target="_blank" rel="noopener">
    <img src="https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
  </a>
</div>

<p align="center">
  <a href="https://<YOUR_NETLIFY_DEPLOYMENT_URL>" target="_blank" rel="noopener">
    <img src="./docs/taskflow-dashboard.png" alt="TaskFlow dashboard preview" width="900" />
  </a>
</p>

> ℹ️ Replace `./docs/taskflow-dashboard.png` with a fresh screenshot of the deployed site and update the Netlify URL once live.

---

## 📚 Table of Contents
- [Project Goal](#-project-goal)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Deployment (Netlify)](#-deployment-netlify)
- [Internship Context](#-internship-context)
- [Roadmap](#-roadmap)
- [Acknowledgements](#-acknowledgements)

## 🎯 Project Goal
TaskFlow streamlines personal productivity by combining task planning, proof-of-work attachments, and daily insights in a single dashboard. This internship deliverable demonstrates real-world UI craftsmanship, modular architecture, and deployment-readiness for Algonive.

## ✨ Key Features
- **Interactive Dashboard** – Track totals, pending, completed, and overdue tasks with live stats and donut visualization.
- **Task CRUD** – Create, edit, delete, and mark tasks complete with rich metadata (priority, tags, notes).
- **Deadline Intelligence** – Toast notifications highlight overdue tasks and same-day due reminders.
- **Attachment Support** – Attach evidence files and show their details for audit-ready tasks.
- **Document Exports** – Generate task summaries in PDF or DOCX via `jspdf` and `docx` integrations.
- **Workspace Personalization** – Dark mode toggle, theme color picker, and profile settings.
- **Data Persistence** – LocalStorage-powered offline mode keeps everything available between sessions.
- **Safety Nets** – Modals and confirmation flows prevent accidental destructive actions.

## 🧠 How It Works
On load the app initializes saved tasks from `localStorage`, injects demo data for new users, and renders both dashboard and task list views. Modular JavaScript files keep responsibilities isolated: state management handles persistence, UI modules render components, and events modules wire user interactions. Toast notifications provide subtle feedback while theme utilities update CSS variables instantly for a polished feel.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Build Tooling:** Vite 5
- **Data Storage:** Browser `localStorage`
- **Document Generation:** `jspdf`, `docx`
- **Deployment Platform:** Netlify

## 📁 Folder Structure
```bash
Algonive_Task_Manager/
├── .gitignore
├── netlify.toml
├── README.md
└── ui/
    ├── index.html
    ├── package.json
    ├── css/
    ├── assets/
    │   └── favicon.svg
    └── scripts/
        ├── script.js
        └── modules/
            ├── events.js
            ├── init.js
            ├── notifications.js
            ├── settings.js
            ├── state.js
            ├── ui.js
            └── utils.js
```

## 🧩 Key Modules Explained
- **`state.js`** – Task CRUD operations, demo bootstrapping, and persistence helpers.
- **`ui.js`** – Renders dashboard components, task cards, charts, and handles view switching.
- **`events.js`** – Centralizes all DOM event listeners and user interactions.
- **`settings.js`** – Applies theme selections, color schemes, and profile updates.
- **`notifications.js`** – Toast-based alerts for deadlines, warnings, and informative messages.
- **`utils.js`** – Formatting helpers for text, dates, file sizes, and priority badges.

## 🚀 Getting Started
> **Prerequisites:** Node.js ≥ 18 and npm ≥ 9

```bash
# Clone the repository
git clone <repository-url>
cd Algonive_Task_Manager/ui

# Install dependencies
npm install

# Start local development server with hot reload
npm run dev
```

Visit the Vite dev server URL (default: `http://localhost:5173`) to explore the app.

## 📜 Available Scripts
- `npm run dev` – Start the Vite development server.
- `npm run build` – Produce an optimized production bundle in `ui/dist/`.
- `npm run preview` – Serve the production build locally for QA.

## 🌐 Deployment (Netlify)
Netlify reads the bundled `netlify.toml`:

- **Base directory:** `ui`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `18`

### Quick Deploy Steps
1. Push the repo to GitHub/GitLab/Bitbucket.
2. In Netlify, select **Add new site → Import an existing project**.
3. Connect the repo and confirm the build settings above.
4. Deploy—Netlify installs dependencies, builds, and serves `dist/` automatically.

## 🏢 Internship Context
This project was built for the **Algonive Internship Program** to evidence:
- End-to-end ownership of a production-quality front-end application.
- Application of modular JavaScript patterns and clean UI architecture.
- Familiarity with modern tooling (Vite, Netlify) and documentation best practices.
- Focus on UX polish, accessibility considerations, and maintainable styling.

## 🛣️ Roadmap
- ✅ Core dashboard, tasks, and settings flows
- ⏳ Cloud sync with multi-device support
- ⏳ Collaboration tools (assignees, comments, activity)
- ⏳ Advanced analytics exports (CSV, XLSX)

## 🙏 Acknowledgements
- Mentors and teammates at Algonive for guidance and feedback.
- Open-source maintainers whose libraries power TaskFlow.
- Internship peers for collaborative brainstorming and design reviews.

---

> 📌 **Tip:** Keep this README updated as you iterate. A detailed, well-structured README is a portfolio asset showcasing your professional process.