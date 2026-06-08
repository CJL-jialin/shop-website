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

export const mockOrders: OrderItem[] = [
  {
    id: 'o1',
    orderNo: '20260607205801001',
    productName: 'Apple iPhone 16 Pro Max',
    productImage: 'https://picsum.photos/seed/product1/400/500',
    quantity: 1,
    amount: 8999,
    status: 'pending',
  },
  {
    id: 'o2',
    orderNo: '20260606145832002',
    productName: 'Nike Air Jordan 1 Retro',
    productImage: 'https://picsum.photos/seed/product5/400/500',
    quantity: 2,
    amount: 2598,
    status: 'paid',
  },
  {
    id: 'o3',
    orderNo: '20260603103215003',
    productName: '戴森 V16 无绳吸尘器',
    productImage: 'https://picsum.photos/seed/product6/400/500',
    quantity: 1,
    amount: 3999,
    status: 'shipped',
  },
  {
    id: 'o4',
    orderNo: '20260528181259004',
    productName: 'MacBook Pro 16" M4',
    productImage: 'https://picsum.photos/seed/product4/400/500',
    quantity: 1,
    amount: 19999,
    status: 'received',
  },
  {
    id: 'o5',
    orderNo: '20260520110523005',
    productName: 'Samsung Galaxy S25 Ultra',
    productImage: 'https://picsum.photos/seed/product2/400/500',
    quantity: 1,
    amount: 5999,
    status: 'reviewed',
  },
]
