'use client'

import { signout } from '@/app/login/actions'
import { LogOut, User } from 'lucide-react'

export default function Header({ user }: { user: any }) {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
        Uang Restu
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <User size={16} />
          <span className="hidden sm:inline">{user?.email}</span>
        </div>
        <form action={signout}>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </form>
      </div>
    </header>
  )
}
