from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import Comment, User, KnowledgeArticle
from app.api.v1.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/comments", tags=["Comments"])


class CommentCreate(BaseModel):
    article_id: int
    content: str
    parent_id: int = None


class CommentResponse(BaseModel):
    id: int
    article_id: int
    user_id: int = None
    user_name: str = None
    user_avatar: str = None
    parent_id: int = None
    content: str
    created_at: datetime
    updated_at: datetime = None
    replies: List["CommentResponse"] = []

    class Config:
        from_attributes = True


class CommentListResponse(BaseModel):
    items: List[CommentResponse]
    total: int


@router.get("/article/{article_id}", response_model=CommentListResponse)
def get_article_comments(
    article_id: int,
    db: Session = Depends(get_db)
):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    comments = db.query(Comment).filter(
        Comment.article_id == article_id,
        Comment.parent_id == None,
        Comment.is_deleted == False
    ).order_by(Comment.created_at.desc()).all()
    
    def build_comment_tree(comment: Comment) -> CommentResponse:
        replies = []
        for reply in comment.replies:
            if not reply.is_deleted:
                replies.append(build_comment_tree(reply))
        
        return CommentResponse(
            id=comment.id,
            article_id=comment.article_id,
            user_id=comment.user_id,
            user_name=comment.user.username if comment.user else "已删除用户",
            user_avatar=comment.user.avatar if comment.user else None,
            parent_id=comment.parent_id,
            content=comment.content,
            created_at=comment.created_at,
            updated_at=comment.updated_at,
            replies=replies
        )
    
    items = [build_comment_tree(c) for c in comments]
    total = db.query(Comment).filter(
        Comment.article_id == article_id,
        Comment.is_deleted == False
    ).count()
    
    return CommentListResponse(items=items, total=total)


@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == comment.article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    if comment.parent_id:
        parent = db.query(Comment).filter(Comment.id == comment.parent_id).first()
        if not parent or parent.article_id != comment.article_id:
            raise HTTPException(status_code=400, detail="父评论不存在或不属于该文章")
    
    db_comment = Comment(
        article_id=comment.article_id,
        user_id=current_user.id,
        parent_id=comment.parent_id,
        content=comment.content
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return CommentResponse(
        id=db_comment.id,
        article_id=db_comment.article_id,
        user_id=db_comment.user_id,
        user_name=current_user.username,
        user_avatar=current_user.avatar,
        parent_id=db_comment.parent_id,
        content=db_comment.content,
        created_at=db_comment.created_at,
        updated_at=db_comment.updated_at,
        replies=[]
    )


@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    content: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此评论")
    
    comment.content = content
    db.commit()
    db.refresh(comment)
    
    return CommentResponse(
        id=comment.id,
        article_id=comment.article_id,
        user_id=comment.user_id,
        user_name=current_user.username,
        user_avatar=current_user.avatar,
        parent_id=comment.parent_id,
        content=comment.content,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
        replies=[]
    )


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权删除此评论")
    
    comment.is_deleted = True
    comment.content = "[已删除]"
    db.commit()
