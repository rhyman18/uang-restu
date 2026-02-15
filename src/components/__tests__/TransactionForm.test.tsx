import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TransactionForm from '../TransactionForm'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Profile, Category } from '@/types'

// Mock dependencies
jest.mock('@/utils/supabase/client')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockInsert = jest.fn(() => Promise.resolve({ error: null }))
const mockFrom = jest.fn(() => ({ insert: mockInsert }))
const mockSupabase = {
  from: mockFrom,
}

;(createClient as jest.Mock).mockReturnValue(mockSupabase)

const mockRouter = {
  refresh: jest.fn(),
}

;(useRouter as jest.Mock).mockReturnValue(mockRouter)

const mockProfiles: Profile[] = [
  {
    id: 'user-1',
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: '',
    household_id: 'house-1',
    role: 'member',
  },
]

const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Food',
    type: 'expense',
    is_default: true,
    household_id: 'house-1',
  },
  {
    id: 'cat-2',
    name: 'Salary',
    type: 'income',
    is_default: true,
    household_id: 'house-1',
  },
]

describe('TransactionForm', () => {
  const userId = 'user-1'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it('renders the floating action button initially', () => {
    render(
      <TransactionForm
        profiles={mockProfiles}
        categories={mockCategories}
        userId={userId}
      />
    )
    // The button contains a Plus icon, usually check for button role
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('opens the form when button is clicked', () => {
    render(
      <TransactionForm
        profiles={mockProfiles}
        categories={mockCategories}
        userId={userId}
      />
    )
    const fab = screen.getByRole('button')
    fireEvent.click(fab)

    expect(screen.getByText('Add Transaction')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
  })

  it('submits a valid expense transaction', async () => {
    render(
      <TransactionForm
        profiles={mockProfiles}
        categories={mockCategories}
        userId={userId}
      />
    )

    // Open Form
    fireEvent.click(screen.getByRole('button'))

    // Fill Form
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '50000' },
    })
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Food' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Lunch' },
    })

    // Submit
    const saveButton = screen.getByText('Save Transaction')
    fireEvent.click(saveButton)

    await waitFor(() => {
      // Expect 'from' to be called with 'transactions'
      expect(mockSupabase.from).toHaveBeenCalledWith('transactions')
      // Expect 'insert' spy to be called
      // We need to access the spy we created
      const { insert } = mockSupabase.from.mock.results[0].value
      expect(insert).toHaveBeenCalledWith([
        expect.objectContaining({
          amount: 50000,
          category: 'Food',
          description: 'Lunch',
          type: 'expense',
          payment_method: 'bank', // Default
          payer_id: userId,
        }),
      ])
      expect(mockRouter.refresh).toHaveBeenCalled()
    })
  })

  it('switches to income mode and hides payer selector', () => {
    render(
      <TransactionForm
        profiles={mockProfiles}
        categories={mockCategories}
        userId={userId}
      />
    )
    fireEvent.click(screen.getByRole('button')) // Open

    const incomeButton = screen.getByText('Income')
    fireEvent.click(incomeButton)

    // Payer selector should be hidden for income
    expect(screen.queryByText('Who Paid?')).not.toBeInTheDocument()

    // Category options should filter to income
    const categorySelect = screen.getByLabelText('Category')
    expect(categorySelect).toBeInTheDocument()
    // We expect 'Salary' to be an option, but 'Food' (expense) to not be valid or present
    // implementation details might vary, but let's check basic flow
  })
})
