import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

interface CategorySidebarProps {
  currentTitle: string
  subCategories: any[]
  slug: string[]
  noSubText: string
  parentText: string
}

export const CategorySidebar = ({
  currentTitle,
  subCategories,
  slug,
  noSubText,
  parentText,
}: CategorySidebarProps) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-32 space-y-10">
        <div>
          <h2 className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase mb-6 tracking-[0.3em] flex items-center gap-3">
            <div className="w-6 h-[2px] bg-purple-600" />
            {currentTitle}
          </h2>

          <ul className="space-y-2">
            {subCategories.map((sub) => (
              <li key={sub.id}>
                <Link
                  href={`/${slug.join('/')}/${sub.slug}`}
                  className="flex justify-between items-center py-3.5 px-5 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/5 group transition-all"
                >
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-purple-600 uppercase tracking-tight">
                    {sub.title}
                  </span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-purple-600"
                  />
                </Link>
              </li>
            ))}
            {subCategories.length === 0 && (
              <li className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-5 py-2 italic opacity-50">
                {noSubText}
              </li>
            )}
          </ul>
        </div>

        {slug.length > 1 && (
          <Link
            href={`/${slug.slice(0, -1).join('/')}`}
            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-purple-600 uppercase tracking-widest transition-all"
          >
            <span className="text-lg">←</span> {parentText}
          </Link>
        )}
      </div>
    </aside>
  )
}
