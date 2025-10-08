import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, FileText, Hash, MapPin, Calendar, Filter } from 'lucide-react';
import { apiService } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function AdvancedSearch() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    users: [],
    posts: [],
    groups: [],
    hashtags: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    location: '',
    postType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (query.trim().length > 2) {
      // Debounce search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        performSearch();
      }, 300);
    } else {
      setResults({ users: [], posts: [], groups: [], hashtags: [] });
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, filters]);

  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Recherche d'utilisateurs
      const usersResponse = await apiService.searchUsers(query);
      
      // Recherche de posts
      const postsResponse = await apiService.searchPosts(query, filters);
      
      // Recherche de groupes
      const groupsResponse = await apiService.searchGroups(query);
      
      // Extraction des hashtags
      const hashtags = extractHashtags(query);

      setResults({
        users: usersResponse || [],
        posts: postsResponse || [],
        groups: groupsResponse || [],
        hashtags: hashtags
      });
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#[\w\u00C0-\u017F]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const followUser = async (userId) => {
    try {
      await apiService.sendFriendRequest(userId);
      // Mettre à jour l'état local
      setResults(prev => ({
        ...prev,
        users: prev.users.map(u => 
          u.id === userId ? { ...u, friendship_status: 'pending' } : u
        )
      }));
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await apiService.joinGroup(groupId);
      // Mettre à jour l'état local
      setResults(prev => ({
        ...prev,
        groups: prev.groups.map(g => 
          g.id === groupId ? { ...g, is_member: true } : g
        )
      }));
    } catch (error) {
      console.error('Erreur lors de l\'adhésion au groupe:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : 'AA';
  };

  const getTotalResults = () => {
    return results.users.length + results.posts.length + results.groups.length + results.hashtags.length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search size={20} />
            <span>Recherche avancée</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barre de recherche principale */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher des personnes, posts, groupes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Filter size={16} />
              </Button>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Période</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Toute période</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lieu</label>
                  <Input
                    type="text"
                    placeholder="Filtrer par lieu"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type de contenu</label>
                  <select
                    value={filters.postType}
                    onChange={(e) => setFilters(prev => ({ ...prev, postType: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Tous les types</option>
                    <option value="text">Texte seulement</option>
                    <option value="image">Avec images</option>
                    <option value="video">Avec vidéos</option>
                  </select>
                </div>
              </div>
            )}

            {/* Indicateur de chargement */}
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-600">Recherche en cours...</span>
              </div>
            )}

            {/* Résumé des résultats */}
            {query.trim() && !loading && (
              <div className="text-sm text-gray-600">
                {getTotalResults()} résultat{getTotalResults() > 1 ? 's' : ''} pour "{query}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      {query.trim() && !loading && getTotalResults() > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              Tout ({getTotalResults()})
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users size={16} className="mr-1" />
              Personnes ({results.users.length})
            </TabsTrigger>
            <TabsTrigger value="posts">
              <FileText size={16} className="mr-1" />
              Posts ({results.posts.length})
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users size={16} className="mr-1" />
              Groupes ({results.groups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Utilisateurs */}
            {results.users.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personnes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.users.slice(0, 3).map(searchUser => (
                      <div key={searchUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={searchUser.profile_picture} alt={searchUser.username} />
                            <AvatarFallback>{getInitials(searchUser.username)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{searchUser.username}</h3>
                            <p className="text-sm text-gray-600">{searchUser.bio}</p>
                          </div>
                        </div>
                        {searchUser.id !== user.id && (
                          <Button
                            size="sm"
                            onClick={() => followUser(searchUser.id)}
                            disabled={searchUser.friendship_status === 'pending'}
                          >
                            {searchUser.friendship_status === 'pending' ? 'En attente' : 'Ajouter'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {results.posts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Publications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.posts.slice(0, 3).map(post => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author?.profile_picture} alt={post.author?.username} />
                            <AvatarFallback>{getInitials(post.author?.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-sm">{post.author?.username}</span>
                              <span className="text-xs text-gray-500">{formatTime(post.timestamp)}</span>
                              {post.location && (
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <MapPin size={12} />
                                  <span>{post.location}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-800 line-clamp-3">{post.content}</p>
                            {post.image_url && (
                              <img
                                src={post.image_url}
                                alt="Post image"
                                className="mt-2 max-w-full h-32 object-cover rounded"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Groupes */}
            {results.groups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Groupes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.groups.slice(0, 3).map(group => (
                      <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-sm text-gray-600">{group.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {group.member_count} membre{group.member_count > 1 ? 's' : ''}
                            </span>
                            {group.is_private && (
                              <Badge variant="secondary" className="text-xs">Privé</Badge>
                            )}
                          </div>
                        </div>
                        {!group.is_member && (
                          <Button
                            size="sm"
                            onClick={() => joinGroup(group.id)}
                            disabled={group.is_private}
                          >
                            {group.is_private ? 'Privé' : 'Rejoindre'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {results.users.map(searchUser => (
                    <div key={searchUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={searchUser.profile_picture} alt={searchUser.username} />
                          <AvatarFallback>{getInitials(searchUser.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{searchUser.username}</h3>
                          <p className="text-sm text-gray-600">{searchUser.bio}</p>
                        </div>
                      </div>
                      {searchUser.id !== user.id && (
                        <Button
                          size="sm"
                          onClick={() => followUser(searchUser.id)}
                          disabled={searchUser.friendship_status === 'pending'}
                        >
                          {searchUser.friendship_status === 'pending' ? 'En attente' : 'Ajouter'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {results.posts.map(post => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author?.profile_picture} alt={post.author?.username} />
                          <AvatarFallback>{getInitials(post.author?.username)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-sm">{post.author?.username}</span>
                            <span className="text-xs text-gray-500">{formatTime(post.timestamp)}</span>
                            {post.location && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <MapPin size={12} />
                                <span>{post.location}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-800">{post.content}</p>
                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt="Post image"
                              className="mt-2 max-w-full h-48 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {results.groups.map(group => (
                    <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-gray-600">{group.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {group.member_count} membre{group.member_count > 1 ? 's' : ''}
                          </span>
                          {group.is_private && (
                            <Badge variant="secondary" className="text-xs">Privé</Badge>
                          )}
                        </div>
                      </div>
                      {!group.is_member && (
                        <Button
                          size="sm"
                          onClick={() => joinGroup(group.id)}
                          disabled={group.is_private}
                        >
                          {group.is_private ? 'Privé' : 'Rejoindre'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Aucun résultat */}
      {query.trim() && !loading && getTotalResults() === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600">
              Essayez avec d'autres mots-clés ou modifiez vos filtres de recherche.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
