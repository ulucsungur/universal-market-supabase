import { Link } from '@/i18n/routing'
import { Share2 } from 'lucide-react'

export const ListingHeader = ({ title }: { title: string }) => {
  return (
    <header className="mb-10 space-y-4">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600">
        <Link href="/" className="opacity-50 hover:opacity-100 transition-opacity">
          HOME
        </Link>
        <span className="opacity-20 text-slate-400">/</span>
        <span className="text-foreground">{title}</span>
      </nav>
      <div className="flex justify-between items-start gap-6">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none max-w-4xl text-slate-900 dark:text-white">
          {title}
        </h1>
        <button className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-purple-600 hover:text-white transition-all shadow-sm group">
          <Share2 size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </header>
  )
}
