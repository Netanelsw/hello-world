import BottomNav from '@/components/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      <main className="pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
