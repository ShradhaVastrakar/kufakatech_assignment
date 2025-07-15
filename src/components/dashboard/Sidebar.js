import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chatroomSchema } from '../../utils/validation';
import useStore from '../../store/useStore';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  LogOut, 
  Moon, 
  Sun,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const {
    chatrooms,
    currentChatroomId,
    darkMode,
    setCurrentChatroom,
    createChatroom,
    deleteChatroom,
    setDarkMode,
    logout,
  } = useStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(chatroomSchema),
  });

  const filteredChatrooms = useMemo(() => {
    return chatrooms.filter(chatroom =>
      chatroom.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatrooms, searchQuery]);

  const onSubmit = (data) => {
    createChatroom(data.title);
    reset();
    setShowCreateForm(false);
  };

  const handleDeleteChatroom = (e, chatroomId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chatroom?')) {
      deleteChatroom(chatroomId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Gemini Chat
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chatrooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Create Chatroom Button */}
      <div className="p-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full flex items-center justify-center py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </button>
      </div>

      {/* Create Chatroom Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Create New Chatroom
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <input
              {...register('title')}
              placeholder="Enter chatroom title..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chatrooms List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChatrooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No chatrooms found' : 'No chatrooms yet'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                onClick={() => setCurrentChatroom(chatroom.id)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group",
                  currentChatroomId === chatroom.id
                    ? "bg-primary-100 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <MessageSquare className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chatroom.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(chatroom.updatedAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteChatroom(e, chatroom.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center py-2 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 