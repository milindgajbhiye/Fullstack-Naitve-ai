import express from 'express';
import { dbRun, dbGet, dbAll } from '../db/db.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// Validation helpers
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const sanitizeTitle = (title) => (title || 'Untitled').substring(0, 200).trim();
const sanitizeEmail = (email) => email.toLowerCase().trim();

// Create new document
router.post('/', async (req, res) => {
  try {
    const { title, owner } = req.body;
    
    if (!owner || !isValidEmail(owner)) {
      return res.status(400).json({ error: 'Valid owner email required' });
    }

    if (title && typeof title !== 'string') {
      return res.status(400).json({ error: 'Title must be text' });
    }

    const id = randomUUID();
    const now = new Date().toISOString();
    const finalTitle = sanitizeTitle(title);
    
    await dbRun(
      `INSERT INTO documents (id, title, content, owner, sharedWith, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, finalTitle, '', owner, '', now, now]
    );

    res.status(201).json({ 
      id, 
      title: finalTitle, 
      content: '', 
      owner, 
      sharedWith: [], 
      createdAt: now,
      updatedAt: now 
    });
  } catch (error) {
    console.error('[API:POST /]', error.message);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Get user documents (owned + shared)
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    
    if (!user || !isValidEmail(user)) {
      return res.status(400).json({ error: 'Valid user email required' });
    }

    const docs = await dbAll(
      `SELECT * FROM documents 
       WHERE owner = ? OR sharedWith LIKE ? 
       ORDER BY updatedAt DESC LIMIT 100`,
      [user, `%${user}%`]
    );

    const formatted = docs.map(doc => ({
      ...doc,
      sharedWith: doc.sharedWith ? doc.sharedWith.split(',').filter(Boolean) : [],
      isOwner: doc.owner === user
    }));

    res.json(formatted);
  } catch (error) {
    console.error('[API:GET /]', error.message);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get single document
router.get('/:id', async (req, res) => {
  try {
    const doc = await dbGet('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      ...doc,
      sharedWith: doc.sharedWith ? doc.sharedWith.split(',').filter(Boolean) : []
    });
  } catch (error) {
    console.error('[API:GET /:id]', error.message);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Update document (title and/or content)
router.put('/:id', async (req, res) => {
  try {
    const { title, content, user } = req.body;
    const id = req.params.id;

    if (!user || !isValidEmail(user)) {
      return res.status(400).json({ error: 'Valid user email required' });
    }

    const doc = await dbGet('SELECT * FROM documents WHERE id = ?', [id]);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if user is owner or shared recipient
    const hasAccess = doc.owner === user || (doc.sharedWith && doc.sharedWith.includes(user));
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const now = new Date().toISOString();
    const updateTitle = title !== undefined ? sanitizeTitle(title) : doc.title;
    const updateContent = content !== undefined ? String(content).substring(0, 1000000) : doc.content;

    await dbRun(
      'UPDATE documents SET title = ?, content = ?, updatedAt = ? WHERE id = ?',
      [updateTitle, updateContent, now, id]
    );

    res.json({ success: true, updatedAt: now });
  } catch (error) {
    console.error('[API:PUT /:id]', error.message);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Share document
router.post('/:id/share', async (req, res) => {
  try {
    const { user, shareWith } = req.body;
    const id = req.params.id;

    if (!user || !isValidEmail(user)) {
      return res.status(400).json({ error: 'Valid user email required' });
    }

    if (!shareWith || !isValidEmail(shareWith)) {
      return res.status(400).json({ error: 'Valid email required to share' });
    }

    if (user === shareWith) {
      return res.status(400).json({ error: 'Cannot share with yourself' });
    }

    const doc = await dbGet('SELECT * FROM documents WHERE id = ?', [id]);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (doc.owner !== user) {
      return res.status(403).json({ error: 'Only owner can share' });
    }

    const normalizedEmail = sanitizeEmail(shareWith);
    const currentShared = doc.sharedWith ? doc.sharedWith.split(',').filter(Boolean) : [];
    
    if (!currentShared.includes(normalizedEmail)) {
      currentShared.push(normalizedEmail);
    }

    const updated = currentShared.join(',');
    const now = new Date().toISOString();

    await dbRun(
      'UPDATE documents SET sharedWith = ?, updatedAt = ? WHERE id = ?',
      [updated, now, id]
    );

    res.json({ success: true, sharedWith: currentShared, updatedAt: now });
  } catch (error) {
    console.error('[API:POST /:id/share]', error.message);
    res.status(500).json({ error: 'Failed to share document' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { user } = req.body;
    const id = req.params.id;

    if (!user || !isValidEmail(user)) {
      return res.status(400).json({ error: 'Valid user email required' });
    }

    const doc = await dbGet('SELECT * FROM documents WHERE id = ?', [id]);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (doc.owner !== user) {
      return res.status(403).json({ error: 'Only owner can delete' });
    }

    await dbRun('DELETE FROM documents WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('[API:DELETE /:id]', error.message);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
