import React from 'react'

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black py-10 mt-auto transition-colors">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Universal Market. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}
