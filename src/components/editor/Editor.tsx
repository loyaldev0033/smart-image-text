"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { fabric } from "fabric"; // replaced with dynamic import
import WebFont from "webfontloader";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const AUTOSAVE_KEY = "image-text-composer:design";
const MAX_HISTORY = 50;

type HistoryEntry = string; // JSON canvas

type FabricNS = any;

function useCanvasHistory(canvasRef: React.MutableRefObject<any>) {
  const history = useRef<HistoryEntry[]>([]);
  const index = useRef<number>(-1);
  const isApplying = useRef(false);

  const push = useCallback(() => {
    if (!canvasRef.current || isApplying.current) return;
    const json = JSON.stringify(canvasRef.current.toJSON(["id"])) as HistoryEntry;
    if (index.current < history.current.length - 1) {
      history.current = history.current.slice(0, index.current + 1);
    }
    history.current.push(json);
    if (history.current.length > MAX_HISTORY) {
      history.current.shift();
    }
    index.current = history.current.length - 1;
  }, [canvasRef]);

  const undo = useCallback(async () => {
    if (!canvasRef.current) return;
    if (index.current <= 0) return;
    isApplying.current = true;
    index.current -= 1;
    const json = history.current[index.current];
    await new Promise<void>((resolve) => {
      canvasRef.current!.loadFromJSON(json, () => {
        canvasRef.current!.renderAll();
        isApplying.current = false;
        resolve();
      });
    });
  }, [canvasRef]);

  const redo = useCallback(async () => {
    if (!canvasRef.current) return;
    if (index.current >= history.current.length - 1) return;
    isApplying.current = true;
    index.current += 1;
    const json = history.current[index.current];
    await new Promise<void>((resolve) => {
      canvasRef.current!.loadFromJSON(json, () => {
        canvasRef.current!.renderAll();
        isApplying.current = false;
        resolve();
      });
    });
  }, [canvasRef]);

  const snapshotFromCurrent = useCallback(() => {
    if (!canvasRef.current) return;
    const json = JSON.stringify(canvasRef.current.toJSON(["id"])) as HistoryEntry;
    history.current = [json];
    index.current = 0;
  }, [canvasRef]);

  return { push, undo, redo, history, index, snapshotFromCurrent };
}

function loadGoogleFont(family: string, weight?: string | number) {
  return new Promise<void>((resolve) => {
    WebFont.load({
      google: { families: [weight ? `${family}:${weight}` : family] },
      active: () => resolve(),
      inactive: () => resolve(),
      fontinactive: () => resolve(),
    });
  });
}

function useAutosave(canvasRef: React.MutableRefObject<any>) {
  useEffect(() => {
    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const json = canvas.toJSON(["id"]);
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(json));
    }, 1000);
    return () => clearInterval(interval);
  }, [canvasRef]);
}

function centerSnap(canvas: any, target: any) {
  const threshold = 5;
  const centerX = canvas.getWidth() / 2;
  const centerY = canvas.getHeight() / 2;
  let changed = false;

  const objectCenter = target.getCenterPoint();
  if (Math.abs(objectCenter.x - centerX) < threshold) {
    target.left = centerX - target.getScaledWidth() / 2;
    changed = true;
  }
  if (Math.abs(objectCenter.y - centerY) < threshold) {
    target.top = centerY - target.getScaledHeight() / 2;
    changed = true;
  }
  if (changed) target.setCoords();
}

type FontOption = { family: string; label?: string };

const DEFAULT_FONTS: FontOption[] = [
  { family: "Inter" },
  { family: "Roboto" },
  { family: "Open Sans" },
  { family: "Montserrat" },
  { family: "Lato" },
  { family: "Poppins" },
  { family: "Oswald" },
  { family: "Merriweather" },
  { family: "Playfair Display" },
  { family: "Raleway" },
];

export default function Editor() {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<any>(null);
  const fabricRef = useRef<FabricNS>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [active, setActive] = useState<any | null>(null);
  const [fonts, setFonts] = useState<FontOption[]>(DEFAULT_FONTS);
  const { push, undo, redo, history, index, snapshotFromCurrent } = useCanvasHistory(canvasRef);

  useEffect(() => {
    let disposed = false;
    (async () => {
      const mod: any = await import("fabric");
      const fabricLib: any = (mod as any).fabric || mod;
      if (disposed) return;
      fabricRef.current = fabricLib;
      if (!canvasEl.current) return;
      const canvas = new fabricLib.Canvas(canvasEl.current, {
        preserveObjectStacking: true,
        selection: true,
      });
      canvasRef.current = canvas;

      const handleKey = (e: KeyboardEvent) => {
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        let moved = false;
        const small = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft") {
          activeObject.left = (activeObject.left || 0) - small; moved = true;
        } else if (e.key === "ArrowRight") {
          activeObject.left = (activeObject.left || 0) + small; moved = true;
        } else if (e.key === "ArrowUp") {
          activeObject.top = (activeObject.top || 0) - small; moved = true;
        } else if (e.key === "ArrowDown") {
          activeObject.top = (activeObject.top || 0) + small; moved = true;
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
          e.preventDefault();
          undo();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
          e.preventDefault();
          redo();
        }
        if (moved) {
          activeObject.setCoords();
          canvas.requestRenderAll();
          push();
        }
      };
      window.addEventListener("keydown", handleKey);

      const onSel = () => setActive(canvas.getActiveObject());
      canvas.on("selection:created", onSel);
      canvas.on("selection:updated", onSel);
      canvas.on("selection:cleared", () => setActive(null));

      canvas.on("object:modified", (e: any) => {
        if (e.target) centerSnap(canvas, e.target);
        push();
      });
      canvas.on("object:scaling", (e: any) => {
        if (e.target) centerSnap(canvas, e.target);
      });
      canvas.on("object:moving", (e: any) => {
        if (e.target) centerSnap(canvas, e.target);
      });
      canvas.on("object:rotating", (e: any) => {
        if (e.target) centerSnap(canvas, e.target);
      });

      try {
        const raw = localStorage.getItem(AUTOSAVE_KEY);
        if (raw) {
          const json = JSON.parse(raw);
          canvas.loadFromJSON(json, () => {
            canvas.renderAll();
            snapshotFromCurrent();
          });
        }
      } catch {}

      return () => {
        window.removeEventListener("keydown", handleKey);
        canvas.dispose();
      };
    })();
    return () => { disposed = true; };
  }, [push, redo, undo, snapshotFromCurrent]);

  useAutosave(canvasRef);

  const setCanvasSize = useCallback((w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setWidth(w);
    canvas.setHeight(h);
    canvas.calcOffset();
    canvas.requestRenderAll();
  }, []);

  const handleUpload = useCallback((file: File) => {
    if (file.type !== "image/png") {
      alert("Please upload a PNG file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setBgImage(img);
        setCanvasSize(img.width, img.height);
        const canvas = canvasRef.current!;
        const bg = new fabricRef.current.Image(img, { selectable: false, evented: false });
        canvas.setBackgroundImage(bg, canvas.requestRenderAll.bind(canvas));
        canvas.discardActiveObject();
        push();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [push, setCanvasSize]);

  const addTextLayer = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fontFamily = fonts[0]?.family || "Inter";
    await loadGoogleFont(fontFamily, "400");
    const text = new fabricRef.current.Textbox("Double-click to edit", {
      id: nanoid(),
      left: canvas.getWidth() / 2 - 150,
      top: canvas.getHeight() / 2 - 30,
      width: 300,
      fontFamily,
      fontSize: 36,
      fontWeight: "400",
      fill: "#000000",
      opacity: 1,
      textAlign: "center",
      editable: true,
    } as any);
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
    push();
  }, [fonts, push]);

  const bringForward = useCallback(() => {
    const canvas = canvasRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.bringForward(obj);
    canvas.requestRenderAll();
    push();
  }, [push]);

  const sendBackward = useCallback(() => {
    const canvas = canvasRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.sendBackwards(obj);
    canvas.requestRenderAll();
    push();
  }, [push]);

  const deleteSelected = useCallback(() => {
    const canvas = canvasRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    push();
  }, [push]);

  const reset = useCallback(() => {
    localStorage.removeItem(AUTOSAVE_KEY);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.clear();
    setBgImage(null);
    push();
  }, [push]);

  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png", multiplier: 1 });
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "design.png";
    a.click();
  }, []);

  const activeTextbox = (active as any) || null;

  const updateActive = useCallback((updates: Partial<any>) => {
    const canvas = canvasRef.current;
    if (!canvas || !activeTextbox) return;
    activeTextbox.set({ ...updates });
    activeTextbox.setCoords();
    canvas.requestRenderAll();
    push();
  }, [activeTextbox, push]);

  const handleFontChange = useCallback(async (family: string) => {
    await loadGoogleFont(family, "400");
    updateActive({ fontFamily: family });
  }, [updateActive]);

  const handleWeightChange = useCallback(async (weight: string) => {
    if (!activeTextbox) return;
    await loadGoogleFont(activeTextbox.fontFamily || "Inter", weight);
    updateActive({ fontWeight: weight as any });
  }, [activeTextbox, updateActive]);

  const handleAlignChange = useCallback((align: "left" | "center" | "right") => {
    updateActive({ textAlign: align });
  }, [updateActive]);

  const loadAllGoogleFontsList = useCallback(async () => {
    try {
      const res = await fetch("/api/fonts");
      const data: { family: string }[] = await res.json();
      setFonts(data);
    } catch {}
  }, []);

  useEffect(() => {
    loadAllGoogleFontsList();
  }, [loadAllGoogleFontsList]);

  return (
    <div className="w-full h-[100vh] grid grid-cols-[320px_1fr] overflow-hidden">
      <div className="border-r bg-neutral-50 dark:bg-neutral-900 p-4 space-y-4 overflow-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload PNG</label>
          <Input type="file" accept="image/png" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          <div className="flex gap-2">
            <Button onClick={addTextLayer} disabled={!bgImage}>Add Text</Button>
            <Button variant="secondary" onClick={reset}>Reset</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={undo}>Undo</Button>
            <Button variant="outline" onClick={redo}>Redo</Button>
            <Button variant="default" onClick={exportPNG} disabled={!bgImage}>Export PNG</Button>
          </div>
        </div>
        <Separator />
        <div>
          <div className="text-sm font-semibold mb-2">Selected Text</div>
          {!activeTextbox && <div className="text-xs text-muted-foreground">Select a text layer to edit its properties.</div>}
          {activeTextbox && (
            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="arrange">Arrange</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-3 mt-3">
                <Textarea
                  value={activeTextbox.text || ""}
                  onChange={(e) => updateActive({ text: e.target.value })}
                  rows={4}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs mb-1">Alignment</div>
                    <Select onValueChange={(v) => handleAlignChange(v as any)} value={activeTextbox.textAlign || "left"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="style" className="space-y-3 mt-3">
                <div>
                  <div className="text-xs mb-1">Font</div>
                  <Select onValueChange={handleFontChange} value={activeTextbox.fontFamily || ""}>
                    <SelectTrigger><SelectValue placeholder="Select font" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {fonts.map((f) => (
                        <SelectItem key={f.family} value={f.family}>
                          <span style={{ fontFamily: f.family }}>{f.family}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs mb-1">Weight</div>
                    <Select onValueChange={handleWeightChange} value={(activeTextbox.fontWeight as string) || "400"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Array.from(["100","200","300","400","500","600","700","800","900"]).map(w => (
                          <SelectItem key={w} value={w}>{w}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs mb-1">Size ({activeTextbox.fontSize})</div>
                    <Slider
                      value={[Number(activeTextbox.fontSize) || 36]}
                      min={8}
                      max={200}
                      step={1}
                      onValueChange={([v]) => updateActive({ fontSize: v as any })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs mb-1">Color</div>
                    <Input type="color" value={activeTextbox.fill as string} onChange={(e) => updateActive({ fill: e.target.value as any })} />
                  </div>
                  <div>
                    <div className="text-xs mb-1">Opacity ({Math.round((activeTextbox.opacity ?? 1) * 100)}%)</div>
                    <Slider
                      value={[Math.round((activeTextbox.opacity ?? 1) * 100)]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([v]) => updateActive({ opacity: v / 100 })}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="arrange" className="space-y-3 mt-3">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={bringForward}>Bring Forward</Button>
                  <Button variant="secondary" onClick={sendBackward}>Send Backward</Button>
                </div>
                <div>
                  <Button variant="destructive" onClick={deleteSelected}>Delete Layer</Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
        <Separator />
        <div className="text-xs text-muted-foreground">
          History: {index.current + 1} / {history.current.length}
        </div>
      </div>
      <div className="relative overflow-auto flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
        <div className="p-6">
          <canvas ref={canvasEl} className="border shadow-sm bg-white" />
        </div>
      </div>
    </div>
  );
}