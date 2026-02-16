'use client'

import Modal from '../modals/modal'
import { useModal } from '../../context/modal/modalContext'
import { useLanguage } from '@/app/context/languageContext'

export default function DownloadModal() {
  const { closeModal } = useModal()
  const { t } = useLanguage()

  return (
    <Modal title={t.downloadApp} onClose={closeModal} size="md">
      <div className="flex flex-col bg-card items-center text-center space-y-6 py-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.getApp}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            {t.scanQR}
          </p>
        </div>

        <div className="p-4 bg-background rounded-2xl shadow-sm border border-border">

          <svg
            className="w-48 h-48 text-[#147E4E]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <rect x="7" y="7" width="3" height="3" />
            <rect x="14" y="7" width="3" height="3" />
            <rect x="7" y="14" width="3" height="3" />
            <rect x="14" y="14" width="3" height="3" />
            <path d="M7 11h1M11 7v1M11 11h1M11 14v1M14 11h1M17 14v1" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50 border border-border">
            <span className="text-xs font-semibold text-[#147E4E]">Android</span>
            <span className="text-[10px] text-gray-500">v1.0.4 • .apk</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50 border border-border opacity-50">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">iOS</span>
            <span className="text-[10px] text-gray-500">{t.comingSoon}</span>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          {t.androidMin}
        </p>
      </div>
    </Modal>
  )
}
