import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const suggestions = [
  'Summarize this document into 5 bullet points',
  'Generate an executive update from this draft',
  'Rewrite this section in a concise, professional tone',
  'Suggest clearer headings and structure'
];

function AIAssistantPanel() {
  const [typed, setTyped] = useState('');
  const [index, setIndex] = useState(0);
  const [backendOnline, setBackendOnline] = useState(false);

  const activeText = useMemo(() => suggestions[index % suggestions.length], [index]);

  useEffect(() => {
    let frame;
    if (typed.length < activeText.length) {
      frame = window.setTimeout(() => {
        setTyped(activeText.slice(0, typed.length + 1));
      }, 28);
    } else {
      frame = window.setTimeout(() => {
        setTyped('');
        setIndex((prev) => prev + 1);
      }, 1500);
    }

    return () => window.clearTimeout(frame);
  }, [activeText, typed]);

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error('offline');
        if (!cancelled) setBackendOnline(true);
      } catch {
        if (!cancelled) setBackendOnline(false);
      }
    };

    checkHealth();
    const interval = window.setInterval(checkHealth, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="hidden w-80 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl xl:block"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">AI Assistant</p>
          <p className={`text-xs ${backendOnline ? 'text-emerald-300' : 'text-amber-300'}`}>
            {backendOnline ? 'Backend connected' : 'Backend syncing'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Live Suggestion</p>
        <p className="mt-2 min-h-[48px] text-sm text-slate-200">{typed}<span className="animate-pulse">|</span></p>
      </div>

      <div className="mt-4 space-y-2">
        {suggestions.map((item) => (
          <button key={item} className="w-full rounded-xl border border-white/10 bg-slate-900/55 px-3 py-2 text-left text-xs text-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800/70">
            {item}
          </button>
        ))}
      </div>
    </motion.aside>
  );
}

export default AIAssistantPanel;
