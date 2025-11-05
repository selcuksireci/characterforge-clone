import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

function createMockClient() {
  const unsupported = async () => ({
    data: null,
    error: {
      message:
        'Supabase environment variables are not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live data.'
    }
  })

  return {
    auth: {
      async signInWithPassword() {
        return unsupported()
      },
      async signUp() {
        return unsupported()
      },
      async signOut() {
        return unsupported()
      },
      async signInWithOAuth() {
        return unsupported()
      },
      onAuthStateChange() {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      async getSession() {
        return { data: { session: null }, error: null }
      }
    },
    from() {
      return {
        select: unsupported,
        insert: unsupported,
        order: unsupported,
        eq: () => ({ select: unsupported })
      }
    },
    storage: {
      from() {
        return {
          upload: unsupported,
          getPublicUrl() {
            return { data: { publicUrl: '' }, error: unsupported().error }
          }
        }
      }
    }
  }
}

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : createMockClient()
export const supabaseConfigured = isConfigured
