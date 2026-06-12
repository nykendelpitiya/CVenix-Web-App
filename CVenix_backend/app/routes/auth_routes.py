from fastapi import APIRouter
from fastapi import Cookie
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Response

from pydantic import BaseModel, EmailStr

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import RegisterSchema
from app.schemas import LoginSchema
from app.schemas import UserResponseSchema

from app.auth import COOKIE_NAME
from app.auth import create_access_token
from app.auth import get_current_user
from app.auth import hash_password
from app.auth import verify_access_token
from app.auth import verify_password
from app.schemas import ChangePasswordSchema

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


class UpdateProfileSchema(BaseModel):
    full_name: str
    email: EmailStr
    profile_image_url: str | None = None


@router.post("/register")
def register_user(
    user: RegisterSchema,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
        role="user"
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "profile_image_url": new_user.profile_image_url,
            "role": new_user.role
        }
    }


@router.post("/login")
def login_user(
    response: Response,
    user: LoginSchema,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    valid_password = verify_password(
        user.password,
        existing_user.password
    )

    if not valid_password:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": str(existing_user.id)
        }
    )

    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 7
    )

    return {
        "message": "Login successful",
        "user": {
            "id": existing_user.id,
            "full_name": existing_user.full_name,
            "email": existing_user.email,
            "profile_image_url": existing_user.profile_image_url,
            "role": existing_user.role
        }
    }


@router.get(
    "/me",
    response_model=UserResponseSchema
)
def get_logged_user_from_cookie(
    cvenix_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if not cvenix_token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    user_id = verify_access_token(
        cvenix_token
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    existing_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return existing_user


@router.put(
    "/profile",
    response_model=UserResponseSchema
)
def update_logged_user_profile(
    updated_profile: UpdateProfileSchema,
    cvenix_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if not cvenix_token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    user_id = verify_access_token(
        cvenix_token
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    existing_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    email_owner = (
        db.query(User)
        .filter(User.email == updated_profile.email)
        .first()
    )

    if email_owner and email_owner.id != existing_user.id:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    existing_user.full_name = updated_profile.full_name
    existing_user.email = updated_profile.email
    existing_user.profile_image_url = updated_profile.profile_image_url

    db.commit()

    db.refresh(existing_user)

    return existing_user

@router.put("/change-password")
def change_password(
    password_data: ChangePasswordSchema,
    cvenix_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if not cvenix_token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    user_id = verify_access_token(
        cvenix_token
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    existing_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    valid_password = verify_password(
        password_data.current_password,
        existing_user.password
    )

    if not valid_password:
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    existing_user.password = hash_password(
        password_data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }
    

@router.post("/logout")
def logout_user(
    response: Response
):
    response.delete_cookie(
        key=COOKIE_NAME
    )

    return {
        "message": "Logout successful"
    }


@router.get(
    "/me/{user_id}",
    response_model=UserResponseSchema
)
def get_logged_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return existing_user