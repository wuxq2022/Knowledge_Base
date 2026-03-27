import Link from 'next/link'
import { ChevronRight, Folder, FolderOpen } from 'lucide-react'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  showChildren?: boolean
}

function CategoryItem({ category, level = 0 }: { category: Category & { children?: Category[] }; level?: number }) {
  const hasChildren = category.children && category.children.length > 0
  
  return (
    <div>
      <Link
        href={`/categories/${category.slug}`}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasChildren ? (
          <FolderOpen className="w-5 h-5 text-primary-500" />
        ) : (
          <Folder className="w-5 h-5 text-primary-500" />
        )}
        <span className="text-gray-700 group-hover:text-primary-600 font-medium">{category.name}</span>
        {category.description && (
          <span className="text-gray-400 text-sm hidden md:inline truncate flex-1">
            {category.description}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 ml-auto" />
      </Link>
      {category.children && category.children.length > 0 && (
        <div className="border-l-2 border-gray-100 ml-6">
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child as any} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoryList({ categories, showChildren = true }: Props) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无分类
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category as any} />
      ))}
    </div>
  )
}
