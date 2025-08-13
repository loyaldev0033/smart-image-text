"use client"

import { useEffect } from 'react'
import { CanvasStage } from '@/components/canvas/CanvasStage'
import { RightInspector } from '@/components/panels/RightInspector'
import { LeftLayersPanel } from '@/components/panels/LeftLayersPanel'
import { TopToolbar } from '@/components/panels/TopToolbar'
import { useDesignStore } from '@/store/designStore'

export function Editor() {
  const restoreFromStorage = useDesignStore(s => s.restoreFromStorage)

  useEffect(() => {
    restoreFromStorage()
  }, [restoreFromStorage])

  return (
    <div className="flex flex-col h-screen">
      <TopToolbar />
      <div className="flex-1 grid grid-cols-[280px_1fr_320px] gap-0 min-h-0 overflow-hidden">
        <LeftLayersPanel />
        <CanvasStage />
        <RightInspector />
      </div>
    </div>
  )
}