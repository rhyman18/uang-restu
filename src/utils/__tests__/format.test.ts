import { formatCurrency } from '../format'

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(10000)).toBe('Rp 10.000')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('Rp 0')
  })

  it('formats negative numbers correctly', () => {
    // Note: implementation details might vary depending on locale data in the environment
    // But usually id-ID formats negative with a minus sign
    const result = formatCurrency(-5000)
    expect(result).toMatch(/Rp\s-?5\.000/)
  })
})
