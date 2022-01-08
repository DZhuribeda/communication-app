import classNames from "classnames";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { useRouter } from "next/router";
import { LogoutIcon, CogIcon, MenuIcon, XIcon } from "@heroicons/react/outline";

const navigation = [{ name: "Rooms", href: "/", current: true }];
const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Sign out", href: "#" },
];

export function Navigation() {
  const { asPath } = useRouter();
  return (
    <Disclosure as="nav" className="bg-gray-900">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 tablet:px-6 desktop:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="hidden tablet:block">
                  <div className="flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href} passHref>
                        <a
                          className={classNames(
                            asPath === item.href
                              ? "bg-gray-900 text-white"
                              : "text-gray-100 hover:bg-gray-700 hover:text-white",
                            "px-3 first:px-0 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={
                            asPath === item.href ? "page" : undefined
                          }
                        >
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden tablet:block">
                <div className="ml-4 flex items-center tablet:ml-6">
                  <Link href="/profile" passHref>
                    <a className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">View profile</span>
                      <CogIcon className="h-6 w-6" aria-hidden="true" />
                    </a>
                  </Link>
                  <button
                    type="button"
                    className="bg-gray-800 p-1 ml-3 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Logout</span>
                    <LogoutIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="-mr-2 flex tablet:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="tablet:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 tablet:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    asPath === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={asPath === item.href ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="mt-3 px-2 space-y-1">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
