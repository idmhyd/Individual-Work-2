import { Clock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function GymInfo() {
  const [visitorCount, setVisitorCount] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(15, Math.min(80, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3"
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-red-600" />
          <div className="text-sm text-neutral-400">Opening Hours</div>
        </div>
        <div className="text-white">
          <div>Mon-Fri: 6:00 - 22:00</div>
          <div>Sat-Sun: 8:00 - 20:00</div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3"
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Users className="w-4 h-4 text-red-600" />
          </motion.div>
          <div className="text-sm text-neutral-400">Current Visitors</div>
        </div>
        <div className="text-3xl text-red-600 tabular-nums">
          {visitorCount}
        </div>
      </motion.div>
    </div>
  );
}