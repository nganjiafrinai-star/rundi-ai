'use client'

import { useModal } from '../../context/modal/modalContext'
import SettingsModal from '../overlays/settingsModal'
import DownloadModal from '../overlays/downloadModal'
import HelpModal from '../overlays/helpModal'

export default function ModalRoot() {
  const { modal } = useModal()
  if (!modal) return null

  if (modal === 'settings') return <SettingsModal />
  if (modal === 'download') return <DownloadModal />
  if (modal === 'help') return <HelpModal />
  return null
}
