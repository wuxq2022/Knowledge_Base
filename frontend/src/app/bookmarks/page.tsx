'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { bookmarkApi } from '@/lib/api'
import type { Bookmark } from '@/types'
import { Trash2, ExternalLink } from 'lucide-react'

export default function BookmarksPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchBookmarks()
  }, [isAuthenticated, router])

  const fetchBookmarks = async () => {
    try {
      const res = await bookmarkApi.getAll()
      setBookmarks(res.data)
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (articleId: number) => {
    try {
      await bookmarkApi.remove(articleId)
      setBookmarks(bookmarks.filter((b) => b.article_id !== articleId))
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">我的收藏</h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无收藏</h3>
          <p className="text-gray-500 mb-6">浏览知识库时点击收藏按钮，即可在这里找到</p>
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
          >
            浏览知识库
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/knowledge/${bookmark.article_slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600 truncate block"
                  >
                    {bookmark.article_title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    收藏于 {new Date(bookmark.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/knowledge/${bookmark.article_slug}`}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleRemove(bookmark.article_id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
