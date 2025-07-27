'use server';
/**
 * Server Component to Grab all users from DB
 */
import { NextResponse } from 'next/server';
import { getAllUsersWithRolesAndAssignments } from '@/services/userManagement';

export async function GET() {
  try {
    const users = await getAllUsersWithRolesAndAssignments();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
