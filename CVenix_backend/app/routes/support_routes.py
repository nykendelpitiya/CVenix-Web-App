from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Notification, SupportMessage, SupportReply, User
from app.schemas import (
    SupportMessageAdminResponseSchema,
    SupportMessageCreateSchema,
    SupportMessageResponseSchema,
    SupportReplyCreateSchema,
)
from app.auth import get_current_user

router = APIRouter(
    prefix="/api/support",
    tags=["Support"]
)


def require_admin(current_user: User):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )


@router.post("/send", response_model=SupportMessageResponseSchema)
def send_support_message(
    payload: SupportMessageCreateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    support_message = SupportMessage(
        user_id=current_user.id,
        subject=payload.subject,
        message=payload.message,
        status="open",
        is_read_by_admin=False,
    )

    db.add(support_message)
    db.commit()
    db.refresh(support_message)

    notification = Notification(
        title="New help request",
        message=f"{current_user.full_name} sent a new help message.",
        type="support",
        is_read=False,
        is_active=True,
    )

    db.add(notification)
    db.commit()

    return support_message


@router.get("/my-messages", response_model=list[SupportMessageResponseSchema])
def get_my_support_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    messages = (
        db.query(SupportMessage)
        .options(joinedload(SupportMessage.replies))
        .filter(SupportMessage.user_id == current_user.id)
        .order_by(SupportMessage.created_at.desc())
        .all()
    )

    return messages


@router.get(
    "/admin/messages",
    response_model=list[SupportMessageAdminResponseSchema]
)
def get_all_support_messages_for_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    messages = (
        db.query(SupportMessage)
        .options(
            joinedload(SupportMessage.user),
            joinedload(SupportMessage.replies),
        )
        .order_by(SupportMessage.created_at.desc())
        .all()
    )

    return messages


@router.post(
    "/admin/reply/{message_id}",
    response_model=SupportMessageAdminResponseSchema
)
def reply_to_support_message(
    message_id: int,
    payload: SupportReplyCreateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    support_message = (
        db.query(SupportMessage)
        .filter(SupportMessage.id == message_id)
        .first()
    )

    if not support_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support message not found."
        )

    reply = SupportReply(
        message_id=support_message.id,
        admin_id=current_user.id,
        reply=payload.reply,
        is_read_by_user=False,
    )

    support_message.status = "replied"
    support_message.is_read_by_admin = True

    db.add(reply)
    db.commit()

    notification = Notification(
        title="Admin replied to your help message",
        message=f"Reply received for: {support_message.subject}",
        type="support_reply",
        is_read=False,
        is_active=True,
    )

    db.add(notification)
    db.commit()

    updated_message = (
        db.query(SupportMessage)
        .options(
            joinedload(SupportMessage.user),
            joinedload(SupportMessage.replies),
        )
        .filter(SupportMessage.id == message_id)
        .first()
    )

    return updated_message


@router.put("/mark-replies-read")
def mark_my_replies_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    messages = (
        db.query(SupportMessage)
        .filter(SupportMessage.user_id == current_user.id)
        .all()
    )

    message_ids = [message.id for message in messages]

    if not message_ids:
        return {
            "message": "No support messages found."
        }

    db.query(SupportReply).filter(
        SupportReply.message_id.in_(message_ids)
    ).update(
        {
            SupportReply.is_read_by_user: True
        },
        synchronize_session=False
    )

    db.commit()

    return {
        "message": "Replies marked as read."
    }


@router.delete("/admin/delete/{message_id}")
def delete_support_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    support_message = (
        db.query(SupportMessage)
        .filter(SupportMessage.id == message_id)
        .first()
    )

    if not support_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support message not found."
        )

    db.delete(support_message)
    db.commit()

    return {
        "message": "Support message deleted successfully."
    }