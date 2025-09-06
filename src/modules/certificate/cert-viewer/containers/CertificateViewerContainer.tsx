'use client';
import React from 'react';
import { LayoutWithData } from '../types';
import CertificateFromJsonView from '../view/CertificateFromJsonView';

export default function CertificateViewerContainer({ layout, hideTemplate }: { layout: LayoutWithData; hideTemplate?: boolean }) {
  // Container could add feature flags, A/B, error boundaries, fallbacks, etc.
  return <CertificateFromJsonView layout={layout} hideTemplate={hideTemplate} />;
}
