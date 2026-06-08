import type { Category } from '../mock/categories'

interface Props {
  categories: Category[]
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className="px-4 py-5">
      <div className="grid grid-cols-5 gap-y-5 gap-x-2 max-w-[1126px] mx-auto">
        {categories.slice(0, 10).map((c) => (
          <a
            key={c.id}
            href={c.link}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-2xl">
              {c.icon}
            </div>
            <span className="text-xs text-[var(--color-text-primary)] text-center truncate w-full">
              {c.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
