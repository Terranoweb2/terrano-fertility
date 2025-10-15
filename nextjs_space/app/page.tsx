
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Heart } from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (session?.user) {
      router.replace('/dashboard');
    } else {
      router.replace('/auth/signin');
    }
  }, [session, status, router]);

  // Show loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-full animate-pulse">
            <img src="/logo.png" alt="Terrano Fertility" className="w-16 h-16 object-contain" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terrano Fertility</h1>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-gray-600">Chargement...</span>
        </div>
      </div>
    </div>
  );
}
