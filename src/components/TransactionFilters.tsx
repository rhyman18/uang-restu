'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/types'
import { useState } from 'react'

export default function TransactionFilters({
  categories,
}: {
  categories: Category[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
  })

  // Debounce effect or simple apply button? Let's use simple onChange for now, maybe with small delay if needed.
  // Actually, for date/selects, immediate update is fine.

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/transactions?${params.toString()}`)
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
      <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wide">
        Filters
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Date Range */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-xs font-medium mb-1 text-gray-500"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilters('startDate', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-xs font-medium mb-1 text-gray-500"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilters('endDate', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-sm bg-transparent"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label
            htmlFor="type"
            className="block text-xs font-medium mb-1 text-gray-500"
          >
            Type
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => updateFilters('type', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-sm bg-transparent"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-xs font-medium mb-1 text-gray-500"
          >
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => updateFilters('category', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-sm bg-transparent"
            disabled={filters.type === 'transfer'} // Transfers don't have categories usually, or fixed 'Transfer'
          >
            <option value="">All Categories</option>
            {categories
              .filter((c) => !filters.type || c.type === filters.type)
              .map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {(filters.startDate ||
        filters.endDate ||
        filters.type ||
        filters.category) && (
        <button
          onClick={() => {
            setFilters({ startDate: '', endDate: '', type: '', category: '' })
            router.push('/transactions')
          }}
          className="text-xs text-red-500 hover:underline"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
