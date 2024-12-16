import { NextResponse } from 'next/server';

interface LessonPlan {
  title: string;
  description: string;
  activities: string[];
}

const lessonPlans: Record<string, LessonPlan> = {
  '2024-12-15': {
    title: 'Introduction to Algebra',
    description: 'Learn the basics of algebra including variables, equations, and functions.',
    activities: ['Watch Algebra Basics Video', 'Complete Worksheet 1', 'Join Q&A Session'],
  },
  '2024-12-16': {
    title: 'Geometry Basics',
    description: 'Understanding points, lines, planes, and shapes.',
    activities: ['Read Chapter 2 of Math Book', 'Solve 10 geometry problems', 'Attend virtual class'],
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json(
      { error: 'Missing "date" query parameter' },
      { status: 400 }
    );
  }

  const lessonPlan = lessonPlans[date];
  if (!lessonPlan) {
    return NextResponse.json(
      { error: `No lesson plan found for date: ${date}` },
      { status: 404 }
    );
  }

  return NextResponse.json(lessonPlan, { status: 200 });
}
