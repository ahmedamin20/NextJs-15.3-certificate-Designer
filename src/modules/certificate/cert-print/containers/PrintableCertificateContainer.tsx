'use client';
import React from 'react';
import PrintableCertificate from '../view/PrintView';
import { PrintMode } from '../types';
import { LayoutWithData } from '../../cert-viewer/types';

export default function PrintableCertificateContainer({ layout, mode }: { layout: LayoutWithData; mode?: PrintMode }) {
  // Container: translate external config → UI props, inject telemetry, guards, etc.
  return <PrintableCertificate layout={layout} initialMode={mode ?? 'image'} />;
}