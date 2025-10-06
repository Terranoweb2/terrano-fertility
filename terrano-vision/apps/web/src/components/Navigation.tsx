import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, Crown } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../stores/appStore';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSubscribed } = useAppStore();

  // Hide navigation on player page and subscription page
  if (location.pathname.startsWith('/player/') || location.pathname === '/subscription') {
    return null;
  }

  const userIsSubscribed = isSubscribed();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Accueil'
    },
    {
      path: '/subscription',
      icon: Crown,
      label: userIsSubscribed ? 'Premium' : 'S\'abonner',
      highlight: !userIsSubscribed
    },
    {
      path: '/about',
      icon: Info,
      label: 'À propos'
    }
  ];

  return (
    <nav className="flex-shrink-0 bg-dark-800 border-t border-dark-700">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                'flex-1 flex flex-col items-center justify-center py-3 px-4 transition-colors duration-200 relative',
                isActive
                  ? 'text-primary-400 bg-dark-700'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700'
              )}
            >
              {item.highlight && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              )}
              <Icon className={clsx(
                'w-5 h-5 mb-1',
                item.highlight && !isActive && 'text-yellow-400'
              )} />
              <span className={clsx(
                'text-xs font-medium',
                item.highlight && !isActive && 'text-yellow-400'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
