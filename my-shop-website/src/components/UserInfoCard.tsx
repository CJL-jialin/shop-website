import { useUserStore } from '../stores/useUserStore'

export default function UserInfoCard() {
  const user = useUserStore((s) => s.user)
  const orderCount = useUserStore((s) => s.orderCount)
  const favoriteCount = useUserStore((s) => s.favoriteCount)
  const couponCount = useUserStore((s) => s.couponCount)

  return (
    <div
      className="px-5 py-6 text-white"
      style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 50%, #ffaa7f 100%)',
      }}
    >
      {/* 头像 + 用户名 + 会员标签 */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center text-3xl">
          {user.avatar}
        </div>
        <div>
          <h2 className="text-lg font-bold">{user.name}</h2>
          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-white/20 text-xs">
            {user.memberLevel}
          </span>
        </div>
      </div>

      {/* 数字统计 */}
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
    </div>
  )
}
