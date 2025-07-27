'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';

import {
  ArrowRightIcon,
  Cog8ToothIcon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/solid'



const SignInButton = () => {
  const { data: session } = useSession()

  return (
    <>
      {session ? (
        <Menu as='div' className='relative'>
          <MenuButton>
            {session?.user?.image ? (
              <div className='relative h-10 w-10'>
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? ''}
                  className='inline-block rounded-full'
                  fill
                />
              </div>
            ) : (
              <span className='inline-block h-8 w-8 overflow-hidden rounded-full bg-stone-100'>
                <svg
                  className='h-full w-full text-stone-300'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                </svg>
              </span>
            )}
          </MenuButton>
          <Transition
            enter="transition duration-150 ease-out"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition duration-150 ease-in"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
          <MenuItems className="absolute right-0 mt-2 w-96 origin-top-right rounded-xl bg-white text-black shadow-xl ring-1 ring-stone-200 z-50 focus:outline-none p-4">
              <div className='mb-4 flex gap-4 px-6 text-sm'>
                {session?.user?.image ? (
                  <div className='relative h-10 w-10'>
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? ''}
                      className='inline-block rounded-full'
                      fill
                    />
                  </div>
                ) : (
                  <span className='inline-block h-8 w-8 overflow-hidden rounded-full bg-stone-100'>
                    <svg
                      className='h-full w-full text-stone-300'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                    </svg>
                  </span>
                )}
                <div>
                  <p className='font-medium text-stone-600'>
                    {session.user.name || 'User name'}
                  </p>
                  <p className='text-stone-400'>{session.user.email}</p>
                </div>
              </div>
              <MenuItem as={Link} href='/protected/dashboard'>
                <div className='group flex items-center gap-6 px-[34px] py-2 text-sm text-stone-400 dark:text-stone-500 active:bg-stone-700/50 dark:active:bg-stone-200'>
                  <ChartBarSquareIcon className='h-5 w-5 text-stone-400' />
                  <span>Dashboard</span>
                </div>
              </MenuItem>
              {/* Trainer Dashboard — only show if role is trainer */}
              {session.user.role === 'TRAINER' && (
                <MenuItem as={Link} href='/protected/trainer'>
                  <div className='group flex items-center gap-6 px-[34px] py-2 text-sm text-stone-400 dark:text-stone-500 active:bg-stone-700/50 dark:active:bg-stone-200'>
                    <ClipboardDocumentCheckIcon className='h-5 w-5 text-stone-400' />
                    <span>Trainer Dashboard</span>
                  </div>
                </MenuItem>
              )}
              <MenuItem as={Link} href='/profile'>
                <div className='group flex items-center gap-6 px-[34px] py-2 text-sm text-stone-400 dark:text-stone-500 active:bg-stone-700/50 dark:active:bg-stone-200'>
                  <Cog8ToothIcon className='h-5 w-5 text-stone-400' />
                  <span>Manage Account</span>
                </div>
              </MenuItem>
              <MenuItem as='button' onClick={() => signOut()}>
                <div className='group flex items-center gap-6 px-[34px] py-2 text-sm text-stone-400 dark:text-stone-500 active:bg-stone-700/50 dark:active:bg-stone-200'>
                  <ArrowRightIcon className='h-5 w-5 text-stone-400' />
                  <span>Sign Out</span>
                </div>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      ) : (
        <button
          className='rounded-md border border-stone-300 px-3 py-1 text-sm dark:border-stone-600'
          onClick={() => signIn()}
        >
          Sign In
        </button>
      )}
    </>
  )
}

export default SignInButton;