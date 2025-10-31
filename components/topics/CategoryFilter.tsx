'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      setLoading(true)

      // Try using the optimized RPC function first (if it exists)
      // Falls back to the standard query if the function doesn't exist
      // @ts-ignore - RPC function may not exist in types until migration is run
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_distinct_categories')

      if (!rpcError && rpcData && Array.isArray(rpcData)) {
        // Use optimized function result
        // @ts-ignore - RPC result type not in generated types
        const categories = rpcData.map((item: any) => item.category as string)
        setCategories(categories)
      } else {
        // Fallback to selecting all topics (backwards compatible)
        const { data, error } = await supabase
          .from('topics')
          .select('category')
          .order('category')

        if (error) {
          console.error('Error fetching categories:', error)
        } else {
          // Get unique categories
          const uniqueCategories = [...new Set(data?.map((item) => item.category) || [])]
          setCategories(uniqueCategories)
        }
      }

      setLoading(false)
    }

    fetchCategories()
  }, [])

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