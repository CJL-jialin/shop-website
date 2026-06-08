import { create } from 'zustand'
import { mockCartItems } from '../mock/cart'

export interface CartItem {
  itemId: string
  productId: string
  name: string
  spec: string
  price: number
  quantity: number
  stock: number
  imageUrl: string
  selected: boolean
}

interface CartStore {
  items: CartItem[]

  // 计算属性
  allCount: number
  selectedItems: CartItem[]
  selectedCount: number
  selectedTotal: number
  isAllSelected: boolean

  // 结算结果（用于 Toast 触发）
  checkoutMessage: string | null

  // Actions
  addItem: (product: Omit<CartItem, 'itemId' | 'quantity' | 'selected'>, spec?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, qty: number) => void
  toggleSelect: (itemId: string) => void
  toggleSelectAll: () => void
  checkout: () => void
  clearCheckoutMessage: () => void
}

function derive(items: CartItem[]) {
  const allCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const selectedItems = items.filter((i) => i.selected)
  const selectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0)
  const selectedTotal = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  )
  const isAllSelected = items.length > 0 && items.every((i) => i.selected)
  return { allCount, selectedItems, selectedCount, selectedTotal, isAllSelected }
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: mockCartItems,
  ...derive(mockCartItems),
  checkoutMessage: null,

  addItem: (product, spec = '默认') => {
    set((state) => {
      const itemId = `${product.productId}_${spec}`
      const existing = state.items.find((i) => i.itemId === itemId)
      let newItems: CartItem[]

      if (existing) {
        const newQty = Math.min(existing.quantity + 1, existing.stock)
        newItems = state.items.map((i) =>
          i.itemId === itemId ? { ...i, quantity: newQty } : i
        )
      } else {
        newItems = [
          ...state.items,
          {
            ...product,
            itemId,
            spec,
            quantity: 1,
            selected: true,
          },
        ]
      }

      return { items: newItems, ...derive(newItems) }
    })
  },

  removeItem: (itemId) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.itemId !== itemId)
      return { items: newItems, ...derive(newItems) }
    })
  },

  updateQuantity: (itemId, qty) => {
    set((state) => {
      const newItems = state.items.map((i) => {
        if (i.itemId !== itemId) return i
        const clamped = Math.max(1, Math.min(qty, i.stock))
        return { ...i, quantity: clamped }
      })
      return { items: newItems, ...derive(newItems) }
    })
  },

  toggleSelect: (itemId) => {
    set((state) => {
      const newItems = state.items.map((i) =>
        i.itemId === itemId ? { ...i, selected: !i.selected } : i
      )
      return { items: newItems, ...derive(newItems) }
    })
  },

  toggleSelectAll: () => {
    set((state) => {
      const { isAllSelected } = derive(state.items)
      const newItems = state.items.map((i) => ({
        ...i,
        selected: !isAllSelected,
      }))
      return { items: newItems, ...derive(newItems) }
    })
  },

  checkout: () => {
    set((state) => {
      const { selectedCount } = derive(state.items)
      if (selectedCount === 0) return state
      const newItems = state.items.filter((i) => !i.selected)
      return {
        items: newItems,
        ...derive(newItems),
        checkoutMessage: '下单成功！',
      }
    })
  },

  clearCheckoutMessage: () => set({ checkoutMessage: null }),
}))
