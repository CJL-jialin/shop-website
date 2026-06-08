export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      {/* 插画 */}
      <span className="text-6xl mb-5">🛒</span>
      {/* 文案 */}
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        购物车是空的，去逛逛吧~
      </p>
      {/* 引导按钮 */}
      <a
        href="#/"
        className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-8 py-2.5 rounded-full transition-colors"
      >
        去逛逛
      </a>
    </div>
  )
}
