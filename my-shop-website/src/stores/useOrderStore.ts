import { create } from 'zustand'
import { apiGet, getToken } from '../api/client'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'received' | 'reviewed'

export interface OrderItem {
  id: string
  orderNo: string
  productName: string
  productImage: string
  quantity: number
  amount: number
  status: OrderStatus
}

interface BackendOrder {
  id: string
  order_no: string
  status: OrderStatus
  total_amount: number
  created_at: string
  order_items: Array<{
    id: string
    product_name: string
    product_image: string | null
    quantity: number
    price: number
  }>
}

interface OrderStore {
  orders: OrderItem[]
  loading: boolean

  loadOrders: () => Promise<void>
  ordersByStatus: (status: OrderStatus | 'all') => OrderItem[]
}

function mapOrder(b: BackendOrder): OrderItem[] {
  return b.order_items.map((oi) => ({
    id: b.id,
    orderNo: b.order_no,
    productName: oi.product_name,
    productImage: oi.product_image ?? '',
    quantity: oi.quantity,
    amount: oi.price * oi.quantity,
    status: b.status,
  }))
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,

  loadOrders: async () => {
    if (!getToken()) return
    set({ loading: true })
    try {
      const data = await apiGet<BackendOrder[]>('/orders')
      const orders = data.flatMap(mapOrder)
      set({ orders, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  ordersByStatus: (status) => {
    if (status === 'all') return get().orders
    return get().orders.filter((o) => o.status === status)
  },
}))
