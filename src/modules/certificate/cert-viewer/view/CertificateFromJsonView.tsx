'use client';
import React from 'react';
import DOMPurify from 'dompurify';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import { LayoutWithData } from '../types';

const safe = (html: string) => ({
  __html: DOMPurify?.sanitize(html, {
    ALLOWED_TAGS: ['b','i','u','em','strong','span','small','sup','sub','br','div'],
    ALLOWED_ATTR: ['style','dir'],
  }),
});

const isLikelyUrl = (v: string) => /^https?:\/\/|^data:image\//i.test(v);

export default function CertificateFromJsonView({ layout, hideTemplate }: { layout: LayoutWithData; hideTemplate?: boolean }) {
  return (
    <div className="relative block w-full h-full overflow-hidden">
      {layout.templateUrl && !hideTemplate ? (
        <img src={layout.templateUrl} className="template-image w-full h-auto" alt="Certificate" />
      ) : (
        <div className="w-full h-full bg-white" />
      )}

      {layout.fields.map((f) => {
        const style: React.CSSProperties = {
          position: 'absolute', left: `${f.xPct}%`, top: `${f.yPct}%`, width: `${f.widthPct}%`,
          transform: 'translate(-50%, -50%)', fontSize: f.fontSizePx, fontWeight: f.bold ? 700 : 400,
          fontStyle: f.italic ? 'italic' : 'normal', textAlign: f.align, textTransform: f.uppercase ? 'uppercase' : 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        };
        const v = f.label ?? '';
        if (f.type === 'text') {
          const isArabic = /[\u0600-\u06FF]/.test(v);
          return <div key={f.id} style={style} dir={isArabic ? 'rtl' : undefined} dangerouslySetInnerHTML={safe(String(v))} />;
        }
        if (f.type === 'image') {
          return (
            <div key={f.id} style={style}>
              {isLikelyUrl(v) ? (
                <img src={v} alt={f.key} style={{ maxWidth: '100%', height: 'auto' }} />
              ) : (
                <div dangerouslySetInnerHTML={safe(String(v))} />
              )}
            </div>
          );
        }
        if (f.type === 'qr') {
          return (
            <div key={f.id} style={style}>
              <QRCodeCanvas value={String(v)} style={{ width: '100%', height: '120px' }} />
            </div>
          );
        }
        if (f.type === 'barcode') {
          return (
            <div key={f.id} style={style}>
              <Barcode value={String(v)} displayValue={false} width={2} height={60} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
