from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Notification
from app.schemas import NotificationCreateSchema
from app.schemas import NotificationResponseSchema

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)


@router.get("/", response_model=list[NotificationResponseSchema])
def get_notifications(
    db: Session = Depends(get_db)
):
    notifications = (
        db.query(Notification)
        .filter(Notification.is_active == True)
        .order_by(Notification.created_at.desc())
        .all()
    )

    return notifications


@router.post("/", response_model=NotificationResponseSchema)
def create_notification(
    notification: NotificationCreateSchema,
    db: Session = Depends(get_db)
):
    new_notification = Notification(
        title=notification.title,
        message=notification.message,
        type=notification.type
    )

    db.add(new_notification)

    db.commit()

    db.refresh(new_notification)

    return new_notification


@router.put("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db)
):
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = True

    db.commit()

    return {
        "message": "Notification marked as read"
    }


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db)
):
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_active = False

    db.commit()

    return {
        "message": "Notification deleted successfully"
    }