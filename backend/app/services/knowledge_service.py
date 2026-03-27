from sqlalchemy.orm import Session
from typing import Optional, List, Tuple
from datetime import datetime
from sqlalchemy import or_
from app.models import KnowledgeArticle, ArticleStatus, ArticleVersion, Tag
from app.schemas import KnowledgeArticleCreate, KnowledgeArticleUpdate


class KnowledgeService:
    @staticmethod
    def get_list(
        db: Session,
        skip: int = 0,
        limit: int = 10,
        category_id: Optional[int] = None,
        status: Optional[ArticleStatus] = None,
        tag_id: Optional[int] = None
    ) -> Tuple[List[KnowledgeArticle], int]:
        query = db.query(KnowledgeArticle)
        
        if category_id:
            query = query.filter(KnowledgeArticle.category_id == category_id)
        if status:
            query = query.filter(KnowledgeArticle.status == status)
        if tag_id:
            query = query.filter(KnowledgeArticle.tags.any(Tag.id == tag_id))
        
        total = query.count()
        items = query.order_by(KnowledgeArticle.created_at.desc()).offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def get_by_id(db: Session, article_id: int) -> Optional[KnowledgeArticle]:
        return db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[KnowledgeArticle]:
        return db.query(KnowledgeArticle).filter(KnowledgeArticle.slug == slug).first()

    @staticmethod
    def create(db: Session, article: KnowledgeArticleCreate, author_id: int) -> KnowledgeArticle:
        article_data = article.model_dump(exclude={"tag_ids"})
        db_article = KnowledgeArticle(**article_data, author_id=author_id)
        
        if article.tag_ids:
            tags = db.query(Tag).filter(Tag.id.in_(article.tag_ids)).all()
            db_article.tags = tags
        
        if article.status == ArticleStatus.PUBLISHED:
            db_article.published_at = datetime.utcnow()
        
        db.add(db_article)
        db.commit()
        db.refresh(db_article)
        return db_article

    @staticmethod
    def update(db: Session, article_id: int, article: KnowledgeArticleUpdate, editor_id: int) -> Optional[KnowledgeArticle]:
        db_article = KnowledgeService.get_by_id(db, article_id)
        if not db_article:
            return None
        
        if db_article.content != article.content:
            version = ArticleVersion(
                article_id=article_id,
                content=db_article.content,
                version_number=db_article.versions[-1].version_number + 1 if db_article.versions else 1,
                editor_id=editor_id
            )
            db.add(version)
        
        update_data = article.model_dump(exclude_unset=True, exclude={"tag_ids"})
        for key, value in update_data.items():
            setattr(db_article, key, value)
        
        if article.tag_ids is not None:
            tags = db.query(Tag).filter(Tag.id.in_(article.tag_ids)).all()
            db_article.tags = tags
        
        if article.status == ArticleStatus.PUBLISHED and not db_article.published_at:
            db_article.published_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_article)
        return db_article

    @staticmethod
    def delete(db: Session, article_id: int) -> bool:
        db_article = KnowledgeService.get_by_id(db, article_id)
        if not db_article:
            return False
        db.delete(db_article)
        db.commit()
        return True

    @staticmethod
    def increment_view_count(db: Session, article_id: int) -> None:
        db_article = KnowledgeService.get_by_id(db, article_id)
        if db_article:
            db_article.view_count += 1
            db.commit()

    @staticmethod
    def search(
        db: Session,
        query: str,
        category_id: Optional[int] = None,
        tag_ids: Optional[List[int]] = None,
        status: Optional[ArticleStatus] = None,
        skip: int = 0,
        limit: int = 10
    ) -> Tuple[List[KnowledgeArticle], int]:
        search_query = db.query(KnowledgeArticle).filter(
            or_(
                KnowledgeArticle.title.contains(query),
                KnowledgeArticle.content.contains(query),
                KnowledgeArticle.summary.contains(query)
            )
        )
        
        if category_id:
            search_query = search_query.filter(KnowledgeArticle.category_id == category_id)
        if status:
            search_query = search_query.filter(KnowledgeArticle.status == status)
        if tag_ids:
            search_query = search_query.filter(KnowledgeArticle.tags.any(Tag.id.in_(tag_ids)))
        
        total = search_query.count()
        items = search_query.order_by(KnowledgeArticle.created_at.desc()).offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def get_featured(db: Session, limit: int = 5) -> List[KnowledgeArticle]:
        return db.query(KnowledgeArticle).filter(
            KnowledgeArticle.is_featured == True,
            KnowledgeArticle.status == ArticleStatus.PUBLISHED
        ).order_by(KnowledgeArticle.view_count.desc()).limit(limit).all()
