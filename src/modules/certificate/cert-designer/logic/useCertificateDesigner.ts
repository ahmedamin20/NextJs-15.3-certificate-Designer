"use client";
import { changeLoading } from "@/config/constants/keys";
import { eventEmitter } from "@/utils/gloablLoading";
import { useParams } from "next/navigation";
import React, { useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { DesignerActions, DesignerState, Field, TCertificateLayoutResponse } from "../types";
import { exportElementToPNG } from "./helpers/export";
import { rasterizePdfFirstPage } from "./helpers/pdf";
import submitFields from "./submitFields";

const uid = () => Math.random().toString(36).slice(2, 10);

export function useCertificateDesigner(): [
  DesignerState,
  DesignerActions,
  {
    containerRef: React.MutableRefObject<HTMLDivElement | null>;
    imgRef: React.MutableRefObject<HTMLImageElement | null>;
    renderRef: React.MutableRefObject<HTMLDivElement | null>;
    imgClientRect: { x: number; y: number; w: number; h: number } | null;
    activeField: Field | null;
  }
] {
  const { id } = useParams();
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [template, setTemplate] = useState<File | null>(null);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(
    null
  );
  const [fields, setFields] = useState<Field[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSizePct, setGridSizePct] = useState(2);
  const [layoutName, setLayoutName] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const renderRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    startXPct: number;
    startYPct: number;
  } | null>(null);
  const panRef = useRef<{
    startX: number;
    startY: number;
    startScrollLeft: number;
    startScrollTop: number;
  } | null>(null);
  const resizeRef = useRef<{
    id: string;
    startX: number;
    startWidthPct: number;
  } | null>(null);

  const imgClientRect = useMemo(() => {
    const img = imgRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      w: rect.width,
      h: rect.height,
    };
  }, [templateUrl, zoom, imgNatural, fields.length]);



  const loadLayout = useCallback(async (dto: TCertificateLayoutResponse) => {
  if (!dto.imgNatural?.w || !dto.imgNatural?.h) {
    const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = reject;
      img.src = dto.templateUrl;
    });
    setImgNatural(dims);
  } else {
    setImgNatural(dto.imgNatural);
  }

  setTemplate(null);
  setTemplateUrl(dto.templateUrl); 
  setFields(dto.fields ?? []);
  setActiveId(null);
}, []);


  // Uploads
  const uploadImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setTemplate(file);

    setTemplateUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
    setFields([]);
    setActiveId(null);
  }, []);

  const uploadPdf = useCallback(
    async (file: File): Promise<{ w: number; h: number }> => {
      const { dataUrl, w, h } = await rasterizePdfFirstPage(file);
      setTemplateUrl((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return dataUrl;
      });
      setImgNatural({ w, h });
      setTemplate(file);
      setFields([]);
      setActiveId(null);
      return { w, h };
    },
    []
  );

  const onImgLoad: React.ReactEventHandler<HTMLImageElement> = async (e) => {
    const img = e.currentTarget;
    console.log(e.currentTarget, "naturalWidth a7a");
    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
  };

  // Fields
  const addPresetField = (
    preset: Omit<Field, "id" | "xPct" | "yPct" | "widthPct">
  ) => {
    if (!imgNatural) return;
    const f: Field = { id: uid(), xPct: 50, yPct: 50, widthPct: 40, ...preset };
    setFields((s) => [...s, f]);
    setActiveId(f.id);
  };
  const addCustomTextField = () =>
    addPresetField({
      key: "custom_" + uid(),
      label: "Custom Text",
      type: "text",
      align: "left",
      fontSizePx: 20,
      bold: false,
      italic: false,
      uppercase: false,
    });
  const addQrField = () =>
    addPresetField({
      key: "qrCode",
      label: "QR Code",
      type: "qr",
      align: "center",
      fontSizePx: 16,
      bold: false,
      italic: false,
      uppercase: false,
    });
  const removeActive = () => {
    if (!activeId) return;
    setFields((s) => s.filter((x) => x.id !== activeId));
    setActiveId(null);
  };
  const setField = (id: string, patch: Partial<Field>) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
    );

  // Grid & snap
  const snapPct = (val: number) => {
    if (!snapToGrid) return val;
    const step = Math.max(0.5, gridSizePct);
    return Math.round(val / step) * step;
  };

  // Drag
  const startDrag = (e: React.PointerEvent, field: Field) => {
    if (!imgClientRect) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setActiveId(field.id);
    dragRef.current = {
      id: field.id,
      startX: e.clientX,
      startY: e.clientY,
      startXPct: field.xPct,
      startYPct: field.yPct,
    };
  };
  const moveDrag = (e: React.PointerEvent) => {
    if (!dragRef.current || !imgClientRect || resizeRef.current) return;
    const { id, startX, startY, startXPct, startYPct } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let newX = startXPct + (dx / imgClientRect.w) * 100;
    let newY = startYPct + (dy / imgClientRect.h) * 100;
    newX = Math.max(0, Math.min(100, snapPct(newX)));
    newY = Math.max(0, Math.min(100, snapPct(newY)));
    setField(id, { xPct: newX, yPct: newY });
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  // Resize
  const startResize = (e: React.PointerEvent, field: Field) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    resizeRef.current = {
      id: field.id,
      startX: e.clientX,
      startWidthPct: field.widthPct,
    };
    setActiveId(field.id);
  };
  const moveResize = (e: React.PointerEvent) => {
    if (!resizeRef.current || !imgClientRect) return;
    const { id, startX, startWidthPct } = resizeRef.current;
    const dx = e.clientX - startX;
    let w = startWidthPct + (dx / imgClientRect.w) * 100;
    w = Math.max(1, Math.min(100, snapPct(w)));
    setField(id, { widthPct: w });
  };
  const endResize = () => {
    resizeRef.current = null;
  };

  // Pan/zoom
  const viewportPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      e.button === 1 ||
      (e.button === 0 && (e.ctrlKey || e.shiftKey || e.altKey))
    ) {
      const el = containerRef.current;
      if (!el) return;
      setIsPanning(true);
      el.setPointerCapture(e.pointerId);
      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startScrollLeft: el.scrollLeft,
        startScrollTop: el.scrollTop,
      };
    }
  };
  const viewportPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning || !panRef.current) return;
    const el = containerRef.current!;
    el.scrollLeft =
      panRef.current.startScrollLeft - (e.clientX - panRef.current.startX);
    el.scrollTop =
      panRef.current.startScrollTop - (e.clientY - panRef.current.startY);
  };
  const viewportPointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
      panRef.current = null;
    }
  };
  const zoomIn = () =>
    setZoom((z) => Math.min(3, parseFloat((z + 0.1).toFixed(2))));
  const zoomOut = () =>
    setZoom((z) => Math.max(0.3, parseFloat((z - 0.1).toFixed(2))));
  const zoomReset = () => setZoom(1);

  // Layout import/export
  const exportLayoutJSON = () => {
    const layoutJson = JSON.stringify(
      { templateUrl, imgNatural, fields, version: 2 },
      null,
      2
    );
    const blob = new Blob([layoutJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importLayoutFile = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.fields || !Array.isArray(data.fields))
      throw new Error("Invalid layout file");
    setTemplateUrl(data.templateUrl || null);
    setImgNatural(data.imgNatural || null);
    setFields(data.fields);
  };

  // Backend save
  const saveToBackend = async () => {
    if (!templateUrl || !imgNatural) {
      alert("Upload a template first.");
      return;
    }
    const payload = {
      name: layoutName || `layout_${uid()}`,
      templateUrl,
      imgNatural,
      fields,
      version: 2,
    };
    eventEmitter.emit(changeLoading, true);
    try {
      const res = await submitFields(
        {
          fields: payload.fields,
        },
        id?.toString() || ""
      );
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      throw error;
    }finally{
      eventEmitter.emit(changeLoading, false);
    }
  };

  // Export PNG
  const exportPNG = async () => {
    if (!renderRef.current) return;
    setIsExporting(true);
    await new Promise((r) => requestAnimationFrame(r));
    const dataUrl = await exportElementToPNG(renderRef.current);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "certificate.png";
    a.click();
    setIsExporting(false);
  };

  const activeField = fields.find((f) => f.id === activeId) || null;

  const state: DesignerState = {
    template,
    templateUrl,
    imgNatural,
    fields,
    activeId,
    isPanning,
    zoom,
    showGrid,
    snapToGrid,
    gridSizePct,
    layoutName,
    savedId,
    isExporting,
  };
  const actions: DesignerActions = {
    setLayoutName,
    uploadImage,
    uploadPdf,
    importLayoutFile,
    exportLayoutJSON,
    loadLayout,
    saveToBackend,
    exportPNG,
    addPresetField,
    addCustomTextField,
    addQrField,
    removeActive,
    setActiveId,
    setField,
    setShowGrid,
    setSnapToGrid,
    setGridSizePct,
    startDrag,
    moveDrag,
    endDrag,
    startResize,
    moveResize,
    endResize,
    viewportPointerDown,
    viewportPointerMove,
    viewportPointerUp,
    zoomIn,
    zoomOut,
    zoomReset,
    onImgLoad,
  };

  return [
    state,
    actions,
    { containerRef, imgRef, renderRef, imgClientRect, activeField },
  ];
}
