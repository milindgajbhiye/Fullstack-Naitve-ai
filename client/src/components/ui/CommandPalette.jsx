import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, FilePlus2, Search } from 'lucide-react';

function CommandPalette({ open, onClose, documents, onSelectDocument, onCreateDocument }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    if (open) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, open]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return documents.slice(0, 8);
    return documents.filter((doc) => doc.title.toLowerCase().includes(term)).slice(0, 8);
  }, [documents, query]);

  const createFromQuery = async () => {
    const title = query.trim();
    if (!title) return;
    await onCreateDocument(title);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900/95 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search documents or type a new title..."
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800 px-2 py-1 text-[11px] text-slate-400">
                <Command className="h-3 w-3" />K
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.trim() && (
                <button
                  onClick={createFromQuery}
                  className="mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  <FilePlus2 className="h-4 w-4 text-blue-300" />
                  Create "{query.trim()}"
                </button>
              )}

              {filtered.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    onSelectDocument(doc);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-slate-800"
                >
                  <span className="truncate text-sm text-slate-200">{doc.title}</span>
                  <span className="ml-2 text-xs text-slate-500">{doc.isOwner ? 'Owned' : 'Shared'}</span>
                </button>
              ))}

              {filtered.length === 0 && !query.trim() && (
                <p className="px-3 py-8 text-center text-sm text-slate-500">No documents yet.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
