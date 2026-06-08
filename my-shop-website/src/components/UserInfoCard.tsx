import { useEffect, useState } from 'react'
import { useUserStore } from '../stores/useUserStore'
import { useAuthStore } from '../stores/useAuthStore'
import { getToken } from '../api/client'

export default function UserInfoCard() {
  const user = useUserStore((s) => s.user)
  const fetchProfile = useUserStore((s) => s.fetchProfile)
  const fetchAddresses = useUserStore((s) => s.fetchAddresses)
  const orderCount = useUserStore((s) => s.orderCount)
  const favoriteCount = useUserStore((s) => s.favoriteCount)
  const couponCount = useUserStore((s) => s.couponCount)
  const { login, register, logout } = useAuthStore()
  const clearUser = useUserStore((s) => s.clearUser)

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getToken()) {
      fetchProfile()
      fetchAddresses()
    }
  }, [])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(username, password)
      } else {
        await register(username, password, name)
      }
      await fetchProfile()
      await fetchAddresses()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // 已登录状态
  if (user) {
    return (
      <div
        className="px-5 py-6 text-white"
        style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 50%, #ffaa7f 100%)' }}
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center text-3xl">
            {user.avatar || '👤'}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user.name}</h2>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-white/20 text-xs">
              {user.member_level}
            </span>
          </div>
        </div>
        <div className="flex justify-around">
          {[
            { label: '订单', count: orderCount },
            { label: '收藏', count: favoriteCount },
            { label: '优惠券', count: couponCount },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-xl font-bold">{stat.count}</span>
              <span className="text-xs text-white/70 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={async () => {
            await logout()
            clearUser()
            window.location.hash = '#/'
          }}
          className="mt-4 w-full py-2 rounded-lg bg-white/15 text-white/80 text-sm hover:bg-white/25 transition-colors"
        >
          退出登录
        </button>
      </div>
    )
  }

  // 未登录 — 登录/注册表单
  return (
    <div
      className="px-5 py-6 text-white"
      style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 50%, #ffaa7f 100%)' }}
    >
      <h2 className="text-lg font-bold mb-4 text-center">
        {mode === 'login' ? '登录' : '注册'}
      </h2>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/30 text-sm text-center">{error}</div>
      )}

      <div className="flex flex-col gap-2.5">
        <input
          className="w-full px-3 py-2.5 rounded-lg bg-white/20 placeholder-white/60 text-white text-sm outline-none border border-white/30 focus:border-white"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full px-3 py-2.5 rounded-lg bg-white/20 placeholder-white/60 text-white text-sm outline-none border border-white/30 focus:border-white"
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === 'register' && (
          <input
            className="w-full px-3 py-2.5 rounded-lg bg-white/20 placeholder-white/60 text-white text-sm outline-none border border-white/30 focus:border-white"
            placeholder="昵称"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-white text-[#ff6b35] font-bold text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {loading ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
        </button>
      </div>

      <p className="text-center text-xs text-white/70 mt-3">
        {mode === 'login' ? '还没有账号？' : '已有账号？'}
        <button
          className="ml-1 underline font-medium text-white"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
        >
          {mode === 'login' ? '去注册' : '去登录'}
        </button>
      </p>
    </div>
  )
}
