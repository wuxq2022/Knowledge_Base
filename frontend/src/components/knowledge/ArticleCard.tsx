'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { KnowledgeArticle } from '@/types'

interface Props {
  article: KnowledgeArticle
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link href={`/knowledge/${article.slug}`}>
      <article className="card h-full flex flex-col">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs rounded-full"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {article.summary || article.content.replace(/[#*`]/g, '').slice(0, 150)}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatDate(article.created_at)}</span>
          <span>{article.view_count} 阅读</span>
        </div>
      </article>
    </Link>
  )
}
