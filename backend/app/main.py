from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.db_router import router as db_router
from .routers.user_router import router as user_router
from .routers.redis_router import router as redis_router
from .routers.product_router import router as product_router
from .routers.cart_router import router as cart_router
from .routers.order_router import router as order_router

app = FastAPI(title="电商下单系统 API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(db_router)
app.include_router(user_router)
app.include_router(redis_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(order_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
