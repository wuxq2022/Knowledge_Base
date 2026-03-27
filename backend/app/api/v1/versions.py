from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import ArticleVersion, KnowledgeArticle, User, UserRole
from app.api.v1.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/versions", tags=["Article Versions"])


class ArticleVersionResponse(BaseModel):
    id: int
    article_id: int
    content: str
    version_number: int
    editor_id: int = None
    change_summary: str = None
    created_at: datetime

    class Config:
        from_attributes = True


class ArticleVersionListResponse(BaseModel):
    id: int
    version_number: int
    editor_name: str = None
    change_summary: str = None
    created_at: datetime


@router.get("/article/{article_id}", response_model=List[ArticleVersionListResponse])
def get_article_versions(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    versions = db.query(ArticleVersion).filter(
        ArticleVersion.article_id == article_id
    ).order_by(ArticleVersion.version_number.desc()).all()
    
    result = []
    for v in versions:
        editor_name = v.editor.username if v.editor else None
        result.append(ArticleVersionListResponse(
            id=v.id,
            version_number=v.version_number,
            editor_name=editor_name,
            change_summary=v.change_summary,
            created_at=v.created_at
        ))
    return result


@router.get("/{version_id}", response_model=ArticleVersionResponse)
def get_version_detail(
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    version = db.query(ArticleVersion).filter(ArticleVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="版本不存在")
    return version


@router.post("/article/{article_id}/restore/{version_id}")
def restore_version(
    article_id: int,
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.EDITOR]:
        raise HTTPException(status_code=403, detail="需要编辑权限")
    
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    version = db.query(ArticleVersion).filter(
        ArticleVersion.id == version_id,
        ArticleVersion.article_id == article_id
    ).first()
    if not version:
        raise HTTPException(status_code=404, detail="版本不存在")
    
    new_version = ArticleVersion(
        article_id=article_id,
        content=article.content,
        version_number=len(article.versions) + 1,
        editor_id=current_user.id,
        change_summary=f"恢复到版本 {version.version_number}"
    )
    db.add(new_version)
    
    article.content = version.content
    db.commit()
    
    return {"message": "版本已恢复", "version_number": new_version.version_number}
