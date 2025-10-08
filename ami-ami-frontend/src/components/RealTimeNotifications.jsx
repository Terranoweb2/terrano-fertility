import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, Check, MessageCircle, Heart, Users, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';
import io from 'socket.io-client';

export default function RealTimeNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
      initializeWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const initializeWebSocket = () => {
    // Connexion WebSocket
    socketRef.current = io('/', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connecté');
    });

    socketRef.current.on('new_notification', (notificationData) => {
      console.log('Nouvelle notification reçue:', notificationData);
      
      // Ajouter la notification à la liste
      setNotifications(prev => [notificationData, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Afficher une notification toast
      showToastNotification(notificationData);
    });

    socketRef.current.on('new_message', (messageData) => {
      console.log('Nouveau message reçu:', messageData);
      
      // Créer une notification pour le message
      const notification = {
        id: `msg_${messageData.id}`,
        type: 'message',
        title: 'Nouveau message',
        message: `${messageData.sender.username} vous a envoyé un message`,
        related_user: messageData.sender,
        created_at: messageData.created_at,
        is_read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      showToastNotification(notification);
    });

    socketRef.current.on('friend_request', (requestData) => {
      console.log('Nouvelle demande d\'ami:', requestData);
      
      const notification = {
        id: `friend_${requestData.id}`,
        type: 'friend_request',
        title: 'Nouvelle demande d\'ami',
        message: `${requestData.sender.username} souhaite être votre ami`,
        related_user: requestData.sender,
        created_at: new Date().toISOString(),
        is_read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      showToastNotification(notification);
    });

    socketRef.current.on('friend_post', (postData) => {
      console.log('Nouveau post d\'un ami:', postData);
      
      const notification = {
        id: `post_${postData.id}`,
        type: 'friend_post',
        title: 'Nouveau post',
        message: `${postData.author.username} a publié quelque chose`,
        related_user: postData.author,
        related_post_id: postData.id,
        created_at: postData.timestamp,
        is_read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket déconnecté');
    });
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await apiService.getNotifications();
      setNotifications(response.notifications || []);
      
      const countResponse = await apiService.getNotificationCount();
      setUnreadCount(countResponse.unread_count || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsRead();
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiService.deleteNotification(notificationId);
      
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
      // Réduire le compteur si la notification n'était pas lue
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const showToastNotification = (notification) => {
    // Créer une notification toast temporaire
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.related_user?.profile_picture || '/favicon.ico',
        tag: notification.id
      });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'like':
        return <Heart size={16} className="text-red-500" />;
      case 'friend_request':
        return <UserPlus size={16} className="text-green-500" />;
      case 'group_invite':
        return <Users size={16} className="text-purple-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);

    if (diffInMinutes < 1) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${Math.floor(diffInMinutes)} min`;
    } else if (diffInMinutes < 1440) {
      return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : 'AA';
  };

  return (
    <div className="relative">
      {/* Bouton de notifications */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setShowNotifications(!showNotifications);
          requestNotificationPermission();
        }}
        className="relative p-2"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel des notifications */}
      {showNotifications && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                  className="h-6 w-6 p-0"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={notification.related_user?.profile_picture} 
                            alt={notification.related_user?.username} 
                          />
                          <AvatarFallback>
                            {getInitials(notification.related_user?.username)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {getNotificationIcon(notification.type)}
                                <span className="text-sm font-medium">
                                  {notification.title}
                                </span>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-400">
                                {formatTime(notification.created_at)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                  title="Marquer comme lu"
                                >
                                  <Check size={12} />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                title="Supprimer"
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
