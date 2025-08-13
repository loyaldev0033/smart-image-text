"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer, Line } from 'react-konva'
import type { Stage as StageType } from 'konva/lib/Stage'
import type { Transformer as TransformerType } from 'konva/lib/shapes/Transformer'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useDesignStore } from '@/store/designStore'

export function CanvasStage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<StageType | null>(null)
  const transformerRef = useRef<TransformerType | null>(null)

  const background = useDesignStore(s => s.background)
  const layers = useDesignStore(s => s.layers)
  const selectedLayerId = useDesignStore(s => s.selectedLayerId)
  const selectLayer = useDesignStore(s => s.selectLayer)
  const updateLayer = useDesignStore(s => s.updateLayer)
  const registerStage = useDesignStore(s => s.registerStage)

  const [displayScale, setDisplayScale] = useState(1)

  const canvasSize = useMemo(() => {
    const w = background?.naturalWidth ?? 1200
    const h = background?.naturalHeight ?? 800
    return { width: w, height: h }
  }, [background])

  useEffect(() => {
    registerStage(() => stageRef.current)
  }, [registerStage])

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return
      const bounds = containerRef.current.getBoundingClientRect()
      const maxW = bounds.width
      const maxH = bounds.height
      const { width, height } = canvasSize
      const scale = Math.min(maxW / width, maxH / height, 1)
      setDisplayScale(scale)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [canvasSize])

  // Nudge with arrow keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedLayerId) return
      const delta = e.shiftKey ? 10 : 1
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const layer = layers.find(l => l.id === selectedLayerId)
        if (!layer) return
        const dx = e.key === 'ArrowLeft' ? -delta : e.key === 'ArrowRight' ? delta : 0
        const dy = e.key === 'ArrowUp' ? -delta : e.key === 'ArrowDown' ? delta : 0
        updateLayer(selectedLayerId, { x: layer.x + dx, y: layer.y + dy })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedLayerId, layers, updateLayer])

  // Snap-to center guides
  const [showVGuide, setShowVGuide] = useState(false)
  const [showHGuide, setShowHGuide] = useState(false)

  const centerX = canvasSize.width / 2
  const centerY = canvasSize.height / 2

  const onDragMove = (id: string) => (e: KonvaEventObject<DragEvent>) => {
    const node = e.target
    const box = node.getClientRect({ relativeTo: stageRef.current ?? undefined })
    const absCenterX = box.x + box.width / 2
    const absCenterY = box.y + box.height / 2
    const snapThresh = 5
    let newX = node.x()
    let newY = node.y()
    let v = false, h = false
    if (Math.abs(absCenterX - centerX) < snapThresh) {
      v = true
      newX += centerX - absCenterX
    }
    if (Math.abs(absCenterY - centerY) < snapThresh) {
      h = true
      newY += centerY - absCenterY
    }
    node.x(newX)
    node.y(newY)
    setShowVGuide(v)
    setShowHGuide(h)
  }

  const onDragEnd = (id: string) => (e: KonvaEventObject<DragEvent>) => {
    setShowVGuide(false); setShowHGuide(false)
    const node = e.target
    updateLayer(id, { x: node.x(), y: node.y() })
  }

  // Transformer selection sync
  useEffect(() => {
    const tr = transformerRef.current
    const stage = stageRef.current
    if (!tr || !stage) return
    const selectedNode = stage.findOne(`#node-${selectedLayerId}`)
    tr.nodes(selectedNode ? [selectedNode] : [])
    tr.getLayer()?.batchDraw()
  }, [selectedLayerId, layers])

  return (
    <div ref={containerRef} className="relative min-h-0 overflow-hidden bg-slate-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <Stage
          ref={node => (stageRef.current = node as any)}
          width={canvasSize.width}
          height={canvasSize.height}
          scaleX={displayScale}
          scaleY={displayScale}
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage()
            if (clickedOnEmpty) {
              selectLayer(null)
            }
          }}
        >
          <Layer listening={!!background}>
            {background && (
              <KonvaImage image={background} width={canvasSize.width} height={canvasSize.height} />
            )}
            {layers.map(layer => (
              <KonvaText
                key={layer.id}
                id={`node-${layer.id}`}
                text={layer.text}
                x={layer.x}
                y={layer.y}
                width={layer.boxWidth}
                rotation={layer.rotation}
                fontFamily={layer.fontFamily}
                fontSize={layer.fontSize}
                fontStyle={layer.fontWeight >= 700 ? 'bold' : 'normal'}
                fill={layer.fill}
                opacity={layer.opacity}
                align={layer.align}
                draggable
                onDragMove={onDragMove(layer.id)}
                onDragEnd={onDragEnd(layer.id)}
                onTransformEnd={(e) => {
                  const node = e.target as any
                  const scaleX = node.scaleX()
                  const scaleY = node.scaleY()
                  node.scaleX(1)
                  node.scaleY(1)
                  const newWidth = Math.max(20, node.width() * scaleX)
                  const newFontSize = Math.max(1, node.fontSize() * scaleY)
                  updateLayer(layer.id, {
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    boxWidth: newWidth,
                    fontSize: newFontSize
                  })
                }}
                onClick={() => selectLayer(layer.id)}
                onTap={() => selectLayer(layer.id)}
                perfectDrawEnabled={false}
                shadowForStrokeEnabled={false}
              />
            ))}
            <Transformer
              ref={node => (transformerRef.current = node as any)}
              rotateEnabled
              enabledAnchors={["top-left","top-right","bottom-left","bottom-right","middle-right"]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 20 || newBox.height < 10) return oldBox
                return newBox
              }}
            />
            {showVGuide && (
              <Line points={[centerX, 0, centerX, canvasSize.height]} stroke="#3b82f6" strokeWidth={1} dash={[4,4]} />
            )}
            {showHGuide && (
              <Line points={[0, centerY, canvasSize.width, centerY]} stroke="#3b82f6" strokeWidth={1} dash={[4,4]} />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}