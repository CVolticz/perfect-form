/**
 * Teacher dashboard page to render the list of students under the given teacher page
 * TODO: Update with student teacher interactions
 */
// System Level Import
import React from 'react';
import StudentCard from '@/app/components/teachers/StudentCard';

// Library Level Import
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Data Import
import { students } from '../../data/students';


export default async function TeacherDashboard() {
    const session = await getServerSession(authOptions);

    // Handle user authorization
    if (session?.user.role !== 'admin') {
        return (
            <section className='py-24'>
                <div className='container'>
                    <h1 className='text-2xl font-bold'>
                        You are not authorize to access this page!
                    </h1>

                </div>
            </section>
        )
    }

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