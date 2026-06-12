from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.models import User
from app.auth import hash_password

from app.routes.auth_routes import router as auth_router
from app.routes.template_routes import router as template_router
from app.routes.resume_routes import router as resume_router
from app.routes.admin_routes import router as admin_router
from app.routes.notification_routes import router as notification_router
from app.routes.support_routes import router as support_router
from app.routes.ai_resume_routes import router as ai_resume_router

Base.metadata.create_all(bind=engine)

# AUTO ADD NEW COLUMNS IF MISSING
with engine.connect() as conn:
    conn.execute(
        text("""
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'user'
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS profile_image_url TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS linkedin_url TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS github_url TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS portfolio_url TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS website_url TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS projects TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS certifications TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS achievements TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS reference_details TEXT
        """)
    )

    conn.execute(
        text("""
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS custom_sections TEXT
        """)
    )

    conn.commit()

# AUTO CREATE DEFAULT ADMIN
db: Session = SessionLocal()

try:
    admin_email = "admin@cvenix.com"

    existing_admin = (
        db.query(User)
        .filter(User.email == admin_email)
        .first()
    )

    if not existing_admin:
        admin_user = User(
            full_name="CVenix Admin",
            email=admin_email,
            password=hash_password("admin123"),
            role="admin"
        )

        db.add(admin_user)
        db.commit()

finally:
    db.close()

app = FastAPI(
    title="CVenix Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(template_router)
app.include_router(resume_router)
app.include_router(admin_router)
app.include_router(notification_router)
app.include_router(support_router)
app.include_router(ai_resume_router)


@app.get("/")
def root():
    return {
        "message": "CVenix Backend Running"
    }