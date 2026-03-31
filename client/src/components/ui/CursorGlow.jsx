import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const scale = useMotionValue(1);

  const smoothX = useSpring(x, { stiffness: 200, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 200, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const handleMove = (event) => {
      x.set(event.clientX - 120);
      y.set(event.clientY - 120);
    };

    const handleOver = (event) => {
      if (event.target.closest('button, a, input, textarea, [role="button"]')) {
        scale.set(1.2);
      } else {
        scale.set(1);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, [scale, x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ x: smoothX, y: smoothY, scale: smoothScale }}
      className="pointer-events-none fixed left-0 top-0 z-0 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16)_0%,rgba(56,189,248,0.12)_36%,transparent_72%)] mix-blend-screen blur-2xl"
    />
  );
}

export default CursorGlow;
