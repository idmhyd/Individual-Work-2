import { useState, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'trainer';
  timestamp: string;
}

export function TrainerChat() {
  const defaultMessage: Message[] = [
    {
      id: 1,
      text: "Hey! I'm here to help you with your training goals. How can I assist you today?",
      sender: 'trainer',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const savedMessages = localStorage.getItem('trainerChatMessages');

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(defaultMessage);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        'trainerChatMessages',
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    setTimeout(() => {
      const trainerResponse: Message = {
        id: Date.now() + 1,
        text: "Thanks for your message! I'll get back to you shortly.",
        sender: 'trainer',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, trainerResponse]);
    }, 1000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 flex-shrink-0">
        <MessageCircle className="w-5 h-5 text-red-600" />
        <h3 className="text-white font-semibold">Trainer Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  message.sender === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-red-900/50 text-white'
                      : 'bg-neutral-800 text-neutral-200'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>

                  <div className="text-xs text-neutral-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString(
                      'en-US',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-800 flex-shrink-0">
        <div className="flex gap-2 items-stretch">
          <input
            type="text"
            value={inputValue}
            onChange={(e) =>
              setInputValue(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === 'Enter' && handleSend()
            }
            placeholder="Type your message..."
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600 transition-colors"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}