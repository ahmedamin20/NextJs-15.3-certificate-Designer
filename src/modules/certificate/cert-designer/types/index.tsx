export type FieldType = "text" | "qr" | "barcode" | "image";

export type Field = {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  xPct: number;
  yPct: number;
  widthPct: number;
  align: "left" | "center" | "right";
  fontSizePx: number;
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
};

export const DEFAULT_FIELDS: Omit<
  Field,
  "id" | "xPct" | "yPct" | "widthPct"
>[] = [
  {
    key: "fullName",
    label: "Recipient Name",
    type: "text",
    align: "center",
    fontSizePx: 36,
    bold: true,
    italic: false,
    uppercase: false,
  },
  {
    key: "course",
    label: "Course / Award",
    type: "text",
    align: "center",
    fontSizePx: 24,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "date",
    label: "Date",
    type: "text",
    align: "center",
    fontSizePx: 18,
    bold: false,
    italic: false,
    uppercase: false,
  },
];

export const REQUIRED_PRESETS: Omit<
  Field,
  "id" | "xPct" | "yPct" | "widthPct"
>[] = [
  {
    key: "vehicleImageUrl",
    label: "Vehicle Image",
    type: "image",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "licenseTypeAr",
    label: "license Type (Ar)",
    type: "text",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "licenseTypeEn",
    label: "license Type (En)",
    type: "text",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "clientPhone",
    label: "Client Phone",
    type: "text",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "RSTCSignature",
    label: "RSTC Signature",
    type: "image",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "personalPhoto",
    label: "Personal Photo",
    type: "image",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "nationalId",
    label: "National ID",
    type: "text",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "signature",
    label: "Signature",
    type: "image",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "date",
    label: "Date",
    type: "text",
    align: "left",
    fontSizePx: 18,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "validUntil",
    label: "Valid Until",
    type: "text",
    align: "left",
    fontSizePx: 18,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "codeGroup",
    label: "Code Group",
    type: "text",
    align: "left",
    fontSizePx: 18,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "traineeCode",
    label: "Trainee Code",
    type: "text",
    align: "left",
    fontSizePx: 18,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "ownerType",
    label: "Car Owner Type",
    type: "text",
    align: "left",
    fontSizePx: 18,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "nationalIdBarcode",
    label: "National ID (Barcode)",
    type: "barcode",
    align: "center",
    fontSizePx: 16,
    bold: false,
    italic: false,
    uppercase: false,
  },
  {
    key: "nameEN",
    label: "Name (EN)",
    type: "text",
    align: "left",
    fontSizePx: 22,
    bold: true,
    italic: false,
    uppercase: false,
  },
  {
    key: "nameAR",
    label: "Name (AR)",
    type: "text",
    align: "left",
    fontSizePx: 22,
    bold: true,
    italic: false,
    uppercase: false,
  },
];

export type DesignerState = {
  template: File | null;
  templateUrl: string | null;
  imgNatural: { w: number; h: number } | null;
  fields: Field[];
  activeId: string | null;
  isPanning: boolean;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSizePct: number;
  layoutName: string;
  savedId: string | null;
  isExporting: boolean;
};

export type DesignerActions = {
  setLayoutName: (s: string) => void;
  uploadImage: (file: File) => void;
  loadLayout: (dto: TCertificateLayoutResponse) => Promise<void> | void;
  uploadPdf: (file: File) => Promise<{ w: number; h: number }>;
  importLayoutFile: (file: File) => Promise<void>;
  exportLayoutJSON: () => void;
  saveToBackend: () => Promise<void>;
  exportPNG: () => Promise<void>;
  addPresetField: (
    preset: Omit<Field, "id" | "xPct" | "yPct" | "widthPct">
  ) => void;
  addCustomTextField: () => void;
  addQrField: () => void;
  removeActive: () => void;
  setActiveId: (id: string | null) => void;
  setField: (id: string, patch: Partial<Field>) => void;
  setShowGrid: (b: boolean) => void;
  setSnapToGrid: (b: boolean) => void;
  setGridSizePct: (n: number) => void;
  startDrag: (e: React.PointerEvent, field: Field) => void;
  moveDrag: (e: React.PointerEvent) => void;
  endDrag: () => void;
  startResize: (e: React.PointerEvent, field: Field) => void;
  moveResize: (e: React.PointerEvent) => void;
  endResize: () => void;
  viewportPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  viewportPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  viewportPointerUp: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  onImgLoad: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
};

export type DesignerContext = DesignerState & DesignerActions;

export type ImgNatural = { w: number; h: number };

export interface TCertificateLayoutResponse {
  templateUrl: string;
  imgNatural: ImgNatural;
  fields: Field[];
}
