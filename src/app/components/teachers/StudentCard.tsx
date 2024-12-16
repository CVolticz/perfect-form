/**
 * Functional component to render and display student information
 * TODOs
 */
// system level import
import React from 'react';

/**
 * StudentCard Interfact
 */
interface StudentCardProps {
    name: string;
    age: number;
    grade: string;
    subjects: string[];
}

function StudentCard({name, age, grade, subjects}: StudentCardProps) {
    return (
        <div
        style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        >
        <h3>{name}</h3>
        <p>
            <strong>Age:</strong> {age}
        </p>
        <p>
            <strong>Grade:</strong> {grade}
        </p>
        <p>
            <strong>Subjects:</strong> {subjects.join(', ')}
        </p>
        </div>
    );
};
    
export default StudentCard;
