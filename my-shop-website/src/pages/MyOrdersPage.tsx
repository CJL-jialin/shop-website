import { useState, useMemo, useEffect } from 'react'
import { useOrderStore, type OrderStatus } from '../stores/useOrderStore'
import TabBar from '../components/TabBar'

const STATUS_TABS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'paid', label: '待发货' },
  { key: 'shipped', label: '待收货' },
  { key: 'received', label: '待评价' },
]

const STATUS_TEXT: Record<OrderStatus, string> = {
  pending: '待付款',
  paid: '待发货',
  shipped: '待收货',
  received: '待评价',
  reviewed: '已完成',
}

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all')
  const loadOrders = useOrderStore((s) => s.loadOrders)
  const ordersByStatus = useOrderStore((s) => s.ordersByStatus)

  useEffect(() => { loadOrders() }, [])
  const visibleOrders = useMemo(
    () => ordersByStatus(activeTab),
    [activeTab, ordersByStatus]
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] pb-24">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-[1126px] mx-auto">
          <a href="#/profile" className="text-sm text-[var(--color-text-secondary)]">
            ‹ 返回
          </a>
          <h1 className="flex-1 text-base font-bold text-center">我的订单</h1>
          <span className="w-10" />
        </div>
      </header>

      {/* 状态 Tabs */}
      <div className="sticky top-[49px] z-40 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)]">
        <div className="flex overflow-x-auto max-w-[1126px] mx-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'text-[var(--color-brand)] border-[var(--color-brand)]'
                  : 'text-[var(--color-text-secondary)] border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 订单列表 */}
      <div className="px-3 pt-3">
        {visibleOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-secondary)]">
            <span className="text-5xl mb-3">📭</span>
            <p className="text-sm">暂无订单</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-[1126px] mx-auto">
            {visibleOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[var(--color-bg-card)] rounded-xl p-3 shadow-sm"
              >
                {/* 订单编号 + 状态 */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {order.orderNo}
                  </span>
                  <span className="text-xs font-medium text-[var(--color-brand)]">
                    {STATUS_TEXT[order.status]}
                  </span>
                </div>

                {/* 商品信息 */}
                <div className="flex items-center gap-3">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="flex-shrink-0 w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-700"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-[var(--color-text-primary)] leading-tight truncate">
                      {order.productName}
                    </h4>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      ×{order.quantity}
                    </span>
                  </div>
                  <span className="flex-shrink-0 text-sm font-bold text-[var(--color-brand)]">
                    ¥{order.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  )
}
