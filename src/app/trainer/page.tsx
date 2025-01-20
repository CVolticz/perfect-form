/**
 * Trainer dashboard page to render the list of trainee under the given trainer
 * Trainer can perform:
 *  1. assign todos tasks to each trainees
 *  2. watch trainee's upload video and add comments
 */
// System Level Import
import React from 'react';

// Library Level Import
import { getServerSession } from 'next-auth';

// API Level Import
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TraineeCard from '@/app/components/trainers/TraineeCard';

export default async function TrainerPage() {
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

    // Dummy Data
    // TODO: replace with API call
    const cards = [
        {
            name: "James",
            id: "123",
            description: "This is the description for card 1.",
        },
        {
            name: "Bob",
            id: "456",
            description: "This is the description for card 2.",
        },
        {
            name: "Sarah",
            id: "789",
            description: "This is the description for card 3.",
        },
    ];

    return (
        <section className="py-24">
            <div className="container p-5 text-center">
                <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                    {cards.map((card, index) => (
                        <TraineeCard 
                            key={index} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );


}
