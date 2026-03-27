import Link from 'next/link'
import { FolderOpen, ChevronRight } from 'lucide-react'
import type { Category } from '@/types'

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

function CategoryCard({ category, level = 0 }: { category: Category & { children?: Category[] }; level?: number }) {
  const children = category.children || []
  
  return (
    <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${level > 0 ? 'border-l-4 border-l-primary-200' : ''}`}>
      <Link
        href={`/categories/${category.slug}`}
        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
      >
        <FolderOpen className="w-6 h-6 text-primary-500" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </Link>
      
      {children.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-3">
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/categories/${child.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors border border-gray-200"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function CategoriesPage() {
  const categories = await getCategoryTree()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">知识分类</h1>
        <p className="text-gray-600 mt-2">按技术领域分类浏览知识库内容</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          暂无分类
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category as any} />
          ))}
        </div>
      )}
    </div>
  )
}
