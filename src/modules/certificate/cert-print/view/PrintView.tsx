'use client';
import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrintMode } from '../types';
import CertificateFromJsonView from '../../cert-viewer/view/CertificateFromJsonView';
import { LayoutWithData } from '../../cert-viewer/types';

export default function PrintableCertificate({ layout, initialMode = 'image' }: { layout: LayoutWithData; initialMode?: PrintMode }) {
  const [mode, setMode] = React.useState<PrintMode>(initialMode);
  const printRef = React.useRef<HTMLDivElement>(null);
  const aspect = layout?.imgNatural ? `${layout.imgNatural.w} / ${layout.imgNatural.h}` : '3508 / 2480';
  const pageStyle = React.useMemo(() => `
      @page { size: A4 landscape; margin: 0; }
      @media print {
        .print-root { width: 297mm; height: 210mm; position: relative; overflow: hidden;
                      -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        [data-print-mode="white"] .template-image { display: none !important; }
        [data-print-mode="image"] .template-image { display: block !important; }
        canvas, img, svg { image-rendering: -webkit-optimize-contrast; }
      }
    `, []);

  const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: `certificate-${Date.now()}`, pageStyle });

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium">Print mode</label>
        <select className="border rounded px-2 py-1" value={mode} onChange={(e) => setMode(e.target.value as PrintMode)}>
          <option value="image">With background image</option>
          <option value="white">White paper (no background)</option>
        </select>
        <button className="ml-auto bg-black text-white px-3 py-1.5 rounded" onClick={handlePrint}>Print</button>
      </div>
      <div ref={printRef} className="print-root bg-white shadow" data-print-mode={mode} style={{ aspectRatio: aspect }}>
        <CertificateFromJsonView layout={layout} hideTemplate={mode === 'white'} />
      </div>
    </div>
  );
}
