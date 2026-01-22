'use client'
import { Link } from '@/i18n/routing'
import { PlusCircle, Package, MessageSquare, Settings } from 'lucide-react'

export const QuickActions = () => {
  const actions = [
    { icon: PlusCircle, href: '/add-listing', color: 'bg-blue-600' },
    { icon: Package, href: '/my-listings', color: 'bg-purple-600' },
    { icon: MessageSquare, href: '/messages', color: 'bg-emerald-600' },
    { icon: Settings, href: '/profile', color: 'bg-slate-600' },
  ]

  return (
    <div className="flex gap-3">
      {actions.map((action, i) => (
        <Link
          key={i}
          href={action.href}
          className={`${action.color} p-4 rounded-2xl text-white shadow-xl hover:scale-110 transition-all active:scale-95`}
        >
          <action.icon size={22} />
        </Link>
      ))}
    </div>
  )
}
