import { Target, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';

interface Goal {
  id: number;
  title: string;
  current: number;
  target: number;
  unit: string;
}

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const loadGoals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        cache: 'no-store',
      });

      const data = await response.json();

      const formattedGoals = data.map((goal: any) => ({
        id: goal.id,
        title: goal.title,
        current: goal.progress,
        target: goal.target,
        unit: '',
      }));

      console.log('LOADED GOALS:', formattedGoals);

      setGoals(formattedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const updateCurrent = async (id: number, change: number) => {
  const goal = goals.find((g) => g.id === id);

  if (!goal) return;

  const newCurrent = Math.max(0, goal.current + change);

  try {
    const response = await fetch(`http://localhost:5000/api/goals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: goal.title,
        target: goal.target,
        progress: newCurrent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update goal');
    }

    const updatedGoal = await response.json();

    setGoals((prevGoals) =>
      prevGoals.map((g) =>
        g.id === id
          ? {
              ...g,
              current: updatedGoal.progress,
            }
          : g
      )
    );

    console.log('UPDATED GOAL:', updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
  }
};

  const getProgress = (goal: Goal): number => {
    return Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 flex-shrink-0">
        <Target className="w-5 h-5 text-red-600" />
        <h3 className="text-white">My Goals</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="space-y-4">
                    <div className="text-white">Goals count: {goals.length}</div>

          <>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-neutral-800 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-white">{goal.title}</div>
                    <div className="text-xs text-neutral-500">
                      Target: {goal.target}{goal.unit}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateCurrent(goal.id, 1)}
                      className="text-neutral-400 hover:text-green-500 transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateCurrent(goal.id, -1)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                      disabled={goal.current <= 0}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <Progress value={getProgress(goal)} className="flex-1" />

                  <div className="text-sm text-neutral-400 w-16 text-right">
                    <div className="text-white">
                      {goal.current}{goal.unit}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        </div>
      </div>
    </div>
  );
}

export type { Goal };