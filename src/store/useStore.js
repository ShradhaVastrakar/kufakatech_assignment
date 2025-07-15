import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateAIResponse } from '../utils/api';

const useStore = create(
  persist(
    (set, get) => ({
      // Authentication
      user: null,
      isAuthenticated: false,
      
      // UI State
      darkMode: false,
      isLoading: false,
      
      // Chatrooms
      chatrooms: [],
      currentChatroomId: null,
      
      // Messages
      messages: {},
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setDarkMode: (darkMode) => set({ darkMode }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      // Chatroom actions
      createChatroom: (title) => {
        const newChatroom = {
          id: Date.now().toString(),
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
          messages: {
            ...state.messages,
            [newChatroom.id]: []
          }
        }));
        
        return newChatroom;
      },
      
      deleteChatroom: (chatroomId) => {
        set((state) => {
          const updatedChatrooms = state.chatrooms.filter(c => c.id !== chatroomId);
          const updatedMessages = { ...state.messages };
          delete updatedMessages[chatroomId];
          
          return {
            chatrooms: updatedChatrooms,
            messages: updatedMessages,
            currentChatroomId: state.currentChatroomId === chatroomId ? null : state.currentChatroomId
          };
        });
      },
      
      setCurrentChatroom: (chatroomId) => set({ currentChatroomId: chatroomId }),
      
      // Message actions
      addMessage: (chatroomId, message) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [chatroomId]: [...(state.messages[chatroomId] || []), message]
          }
        }));
        
        // Update chatroom's updatedAt
        set((state) => ({
          chatrooms: state.chatrooms.map(c => 
            c.id === chatroomId 
              ? { ...c, updatedAt: new Date().toISOString() }
              : c
          )
        }));
      },
      
      sendMessage: async (chatroomId, content, image = null) => {
        const userMessage = {
          id: Date.now().toString(),
          content,
          image,
          sender: 'user',
          timestamp: new Date().toISOString(),
        };
        
        get().addMessage(chatroomId, userMessage);
        
        // Simulate AI response
        setTimeout(async () => {
          const aiResponse = await generateAIResponse(content);
          const aiMessage = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            sender: 'ai',
            timestamp: new Date().toISOString(),
          };
          
          get().addMessage(chatroomId, aiMessage);
        }, 1000);
      },
      
      // Load more messages (for infinite scroll)
      loadMoreMessages: (chatroomId, page = 1) => {
        // Simulate loading older messages
        const dummyMessages = Array.from({ length: 20 }, (_, i) => ({
          id: `old-${chatroomId}-${page}-${i}`,
          content: `This is an older message ${page}-${i}`,
          sender: Math.random() > 0.5 ? 'user' : 'ai',
          timestamp: new Date(Date.now() - (page * 20 + i) * 60000).toISOString(),
        }));
        
        set((state) => ({
          messages: {
            ...state.messages,
            [chatroomId]: [...dummyMessages, ...(state.messages[chatroomId] || [])]
          }
        }));
      },
      
      // Logout
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        chatrooms: [], 
        messages: {}, 
        currentChatroomId: null 
      }),
    }),
    {
      name: 'gemini-chat-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        darkMode: state.darkMode,
        chatrooms: state.chatrooms,
        messages: state.messages,
        currentChatroomId: state.currentChatroomId,
      }),
    }
  )
);

export default useStore; 