from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Resume
from app.models import Template
from app.models import User

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db)
):
    total_users = (
        db.query(User)
        .filter(User.role == "user")
        .count()
    )

    total_resumes = (
        db.query(Resume)
        .filter(Resume.is_active == True)
        .count()
    )

    total_templates = (
        db.query(Template)
        .filter(Template.is_active == True)
        .count()
    )

    return {
        "total_users": total_users,
        "total_resumes": total_resumes,
        "total_templates": total_templates
    }


@router.get("/users")
def get_admin_users(
    db: Session = Depends(get_db)
):
    users = (
        db.query(User)
        .order_by(User.id.asc())
        .all()
    )

    return [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
        for user in users
    ]


@router.put("/users/{user_id}/make-admin")
def make_user_admin(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.role = "admin"

    db.commit()

    db.refresh(user)

    return {
        "message": "User role updated to admin",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Admin users cannot be deleted"
        )

    db.delete(user)

    db.commit()

    return {
        "message": "User deleted successfully"
    }