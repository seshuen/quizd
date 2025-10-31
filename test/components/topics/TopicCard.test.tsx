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
const { TopicCard } = require('@/components/topics/TopicCard')

type Topic = Database['public']['Tables']['topics']['Row']

describe('TopicCard Component', () => {
  const mockTopic: Topic = {
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
  }

  it('should render topic name', () => {
    render(<TopicCard topic={mockTopic} />)
    expect(screen.getByText('JavaScript')).to.exist
  })

  it('should render topic description', () => {
    render(<TopicCard topic={mockTopic} />)
    expect(screen.getByText('Test your JavaScript knowledge')).to.exist
  })

  it('should render difficulty level', () => {
    render(<TopicCard topic={mockTopic} />)
    expect(screen.getByText('intermediate')).to.exist
  })

  it('should render question count', () => {
    render(<TopicCard topic={mockTopic} />)
    expect(screen.getByText('50 questions')).to.exist
  })

  it('should render play count', () => {
    render(<TopicCard topic={mockTopic} />)
    expect(screen.getByText('100 plays')).to.exist
  })

  it('should render icon when icon_url is provided', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    expect(screen.getByText('🟨')).to.exist
    const icon = container.querySelector('span[aria-hidden="true"]')
    expect(icon?.textContent).to.equal('🟨')
  })

  it('should render fallback icon when no icon_url', () => {
    const topicNoIcon = { ...mockTopic, icon_url: null }
    const { container } = render(<TopicCard topic={topicNoIcon} />)
    const fallbackIcon = container.querySelector('svg[aria-hidden="true"]')
    expect(fallbackIcon).to.exist
  })

  it('should have link to topic detail page', () => {
    render(<TopicCard topic={mockTopic} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).to.equal('/topics/javascript')
  })

  it('should have proper styling classes', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const card = container.querySelector('.rounded-lg.border')
    expect(card).to.exist
  })

  it('should have hover effects', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const card = container.querySelector('.hover\\:border-indigo-500')
    expect(card).to.exist
  })

  it('should render with white background', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const card = container.querySelector('.bg-white')
    expect(card).to.exist
  })

  it('should have group class for hover states', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const card = container.querySelector('.group')
    expect(card).to.exist
  })

  it('should render icon with proper size', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const iconContainer = container.querySelector('.h-12.w-12')
    expect(iconContainer).to.exist
  })

  it('should have rounded icon container', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const iconContainer = container.querySelector('.rounded-lg.bg-indigo-100')
    expect(iconContainer).to.exist
  })

  it('should truncate long descriptions', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const description = container.querySelector('.line-clamp-2')
    expect(description).to.exist
  })

  it('should render difficulty badge', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const badge = container.querySelector('.rounded-full.bg-gray-100')
    expect(badge?.textContent).to.equal('intermediate')
  })

  it('should handle different difficulty levels', () => {
    const easyTopic = { ...mockTopic, difficulty: 'easy' as const }
    render(<TopicCard topic={easyTopic} />)
    expect(screen.getByText('easy')).to.exist
  })

  it('should handle different categories', () => {
    const scienceTopic = { ...mockTopic, category: 'science' }
    const { container } = render(<TopicCard topic={scienceTopic} />)
    // Category is not displayed in TopicCard, just verify it renders
    expect(container.querySelector('.group')).to.exist
  })

  it('should render stats at the bottom', () => {
    const { container } = render(<TopicCard topic={mockTopic} />)
    const stats = container.querySelector('.flex.items-center.justify-between.text-xs')
    expect(stats).to.exist
  })
})
