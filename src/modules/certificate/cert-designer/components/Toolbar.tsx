"use client";
import React from "react";
import { DesignerActions, DesignerState } from "../types";

export function Toolbar({ state, actions }: { state: DesignerState; actions: DesignerActions }) {
  const { templateUrl, imgNatural, layoutName, savedId, zoom } = state;
  const { setLayoutName, saveToBackend, exportLayoutJSON, exportPNG, zoomIn, zoomOut, zoomReset } = actions;
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <h1 className="text-xl font-semibold">Certificate Template Designer</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="ml-6 flex items-center gap-2 text-sm">
            <input placeholder="Layout name..." className="border rounded-md px-2 py-1 w-48" value={layoutName} onChange={(e) => setLayoutName(e.target.value)} />
            <button className="px-3 py-1.5 rounded-md border text-sm" onClick={saveToBackend} disabled={!templateUrl || !imgNatural}>Save to Backend</button>
            {savedId && (<span className="text-green-600">Saved ✓ ID: {savedId}</span>)}
          </div>
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={exportLayoutJSON} disabled={!state.fields.length}>Export Layout</button>
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={exportPNG} disabled={!templateUrl}>Export PNG</button>
          <div className="flex items-center gap-1 ml-2">
            <button className="px-2 py-1 rounded border" onClick={zoomOut}>-</button>
            <div className="px-2 text-sm w-16 text-center">{Math.round(zoom * 100)}%</div>
            <button className="px-2 py-1 rounded border" onClick={zoomIn}>+</button>
            <button className="px-2 py-1 rounded border" onClick={zoomReset}>Reset</button>
          </div>
        </div>
      </div>
    </header>
  );
}