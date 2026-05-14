import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

export function CalendarDisplay() {
  const [currentDate] = useState(new Date());

  const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      >
        <CalendarDays className="w-5 h-5 text-red-600" />
      </motion.div>
      <div>
        <div className="text-sm text-neutral-400">Today's Date</div>
        <div className="text-4xl text-white">
          {day} {month}
        </div>
        <div className="text-sm text-neutral-400">{dayOfWeek}, {year}</div>
      </div>
    </motion.div>
  );
}
