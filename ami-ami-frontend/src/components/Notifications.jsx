import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function Notifications() {
  // Pour le MVP, nous affichons un placeholder
  // Dans une version complète, nous aurions un système de notifications en temps réel
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell size={24} />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Bell size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Aucune notification</p>
            <p className="text-sm">
              Les notifications pour les nouveaux amis, likes et commentaires apparaîtront ici.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
