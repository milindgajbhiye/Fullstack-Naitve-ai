# Ajaia LLC - AI-Native Full Stack Developer Assignment Submission

**Candidate**: Milind Gajbhiye  
**Email**: gajbhiyemilind11@gmail.com  
**Submission Date**: March 31, 2026

---

## ✅ Deliverables Included

### 1. Source Code
- **Location**: `/client` and `/server` directories
- **Frontend**: React 18 + Vite + React Quill + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + SQLite3
- **Database**: Auto-created `server/docs.db` on first run

### 2. README.md
- Complete local setup and run instructions
- Project structure overview
- Test scenarios with step-by-step walkthroughs
- Prerequisites and dependencies listed

### 3. Architecture Note
- **File**: `ARCHITECTURE_NOTE.md`
- Explains prioritization, system overview, and key decisions
- Documents tradeoffs and time-constrained choices
- Includes "if given 2-4 more hours" roadmap

### 4. AI Workflow Note
- **File**: `AI_WORKFLOW_NOTE.md`
- Which AI tools were used (GitHub Copilot)
- Where AI materially sped up work (scaffolding, component polish, documentation)
- What AI output was changed/rejected (email integration, basic UI)
- Verification approach (syntax checks, manual E2E tests, API validation)

### 5. Live Product URL
- **File**: `LIVE_DEPLOYMENT_URL.txt`
- Deployment instructions included
- Can run locally with `npm run dev` (frontend: 3000, backend: 5000)

### 6. Walkthrough Video URL
- **File**: `WALKTHROUGH_VIDEO_URL.txt`
- Placeholder for 3-5 minute video link
- To be filled with unlisted Loom or YouTube link

---

## ✅ Core Requirements Met

### Task 1: Document Creation and Editing
- ✅ Create new documents
- ✅ Rename documents (edit title)
- ✅ Edit document content in browser with rich-text formatting:
  - **Bold**, *Italic*, <u>Underline</u>, Headings, Lists
  - Powered by React Quill rich editor
- ✅ Save automatically (1.5s debounce)
- ✅ Reopen documents persistent across sessions
- ✅ Full-featured editor with toolbar

### Task 2: File Upload
- ✅ Upload `.txt` files
- ✅ Content imported as new document
- ✅ Upload button ("📁 Upload .txt") visible in editor
- ✅ Supported file type clearly stated in UI

### Task 3: Sharing
- ✅ Simple sharing model with document owner
- ✅ Grant access to another user via email input
- ✅ Shared documents appear in "Shared With Me" section
- ✅ Clear ownership distinction in UI:
  - "My Documents" = owned
  - "Shared With Me" = shared access
- ✅ Shared users can read and edit but NOT delete
- ✅ Access control validated via API

### Task 4: Persistence
- ✅ Documents remain available after refresh
- ✅ Formatting preserved (stored as HTML from editor)
- ✅ Sharing data persisted in database
- ✅ SQLite file-based storage in `server/docs.db`

### Task 5: Product and Engineering Quality
- ✅ Clear setup and run instructions (README.md)
- ✅ Local deployment working (frontend: localhost:3000, backend: localhost:5000)
- ✅ Basic validation and error handling:
  - Input validation on document title
  - Share recipient validation
  - Error messages displayed to user
- ✅ **At least one meaningful automated test** (`server/tests/docs.integration.test.js`)
  - Tests share flow and access control
  - Validates that shared user **cannot delete** own documents
  - **Status**: PASSING (/server/npm test)
- ✅ Short architecture note (ARCHITECTURE_NOTE.md)

### Task 6: AI-Native Workflow Note
- ✅ Included (AI_WORKFLOW_NOTE.md)
- Documents practical AI usage without sacrificing engineering standards

### Task 7: Walkthrough Video
- ⏳ Placeholder ready (WALKTHROUGH_VIDEO_URL.txt)
- Will include 3-5 minute video covering:
  - Main user flow (create → edit → share)
  - End-to-end functionality
  - Intentional scope cuts
  - Key implementation decisions
  - AI support in workflow

---

## 📋 What's Working End-to-End

| Feature | Status | Notes |
|---------|--------|-------|
| Create Document | ✅ Working | Auto-generates ID, title is editable |
| Edit Document | ✅ Working | Rich text with bold/italic/underline/headings/lists |
| Auto-Save | ✅ Working | Triggers after 1.5s inactivity, shows "Saved" indicator |
| Delete Document | ✅ Working | Owner only, soft delete (marks as deleted) |
| Rename Document | ✅ Working | Edit title inline, auto-saves |
| Upload .txt | ✅ Working | Creates new document from file content |
| Share Document | ✅ Working | Recipient can view and edit |
| Share Access Control | ✅ Working | Shared user cannot delete (403 Forbidden) |
| User Switching | ✅ Working | Dropdown to simulate different users |
| Persistence | ✅ Working | SQLite stores all data; survives refresh |
| Automated Test | ✅ Working | Integration test for share flow passes |

---

## ⏳ What's Incomplete / Deferred

| Item | Status | Details |
|------|--------|---------|
| Live Public Deployment URL | ⏳ Pending | Need to push to Vercel/Heroku/Railway; local runs on localhost:3000 + :5000 |


---

## 🛣️ If Given 2-4 More Hours (Next Steps)

As documented in ARCHITECTURE_NOTE.md:

1. **Deploy frontend and backend** to public URLs (Vercel for React, Railway/Render for Node)
2. **Wire backend environment variables** (API_URL in frontend)
3. **Record and upload walkthrough video** to Loom/YouTube
4. **Optional stretch features**:
   - Real-time collaboration indicators
   - Commenting/suggestion mode
   - Document version history
   - Export to PDF/Markdown
   - Role-based sharing permissions (e.g., "Can view", "Can edit")

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 16+ and npm

### Backend (Terminal 1)
```bash
cd server
npm install
npm run dev
```
Server: http://localhost:5000

### Frontend (Terminal 2)
```bash
cd client
npm install
npm run dev
```
Frontend: http://localhost:3000

### Run Tests
```bash
cd server
npm test
```

Example test output:
```
✓ share flow grants collaborator access but not delete rights (490ms)
```

---

## 👤 Seeded Test Accounts

Simulated users (no auth signup required; email is switchable in UI):
- `user1@gmail.com` (default)
- `user2@gmail.com`
- `user3@gmail.com`

### Test Share Flow
1. Create document as user1
2. Share with user2
3. Switch to user2 → document appears in "Shared With Me"
4. user2 can edit but not delete

---

## 📁 Project Structure

```
.
├── server/
│   ├── src/
│   │   ├── db.js              (SQLite setup & queries)
│   │   ├── server.js          (Express app, made testable)
│   │   └── routes/
│   │       └── docs.js        (CRUD + share endpoints)
│   ├── tests/
│   │   └── docs.integration.test.js   (Share flow test)
│   ├── package.json
│   └── docs.db                (Auto-created on first run)
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    (Doc list + controls)
│   │   │   ├── Editor.jsx     (Rich text editor)
│   │   │   ├── Layout.jsx     (Global layout)
│   │   │   ├── ui/
│   │   │   │   ├── MotionButton.jsx      (Magnetic ripple button)
│   │   │   │   ├── CursorGlow.jsx        (Cursor follower effect)
│   │   │   │   ├── CommandPalette.jsx    (⌘K quick switcher)
│   │   │   │   └── AIAssistantPanel.jsx  (Typing animation)
│   │   ├── App.jsx            (State orchestration)
│   │   ├── index.css          (Animations, Tailwind)
│   │   └── main.jsx           (Entry point)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── README.md                    (Local setup guide)
├── ARCHITECTURE_NOTE.md         (Design decisions)
├── AI_WORKFLOW_NOTE.md          (AI tool usage)
├── SUBMISSION.md                (This file)
├── LIVE_DEPLOYMENT_URL.txt      (Deployment link)
└── WALKTHROUGH_VIDEO_URL.txt    (Video link)
```

---

## 🎯 Engineering Standards Applied

- ✅ **Code clarity**: Well-organized components, clear separation of concerns
- ✅ **Maintainability**: Modular structure, reusable UI primitives
- ✅ **Error handling**: User-visible error messages, graceful fallbacks
- ✅ **Testing**: Integration test validates core share flow
- ✅ **Documentation**: README, architecture note, AI workflow note, this submission file
- ✅ **Verification**: Syntax checks, manual E2E workflows, API validation

---

## 📝 Notes

- **Time spent**: ~4-5 hours (within 4-6 hour timebox)
- **Scope decisions**: Chose depth in core CRUD + sharing over enterprise auth/real-time collab
- **AI usage**: GitHub Copilot for scaffolding, UI polish, and docs (not outsourcing judgment)
- **Database**: SQLite chosen for speed of delivery; no external DB service required
- **Deployment**: Ready for Vercel (frontend) + Railway/Render (backend)

---

**Status**: ✅ 5/7 requirements complete; 2/7 pending (deployment URL + video)
