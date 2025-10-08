import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PostCard } from './PostCard';
import { Edit, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';

export default function Profile() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      loadUserPosts();
      setEditForm({
        username: user.username || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const loadUserPosts = async () => {
    try {
      const posts = await apiService.getUserPosts(user.id);
      setUserPosts(posts);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await apiService.updateUser(user.id, editForm);
      setEditing(false);
      // Note: Dans une vraie application, nous mettrions à jour le contexte utilisateur
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      username: user.username || '',
      bio: user.bio || ''
    });
    setEditing(false);
  };

  const handlePostDeleted = (postId) => {
    setUserPosts(userPosts.filter(post => post.id !== postId));
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : 'AA';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Carte de profil */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mon Profil</CardTitle>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit size={16} />
                <span>Modifier</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Sauvegarder</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2"
                >
                  <X size={16} />
                  <span>Annuler</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profile_picture} alt={user?.username} />
              <AvatarFallback className="text-2xl">{getInitials(user?.username)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              {!editing ? (
                <>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  {user?.bio && (
                    <div>
                      <h3 className="font-semibold mb-1">À propos</h3>
                      <p className="text-gray-700">{user.bio}</p>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Membre depuis {formatDate(user?.created_at)}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      placeholder="Votre nom d'utilisateur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">À propos</label>
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Parlez-nous de vous..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">{userPosts.length}</p>
              <p className="text-sm text-gray-600">Publications</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">-</p>
              <p className="text-sm text-gray-600">Amis</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">-</p>
              <p className="text-sm text-gray-600">Réactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts de l'utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Publications</CardTitle>
        </CardHeader>
        <CardContent>
          {userPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Vous n'avez pas encore publié de contenu.</p>
              <p className="text-sm mt-2">Partagez vos premières pensées avec vos amis !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onPostDeleted={handlePostDeleted}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
