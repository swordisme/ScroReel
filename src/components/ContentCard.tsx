'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import type { Series } from '@/types'
import AIBadge from './AIBadge'

interface ContentCardProps {
  series: Series
  size?: 'sm' | 'md' | 'lg'
}

export default function ContentCard({ series, size = 'md' }: ContentCardProps) {
  const sizeClasses = {
    sm: 'w-36 min-w-36',
    md: 'w-44 min-w-44',
    lg: 'w-56 min-w-56',
  }

  return (
    <Link
      href={`/series/${series.slug}`}
      className={`${sizeClasses[size]} group relative cursor-pointer flex-shrink-0`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 border border-gray-800/80 group-hover:border-yellow-400/50 transition-all duration-300">
        <img
          src={series.thumbnail_url}
          alt={series.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg transform group-hover:scale-105">
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {series.content_type === 'movie' ? (
            <span className="px-1.5 py-0.5 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-black rounded shadow">
              MOVIE
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-yellow-500/90 backdrop-blur-sm text-black text-[10px] font-black rounded shadow">
              SERIES
            </span>
          )}
          <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm text-gray-300 text-[10px] font-medium rounded">
            {series.rating}
          </span>
        </div>
        <div className="absolute bottom-2 left-2">
          <AIBadge />
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-0.5">
        <h3 className="text-white text-sm font-semibold line-clamp-1 group-hover:text-yellow-400 transition-colors">
          {series.title}
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">
          {series.content_type === 'series'
            ? `${series.total_episodes} Episodes`
            : 'Full Movie'}{' '}
          · {series.genre}
        </p>
      </div>
    </Link>
  )
}
