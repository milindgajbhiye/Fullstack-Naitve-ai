import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { AnimatePresence, motion } from 'framer-motion';
import { Share2, Trash2 } from 'lucide-react';
import MotionButton from './ui/MotionButton';
import 'react-quill/dist/quill.snow.css';

function Editor({ doc, user, onUpdate, onShare, onDelete }) {
  const [title, setTitle] = useState(doc.title);
  const [content, setContent] = useState(doc.content);
  const [shareEmail, setShareEmail] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [shareNotice, setShareNotice] = useState('');
  const [titleFocused, setTitleFocused] = useState(false);
  const saveTimeoutRef = useRef(null);
  const isOwner = doc.owner === user;

  const wordCount = content
    ? content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
    : 0;

  useEffect(() => {
    setTitle(doc.title);
    setContent(doc.content);
  }, [doc.id]);

  const handleSave = async (newTitle = title, newContent = content) => {
    setSaveStatus('saving');
    try {
      await onUpdate(newTitle, newContent);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 1200);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      handleSave(title, value);
    }, 1200);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      handleSave(newTitle, content);
    }, 1200);
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) {
      setShareNotice('Enter an email to share this document.');
      return;
    }
    try {
      await onShare(shareEmail);
      setShareEmail('');
      setShareNotice('Access granted.');
      setTimeout(() => setShareNotice(''), 1800);
    } catch (error) {
      setShareNotice(error.message || 'Sharing failed.');
    }
  };

  const saveLabel = {
    saving: 'Saving...',
    saved: 'Saved',
    error: 'Save failed'
  }[saveStatus] || 'Idle';

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'header': 1 }, { 'header': 2 }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link']
    ]
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900/60 px-5 py-3 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.p
            key={saveLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-slate-400"
          >
            {saveLabel}
          </motion.p>
        </AnimatePresence>

        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Owner {doc.owner}</p>
      </div>

      <motion.div
        whileHover={{ y: -4, boxShadow: '0 24px 46px rgba(2,6,23,0.45)' }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="min-h-0 flex-1 rounded-2xl border border-white/10 bg-slate-800/70 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur"
      >
        <motion.input
          animate={{ scale: titleFocused ? 1.01 : 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onFocus={() => setTitleFocused(true)}
          onBlur={() => setTitleFocused(false)}
          placeholder="Untitled Document"
          className="mb-4 w-full rounded-xl border border-transparent bg-transparent px-2 py-1 text-3xl font-bold tracking-tight text-slate-100 outline-none transition focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/30"
        />

        <motion.div
          initial={{ opacity: 0.75, filter: 'blur(2px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.28 }}
          className="quill-shell mb-4 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-50 text-slate-900"
        >
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            modules={modules}
            placeholder="Start writing your document..."
            className="h-[440px]"
          />
        </motion.div>

        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>{wordCount} words</span>
            <span>Last update {new Date(doc.updatedAt).toLocaleString()}</span>
          </div>

          {isOwner ? (
            <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <input
                type="email"
                placeholder="teammate@company.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShare()}
                className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-blue-500/40"
              />

              <MotionButton
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-400"
              >
                <Share2 className="h-4 w-4" />
                Share
              </MotionButton>

              <MotionButton
                onClick={onDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </MotionButton>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Shared by {doc.owner}</p>
          )}

          {doc.sharedWith && doc.sharedWith.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {doc.sharedWith.map((email) => (
                <span key={email} className="rounded-full border border-white/10 bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {email}
                </span>
              ))}
            </div>
          )}

          <AnimatePresence>
            {shareNotice && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="mt-3 text-sm text-slate-300"
              >
                {shareNotice}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default Editor;
