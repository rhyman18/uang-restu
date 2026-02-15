import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '../Header'

// Mock the server action
jest.mock('@/app/login/actions', () => ({
  signout: jest.fn(),
}))

describe('Header', () => {
  it('renders the user email', () => {
    const user = { email: 'test@example.com' }
    render(<Header user={user} />)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders the app title', () => {
    const user = { email: 'test@example.com' }
    render(<Header user={user} />)

    expect(screen.getByText('Uang Restu')).toBeInTheDocument()
  })
})
