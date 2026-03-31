import React from 'react';
import { motion } from 'framer-motion';

function Layout({ sidebar, children, ownedCount, sharedCount, error }) {
  return (
    <div className="relative h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_88%_14%,rgba(168,85,247,0.14),transparent_38%),radial-gradient(circle_at_54%_100%,rgba(30,64,175,0.14),transparent_48%)]" />

      <div className="relative z-10 flex h-full gap-4 p-4">
        <motion.aside
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="h-full w-[260px] shrink-0"
        >
          {sidebar}
        </motion.aside>

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: 'easeOut' }}
          className="flex h-full min-w-0 flex-1 flex-col rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-xl"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-7 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Collaborative Docs</h1>
            </div>

            <div className="flex gap-2">
              <div className="rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2 text-right">
                <p className="text-[11px] uppercase tracking-widest text-slate-400">Owned</p>
                <p className="text-xl font-semibold text-slate-100">{ownedCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2 text-right">
                <p className="text-[11px] uppercase tracking-widest text-slate-400">Shared</p>
                <p className="text-xl font-semibold text-slate-100">{sharedCount}</p>
              </div>
            </div>
          </header>

          {error && (
            <div className="mx-7 mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="min-h-0 flex-1 p-6">
            <div className="mx-auto h-full w-full max-w-[900px]">{children}</div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default Layout;
