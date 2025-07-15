import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '../../utils/validation';
import { Send, Image, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const MessageInput = ({ onSendMessage, isTyping }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = watch('content');

  const onSubmit = (data) => {
    if (data.content.trim() || selectedImage) {
      onSendMessage(data.content, selectedImage);
      reset();
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-20 rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end space-x-2">
        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          disabled={isTyping}
        >
          <Image className="w-5 h-5" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            {...register('content')}
            placeholder="Type your message..."
            onKeyPress={handleKeyPress}
            disabled={isTyping}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none",
              errors.content && "border-red-500 focus:ring-red-500",
              isTyping && "opacity-50 cursor-not-allowed"
            )}
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          {errors.content && (
            <p className="absolute -bottom-6 left-0 text-xs text-red-600 dark:text-red-400">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isTyping || (!messageContent?.trim() && !selectedImage)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            (!messageContent?.trim() && !selectedImage) || isTyping
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700 text-white"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput; 