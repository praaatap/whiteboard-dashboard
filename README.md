<div align="center">
  <img src="./public/icon.png" alt="CollabBoard" width="120"/>
  
  # 🚀 CollabBoard
  **Real-time Collaborative Whiteboard for Modern Teams**
  
  Infinite canvas with live cursors, video calls, chat, and smart workspace management. Built for seamless team collaboration.
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Prisma](https://img.shields.io/badge/Prisma-5.x-purple?logo=prisma&logoColor=white)](https://prisma.io)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-green?logo=postgresql&logoColor=white)](https://postgresql.org)
  [![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

### ScreenShots
<img width="2535" height="1356" alt="image" src="https://github.com/user-attachments/assets/96465ce5-17ba-44c9-b0b7-409528c11d88" />

<img width="2514" height="1359" alt="image" src="https://github.com/user-attachments/assets/43e46b28-28dd-4e86-9465-e54625585220" />



<img width="2528" height="1338" alt="image" src="https://github.com/user-attachments/assets/b7cdfdfe-520e-41b0-8196-91ffb68f1023" />

<img width="2521" height="1333" alt="image" src="https://github.com/user-attachments/assets/bb5b34bd-18f5-4927-bec9-94c1d3ca2829" />

<img width="2537" height="1377" alt="image" src="https://github.com/user-attachments/assets/8c76b50a-c58e-4768-baa6-48869fc7a1ec" />


<img width="2551" height="1359" alt="image" src="https://github.com/user-attachments/assets/a44ae27c-1753-43a1-b60e-c84ab419ad22" />


<img width="2507" height="1263" alt="Screenshot 2025-11-30 130507" src="https://github.com/user-attachments/assets/3c1ce2a4-b36e-492d-9f89-2b05e8e864b0" />


<img width="2555" height="1349" alt="Screenshot 2025-11-30 130630" src="https://github.com/user-attachments/assets/8780b223-137e-4fa8-b44f-b84aad9291b5" />



## ✨ Features

### 🎨 **Infinite Canvas**
- **Live Multiplayer Cursors** - See exactly where teammates are working [memory:1]
- **20+ Drawing Tools** - Rectangle, Circle, Arrows, Freehand, Text, Sticky Notes, Charts
- **Media Support** - Drag & drop images, videos, PDFs directly on canvas
- **Smooth Zoom/Pan** - Infinite navigation (25%-400% zoom)
- **Grid & Snapping** - Perfect alignment for diagrams and layouts

### 🤝 **Real-time Collaboration**
- **WebRTC Video/Voice** - Built-in conferencing (up to 20 participants)
- **Live Chat** - Threaded messages with @mentions and reactions
- **Activity Feed** - Real-time notifications of joins, edits, comments
- **Presence Indicators** - Online status, typing indicators, user avatars
- **Conflict Resolution** - Smart merging for simultaneous edits

### 🗂️ **Smart Workspace**
📁 My Workspace
├── 📋 Kanban Boards
├── 🧠 Brainstorm Sessions
├── 📊 Flowcharts & Diagrams
└── 🎯 Project Roadmaps



text
- **Folder Organization** - Drag & drop hierarchy
- **20+ Templates** - Ready-to-use designs for every use case
- **Role-based Permissions** - Owner, Editor, Viewer, Guest
- **Version History** - Full undo/redo + time-travel snapshots

### 📱 **Cross-platform**
- **Mobile-first Design** - Perfect on iOS, Android, Desktop [memory:1]
- **PWA Support** - Installable, offline-first experience
- **Touch-optimized** - Native drawing on tablets/phones

## 🛠️ Tech Stack

Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
Real-time: WebSockets (ws) + WebRTC (Simple-Peer)
Backend: Node.js + Express.js (TypeScript)
Database: PostgreSQL + Prisma ORM
Auth: JWT + NextAuth.js compatible
Deployment: Vercel / Docker / Railway

text

## 🚀 Quick Start

### Prerequisites
Node.js 18+ # nvm install 18
PostgreSQL 15+ # Local or Neon/Supabase
pnpm / yarn / npm # Package manager
Git # Version control

text

### 1. Clone & Install
git clone https://github.com/pratapcodes/collab-board.git
cd collab-board
pnpm install # or yarn install / npm install

text

### 2. Environment Setup
cp .env.example .env

text
**`.env`** (Update with your values):
Database (Neon/Supabase/Supabase)
DATABASE_URL="postgresql://user:pass@host:5432/collabboard?schema=public"

JWT Auth
JWT_SECRET="your-64-char-super-secure-random-secret-key-here"

App URLs
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_WS_URL="ws://localhost:5000"

Optional: Video service
TWILIO_SID=
TWILIO_TOKEN=

text

### 3. Database Setup
npx prisma generate
npx prisma db push
npx prisma studio # Optional: Open DB explorer

text

### 4. Development
Backend (separate terminal)
cd backend
npm run dev # http://localhost:5000

Frontend
npm run dev # http://localhost:3000

text

**✅ Done! Open http://localhost:3000 and start collaborating!**

## 🎹 Keyboard Shortcuts

| Key            | Action                  |
|----------------|------------------------|
| **V**          | Select/Move Tool       |
| **H** / **Space** | Hand/Pan Tool       |
| **R**          | Rectangle              |
| **O**          | Circle/Oval            |
| **A**          | Arrow                  |
| **L**          | Line                   |
| **P**          | Pencil/Freehand        |
| **T**          | Text                   |
| **S**          | Sticky Note            |
| **Ctrl+Z**     | Undo                   |
| **Ctrl+Y**     | Redo                   |
| **Ctrl+D**     | Duplicate              |
| **Del**        | Delete Selected        |
| **?**          | Show Shortcuts         |

## 🗄️ Database Schema

model Dashboard {
id String @id @default(uuid())
name String
slug String @unique
elements Json[] // Canvas data (shapes, positions, colors)
folderId String?
ownerId String
isPublic Boolean @default(false)
version Int @default(1)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model WhiteboardElement {
id String @id @default(uuid())
dashboardId String
type String // "rect", "circle", "text", etc.
data Json // {x, y, width, color, content}
createdBy String
dashboard Dashboard @relation(fields: [dashboardId], references: [id])
}

text

**Full schema**: [prisma/schema.prisma](prisma/schema.prisma)

## 📱 Screenshots

| Dashboard Overview | Infinite Canvas | Real-time Collaboration |
|-------------------|----------------|-------------------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Canvas](./screenshots/canvas.png) | ![Collaboration](./screenshots/collaboration.png) |

| Video Chat | Mobile View |
|------------|-------------|
| ![Video](./screenshots/video.png) | ![Mobile](./screenshots/mobile.png) |

## 🌐 Deployment

### Vercel (Frontend)
npm run build
vercel --prod

text

### Railway/Docker (Fullstack)
docker-compose.yml available
docker-compose up -d

text

### Neon + Vercel (Recommended)
1. Create Neon PostgreSQL database
2. Update `DATABASE_URL`
3. Deploy frontend to Vercel
4. Backend to Railway

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-tool`)
3. Commit changes (`git commit -m 'Add amazing tool'`)
4. Push & PR

**See [CONTRIBUTING.md](CONTRIBUTING.md) for details.**

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Prisma not found` | `npx prisma generate` |
| `WebSocket connection failed` | Check `NEXT_PUBLIC_WS_URL` |
| `Video not working` | Allow camera/microphone |
| `Slow performance` | Enable hardware acceleration |

## 📄 License

This project is [MIT](LICENSE) licensed - free for personal & commercial use.

<div align="center">
  <strong>Built with ❤️ by Pratap Singh</strong><br>
  <a href="https://twitter.com/pratapcodes">Twitter</a> | 
  <a href="https://github.com/pratapcodes">GitHub</a> | 
  <a href="mailto:hello@pratap.codes">Contact</a>
</div>
