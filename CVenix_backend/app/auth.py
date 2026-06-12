from datetime import datetime
from datetime import timedelta
from datetime import timezone

from fastapi import Cookie
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from jose import JWTError
from jose import jwt

from passlib.context import CryptContext

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

SECRET_KEY = "cvenix-secret-key-change-this-later"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_DAYS = 7

COOKIE_NAME = "cvenix_token"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None
):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta
        else timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            return None

        return int(user_id)

    except JWTError:
        return None
    except ValueError:
        return None


def get_current_user(
    cvenix_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if not cvenix_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated."
        )

    user_id = verify_access_token(cvenix_token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )

    return user