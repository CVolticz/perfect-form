/**
 * User Profile Page
 * Enable User to change their username and other pertinent imformation
 */
import UserProfileForm from '@/app/components/protected/UserProfileForm';

const Page = async () => {
  return (
    <section className='py-24'>
      <div className='container'>
        <h1 className='text-2xl font-bold'>Profile</h1>
        <UserProfileForm />
      </div>
    </section>
  )
}

export default Page;