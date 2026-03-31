import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Layout from './components/Layout';

function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser') || 'user1@gmail.com');
  const [documents, setDocuments] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ownedCount = documents.filter((doc) => doc.isOwner).length;
  const sharedCount = documents.filter((doc) => !doc.isOwner).length;

  // Load documents on mount or when user changes
  useEffect(() => {
    if (currentUser) {
      loadDocuments();
    }
  }, [currentUser]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/docs?user=${encodeURIComponent(currentUser)}`);
      if (!res.ok) throw new Error('Failed to load documents');
      const data = await res.json();
      setDocuments(data);
      if (currentDoc) {
        // Refresh current doc if open
        const updated = data.find(d => d.id === currentDoc.id);
        if (updated) setCurrentDoc(updated);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDocument = (doc) => {
    setCurrentDoc(doc);
  };

  const handleCreateDocument = async (title) => {
    try {
      setError('');
      const res = await fetch('/api/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, owner: currentUser })
      });
      if (!res.ok) throw new Error('Failed to create document');
      const newDoc = await res.json();
      setDocuments([newDoc, ...documents]);
      setCurrentDoc(newDoc);
      return newDoc;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleImportDocument = async (title, content) => {
    const created = await handleCreateDocument(title);
    if (!created) return;

    try {
      const res = await fetch(`/api/docs/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, user: currentUser })
      });
      if (!res.ok) throw new Error('Failed to import file content');

      const updated = { ...created, title, content, updatedAt: new Date().toISOString() };
      setCurrentDoc(updated);
      setDocuments((prevDocs) => prevDocs.map((doc) => (doc.id === created.id ? updated : doc)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateDocument = async (title, content) => {
    if (!currentDoc) return;
    try {
      setError('');
      const res = await fetch(`/api/docs/${currentDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, user: currentUser })
      });
      if (!res.ok) throw new Error('Failed to update document');
      const updated = { ...currentDoc, title, content, updatedAt: new Date().toISOString() };
      setCurrentDoc(updated);
      setDocuments(documents.map(d => d.id === currentDoc.id ? updated : d));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShareDocument = async (email) => {
    if (!currentDoc) return;
    try {
      setError('');
      const res = await fetch(`/api/docs/${currentDoc.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareWith: email, user: currentUser })
      });
      if (!res.ok) throw new Error('Failed to share document');
      const data = await res.json();
      const updated = { ...currentDoc, sharedWith: data.sharedWith };
      setCurrentDoc(updated);
      setDocuments(documents.map(d => d.id === currentDoc.id ? updated : d));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDocument = async () => {
    if (!currentDoc) return;
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      setError('');
      const res = await fetch(`/api/docs/${currentDoc.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
      if (!res.ok) throw new Error('Failed to delete document');
      setDocuments(documents.filter(d => d.id !== currentDoc.id));
      setCurrentDoc(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSwitchUser = (email) => {
    setCurrentUser(email);
    localStorage.setItem('currentUser', email);
    setCurrentDoc(null);
  };

  return (
    <Layout
      sidebar={(
        <Sidebar
          documents={documents}
          currentDoc={currentDoc}
          currentUser={currentUser}
          onSelectDocument={handleSelectDocument}
          onCreateDocument={handleCreateDocument}
          onImportDocument={handleImportDocument}
          onSwitchUser={handleSwitchUser}
          loading={loading}
        />
      )}
      ownedCount={ownedCount}
      sharedCount={sharedCount}
      error={error}
    >
      <AnimatePresence mode="wait">
        {currentDoc ? (
          <motion.div
            key={currentDoc.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="h-full"
          >
            <Editor
              doc={currentDoc}
              user={currentUser}
              onUpdate={handleUpdateDocument}
              onShare={handleShareDocument}
              onDelete={handleDeleteDocument}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 p-10 backdrop-blur"
          >
            {loading ? (
              <div className="w-full max-w-3xl space-y-4">
                <div className="h-10 w-2/3 animate-pulse rounded-xl bg-slate-700/70" />
                <div className="h-64 animate-pulse rounded-xl bg-slate-800/80" />
                <div className="h-14 animate-pulse rounded-xl bg-slate-800/70" />
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 text-blue-300">
                  <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 11h8M8 15h5M7 3h10a2 2 0 0 1 2 2v14l-3-2-2 2-2-2-2 2-3-2V5a2 2 0 0 1 2-2Z" />
                  </svg>
                </div>
                <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-100">Start by creating a new document</h2>
                <p className="text-sm text-slate-400">Use New Document or upload a .txt file to begin writing.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
