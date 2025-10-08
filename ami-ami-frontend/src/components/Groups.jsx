import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupPosts, setGroupPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(true);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [showDiscover, setShowDiscover] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadGroupPosts();
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGroupPosts = async () => {
    try {
      const response = await api.get(`/posts?group_id=${selectedGroup.id}`);
      setGroupPosts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des posts du groupe:', error);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const response = await api.post('/groups', {
        name: newGroupName,
        description: newGroupDescription,
        is_private: isPrivate
      });

      setGroups([...groups, response.data]);
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateGroup(false);
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
    }
  };

  const createGroupPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !selectedGroup) return;

    try {
      const response = await api.post('/posts', {
        content: newPost,
        group_id: selectedGroup.id
      });

      setGroupPosts([response.data, ...groupPosts]);
      setNewPost('');
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
    }
  };

  const loadDiscoverGroups = async () => {
    try {
      const response = await api.get('/groups/discover');
      setDiscoverGroups(response.data);
      setShowDiscover(true);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes à découvrir:', error);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/join`);
      loadGroups();
      setDiscoverGroups(discoverGroups.filter(g => g.id !== groupId));
    } catch (error) {
      console.error('Erreur lors de l\'adhésion au groupe:', error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-6">
        {/* Sidebar des groupes */}
        <div className="w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Mes Groupes</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCreateGroup(!showCreateGroup)}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  title="Créer un groupe"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={loadDiscoverGroups}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                  title="Découvrir des groupes"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Formulaire de création de groupe */}
            {showCreateGroup && (
              <form onSubmit={createGroup} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">Créer un nouveau groupe</h3>
                <input
                  type="text"
                  placeholder="Nom du groupe"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description (optionnelle)"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="isPrivate" className="text-sm text-gray-600">
                    Groupe privé (sur invitation uniquement)
                  </label>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateGroup(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {/* Liste des groupes */}
            <div className="space-y-3">
              {groups.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Vous n'appartenez à aucun groupe
                </p>
              ) : (
                groups.map(group => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedGroup?.id === group.id
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <h3 className="font-medium text-gray-800">{group.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{group.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {group.member_count} membre{group.member_count > 1 ? 's' : ''}
                      </span>
                      {group.is_private && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Privé
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Groupes à découvrir */}
          {showDiscover && discoverGroups.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Groupes à découvrir</h3>
              <div className="space-y-3">
                {discoverGroups.map(group => (
                  <div key={group.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800">{group.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {group.member_count} membre{group.member_count > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => joinGroup(group.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Rejoindre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          {selectedGroup ? (
            <div className="bg-white rounded-lg shadow-md">
              {/* En-tête du groupe */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">{selectedGroup.name}</h1>
                <p className="text-gray-600 mt-2">{selectedGroup.description}</p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <span>{selectedGroup.member_count} membre{selectedGroup.member_count > 1 ? 's' : ''}</span>
                  <span className="mx-2">•</span>
                  <span>Créé le {formatDate(selectedGroup.created_at)}</span>
                  {selectedGroup.is_private && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">Privé</span>
                    </>
                  )}
                </div>
              </div>

              {/* Formulaire de création de post */}
              <div className="p-6 border-b border-gray-200">
                <form onSubmit={createGroupPost}>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder={`Partagez quelque chose avec ${selectedGroup.name}...`}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          type="submit"
                          disabled={!newPost.trim()}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Publier
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Posts du groupe */}
              <div className="p-6">
                {groupPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune publication dans ce groupe</p>
                    <p className="text-sm text-gray-400">Soyez le premier à partager quelque chose !</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {groupPosts.map(post => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {post.author.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-800">{post.author.username}</h3>
                              <span className="text-sm text-gray-500">
                                {formatDate(post.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-2">{post.content}</p>
                            <div className="flex items-center space-x-4 mt-3">
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{post.reactions_count}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{post.comments_count}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-xl font-medium text-gray-800 mb-2">Sélectionnez un groupe</h2>
              <p className="text-gray-600">Choisissez un groupe dans la liste pour voir ses publications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;
