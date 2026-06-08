"""Faker 假数据填充脚本。
首次运行自动建表，生成假用户、商品、购物车、订单数据并写入数据库。
用法：python -m app.seed
"""
import uuid
import random
from datetime import datetime, timedelta

from faker import Faker

from .database import SessionLocal, engine, Base
from .models import User, Session, Product, CartItem, Order, OrderItem

fake = Faker("zh_CN")

PRODUCT_NAMES = [
    "Apple iPhone 16 Pro Max",
    "Samsung Galaxy S25 Ultra",
    "Sony WH-1000XM6 降噪耳机",
    "MacBook Pro 16\" M4",
    "Nike Air Jordan 1 Retro",
    "戴森 V16 无绳吸尘器",
    "LEGO 科技系列 兰博基尼",
    "雅诗兰黛 小棕瓶精华",
    "华为 MatePad Pro 13.2",
    "AirPods Pro 第三代",
    "DJI Mini 5 Pro 无人机",
    "任天堂 Switch 2",
    "海蓝之谜 精粹水",
    "Patagonia 抓绒夹克",
    "Bose QuietComfort Ultra",
    "Timberland 经典黄靴",
    "小米 14 Ultra",
    "SHOKZ OpenRun Pro 2",
    "Lululemon Align 瑜伽裤",
    "iPad Pro M4 12.9\"",
    "GoPro Hero 13 Black",
    "雀巢胶囊咖啡机",
    "Tom Ford 乌木香水",
    "始祖鸟 Beta AR 夹克",
    "Sonos Era 300 音响",
    "北面 1996 羽绒服",
    "罗技 MX Master 4S",
    "佳能 EOS R6 Mark II",
    "Aesop 赋活芳香护手霜",
    "Herman Miller Aeron 椅",
    "Marshall Stanmore III",
    "Yeti Rambler 保温杯",
    "Patagonia 飞钓背包",
    "Loewe Puzzle 手袋",
    "格力 变频冷暖空调",
    "Bobbi Brown 卸妆油",
    "辉瑞 Centrum 维生素",
    "Aesop 天竺葵洁面露",
    "欧乐B iO 10 电动牙刷",
    "迪士尼 玲娜贝儿 玩偶",
    "飞利浦 Hue 智能灯泡",
    "Moleskine 经典笔记本",
    "Thule Subterra 双肩包",
    "Dyson Airwrap 多功能美发器",
    "Le Creuset 铸铁锅",
    "Coleman 露营帐篷",
    "Tumi Alpha 登机箱",
    "Oral-B 冲牙器",
    "Patagonia Black Hole 行李袋",
    "Apple Watch Ultra 3",
]
ORDER_STATUSES = ["pending", "paid", "shipped", "received", "reviewed"]


def create_products(db) -> list[Product]:
    products = []
    for i, name in enumerate(PRODUCT_NAMES):
        p = Product(
            id=f"p{i+1}",
            name=name,
            price=round(random.uniform(9.9, 9999), 2),
            image_url=f"https://picsum.photos/seed/product{i+1}/400/500",
            stock=random.randint(10, 99),
            category=None,
        )
        products.append(p)
    return products


def create_users(db) -> list[User]:
    users: list[User] = []
    used_usernames: set[str] = set()

    while len(users) < 10:
        username = fake.user_name()
        if username in used_usernames or len(username) < 6 or len(username) > 20:
            continue
        used_usernames.add(username)

        user = User(
            username=username,
            password_hash=fake.sha256(),
            salt=fake.md5()[:16],
            name=fake.name(),
            avatar=fake.image_url() if random.random() > 0.3 else None,
            member_level="普通会员",
            phone=fake.phone_number(),
        )
        users.append(user)

    return users


def create_sessions_for_user(db, user: User) -> list[Session]:
    count = random.randint(1, 2)
    sessions: list[Session] = []
    for _ in range(count):
        session = Session(
            user_id=user.id,
            token=str(uuid.uuid4()),
            expires_at=datetime.utcnow() + timedelta(days=7),
        )
        sessions.append(session)
    return sessions


def create_cart_items(db, users: list[User], products: list[Product]):
    all_items: list[CartItem] = []
    for user in users[:4]:  # 只为前 4 个用户生成购物车
        num = random.randint(2, 5)
        sampled = random.sample(products, num)
        for p in sampled:
            item = CartItem(
                id=uuid.uuid4(),
                user_id=user.id,
                product_id=p.id,
                product_name=p.name,
                spec=random.choice(["默认", "标配", "深空黑", "银色", "大码"]),
                price=p.price,
                quantity=random.randint(1, 3),
                image_url=p.image_url,
                selected=random.random() > 0.2,
            )
            all_items.append(item)
    return all_items


def create_orders(db, users: list[User], products: list[Product]):
    all_orders: list[Order] = []
    all_items: list[OrderItem] = []

    for user in users[:6]:  # 为前 6 个用户生成订单
        num = random.randint(1, 2)
        for _ in range(num):
            status = random.choice(ORDER_STATUSES)
            sampled = random.sample(products, random.randint(1, 3))
            total = sum(float(p.price) * random.randint(1, 2) for p in sampled)

            order = Order(
                id=uuid.uuid4(),
                user_id=user.id,
                order_no=datetime.utcnow().strftime("%Y%m%d%H%M%S%f")[:20]
                + str(random.randint(100, 999)),
                status=status,
                total_amount=total,
            )
            all_orders.append(order)
            db.add(order)
            db.flush()

            for p in sampled:
                oi = OrderItem(
                    id=uuid.uuid4(),
                    order_id=order.id,
                    product_id=p.id,
                    product_name=p.name,
                    product_image=p.image_url,
                    quantity=random.randint(1, 2),
                    price=p.price,
                )
                all_items.append(oi)

    return all_orders, all_items


def main():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. 商品
        products = create_products(db)
        db.add_all(products)
        print(f"[OK] Wrote {len(products)} products")

        # 2. 用户
        users = create_users(db)
        db.add_all(users)
        db.flush()
        print(f"[OK] Wrote {len(users)} users")

        # 3. 会话
        all_sessions: list[Session] = []
        for user in users:
            sessions = create_sessions_for_user(db, user)
            all_sessions.extend(sessions)
        db.add_all(all_sessions)
        print(f"[OK] Wrote {len(all_sessions)} sessions")

        # 4. 购物车
        cart_items = create_cart_items(db, users, products)
        db.add_all(cart_items)
        print(f"[OK] Wrote {len(cart_items)} cart items")

        # 5. 订单
        orders, order_items = create_orders(db, users, products)
        db.add_all(order_items)
        print(f"[OK] Wrote {len(orders)} orders with {len(order_items)} items")

        db.commit()
        print("[DONE] All seed data written")

    except Exception as e:
        db.rollback()
        print(f"[FAIL] {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
