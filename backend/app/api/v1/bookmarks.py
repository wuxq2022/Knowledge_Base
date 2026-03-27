from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import Bookmark, User, KnowledgeArticle
from app.api.v1.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])


class BookmarkResponse(BaseModel):
    id: int
    article_id: int
    article_title: str
    article_slug: str
    created_at: datetime

    class Config:
        from_attributes = True


class BookmarkStatus(BaseModel):
    is_bookmarked: bool
    bookmark_id: int = None


@router.get("/", response_model=List[BookmarkResponse])
def get_my_bookmarks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookmarks = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id
    ).order_by(Bookmark.created_at.desc()).all()
    
    return [
        BookmarkResponse(
            id=b.id,
            article_id=b.article_id,
            article_title=b.article.title,
            article_slug=b.article.slug,
            created_at=b.created_at
        )
        for b in bookmarks
    ]


@router.get("/check/{article_id}", response_model=BookmarkStatus)
def check_bookmark(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.article_id == article_id
    ).first()
    
    if bookmark:
        return BookmarkStatus(is_bookmarked=True, bookmark_id=bookmark.id)
    return BookmarkStatus(is_bookmarked=False)


@router.post("/{article_id}", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
def add_bookmark(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.article_id == article_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="已收藏该文章")
    
    bookmark = Bookmark(user_id=current_user.id, article_id=article_id)
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    
    return BookmarkResponse(
        id=bookmark.id,
        article_id=article_id,
        article_title=article.title,
        article_slug=article.slug,
        created_at=bookmark.created_at
    )


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_bookmark(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.article_id == article_id
    ).first()
    
    if not bookmark:
        raise HTTPException(status_code=404, detail="未收藏该文章")
    
    db.delete(bookmark)
    db.commit()
