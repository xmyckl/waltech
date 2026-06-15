import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Stakeholder = {
  id: string
  name: string
  organisation: string | null
  role: string | null
  email: string | null
  phone: string | null
  influence: number
  interest: number
  engagement_status: string
  notes: string | null
  created_at: string
  updated_at: string
}

export type CommsEntry = {
  id: string
  stakeholder_id: string
  date: string
  channel: string | null
  summary: string | null
  outcome: string | null
  next_action: string | null
  next_action_date: string | null
  created_at: string
  stakeholders?: { name: string } | null
}

export type Decision = {
  id: string
  title: string
  description: string | null
  made_by: string | null
  decision_date: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}
