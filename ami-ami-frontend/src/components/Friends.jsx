import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, UserMinus, Check, X, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';

export default function Friends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [friendsData, requestsData, usersData] = await Promise.all([
        apiService.getFriends(),
        apiService.getFriendRequests(),
        apiService.getUsers()
      ]);
      
      setFriends(friendsData);
      setFriendRequests(requestsData);
      setAllUsers(usersData.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      await apiService.sendFriendRequest(userId);
      await loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await apiService.acceptFriendRequest(requestId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await apiService.rejectFriendRequest(requestId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors du rejet de la demande:', error);
    }
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : 'AA';
  };

  const filteredUsers = allUsers.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer les utilisateurs qui ne sont pas déjà amis ou qui n'ont pas de demande en cours
  const friendIds = new Set(friends.map(f => f.id));
  const pendingRequestIds = new Set(friendRequests.map(r => r.user_id1));
  
  const availableUsers = filteredUsers.filter(u => 
    !friendIds.has(u.id) && !pendingRequestIds.has(u.id)
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Mes Amis ({friends.length})</TabsTrigger>
          <TabsTrigger value="requests">
            Demandes ({friendRequests.length})
          </TabsTrigger>
          <TabsTrigger value="discover">Découvrir</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mes Amis</CardTitle>
            </CardHeader>
            <CardContent>
              {friends.length === 0 ? (
                <p className="text-center text-gray-500">
                  Vous n'avez pas encore d'amis. Découvrez de nouvelles personnes !
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.profile_picture} alt={friend.username} />
                        <AvatarFallback>{getInitials(friend.username)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{friend.username}</p>
                        <p className="text-sm text-gray-500">{friend.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandes d'amitié reçues</CardTitle>
            </CardHeader>
            <CardContent>
              {friendRequests.length === 0 ? (
                <p className="text-center text-gray-500">
                  Aucune demande d'amitié en attente.
                </p>
              ) : (
                <div className="space-y-4">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.requester?.profile_picture} alt={request.requester?.username} />
                          <AvatarFallback>{getInitials(request.requester?.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{request.requester?.username}</p>
                          <p className="text-sm text-gray-500">{request.requester?.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Découvrir de nouvelles personnes</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Rechercher par nom d'utilisateur ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {availableUsers.length === 0 ? (
                <p className="text-center text-gray-500">
                  {searchTerm ? 'Aucun utilisateur trouvé.' : 'Aucun nouvel utilisateur à découvrir.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {availableUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profile_picture} alt={user.username} />
                          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.bio && (
                            <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSendFriendRequest(user.id)}
                        className="flex items-center space-x-2"
                      >
                        <UserPlus size={16} />
                        <span>Ajouter</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
