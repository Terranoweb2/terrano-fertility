import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Home, Users, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : 'AA';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Ami-Ami</h1>
          </div>

          {/* Navigation centrale */}
          <div className="flex space-x-4">
            <Button
              variant={currentView === 'feed' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('feed')}
              className="flex items-center space-x-2"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Accueil</span>
            </Button>
            <Button
              variant={currentView === 'friends' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('friends')}
              className="flex items-center space-x-2"
            >
              <Users size={20} />
              <span className="hidden sm:inline">Amis</span>
            </Button>
            <Button
              variant={currentView === 'notifications' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('notifications')}
              className="flex items-center space-x-2"
            >
              <Bell size={20} />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
          </div>

          {/* Menu utilisateur */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile_picture} alt={user?.username} />
                    <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => setCurrentView('profile')}>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
