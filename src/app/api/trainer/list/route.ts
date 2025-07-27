'use server';
/**
 * server component to fetch all trainees assigned to a trainer
 */
import { NextRequest, NextResponse } from 'next/server';
import { getTraineesForTrainer } from '@/services/userManagement';

export async function POST(req: NextRequest) {
  const {trainerId, role} = await req.json();

  if (!trainerId || !role) {
    return NextResponse.json({ error: 'Trainer ID and role are required.' }, { status: 400 });
  }
  
  if (!trainerId) {
    return NextResponse.json({ error: 'Trainer ID is required.' }, { status: 400 });
  }

  if (role !== 'TRAINER') {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 403 });
  }

  try {
    const users = await getTraineesForTrainer(trainerId, role);
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
