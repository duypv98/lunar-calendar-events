import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { Fragment } from 'react';

const Header = () => {
  const { data: session } = useSession();
  return (
    <Disclosure as="nav" className="bg-gray-50 dark:bg-gray-900 border-b shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-white">
                  {session?.user?.name}
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden sm:flex sm:items-center gap-4">
                {/* Profile Menu */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="flex items-center text-sm focus:outline-none">
                      <UserCircleIcon className="h-6 w-6 text-white" />
                    </MenuButton>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      <MenuItem>
                        {({ disabled }) => (
                          <button
                            className={classNames(
                              !disabled ? 'bg-gray-100' : '',
                              'block w-full text-left px-4 py-2 text-sm text-gray-700'
                            )}
                            onClick={() => {
                              signOut({ callbackUrl: "/" });
                            }}
                          >
                            Logout
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>

              {/* Mobile menu button */}
              <div className="flex sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-black hover:bg-gray-100">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="sm:hidden px-4 pb-4">
            <div className="space-y-2">
              <button className="block text-left w-full text-gray-700 hover:text-black">
                Logout
              </button>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
