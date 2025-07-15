import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUser = message.sender === 'user';

  return (
    <div className={cn(
      "flex mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-xs lg:max-w-md group relative",
        isUser ? "ml-auto" : "mr-auto"
      )}>
        {/* Message Content */}
        <div className={cn(
          "px-4 py-2 rounded-lg break-words relative",
          isUser 
            ? "bg-primary-600 text-white" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        )}>
          {/* Image */}
          {message.image && (
            <div className="mb-2">
              <img
                src={message.image}
                alt="Uploaded"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}
          
          {/* Text Content */}
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className={cn(
              "absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity",
              isUser 
                ? "bg-primary-700 hover:bg-primary-800 text-white" 
                : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
            )}
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs text-gray-500 dark:text-gray-400 mt-1",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 