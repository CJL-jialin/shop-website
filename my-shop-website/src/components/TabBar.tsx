import { useState, useEffect } from 'react'
import { useCartStore } from '../stores/useCartStore'

export default function TabBar() {
  const totalCount = useCartStore((s) => s.allCount)
  const [activeKey, setActiveKey] = useState('home')

  useEffect(() => {
    function updateActive() {
      const hash = window.location.hash
      if (hash === '#/' || hash === '' || hash.startsWith('#/product/')) {
        setActiveKey('home')
      } else if (hash.startsWith('#/cart')) {
        setActiveKey('cart')
      } else if (hash.startsWith('#/profile')) {
        setActiveKey('profile')
      }
    }
    updateActive()
    window.addEventListener('hashchange', updateActive)
    return () => window.removeEventListener('hashchange', updateActive)
  }, [])

  function badgeText() {
    if (totalCount === 0) return null
    if (totalCount > 99) return '99+'
    return String(totalCount)
  }

  const tabs = [
    { key: 'home', label: '首页', icon: '🏠', href: '#/' },
    { key: 'cart', label: '购物车', icon: '🛒', href: '#/cart', badge: true },
    { key: 'profile', label: '我的', icon: '👤', href: '#/profile' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] flex justify-around items-center"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {tabs.map((tab) => (
        <a
          key={tab.key}
          href={tab.href}
          className={`flex flex-col items-center py-1.5 gap-0.5 min-w-0 flex-1 ${
            tab.key === activeKey
              ? 'text-[var(--color-brand)]'
              : 'text-[var(--color-text-secondary)]'
          }`}
        >
          <span className="relative text-xl">
            {tab.icon}
            {tab.badge && badgeText() && (
              <span className="absolute -top-1 -right-3 min-w-[16px] h-[16px] rounded-full bg-[var(--color-brand)] text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                {badgeText()}
              </span>
            )}
          </span>
          <span className="text-[10px]">{tab.label}</span>
        </a>
      ))}
    </nav>
  )
}
