/**
 * Page Component to Handle User Upload Assignment
 * TODO: Handle Serverside Render of Assignment Upload & Feedbacks
 */
// Library Level Import
import { getServerSession } from 'next-auth';

// API Level Import
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Components Level Import
import VideoUpload from '@/app/components/protected/VideoUpload';

export default async function AvatarUploadPage() {
  const session = await getServerSession(authOptions);

  // Handle user authorization
  if (!session || (!session.user)) {
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
        <h1> Hello {session.user.name}</h1>
        <h1 className="text-2xl font-bold mb-4">Upload Your Avatar</h1>
        <VideoUpload />
      </div>
    </section>
  );
}
