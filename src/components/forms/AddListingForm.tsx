'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight, ArrowLeft, ChevronDown, Info, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { CATEGORY_GROUPS } from '@/utils/categoryConstants'
import { saveListingAction } from '@/lib/actions/listing'

// --- YARDIMCI FONKSİYON: Lexical JSON'dan düz metin sökücü ---
const getPlainTextFromLexical = (lexicalObj: any) => {
  if (!lexicalObj) return ''
  try {
    // Payload 3.0 Lexical standart yolu
    return lexicalObj.root?.children?.[0]?.children?.[0]?.text || ''
  } catch (e) {
    return ''
  }
}

export const AddListingForm = ({ locale, initialData }: { locale: string; initialData?: any }) => {
  const t = useTranslations('PostAd')
  const router = useRouter()

  const isEditMode = !!initialData
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [files, setFiles] = useState<File[]>([])

  const initialSpecs = initialData?.details?.[0] || {}

  // --- 1. FORM HAFIZASI (State) ---
  const [formData, setFormData] = useState({
    title_tr:
      initialData?.title?.tr ||
      (typeof initialData?.title === 'string' ? initialData.title : '') ||
      '',
    title_en: initialData?.title?.en || '',
    description_tr: getPlainTextFromLexical(initialData?.description?.tr),
    description_en: getPlainTextFromLexical(initialData?.description?.en),
    listingType: initialData?.listingType || 'for-sale',
    vehicleType: initialData?.vehicleType || 'other',
    category: initialData?.category?.id || initialData?.category || '',
    price: initialData?.price || '',
    currency: initialData?.currency || 'TRY',
    allowOnlinePurchase: initialData?.allowOnlinePurchase || false,
    isDailyRental: initialData?.isDailyRental || false,
    stock: initialData?.stock || 1,
    // Teknik Detaylar
    km: initialSpecs.km || '',
    make: initialSpecs.make || '',
    model: initialSpecs.model || '',
    year: initialSpecs.year || '',
    squareMeters: initialSpecs.squareMeters || '',
    rooms: initialSpecs.rooms || '',
    buildingAge: initialSpecs.buildingAge || '',
    heating: initialSpecs.heating || '',
  })

  // --- 2. VERİ ÇEKME VE OTOMATİK GRUP TESPİTİ ---
  useEffect(() => {
    fetch(`/api/categories?locale=${locale}&depth=1&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const docs = data.docs || []
        setCategories(docs)

        // Düzenleme modundaysak, kategorinin grubunu (Araba/Emlak) otomatik bul
        if (isEditMode && formData.category) {
          const found = docs.find((c: any) => String(c.id) === String(formData.category))
          if (found) {
            setFormData((prev) => ({ ...prev, vehicleType: found.listingGroup || 'other' }))
          }
        }
      })
  }, [locale, isEditMode, formData.category])

  // --- 3. OLAY YÖNETİCİLERİ ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value
    const selectedCat = categories.find((c) => String(c.id) === String(categoryId))
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      vehicleType: selectedCat?.listingGroup || 'other',
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index))

  // --- 4. KAYDETME (SUBMIT) ---
  const handleSubmit = async () => {
    setUploading(true)
    try {
      // A. Resimleri Yükle
      const finalMediaIds = initialData?.gallery?.map((img: any) => img.id || img) || []
      if (files.length > 0) {
        for (const file of files) {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('alt', formData.title_tr)
          const res = await fetch('/api/media', { method: 'POST', body: fd })
          const data = await res.json()
          if (data.doc?.id) finalMediaIds.push(data.doc.id)
        }
      }

      const isTechnical = ['cars', 'motorcycle', 'real-estate'].includes(formData.vehicleType)

      // B. Paketi Hazırla
      const postData = {
        title: { tr: formData.title_tr.trim(), en: formData.title_en.trim() },
        description_tr: formData.description_tr,
        description_en: formData.description_en,
        listingType: formData.listingType,
        vehicleType: formData.vehicleType,
        price: Number(formData.price),
        currency: formData.currency,
        category: Number(formData.category),
        allowOnlinePurchase: formData.allowOnlinePurchase,
        isDailyRental: formData.isDailyRental,
        stock: Number(formData.stock),
        mainImage: finalMediaIds[0],
        gallery: finalMediaIds,
        details: isTechnical
          ? [
              {
                blockType:
                  formData.vehicleType === 'real-estate' ? 'realEstateSpecs' : 'vehicleSpecs',
                ...(formData.vehicleType === 'real-estate'
                  ? {
                      squareMeters: Number(formData.squareMeters),
                      rooms: formData.rooms,
                      buildingAge: formData.buildingAge,
                      heating: formData.heating,
                    }
                  : {
                      make: formData.make,
                      model: formData.model,
                      year: Number(formData.year),
                      km: Number(formData.km),
                    }),
              },
            ]
          : [],
      }

      const result = await saveListingAction(postData, isEditMode ? initialData.id : undefined)
      if (result.success) {
        alert(isEditMode ? 'Başarıyla güncellendi!' : 'Başarıyla yayınlandı!')
        router.push('/my-listings')
      } else {
        alert(`Hata: ${result.error}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  // --- 5. GÖRSEL TASARIM ---
  const inputClassName =
    'w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium transition-all'
  const selectClassName =
    'w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white outline-none focus:border-purple-500 appearance-none font-medium text-sm transition-all'

  return (
    <div className="space-y-10">
      {/* STEPPER */}
      <div className="flex items-center justify-between max-w-md mx-auto mb-16">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= s ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 rounded-full ${step > s ? 'bg-purple-600' : 'bg-slate-100 dark:bg-white/5'}`}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] text-center">
        {isEditMode ? 'DÜZENLEME MODU AKTİF' : 'YENİ KAYIT MODU AKTİF'}
      </p>

      {/* ADIM 1: GENEL BİLGİLER */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50/50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
            <div className="space-y-2 text-slate-900 dark:text-white">
              <label className="text-[10px] font-black text-purple-600 ml-1 uppercase">
                TÜRKÇE BAŞLIK
              </label>
              <input
                name="title_tr"
                value={formData.title_tr}
                onChange={handleChange}
                placeholder="İlan başlığı..."
                className={inputClassName}
              />
            </div>
            <div className="space-y-2 text-slate-900 dark:text-white">
              <label className="text-[10px] font-black text-blue-600 ml-1 uppercase">
                ENGLISH TITLE
              </label>
              <input
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                placeholder="Listing title..."
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                {t('labels.listingType')}
              </label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className={selectClassName}
              >
                <option value="for-sale">{t('options.sale')}</option>
                <option value="for-rent">{t('options.rent')}</option>
              </select>
              <ChevronDown
                className="absolute right-6 top-11 text-slate-400 pointer-events-none"
                size={16}
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                {t('labels.currency')}
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full bg-purple-600 text-white rounded-2xl py-4 px-6 font-black shadow-lg appearance-none cursor-pointer"
              >
                <option value="TRY">₺ - TRY</option>
                <option value="USD">$ - USD</option>
                <option value="EUR">€ - EUR</option>
              </select>
              <ChevronDown
                className="absolute right-6 top-11 text-white pointer-events-none"
                size={16}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              {t('labels.price')}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className={inputClassName}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-[2rem] border border-purple-100 dark:border-purple-500/20">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="allowOnlinePurchase"
                checked={formData.allowOnlinePurchase}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-purple-300 text-purple-600"
              />
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">
                Online Satın Alma
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="isDailyRental"
                checked={formData.isDailyRental}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-purple-300 text-purple-600"
              />
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">
                Günlük Kiralama
              </span>
            </label>
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              {t('labels.category')}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className={selectClassName}
            >
              <option value="">{t('placeholders.category')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-6 top-11 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      )}

      {/* ADIM 2: DETAYLAR */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl text-purple-600">
            <Info size={20} />
            <p className="text-xs font-bold uppercase">
              Lütfen detayları ve ilan açıklamasını giriniz.
            </p>
          </div>

          {formData.vehicleType === 'real-estate' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
              <input
                name="squareMeters"
                value={formData.squareMeters}
                onChange={handleChange}
                placeholder={t('specs.squareMeters')}
                className={inputClassName}
              />
              <input
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                placeholder={t('specs.rooms')}
                className={inputClassName}
              />
              <input
                name="buildingAge"
                value={formData.buildingAge}
                onChange={handleChange}
                placeholder={t('specs.buildingAge')}
                className={inputClassName}
              />
              <input
                name="heating"
                value={formData.heating}
                onChange={handleChange}
                placeholder={t('specs.heating')}
                className={inputClassName}
              />
            </div>
          ) : (
            ['cars', 'motorcycle'].includes(formData.vehicleType) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
                <input
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder={t('specs.make')}
                  className={inputClassName}
                />
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder={t('specs.model')}
                  className={inputClassName}
                />
                <input
                  type="number"
                  name="km"
                  value={formData.km}
                  onChange={handleChange}
                  placeholder={t('specs.km')}
                  className={inputClassName}
                />
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder={t('specs.year')}
                  className={inputClassName}
                />
              </div>
            )
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-purple-600 ml-1 uppercase">
                TÜRKÇE AÇIKLAMA
              </label>
              <textarea
                name="description_tr"
                value={formData.description_tr}
                onChange={handleChange}
                rows={5}
                className={inputClassName + ' resize-none py-4'}
                placeholder="Açıklama yazın..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-600 ml-1 uppercase">
                ENGLISH DESCRIPTION
              </label>
              <textarea
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                rows={5}
                className={inputClassName + ' resize-none py-4'}
                placeholder="Write description..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ADIM 3: FOTOĞRAFLAR */}
      {step === 3 && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="relative border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem] p-12 text-center hover:border-purple-500/50 transition-all group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-4">
              <Upload
                size={40}
                className="mx-auto text-purple-600 group-hover:scale-110 transition-transform"
              />
              <p className="text-lg font-black uppercase text-slate-900 dark:text-white">
                FOTOĞRAFLARI SEÇİN
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {isEditMode &&
              initialData.gallery?.map((img: any, i: number) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden border-2 border-purple-500 shadow-lg"
                >
                  <Image
                    src={img.url || img}
                    alt=""
                    fill
                    className="object-cover opacity-60"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-black bg-black/20 uppercase tracking-widest">
                    KAYITLI
                  </div>
                </div>
              ))}
            {files.map((file, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-sm"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg z-20 shadow-md transition-transform active:scale-90"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BUTONLAR */}
      <div className="flex justify-between items-center pt-10 border-t border-slate-100 dark:border-white/5">
        <button
          type="button"
          onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          className="text-[10px] font-black uppercase text-slate-400 hover:text-purple-600 transition-all tracking-widest"
        >
          {step === 1 ? t('buttons.cancel') : t('buttons.back')}
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {t('buttons.next')}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex items-center gap-3 px-12 py-5 bg-purple-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl disabled:opacity-50 active:scale-95 transition-all"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : isEditMode ? (
              'GÜNCELLE'
            ) : (
              t('buttons.submit')
            )}
          </button>
        )}
      </div>
    </div>
  )
}
