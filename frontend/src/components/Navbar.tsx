import React from 'react'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface NavbarProps {
  userRole: string
  userName: string
  onLogout: () => void
}

const navigation = [
  { name: 'Agriculteur', href: '/agrilist', current: false },
  { name: 'vendeur', href: 'vendeurlist', current: false },
  { name: 'responsable de stockage', href: 'stockmanagerlist', current: false },
  { name: 'transporteur', href: 'transporterlist', current: false },
  { name: 'transformateur', href: '/listtransformateur', current: false },

]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Navbar: React.FC<NavbarProps> = ({ userRole, userName, onLogout }) => {
  const imageUrl =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            
          <div className="hidden md:flex w-full justify-start pl-80 space-x-4">
  {navigation.map((item) => (
    <a
      key={item.name}
      href={item.href}
      aria-current={item.current ? 'page' : undefined}
      className={classNames(
        item.current
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        'rounded-md px-3 py-2 text-sm font-medium'
      )}
    >
      {item.name}
    </a>
  ))}
</div>




          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="size-6" aria-hidden="true" />
              </button>

              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img className="size-8 rounded-full" src={imageUrl} alt="" />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <MenuItem>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <Bars3Icon className="block size-6 group-data-open:hidden" aria-hidden="true" />
              <XMarkIcon className="hidden size-6 group-data-open:block" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-4 pb-3">
          <div className="flex items-center px-5">
            <div className="shrink-0">
              <img className="size-10 rounded-full" src={imageUrl} alt="" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">{userName}</div>
              <div className="text-sm font-medium text-gray-400">{userRole}</div>
            </div>
            <button
              type="button"
              className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <BellIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 space-y-1 px-2">
            <DisclosureButton
              as="button"
              onClick={onLogout}
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Sign out
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}


export default Navbar
