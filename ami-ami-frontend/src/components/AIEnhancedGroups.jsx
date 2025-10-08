import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  Search, 
  Settings, 
  Crown, 
  Shield, 
  UserPlus, 
  MessageCircle,
  TrendingUp,
  Sparkles,
  Brain,
  Target
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';

export default function AIEnhancedGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupPosts, setGroupPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [groupAnalytics, setGroupAnalytics] = useState(null);
  const [recommendedGroups, setRecommendedGroups] = useState([]);

  // Formulaire de création de groupe
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    category: '',
    is_private: true,
    auto_approve: false,
    ai_moderation: true
  });

  useEffect(() => {
    loadGroups();
    loadRecommendedGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadGroupPosts();
      loadGroupAnalytics();
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const response = await apiService.getGroups();
      setGroups(response);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedGroups = async () => {
    try {
      // Utiliser l'IA pour recommander des groupes basés sur les intérêts de l'utilisateur
      const response = await apiService.getRecommendedGroups();
      setRecommendedGroups(response);
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
    }
  };

  const loadGroupPosts = async () => {
    try {
      const response = await apiService.getGroupPosts(selectedGroup.id);
      setGroupPosts(response);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    }
  };

  const loadGroupAnalytics = async () => {
    try {
      const response = await apiService.getGroupAnalytics(selectedGroup.id);
      setGroupAnalytics(response);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    }
  };

  const generateAISuggestions = async (content) => {
    if (!content.trim()) {
      setAiSuggestions([]);
      return;
    }

    try {
      // Utiliser l'API OpenRouter pour générer des suggestions
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          context: 'group_post',
          group_id: selectedGroup?.id
        })
      });

      const data = await response.json();
      setAiSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Erreur lors de la génération de suggestions:', error);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    
    try {
      // Utiliser l'IA pour optimiser la description du groupe
      const optimizedDescription = await optimizeGroupDescription(newGroupData.description);
      
      const groupData = {
        ...newGroupData,
        description: optimizedDescription
      };

      const response = await apiService.createGroup(groupData);
      setGroups([...groups, response]);
      setShowCreateGroup(false);
      setNewGroupData({
        name: '',
        description: '',
        category: '',
        is_private: true,
        auto_approve: false,
        ai_moderation: true
      });
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
    }
  };

  const optimizeGroupDescription = async (description) => {
    try {
      const response = await fetch('/api/ai/optimize-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description })
      });

      const data = await response.json();
      return data.optimized_description || description;
    } catch (error) {
      console.error('Erreur lors de l\'optimisation:', error);
      return description;
    }
  };

  const createGroupPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !selectedGroup) return;

    try {
      const response = await apiService.createPost({
        content: newPost,
        group_id: selectedGroup.id
      });

      setGroupPosts([response, ...groupPosts]);
      setNewPost('');
      setAiSuggestions([]);
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await apiService.joinGroup(groupId);
      loadGroups();
      setRecommendedGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (error) {
      console.error('Erreur lors de l\'adhésion:', error);
    }
  };

  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : 'GR';
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-1/3 space-y-6">
          {/* Mes Groupes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users size={20} />
                  <span>Mes Groupes</span>
                </CardTitle>
                <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus size={16} className="mr-1" />
                      Créer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Sparkles size={20} className="text-purple-500" />
                        <span>Créer un groupe avec IA</span>
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={createGroup} className="space-y-4">
                      <Input
                        placeholder="Nom du groupe"
                        value={newGroupData.name}
                        onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                      
                      <Select 
                        value={newGroupData.category} 
                        onValueChange={(value) => setNewGroupData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technologie</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="music">Musique</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="education">Éducation</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="lifestyle">Style de vie</SelectItem>
                        </SelectContent>
                      </Select>

                      <Textarea
                        placeholder="Description du groupe (l'IA l'optimisera automatiquement)"
                        value={newGroupData.description}
                        onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="private"
                            checked={newGroupData.is_private}
                            onChange={(e) => setNewGroupData(prev => ({ ...prev, is_private: e.target.checked }))}
                          />
                          <label htmlFor="private" className="text-sm">Groupe privé</label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="auto_approve"
                            checked={newGroupData.auto_approve}
                            onChange={(e) => setNewGroupData(prev => ({ ...prev, auto_approve: e.target.checked }))}
                          />
                          <label htmlFor="auto_approve" className="text-sm">Approbation automatique</label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="ai_moderation"
                            checked={newGroupData.ai_moderation}
                            onChange={(e) => setNewGroupData(prev => ({ ...prev, ai_moderation: e.target.checked }))}
                          />
                          <label htmlFor="ai_moderation" className="text-sm flex items-center">
                            <Brain size={14} className="mr-1 text-purple-500" />
                            Modération IA
                          </label>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button type="submit" className="flex-1">
                          <Sparkles size={16} className="mr-1" />
                          Créer avec IA
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCreateGroup(false)}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groups.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    Aucun groupe rejoint
                  </p>
                ) : (
                  groups.map(group => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedGroup?.id === group.id
                          ? 'bg-blue-100 border-blue-300 shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={group.cover_image} alt={group.name} />
                          <AvatarFallback>{getInitials(group.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{group.name}</h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatNumber(group.member_count)} membres</span>
                            {group.is_private && <Badge variant="secondary" className="text-xs">Privé</Badge>}
                            {group.ai_moderation && <Brain size={12} className="text-purple-500" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Groupes recommandés par IA */}
          {recommendedGroups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target size={20} className="text-green-500" />
                  <span>Recommandés pour vous</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendedGroups.slice(0, 3).map(group => (
                    <div key={group.id} className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={group.cover_image} alt={group.name} />
                            <AvatarFallback>{getInitials(group.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{group.name}</h4>
                            <p className="text-xs text-gray-600">{formatNumber(group.member_count)} membres</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => joinGroup(group.id)}
                          className="text-xs"
                        >
                          Rejoindre
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{group.description}</p>
                      <div className="flex items-center mt-2">
                        <Sparkles size={12} className="text-purple-500 mr-1" />
                        <span className="text-xs text-purple-600">Recommandé par IA</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          {selectedGroup ? (
            <div className="space-y-6">
              {/* En-tête du groupe */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedGroup.cover_image} alt={selectedGroup.name} />
                        <AvatarFallback className="text-lg">{getInitials(selectedGroup.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold">{selectedGroup.name}</h1>
                        <p className="text-gray-600 mt-1">{selectedGroup.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{formatNumber(selectedGroup.member_count)} membres</span>
                          <span>•</span>
                          <span>{selectedGroup.category}</span>
                          {selectedGroup.is_private && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary">Privé</Badge>
                            </>
                          )}
                          {selectedGroup.ai_moderation && (
                            <>
                              <span>•</span>
                              <div className="flex items-center">
                                <Brain size={14} className="text-purple-500 mr-1" />
                                <span>Modération IA</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings size={16} className="mr-1" />
                      Gérer
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Analytics du groupe */}
              {groupAnalytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp size={20} />
                      <span>Statistiques du groupe</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                          {formatNumber(groupAnalytics.posts_this_week)}
                        </div>
                        <div className="text-sm text-gray-600">Posts cette semaine</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {formatNumber(groupAnalytics.active_members)}
                        </div>
                        <div className="text-sm text-gray-600">Membres actifs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">
                          {groupAnalytics.engagement_rate}%
                        </div>
                        <div className="text-sm text-gray-600">Taux d'engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">
                          {formatNumber(groupAnalytics.new_members_this_month)}
                        </div>
                        <div className="text-sm text-gray-600">Nouveaux membres</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Création de post avec IA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle size={20} />
                    <span>Partager dans le groupe</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createGroupPost} className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profile_picture} alt={user?.username} />
                        <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          value={newPost}
                          onChange={(e) => {
                            setNewPost(e.target.value);
                            generateAISuggestions(e.target.value);
                          }}
                          placeholder={`Partagez quelque chose avec ${selectedGroup.name}...`}
                          className="min-h-[100px] resize-none"
                          rows="4"
                        />
                        
                        {/* Suggestions IA */}
                        {aiSuggestions.length > 0 && (
                          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Sparkles size={16} className="text-purple-500" />
                              <span className="text-sm font-medium text-purple-700">Suggestions IA</span>
                            </div>
                            <div className="space-y-2">
                              {aiSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setNewPost(suggestion)}
                                  className="block w-full text-left p-2 text-sm bg-white rounded border hover:bg-purple-50 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end mt-3">
                          <Button
                            type="submit"
                            disabled={!newPost.trim()}
                          >
                            <Sparkles size={16} className="mr-1" />
                            Publier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Posts du groupe */}
              <div className="space-y-4">
                {groupPosts.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune publication</h3>
                      <p className="text-gray-600">Soyez le premier à partager quelque chose dans ce groupe !</p>
                    </CardContent>
                  </Card>
                ) : (
                  groupPosts.map(post => (
                    <Card key={post.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.author?.profile_picture} alt={post.author?.username} />
                            <AvatarFallback>{getInitials(post.author?.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">{post.author?.username}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(post.timestamp).toLocaleDateString('fr-FR')}
                              </span>
                              {post.ai_generated && (
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles size={12} className="mr-1" />
                                  IA
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                            {post.image_url && (
                              <img
                                src={post.image_url}
                                alt="Post image"
                                className="mt-3 max-w-full h-auto rounded-lg"
                              />
                            )}
                            <div className="flex items-center space-x-4 mt-3">
                              <Button variant="ghost" size="sm">
                                <span>{post.reactions_count} J'aime</span>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <span>{post.comments_count} Commentaires</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ) : (
            <Card className="h-96">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Users size={64} className="mx-auto mb-4 text-gray-300" />
                  <h2 className="text-xl font-medium text-gray-800 mb-2">Sélectionnez un groupe</h2>
                  <p className="text-gray-600">Choisissez un groupe dans la liste pour voir son contenu</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
