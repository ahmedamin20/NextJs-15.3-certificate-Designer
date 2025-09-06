export type FieldType = 'text' | 'qr' | 'barcode' | 'image';

export type Field = {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  xPct: number;
  yPct: number;
  widthPct: number;
  align: 'left' | 'center' | 'right';
  fontSizePx: number;
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
};

export type LayoutWithData = {
  templateUrl: string;
  imgNatural: { w: number; h: number };
  fields: Field[];
  version: number;
};
