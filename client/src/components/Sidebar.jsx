import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Sidebar({ documents, currentDoc, currentUser, onSelectDocument, onCreateDocument, onImportDocument, onSwitchUser, loading }) {
  const [newTitle, setNewTitle] = useState('');
  const [showNewDocForm, setShowNewDocForm] = useState(false);

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  const myDocs = documents.filter(d => d.isOwner);
  const sharedDocs = documents.filter(d => !d.isOwner);

  const handleCreateNew = () => {
    if (newTitle.trim()) {
      onCreateDocument(newTitle);
      setNewTitle('');
      setShowNewDocForm(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const title = file.name.replace('.txt', '') || 'Imported file';
      await onImportDocument(title, content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
      <div className="border-b border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-sm font-semibold text-blue-100">
            D
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">SaaS Workspace</p>
            <h2 className="text-base font-semibold tracking-tight text-slate-100">Doc Studio</h2>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="mb-3 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
          onClick={() => setShowNewDocForm(!showNewDocForm)}
        >
          + New Document
        </motion.button>

        <label className="mb-2 block cursor-pointer rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-center text-xs font-medium text-slate-200 transition hover:bg-slate-700/80">
          Upload .txt
          <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
        </label>

        <select
          value={currentUser}
          onChange={(e) => onSwitchUser(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none ring-blue-500/50 transition focus:ring-2"
        >
          <option>user1@gmail.com</option>
          <option>user2@gmail.com</option>
        </select>
      </div>

      {showNewDocForm && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-2 border-b border-white/10 p-3"
        >
          <input
            type="text"
            placeholder="Untitled Document"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateNew()}
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-blue-500/50 transition focus:ring-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleCreateNew} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-white">
              Create
            </button>
            <button
              onClick={() => {
                setShowNewDocForm(false);
                setNewTitle('');
              }}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-800/80" />
            ))}
          </div>
        ) : (
          <>
            {myDocs.length > 0 && (
              <div className="mb-5">
                <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">My Documents</p>
                <ul className="space-y-1.5">
                  {myDocs.map((doc) => {
                    const isActive = currentDoc?.id === doc.id;
                    return (
                      <li key={doc.id}>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => onSelectDocument(doc)}
                          className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                            isActive
                              ? 'border-blue-400/50 bg-blue-500/20 shadow-lg shadow-blue-500/15'
                              : 'border-white/10 bg-slate-800/70 hover:bg-slate-700/80'
                          }`}
                        >
                          <p className="truncate text-sm font-medium text-slate-100">{doc.title}</p>
                          <p className="mt-1 text-xs text-slate-400">Updated {formatDate(doc.updatedAt)}</p>
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {sharedDocs.length > 0 && (
              <div>
                <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">Shared With Me</p>
                <ul className="space-y-1.5">
                  {sharedDocs.map((doc) => {
                    const isActive = currentDoc?.id === doc.id;
                    return (
                      <li key={doc.id}>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => onSelectDocument(doc)}
                          className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                            isActive
                              ? 'border-purple-400/50 bg-purple-500/20 shadow-lg shadow-purple-500/15'
                              : 'border-white/10 bg-slate-800/70 hover:bg-slate-700/80'
                          }`}
                        >
                          <p className="truncate text-sm font-medium text-slate-100">{doc.title}</p>
                          <p className="mt-1 text-xs text-slate-400">by {doc.owner.split('@')[0]}</p>
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {documents.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No documents yet</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
