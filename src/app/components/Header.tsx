import Link from 'next/link';
import UserMenu from '@/app/components/authentication/UserMenu';


function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link 
            href="/"
            className="text-lg font-bold text-red-600">
              Perfect Form
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="relative font-medium text-red-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-red-600"
            >
              Home
            </Link>
            <Link href="/services" className="text-black hover:text-red-600">Services</Link>
            <Link href="/gallery" className="text-black hover:text-red-600">Gallery</Link>
            <Link href="/coaches" className="text-black hover:text-red-600">Coaches</Link>
          </nav>
        </div>
        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}




export default Header