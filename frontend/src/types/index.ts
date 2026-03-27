export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  is_active: boolean
  avatar?: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  parent_id?: number
  sort_order: number
  created_at: string
  children?: Category[]
}

export interface Tag {
  id: number
  name: string
  slug: string
  color: string
  created_at: string
}

export interface KnowledgeArticle {
  id: number
  title: string
  slug: string
  content: string
  summary?: string
  author_id?: number
  category_id?: number | null
  status: 'draft' | 'published' | 'archived'
  view_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
  published_at?: string
  tags: Tag[]
  category?: Category
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface SearchParams {
  query: string
  category_id?: number
  tag_ids?: number[]
  status?: string
  page?: number
  page_size?: number
}

export interface Comment {
  id: number
  article_id: number
  user_id: number | null
  user_name: string | null
  user_avatar: string | null
  parent_id: number | null
  content: string
  created_at: string
  updated_at: string
  replies: Comment[]
}

export interface Bookmark {
  id: number
  article_id: number
  article_title: string
  article_slug: string
  created_at: string
}
