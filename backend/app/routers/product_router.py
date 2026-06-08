from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Product
from ..schemas import ProductResponse, ProductListResponse

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(10, ge=1, le=50, description="每页数量"),
    db: Session = Depends(get_db),
):
    """分页查询商品列表。"""
    query = db.query(Product)
    total = query.count()
    products = query.offset((page - 1) * size).limit(size).all()

    return ProductListResponse(
        products=[
            ProductResponse(
                id=p.id,
                name=p.name,
                price=float(p.price),
                image_url=p.image_url,
                stock=p.stock,
                category=p.category,
            )
            for p in products
        ],
        total=total,
    )
