import { ArrowDown, ArrowUp, ArrowRightLeft } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { Transaction } from '@/types'

export default function TransactionItem({
  transaction,
}: {
  transaction: Transaction
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            transaction.type === 'income'
              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
              : transaction.type === 'transfer'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {transaction.type === 'income' ? (
            <ArrowDown size={18} />
          ) : transaction.type === 'transfer' ? (
            <ArrowRightLeft size={18} />
          ) : (
            <ArrowUp size={18} />
          )}
        </div>
        <div>
          <div className="font-medium">
            {transaction.type === 'transfer'
              ? `Transfer to ${transaction.transfer_to?.toUpperCase()}`
              : transaction.description || transaction.category}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(transaction.date).toLocaleDateString()} •{' '}
            {transaction.profiles?.full_name?.split(' ')[0] || 'Unknown'}
          </div>
        </div>
      </div>
      <div
        className={`font-bold ${
          transaction.type === 'income'
            ? 'text-green-600 dark:text-green-400'
            : transaction.type === 'transfer'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-foreground'
        }`}
      >
        {transaction.type === 'expense'
          ? '-'
          : transaction.type === 'transfer'
            ? ''
            : '+'}
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  )
}
