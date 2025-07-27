'use server';
/**
 * Server Component to Unassign a given user from a trainer
 */
import { NextRequest, NextResponse } from 'next/server';
import { unassignTraineeFromTrainer } from '@/services/userManagement';

export async function POST(req: NextRequest) {
  const { traineeId, trainerId } = await req.json();

  try {
    await unassignTraineeFromTrainer(traineeId, trainerId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
