import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, CartItem, Order, OrderItem
from ..schemas import CartItemCreate, CartItemUpdate, CartItemResponse, CheckoutResponse
from ..utils.deps import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])


def _cart_to_response(item: CartItem) -> CartItemResponse:
    return CartItemResponse(
        id=str(item.id),
        user_id=str(item.user_id),
        product_id=item.product_id,
        product_name=item.product_name,
        spec=item.spec,
        price=float(item.price),
        quantity=item.quantity,
        image_url=item.image_url,
        selected=item.selected,
    )


@router.get("", response_model=list[CartItemResponse])
def list_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = (
        db.query(CartItem)
        .filter(CartItem.user_id == current_user.id)
        .all()
    )
    return [_cart_to_response(i) for i in items]


@router.post("/add", response_model=list[CartItemResponse])
def add_item(
    body: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id == body.product_id,
            CartItem.spec == body.spec,
        )
        .first()
    )
    if existing:
        existing.quantity += 1
        db.commit()
    else:
        item = CartItem(
            id=uuid.uuid4(),
            user_id=current_user.id,
            product_id=body.product_id,
            product_name=body.product_name,
            spec=body.spec,
            price=body.price,
            quantity=1,
            image_url=body.image_url,
            selected=True,
        )
        db.add(item)
        db.commit()

    items = (
        db.query(CartItem)
        .filter(CartItem.user_id == current_user.id)
        .all()
    )
    return [_cart_to_response(i) for i in items]


@router.put("/{item_id}", response_model=CartItemResponse)
def update_item(
    item_id: str,
    body: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="购物车项不存在")

    update_data = body.model_dump(exclude_unset=True, exclude_none=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return _cart_to_response(item)


@router.delete("/{item_id}", status_code=204)
def remove_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="购物车项不存在")

    db.delete(item)
    db.commit()


@router.post("/checkout", response_model=CheckoutResponse, status_code=201)
def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    selected = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == current_user.id,
            CartItem.selected == True,
        )
        .all()
    )
    if not selected:
        raise HTTPException(status_code=400, detail="没有已选的商品")

    total = sum(float(i.price) * i.quantity for i in selected)
    order = Order(
        id=uuid.uuid4(),
        user_id=current_user.id,
        order_no=datetime.utcnow().strftime("%Y%m%d%H%M%S%f")[:20],
        status="pending",
        total_amount=total,
    )
    db.add(order)
    db.flush()

    for cart_item in selected:
        order_item = OrderItem(
            id=uuid.uuid4(),
            order_id=order.id,
            product_id=cart_item.product_id,
            product_name=cart_item.product_name,
            product_image=cart_item.image_url,
            quantity=cart_item.quantity,
            price=cart_item.price,
        )
        db.add(order_item)
        db.delete(cart_item)

    db.commit()
    db.refresh(order)

    return CheckoutResponse(order_no=order.order_no, total_amount=float(order.total_amount))
