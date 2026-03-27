import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { formatDate } from '@/lib/utils'
import { API_BASE_URL } from '@/lib/config'
import Link from 'next/link'
import { ArrowLeft, Eye, Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import type { KnowledgeArticle } from '@/types'

async function getArticle(slug: string): Promise<KnowledgeArticle | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/knowledge/slug/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const article = await getArticle(params.slug)

  if (!article) {
    return {
      title: '文章未找到 - 知识库',
    }
  }

  return {
    title: `${article.title} - 知识库`,
    description: article.summary || article.content.replace(/[#*`]/g, '').slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.summary || article.content.replace(/[#*`]/g, '').slice(0, 160),
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      authors: article.author_id ? ['知识库作者'] : undefined,
      tags: article.tags.map((t) => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || article.content.replace(/[#*`]/g, '').slice(0, 160),
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticle(params.slug)

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <Link href="/knowledge" className="text-primary-600 hover:text-primary-700">
            返回列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/knowledge"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {article.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-3 py-1 text-sm rounded-full"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <div className="flex items-center gap-6 text-gray-500">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.created_at)}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.view_count} 阅读
            </span>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <MarkdownRenderer content={article.content} />
        </div>
      </article>
    </div>
  )
}
