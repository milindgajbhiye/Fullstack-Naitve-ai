import React, { useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function MotionButton({ children, className = '', onClick, type = 'button', ...rest }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const [ripples, setRipples] = useState([]);

  const handlePointerMove = (event) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (event.clientX - centerX) * 0.18;
    const deltaY = (event.clientY - centerY) * 0.18;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (event) => {
    const element = ref.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const ripple = {
        id: Date.now(),
        left: event.clientX - rect.left,
        top: event.clientY - rect.top
      };
      setRipples((prev) => [...prev, ripple]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((entry) => entry.id !== ripple.id));
      }, 450);
    }

    if (onClick) onClick(event);
  };

  const rippleNodes = useMemo(
    () =>
      ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/35 animate-ripple"
          style={{ left: ripple.left, top: ripple.top }}
        />
      )),
    [ripples]
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onClick={handleClick}
      className={`relative overflow-hidden transition-transform duration-300 ${className}`}
      {...rest}
    >
      {rippleNodes}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

export default MotionButton;
