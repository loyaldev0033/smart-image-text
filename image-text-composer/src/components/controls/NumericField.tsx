"use client"

export function NumericField({ value, min, max, step = 1, onChange }: {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-stretch border rounded overflow-hidden">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full px-2 py-1 outline-none"
      />
      <div className="flex flex-col">
        <button className="px-2 border-l text-xs" onClick={() => onChange(Math.min(max ?? Infinity, value + step))}>▲</button>
        <button className="px-2 border-l text-xs" onClick={() => onChange(Math.max(min ?? -Infinity, value - step))}>▼</button>
      </div>
    </div>
  )
}