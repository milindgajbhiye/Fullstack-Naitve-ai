# Architecture & Design Decisions

This document explains the technical choices and architecture patterns used in this MVP.

## Frontend Architecture

### State Management: React Hooks (No Redux)

**Decision**: Use `useState` only, no Redux or Context API.

**Why**: 
- For this MVP, state is simple: current user, documents list, current document
- Props drilling is 2 levels deep max (App → Sidebar/Editor)
- Reduces dependency bloat and complexity
- App component owns all state, components are mostly functional
- Easier to reason about data flow

**State Structure** (in App.jsx):
```javascript
const [currentUser, setCurrentUser] = useState(...)        // User email
const [documents, setDocuments] = useState([])             // All user docs
const [currentDoc, setCurrentDoc] = useState(null)         // Opened document
const [loading, setLoading] = useState(false)              // Fetch status
const [error, setError] = useState('')                     // Error messages
```

### Component Structure

**App.jsx** - Container component
- Owns all state
- Handles API calls
- Passes state + callbacks to child components
- ~120 lines

**Sidebar.jsx** - Presentational component
- Displays document list
- Create & upload buttons
- User selector
- No internal state except UI forms
- ~100 lines

**Editor.jsx** - Presentational component
- React Quill rich text editor
- Share & delete controls
- Auto-save trigger
- Read-only for non-owners
- ~140 lines

### API Design Pattern

**File**: `client/src/utils/api.js`

Uses fetch API with simple wrapper functions:
```javascript
export async function createDocument(title, owner) {
  const res = await fetch('/api/docs', ...)
  if (!res.ok) throw new Error(...)
  return res.json()
}
```

**Why this pattern**:
- No axios/query library needed
- Simple error handling (throw & catch)
- Uniform return format
- Caller controls loading/error state

### Auto-Save Strategy

**Implementation**:
- Debounced to 1.5 seconds
- Uses `useRef` for timeout tracking
- Clears previous timer on new change
- Silently saves in background

**Code pattern** (in Editor.jsx):
```javascript
const saveTimeoutRef = useRef(null)

const handleContentChange = (value) => {
  setContent(value)
  if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
  saveTimeoutRef.current = setTimeout(() => {
    handleSave(title, value)
  }, 1500)
}
```

**Benefits**:
- Reduces database writes
- Prevents race conditions
- User gets visual feedback ("Saving..." / "Saved")
- No memory leaks (cleanup in dependencies)

### Styling: CSS Variables

**Why not Tailwind/Bootstrap**:
- Keep bundle small (~260 lines of pure CSS)
- All styling in one file = easy to modify
- No generated classes
- CSS variables for theming

**Variable system**:
```css
:root {
  --primary: #2563eb;
  --dialog: #e5e7eb;
  --text: #1f2937;
  /* ... */
}
```

---

## Backend Architecture

### Express Server

**File**: `server/src/server.js`

Simple, clean server setup:
```javascript
const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use('/api/docs', docsRouter)
```

**Why minimal**:
- We're not doing complex middleware chains
- CORS enabled for local frontend proxy
- Large limit (50MB) for document content
- Health check for debugging

### Database Architecture

**File**: `server/src/db/db.js`

**Pattern**: Promise wrappers around sqlite3 callbacks

```javascript
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ id: this.lastID })
    })
  })
}
```

**Why no ORM**:
- SQLite3 is simple enough (few tables)
- No complex relationships
- Direct SQL gives full control
- Faster execution
- Lower memory footprint

**Schema** (auto-created):
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,           -- UUID for distributed IDs
  title TEXT,
  content TEXT,                  -- HTML from Quill (can be large)
  owner TEXT,                    -- Email
  sharedWith TEXT,               -- Comma-separated emails (simple but works)
  createdAt TEXT,                -- ISO timestamp
  updatedAt TEXT
)
```

**Decision: Store sharedWith as comma-separated string**:
- ✅ Simple queries (LIKE operator)
- ✅ No JOIN tables needed
- ✅ Works for MVP scale
- ❌ Doesn't scale to thousands of users
- → For production, use normalized table

### API Design

**File**: `server/src/routes/docs.js`

**REST Endpoints**:
```
POST   /api/docs                 Create
GET    /api/docs?user=email      List
GET    /api/docs/:id             Get one
PUT    /api/docs/:id             Update
POST   /api/docs/:id/share       Share
DELETE /api/docs/:id             Delete
```

**Authorization Pattern**:
```javascript
// For updates: check if user is owner or recipient
const hasAccess = doc.owner === user || doc.sharedWith.includes(user)
if (!hasAccess) return res.status(403).json(...)

// For delete: owner only
if (doc.owner !== user) return res.status(403).json(...)
```

**Why simple string headers instead of JWT**:
- MVP doesn't have real authentication
- User email passed in request body/params
- Frontend can switch users without login
- Easy to test and debug
- → For production, add JWT middleware

### Status Codes

```javascript
201   // Created
400   // Bad request (validation)
403   // Forbidden (auth)
404   // Not found
500   // Server error
```

---

## Database Design Decisions

### Why SQLite, not MongoDB?

| Aspect | SQLite | MongoDB |
|--------|--------|---------|
| Setup | Zero - file based | Requires server |
| Schema | Fixed, enforced | Flexible |
| Scaling | Single file limit | Clusters |
| MVP fit | Perfect | Overkill |

### Why UUIDs for IDs?

```javascript
const id = randomUUID()  // from 'crypto'
```

**Benefits**:
- Globally unique (works with distributed systems)
- Cannot guess/enumerate IDs
- No auto-increment coordination
- Client can generate without server roundtrip

### Timestamps as ISO Strings

```javascript
const now = new Date().toISOString()  // "2026-03-31T12:34:56.789Z"
```

**Why**:
- Human readable
- No timezone confusion
- Easy database queries
- Standard format

---

## File Upload Design

**Current**: `<input type="file" accept=".txt" />`
**Flow**:
1. User selects .txt file
2. FileReader reads as text
3. Create new document
4. Pass content to editor

**Limitations**:
- Only .txt files
- No streaming (entire file in memory)
- → For production, add:
  - Progress bar
  - Format validation (virus scan)
  - Chunked upload
  - Multiple file types

---

## Security Considerations

**Current Implementation**:
⚠️ **Not production-ready** (MVP level)

**What's missing**:
- User authentication (no login)
- HTTPS (uses HTTP)
- Input validation (minimal)
- Rate limiting
- CSRF protection
- SQL injection risk (low with parameterized queries)

**What to add for production**:
1. **Authentication**: JWT with user registration/login
2. **HTTPS**: Required for production
3. **Input validation**: Slug titles, sanitize content
4. **Rate limiting**: Prevent abuse (e.g., express-rate-limit)
5. **CORS**: Lock to production domain
6. **Content Security Policy**: Prevent XSS
7. **SQL injection**: Already using parameterized queries ✅
8. **XSRF tokens**: For state-changing requests

---

## Performance Considerations

### Auto-Save Debouncing

```
User types → 1.5s debounce → Save
User types again → Reset timer → 1.5s debounce → Save
```

**Result**: Max 1 save per 1.5 seconds (vs. 100+ per second otherwise)

### API Limits

```javascript
app.use(express.json({ limit: '50mb' }))
```

**Allows**: Large documents (50MB is plenty for text)
**Prevents**: Huge multimedia files

### Database Indexing

**Current**: None needed (< 1000 documents = instant queries)
**Future**: Add index on `(owner, updatedAt)` for faster listing

---

## Testing Strategy

### Manual Testing Checklist

- [x] Create document as user1
- [x] Edit and verify auto-save
- [x] Share with user2
- [x] Switch to user2 and verify doc appears
- [x] user2 cannot delete (shares read-only)
- [x] Upload .txt file
- [x] Verify persistence (refresh page)
- [x] Error handling (bad emails, network)

### To Add Unit Tests

```bash
npm install --save-dev vitest @testing-library/react
```

Test files:
- `client/src/components/__tests__/Editor.test.jsx`
- `server/src/routes/__tests__/docs.test.js`

---

## Deployment Considerations

### Frontend (Vite)
```bash
npm run build
# Creates dist/ folder with optimized files
# Deploy to: Vercel, Netlify, AWS S3 + CloudFront
```

### Backend (Node)
```bash
# Keep as is or containerize:
docker build -t doc-editor .
docker run -p 5000:5000 doc-editor
```

### Database (SQLite)
**Issue**: SQLite is file-based (loses data on restart in containers)
**Solution**: Use PostgreSQL or MongoDB for production

---

## Code Organization Philosophy

**Emphasis**:
1. **Readability** > Cleverness
2. **Simplicity** > Features
3. **Direct** > Abstracted
4. **Explicit** > Implicit

**Example**:
```javascript
// ✅ Direct & explicit
const res = await fetch('/api/docs')
if (!res.ok) throw new Error('Failed')

// ❌ Abstracted but magic
const res = await apiClient.getDocs() // What endpoint? How to debug?
```

---

## Why This Architecture Works for MVP

1. **React Hooks**: No overkill state management
2. **No ORM**: Direct SQL for clarity
3. **Single CSS file**: Easy to modify
4. **No auth middleware**: Focus on core features
5. **SQLite**: Zero ops
6. **Fetch API**: Browser native
7. **Quill**: Rich text without complexity
8. **Promise-based DB**: Modern async/await

---

## When to Refactor

**Scale to 100+ users**:
- Add authentication (JWT)
- Migrate SQLite → PostgreSQL
- Add WebSocket for real-time collaboration
- Implement pagination (documents list)

**Scale to 1000+ users**:
- Add caching layer (Redis)
- Database replication
- CDN for static assets
- Background jobs (Bee-Queue)

---

This MVP prioritizes **working code** over **perfect patterns**.
Each design decision had trade-offs analyzed.

- Questions? Check code comments.
- Want to extend? Start with README.md suggestions.

---

Last updated: 2026-03-31
