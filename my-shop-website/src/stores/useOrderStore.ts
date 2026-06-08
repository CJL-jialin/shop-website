import { create } from 'zustand'
import { mockOrders } from '../mock/orders'
import type { OrderItem, OrderStatus } from '../mock/orders'

interface OrderStore {
  orders: OrderItem[]
  ordersByStatus: (status: OrderStatus | 'all') => OrderItem[]
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: mockOrders,

  ordersByStatus: (status) => {
    if (status === 'all') return get().orders
    return get().orders.filter((o) => o.status === status)
  },
}))
