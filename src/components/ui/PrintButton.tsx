'use client' // Etkileşim için şart

import React from 'react'
import { Printer } from 'lucide-react'

export const PrintButton = () => {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
    >
      <Printer size={16} /> Yazdır / PDF
    </button>
  )
}
