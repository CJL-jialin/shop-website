import { create } from 'zustand'
import { apiGet, apiPost, apiPut, apiDel, getToken } from '../api/client'

export interface UserInfo {
  id: string
  username: string
  name: string
  avatar: string | null
  member_level: string
  phone: string | null
}

export interface AddressItem {
  id: string
  name: string
  phone: string
  address: string
  is_default: boolean
}

interface BackendAddress {
  id: string
  name: string
  phone: string
  address: string
  is_default: boolean
}

interface UserStore {
  user: UserInfo | null
  addresses: AddressItem[]
  orderCount: number
  favoriteCount: number
  couponCount: number
  loading: boolean

  fetchProfile: () => Promise<void>
  fetchAddresses: () => Promise<void>
  addAddress: (data: { name: string; phone: string; address: string; is_default?: boolean }) => Promise<void>
  updateAddress: (id: string, data: { name?: string; phone?: string; address?: string; is_default?: boolean }) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  addresses: [],
  orderCount: 0,
  favoriteCount: 0,
  couponCount: 0,
  loading: false,

  fetchProfile: async () => {
    if (!getToken()) return
    set({ loading: true })
    try {
      const user = await apiGet<UserInfo>('/user/profile')
      set({ user, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchAddresses: async () => {
    if (!getToken()) return
    const data = await apiGet<BackendAddress[]>('/user/addresses')
    const addresses: AddressItem[] = data.map((a) => ({
      id: a.id,
      name: a.name,
      phone: a.phone,
      address: a.address,
      is_default: a.is_default,
    }))
    set({ addresses })
  },

  addAddress: async (data) => {
    await apiPost('/user/addresses', data)
    await get().fetchAddresses()
  },

  updateAddress: async (id, data) => {
    await apiPut(`/user/addresses/${id}`, data)
    await get().fetchAddresses()
  },

  deleteAddress: async (id) => {
    await apiDel(`/user/addresses/${id}`)
    set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) }))
  },
}))
