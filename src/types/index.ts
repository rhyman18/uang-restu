export type Profile = {
  id: string
  email: string
  full_name: string
  avatar_url: string
  household_id: string | null
  role: 'husband' | 'wife' | 'member'
}

export type Transaction = {
  id: string
  created_at: string
  date: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  category: string
  description: string
  household_id: string
  payer_id: string
  payment_method: 'cash' | 'bank'
  transfer_to?: 'cash' | 'bank'
  created_by: string
  profiles?: Profile // Join
}

export type Category = {
  id: string
  name: string
  type: 'income' | 'expense'
  is_default: boolean
}
