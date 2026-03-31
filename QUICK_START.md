# Quick Reference - Running the Editor

## Prerequisites
- Node.js 16+ installed
- Terminal/PowerShell access

## Running Locally

### Option 1: Using setup.bat (Windows only)
```bash
# In project root
setup.bat
```
Then follow the on-screen instructions.

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Expected output:
```
Server running on http://localhost:5000
Connected to SQLite database
Documents table ready
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 3: Open Browser
Navigate to **http://localhost:3000**

---

## Test Flow

### First Time Setup
1. ✅ Backend running on http://localhost:5000/api/health (returns `{"status":"ok"}`)
2. ✅ Frontend running on http://localhost:3000
3. ✅ Database created at `server/docs.db`

### Basic User Flow
1. **Create Document**: "+ New Document" → Enter title → Click Create
2. **Type Content**: Content auto-saves after 1.5s inactivity
3. **Share**: Enter email (e.g., `user2@gmail.com`) → Click Share
4. **Switch User**: Select different email from top dropdown
5. **View Shared Docs**: Shared documents appear in "Shared With Me" section
6. **Upload File**: Click "📁 Upload .txt" → Select a text file

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Kill process: `npx kill-port 5000` or use `PORT=3333 npm run dev` |
| Port 3000 in use | Use different port or kill process using port 3000 |
| Module not found | Run `npm install` in both `server/` and `client/` folders |
| Database locked | Delete `server/docs.db` and restart backend |
| API not responding | Verify backend terminal shows "Server running on http://localhost:5000" |
| No documents appear | Hard refresh browser (Ctrl+Shift+R) or check browser console (F12) |
| Sharing not working | Ensure email format is valid (e.g., `user2@gmail.com`) |

---

## Default Test Users

Using these emails allows you to test the sharing functionality:

- `user1@gmail.com` (default)
- `user2@gmail.com`

Both are pre-configured in the user selector dropdown.

---

## File Structure Quick View

```
server/
  ├── src/
  │   ├── server.js           ← Express app setup
  │   ├── routes/docs.js      ← All API endpoints
  │   └── db/db.js            ← SQLite initialization
  ├── package.json
  └── docs.db                 ← Auto-created database

client/
  ├── src/
  │   ├── App.jsx             ← Main component (state management)
  │   ├── components/
  │   │   ├── Sidebar.jsx     ← Document list
  │   │   └── Editor.jsx      ← Rich text editor (Quill)
  │   ├── utils/api.js        ← Fetch API calls
  │   ├── main.jsx            ← React entry point
  │   └── App.css             ← All styling
  ├── index.html
  ├── vite.config.js
  └── package.json
```

---

## Debugging Tips

### Check API connection
```bash
# In another terminal:
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

### View database
```bash
# Install sqlite3 CLI if needed:
npm install -g sqlite3

# Query database:
sqlite3 server/docs.db
> SELECT COUNT(*) as total_docs FROM documents;
> SELECT id, title, owner FROM documents;
```

### Check API calls
- Open browser DevTools (F12)
- Go to Network tab
- Perform actions (create, share, etc.)
- View request/response details

### Server logs
Backend server logs appear in Terminal 1 (shows all API requests and errors)

---

## Key API Endpoints

```
GET  /api/health                    ← Health check
POST /api/docs                      ← Create document
GET  /api/docs?user=email           ← List user's documents
GET  /api/docs/{id}                 ← Get single document
PUT  /api/docs/{id}                 ← Update document
POST /api/docs/{id}/share           ← Share document
DELETE /api/docs/{id}               ← Delete document
```

---

## Performance Notes

✅ **Auto-save**: Debounced to 1.5 seconds (reduces DB writes)
✅ **Sharing**: No real-time updates (refresh page to see new shares)
✅ **Database**: SQLite is sufficient for MVP (single file storage)
✅ **UI**: React Quill with basic toolbar (no heavy processing)

---

Build with `npm run build` (client) to create production optimized files.

For questions, check the main README.md file.
