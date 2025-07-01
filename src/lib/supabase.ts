import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// For client-side usage
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// For client components
export const createSupabaseClient = () =>
  createClientComponentClient<Database>()

// For server components (simplified for this client-side app)
export const createSupabaseServerClient = () =>
  createClientComponentClient<Database>()

// Database helper functions
export const getCurrentUser = async () => {
  const supabase = createSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createSupabaseClient()
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const supabase = createSupabaseClient()
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })
}

export const signOut = async () => {
  const supabase = createSupabaseClient()
  return await supabase.auth.signOut()
}
