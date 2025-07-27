'use server';
/**
 * Server Component to assign a given user to a trainer
 */
import { NextRequest, NextResponse } from 'next/server';
import { assignTraineeToTrainer } from '@/services/userManagement';

export async function POST(req: NextRequest) {
  const { traineeId, trainerId } = await req.json();

  try {
    const result = await assignTraineeToTrainer(traineeId, trainerId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
