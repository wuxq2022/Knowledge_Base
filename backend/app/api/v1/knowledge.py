from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.models import KnowledgeArticle, ArticleStatus
from app.schemas import (
    KnowledgeArticleCreate,
    KnowledgeArticleUpdate,
    KnowledgeArticleResponse,
    KnowledgeArticleListResponse,
    SearchResult
)
from app.services.knowledge_service import KnowledgeService

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


@router.get("/", response_model=KnowledgeArticleListResponse)
def get_articles(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category_id: Optional[int] = None,
    status: Optional[ArticleStatus] = None,
    tag_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size
    items, total = KnowledgeService.get_list(db, skip, page_size, category_id, status, tag_id)
    total_pages = (total + page_size - 1) // page_size
    return KnowledgeArticleListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/featured", response_model=List[KnowledgeArticleResponse])
def get_featured_articles(limit: int = 5, db: Session = Depends(get_db)):
    return KnowledgeService.get_featured(db, limit)


@router.get("/{article_id}", response_model=KnowledgeArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = KnowledgeService.get_by_id(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    KnowledgeService.increment_view_count(db, article_id)
    return article


@router.get("/slug/{slug}", response_model=KnowledgeArticleResponse)
def get_article_by_slug(slug: str, db: Session = Depends(get_db)):
    article = KnowledgeService.get_by_slug(db, slug)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    KnowledgeService.increment_view_count(db, article.id)
    return article


@router.post("/", response_model=KnowledgeArticleResponse, status_code=status.HTTP_201_CREATED)
def create_article(article: KnowledgeArticleCreate, db: Session = Depends(get_db)):
    if KnowledgeService.get_by_slug(db, article.slug):
        raise HTTPException(status_code=400, detail="Slug already exists")
    return KnowledgeService.create(db, article, author_id=1)


@router.put("/{article_id}", response_model=KnowledgeArticleResponse)
def update_article(article_id: int, article: KnowledgeArticleUpdate, db: Session = Depends(get_db)):
    updated = KnowledgeService.update(db, article_id, article, editor_id=1)
    if not updated:
        raise HTTPException(status_code=404, detail="Article not found")
    return updated


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(article_id: int, db: Session = Depends(get_db)):
    if not KnowledgeService.delete(db, article_id):
        raise HTTPException(status_code=404, detail="Article not found")


@router.get("/search/", response_model=SearchResult)
def search_articles(
    query: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category_id: Optional[int] = None,
    tag_ids: Optional[str] = None,
    status: Optional[ArticleStatus] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size
    tag_id_list = [int(t) for t in tag_ids.split(",")] if tag_ids else None
    items, total = KnowledgeService.search(db, query, category_id, tag_id_list, status, skip, page_size)
    total_pages = (total + page_size - 1) // page_size
    return SearchResult(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )
