import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function TimeDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3"
    >
      <motion.div
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Clock className="w-5 h-5 text-red-600" />
      </motion.div>
      <div>
        <div className="text-sm text-neutral-400">Current Time</div>
        <motion.div
          key={time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          className="text-4xl text-white"
        >
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </motion.div>
      </div>
    </motion.div>
  );
}