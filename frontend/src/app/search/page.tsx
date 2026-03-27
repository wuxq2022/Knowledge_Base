'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { knowledgeApi } from '@/lib/api'
import ArticleCard from '@/components/knowledge/ArticleCard'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      setLoading(true)
      knowledgeApi.search({ query, page_size: 20 })
        .then((res) => setResults(res.data))
        .finally(() => setLoading(false))
    }
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">搜索结果</h1>
        {query && (
          <p className="text-gray-600">
            搜索 &ldquo;<span className="font-medium">{query}</span>&rdquo; 的结果
          </p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">搜索中...</p>
        </div>
      ) : results ? (
        <>
          <p className="text-gray-600 mb-6">找到 {results.total} 条结果</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.items.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {results.items.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">没有找到相关内容</p>
              <Link href="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
                返回首页
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">请输入搜索关键词</p>
        </div>
      )}
    </div>
  )
}
