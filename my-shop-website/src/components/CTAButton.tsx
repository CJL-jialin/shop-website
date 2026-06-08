export default function CTAButton() {
  return (
    <div
      className="fixed right-4 z-40 flex flex-col items-center"
      style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg transition-colors"
      >
        查看我的项目
      </a>
    </div>
  )
}
