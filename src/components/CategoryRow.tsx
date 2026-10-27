'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ContentCard from './ContentCard'
import type { Series } from '@/types'

interface CategoryRowProps {
  title: string
  icon?: string
  series: Series[]
}

export default function CategoryRow({ title, icon, series }: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 400
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (!series.length) return null

  return (
    <section className="mb-10 relative">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-6 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>

      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-6 z-20 w-12 bg-gradient-to-r from-black/90 via-black/50 to-transparent items-center justify-center hidden group-hover:flex transition-all hover:w-14"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8 text-white hover:scale-125 transition-transform" />
        </button>

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {series.map((s) => (
            <ContentCard key={s.id} series={s} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-6 z-20 w-12 bg-gradient-to-l from-black/90 via-black/50 to-transparent items-center justify-center hidden group-hover:flex transition-all hover:w-14"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8 text-white hover:scale-125 transition-transform" />
        </button>
      </div>
    </section>
  )
}
