from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import User, Order
from ..schemas import OrderResponse, OrderItemResponse
from ..utils.deps import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.get("", response_model=list[OrderResponse])
def list_orders(
    status: str | None = Query(None, description="按状态筛选"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Order)
        .options(joinedload(Order.order_items))
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
    )
    if status:
        query = query.filter(Order.status == status)

    orders = query.all()
    return [
        OrderResponse(
            id=str(o.id),
            user_id=str(o.user_id),
            order_no=o.order_no,
            status=o.status,
            total_amount=float(o.total_amount),
            created_at=o.created_at.isoformat() if o.created_at else "",
            order_items=[
                OrderItemResponse(
                    id=str(oi.id),
                    product_id=oi.product_id,
                    product_name=oi.product_name,
                    product_image=oi.product_image,
                    quantity=oi.quantity,
                    price=float(oi.price),
                )
                for oi in o.order_items
            ],
        )
        for o in orders
    ]
