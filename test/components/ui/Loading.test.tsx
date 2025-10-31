import { describe, it } from 'mocha'
import { expect } from 'chai'
import { render, screen } from '@testing-library/react'
import { Loading } from '@/components/ui/Loading'

describe('Loading Component', () => {
  it('should render loading spinner', () => {
    render(<Loading />)
    expect(screen.getByText('Loading...')).to.exist
  })

  it('should have spinner animation element', () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).to.exist
  })

  it('should render with proper structure', () => {
    const { container } = render(<Loading />)
    const wrapper = container.querySelector('.flex.min-h-\\[400px\\]')
    expect(wrapper).to.exist
  })

  it('should have accessible text content', () => {
    render(<Loading />)
    const text = screen.getByText('Loading...')
    expect(text.className).to.include('text-gray-600')
  })

  it('should have indigo colored spinner', () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector('.border-indigo-600')
    expect(spinner).to.exist
  })

  it('should center content', () => {
    const { container } = render(<Loading />)
    const wrapper = container.querySelector('.items-center.justify-center')
    expect(wrapper).to.exist
  })
})
