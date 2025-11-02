'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

/*
* This schema is used to validate the register form
* @type RegisterFormData - The type of the register form data
* @returns The register form data
* */
const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  /*
  * This function is used to handle the submission of the register form
  * @param data - The data of the form
  * @throws An error if the submission fails
  * */
  async function onSubmit(data: RegisterFormData) {
    try {
      setError(null)
      setLoading(true)
      await signUp(data.email, data.password, data.username)
      // Redirect to login with success message
      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('username')}
          type="text"
          placeholder="Username"
          error={errors.username?.message}
        />
      </div>
      <div>
        <Input
          {...register('email')}
          type="email"
          placeholder="Email"
          error={errors.email?.message}
        />
      </div>
      <div>
        <Input
          {...register('password')}
          type="password"
          placeholder="Password"
          error={errors.password?.message}
        />
      </div>
      <div>
        <Input
          {...register('confirmPassword')}
          type="password"
          placeholder="Confirm Password"
          error={errors.confirmPassword?.message}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  )
}