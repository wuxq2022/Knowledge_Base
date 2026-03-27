import Link from 'next/link'
import ArticleCard from '@/components/knowledge/ArticleCard'
import { API_BASE_URL } from '@/lib/config'
import type { KnowledgeArticle, PaginatedResponse } from '@/types'

async function getArticles(page: number, categoryId?: number): Promise<PaginatedResponse<KnowledgeArticle>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: '12',
      status: 'published',
    })
    if (categoryId) {
      params.append('category_id', categoryId.toString())
    }
    const res = await fetch(`${API_BASE_URL}/knowledge?${params.toString()}`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      return { items: [], total: 0, page: 1, page_size: 12, total_pages: 0 }
    }
    return res.json()
  } catch {
    return { items: [], total: 0, page: 1, page_size: 12, total_pages: 0 }
  }
}

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const categoryId = searchParams.category ? parseInt(searchParams.category) : undefined

  const { items, total, total_pages } = await getArticles(page, categoryId)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">知识库</h1>
        <p className="text-gray-600 mt-2">共 {total} 篇文章</p>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无文章
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/knowledge?page=${page - 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              上一页
            </Link>
          )}
          <span className="px-4 py-2 text-gray-600">
            第 {page} / {total_pages} 页
          </span>
          {page < total_pages && (
            <Link
              href={`/knowledge?page=${page + 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              下一页
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
