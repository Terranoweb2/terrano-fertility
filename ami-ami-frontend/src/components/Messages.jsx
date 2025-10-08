import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.user.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const response = await api.get('/messages');
      setConversations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await api.post('/messages', {
        receiver_id: selectedConversation.user.id,
        content: newMessage
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      
      // Mettre à jour la conversation dans la liste
      loadConversations();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const searchForUsers = async (query) => {
    if (!query.trim()) {
      setSearchUsers([]);
      return;
    }

    try {
      const response = await api.get(`/users?search=${encodeURIComponent(query)}`);
      setSearchUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    }
  };

  const startNewConversation = (selectedUser) => {
    setSelectedConversation({
      user: selectedUser,
      last_message: null,
      unread_count: 0
    });
    setMessages([]);
    setShowNewChat(false);
    setSearchQuery('');
    setSearchUsers([]);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Liste des conversations */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <button
              onClick={() => setShowNewChat(!showNewChat)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {showNewChat && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchForUsers(e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchUsers.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  {searchUsers.map(searchUser => (
                    <div
                      key={searchUser.id}
                      onClick={() => startNewConversation(searchUser)}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {searchUser.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{searchUser.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Aucune conversation</p>
              <p className="text-sm">Commencez une nouvelle conversation !</p>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.user.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.user.id === conversation.user.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {conversation.user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.user.username}
                      </h3>
                      {conversation.last_message && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message.content}
                      </p>
                    )}
                    {conversation.unread_count > 0 && (
                      <span className="inline-block bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* En-tête du chat */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {selectedConversation.user.username.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="font-medium text-gray-900">
                  {selectedConversation.user.username}
                </h3>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulaire d'envoi */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium">Sélectionnez une conversation</p>
              <p className="text-sm">Choisissez une conversation existante ou commencez-en une nouvelle</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
