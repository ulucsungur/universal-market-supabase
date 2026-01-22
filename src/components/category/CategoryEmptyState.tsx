import { Link } from '@/i18n/routing'
import { LayoutGrid } from 'lucide-react'

export const CategoryEmptyState = ({
  noListingsText,
  backHomeText,
}: {
  noListingsText: string
  backHomeText: string
}) => {
  return (
    <div className="py-40 text-center border-2 border-dashed rounded-[3.5rem] border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
      <LayoutGrid size={48} className="mx-auto text-slate-200 dark:text-white/10 mb-6" />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mb-8">
        {noListingsText}
      </p>
      <Link
        href="/"
        className="inline-flex px-10 py-5 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
      >
        {backHomeText}
      </Link>
    </div>
  )
}
