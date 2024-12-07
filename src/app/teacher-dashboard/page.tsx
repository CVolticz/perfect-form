'use client';
/**
 * Teacher dashboard page to render the list of students under the given teacher page
 */
import React, { useEffect, useState } from 'react';
import StudentCard from '../../components/StudentCard';

interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  subjects: string[];
}

const TeacherDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  // Mock data fetching (replace with API call)
  useEffect(() => {
    const fetchStudents = async () => {
      // Simulating an API call with a timeout
      const mockData: Student[] = [
        {
          id: 1,
          name: 'Alice Johnson',
          age: 14,
          grade: '9th',
          subjects: ['Math', 'Science', 'English'],
        },
        {
          id: 2,
          name: 'Bob Smith',
          age: 15,
          grade: '10th',
          subjects: ['History', 'Math', 'Art'],
        },
        {
          id: 3,
          name: 'Charlie Brown',
          age: 13,
          grade: '8th',
          subjects: ['Science', 'Physical Education', 'English'],
        },
      ];

      setTimeout(() => {
        setStudents(mockData);
      }, 1000); // Simulating network delay
    };

    fetchStudents();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teacher Dashboard</h1>
      <p>Welcome to your dashboard. Here’s the list of your students:</p>
      <div style={{ marginTop: '20px' }}>
        {students.length > 0 ? (
          students.map((student) => (
            <StudentCard
              key={student.id}
              name={student.name}
              age={student.age}
              grade={student.grade}
              subjects={student.subjects}
            />
          ))
        ) : (
          <p>Loading students...</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
