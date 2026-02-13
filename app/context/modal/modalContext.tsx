'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

export type ModalType = 'settings' | 'download' | 'help' | null

type ModalCtx = {
  modal: ModalType
  openModal: (m: Exclude<ModalType, null>) => void
  closeModal: () => void
}

const Ctx = createContext<ModalCtx | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalType>(null)

  const value = useMemo(
    () => ({
      modal,
      openModal: (m: Exclude<ModalType, null>) => setModal(m),
      closeModal: () => setModal(null),
    }),
    [modal]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}


export function useModal(): ModalCtx {
  const ctx = useContext(Ctx)

  if (!ctx) {
    return {
      modal: null,
      openModal: () => {},
      closeModal: () => {},
    }
  }

  return ctx
}
