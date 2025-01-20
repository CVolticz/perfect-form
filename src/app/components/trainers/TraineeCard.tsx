"use client";
/**
 * Trainee Card Component to be render when called
 */
// Library Level Import
import React from "react";

/**
 * TraineeCard Interface
 * @param name - name of the trainee
 * @param id - user id of the trainee
 */
interface TraineeCardProps {
  name: string;
  id: string;
  description: string;
}

export default function TraineeCard({ name, id, description}: TraineeCardProps) {

    /**
     * TODO: Implement an Onclick function to call on the trainee card record
     */
    return (
        <div 
            className="border border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg bg-gray-50 max-w-xs mx-auto"
            // onClick={onClick}
        >
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <p className="text-gray-600 mb-4">{id}</p>
            <p className="text-gray-600 mb-4">{description}</p>
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Learn More
            </button>
        </div>
     );
}