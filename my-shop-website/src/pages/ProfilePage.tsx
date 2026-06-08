import UserInfoCard from '../components/UserInfoCard'
import TabBar from '../components/TabBar'

const menuItems = [
  { key: 'orders', label: '我的订单', icon: '📋', href: '#/profile/orders' },
  { key: 'addresses', label: '收货地址', icon: '📍', href: '#/profile/addresses' },
  { key: 'settings', label: '设置', icon: '⚙️', href: '#/profile/settings' },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] pb-24">
      {/* 用户信息卡 — 自带橙色渐变背景 */}
      <UserInfoCard />

      {/* 功能列表 — 白底 */}
      <div className="mx-4 mt-4 rounded-xl overflow-hidden bg-[var(--color-bg-card)]">
        {menuItems.map((item, i) => (
          <a
            key={item.key}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              i < menuItems.length - 1
                ? 'border-b border-[var(--color-border)]'
                : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="flex-1 text-sm text-[var(--color-text-primary)]">{item.label}</span>
            <span className="text-lg text-gray-300 dark:text-gray-500">›</span>
          </a>
        ))}
      </div>

      {/* TabBar */}
      <TabBar />
    </div>
  )
}
