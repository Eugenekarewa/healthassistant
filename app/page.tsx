'use client';

import HealthAssistant from '@/components/HealthAssistant';
import ChatBot from '@/components/ChatBot';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HealthAssistant />
      <ChatBot />
    </main>
  );
}