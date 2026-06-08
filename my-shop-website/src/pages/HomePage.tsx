import SearchBar from '../components/SearchBar'
import BannerCarousel from '../components/BannerCarousel'
import CategoryGrid from '../components/CategoryGrid'
import ProductWaterfall from '../components/ProductWaterfall'
import TabBar from '../components/TabBar'
import CTAButton from '../components/CTAButton'
import { banners } from '../mock/banners'
import { categories } from '../mock/categories'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* 1. 搜索栏 — 固顶 */}
      <SearchBar />

      {/* 2. Banner 轮播 */}
      <BannerCarousel banners={banners} />

      {/* 3. 分类图标网格 */}
      <CategoryGrid categories={categories} />

      {/* 4. 双列瀑布流 */}
      <ProductWaterfall />

      {/* 5. CTA 按钮 — 固定悬浮 */}
      <CTAButton />

      {/* 6. 底部 TabBar — 固定 */}
      <TabBar />
    </div>
  )
}
