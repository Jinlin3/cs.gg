"use client";

import Link from "next/link";
import { useState } from "react";
import SignOut from "./sign-out";
import SignIn from "./sign-in";

type UserLike = {
  id: string,
  email: string | null,
  slug: string | null,
  name: string | null,
} | null


export default function NavbarClient({ user }: { user: UserLike }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-black/30 p-4 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">

          <Link href="/" className="text-2xl font-semibold">
            cs.gg
          </Link>

          {/* Desktop Portion */}
          <nav className="hidden md:flex items-center gap-x-8">
            {user && (
              <Link href={`/users/${user.slug}`} className="hover:underline">
                {user.slug}
              </Link>
            )}
            <Link href="/users" className="hover:underline">
              Search Users
            </Link>
            <Link href="/goals" className="hover:underline">
              Edit Goals
            </Link>
          </nav>

          {/* Desktop Auth Button */}
          <div className="hidden md:block">
            {user ? <SignOut /> : <SignIn />}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded px-3 py-2 hover:bg-gray-700"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}>
              <span className="text-xl leading-none">{open ? "X" : "☰"}</span>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden mt-4 border-t border-gray-700 pt-4">
            <nav className="flex flex-col gap-y-3">
              {user && (
                <Link
                  href={`/users/${user.slug}`}
                  className="rounded px-2 py-2 hover:bg-gray-700"
                  onClick={() => setOpen(false)}>
                    {user.slug}
                </Link>
              )}
              <Link
                href="/users"
                className="rounded px-2 py-2 hover:bg-gray-700"
                onClick={() => setOpen(false)}>
                  Search Users
              </Link>
              <Link
                href="/goals"
                className="rounded px-2 py-2 hover:bg-gray-700"
                onClick={() => setOpen(false)}>
                  Edit Goals
              </Link>
              <div className="rounded px-2 py-2 hover:bg-gray-700 font-semibold">
                {user ? <SignOut /> : <SignIn />}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}