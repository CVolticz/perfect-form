/**
 * Trainer dashboard page to render the list of trainee under the given trainer
 * Trainer can perform:
 *  1. assign todos tasks to each trainees
 *  2. watch trainee's upload video and add comments
 */
// Library Level Import
import { getServerSession } from 'next-auth';

// API Level Import
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TrainerDashboard from '@/app/components/protected/TrainerDashboard';

export default async function TrainerPage() {

    // Handle user authorization
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'trainer')) {
        return (
            <section className='py-24'>
                <div className='container'>
                    <h1 className='text-red-500 text-2xl font-bold'>
                        ACCESS DENIED!
                    </h1>
                    <p className="text-red-500">
                        You are not authorize to access this page!
                    </p>
                </div>
            </section>
        )
    }
    return (
        <section className="py-24">
            <TrainerDashboard session={session} />
        </section>
    );


}
