'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'

// We will fetch categories and profiles from the parent or via props
import { Profile, Category } from '@/types'

export default function TransactionForm({
  profiles,
  categories,
  userId,
}: {
  profiles: Profile[]
  categories: Category[]
  userId: string
}) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState<{
    date: string
    amount: string
    type: 'income' | 'expense' | 'transfer'
    category: string
    description: string
    payer_id: string
    payment_method: 'cash' | 'bank'
    transfer_to: 'cash' | 'bank'
  }>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    payer_id: userId,
    payment_method: 'bank',
    transfer_to: 'cash', // Default target
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description,
        household_id: profiles[0]?.household_id,
        payment_method: formData.payment_method, // "From" for transfers
      }

      if (formData.type === 'transfer') {
        payload.category = 'Transfer'
        payload.transfer_to = formData.transfer_to
        payload.payer_id = userId
      } else {
        payload.category = formData.category
        payload.payer_id =
          formData.type === 'income' ? userId : formData.payer_id
      }

      const { error } = await supabase.from('transactions').insert([payload])

      if (error) throw error

      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        payer_id: userId,
        payment_method: 'bank',
        transfer_to: 'cash',
      })
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Error adding transaction')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
      >
        <Plus size={24} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Income vs Expense Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                formData.type === 'income'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => {
                const updates: any = { type: 'transfer' }
                // Force opposite destination based on current payment_method
                updates.transfer_to =
                  formData.payment_method === 'bank' ? 'cash' : 'bank'
                setFormData({ ...formData, ...updates })
              }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                formData.type === 'transfer'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Transfer
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-transparent"
              />
            </div>

            {/* Payment Method / Transfer From */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {formData.type === 'transfer' ? 'From' : 'Method'}
              </label>
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-[42px]">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, payment_method: 'bank' })
                  }
                  className={`flex-1 rounded-md text-sm font-medium transition-colors ${
                    formData.payment_method === 'bank'
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Bank
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, payment_method: 'cash' })
                  }
                  className={`flex-1 rounded-md text-sm font-medium transition-colors ${
                    formData.payment_method === 'cash'
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Cash
                </button>
              </div>
            </div>
          </div>

          {/* Transfer To (Only visible for Transfer) */}
          {formData.type === 'transfer' && (
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-[42px]">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, transfer_to: 'bank' })
                  }
                  className={`flex-1 rounded-md text-sm font-medium transition-colors ${
                    formData.transfer_to === 'bank'
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Bank
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, transfer_to: 'cash' })
                  }
                  className={`flex-1 rounded-md text-sm font-medium transition-colors ${
                    formData.transfer_to === 'cash'
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Cash
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              required
              placeholder="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-transparent text-lg font-bold"
            />
          </div>

          {/* Category - Hide for Transfer */}
          {formData.type !== 'transfer' && (
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-transparent"
              >
                <option value="">Select Category</option>
                {categories
                  .filter((c) => c.type === formData.type)
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Hide Payer for Income (Assuming shared income goes to Bank usually, or attributed to current user/household) */}
          {formData.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Who Paid?
              </label>
              <div className="flex gap-2">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, payer_id: profile.id })
                    }
                    className={`flex-1 py-2 px-3 rounded-md border text-sm transition-colors ${
                      formData.payer_id === profile.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {profile.full_name || profile.email}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder={
                formData.type === 'transfer'
                  ? 'Transfer details (optional)'
                  : 'What is this for?'
              }
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  )
}
