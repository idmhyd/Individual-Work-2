import { TimeDisplay } from './components/TimeDisplay';
import { CalendarDisplay } from './components/CalendarDisplay';
import { GymInfo } from './components/GymInfo';
import { TrainerChat } from './components/TrainerChat';
import { Goals } from './components/Goals';
import { Schedule } from './components/Schedule';
import { EquipmentStatus } from './components/EquipmentStatus';
import { WorkoutPlans } from './components/WorkoutPlans';
import { GoalsProgress } from './components/GoalsProgress';
import { AuthModal } from './components/AuthModal';

import {
  Dumbbell,
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  User,
  LogOut,
} from 'lucide-react';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'plans' | 'goals'
  >('dashboard');

  const [user, setUser] = useState<{
    email: string;
    name: string;
  } | null>(null);

  const [showAuthModal, setShowAuthModal] =
    useState(false);

  useEffect(() => {
    const savedUser =
      localStorage.getItem('gymUser');

    if (!savedUser) return;

    try {
      const parsedUser =
        JSON.parse(savedUser);

      if (
        parsedUser?.email &&
        parsedUser?.name
      ) {
        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        'Failed to parse saved user:',
        error
      );

      localStorage.removeItem(
        'gymUser'
      );
    }
  }, []);

  const handleLogin = (
    email: string,
    name: string
  ) => {
    const loggedInUser = {
      email,
      name,
    };

    setUser(loggedInUser);

    localStorage.setItem(
      'gymUser',
      JSON.stringify(
        loggedInUser
      )
    );

    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);

    localStorage.removeItem(
      'gymUser'
    );

    setShowAuthModal(false);

    setActiveTab(
      'dashboard'
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="flex items-center justify-between mb-4"
          >
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [
                    0,
                    10,
                    -10,
                    0,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat:
                    Infinity,
                  repeatDelay: 5,
                }}
              >
                <Dumbbell className="w-8 h-8 text-red-600" />
              </motion.div>

              <h1 className="text-3xl text-white">
                Gym Dashboard
              </h1>
            </div>

            {/* AUTH */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* USER */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <User className="w-4 h-4 text-red-600" />

                    <span className="text-white text-sm">
                      {user.name}
                    </span>
                  </div>

                  {/* LOGOUT */}
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={
                      handleLogout
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-red-600 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />

                    <span className="text-sm">
                      Logout
                    </span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    setShowAuthModal(
                      true
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  <User className="w-4 h-4" />

                  <span className="text-sm">
                    Sign In
                  </span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* TABS */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                setActiveTab(
                  'dashboard'
                )
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab ===
                'dashboard'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                setActiveTab(
                  'goals'
                )
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab ===
                'goals'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Goals Progress
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                setActiveTab(
                  'plans'
                )
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab ===
                'plans'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Workout Plans
            </motion.button>
          </div>

          {/* TOP BLOCKS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimeDisplay />
            <CalendarDisplay />
          </div>
        </div>

        {/* PAGE CONTENT */}
        {activeTab ===
        'dashboard' ? (
          <>
            {/* GYM INFO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-3">
                <GymInfo />
              </div>
            </div>

            {/* DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* CHAT */}
              <div className="lg:col-span-1 h-[500px]">
                <TrainerChat />
              </div>

              {/* GOALS + EQUIPMENT */}
              <div className="lg:col-span-1 space-y-4">
                <div className="h-[240px]">
                  <Goals />
                </div>

                <div className="h-[250px]">
                  <EquipmentStatus />
                </div>
              </div>

              {/* SCHEDULE VIEW ONLY */}
              <div className="lg:col-span-1 h-[500px]">
                <Schedule editable={false} />
              </div>
            </div>
          </>
        ) : activeTab ===
          'goals' ? (
          <div className="max-h-[800px] overflow-y-auto">
            <GoalsProgress />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[600px]">
              <WorkoutPlans />
            </div>

            {/* FULL SCHEDULE WITH ADD/DELETE */}
            <div className="h-[600px]">
              <Schedule editable={true} />
            </div>
          </div>
        )}

        {/* AUTH MODAL */}
        <AuthModal
          isOpen={
            showAuthModal
          }
          onClose={() =>
            setShowAuthModal(
              false
            )
          }
          onLogin={
            handleLogin
          }
        />
      </div>
    </div>
  );
}