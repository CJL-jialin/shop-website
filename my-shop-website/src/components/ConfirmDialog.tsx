import { createPortal } from 'react-dom'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = '确认删除',
  cancelLabel = '取消',
  onConfirm,
  onCancel,
}: Props) {
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* 弹窗内容 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[300px] max-w-[90vw] overflow-hidden">
        <div className="p-6 text-center">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>

        <div className="flex border-t border-[var(--color-border)]">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-l border-[var(--color-border)] transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
