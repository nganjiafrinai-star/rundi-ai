'use client'

import { useState } from 'react'
import Modal from '../modals/modal'
import { useModal } from '../../context/modal/modalContext'
import GeneralSection from './settings/sections/General'
import SecuritySection from './settings/sections/Security'
import DataControlsSection from './settings/sections/DataControls'
import HelpSection from './settings/sections/Help'
import { Settings, Shield, Database, HelpCircle } from 'lucide-react'

export default function SettingsModal() {
  const { closeModal, openModal } = useModal()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General', icon: Settings, component: GeneralSection },
    { id: 'security', label: 'Security', icon: Shield, component: SecuritySection },
    { id: 'data', label: 'Data Controls', icon: Database, component: DataControlsSection },
    {
      id: 'download', label: 'Download App', icon: HelpCircle, component: () => {
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#147E4E]/10 text-[#147E4E]">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold">Mobile Application</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Download our mobile app to take Rundi AI with you everywhere.
            </p>
            <button
              onClick={() => {
                closeModal()
                openModal('download')
              }}
              className="px-6 py-2 bg-[#147E4E] text-white rounded-lg font-medium hover:bg-[#0F6A3F] transition-colors"
            >
              Show QR Code
            </button>
          </div>
        )
      }
    },
    { id: 'help', label: 'Help & Legal', icon: HelpCircle, component: HelpSection },
  ]

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || GeneralSection

  return (
    <Modal title="Settings" onClose={closeModal} size="xl">
      <div className="flex h-[450px] -mx-4 md:-mx-6 -mb-4 md:-mb-6 border-t border-black/5 dark:border-white/5">
        
        <div className="w-[140px] md:w-[180px] border-r border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] py-4">
          <nav className="space-y-1 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-[#147E4E]/10 text-[#147E4E]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <ActiveComponent />
        </div>
      </div>
    </Modal>
  )
}
