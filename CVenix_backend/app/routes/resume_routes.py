from collections import Counter
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Resume, Template
from app.schemas import (
    ResumeCreateSchema,
    ResumeResponseSchema,
)

router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ResumeResponseSchema)
def create_resume(
    resume: ResumeCreateSchema,
    db: Session = Depends(get_db),
):
    new_resume = Resume(
        user_id=resume.user_id,
        template_id=resume.template_id,
        resume_title=resume.resume_title,
        full_name=resume.full_name,
        job_title=resume.job_title,
        email=resume.email,
        phone=resume.phone,
        location=resume.location,
        summary=resume.summary,
        skills=resume.skills,
        education=resume.education,
        experience=resume.experience,
        languages=resume.languages,
        hobbies=resume.hobbies,
        linkedin_url=resume.linkedin_url,
        github_url=resume.github_url,
        portfolio_url=resume.portfolio_url,
        website_url=resume.website_url,
        projects=resume.projects,
        certifications=resume.certifications,
        achievements=resume.achievements,
        reference_details=resume.reference_details,
        custom_sections=resume.custom_sections,
        profile_image_url=resume.profile_image_url,
        primary_color=resume.primary_color,
        secondary_color=resume.secondary_color,
    )

    db.add(new_resume)

    db.commit()

    db.refresh(new_resume)

    return new_resume


@router.get("/", response_model=list[ResumeResponseSchema])
def get_resumes(
    db: Session = Depends(get_db),
):
    resumes = (
        db.query(Resume)
        .filter(Resume.is_active == True)
        .order_by(Resume.created_at.desc())
        .all()
    )

    return resumes


@router.get("/{resume_id}", response_model=ResumeResponseSchema)
def get_single_resume(
    resume_id: int,
    db: Session = Depends(get_db),
):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return resume


@router.put("/{resume_id}", response_model=ResumeResponseSchema)
def update_resume(
    resume_id: int,
    updated_resume: ResumeCreateSchema,
    db: Session = Depends(get_db),
):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    resume.user_id = updated_resume.user_id
    resume.template_id = updated_resume.template_id
    resume.resume_title = updated_resume.resume_title
    resume.full_name = updated_resume.full_name
    resume.job_title = updated_resume.job_title
    resume.email = updated_resume.email
    resume.phone = updated_resume.phone
    resume.location = updated_resume.location
    resume.summary = updated_resume.summary
    resume.skills = updated_resume.skills
    resume.education = updated_resume.education
    resume.experience = updated_resume.experience
    resume.languages = updated_resume.languages
    resume.hobbies = updated_resume.hobbies
    resume.linkedin_url = updated_resume.linkedin_url
    resume.github_url = updated_resume.github_url
    resume.portfolio_url = updated_resume.portfolio_url
    resume.website_url = updated_resume.website_url
    resume.projects = updated_resume.projects
    resume.certifications = updated_resume.certifications
    resume.achievements = updated_resume.achievements
    resume.reference_details = updated_resume.reference_details
    resume.custom_sections = updated_resume.custom_sections
    resume.profile_image_url = updated_resume.profile_image_url
    resume.primary_color = updated_resume.primary_color
    resume.secondary_color = updated_resume.secondary_color

    db.commit()

    db.refresh(resume)

    return resume


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    resume.is_active = False

    db.commit()

    return {
        "message": "Resume deleted successfully"
    }


# REAL ANALYTICS API
@router.get("/analytics/dashboard")
def get_dashboard_analytics(
    db: Session = Depends(get_db),
):
    resumes = (
        db.query(Resume)
        .filter(Resume.is_active == True)
        .all()
    )

    templates = (
        db.query(Template)
        .filter(Template.is_active == True)
        .all()
    )

    today = datetime.utcnow()

    weekly_activity = []

    for i in range(6, -1, -1):
        current_day = today - timedelta(days=i)

        day_name = current_day.strftime("%a")

        total_resumes = sum(
            1
            for resume in resumes
            if resume.created_at
            and resume.created_at.date() == current_day.date()
        )

        weekly_activity.append({
            "day": day_name,
            "resumes": total_resumes,
        })

    template_counter = Counter()

    for resume in resumes:
        if resume.template:
            template_counter[
                resume.template.category
            ] += 1

    template_usage = []

    colors = {
        "Modern": "#22d3ee",
        "Creative": "#a855f7",
        "Minimal": "#3b82f6",
        "Professional": "#14b8a6",
    }

    for category, count in template_counter.items():
        template_usage.append({
            "name": category,
            "value": count,
            "color": colors.get(category, "#22d3ee"),
        })

    total_resumes = len(resumes)

    active_resumes = sum(
        1
        for resume in resumes
        if resume.is_active
    )

    completion_percentage = 0

    if total_resumes > 0:
        completion_percentage = round(
            (active_resumes / total_resumes) * 100
        )

    return {
        "weekly_activity": weekly_activity,
        "template_usage": template_usage,
        "completion_percentage": completion_percentage,
    }