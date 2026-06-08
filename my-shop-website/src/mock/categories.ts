export interface Category {
  id: string
  name: string
  icon: string
  link: string
}

export const categories: Category[] = [
  { id: 'c1', name: '数码', icon: '💻', link: '#/category/digital' },
  { id: 'c2', name: '服饰', icon: '👗', link: '#/category/clothing' },
  { id: 'c3', name: '食品', icon: '🍔', link: '#/category/food' },
  { id: 'c4', name: '美妆', icon: '💄', link: '#/category/beauty' },
  { id: 'c5', name: '家居', icon: '🏠', link: '#/category/home' },
  { id: 'c6', name: '运动', icon: '⚽', link: '#/category/sports' },
  { id: 'c7', name: '图书', icon: '📚', link: '#/category/books' },
  { id: 'c8', name: '玩具', icon: '🧸', link: '#/category/toys' },
  { id: 'c9', name: '珠宝', icon: '💎', link: '#/category/jewelry' },
  { id: 'c10', name: '汽车', icon: '🚗', link: '#/category/auto' },
]
