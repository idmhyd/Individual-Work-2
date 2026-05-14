import { Dumbbell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Equipment {
  id: number;
  name: string;
  status: 'available' | 'in-use' | 'maintenance';
}

export function EquipmentStatus() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 1, name: 'Treadmill 1', status: 'in-use' },
    { id: 2, name: 'Treadmill 2', status: 'available' },
    { id: 3, name: 'Treadmill 3', status: 'in-use' },
    { id: 4, name: 'Bike 1', status: 'available' },
    { id: 5, name: 'Bike 2', status: 'in-use' },
    { id: 6, name: 'Bike 3', status: 'available' },
    { id: 7, name: 'Elliptical 1', status: 'in-use' },
    { id: 8, name: 'Elliptical 2', status: 'available' },
    { id: 9, name: 'Rowing 1', status: 'available' },
    { id: 10, name: 'Rowing 2', status: 'in-use' },
    { id: 11, name: 'Bench Press', status: 'in-use' },
    { id: 12, name: 'Squat Rack', status: 'available' },
    { id: 13, name: 'Smith Machine', status: 'available' },
    { id: 14, name: 'Cable Machine', status: 'in-use' },
    { id: 15, name: 'Leg Press', status: 'available' },
    { id: 16, name: 'Lat Pulldown', status: 'maintenance' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment(prev =>
        prev.map(item => {
          if (Math.random() < 0.1) {
            const statuses: ('available' | 'in-use')[] = ['available', 'in-use'];
            return {
              ...item,
              status: item.status === 'maintenance' ? 'maintenance' : statuses[Math.floor(Math.random() * 2)]
            };
          }
          return item;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-600';
      case 'in-use':
        return 'bg-red-600';
      case 'maintenance':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const availableCount = equipment.filter(e => e.status === 'available').length;
  const inUseCount = equipment.filter(e => e.status === 'in-use').length;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-red-600" />
          <h3 className="text-white">Equipment Status</h3>
        </div>
        <div className="flex gap-3 text-sm">
          <motion.div
            key={`available-${availableCount}`}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span className="text-neutral-400">{availableCount}</span>
          </motion.div>
          <motion.div
            key={`inuse-${inUseCount}`}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            <span className="text-neutral-400">{inUseCount}</span>
          </motion.div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {equipment.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 cursor-pointer hover:border-neutral-600"
            >
              <div className="flex items-center justify-between mb-2">
                <motion.div
                  key={`${item.id}-${item.status}`}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}
                  style={{
                    boxShadow: item.status === 'in-use'
                      ? '0 0 8px rgba(220, 38, 38, 0.6)'
                      : item.status === 'available'
                      ? '0 0 8px rgba(22, 163, 74, 0.6)'
                      : 'none'
                  }}
                ></motion.div>
                <Dumbbell className="w-3 h-3 text-neutral-600" />
              </div>
              <div className="text-sm text-white">{item.name}</div>
              <div className="text-xs text-neutral-500 capitalize mt-1">{item.status.replace('-', ' ')}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="px-4 py-2 border-t border-neutral-800 flex gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-600"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-600"></div>
          <span>In Use</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-600"></div>
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  );
}
