from datetime import datetime

from pydantic import BaseModel, EmailStr


class RegisterSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str


class UserResponseSchema(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    profile_image_url: str | None = None
    role: str

    class Config:
        from_attributes = True


class TemplateSchema(BaseModel):
    title: str
    category: str
    description: str
    image_url: str

    layout_key: str = "modern_sidebar"
    primary_color: str = "#1f2937"
    secondary_color: str = "#2563eb"

    is_active: bool = True


class TemplateResponse(BaseModel):
    id: int
    title: str
    category: str
    description: str
    image_url: str

    layout_key: str
    primary_color: str
    secondary_color: str

    is_active: bool

    class Config:
        from_attributes = True


class ResumeCreateSchema(BaseModel):
    user_id: int
    template_id: int | None = None

    resume_title: str

    full_name: str
    job_title: str

    email: EmailStr
    phone: str

    location: str

    summary: str | None = None
    skills: str | None = None
    education: str | None = None
    experience: str | None = None

    languages: str | None = None
    hobbies: str | None = None

    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    website_url: str | None = None

    projects: str | None = None
    certifications: str | None = None
    achievements: str | None = None
    references: str | None = None

    custom_sections: str | None = None

    profile_image_url: str | None = None

    primary_color: str = "#1f2937"
    secondary_color: str = "#2563eb"


class ResumeResponseSchema(BaseModel):
    id: int

    user_id: int
    template_id: int | None = None

    resume_title: str

    full_name: str
    job_title: str

    email: EmailStr
    phone: str

    location: str

    summary: str | None = None
    skills: str | None = None
    education: str | None = None
    experience: str | None = None

    languages: str | None = None
    hobbies: str | None = None

    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    website_url: str | None = None

    projects: str | None = None
    certifications: str | None = None
    achievements: str | None = None
    reference_details: str | None = None

    custom_sections: str | None = None

    profile_image_url: str | None = None

    primary_color: str
    secondary_color: str

    is_active: bool

    class Config:
        from_attributes = True


class NotificationCreateSchema(BaseModel):
    title: str
    message: str
    type: str = "info"


class NotificationResponseSchema(BaseModel):
    id: int

    title: str
    message: str

    type: str

    is_read: bool
    is_active: bool

    class Config:
        from_attributes = True


class SupportReplyCreateSchema(BaseModel):
    reply: str


class SupportReplyResponseSchema(BaseModel):
    id: int
    message_id: int
    admin_id: int
    reply: str
    is_read_by_user: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SupportMessageCreateSchema(BaseModel):
    subject: str
    message: str


class SupportMessageResponseSchema(BaseModel):
    id: int
    user_id: int
    subject: str
    message: str
    status: str
    is_read_by_admin: bool
    created_at: datetime
    replies: list[SupportReplyResponseSchema] = []

    class Config:
        from_attributes = True


class SupportMessageAdminResponseSchema(BaseModel):
    id: int
    user_id: int
    subject: str
    message: str
    status: str
    is_read_by_admin: bool
    created_at: datetime
    replies: list[SupportReplyResponseSchema] = []

    user: UserResponseSchema

    class Config:
        from_attributes = True