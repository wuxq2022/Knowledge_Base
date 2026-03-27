from fastapi import APIRouter
from app.api.v1 import categories, knowledge, external, auth, tags, users, versions, comments, bookmarks

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(categories.router)
api_router.include_router(knowledge.router)
api_router.include_router(external.router)
api_router.include_router(tags.router)
api_router.include_router(users.router)
api_router.include_router(versions.router)
api_router.include_router(comments.router)
api_router.include_router(bookmarks.router)
