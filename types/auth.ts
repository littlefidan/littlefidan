import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

export interface AuthSession {
  type: 'initial' | 'change'
  event?: AuthChangeEvent
  session: Session | null
}

export interface DebugAuthState {
  user: User | null
  loading: boolean
  sessions: AuthSession[]
}