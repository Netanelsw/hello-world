'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';

export default function AskPage() {
  const router = useRouter();
  const { addRequest } = useDemo();
  const [text, setText] = useState('');

  function handleSubmit() {
    if (!text.trim()) return;
    addRequest(text.trim());
    router.push('/');
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-border z-40">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Ask for Recommendation</h1>
        </div>
      </header>

      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Ask your network for a recommendation. Be specific about what you&apos;re looking for and where.
        </p>

        <textarea
          placeholder="e.g., Looking for a good dentist in Tel Aviv..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-32"
          autoFocus
        />

        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          <Send className="w-4 h-4" />
          Post Question
        </button>

        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Example questions:</h3>
          {[
            'Looking for a good dentist in Tel Aviv',
            'Best brunch spot near Dizengoff?',
            'Need a reliable car mechanic in Ramat Gan',
            'Where do you get your hair done?',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setText(example)}
              className="block w-full text-left text-sm p-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              &ldquo;{example}&rdquo;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
