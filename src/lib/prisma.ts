// utils/db.ts or lib/prisma.ts (recommended for Prisma client instance)
import { PrismaClient } from "@prisma/client";

// Declare a global variable for PrismaClient to prevent multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient instance or use the existing one
export const prisma = global.prisma || new PrismaClient({
  log: ['query'], // Optional: log database queries for debugging
});

// In development, store the PrismaClient instance globally
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}