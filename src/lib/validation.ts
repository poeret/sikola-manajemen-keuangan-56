import { z } from 'zod';

// Input validation schemas
export const emailSchema = z.string().email('Format email tidak valid').min(1, 'Email harus diisi');
export const passwordSchema = z.string().min(8, 'Password minimal 8 karakter');
export const nameSchema = z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter');
export const phoneSchema = z.string().regex(/^[0-9+\-\s()]+$/, 'Format nomor telepon tidak valid').optional();
export const amountSchema = z.number().positive('Nominal harus positif');
export const textSchema = z.string().min(1, 'Field harus diisi').max(500, 'Maksimal 500 karakter');

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;]/g, '') // Remove semicolons
    .substring(0, 1000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizeAmount = (amount: number): number => {
  return Math.round(amount * 100) / 100; // Round to 2 decimal places
};
