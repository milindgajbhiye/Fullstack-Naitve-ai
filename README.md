# Collaborative Document Editor MVP

A clean, production-like full-stack document editor with real-time sharing, auto-save, and file upload capabilities.

## Tech Stack

- **Frontend**: React 18 + Vite + React Quill
- **Backend**: Node.js + Express
- **Database**: SQLite 3
- **Features**: Auto-save, document sharing, .txt file upload

## Project Structure

```
/
├── server/
│   ├── src/
│   │   ├── db/
│   │   │   └── db.js           (Database setup & queries)
│   │   ├── routes/
│   │   │   └── docs.js         (API endpoints)
│   │   └── server.js           (Express server)
│   ├── package.json
│   └── docs.db                 (Auto-created on first run)
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     (Document list & controls)
│   │   │   └── Editor.jsx      (Rich text editor)
│   │   ├── utils/
│   │   │   └── api.js          (API client)
│   │   ├── App.jsx             (Main app component)
│   │   ├── App.css             (Styling)
│   │   └── main.jsx            (React entry point)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation & Running

#### 1. Backend Setup

```bash
cd server
npm install
npm run dev
```

Server runs on **http://localhost:5000**

#### 2. Frontend Setup (new terminal)

```bash
cd client
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

### Usage

1. **Open browser**: http://localhost:3000
2. **You start as**: `user1@gmail.com` (configurable in sidebar)
3. **Create document**: Click "+ New Document" button
4. **Type & auto-save**: Content auto-saves after 1.5 seconds of inactivity
5. **Upload file**: Click "📁 Upload .txt" to import text files
6. **Share document**: 
   - Enter recipient email (e.g., `user2@gmail.com`)
   - Click "Share"
   - Document appears in their "Shared With Me" section
7. **Switch user**: Select different email from dropdown to test sharing

## Test Scenarios

### Scenario 1: Create & Edit Document
1. Click "+ New Document"
2. Enter title, press Create
3. Type content → auto-saves (watch "Saved" indicator)
4. Change title → auto-saves

### Scenario 2: Share Document
1. Create a document as user1@gmail.com
2. Enter `user2@gmail.com` in share field
3. Click Share
4. Switch user to user2@gmail.com
5. Document appears in "Shared With Me" section
6. user2 can view but NOT delete

### Scenario 3: Upload File
1. Click "📁 Upload .txt"
2. Select a .txt file
3. Creates new document with file contents

### Scenario 4: File Switching
1. Switch between users via dropdown
2. Each user sees their own docs + shared docs
3. Shared docs show owner name

## API Endpoints

### Documents

- `POST /api/docs` - Create new document
  ```json
  { "title": "My Doc", "owner": "user@email.com" }
  ```

- `GET /api/docs?user=email@example.com` - Fetch user's docs (owned + shared)

- `GET /api/docs/:id` - Get single document

- `PUT /api/docs/:id` - Update title/content
  ```json
  { "title": "New Title", "content": "...", "user": "user@email.com" }
  ```

- `POST /api/docs/:id/share` - Share with another user
  ```json
  { "shareWith": "other@email.com", "user": "owner@email.com" }
  ```

- `DELETE /api/docs/:id` - Delete document (owner only)
  ```json
  { "user": "owner@email.com" }
  ```

## Database Schema

### documents table

```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,                    -- UUID
  title TEXT NOT NULL,
  content TEXT DEFAULT '',                -- HTML from Quill
  owner TEXT NOT NULL,                    -- Owner email
  sharedWith TEXT DEFAULT '',             -- Comma-separated emails
  createdAt TEXT NOT NULL,                -- ISO timestamp
  updatedAt TEXT NOT NULL                 -- ISO timestamp
)
```

## Key Features

✅ **Auto-save**: Documents auto-save 1.5s after you stop typing
✅ **Rich text**: Headings, bold, italic, lists, quotes, links
✅ **Document sharing**: Share docs with other users via email
✅ **File upload**: Import .txt files as new documents
✅ **Clean UI**: Simple, functional design (no heavy styling)
✅ **User switching**: Simulate multiple users for testing
✅ **Persistent**: All data stored in SQLite (survives refresh)
✅ **Error handling**: Basic error messages & feedback

## Development Notes

### No Redux - Clean React Hooks
- Single `useState` for documents, current doc, user
- Props for data flow
- Callbacks for updates

### Database
- Using `sqlite3` directly (no ORM)
- Promises for DB queries
- JSON stored as comma-separated emails in `sharedWith`

### Styling
- CSS custom properties (CSS variables)
- Mobile-ready
- React Quill's default theme (quill.snow.css)

### Error Handling
- Basic try/catch on API calls
- User feedback via error bar
- Validation on inputs

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` in both server and client folders
- Ensure Node.js 16+ installed

### API not responding
- Check if backend is running: `curl http://localhost:5000/api/health`
- Backend must run before frontend

### Database locked error
- Close other instances
- Delete `server/docs.db` and restart server

### Documents not appearing
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for API errors (F12)
- Ensure correct user email in dropdown

## Next Steps for Production

- Add authentication (JWT)
- Add real-time collaboration (WebSockets)
- Add document trash/recovery
- Add version history
- Add Markdown support
- Add permissions (view-only, edit, etc.)
- Add database migration system
- Add comprehensive error logging

---

Built with ❤️ for collaborative editing.
