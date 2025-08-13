"use client"

import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { nanoid } from '@/store/nanoid'

export type Align = 'left' | 'center' | 'right'

export interface TextLayer {
  id: string
  name?: string
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  fill: string
  opacity: number
  align: Align
  x: number
  y: number
  rotation: number
  boxWidth: number
}

interface BackgroundState {
  dataUrl: string | null
  naturalWidth: number
  naturalHeight: number
}

interface DesignSnapshot {
  layers: TextLayer[]
  selectedLayerId: string | null
  background: BackgroundState | null
}

interface DesignStore {
  layers: TextLayer[]
  selectedLayerId: string | null
  background: HTMLImageElement | null
  _bgDataUrl: string | null
  setBackgroundImageFromFile: (file: File) => Promise<void>
  addTextLayer: () => void
  updateLayer: (id: string, partial: Partial<TextLayer>) => void
  deleteLayer: (id: string) => void
  selectLayer: (id: string | null) => void
  bringForward: (id: string) => void
  sendBackward: (id: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  historyInfo: () => string
  exportPNG: () => Promise<void>
  reset: () => void
  restoreFromStorage: () => void
  registerStage: (getter: () => any) => void
}

const STORAGE_KEY = 'itc-design-v1'
const HISTORY_LIMIT = 50

let getStage: () => any = () => null

function createImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

function takeSnapshot(state: DesignStore): DesignSnapshot {
  const bg = state.background
    ? { dataUrl: state._bgDataUrl, naturalWidth: state.background.naturalWidth, naturalHeight: state.background.naturalHeight }
    : null
  return {
    layers: state.layers,
    selectedLayerId: state.selectedLayerId,
    background: bg
  }
}

function serialize(state: DesignStore) {
  const snapshot = takeSnapshot(state)
  return JSON.stringify(snapshot)
}

function deserialize(text: string): DesignSnapshot | null {
  try { return JSON.parse(text) as DesignSnapshot } catch { return null }
}

export const useDesignStore = create<DesignStore>()(subscribeWithSelector((set, get) => {
  let past: string[] = []
  let future: string[] = []

  const pushHistory = () => {
    const current = serialize(get())
    past.push(current)
    if (past.length > HISTORY_LIMIT) past = past.slice(-HISTORY_LIMIT)
    future = []
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, current)
    }
  }

  return {
    layers: [],
    selectedLayerId: null,
    background: null,
    _bgDataUrl: null,

    async setBackgroundImageFromFile(file) {
      const buf = await file.arrayBuffer()
      const blob = new Blob([buf], { type: 'image/png' })
      const dataUrl = await new Promise<string>(res => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result as string)
        reader.readAsDataURL(blob)
      })
      const img = await createImageFromDataUrl(dataUrl)
      set({ background: img, _bgDataUrl: dataUrl, selectedLayerId: null })
      pushHistory()
    },

    addTextLayer() {
      const id = nanoid()
      const defaults = {
        id,
        name: '',
        text: 'Your text here',
        fontFamily: 'Inter',
        fontSize: 64,
        fontWeight: 700,
        fill: '#111827',
        opacity: 1,
        align: 'left' as const,
        x: 100,
        y: 100,
        rotation: 0,
        boxWidth: 600
      }
      set(state => ({ layers: [...state.layers, defaults], selectedLayerId: id }))
      pushHistory()
    },

    updateLayer(id, partial) {
      set(state => ({
        layers: state.layers.map(l => l.id === id ? { ...l, ...partial } : l)
      }))
      pushHistory()
    },

    deleteLayer(id) {
      set(state => ({
        layers: state.layers.filter(l => l.id !== id),
        selectedLayerId: get().selectedLayerId === id ? null : get().selectedLayerId
      }))
      pushHistory()
    },

    selectLayer(id) {
      set({ selectedLayerId: id })
    },

    bringForward(id) {
      set(state => {
        const idx = state.layers.findIndex(l => l.id === id)
        if (idx < 0 || idx === state.layers.length - 1) return {}
        const next = state.layers.slice()
        const [item] = next.splice(idx, 1)
        next.splice(idx + 1, 0, item)
        return { layers: next }
      })
      pushHistory()
    },

    sendBackward(id) {
      set(state => {
        const idx = state.layers.findIndex(l => l.id === id)
        if (idx <= 0) return {}
        const next = state.layers.slice()
        const [item] = next.splice(idx, 1)
        next.splice(idx - 1, 0, item)
        return { layers: next }
      })
      pushHistory()
    },

    undo() {
      const prev = past.pop()
      if (!prev) return
      const current = serialize(get())
      future.push(current)
      const snap = deserialize(prev)
      if (!snap) return
      set({ layers: snap.layers, selectedLayerId: snap.selectedLayerId })
      if (snap.background?.dataUrl) {
        createImageFromDataUrl(snap.background.dataUrl).then(img => {
          set({ background: img, _bgDataUrl: snap.background!.dataUrl })
        })
      } else {
        set({ background: null, _bgDataUrl: null })
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, prev)
      }
    },

    redo() {
      const next = future.pop()
      if (!next) return
      const current = serialize(get())
      past.push(current)
      const snap = deserialize(next)
      if (!snap) return
      set({ layers: snap.layers, selectedLayerId: snap.selectedLayerId })
      if (snap.background?.dataUrl) {
        createImageFromDataUrl(snap.background.dataUrl).then(img => {
          set({ background: img, _bgDataUrl: snap.background!.dataUrl })
        })
      } else {
        set({ background: null, _bgDataUrl: null })
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, next)
      }
    },

    get canUndo() { return past.length > 0 },
    get canRedo() { return future.length > 0 },

    historyInfo() {
      return `${past.length} undo · ${future.length} redo`
    },

    async exportPNG() {
      const stage = getStage()
      if (!stage) return
      const scaleX = stage.scaleX()
      const scaleY = stage.scaleY()
      const width = stage.width()
      const height = stage.height()
      stage.scale({ x: 1, y: 1 })
      stage.draw()
      const dataUrl = stage.toDataURL({ mimeType: 'image/png', pixelRatio: 1, width, height })
      stage.scale({ x: scaleX, y: scaleY })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'design.png'
      a.click()
    },

    reset() {
      set({ layers: [], selectedLayerId: null, background: null, _bgDataUrl: null })
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
      past = []
      future = []
    },

    async restoreFromStorage() {
      if (typeof window === 'undefined') return
      const text = localStorage.getItem(STORAGE_KEY)
      if (!text) return
      const snap = deserialize(text)
      if (!snap) return
      set({ layers: snap.layers, selectedLayerId: snap.selectedLayerId })
      if (snap.background?.dataUrl) {
        const img = await createImageFromDataUrl(snap.background.dataUrl)
        set({ background: img, _bgDataUrl: snap.background.dataUrl })
      }
    },

    registerStage(getter) {
      getStage = getter
    }
  }
}))