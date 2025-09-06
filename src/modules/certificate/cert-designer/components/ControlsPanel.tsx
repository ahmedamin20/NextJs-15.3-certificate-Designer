"use client";
import React from "react";
import { DesignerActions, DesignerState, Field, FieldType, REQUIRED_PRESETS } from "../types";

export function ControlsPanel({ state, actions }: { state: DesignerState; actions: DesignerActions }) {
  const { showGrid, snapToGrid, gridSizePct, activeId, fields } = state;
  const { setShowGrid, setSnapToGrid, setGridSizePct, addPresetField, addCustomTextField, addQrField, setField, removeActive, importLayoutFile } = actions;
  const activeField: Field | undefined = fields.find((f) => f.id === activeId);

  const handleFileInput: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.type !== "application/json") return;
    await importLayoutFile(file);
  };

  return (
    <div className="col-span-3">
      <div className="bg-white rounded-2xl shadow p-4 space-y-4">
        <div>
          <h2 className="font-medium mb-2">Add Fields</h2>
          <div className="flex flex-wrap gap-2">
            {REQUIRED_PRESETS.map((preset) => (
              <button key={preset.key} onClick={() => addPresetField(preset)} className="px-3 py-1.5 rounded-md border text-sm">
                {preset.label}
              </button>
            ))}
            <button onClick={addCustomTextField} className="px-3 py-1.5 rounded-md border text-sm">Custom Text</button>
            <button onClick={addQrField} className="px-3 py-1.5 rounded-md border text-sm">QR Code</button>
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-2">Canvas/Grid</h2>
          <div className="flex items-center gap-2 text-sm mb-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Show grid</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} /> Snap</label>
          </div>
          <div className="grid grid-cols-3 items-center gap-2 text-sm">
            <label className="text-gray-600">Grid %</label>
            <input type="number" className="col-span-2 border rounded-md px-2 py-1" value={gridSizePct} min={0.5} step={0.5} onChange={(e) => setGridSizePct(Math.max(0.5, Number(e.target.value || 0)))} />
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-2">Selected Field</h2>
          {activeField ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Label</label>
                <input className="col-span-2 border rounded-md px-2 py-1" value={activeField.label} onChange={(e) => setField(activeField.id, { label: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Key</label>
                <input className="col-span-2 border rounded-md px-2 py-1" value={activeField.key} onChange={(e) => setField(activeField.id, { key: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Type</label>
                <select className="col-span-2 border rounded-md px-2 py-1" value={activeField.type} onChange={(e) => setField(activeField.id, { type: e.target.value as FieldType })}>
                  <option value="text">Text</option>
                  <option value="qr">QR</option>
                  <option value="barcode">Barcode</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Align</label>
                <select className="col-span-2 border rounded-md px-2 py-1" value={activeField.align} onChange={(e) => setField(activeField.id, { align: e.target.value as Field["align"] })}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Font Size</label>
                <input type="number" className="col-span-2 border rounded-md px-2 py-1" value={activeField.fontSizePx} onChange={(e) => setField(activeField.id, { fontSizePx: Number(e.target.value || 0) })} />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Width %</label>
                <input type="number" className="col-span-2 border rounded-md px-2 py-1" value={activeField.widthPct} onChange={(e) => setField(activeField.id, { widthPct: Math.max(1, Math.min(100, Number(e.target.value || 0))) })} />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Uppercase</label>
                <input type="checkbox" className="h-4 w-4" checked={activeField.uppercase} onChange={(e) => setField(activeField.id, { uppercase: e.target.checked })} />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Bold</label>
                <input type="checkbox" className="h-4 w-4" checked={activeField.bold} onChange={(e) => setField(activeField.id, { bold: e.target.checked })} />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="text-gray-600">Italic</label>
                <input type="checkbox" className="h-4 w-4" checked={activeField.italic} onChange={(e) => setField(activeField.id, { italic: e.target.checked })} />
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button onClick={removeActive} className="px-3 py-1.5 rounded-md border text-sm text-red-600">Delete</button>
              </div>
              <div className="text-xs text-gray-500">
                Tips: Drag to move. Use the round handle to resize width. Hold <kbd className="px-1 rounded border">Ctrl</kbd>/<kbd className="px-1 rounded border">Shift</kbd> (or middle-click) to pan.
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Select a field to edit its properties.</div>
          )}
        </div>

        <div>
          <h2 className="font-medium mb-2">Import Layout</h2>
          <label className="px-3 py-1.5 rounded-md border bg-white cursor-pointer text-sm inline-block">
            Import Layout JSON
            <input type="file" accept="application/json" onChange={handleFileInput} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
