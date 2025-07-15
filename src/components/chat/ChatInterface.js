import React, { useState, useEffect, useRef, useMemo } from 'react';
import useStore from '../../store/useStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import { MessageSquare } from 'lucide-react';

const ChatInterface = () => {
  const {
    chatrooms,
    currentChatroomId,
    messages,
    sendMessage,
    loadMoreMessages,
  } = useStore();

  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const currentChatroom = chatrooms.find(c => c.id === currentChatroomId);
  const currentMessages = useMemo(() => messages[currentChatroomId] || [], [messages, currentChatroomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0) {
        // Load more messages when scrolled to top
        setPage(prev => prev + 1);
        loadMoreMessages(currentChatroomId, page + 1);
      }
    }
  };

  const handleSendMessage = async (content, image = null) => {
    if (!currentChatroomId) return;

    setIsTyping(true);
    await sendMessage(currentChatroomId, content, image);
    setIsTyping(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  useEffect(() => {
    setPage(1);
  }, [currentChatroomId]);

  if (!currentChatroomId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Select a chatroom
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a chatroom from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentChatroom?.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {currentMessages.length} messages
        </p>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Load More Button */}
        {page > 1 && (
          <div className="text-center">
            <button
              onClick={() => {
                setPage(prev => prev + 1);
                loadMoreMessages(currentChatroomId, page + 1);
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Load more messages
            </button>
          </div>
        )}

        {/* Messages */}
        {currentMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}

        {/* Scroll to bottom anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} isTyping={isTyping} />
    </div>
  );
};

export default ChatInterface; 