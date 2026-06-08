import { useState, useEffect } from 'react'
import Toast from '../components/Toast'
import TabBar from '../components/TabBar'

const settingsItems = [
  { key: 'nickname', label: '修改昵称' },
  { key: 'phone', label: '修改手机号' },
  { key: 'about', label: '关于我们' },
]

export default function SettingsPage() {
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  // 退出登录后跳转
  useEffect(() => {
    if (loggingOut) {
      const timer = setTimeout(() => {
        window.location.hash = '#/'
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [loggingOut])

  function handleLogout() {
    setLoggingOut(true)
    setToastMsg('已退出')
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] pb-24">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-[1126px] mx-auto">
          <a href="#/profile" className="text-sm text-[var(--color-text-secondary)]">
            ‹ 返回
          </a>
          <h1 className="flex-1 text-base font-bold text-center">设置</h1>
          <span className="w-10" />
        </div>
      </header>

      {/* 设置列表 */}
      <div className="mx-4 mt-4 rounded-xl overflow-hidden bg-[var(--color-bg-card)]">
        {settingsItems.map((item, i) => (
          <button
            key={item.key}
            onClick={() => setToastMsg('功能开发中')}
            className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              i < settingsItems.length
                ? 'border-b border-[var(--color-border)]'
                : ''
            }`}
          >
            <span className="text-sm text-[var(--color-text-primary)]">{item.label}</span>
            <span className="text-lg text-gray-300 dark:text-gray-500">›</span>
          </button>
        ))}

        {/* 退出登录 — 最后一项，无底部分隔线 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm text-red-500 font-medium">退出登录</span>
          <span className="text-lg text-red-400">›</span>
        </button>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      <TabBar />
    </div>
  )
}
