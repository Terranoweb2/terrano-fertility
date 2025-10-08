import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState([]);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReactions();
    loadComments();
  }, [post.id]);

  const loadReactions = async () => {
    try {
      const reactionsData = await apiService.getPostReactions(post.id);
      setReactions(reactionsData);
    } catch (error) {
      console.error('Erreur lors du chargement des réactions:', error);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await apiService.getPostComments(post.id);
      setComments(commentsData);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const handleReaction = async () => {
    try {
      const userReaction = reactions.find(r => r.user_id === user.id);
      if (userReaction) {
        await apiService.removeReaction(post.id);
      } else {
        await apiService.addReaction(post.id, 'like');
      }
      await loadReactions();
    } catch (error) {
      console.error('Erreur lors de la réaction:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await apiService.addComment(post.id, newComment);
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      try {
        await apiService.deletePost(post.id);
        if (onPostDeleted) {
          onPostDeleted(post.id);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du post:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        await apiService.deleteComment(commentId);
        await loadComments();
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
      }
    }
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : 'AA';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const userReaction = reactions.find(r => r.user_id === user.id);
  const isLiked = !!userReaction;

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.profile_picture} alt={post.author?.username} />
              <AvatarFallback>{getInitials(post.author?.username)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author?.username}</p>
              <p className="text-sm text-gray-500">{formatDate(post.timestamp)}</p>
            </div>
          </div>
          {post.user_id === user.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        
        {/* Actions */}
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReaction}
            className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{reactions.length}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500"
          >
            <MessageCircle size={16} />
            <span>{comments.length}</span>
          </Button>
        </div>

        {/* Section commentaires */}
        {showComments && (
          <div className="border-t pt-4">
            {/* Formulaire d'ajout de commentaire */}
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile_picture} alt={user?.username} />
                  <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Textarea
                    placeholder="Écrivez un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none"
                    disabled={loading}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={!newComment.trim() || loading}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </form>

            {/* Liste des commentaires */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.profile_picture} alt={comment.user?.username} />
                    <AvatarFallback>{getInitials(comment.user?.username)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{comment.user?.username}</p>
                        {comment.user_id === user.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <Trash2 size={12} />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(comment.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
