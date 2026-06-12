from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False, index=True)

    password = Column(String, nullable=False)

    profile_image_url = Column(Text, nullable=True)

    role = Column(String, nullable=False, default="user")

    resumes = relationship("Resume", backref="user")

    support_messages = relationship(
        "SupportMessage",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    support_replies = relationship(
        "SupportReply",
        back_populates="admin",
        cascade="all, delete-orphan"
    )


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    category = Column(String, nullable=False)

    description = Column(String, nullable=False)

    image_url = Column(String, nullable=False)

    layout_key = Column(String, nullable=False, default="modern_sidebar")

    primary_color = Column(String, nullable=False, default="#1f2937")

    secondary_color = Column(String, nullable=False, default="#2563eb")

    is_active = Column(Boolean, default=True)

    resumes = relationship("Resume", backref="template")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    template_id = Column(Integer, ForeignKey("templates.id"), nullable=True)

    resume_title = Column(String, nullable=False)

    full_name = Column(String, nullable=False)

    job_title = Column(String, nullable=False)

    email = Column(String, nullable=False)

    phone = Column(String, nullable=False)

    location = Column(String, nullable=False)

    summary = Column(Text, nullable=True)

    skills = Column(Text, nullable=True)

    education = Column(Text, nullable=True)

    experience = Column(Text, nullable=True)

    languages = Column(Text, nullable=True)

    hobbies = Column(Text, nullable=True)

    linkedin_url = Column(Text, nullable=True)

    github_url = Column(Text, nullable=True)

    portfolio_url = Column(Text, nullable=True)

    website_url = Column(Text, nullable=True)

    projects = Column(Text, nullable=True)

    certifications = Column(Text, nullable=True)

    achievements = Column(Text, nullable=True)

    reference_details = Column(Text, nullable=True)

    custom_sections = Column(Text, nullable=True)

    profile_image_url = Column(Text, nullable=True)

    primary_color = Column(String, nullable=False, default="#1f2937")

    secondary_color = Column(String, nullable=False, default="#2563eb")

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    message = Column(Text, nullable=False)

    type = Column(String, nullable=False, default="info")

    is_read = Column(Boolean, default=False)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    subject = Column(String, nullable=False)

    message = Column(Text, nullable=False)

    status = Column(String, nullable=False, default="open")

    is_read_by_admin = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="support_messages")

    replies = relationship(
        "SupportReply",
        back_populates="support_message",
        cascade="all, delete-orphan"
    )


class SupportReply(Base):
    __tablename__ = "support_replies"

    id = Column(Integer, primary_key=True, index=True)

    message_id = Column(Integer, ForeignKey("support_messages.id"), nullable=False)

    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    reply = Column(Text, nullable=False)

    is_read_by_user = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    support_message = relationship("SupportMessage", back_populates="replies")

    admin = relationship("User", back_populates="support_replies")