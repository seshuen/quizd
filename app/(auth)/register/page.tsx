import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

/*
* This page is used to register a new user
* @returns The register page
* */
export default function RegisterPage() {
  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Create Account</h2>
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}