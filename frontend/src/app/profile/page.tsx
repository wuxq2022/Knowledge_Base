'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { userApi, knowledgeApi } from '@/lib/api'
import type { KnowledgeArticle } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [myArticles, setMyArticles] = useState<KnowledgeArticle[]>([])
  const [formData, setFormData] = useState({
    email: '',
    avatar: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        avatar: user.avatar || '',
      }))
      fetchMyArticles()
    }
  }, [isAuthenticated, user, router])

  const fetchMyArticles = async () => {
    try {
      const res = await knowledgeApi.getAll({ page: 1, page_size: 10 })
      setMyArticles(res.data.items)
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }
    setLoading(true)

    try {
      const updateData: { email?: string; avatar?: string; password?: string } = {}
      if (formData.email !== user?.email) updateData.email = formData.email
      if (formData.avatar) updateData.avatar = formData.avatar
      if (formData.password) updateData.password = formData.password

      if (Object.keys(updateData).length > 0) {
        const res = await userApi.updateMe(updateData)
        setUser(res.data)
        alert('更新成功')
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">个人中心</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-3xl text-primary-600">{user.username[0].toUpperCase()}</span>
                )}
              </div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {user.role === 'admin' ? '管理员' : user.role === 'editor' ? '编辑' : '用户'}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">修改信息</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  头像URL
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="留空则不修改"
                />
              </div>

              {formData.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    确认密码
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? '保存中...' : '保存'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">我的文章</h3>
            {myArticles.length === 0 ? (
              <p className="text-gray-500">暂无文章</p>
            ) : (
              <div className="space-y-3">
                {myArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{article.title}</h4>
                      <p className="text-sm text-gray-500">
                        {article.status === 'published' ? '已发布' : article.status === 'draft' ? '草稿' : '已归档'}
                      </p>
                    </div>
                    <a
                      href={`/knowledge/${article.id}/edit`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      编辑
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
