/**
 * Page component to handle rendering lesson plan per student
 * TODO: Build this out
 */
// Library Level Import
import { getServerSession } from 'next-auth';

// API Level Import
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import LessonPlan from '@/app/components/protected/LessonPlan'; // Client Component

export default async function LessonPage() {
  const session = await getServerSession(authOptions);

  // Check if the session exists and if the user has the correct role
  if (!session || (session.user.role !== 'user' && session.user.role !== 'admin')) {
    return (
      <section className="py-24">
        <div className="container">
          <h1 className="text-2xl font-bold">You are not authorized to access this page!</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container">
        <h1 className="text-2xl font-bold">Welcome {session.user.name}</h1>
        <LessonPlan session={session} />
      </div>
    </section>
  );
}