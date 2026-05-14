import { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (
    email: string,
    name: string
  ) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  onLogin,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] =
    useState(false);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [name, setName] =
    useState('');

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const endpoint = isSignUp
        ? 'http://localhost:5000/api/auth/register'
        : 'http://localhost:5000/api/auth/login';

      const response = await fetch(
        endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            'Authentication failed'
        );
        return;
      }

    

      if (!data.user) {
        alert(
          'User data missing from server response'
        );
        return;
      }

      localStorage.setItem(
        'gymUser',
        JSON.stringify(data.user)
      );

      onLogin(
        data.user.email,
        data.user.name
      );

      setEmail('');
      setPassword('');
      setName('');

      onClose();
    } catch (error) {
      console.error(
        'AUTH ERROR:',
        error
      );

      alert(
        'Server connection failed'
      );
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);

    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-md relative"
          >
            {/* CLOSE */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* TITLE */}
            <div className="mb-6">
              <h2 className="text-2xl text-white mb-2">
                {isSignUp
                  ? 'Create Account'
                  : 'Welcome Back'}
              </h2>

              <p className="text-neutral-400 text-sm">
                {isSignUp
                  ? 'Sign up to track your gym progress'
                  : 'Sign in to continue'}
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >
              {/* NAME */}
              {isSignUp && (
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      placeholder="Your name"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600 transition-colors"
                      required={
                        isSignUp
                      }
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="your@email.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
              >
                {isSignUp ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            {/* SWITCH MODE */}
            <div className="mt-6 text-center">
              <button
                onClick={
                  switchMode
                }
                className="text-sm text-neutral-400 hover:text-red-500 transition-colors"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}