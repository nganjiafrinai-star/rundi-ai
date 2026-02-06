'use client'

import Modal from '../modals/modal'
import { useModal } from '../../context/modal/modalContext'
import { useLanguage } from '@/app/context/languageContext'

export default function HelpModal() {
  const { closeModal } = useModal()
  const { t } = useLanguage()

  return (
    <Modal title={t.helpSupport} onClose={closeModal}>
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">FAQ, contact, support form…</p>
        <div className="rounded-xl border border-gray-200 dark:border-[#2A2A2A] p-3">
          <p className="font-medium text-gray-900 dark:text-white">{t.contact}</p>
          <p className="text-gray-600 dark:text-gray-400">support@yourapp.com</p>
        </div>
      </div>
    </Modal>
  )
}
