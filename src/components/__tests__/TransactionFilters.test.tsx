import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import TransactionFilters from '../TransactionFilters'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/types'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockRouter = {
  push: jest.fn(),
}

const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Food',
    type: 'expense',
    is_default: true,
    household_id: 'house-1',
  },
]

describe('TransactionFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  it('renders filter inputs', () => {
    render(<TransactionFilters categories={mockCategories} />)
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
  })

  it('updates URL when type changes', () => {
    render(<TransactionFilters categories={mockCategories} />)

    const typeSelect = screen.getByLabelText('Type')
    fireEvent.change(typeSelect, { target: { value: 'expense' } })

    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining('type=expense')
    )
  })

  it('updates URL when category changes', () => {
    render(<TransactionFilters categories={mockCategories} />)

    const categorySelect = screen.getByLabelText('Category')
    fireEvent.change(categorySelect, { target: { value: 'Food' } })

    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining('category=Food')
    )
  })

  it('clears filters when clear button is clicked', () => {
    // Mock search params to simulate active filters
    ;(useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('type=expense')
    )

    render(<TransactionFilters categories={mockCategories} />)

    const clearButton = screen.getByText('Clear Filters')
    fireEvent.click(clearButton)

    expect(mockRouter.push).toHaveBeenCalledWith('/transactions')
  })
})
