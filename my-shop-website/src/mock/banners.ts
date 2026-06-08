export interface Banner {
  id: string
  imageUrl: string
  link: string
}

export const banners: Banner[] = [
  {
    id: 'b1',
    imageUrl: 'https://picsum.photos/seed/banner1/800/400',
    link: '#/promotion/summer-sale',
  },
  {
    id: 'b2',
    imageUrl: 'https://picsum.photos/seed/banner2/800/400',
    link: '#/promotion/new-arrival',
  },
  {
    id: 'b3',
    imageUrl: 'https://picsum.photos/seed/banner3/800/400',
    link: '#/promotion/flash-deal',
  },
]
