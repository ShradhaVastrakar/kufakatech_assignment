import { z } from 'zod';

export const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

export const chatroomSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title too long'),
});

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  image: z.any().optional(),
}); 