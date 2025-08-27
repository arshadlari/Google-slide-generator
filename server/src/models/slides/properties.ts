import type { BorderStyle } from "./elements/ShapeElement.ts";

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  shearX: number;
  shearY: number;
  zIndex: number;
}

export interface Fill {
  color: string;
  transparency: number;
  themeColor?: string;
}

export interface Border {
  color: string;
  weight: number;
  style: BorderStyle;
}

export interface LineConnection {
  connectedObjectId: string;
  connectionSiteIndex: number;
}

export interface Link {
  url?: string;
  relativeSlideLink?: any;
}

export interface TextStyle {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  contentAlignment?: "TOP" | "MIDDLE" | "BOTTOM";
  link?: string; // Optional: URL for hyperlinks
  paragraphStyle?: ParagraphStyle;
}

export interface ParagraphStyle {
  alignment?: "START" | "CENTER" | "END" | "JUSTIFIED";
  lineSpacing?: number;
  indentStart?: { magnitude: number; unit: string };
  indentEnd?: { magnitude: number; unit: string };
  spaceAbove?: { magnitude: number; unit: string };
  spaceBelow?: { magnitude: number; unit: string };
}

  
export interface TableCell {
  rowIndex: number;
  columnIndex: number;
  rowSpan?: number;
  columnSpan?: number;
  textStyle?: TextStyle; // For cell text and styling
  backgroundFill?: Fill; // For cell background
  contentAlignment?: "TOP" | "MIDDLE" | "BOTTOM";
  border?: Border; // Optional, for advanced border handling
}

export interface TableColumn {
  width: number; // In EMU
}

// Converts HEX to normalized RGB for Google Slides API
export function hexToRgbNorm(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return { red: r, green: g, blue: b };
}

export const emuToPt = (emu: number) => emu / 12700;