'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ChatBot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [mood, setMood] = useState('');
  const [showMeditationPlayer, setShowMeditationPlayer] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const userMessage = `User: ${userInput}`;
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const moodMessage = mood ? `Mood: ${mood}` : 'Mood not provided';

      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userInput, mood: moodMessage }),
        });

        const data = await response.json();

        setMessages((prevMessages) => [...prevMessages, `Bot: ${data.advice}`]);

        if (data.advice.toLowerCase().includes('relax') || data.advice.toLowerCase().includes('stress')) {
          setShowMeditationPlayer(true);
        }
      } catch (error) {
        console.error('Error fetching chatbot response:', error);
        setMessages((prevMessages) => [...prevMessages, 'Bot: Sorry, there was an error.']);
      }

      setUserInput('');
    }
  };

  const closeMeditationPlayer = () => {
    setShowMeditationPlayer(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 rounded-full bg-teal-500 text-white hover:bg-teal-400"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6" />
          <span className="sr-only">Open Chatbot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-teal-600">AI Mental Health Assistant</DialogTitle>
          <DialogDescription className="text-gray-600">
            How can I help you today? Feel free to share your thoughts or concerns.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[300px] w-full rounded-md border bg-teal-50 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`mb-2 ${
                msg.startsWith('User:') ? 'text-right text-teal-700' : 'text-left text-teal-500'
              }`}
            >
              {msg}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="How are you feeling?"
            className="flex-grow border-teal-400 focus:border-teal-600"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-grow border-teal-400 focus:border-teal-600"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-teal-500 text-white hover:bg-teal-400">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        {showMeditationPlayer && (
          <div className="mt-4 rounded-md border bg-teal-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-teal-600">Guided Meditation</h3>
            <p className="mb-2">Take a deep breath and relax with this meditation session.</p>
            <iframe
              width="100%"
              height="215"
              src="https://www.youtube.com/embed/YourMeditationVideoID"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mb-2 rounded-md"
            />
            <Button onClick={closeMeditationPlayer} variant="outline" className="w-full text-teal-600 border-teal-400">
              Close Meditation
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatBot;
