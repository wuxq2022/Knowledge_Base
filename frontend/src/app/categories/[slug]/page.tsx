import Link from 'next/link'
import ArticleCard from '@/components/knowledge/ArticleCard'
import { ChevronRight, FolderOpen } from 'lucide-react'
import type { Category, KnowledgeArticle, PaginatedResponse } from '@/types'

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/categories`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const categories = await res.json()
    return categories.find((c: Category) => c.slug === slug) || null
  } catch {
    return null
  }
}

async function getCategoryTree(): Promise<Category[]> {
  try {
    const res = await fetch('http://localhost:8000/api/v1/categories/tree', {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function getArticlesByCategory(categoryId: number): Promise<PaginatedResponse<KnowledgeArticle>> {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/knowledge?category_id=${categoryId}&page_size=20&status=published`, {
      cache: 'no-store',
    })
    if (!res.ok) return { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 }
    return res.json()
  } catch {
    return { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 }
  }
}

function findCategoryInTree(tree: Category[], slug: string): Category | null {
  for (const cat of tree) {
    if (cat.slug === slug) return cat
    if ((cat as any).children) {
      const found = findCategoryInTree((cat as any).children, slug)
      if (found) return found
    }
  }
  return null
}

function findParentCategory(tree: Category[], slug: string): Category | null {
  for (const cat of tree) {
    if ((cat as any).children) {
      if ((cat as any).children.some((c: Category) => c.slug === slug)) {
        return cat
      }
      const found = findParentCategory((cat as any).children, slug)
      if (found) return found
    }
  }
  return null
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const tree = await getCategoryTree()
  const category = findCategoryInTree(tree, params.slug)
  const parentCategory = findParentCategory(tree, params.slug)

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">分类未找到</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const articles = await getArticlesByCategory(category.id)
  const children = (category as any).children || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">首页</Link>
        <ChevronRight className="w-4 h-4" />
        {parentCategory && (
          <>
            <Link href={`/categories/${parentCategory.slug}`} className="hover:text-gray-700">
              {parentCategory.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>

      {children.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">子分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {children.map((child: Category) => (
              <Link
                key={child.id}
                href={`/categories/${child.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-gray-900">{child.name}</span>
                </div>
                {child.description && (
                  <p className="text-sm text-gray-500 mt-1 truncate">{child.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          相关文章 ({articles.total})
        </h2>
        {articles.items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            该分类下暂无文章
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
