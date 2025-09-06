# 🏆 Certificate Designer (Next.js)

A customizable **Certificate Designer** built with **Next.js + React**.  
It allows uploading templates (PDF or image), placing dynamic fields (text, QR, barcode, images), and exporting certificate layouts with data.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── certificate-designer/                   # Interactive editor for creating modules
│   │   ├── CertificateDesignerContainer.tsx    # Main container with designer state
│   │   ├── components/
│   │   │   ├── Toolbar.tsx                     # Top actions (import/export, zoom, etc.)
│   │   │   ├── ControlsPanel.tsx               # Right sidebar for editing field properties
│   │   │   ├── CertificateCanvas.tsx           # Main canvas rendering template + fields
│   │   └── logic/
│   │       ├── useCertificateDesigner.ts       # Custom hook for state management
│   │       ├── submitImgUpload.ts              # Handles image uploads
│   │       ├── onUploadPdf.ts                  # Converts PDF → rasterized image
│   │   └── types.ts                            # Shared types (field, layout, etc.)
│   │
│   ├── cert-viewer/                            # Renders a certificate with given layout & data
│   │   └── CertificateViewer.tsx
│   │
│   ├── cert-print/                             # Printable / exportable certificate view
│   │   └── CertificatePrint.tsx
│   │
│   └── utils/
│       ├── getImageDims.ts                     # Reads natural image dimensions
│       ├── globalLoading.ts                    # Global loading event emitter
│       └── constants/
│           └── keys.ts                         # Shared constants
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
# or install packages One by One
npm install dompurify
npm install react-to-print
npm install html2canvas
npm install pdfjs-dist
npm install qrcode.react
npm install react-barcode
npm install react-hot-toast
```

### 2. Run dev server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## ✨ Features

- 📄 **Upload certificate templates** (PNG, JPG, PDF → rasterized).
- 🖊 **Add fields**: text, QR codes, barcodes, images.
- 🎨 **Customize styles**: font, alignment, bold/italic, uppercase.
- 📐 **Drag & position** fields with percentage-based coordinates.
- 📤 **Import / export** layouts as JSON for reuse.
- 🔍 **Preview & scaling** with natural image dimensions.

---

## 📦 Usage

### Rendering the Designer

```tsx
import CertificateDesignerContainer from "@/app/certificate-designer/CertificateDesignerContainer";

export default function Page() {
  return <CertificateDesignerContainer id="demo" />;
}
```

### Loading a Layout

```tsx
<CertificateDesignerContainer id="template-123" defaultData={fetchedLayout} />
```

### Example Layout JSON

```json
{
  "templateUrl": "/uploads/cert-bg.png",
  "imgNatural": { "w": 2480, "h": 3508 },
  "fields": [
    {
      "id": "1",
      "key": "studentName",
      "label": "Student Name",
      "type": "text",
      "xPct": 50,
      "yPct": 40,
      "widthPct": 30,
      "align": "center",
      "fontSizePx": 32,
      "bold": true,
      "italic": false,
      "uppercase": true
    }
  ],
  "version": 1
}
```

### Viewing a Certificate

```tsx
import CertificateViewer from "@/app/cert-viewer/CertificateViewer";

<CertificateViewer layout={layoutData} data={userData} />;
```

### Printing a Certificate

```tsx
import CertificatePrint from "@/app/cert-print/CertificatePrint";

<CertificatePrint layout={layoutData} data={userData} />;
```

---

## 🛠 Development Notes

- **State hook**: `useCertificateDesigner` manages the layout, refs, and actions.
- **Uploads**: `submitImgUpload` handles image uploads; `onUploadPdf` rasterizes PDFs.
- **Sanitization**: Text fields use `DOMPurify` to prevent XSS in rendered HTML.
- **Barcodes / QR**: Rendered with `react-barcode` and `qrcode.react`.
- **Screenshots**: `html2canvas` can be used for capturing the certificate view.

---

## 📜 License

MIT — feel free to use and adapt.

👨‍💻 Developed with ❤️ by **ahmedamin20**