"use client"

import { useDesignStore } from '@/store/designStore'

export function LeftLayersPanel() {
  const layers = useDesignStore(s => s.layers)
  const selectedLayerId = useDesignStore(s => s.selectedLayerId)
  const selectLayer = useDesignStore(s => s.selectLayer)
  const bringForward = useDesignStore(s => s.bringForward)
  const sendBackward = useDesignStore(s => s.sendBackward)
  const deleteLayer = useDesignStore(s => s.deleteLayer)

  return (
    <aside className="border-r bg-white/60 backdrop-blur overflow-auto">
      <div className="p-3 border-b font-medium">Layers</div>
      <div className="p-2 space-y-1">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded cursor-pointer ${selectedLayerId === layer.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'}`}
            onClick={() => selectLayer(layer.id)}
          >
            <div className="truncate text-sm">{layer.name || `Text ${index + 1}`}</div>
            <div className="flex items-center gap-1">
              <button title="Bring Forward" className="px-1 py-0.5 border rounded" onClick={(e) => { e.stopPropagation(); bringForward(layer.id) }}>▲</button>
              <button title="Send Backward" className="px-1 py-0.5 border rounded" onClick={(e) => { e.stopPropagation(); sendBackward(layer.id) }}>▼</button>
              <button title="Delete" className="px-1 py-0.5 border rounded" onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id) }}>✕</button>
            </div>
          </div>
        ))}
        {layers.length === 0 && (
          <div className="text-xs text-slate-500 p-2">No layers yet. Click &quot;Add Text&quot;.</div>
        )}
      </div>
    </aside>
  )
}