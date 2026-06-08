import { useState } from 'react'
import { useUserStore } from '../stores/useUserStore'
import Toast from '../components/Toast'
import TabBar from '../components/TabBar'

export default function ShippingAddressPage() {
  const addresses = useUserStore((s) => s.addresses)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] pb-24">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-[1126px] mx-auto">
          <a href="#/profile" className="text-sm text-[var(--color-text-secondary)]">
            ‹ 返回
          </a>
          <h1 className="flex-1 text-base font-bold text-center">收货地址</h1>
          <span className="w-10" />
        </div>
      </header>

      {/* 地址列表 */}
      <div className="px-3 pt-3 pb-20">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-secondary)]">
            <span className="text-5xl mb-3">📍</span>
            <p className="text-sm">暂无收货地址</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-[1126px] mx-auto">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-[var(--color-bg-card)] rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-[var(--color-text-primary)]">
                    {addr.name}
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {addr.phone}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-primary)] mb-2">
                  {addr.address}
                </p>
                {addr.isDefault && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                    默认
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部新增按钮 — fixed */}
      <div
        className="fixed bottom-12 left-0 right-0 z-40 px-4"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <button
          onClick={() => setToastMsg('功能开发中')}
          className="w-full py-3 rounded-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold transition-colors shadow-lg"
        >
          新增地址
        </button>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      <TabBar />
    </div>
  )
}
