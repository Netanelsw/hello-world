'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { DEMO_MODE } from '@/lib/demo-data';

export default function SetupProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    setLoading(true);
    setError('');

    if (DEMO_MODE) {
      router.push('/');
      return;
    }

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('Not logged in');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: name.trim(),
          username: username.trim().toLowerCase(),
          bio: bio.trim() || null,
        });

      if (error) throw error;
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4">
        <MapPin className="w-7 h-7 text-white" />
      </div>
      <h1 className="text-xl font-bold mb-1">Set Up Your Profile</h1>
      <p className="text-muted-foreground text-sm mb-6">Tell us a bit about yourself</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Username *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            placeholder="Choose a username"
            className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself (optional)"
            className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-20"
          />
        </div>

        {error && <p className="text-destructive text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading || !name.trim() || !username.trim()}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
