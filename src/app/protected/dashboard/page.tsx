/**
 * User Dashboard page component to handle rendering of the user page
 * The page is to display the videos upload by the users and the instructor comments by video
 * TODO: Build this out
 */
// Library Level Import
import { getServerSession } from 'next-auth';

// API Level Import
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Component Level Import
import Dashboard from '@/app/components/protected/Dashboard'; // Client Component

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Check if the session exists and if the user has the correct role
    if (
        !session ||
        (session.user.role !== 'USER' && session.user.role !== 'TRAINER')
    ) {
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
            <Dashboard session={session} />
        </section>
    );

}
