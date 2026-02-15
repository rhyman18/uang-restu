import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TransactionForm from '@/components/TransactionForm'
import Header from '@/components/Header'
import { Wallet } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import TransactionItem from '@/components/TransactionItem'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
  }

  if (!profile) {
    // Handle edge case where profile trigger might have failed or is slow
    console.log('Profile not found for user:', user.id)
    return (
      <div className="p-8 text-center">
        Loading profile... (Profile not found)
      </div>
    )
  }

  // Fetch Household Profiles
  let householdProfiles = []
  if (profile.household_id) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('household_id', profile.household_id)

    householdProfiles = profiles || []
  } else {
    householdProfiles = [profile]
  }

  // Fetch Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .or(`is_default.eq.true,household_id.eq.${profile.household_id}`)

  // Fetch Transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, profiles:payer_id(full_name, email)')
    .eq('household_id', profile.household_id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate Summary
  const income =
    transactions
      ?.filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0) || 0

  const expense =
    transactions
      ?.filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0) || 0

  const balance = income - expense

  // Calculate Cash vs Bank
  const cashBalance =
    transactions?.reduce((acc, t) => {
      if (t.payment_method !== 'cash') return acc
      return t.type === 'income' ? acc + t.amount : acc - t.amount
    }, 0) || 0

  const bankBalance =
    transactions?.reduce((acc, t) => {
      if (t.payment_method === 'cash') return acc // Default to bank if null
      return t.type === 'income' ? acc + t.amount : acc - t.amount
    }, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-foreground pb-20">
      <Header user={user} />

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-gray-300 text-sm">
            <Wallet size={16} />
            <span>Total Balance</span>
          </div>
          <div className="text-3xl font-bold mb-6">
            {formatCurrency(balance)}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-green-400 text-xs mb-1">
                <span>Bank</span>
              </div>
              <div className="font-semibold">{formatCurrency(bankBalance)}</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                <span>Cash</span>
              </div>
              <div className="font-semibold">{formatCurrency(cashBalance)}</div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="font-bold text-lg mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions?.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                No transactions yet
              </div>
            )}

            {transactions?.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}

            <Link
              href="/transactions"
              className="w-full flex items-center justify-center p-4 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-4"
            >
              View all transactions
            </Link>
          </div>
        </div>
      </main>

      <TransactionForm
        profiles={householdProfiles}
        categories={categories || []}
        userId={user.id}
      />
    </div>
  )
}
