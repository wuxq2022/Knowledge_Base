'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X, LogOut, Settings, User, Bookmark, Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const premiumAvatarStyles = [
  'avataaars',
  'bottts',
  'micah',
  'notionists',
  'open-peeps',
  'personas',
  'fun-emoji',
  'adventurer',
]

const backgroundColors = [
  'b6e3f4',
  'c0aede',
  'ffd5dc',
  'ffdfbf',
  'd1d4f9',
  'c1e1c5',
  'ffe4cc',
  'f9c9b6',
]

function getAvatarStyle(username: string): string {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % premiumAvatarStyles.length
  return premiumAvatarStyles[index]
}

function getBackgroundColor(username: string): string {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % backgroundColors.length
  return backgroundColors[index]
}

function generateAvatar(username: string): string {
  const style = getAvatarStyle(username)
  const bgColor = getBackgroundColor(username)
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(username)}&backgroundColor=${bgColor}&radius=50`
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    window.location.href = '/'
  }

  const renderAvatar = (size: 'sm' | 'md' | 'lg' = 'sm') => {
    if (!user) return null
    
    const sizeClasses = {
      sm: 'w-9 h-9',
      md: 'w-11 h-11',
      lg: 'w-14 h-14'
    }
    
    if (user.avatar) {
      return (
        <img 
          src={user.avatar} 
          alt={user.username}
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white/80 shadow-lg`}
        />
      )
    }
    
    const avatarUrl = generateAvatar(user.username)
    
    return (
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        ring-2 ring-white/80 
        shadow-lg shadow-gray-300/50
        overflow-hidden
        bg-white
        transform hover:scale-105 hover:shadow-xl
        transition-all duration-300 ease-out
        cursor-pointer
      `}>
        <img 
          src={avatarUrl}
          alt={user.username}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all duration-300">
                <span className="text-white font-bold text-sm">KB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">知识库</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              首页
            </Link>
            <Link href="/knowledge" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              知识库
            </Link>
            <Link href="/categories" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              分类
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/search" className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <Search className="w-5 h-5" />
            </Link>
            
            {isAuthenticated && user?.role !== 'viewer' && (
              <Link 
                href="/knowledge/new" 
                className="flex items-center gap-1.5 px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">写文章</span>
              </Link>
            )}
            
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                >
                  {renderAvatar()}
                  <span className="text-gray-700 font-medium text-sm">{user.username}</span>
                </button>
                
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden z-50">
                      <div className="p-5 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                        <div className="flex items-center gap-4">
                          {renderAvatar('lg')}
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-gray-900 truncate">{user.username}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full
                            ${user.role === 'admin' 
                              ? 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 ring-1 ring-violet-200' 
                              : user.role === 'editor' 
                                ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 ring-1 ring-sky-200'
                                : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 ring-1 ring-gray-200'}
                          `}>
                            {user.role === 'admin' ? '👑 管理员' : user.role === 'editor' ? '✏️ 编辑者' : '👀 浏览者'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          个人中心
                        </Link>
                        
                        <Link
                          href="/bookmarks"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Bookmark className="w-4 h-4 text-gray-400" />
                          我的收藏
                        </Link>
                        
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                            管理后台
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          退出登录
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300"
              >
                登录
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              <Link href="/" className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
                首页
              </Link>
              <Link href="/knowledge" className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
                知识库
              </Link>
              <Link href="/categories" className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
                分类
              </Link>
              
              {isAuthenticated && user ? (
                <>
                  <div className="mt-3 pt-3 border-t border-gray-100 px-4">
                    <div className="flex items-center gap-3 mb-3">
                      {renderAvatar('md')}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full
                      ${user.role === 'admin' 
                        ? 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700' 
                        : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600'}
                    `}>
                      {user.role === 'admin' ? '👑 管理员' : '👀 浏览者'}
                    </span>
                  </div>
                  <Link href="/profile" className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
                    个人中心
                  </Link>
                  <Link href="/bookmarks" className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
                    我的收藏
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 mx-4 flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </>
              ) : (
                <Link href="/login" className="mt-3 mx-4 btn-primary text-center">
                  登录
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
