import { create } from 'zustand'
import {
  apiPost,
  apiGet,
  setToken,
  getToken,
  clearToken,
} from '../api/client'

export interface UserInfo {
  id: string
  username: string
  name: string
  avatar: string | null
  member_level: string
  phone: string | null
  created_at: string
}

interface AuthStore {
  token: string | null
  user: UserInfo | null
  isLoggedIn: boolean

  register: (
    username: string,
    password: string,
    name: string,
    phone?: string,
  ) => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: getToken(),
  user: null,
  isLoggedIn: getToken() !== null,

  register: async (username, password, name, phone?) => {
    const res = await apiPost<{ token: string; user: UserInfo }>(
      '/auth/register',
      { username, password, name, phone },
    )
    setToken(res.token)
    set({ token: res.token, user: res.user, isLoggedIn: true })
  },

  login: async (username, password) => {
    const res = await apiPost<{ token: string; user: UserInfo }>(
      '/auth/login',
      { username, password },
    )
    setToken(res.token)
    set({ token: res.token, user: res.user, isLoggedIn: true })
  },

  logout: async () => {
    try {
      await apiPost('/auth/logout')
    } catch {
      // 即使服务端失败也清除本地状态
    }
    clearToken()
    set({ token: null, user: null, isLoggedIn: false })
  },

  fetchProfile: async () => {
    const user = await apiGet<UserInfo>('/user/profile')
    set({ user })
  },
}))
