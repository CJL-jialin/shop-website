import { create } from 'zustand'
import { mockUser, mockAddresses } from '../mock/user'
import type { AddressItem } from '../mock/user'

interface UserInfo {
  name: string
  avatar: string
  memberLevel: string
}

interface UserStore {
  user: UserInfo
  addresses: AddressItem[]
  orderCount: number
  favoriteCount: number
  couponCount: number
}

export const useUserStore = create<UserStore>(() => ({
  user: mockUser,
  addresses: mockAddresses,
  orderCount: 5,
  favoriteCount: 12,
  couponCount: 3,
}))
