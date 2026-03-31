# Architecture Note

## What Was Prioritized
- Deliver a working full-stack collaborative editor slice with strong core flows:
  - Document CRUD
  - Rich-text editing
  - Sharing between users
  - File import (.txt)
  - Persistence with SQLite
- Improve perceived product quality through premium frontend UX and motion design while keeping backend scope intentionally lean

## System Overview
- Frontend: React + Vite + React Quill + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Persistence: SQLite file database (`server/docs.db`)

## Key Decisions
- Kept simulated-user model (email switch) to focus time on collaboration behavior instead of full authentication
- Used simple ownership/shared access checks in API for clear permission boundaries
- Stored rich text as HTML to preserve formatting from the editor
- Avoided ORM and heavy backend abstractions to keep MVP maintainable and easy to audit

## Tradeoffs
- Chosen simplicity over enterprise auth/security hardening
- Chosen manual+build verification over full automated test harness (test still pending)
- Chosen local SQLite for speed of delivery over hosted DB complexity

## If Given 2-4 More Hours
1. Add one meaningful automated test suite for API share/update flows
2. Deploy frontend/backend and wire final live URL
3. Add submission video and final reviewer proof assets
