export interface AddressItem {
  id: string
  name: string
  phone: string
  address: string
  isDefault: boolean
}

export const mockUser = {
  name: '张三',
  avatar: '👤',
  memberLevel: '普通会员',
}

export const mockAddresses: AddressItem[] = [
  {
    id: 'a1',
    name: '张三',
    phone: '139****1234',
    address: '北京市朝阳区建国路88号 SOHO现代城A座 1205室',
    isDefault: true,
  },
  {
    id: 'a2',
    name: '张三',
    phone: '138****5678',
    address: '上海市浦东新区陆家嘴环路1000号 环球金融中心 35层',
    isDefault: false,
  },
  {
    id: 'a3',
    name: '李四',
    phone: '137****9012',
    address: '广东省深圳市南山区科技园南路 腾讯滨海大厦',
    isDefault: false,
  },
]
