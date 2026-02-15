'use client'

import { useState } from 'react'
import { login, signup } from '@/app/login/actions'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'

export default function AuthForm({ message }: { message: string }) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 h-screen m-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Uang Restu
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </p>
      </div>

      {/* Toggle */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 relative">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-1' : 'left-[calc(50%+2px)]'}`}
        />
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors duration-300 ${
            isLogin
              ? 'text-foreground'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors duration-300 ${
            !isLogin
              ? 'text-foreground'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Register
        </button>
      </div>

      <form
        className="animate-in flex-1 flex flex-col w-full px-2"
        onSubmit={() => setIsLoading(true)}
      >
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5 ml-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          {!isLogin && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300">
              <label
                className="block text-sm font-medium mb-1.5 ml-1"
                htmlFor="full-name"
              >
                Full Name
              </label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                name="fullName"
                placeholder="Your Name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label
              className="block text-sm font-medium mb-1.5 ml-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          formAction={isLogin ? login : signup}
          disabled={isLoading}
          className="mt-8 w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isLogin ? (
            <>
              <LogIn size={20} /> Sign In
            </>
          ) : (
            <>
              <UserPlus size={20} /> Create Account
            </>
          )}
        </button>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl text-center text-sm animate-in zoom-in-95 duration-200 ${
              message.includes('Check email')
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
