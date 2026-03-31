import React from 'react';
import { motion } from 'framer-motion';
import { Command } from 'lucide-react';
import CursorGlow from './ui/CursorGlow';

function Layout({ sidebar, children, ownedCount, sharedCount, error, onOpenPalette }) {
  return (
    <div className="relative h-screen overflow-hidden bg-slate-950 text-slate-100">
      <CursorGlow />
      <div className="animated-bg pointer-events-none absolute inset-0 opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.14),transparent_36%)]" />

      <div className="relative z-10 flex h-full gap-4 p-4">
        <motion.aside
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="h-full w-[260px] shrink-0"
        >
          {sidebar}
        </motion.aside>

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex h-full min-w-0 flex-1 flex-col rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-xl"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-7 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Collaborative Docs</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPalette}
                className="hidden items-center gap-1 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-xs text-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-700 md:inline-flex"
              >
                <Command className="h-3.5 w-3.5" />K
              </button>

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
