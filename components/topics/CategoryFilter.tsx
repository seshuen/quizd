'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)

      // Use RPC function as primary approach
      // @ts-expect-error - RPC function may not exist in types until migration is run
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_distinct_categories')

      if (rpcError) {
        console.error('Error fetching categories:', rpcError)
        setCategories([])
      } else {
        // @ts-expect-error - RPC result type not in generated types
        const categories = (rpcData || []).map((item: { category: string }) => item.category)
        setCategories(categories)
      }

      setLoading(false)
    }

    fetchCategories()
  }, [supabase])

  // Capitalize first letter for display
  const formatCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        <div className="h-9 w-24 animate-pulse rounded-full bg-gray-200"></div>
        <div className="h-9 w-20 animate-pulse rounded-full bg-gray-200"></div>
        <div className="h-9 w-28 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        aria-label="Show all topics"
        aria-pressed={selected === 'all'}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selected === 'all'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Topics
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          aria-label={`Filter by ${formatCategoryLabel(category)}`}
          aria-pressed={selected === category}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === category
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {formatCategoryLabel(category)}
        </button>
      ))}
    </div>
  )
}