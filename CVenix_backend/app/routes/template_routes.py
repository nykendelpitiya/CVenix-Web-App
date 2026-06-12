from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Notification
from app.models import Template
from app.schemas import TemplateSchema, TemplateResponse

router = APIRouter(
    prefix="/api/templates",
    tags=["Templates"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[TemplateResponse])
def get_templates(db: Session = Depends(get_db)):
    templates = (
        db.query(Template)
        .filter(Template.is_active == True)
        .order_by(Template.id.asc())
        .all()
    )

    return templates


@router.get("/{template_id}", response_model=TemplateResponse)
def get_single_template(
    template_id: int,
    db: Session = Depends(get_db),
):
    template = (
        db.query(Template)
        .filter(Template.id == template_id)
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )

    return template


@router.post("/", response_model=TemplateResponse)
def create_template(
    template: TemplateSchema,
    db: Session = Depends(get_db),
):
    new_template = Template(
        title=template.title,
        category=template.category,
        description=template.description,
        image_url=template.image_url,
        layout_key=template.layout_key,
        primary_color=template.primary_color,
        secondary_color=template.secondary_color,
        is_active=template.is_active,
    )

    db.add(new_template)

    db.commit()

    db.refresh(new_template)

    new_notification = Notification(
        title="New template added",
        message=f"{new_template.title} is now available in CV templates.",
        type="template"
    )

    db.add(new_notification)

    db.commit()

    return new_template


@router.put("/{template_id}", response_model=TemplateResponse)
def update_template(
    template_id: int,
    updated_template: TemplateSchema,
    db: Session = Depends(get_db),
):
    template = (
        db.query(Template)
        .filter(Template.id == template_id)
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )

    template.title = updated_template.title
    template.category = updated_template.category
    template.description = updated_template.description
    template.image_url = updated_template.image_url
    template.layout_key = updated_template.layout_key
    template.primary_color = updated_template.primary_color
    template.secondary_color = updated_template.secondary_color
    template.is_active = updated_template.is_active

    db.commit()

    db.refresh(template)

    new_notification = Notification(
        title="Template updated",
        message=f"{template.title} template has been updated.",
        type="template"
    )

    db.add(new_notification)

    db.commit()

    return template


@router.delete("/{template_id}")
def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
):
    template = (
        db.query(Template)
        .filter(Template.id == template_id)
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )

    template_title = template.title

    template.is_active = False

    db.commit()

    new_notification = Notification(
        title="Template removed",
        message=f"{template_title} template is no longer available.",
        type="template"
    )

    db.add(new_notification)

    db.commit()

    return {
        "message": "Template deleted successfully"
    }


@router.post("/seed")
def seed_templates(db: Session = Depends(get_db)):
    existing_template = db.query(Template).first()

    if existing_template:
        return {
            "message": "Templates already seeded"
        }

    templates = [
        Template(
            title="Modern Sidebar CV",
            category="Professional",
            description="Two-column CV layout with a dark sidebar, contact details, skills, profile, education, and experience sections.",
            image_url="https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?q=80&w=1200&auto=format&fit=crop",
            layout_key="modern_sidebar",
            primary_color="#111827",
            secondary_color="#2563eb",
            is_active=True,
        ),

        Template(
            title="Minimal Clean CV",
            category="Minimal",
            description="Simple and clean ATS-friendly CV layout focused on readability, spacing, and professional typography.",
            image_url="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
            layout_key="minimal_clean",
            primary_color="#0f172a",
            secondary_color="#64748b",
            is_active=True,
        ),

        Template(
            title="Corporate Blue CV",
            category="Business",
            description="Professional business CV template with blue accent colors, structured sections, and corporate style.",
            image_url="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
            layout_key="corporate_blue",
            primary_color="#1e3a8a",
            secondary_color="#2563eb",
            is_active=True,
        ),

        Template(
            title="Creative Designer CV",
            category="Creative",
            description="Creative CV layout for designers and freelancers with a modern visual style and colorful highlights.",
            image_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
            layout_key="creative_designer",
            primary_color="#581c87",
            secondary_color="#db2777",
            is_active=True,
        ),

        Template(
            title="Gold Executive CV",
            category="Executive",
            description="Elegant executive resume template with gold accent colors, premium typography, and professional layout.",
            image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
            layout_key="gold_executive",
            primary_color="#17313E",
            secondary_color="#C8A24D",
            is_active=True,
        ),

        Template(
            title="Green Professional CV",
            category="Professional",
            description="Modern green professional resume with clean sections, minimal styling, and elegant typography.",
            image_url="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
            layout_key="green_professional",
            primary_color="#ffffff",
            secondary_color="#4CAF50",
            is_active=True,
        ),

        Template(
            title="Yellow Creative Resume",
            category="Creative",
            description="Creative yellow and black resume template designed for graphic designers and creative professionals.",
            image_url="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
            layout_key="yellow_creative",
            primary_color="#1f2937",
            secondary_color="#FACC15",
            is_active=True,
        ),

        Template(
            title="Dark Portfolio CV",
            category="Portfolio",
            description="Dark modern portfolio-style CV template with bold sections, stylish highlights, and visual layout.",
            image_url="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
            layout_key="dark_portfolio",
            primary_color="#111827",
            secondary_color="#FBBF24",
            is_active=True,
        ),
    ]

    db.add_all(templates)

    db.commit()

    return {
        "message": "Templates seeded successfully"
    }