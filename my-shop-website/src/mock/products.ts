export interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
}

const productNames = [
  'Apple iPhone 16 Pro Max',
  'Samsung Galaxy S25 Ultra',
  'Sony WH-1000XM6 降噪耳机',
  'MacBook Pro 16" M4',
  'Nike Air Jordan 1 Retro',
  '戴森 V16 无绳吸尘器',
  'LEGO 科技系列 兰博基尼',
  '雅诗兰黛 小棕瓶精华',
  '华为 MatePad Pro 13.2',
  'AirPods Pro 第三代',
  'DJI Mini 5 Pro 无人机',
  '任天堂 Switch 2',
  '海蓝之谜 精粹水',
  'Patagonia 抓绒夹克',
  'Bose QuietComfort Ultra',
  'Patagonia Better Sweater',
  'Timberland 经典黄靴',
  '小米 14 Ultra',
  'SHOKZ OpenRun Pro 2',
  'Lululemon Align 瑜伽裤',
  'iPad Pro M4 12.9"',
  'GoPro Hero 13 Black',
  '雀巢胶囊咖啡机',
  'Tom Ford 乌木香水',
  '始祖鸟 Beta AR 夹克',
  'Sonos Era 300 音响',
  '北面 1996 羽绒服',
  '罗技 MX Master 4S',
  '佳能 EOS R6 Mark II',
  'Aesop 赋活芳香护手霜',
  'Herman Miller Aeron 椅',
  'Marshall Stanmore III',
  'Yeti Rambler 保温杯',
  'Patagonia 飞钓背包',
  'Loewe  Puzzle 手袋',
  '格力 变频冷暖空调',
  'Bobbi Brown 卸妆油',
  '辉瑞 Centrum 维生素',
  'Aēsop 天竺葵洁面露',
  '欧乐B iO 10 电动牙刷',
  '迪士尼 玲娜贝儿 玩偶',
  '飞利浦 Hue 智能灯泡',
  'Moleskine 经典笔记本',
  'Thule Subterra 双肩包',
  'Dyson Airwrap 多功能美发器',
  'Le Creuset 铸铁锅',
  'Coleman 露营帐篷',
  'Tumi Alpha 登机箱',
  'Oral-B 冲牙器',
  'Patagonia Black Hole 行李袋',
]

export function generateProducts(page: number, pageSize: number = 10): Product[] {
  const start = (page - 1) * pageSize
  return productNames.slice(start, start + pageSize).map((name, i) => ({
    id: `p${start + i + 1}`,
    name,
    price: +(Math.random() * 999 + 9.9).toFixed(2),
    imageUrl: `https://picsum.photos/seed/product${start + i + 1}/400/500`,
  }))
}

export const TOTAL_PAGES = Math.ceil(productNames.length / 10)
