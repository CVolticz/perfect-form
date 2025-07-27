/**
 * Server component to handle changing user roles
 */
'use server'

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function PATCH(req: NextRequest) {
  const { userId, newRole } = await req.json();

  if (!userId || !newRole || !Object.values(Role).includes(newRole)) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
