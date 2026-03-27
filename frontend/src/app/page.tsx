import Link from 'next/link'
import ArticleCard from '@/components/knowledge/ArticleCard'
import SearchBar from '@/components/knowledge/SearchBar'
import { FolderOpen, ChevronRight } from 'lucide-react'
import { API_BASE_URL } from '@/lib/config'
import type { Category, KnowledgeArticle } from '@/types'

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/tree`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function getFeaturedArticles(): Promise<KnowledgeArticle[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/knowledge/featured?limit=6`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [categories, featuredArticles] = await Promise.all([
    getCategories(),
    getFeaturedArticles(),
  ])

  const hasCategories = categories.length > 0
  const hasArticles = featuredArticles.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            软件技术知识库
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            收集整理各类软件技术知识，助力开发者成长
          </p>
        </div>
        <SearchBar />
      </section>

      {!hasCategories && !hasArticles && (
        <section className="mb-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              后端服务未启动
            </h3>
            <p className="text-yellow-700 mb-4">
              请确保后端服务正在运行，或查看下方说明启动服务
            </p>
            <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-2">启动后端命令：</p>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                cd backend && uvicorn app.main:app --reload --port 8000
              </code>
            </div>
          </div>
        </section>
      )}

      {hasCategories && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">知识分类</h2>
            <Link href="/categories" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const children = (category as any).children || []
              return (
                <div key={category.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-500 truncate">{category.description}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  {children.length > 0 && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-50">
                      <div className="flex flex-wrap gap-2">
                        {children.slice(0, 4).map((child: Category) => (
                          <Link
                            key={child.id}
                            href={`/categories/${child.slug}`}
                            className="px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                        {children.length > 4 && (
                          <Link
                            href={`/categories/${category.slug}`}
                            className="px-2.5 py-1 text-xs text-gray-400 hover:text-primary-600"
                          >
                            +{children.length - 4} 更多
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {hasArticles && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">精选文章</h2>
            <Link href="/knowledge" className="text-primary-600 hover:text-primary-700">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
