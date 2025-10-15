
'use client';

import { PregnancyTracker } from '@/components/pregnancy-tracker';

export default function PregnancyPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Suivi de Grossesse</h1>
        <p className="text-muted-foreground">
          Suivez votre grossesse semaine par semaine et ne manquez aucun moment important
        </p>
      </div>
      <PregnancyTracker />
    </div>
  );
}
