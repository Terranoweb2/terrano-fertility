import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Image, MapPin, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';
import ImageUpload from './ImageUpload';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [privacy, setPrivacy] = useState('friends');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl) return;

    setLoading(true);
    try {
      const postData = {
        content: content || '',
        image_url: imageUrl,
        post_type: imageUrl ? 'image' : 'text',
        privacy,
        location: location || null
      };

      const newPost = await apiService.createPost(postData);
      
      // Reset form
      setContent('');
      setImageUrl('');
      setLocation('');
      setShowImageUpload(false);
      setPrivacy('friends');
      
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = (url) => {
    setImageUrl(url);
    setShowImageUpload(false);
  };

  const removeImage = () => {
    setImageUrl('');
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : 'AA';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Quoi de neuf ?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profile_picture} alt={user?.username} />
              <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Partagez vos pensées..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={loading}
              />

              {/* Image preview */}
              {imageUrl && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Image à publier"
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                    style={{ maxHeight: '300px' }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}

              {/* Image upload */}
              {showImageUpload && !imageUrl && (
                <ImageUpload onImageUploaded={handleImageUploaded} />
              )}

              {/* Location input */}
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-500" />
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ajouter un lieu (optionnel)"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Options and submit */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-4">
              {/* Image button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="flex items-center space-x-1"
              >
                <Image size={16} />
                <span>Photo</span>
              </Button>

              {/* Privacy selector */}
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Amis</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              disabled={(!content.trim() && !imageUrl) || loading}
              className="flex items-center space-x-2"
            >
              <Send size={16} />
              <span>{loading ? 'Publication...' : 'Publier'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
