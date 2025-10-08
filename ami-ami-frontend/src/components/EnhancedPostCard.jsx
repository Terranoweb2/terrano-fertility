import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, MapPin, Globe, Users, Lock, MoreHorizontal } from 'lucide-react';
import { apiService } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function EnhancedPostCard({ post, onPostUpdate }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.reactions_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = async () => {
    try {
      if (liked) {
        await apiService.removeReaction(post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await apiService.addReaction(post.id, 'like');
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Erreur lors de la réaction:', error);
    }
  };

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setLoadingComments(true);
    try {
      const response = await apiService.getComments(post.id);
      setComments(response);
      setShowComments(true);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const comment = await apiService.addComment(post.id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        year: diffInHours > 8760 ? 'numeric' : undefined
      });
    }
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'public':
        return <Globe size={14} className="text-green-500" />;
      case 'friends':
        return <Users size={14} className="text-blue-500" />;
      case 'private':
        return <Lock size={14} className="text-gray-500" />;
      default:
        return <Users size={14} className="text-blue-500" />;
    }
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : 'AA';
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.profile_picture} alt={post.author?.username} />
              <AvatarFallback>{getInitials(post.author?.username)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm">{post.author?.username}</h3>
                {post.group && (
                  <>
                    <span className="text-gray-400">→</span>
                    <Badge variant="secondary" className="text-xs">
                      {post.group.name}
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatTime(post.timestamp)}</span>
                {getPrivacyIcon(post.privacy)}
                {post.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <MapPin size={12} />
                      <span>{post.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post content */}
        {post.content && (
          <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
        )}

        {/* Post image */}
        {post.image_url && (
          <div className="mb-4">
            <img
              src={post.image_url}
              alt="Post image"
              className="w-full h-auto rounded-lg border border-gray-200 cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => {
                // Ouvrir l'image en grand (modal)
                window.open(post.image_url, '_blank');
              }}
            />
          </div>
        )}

        {/* Post stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b">
          <div className="flex items-center space-x-4">
            {likesCount > 0 && (
              <span>{likesCount} j'aime{likesCount > 1 ? 's' : ''}</span>
            )}
            {post.comments_count > 0 && (
              <span>{post.comments_count} commentaire{post.comments_count > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                liked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart size={18} className={liked ? 'fill-current' : ''} />
              <span>J'aime</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={loadComments}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
              disabled={loadingComments}
            >
              <MessageCircle size={18} />
              <span>{loadingComments ? 'Chargement...' : 'Commenter'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-green-500"
            >
              <Share2 size={18} />
              <span>Partager</span>
            </Button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            {/* Comment form */}
            <form onSubmit={submitComment} className="mb-4">
              <div className="flex space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile_picture} alt={user?.username} />
                  <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Écrivez un commentaire..."
                    className="min-h-[60px] resize-none"
                    disabled={submittingComment}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim() || submittingComment}
                    >
                      {submittingComment ? 'Envoi...' : 'Commenter'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments list */}
            <div className="space-y-3">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.profile_picture} alt={comment.author?.username} />
                    <AvatarFallback>{getInitials(comment.author?.username)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.author?.username}</span>
                        <span className="text-xs text-gray-500">{formatTime(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>
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
