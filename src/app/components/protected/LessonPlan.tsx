// components/LessonClient.tsx (Client Component)
// TODOs: Actually make this better!
'use client';

import { useState, useEffect } from 'react';
import { Session } from 'next-auth';

interface LessonPlan {
  title: string;
  description: string;
  activities: string[];
}

interface LessonClientProps {
  session: Session;
}

const LessonPlan: React.FC<LessonClientProps> = ({ session }) => {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessonPlan = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const response = await fetch(`/api/lesson-plan?date=${today}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lesson plan');
        }
        const data: LessonPlan = await response.json();
        setLessonPlan(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonPlan();
  }, []);

  if (loading) return <p>Loading today's lesson plan...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Hello {session.user.name}! Here is Today's Lesson Plan</h1>
      {lessonPlan ? (
        <div>
          <h2>{lessonPlan.title}</h2>
          <p>{lessonPlan.description}</p>
          <ul>
            {lessonPlan.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No lesson plan available for today.</p>
      )}
    </div>
  );
};

export default LessonPlan;
