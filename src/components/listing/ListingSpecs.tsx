import React from 'react'
import { Hash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'

const SpecRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: any
  highlight?: boolean
}) => {
  if (!value) return null
  return (
    <div className="flex justify-between items-center py-4">
      <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
        {label}
      </span>
      <span
        suppressHydrationWarning
        className={`font-black text-[11px] uppercase tracking-tight ${highlight ? 'text-purple-600 dark:text-purple-400' : 'text-slate-900 dark:text-white'}`}
      >
        {value}
      </span>
    </div>
  )
}

export const ListingSpecs = ({ listing }: { listing: any }) => {
  const catT = useTranslations('CategoryPage')
  const t = useTranslations('PostAd.specs')

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm transition-all duration-500">
      <h3 className="text-[10px] font-black uppercase mb-8 tracking-[0.4em] text-purple-600 flex items-center gap-2">
        <Hash size={14} /> {catT('techSpecs')}
      </h3>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        <SpecRow label={catT('listingNo')} value={listing.id} highlight />
        <SpecRow
          label={catT('listingDate')}
          value={new Date(listing.createdAt).toLocaleDateString()}
        />

        {listing.details?.map((block: any, i: number) => (
          <React.Fragment key={i}>
            {block.blockType === 'realEstateSpecs' && (
              <>
                <SpecRow
                  label="Metrekare (Net)"
                  value={block.squareMeters ? `${block.squareMeters} m²` : null}
                />
                <SpecRow label={t('rooms')} value={block.rooms} />
                <SpecRow label={t('buildingAge')} value={block.buildingAge} />
                <SpecRow label={t('propertyType')} value={block.propertyType} />
                <SpecRow label={t('heating')} value={block.heating} />
              </>
            )}
            {block.blockType === 'vehicleSpecs' && (
              <>
                <SpecRow label={t('make')} value={block.make} />
                <SpecRow label={t('model')} value={block.model} />
                <SpecRow label={t('year')} value={block.year} />
                <SpecRow label={t('km')} value={block.km?.toLocaleString()} />
                <SpecRow label={t('fuelType')} value={block.fuelType} />
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
