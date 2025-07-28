'use client';

// import { signIn } from 'next-auth/react'; // Import signIn function
// import Button from '@/app/components/authentication/Button';
import GoogleSignInButton from '@/app/components/authentication/GoogleSignInButton'; // Assuming you might modify or use this
// import TextField from '@/app/components/protected/TextField';

function SignInPage() {

  // // Example for email/password if you add that later
  // const handleEmailSignIn = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   // In a real app, you'd get email/password from the form
  //   // For now, it's just a placeholder for the redirect logic
  //   const email = ((event.currentTarget as HTMLFormElement).elements.namedItem('email') as HTMLInputElement)?.value;
    
  //   // Example: If you were doing email/password with CredentialsProvider
  //   // const result = await signIn('credentials', {
  //   //   email,
  //   //   password: 'some-password', // Get this from form
  //   //   callbackUrl: '/',
  //   //   redirect: false // Set to false to handle redirect manually if errors
  //   // });

  //   // For now, let's just show how email/password redirect *would* work if implemented
  //   // If you're only using Google for now, you can remove this section
  //   console.log('Email sign-in attempted with:', email);
  //   // If you're not using email/password provider, this button will just look like it does nothing.
  //   // You should probably remove it or implement a proper provider.
  // };

  return (
    <section className='flex min-h-full overflow-hidden pt-16 sm:py-28'>
      <div className='mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6'>
        <div className='relative mt-12 sm:mt-16'>
          <h1 className='text-center text-2xl font-medium tracking-tight text-gray-900'>
            Sign in to your account
          </h1>
        </div>
        <div className='sm:rounded-5xl -mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24'>
          <GoogleSignInButton callbackUrl="/" />
        </div>
      </div>
    </section>
  )
}

export default SignInPage;


// <form onSubmit={handleEmailSignIn}> {/* Add onSubmit handler */}
//   <div className='space-y-2'>
//     <TextField
//       id='email'
//       name='email'
//       type='email'
//       label='Sign in with your email'
//       placeholder='hello@me.com'
//       autoComplete='email'
//       required
//     />
//   </div>
//   <Button
//     type='submit' // Keep type='submit' for form submission
//     variant='outline'
//     color='gray'
//     className='mt-3 w-full'
//   >
//     Continue with email
//   </Button>
// </form>
// <div className='mx-auto my-10 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
//   or
// </div>