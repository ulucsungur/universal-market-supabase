import React from 'react'
import { Link } from '@/i18n/routing'
import { ChevronRight } from 'lucide-react'

export const CategoryBreadcrumb = ({ slug, homeText }: { slug: string[]; homeText: string }) => {
  return (
    <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-12 bg-slate-50 dark:bg-white/5 w-fit px-6 py-3 rounded-full border border-slate-200 dark:border-white/5">
      <Link href="/" className="hover:text-purple-600 transition-colors">
        {homeText}
      </Link>
      {slug.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="opacity-30" />
          <Link
            href={`/${slug.slice(0, index + 1).join('/')}`}
            className="hover:text-purple-600 transition-colors"
          >
            {segment.replace(/-/g, ' ')}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  )
}
