import {
  Calendar,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';

import { motion } from 'motion/react';
import {
  useEffect,
  useState,
} from 'react';

interface ScheduleItem {
  id: number;
  day: string;
  time: string;
  activity: string;
  trainer?: string;
}

interface ScheduleProps {
  editable?: boolean;
}

export function Schedule({
  editable = true,
}: ScheduleProps) {
  const [
    scheduleItems,
    setScheduleItems,
  ] = useState<
    ScheduleItem[]
  >([]);

  const [newDay, setNewDay] =
    useState('Monday');

  const [newTime, setNewTime] =
    useState('');

  const [
    newActivity,
    setNewActivity,
  ] = useState('');

  const [
    newTrainer,
    setNewTrainer,
  ] = useState('');

  const loadSchedule =
    async () => {
      try {
        const response =
          await fetch(
            'http://localhost:5000/api/schedule',
            {
              cache:
                'no-store',
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            'Failed to load schedule'
          );
        }

        const data =
          await response.json();

        setScheduleItems(
          data
        );
      } catch (error) {
        console.error(
          'Error loading schedule:',
          error
        );
      }
    };

  useEffect(() => {
    loadSchedule();
  }, []);

  const addScheduleItem =
    async () => {
      if (
        !newDay ||
        !newTime ||
        !newActivity.trim()
      )
        return;

      try {
        const response =
          await fetch(
            'http://localhost:5000/api/schedule',
            {
              method:
                'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify(
                {
                  day: newDay,
                  time: newTime,
                  activity:
                    newActivity,
                  trainer:
                    newTrainer,
                  userId: 1,
                }
              ),
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            'Failed to add schedule item'
          );
        }

        await loadSchedule();

        setNewDay(
          'Monday'
        );
        setNewTime('');
        setNewActivity(
          ''
        );
        setNewTrainer(
          ''
        );
      } catch (error) {
        console.error(
          'Error adding schedule item:',
          error
        );
      }
    };

  const deleteScheduleItem =
    async (
      id: number
    ) => {
      try {
        const response =
          await fetch(
            `http://localhost:5000/api/schedule/${id}`,
            {
              method:
                'DELETE',
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            'Failed to delete schedule item'
          );
        }

        await loadSchedule();
      } catch (error) {
        console.error(
          'Error deleting schedule item:',
          error
        );
      }
    };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
        <Calendar className="w-5 h-5 text-red-600" />

        <h3 className="text-white font-semibold">
          Personal Weekly
          Schedule
        </h3>
      </div>

      {/* ADD NEW PLAN ONLY IN WEEKLY PLANS TAB */}
      {editable && (
        <div className="p-4 border-b border-neutral-800 space-y-3">
          <select
            value={
              newDay
            }
            onChange={(
              e
            ) =>
              setNewDay(
                e.target
                  .value
              )
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white"
          >
            <option>
              Monday
            </option>
            <option>
              Tuesday
            </option>
            <option>
              Wednesday
            </option>
            <option>
              Thursday
            </option>
            <option>
              Friday
            </option>
            <option>
              Saturday
            </option>
            <option>
              Sunday
            </option>
          </select>

          <input
            type="time"
            value={
              newTime
            }
            onChange={(
              e
            ) =>
              setNewTime(
                e.target
                  .value
              )
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white"
          />

          <input
            type="text"
            placeholder="Activity"
            value={
              newActivity
            }
            onChange={(
              e
            ) =>
              setNewActivity(
                e.target
                  .value
              )
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white"
          />

          <input
            type="text"
            placeholder="Trainer (optional)"
            value={
              newTrainer
            }
            onChange={(
              e
            ) =>
              setNewTrainer(
                e.target
                  .value
              )
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white"
          />

          <button
            onClick={
              addScheduleItem
            }
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
            Item
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {scheduleItems.length ===
          0 ? (
            <div className="text-neutral-500 text-center py-6">
              No schedule
              yet.
            </div>
          ) : (
            scheduleItems.map(
              (
                item,
                index
              ) => (
                <motion.div
                  key={
                    item.id
                  }
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      index *
                      0.05,
                  }}
                  whileHover={{
                    scale: 1.02,
                  }}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 hover:border-red-600 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-white font-medium">
                        {
                          item.activity
                        }
                      </div>

                      <div className="text-sm text-neutral-400">
                        <span className="text-red-600">
                          {
                            item.day
                          }
                        </span>{' '}
                        •{' '}
                        {
                          item.time
                        }
                        {item.trainer &&
                          ` • with ${item.trainer}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-neutral-500" />

                      {/* DELETE ONLY IF EDITABLE */}
                      {editable && (
                        <button
                          onClick={() =>
                            deleteScheduleItem(
                              item.id
                            )
                          }
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}