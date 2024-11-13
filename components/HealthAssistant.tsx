'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOpenAI } from '@/hooks/useOpenAI';
import { HealthPrompt } from '@/prompts/HealthPrompt';

interface MentalHealthAssistantResponse {
  advice: string;
}

const MAX_CHARS = 500;

export default function Component() {
  const [query, setQuery] = useState('');
  const [mood, setMood] = useState('');
  const { result, loading, error, generateResponse } = useOpenAI<MentalHealthAssistantResponse>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const prompt = {
      ...HealthPrompt,
      userPrompt: HealthPrompt.userPrompt(query),
      mood: mood,
    };

    await generateResponse(prompt);
    setQuery('');
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setQuery(value);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  };

  return (
    <div className="grid md:grid-cols-[260px_1fr] h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col bg-background">
        <div className="p-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Bot className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-3">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Previous Chats</div>
            {['Anxiety Management', 'Stress Relief', 'Sleep Improvement'].map((chat, idx) => (
              <Button key={idx} variant="ghost" className="w-full justify-start text-sm hover:bg-accent">
                {chat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col h-full">
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto p-4 space-y-8">
            {!result ? (
              <div className="text-center space-y-4 py-12">
                <h1 className="text-2xl font-bold">AI Mental Health Assistant</h1>
                <p className="text-muted-foreground">How are you feeling today? I'm here to listen and help.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="/user-avatar.svg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <div className="font-semibold">You</div>
                    <div className="text-muted-foreground">{query}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="/assistant-avatar.svg" alt="AI Assistant" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <div className="font-semibold">Assistant</div>
                    <div className="text-muted-foreground">{result.advice}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <div className="border-t">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
            <div className="relative">
              <Label htmlFor="query" className="sr-only">Message the AI Mental Health Assistant</Label>
              <Textarea
                id="query"
                ref={textareaRef}
                placeholder="Message the AI Mental Health Assistant..."
                value={query}
                onChange={handleInput}
                rows={1}
                className="resize-none pr-12 rounded-lg"
                maxLength={MAX_CHARS}
              />
              <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
                {query.length}/{MAX_CHARS}
              </div>
              <Button 
                type="submit" 
                size="icon" 
                disabled={loading || !query.trim()}
                className="absolute right-2 top-2 transition hover:scale-105"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <p className="text-xs text-center text-muted-foreground mt-2">
              If you&apos;re in immediate danger, please contact emergency services by dialing 911
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}