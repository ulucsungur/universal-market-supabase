'use client'

import React, { useState } from 'react'
import { Menu, X, PlusCircle, Home, Car, Building2, Briefcase } from 'lucide-react'
import Link from 'next/link'

export const MobileNav = ({ session }: { session: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-slate-100 dark:bg-neutral-800 rounded-lg text-slate-600 dark:text-neutral-400"
      >
        <Menu size={24} />
      </button>

      {/* Overlay & Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-neutral-900 z-[70] p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <span className="font-black text-xl tracking-tighter">MENÜ</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-5">
              <Link
                href="/vehicle"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-bold hover:text-blue-600 transition"
              >
                VASITA
              </Link>
              <Link
                href="/real-estate"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-bold hover:text-blue-600 transition"
              >
                EMLAK
              </Link>
              <Link
                href="/services"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-bold hover:text-blue-600 transition"
              >
                HİZMETLER
              </Link>

              <div className="h-px bg-slate-100 dark:bg-neutral-800 my-4" />

              {!session && (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 text-center font-bold border border-slate-200 dark:border-neutral-800 rounded-xl"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 text-center font-bold bg-blue-600 text-white rounded-xl"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}

              <Link
                href="/create-listing"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20"
              >
                <PlusCircle size={20} /> İlan Ver
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
