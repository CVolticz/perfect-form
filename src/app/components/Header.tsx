import Link from 'next/link';
import SignInButton from '@/app/components/authentication/SignInButton';

const Header = () => {
  return (
    <header className='flex h-24 flex-col justify-center bg-stone-100'>
      <nav className='container'>
        <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
          <li className='text-sm'>
            <Link href='/'>Home</Link>
          </li>
          <li className='text-sm'>
            <Link href='/protected/dashboard'> User Dashboard </Link>
          </li>
          <li className='text-sm'>
            <Link href='/protected/lesson'> Lesson Plan </Link>
          </li>
          <li>
            <SignInButton />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header