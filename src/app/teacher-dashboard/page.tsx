/**
 * Teacher dashboard page to render the list of students under the given teacher page
 */
// System Level Import
import React, { useEffect, useState } from 'react';
import StudentCard from '../../components/StudentCard';

// Library Level Import
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';


interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  subjects: string[];
}

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
        <div>
            <h1>Hello World</h1>
        </div>
    );
}

    // // enable admin to access this page
    // const [students, setStudents] = useState<Student[]>([]);


    // // Mock data fetching (replace with API call)
    // useEffect(() => {
    // const fetchStudents = async () => {
    //     // Simulating an API call with a timeout
    //     const mockData: Student[] = [
    //     {
    //         id: 1,
    //         name: 'Alice Johnson',
    //         age: 14,
    //         grade: '9th',
    //         subjects: ['Math', 'Science', 'English'],
    //     },
    //     {
    //         id: 2,
    //         name: 'Bob Smith',
    //         age: 15,
    //         grade: '10th',
    //         subjects: ['History', 'Math', 'Art'],
    //     },
    //     {
    //         id: 3,
    //         name: 'Charlie Brown',
    //         age: 13,
    //         grade: '8th',
    //         subjects: ['Science', 'Physical Education', 'English'],
    //     },
    //     ];

    //     setTimeout(() => {
    //     setStudents(mockData);
    //     }, 1000); // Simulating network delay
    // };

    // fetchStudents();
    // }, []);

    // return (
    //     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    //         <h1>Teacher Dashboard</h1>
    //         <p>Welcome to your dashboard. Here’s the list of your students:</p>
    //         <div style={{ marginTop: '20px' }}>
    //         {students.length > 0 ? (
    //             students.map((student) => (
    //             <StudentCard
    //                 key={student.id}
    //                 name={student.name}
    //                 age={student.age}
    //                 grade={student.grade}
    //                 subjects={student.subjects}
    //             />
    //             ))
    //         ) : (
    //             <p>Loading students...</p>
    //         )}
    //         </div>
    //     </div>
//     );
// };