from sqlalchemy.orm import Session
from typing import Optional, List
from app.models import Category
from app.schemas import CategoryCreate, CategoryUpdate


class CategoryService:
    @staticmethod
    def get_list(db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
        return db.query(Category).order_by(Category.sort_order, Category.id).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, category_id: int) -> Optional[Category]:
        return db.query(Category).filter(Category.id == category_id).first()

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Optional[Category]:
        return db.query(Category).filter(Category.slug == slug).first()

    @staticmethod
    def create(db: Session, category: CategoryCreate) -> Category:
        db_category = Category(**category.model_dump())
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category

    @staticmethod
    def update(db: Session, category_id: int, category: CategoryUpdate) -> Optional[Category]:
        db_category = CategoryService.get_by_id(db, category_id)
        if not db_category:
            return None
        update_data = category.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
        return db_category

    @staticmethod
    def delete(db: Session, category_id: int) -> bool:
        db_category = CategoryService.get_by_id(db, category_id)
        if not db_category:
            return False
        db.delete(db_category)
        db.commit()
        return True

    @staticmethod
    def get_tree(db: Session) -> List[dict]:
        categories = db.query(Category).order_by(Category.sort_order).all()
        category_map = {c.id: {"id": c.id, "name": c.name, "slug": c.slug, "children": []} for c in categories}
        tree = []
        for c in categories:
            if c.parent_id and c.parent_id in category_map:
                category_map[c.parent_id]["children"].append(category_map[c.id])
            else:
                tree.append(category_map[c.id])
        return tree
