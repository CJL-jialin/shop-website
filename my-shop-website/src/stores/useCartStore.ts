import { create } from 'zustand'
import { apiGet, apiPost, apiPut, apiDel } from '../api/client'
import { getToken } from '../api/client'

// ── 后端 CartItemResponse → 前端 CartItem（camelCase 映射）──
interface BackendCartItem {
  id: string
  product_id: string
  product_name: string
  spec: string
  price: number
  quantity: number
  image_url: string | null
  selected: boolean
}

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
  loading: boolean

  // 计算属性
  allCount: number
  selectedItems: CartItem[]
  selectedCount: number
  selectedTotal: number
  isAllSelected: boolean

  checkoutMessage: string | null

  // Actions
  loadCart: () => Promise<void>
  addItem: (product: { productId: string; name: string; spec?: string; price: number; imageUrl?: string }) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, qty: number) => Promise<void>
  toggleSelect: (itemId: string) => Promise<void>
  toggleSelectAll: () => Promise<void>
  checkout: () => Promise<void>
  clearCheckoutMessage: () => void
}

function mapItem(b: BackendCartItem): CartItem {
  return {
    itemId: b.id,
    productId: b.product_id,
    name: b.product_name,
    spec: b.spec,
    price: b.price,
    quantity: b.quantity,
    stock: 99, // 后端暂不在购物车中返回库存
    imageUrl: b.image_url ?? '',
    selected: b.selected,
  }
}

function derive(items: CartItem[]) {
  const allCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const selectedItems = items.filter((i) => i.selected)
  const selectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0)
  const selectedTotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const isAllSelected = items.length > 0 && items.every((i) => i.selected)
  return { allCount, selectedItems, selectedCount, selectedTotal, isAllSelected }
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loading: false,
  ...derive([]),
  checkoutMessage: null,

  loadCart: async () => {
    if (!getToken()) return
    set({ loading: true })
    try {
      const data = await apiGet<BackendCartItem[]>('/cart')
      const items = data.map(mapItem)
      set({ items, ...derive(items), loading: false })
    } catch {
      set({ loading: false })
    }
  },

  addItem: async (product, spec = '默认') => {
    await apiPost('/cart/add', {
      product_id: product.productId,
      product_name: product.name,
      spec,
      price: product.price,
      image_url: product.imageUrl ?? '',
    })
    await get().loadCart() // 重新拉取
  },

  removeItem: async (itemId) => {
    await apiDel(`/cart/${itemId}`)
    set((state) => {
      const newItems = state.items.filter((i) => i.itemId !== itemId)
      return { items: newItems, ...derive(newItems) }
    })
  },

  updateQuantity: async (itemId, qty) => {
    await apiPut(`/cart/${itemId}`, { quantity: Math.max(1, qty) })
    await get().loadCart()
  },

  toggleSelect: async (itemId) => {
    const item = get().items.find((i) => i.itemId === itemId)
    if (!item) return
    await apiPut(`/cart/${itemId}`, { selected: !item.selected })
    await get().loadCart()
  },

  toggleSelectAll: async () => {
    const { isAllSelected, items } = get()
    const newVal = !isAllSelected
    // 逐个更新
    await Promise.all(items.map((i) => apiPut(`/cart/${i.itemId}`, { selected: newVal })))
    await get().loadCart()
  },

  checkout: async () => {
    if (get().selectedCount === 0) return
    await apiPost('/cart/checkout')
    // 清空已选
    set((state) => {
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
