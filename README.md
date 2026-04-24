# SmartFlow ⚡

> AI-powered task and note manager for modern teams and individuals.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-orange?style=for-the-badge)

---

## 🚀 Live Demo

> Coming soon — [https://smartflow.vercel.app](https://smartflow.vercel.app)

---

## ✨ Features

- ✅ **Kanban Board** — Drag-and-drop task management with multiple boards
- ✅ **Rich Text Notes** — Tiptap-powered editor with formatting toolbar
- ✅ **AI Summarizer** — Instantly summarize notes using Claude AI
- ✅ **AI Task Prioritizer** — Get AI-powered priority recommendations
- ✅ **AI Assistant** — Chat, brainstorm, and generate tasks with AI
- ✅ **Streaming AI Responses** — Real-time word-by-word AI responses
- ✅ **Google OAuth** — Secure authentication with NextAuth.js v5
- ✅ **Auto-save Notes** — Debounced saving while you type
- ✅ **Pin Notes** — Keep important notes at the top
- ✅ **Priority System** — LOW, MEDIUM, HIGH, URGENT with color badges
- ✅ **Due Dates** — Track deadlines with overdue indicators
- ✅ **Tags** — Organize tasks and notes with tags
- ✅ **Responsive Design** — Works on desktop, tablet, and mobile
- ✅ **Dark Mode Ready** — Built with CSS variables for theming

---

## 📸 Screenshots

> Screenshots coming soon

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js v5 + Google OAuth |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Editor | Tiptap |
| DnD | @hello-pangea/dnd |
| State | Zustand |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| Validation | Zod |

---

## 📁 Folder Structure

```
smartflow/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── boards/route.ts
│   │   ├── boards/[id]/route.ts
│   │   ├── tasks/route.ts
│   │   ├── tasks/[id]/route.ts
│   │   ├── notes/route.ts
│   │   ├── notes/[id]/route.ts
│   │   ├── ai/summarize/route.ts
│   │   ├── ai/prioritize/route.ts
│   │   └── ai/generate/route.ts
│   ├── (auth)/login/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── tasks/page.tsx
│       ├── tasks/[boardId]/page.tsx
│       ├── notes/page.tsx
│       ├── notes/[id]/page.tsx
│       ├── ai/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/ (Sidebar, Header, MobileNav)
│   ├── tasks/ (KanbanBoard, TaskCard, etc.)
│   ├── notes/ (NoteEditor, TiptapEditor, etc.)
│   ├── ai/ (AIAssistant, etc.)
│   └── shared/ (LoadingSpinner, EmptyState, etc.)
├── hooks/ (useTasks, useNotes, useAI)
├── lib/ (prisma, auth, claude, utils)
├── store/ (useUIStore)
├── types/ (index.ts)
└── prisma/ (schema.prisma)
```

---

## 🏁 Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))
- Google OAuth credentials ([console.cloud.google.com](https://console.cloud.google.com))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/smartflow.git
cd smartflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/smartflow
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/*` | NextAuth.js managed routes |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get all boards for logged-in user |
| POST | `/api/boards` | Create board (auto-creates 3 default columns) |
| GET | `/api/boards/:id` | Get board with columns and tasks |
| PUT | `/api/boards/:id` | Update board name |
| DELETE | `/api/boards/:id` | Delete board and all tasks |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks?boardId=` | Get tasks for a board |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes (pinned first) |
| POST | `/api/notes` | Create note |
| GET | `/api/notes/:id` | Get single note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/summarize` | Summarize note content |
| POST | `/api/ai/prioritize` | AI task prioritization |
| POST | `/api/ai/generate` | AI chat (streaming) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Next.js, Prisma, and Claude AI.
