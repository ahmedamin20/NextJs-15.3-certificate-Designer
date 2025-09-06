"use client";
import React from "react";
import type { DesignerState, DesignerActions, Field } from "../types";
import Image from "next/image";

export function CertificateCanvas({ state, actions, refs }: { state: DesignerState; actions: DesignerActions; refs: { containerRef: React.MutableRefObject<HTMLDivElement | null>; imgRef: React.MutableRefObject<HTMLImageElement | null>; renderRef: React.MutableRefObject<HTMLDivElement | null>; imgClientRect: { x: number; y: number; w: number; h: number } | null; activeField: Field | null; } }) {
  const { containerRef, imgRef, renderRef } = refs;
  const { templateUrl, showGrid, isExporting, zoom, imgNatural, fields, activeId } = state;
  const { onImgLoad, startDrag, moveDrag, endDrag, startResize, moveResize, endResize, setActiveId, viewportPointerDown, viewportPointerMove, viewportPointerUp } = actions;
  const fieldStyle = (f: Field): React.CSSProperties => ({
    position: "absolute",
    left: `${f.xPct}%`,
    top: `${f.yPct}%`,
    width: `${f.widthPct}%`,
    transform: "translate(-50%, -50%)",
    fontSize: f.fontSizePx,
    fontWeight: f.bold ? 700 : 400,
    fontStyle: f.italic ? "italic" : "normal",
    textTransform: f.uppercase ? "uppercase" : "none",
    textAlign: f.align,
    pointerEvents: "auto",
    userSelect: "none",
    cursor: "grab",
    padding: 2,
    border: isExporting ? "0" : activeId === f.id ? "2px dashed #2563eb" : "1px dashed rgba(0,0,0,0.3)",
    background: isExporting ? "transparent" : "rgba(255,255,255,0.2)",
    borderRadius: 6,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  });

  const gridOverlay = showGrid && !isExporting && (
    <div
      className="absolute inset-0 pointer-events-none rounded"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px)," +
          "linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)",
        backgroundSize: `2% 2%`,
      }}
    />
  );

  return (
    <div className="col-span-9">
      <div
        ref={containerRef}
        className="bg-white rounded-2xl shadow p-4 overflow-auto h-[78vh]"
        onPointerDown={viewportPointerDown}
        onPointerMove={viewportPointerMove}
        onPointerUp={viewportPointerUp}
      >
        {!templateUrl ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p className="mb-3">Upload a certificate template (image or PDF) to begin</p>
          </div>
        ) : (
          <div className="inline-block" style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
            <div ref={renderRef} className="relative inline-block">
              <Image fill ref={imgRef} src={templateUrl} onLoad={onImgLoad} alt="Certificate Template" className="max-w-full h-auto select-none pointer-events-none rounded" />
              {gridOverlay}
              {imgNatural && fields.map((f) => (
                <div
                  key={f.id}
                  role="button"
                  onPointerDown={(e) => startDrag(e, f)}
                  onPointerMove={moveDrag}
                  onPointerUp={endDrag}
                  onClick={() => setActiveId(f.id)}
                  style={fieldStyle(f)}
                >
                  {f.type === "text" || f.type === "image" ? (
                    <span className="inline-block w-full">{f.label}</span>
                  ) : f.type === "barcode" ? (
                    <span className="inline-block w-full">{f.label} (Barcode)</span>
                  ) : f.type === "qr" ? (
                    <span className="inline-block w-full">{f.label} (QR)</span>
                  ) : null}

                  {!isExporting && (
                    <div
                      className="absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow cursor-ew-resize"
                      onPointerDown={(e) => startResize(e, f)}
                      onPointerMove={moveResize}
                      onPointerUp={endResize}
                      title="Drag to resize width"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
