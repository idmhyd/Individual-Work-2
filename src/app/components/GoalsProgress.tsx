import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Goal {
  id: number;
  title: string;
  current: number;
  target: number;
  unit: string;
  history?: { date: string; value: number }[];
}

export function GoalsProgress() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('kg');

  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTarget, setEditTarget] = useState('');

  const loadGoals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        cache: 'no-store',
      });

      if (!response.ok) throw new Error('Failed to load goals');

      const data = await response.json();

      const formattedGoals: Goal[] = data.map((goal: any) => ({
        id: goal.id,
        title: goal.title,
        current: goal.progress,
        target: goal.target,
        unit: goal.unit || 'kg',
        history: [
          {
            date: new Date().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            }),
            value: goal.progress,
          },
        ],
      }));

      setGoals(formattedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const addGoal = async () => {
    if (!newGoal.trim() || !newCurrent || !newTarget) return;

    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newGoal,
          target: Number(newTarget),
          progress: Number(newCurrent),
          userId: 1,
          unit: newUnit,
        }),
      });

      if (!response.ok) throw new Error('Failed to create goal');

      await loadGoals();

      setNewGoal('');
      setNewCurrent('');
      setNewTarget('');
      setNewUnit('kg');
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete goal');

      await loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const updateCurrent = async (id: number, change: number) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const newCurrentValue = Math.max(0, goal.current + change);

    try {
      const response = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: goal.title,
          target: goal.target,
          progress: newCurrentValue,
          unit: goal.unit,
        }),
      });

      if (!response.ok) throw new Error('Failed to update goal');

      await loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const startEdit = (goal: Goal) => {
    setEditingGoal(goal.id);
    setEditTitle(goal.title);
    setEditTarget(goal.target.toString());
  };

  const saveEdit = async (id: number) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    try {
      const response = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          target: Number(editTarget),
          progress: goal.current,
          unit: goal.unit,
        }),
      });

      if (!response.ok) throw new Error('Failed to edit goal');

      setEditingGoal(null);
      setEditTitle('');
      setEditTarget('');

      await loadGoals();
    } catch (error) {
      console.error('Error editing goal:', error);
    }
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setEditTitle('');
    setEditTarget('');
  };

  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 md:px-0 text-white">
      <div className="bg-[#111111] rounded-2xl p-8 border border-zinc-800 mb-10 w-full">
        <h3 className="text-xl font-semibold mb-6">Add New Goal</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full items-stretch">
          <input
            type="text"
            placeholder="Goal title"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="bg-zinc-800 text-lg text-white px-6 rounded-xl outline-none w-full h-[70px]"
          />

          <input
            type="number"
            placeholder="Current"
            value={newCurrent}
            onChange={(e) => setNewCurrent(e.target.value)}
            className="bg-zinc-800 text-lg text-white px-6 rounded-xl outline-none w-full h-[70px]"
          />

          <input
            type="number"
            placeholder="Target"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="bg-zinc-800 text-lg text-white px-6 rounded-xl outline-none w-full h-[70px]"
          />

          <button
            onClick={addGoal}
            className="bg-red-600 hover:bg-red-500 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg w-full h-[70px]"
          >
            <Plus size={18} />
            Add Goal
          </button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="text-center text-zinc-400 text-xl mt-10">
          No goals yet. Add your first goal.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {goals.map((goal) => {
            const percentage = Math.min(
              (goal.current / goal.target) * 100,
              100
            );

            return (
              <div
                key={goal.id}
                className="bg-[#111111] rounded-2xl p-6 border border-zinc-800 w-full min-h-[280px] flex flex-col justify-between"
              >
                {editingGoal === goal.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-zinc-800 p-3 rounded-lg text-sm"
                    />

                    <input
                      type="number"
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value)}
                      className="w-full bg-zinc-800 p-3 rounded-lg text-sm"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(goal.id)}
                        className="bg-green-600 p-2 rounded-lg"
                      >
                        <Check size={14} />
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="bg-zinc-700 p-2 rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold break-words pr-4 flex-1">
                          {goal.title}
                        </h3>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => startEdit(goal)}
                            className="bg-zinc-800 p-2 rounded-lg"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="bg-red-600 p-2 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-zinc-400 mb-3 text-sm">
                        {goal.current} / {goal.target} {goal.unit}
                      </p>

                      <div className="w-full bg-zinc-800 rounded-full h-3 mb-4">
                        <div
                          className="bg-red-500 h-3 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="mb-4 font-semibold text-sm">
                        {percentage.toFixed(1)}% completed
                      </p>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={() => updateCurrent(goal.id, -1)}
                        className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg"
                      >
                        <ChevronDown size={16} />
                      </button>

                      <button
                        onClick={() => updateCurrent(goal.id, 1)}
                        className="bg-green-600 hover:bg-green-500 p-2 rounded-lg"
                      >
                        <ChevronUp size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}