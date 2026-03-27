from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field
from app.models import UserRole, ArticleStatus


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., max_length=100)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    avatar: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    email: Optional[str] = None
    avatar: Optional[str] = None
    password: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[Any] = None


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TagBase(BaseModel):
    name: str = Field(..., max_length=50)
    slug: str = Field(..., max_length=50)
    color: str = "#3B82F6"


class TagCreate(TagBase):
    pass


class TagResponse(TagBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class KnowledgeArticleBase(BaseModel):
    title: str = Field(..., max_length=200)
    slug: str = Field(..., max_length=200)
    content: str
    summary: Optional[str] = Field(None, max_length=500)
    category_id: Optional[int] = None
    status: ArticleStatus = ArticleStatus.DRAFT
    is_featured: bool = False


class KnowledgeArticleCreate(KnowledgeArticleBase):
    tag_ids: List[int] = []


class KnowledgeArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[ArticleStatus] = None
    is_featured: Optional[bool] = None
    tag_ids: Optional[List[int]] = None


class KnowledgeArticleResponse(KnowledgeArticleBase):
    id: int
    author_id: Optional[int]
    view_count: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    tags: List[TagResponse] = []

    class Config:
        from_attributes = True


class KnowledgeArticleListResponse(BaseModel):
    items: List[KnowledgeArticleResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class SearchParams(BaseModel):
    query: str = Field(..., min_length=1)
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None
    status: Optional[ArticleStatus] = None
    page: int = 1
    page_size: int = 10


class SearchResult(BaseModel):
    items: List[KnowledgeArticleResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
