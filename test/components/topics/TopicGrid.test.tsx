import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Database } from '@/lib/supabase/types'

// Mock Next.js Link
const MockLink = ({ children, href }: any) => {
  return React.createElement('a', { href, role: 'link' }, children)
}

// Mock the module
const Module = require('module')
const originalRequire = Module.prototype.require

beforeEach(() => {
  Module.prototype.require = function (id: string) {
    if (id === 'next/link') {
      return { default: MockLink }
    }
    return originalRequire.apply(this, arguments as any)
  }
})

// Import after mock is set up
const { TopicGrid } = require('@/components/topics/TopicGrid')

type Topic = Database['public']['Tables']['topics']['Row']

describe('TopicGrid Component', () => {
  const mockTopics: Topic[] = [
    {
      id: '1',
      name: 'JavaScript',
      slug: 'javascript',
      description: 'Test your JavaScript knowledge',
      category: 'programming',
      difficulty: 'intermediate',
      question_count: 50,
      play_count: 100,
      icon_url: '🟨',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Python',
      slug: 'python',
      description: 'Test your Python skills',
      category: 'programming',
      difficulty: 'beginner',
      question_count: 30,
      play_count: 75,
      icon_url: '🐍',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'React',
      slug: 'react',
      description: 'Master React concepts',
      category: 'programming',
      difficulty: 'advanced',
      question_count: 40,
      play_count: 120,
      icon_url: '⚛️',
      created_at: '2024-01-01T00:00:00Z',
    },
  ]

  it('should render all topics', () => {
    render(<TopicGrid topics={mockTopics} />)
    expect(screen.getByText('JavaScript')).to.exist
    expect(screen.getByText('Python')).to.exist
    expect(screen.getByText('React')).to.exist
  })

  it('should render correct number of topic cards', () => {
    const { container } = render(<TopicGrid topics={mockTopics} />)
    const links = container.querySelectorAll('a')
    expect(links.length).to.equal(3)
  })

  it('should render empty state when no topics', () => {
    render(<TopicGrid topics={[]} />)
    expect(screen.getByText('No topics found')).to.exist
  })

  it('should have grid layout', () => {
    const { container } = render(<TopicGrid topics={mockTopics} />)
    const grid = container.querySelector('.grid')
    expect(grid).to.exist
  })

  it('should have responsive grid columns', () => {
    const { container } = render(<TopicGrid topics={mockTopics} />)
    const grid = container.querySelector('.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3')
    expect(grid).to.exist
  })

  it('should have gap between cards', () => {
    const { container } = render(<TopicGrid topics={mockTopics} />)
    const grid = container.querySelector('.gap-6')
    expect(grid).to.exist
  })

  it('should render empty state with dashed border', () => {
    const { container } = render(<TopicGrid topics={[]} />)
    const emptyState = container.querySelector('.border-dashed')
    expect(emptyState).to.exist
  })

  it('should center empty state text', () => {
    const { container } = render(<TopicGrid topics={[]} />)
    const emptyState = container.querySelector('.text-center')
    expect(emptyState).to.exist
  })

  it('should render single topic', () => {
    render(<TopicGrid topics={[mockTopics[0]]} />)
    expect(screen.getByText('JavaScript')).to.exist
    expect(screen.queryByText('Python')).to.not.exist
  })

  it('should render topic descriptions', () => {
    render(<TopicGrid topics={mockTopics} />)
    expect(screen.getByText('Test your JavaScript knowledge')).to.exist
    expect(screen.getByText('Test your Python skills')).to.exist
    expect(screen.getByText('Master React concepts')).to.exist
  })

  it('should render all difficulty levels', () => {
    render(<TopicGrid topics={mockTopics} />)
    expect(screen.getByText('intermediate')).to.exist
    expect(screen.getByText('beginner')).to.exist
    expect(screen.getByText('advanced')).to.exist
  })

  it('should render all question counts', () => {
    render(<TopicGrid topics={mockTopics} />)
    expect(screen.getByText('50 questions')).to.exist
    expect(screen.getByText('30 questions')).to.exist
    expect(screen.getByText('40 questions')).to.exist
  })

  it('should render all play counts', () => {
    render(<TopicGrid topics={mockTopics} />)
    expect(screen.getByText('100 plays')).to.exist
    expect(screen.getByText('75 plays')).to.exist
    expect(screen.getByText('120 plays')).to.exist
  })

  it('should have unique keys for each topic', () => {
    const { container } = render(<TopicGrid topics={mockTopics} />)
    const links = container.querySelectorAll('a')
    const hrefs = Array.from(links).map((link) => link.getAttribute('href'))
    expect(hrefs).to.have.lengthOf(3)
    expect(new Set(hrefs).size).to.equal(3) // All unique
  })

  it('should handle empty array gracefully', () => {
    const { container } = render(<TopicGrid topics={[]} />)
    expect(container.querySelector('.border-dashed')).to.exist
    expect(screen.getByText('No topics found')).to.exist
  })

  it('should render icons for all topics', () => {
    render(<TopicGrid topics={mockTopics} />)
    expect(screen.getByText('🟨')).to.exist
    expect(screen.getByText('🐍')).to.exist
    expect(screen.getByText('⚛️')).to.exist
  })
})
