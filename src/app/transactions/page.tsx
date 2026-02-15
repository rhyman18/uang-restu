import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import TransactionItem from '@/components/TransactionItem'
import TransactionFilters from '@/components/TransactionFilters'
import { formatCurrency } from '@/utils/format'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch Profile first to get household_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return <div>Profile not found</div>

  // Fetch Categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .or(`is_default.eq.true,household_id.eq.${profile.household_id}`)

  // Build Transaction Query
  let query = supabase
    .from('transactions')
    .select('*, profiles:payer_id(full_name, email)')
    .eq('household_id', profile.household_id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  // Apply Filter: Start Date
  if (params.startDate) {
    query = query.gte('date', params.startDate as string)
  }

  // Apply Filter: End Date
  if (params.endDate) {
    query = query.lte('date', params.endDate as string)
  }

  // Apply Filter: Type
  if (params.type) {
    query = query.eq('type', params.type as string)
  }

  // Apply Filter: Category
  if (params.category) {
    query = query.eq('category', params.category as string)
  }

  const { data: transactions, error } = await query

  if (error) {
    console.error('Error fetching transactions:', error)
  }

  // Calculate Filtered Totals
  const totalIncome =
    transactions
      ?.filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0) || 0

  const totalExpense =
    transactions
      ?.filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0) || 0

  // Note: Transfers don't affect "Net" balance usually, but we can show them if filtered by 'transfer'
  // For the summary card, we usually want Net Flow (Income - Expense)
  const netFlow = totalIncome - totalExpense

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-foreground pb-20">
      <Header user={user} />

      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">Transaction History</h1>
        </div>

        {/* Filters */}
        <TransactionFilters categories={categories || []} />

        {/* Filtered Summary Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-sm text-gray-500 font-medium mb-2">
            Filtered Summary
          </h2>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-2xl font-bold">
                {formatCurrency(netFlow)}
              </div>
              <div className="text-xs text-gray-400">Net Flow</div>
            </div>
            <div className="text-right text-sm">
              <div className="text-green-600 dark:text-green-400">
                +{formatCurrency(totalIncome)}
              </div>
              <div className="text-red-600 dark:text-red-400">
                -{formatCurrency(totalExpense)}
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {transactions?.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">
              No transactions found for these filters.
            </div>
          )}
          {transactions?.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </main>
    </div>
  )
}
