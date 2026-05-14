import { Clipboard, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkoutPlan {
  id: number;
  name: string;
  exercises: string[];
  duration: string;
}

export function WorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);;
  const [newPlanName, setNewPlanName] = useState('');
  const [newExercises, setNewExercises] = useState<string[]>([]);
  const [newExerciseInput, setNewExerciseInput] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlan, setEditingPlan] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDuration, setEditDuration] = useState('');

useEffect(() => {
  fetch('http://localhost:5000/api/workouts')
    .then((res) => res.json())
    .then((data) => {
      const formattedPlans = data.map((workout: any) => ({
        id: workout.id,
        name: workout.title,
        exercises: workout.description
          ? workout.description.split(',').map((e: string) => e.trim())
          : [],
        duration: `${workout.duration} min`,
      }));

      setPlans(formattedPlans);
    })
    .catch((error) => console.error('Error loading workouts:', error));
}, []);

  const addExerciseToNewPlan = () => {
    if (newExerciseInput.trim()) {
      setNewExercises([...newExercises, newExerciseInput]);
      setNewExerciseInput('');
    }
  };

  const removeExerciseFromNewPlan = (index: number) => {
    setNewExercises(newExercises.filter((_, idx) => idx !== index));
  };

 const addPlan = async () => {
  if (newPlanName.trim() && newDuration.trim()) {
    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPlanName,
          description: newExercises.join(', '),
        duration: Number(newDuration.replace(/\D/g, '')),
          userId: 1,
        }),
      });

      const createdWorkout = await response.json();

      const formattedWorkout = {
        id: createdWorkout.id,
        name: createdWorkout.title,
        exercises: createdWorkout.description
          ? createdWorkout.description.split(',').map((e: string) => e.trim())
          : [],
        duration: `${createdWorkout.duration} min`,
      };

      setPlans([...plans, formattedWorkout]);

      setNewPlanName('');
      setNewExercises([]);
      setNewExerciseInput('');
      setNewDuration('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  }
};

  const cancelAddPlan = () => {
    setIsAdding(false);
    setNewPlanName('');
    setNewExercises([]);
    setNewExerciseInput('');
    setNewDuration('');
  };

const deletePlan = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete workout');
    }

    setPlans(plans.filter((plan) => plan.id !== id));
  } catch (error) {
    console.error('Error deleting workout:', error);
  }
};

  const startEdit = (plan: WorkoutPlan) => {
    setEditingPlan(plan.id);
    setEditName(plan.name);
    setEditDuration(plan.duration);
  };

  const saveEdit = async (id: number) => {
    console.log('SAVE CLICKED', id);
  try {
    const currentPlan = plans.find((plan) => plan.id === id);

    if (!currentPlan) return;

    const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editName,
        description: currentPlan.exercises.join(', '),
        duration: Number(editDuration.replace(/\D/g, '')),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update workout');
    }

    const updatedWorkout = await response.json();

    setPlans(
      plans.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              name: updatedWorkout.title,
              duration: `${updatedWorkout.duration} min`,
            }
          : plan
      )
    );

    setEditingPlan(null);
    setEditName('');
    setEditDuration('');
  } catch (error) {
    console.error('Error updating workout:', error);
  }
};

  const cancelEdit = () => {
    setEditingPlan(null);
    setEditName('');
    setEditDuration('');
  };

  const addExerciseToPlan = (planId: number, exercise: string) => {
    if (exercise.trim()) {
      setPlans(plans.map(plan =>
        plan.id === planId
          ? { ...plan, exercises: [...plan.exercises, exercise] }
          : plan
      ));
    }
  };

  const removeExercise = (planId: number, exerciseIndex: number) => {
    setPlans(plans.map(plan =>
      plan.id === planId
        ? { ...plan, exercises: plan.exercises.filter((_, idx) => idx !== exerciseIndex) }
        : plan
    ));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 flex-shrink-0">
        <Clipboard className="w-5 h-5 text-red-600" />
        <h3 className="text-white">Workout Plans</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="space-y-3">
          <AnimatePresence>
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-neutral-800 border border-neutral-700 rounded-lg p-3"
              >
                {editingPlan === plan.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-red-600"
                      placeholder="Plan name"
                    />
                    <input
                      type="text"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-red-600"
                      placeholder="Duration"
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => saveEdit(plan.id)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded px-2 py-1 text-sm flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={cancelEdit}
                        className="bg-neutral-700 hover:bg-neutral-600 text-white rounded px-2 py-1 text-sm flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-white font-medium">{plan.name}</div>
                        <div className="text-xs text-red-600">{plan.duration}</div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(plan)}
                          className="text-neutral-500 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deletePlan(plan.id)}
                          className="text-neutral-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {plan.exercises.map((exercise, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm text-neutral-400 bg-neutral-900 rounded px-2 py-1">
                          <span>• {exercise}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeExercise(plan.id, idx)}
                            className="text-neutral-600 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-3"
            >
              <input
                type="text"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="Plan name..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600"
              />
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="Duration (e.g. 60 min)..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600"
              />

              <div>
                <h5 className="text-sm text-neutral-400 mb-2">Exercises</h5>
                {newExercises.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {newExercises.map((exercise, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm text-neutral-300 bg-neutral-900 rounded px-2 py-1">
                        <span>• {exercise}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeExerciseFromNewPlan(idx)}
                          className="text-neutral-600 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExerciseInput}
                    onChange={(e) => setNewExerciseInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExerciseToNewPlan()}
                    placeholder="Add exercise..."
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600 text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addExerciseToNewPlan}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg px-3 py-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addPlan}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2 text-sm flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" /> Create Plan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelAddPlan}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg px-3 py-2 text-sm"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-neutral-800 flex-shrink-0">
        {!isAdding && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Workout Plan
          </motion.button>
        )}
      </div>
    </div>
  );
}
