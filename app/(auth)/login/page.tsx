import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

/*
* This page is used to log in an existing user
* @returns The login page
* */
export default function LoginPage() {
  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Sign In</h2>
      <LoginForm />
      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-indigo-600 hover:underline">
          Create account
        </Link>
      </p>
    </>
  )
}
