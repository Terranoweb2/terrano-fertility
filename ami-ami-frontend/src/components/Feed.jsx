import { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { apiService } from '../lib/api';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const feedData = await apiService.getFeed();
      setPosts(feedData);
    } catch (error) {
      console.error('Erreur lors du chargement du fil d\'actualité:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center">Chargement du fil d'actualité...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <CreatePost onPostCreated={handlePostCreated} />
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>Aucun post à afficher.</p>
          <p className="text-sm mt-2">Ajoutez des amis pour voir leurs publications !</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
