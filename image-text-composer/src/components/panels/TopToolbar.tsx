"use client"

import { useRef } from 'react'
import { useDesignStore } from '@/store/designStore'

export function TopToolbar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const addTextLayer = useDesignStore(s => s.addTextLayer)
  const undo = useDesignStore(s => s.undo)
  const redo = useDesignStore(s => s.redo)
  const canUndo = useDesignStore(s => s.canUndo)
  const canRedo = useDesignStore(s => s.canRedo)
  const exportPNG = useDesignStore(s => s.exportPNG)
  const reset = useDesignStore(s => s.reset)
  const setBackgroundImageFromFile = useDesignStore(s => s.setBackgroundImageFromFile)
  const historyInfo = useDesignStore(s => s.historyInfo)

  return (
    <div className="h-14 border-b bg-white/80 backdrop-blur flex items-center gap-2 px-3 sticky top-0 z-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={async e => {
          const file = e.target.files?.[0]
          if (file) {
            await setBackgroundImageFromFile(file)
            e.currentTarget.value = ''
          }
        }}
      />
      <button
        className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50"
        onClick={() => fileInputRef.current?.click()}
      >Upload PNG</button>

      <div className="w-px h-6 bg-slate-200 mx-2" />

      <button
        className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50"
        onClick={() => addTextLayer()}
      >Add Text</button>

      <div className="w-px h-6 bg-slate-200 mx-2" />

      <button
        disabled={!canUndo}
        className="px-2 py-1.5 rounded-md border bg-white enabled:hover:bg-slate-50 disabled:opacity-40"
        onClick={undo}
      >Undo</button>
      <button
        disabled={!canRedo}
        className="px-2 py-1.5 rounded-md border bg-white enabled:hover:bg-slate-50 disabled:opacity-40"
        onClick={redo}
      >Redo</button>
      <div className="text-xs text-slate-500 ml-2">{historyInfo()}</div>

      <div className="ml-auto flex items-center gap-2">
        <button
          className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50"
          onClick={() => exportPNG()}
        >Export PNG</button>
        <button
          className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50"
          onClick={() => reset()}
        >Reset</button>
      </div>
    </div>
  )
}