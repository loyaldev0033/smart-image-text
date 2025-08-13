"use client"

import { useDesignStore } from '@/store/designStore'
import { FontPicker } from '@/components/controls/FontPicker'
import { NumericField } from '@/components/controls/NumericField'

export function RightInspector() {
  const selectedLayerId = useDesignStore(s => s.selectedLayerId)
  const layer = useDesignStore(s => s.layers.find(l => l.id === s.selectedLayerId))
  const updateLayer = useDesignStore(s => s.updateLayer)

  if (!selectedLayerId || !layer) {
    return (
      <aside className="border-l bg-white/60 backdrop-blur">
        <div className="p-3 border-b font-medium">Inspector</div>
        <div className="p-4 text-sm text-slate-500">Select a text layer to edit its properties.</div>
      </aside>
    )
  }

  return (
    <aside className="border-l bg-white/60 backdrop-blur overflow-auto">
      <div className="p-3 border-b font-medium">Inspector</div>
      <div className="p-3 space-y-3 text-sm">
        <div className="space-y-1">
          <label className="text-xs text-slate-600">Text</label>
          <textarea
            className="w-full border rounded px-2 py-1 min-h-[90px]"
            value={layer.text}
            onChange={e => updateLayer(layer.id, { text: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Font</label>
            <FontPicker
              value={layer.fontFamily}
              weight={layer.fontWeight}
              onChange={(family, weight) => updateLayer(layer.id, { fontFamily: family, fontWeight: weight })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Size</label>
            <NumericField
              value={layer.fontSize}
              min={8}
              max={512}
              step={1}
              onChange={v => updateLayer(layer.id, { fontSize: v })}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Weight</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={layer.fontWeight}
              onChange={e => updateLayer(layer.id, { fontWeight: parseInt(e.target.value, 10) })}
            >
              {[100,200,300,400,500,600,700,800,900].map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Opacity</label>
            <NumericField value={Math.round(layer.opacity * 100)} min={0} max={100} step={1} onChange={v => updateLayer(layer.id, { opacity: v / 100 })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Alignment</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={layer.align}
              onChange={e => updateLayer(layer.id, { align: e.target.value as any })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Color</label>
            <input
              type="color"
              className="w-full h-8 border rounded"
              value={layer.fill}
              onChange={e => updateLayer(layer.id, { fill: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Box Width (px)</label>
            <NumericField
              value={Math.round(layer.boxWidth)}
              min={50}
              max={5000}
              step={10}
              onChange={v => updateLayer(layer.id, { boxWidth: v })}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}