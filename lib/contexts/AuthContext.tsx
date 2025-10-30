'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

/*
* This context is used to provide the authentication context to the app
* @type AuthContextType - The type of the authentication context
* @returns The authentication context
* */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/*
* This component is used to provide the authentication context to the app
* @param children - The children of the component
* @returns The authentication context
* */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  /*
  * This effect is used to get the initial session and listen for auth changes
  * @throws An error if the session fetching or auth change fails
  * */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  /*
  * This function fetches the profile of the user
  * @param userId - The ID of the user
  * @throws An error if the profile fetching fails
  * */
  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }
    setLoading(false)
  }
  
  /*
  * This function signs up the user
  * @param email - The email of the user
  * @param password - The password of the user
  * @param username - The username of the user
  * @throws An error if the sign up fails
  * */
  async function signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })

    if (error) throw error
    if (!data.user) throw new Error('No user returned')

    // Profile is automatically created by database trigger
    // No need to manually insert into profiles table
  }

  /*
  * This function signs in the user
  * @param email - The email of the user
  * @param password - The password of the user
  * @throws An error if the sign in fails
  * */
  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  /*
  * This function signs out the user
  * @throws An error if the sign out fails
  * */
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, session, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/*
*
* This hook is used to access the authentication context
* @returns The authentication context
* */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}