import { describe, it, beforeEach, afterEach } from 'mocha'
import { expect } from 'chai'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sinon from 'sinon'
import { CategoryFilter } from '@/components/topics/CategoryFilter'
import * as supabaseClient from '@/lib/supabase/client'

describe('CategoryFilter Component', () => {
  let mockSupabase: any
  let createClientStub: sinon.SinonStub

  beforeEach(() => {
    // Mock Supabase client with proper chain
    const mockChain = {
      select: sinon.stub(),
      order: sinon.stub(),
    }

    mockChain.select.returns(mockChain)
    mockChain.order.returns(Promise.resolve({ data: null, error: null }))

    mockSupabase = {
      from: sinon.stub().returns(mockChain),
      rpc: sinon.stub(),
      __mockChain: mockChain, // Store reference for test access
    }

    createClientStub = sinon.stub(supabaseClient, 'createClient').returns(mockSupabase)
  })

  afterEach(() => {
    sinon.restore()
  })

  const mockCategories = [
    { category: 'programming' },
    { category: 'science' },
    { category: 'history' },
  ]

  it('should render loading state initially', () => {
    // Mock RPC to return data slowly
    mockSupabase.rpc.returns(new Promise(resolve => setTimeout(() => resolve({ data: mockCategories, error: null }), 100)))
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    // Should show skeleton loaders
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).to.be.greaterThan(0)
  })

  it('should fetch categories on mount', async () => {
    // Mock RPC to return categories
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      expect(mockSupabase.rpc.calledWith('get_distinct_categories')).to.be.true
    })
  })

  it('should render "All Topics" button', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('All Topics')).to.exist
    })
  })

  it('should render unique categories', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('Programming')).to.exist
      expect(screen.getByText('Science')).to.exist
      expect(screen.getByText('History')).to.exist
    })
  })

  it('should capitalize category labels', async () => {
    mockSupabase.rpc.resolves({ data: [{ category: 'programming' }], error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('Programming')).to.exist
      expect(screen.queryByText('programming')).to.not.exist
    })
  })

  it('should highlight selected category', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="programming" onChange={onChange} />)

    await waitFor(() => {
      const programmingButton = screen.getByText('Programming').closest('button')
      expect(programmingButton?.className).to.include('bg-indigo-600')
      expect(programmingButton?.className).to.include('text-white')
    })
  })

  it('should highlight "All Topics" when selected', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      const allButton = screen.getByText('All Topics').closest('button')
      expect(allButton?.className).to.include('bg-indigo-600')
      expect(allButton?.className).to.include('text-white')
    })
  })

  it('should call onChange when category is clicked', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()
    const user = userEvent.setup()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('Programming')).to.exist
    })

    const programmingButton = screen.getByText('Programming')
    await user.click(programmingButton)

    expect(onChange.calledWith('programming')).to.be.true
  })

  it('should call onChange with "all" when All Topics is clicked', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()
    const user = userEvent.setup()

    render(<CategoryFilter selected="programming" onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('All Topics')).to.exist
    })

    const allButton = screen.getByText('All Topics')
    await user.click(allButton)

    expect(onChange.calledWith('all')).to.be.true
  })

  it('should handle empty categories', async () => {
    mockSupabase.rpc.resolves({ data: [], error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('All Topics')).to.exist
      expect(screen.queryByText('Programming')).to.not.exist
    })
  })

  it('should handle fetch error', async () => {
    mockSupabase.rpc.resolves({ data: null, error: { message: 'Network error' } })
    const consoleErrorStub = sinon.stub(console, 'error')
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      expect(consoleErrorStub.called).to.be.true
      expect(screen.getByText('All Topics')).to.exist
    })

    consoleErrorStub.restore()
  })

  it('should have ARIA labels on buttons', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      const allButton = screen.getByLabelText('Show all topics')
      expect(allButton).to.exist

      const programmingButton = screen.getByLabelText('Filter by Programming')
      expect(programmingButton).to.exist
    })
  })

  it('should have ARIA pressed state', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      const allButton = screen.getByText('All Topics').closest('button')
      expect(allButton?.getAttribute('aria-pressed')).to.equal('true')
    })
  })

  it('should update ARIA pressed when selection changes', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    const { rerender } = render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('All Topics')).to.exist
    })

    rerender(<CategoryFilter selected="programming" onChange={onChange} />)

    await waitFor(() => {
      const allButton = screen.getByText('All Topics').closest('button')
      const programmingButton = screen.getByText('Programming').closest('button')

      expect(allButton?.getAttribute('aria-pressed')).to.equal('false')
      expect(programmingButton?.getAttribute('aria-pressed')).to.equal('true')
    })
  })

  it('should have hover styles on unselected buttons', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      const programmingButton = screen.getByText('Programming').closest('button')
      expect(programmingButton?.className).to.include('hover:bg-gray-200')
    })
  })

  it('should have flex wrap layout', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    const { container } = render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      const wrapper = container.querySelector('.flex.flex-wrap.gap-2')
      expect(wrapper).to.exist
    })
  })

  it('should not render duplicate categories', async () => {
    mockSupabase.rpc.resolves({ data: mockCategories, error: null })
    const onChange = sinon.stub()

    const { container } = render(<CategoryFilter selected="all" onChange={onChange} />)

    await waitFor(() => {
      const buttons = Array.from(container.querySelectorAll('button'))
      const programmingButtons = buttons.filter((btn) => btn.textContent === 'Programming')
      expect(programmingButtons.length).to.equal(1) // Only one Programming button
    })
  })
})
