"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
            FD
          </div>
          <span className="text-2xl font-bold text-gray-900">FlexDesk</span>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {!isLoggedIn && (
           <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
           </Link>
           )}

         {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                href="/bookings"
                className="text-gray-700 hover:text-blue-600"
              >
                My Bookings
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-900 hover:bg-gray-200"
              >
                Sign out
              </button>
            </>
          )}

          {!isLoggedIn && status !== "loading" && (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile navigation menu */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
            {!isLoggedIn && (
              <Link
                href="/"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600"
              >
                Home
              </Link>
            )}

            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>

                <Link
                  href="/bookings"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-blue-600"
                >
                  My Bookings
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Admin
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-left text-gray-900 hover:bg-gray-200"
                >
                  Sign out
                </button>
              </>
            )}

            {!isLoggedIn && status !== "loading" && (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}