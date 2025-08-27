import type { SlideElement } from "./SlideElement.ts";
import type { Position, TextStyle, Fill, Border } from "../properties.ts";
import { hexToRgbNorm } from "../properties.ts";

export class ShapeElement implements SlideElement {
  id: string;
  slideId: string;
  type: SlidesShapeType;
  position: Position;
  fill?: Fill;
  border?: Border;
  textStyle?: TextStyle;
  elementType: string = "SHAPE";

  constructor(params: {
    id: string;
    slideId: string;
    type: SlidesShapeType;
    position: Position;
    fill?: Fill;
    border?: Border;
    textStyle?: TextStyle;
  }) {
    this.id = params.id;
    this.slideId = params.slideId;
    this.type = params.type;
    this.position = params.position;
    if (params.fill !== undefined) this.fill = params.fill;
    if (params.border !== undefined) this.border = params.border;
    if (params.textStyle !== undefined) this.textStyle = params.textStyle;
  }

  toBatchRequests(): any[] {
    const requests = [];

    // 1. Create shape
    requests.push({
      createShape: {
        objectId: this.id,
        shapeType: this.type === "CIRCLE" ? "ELLIPSE" : this.type,
        elementProperties: {
          pageObjectId: this.slideId,
          size: {
            height: { magnitude: this.position.height, unit: "EMU" },
            width: { magnitude: this.position.width, unit: "EMU" }
          },
          transform: {
            scaleX: this.position.scaleX,
            scaleY: this.position.scaleY,
            translateX: this.position.x,
            translateY: this.position.y,
            shearX: this.position.shearX,
            shearY: this.position.shearY,
            unit: "EMU"
          }
        }
      }
    });

    // 2. Insert text if present
    if (this.textStyle?.text) {
      requests.push({
        insertText: {
          objectId: this.id,
          insertionIndex: 0,
          text: this.textStyle.text
        }
      });
    }

    // 3. Update text style
    if (this.textStyle) {
      const style: any = {};
      const fields: string[] = [];

      if (this.textStyle.fontFamily) {
        style.fontFamily = this.textStyle.fontFamily;
        fields.push("fontFamily");
      }
      if (this.textStyle.fontSize) {
        style.fontSize = { magnitude: this.textStyle.fontSize, unit: "PT" };
        fields.push("fontSize");
      }
      if (this.textStyle.color) {
        style.foregroundColor = { opaqueColor: { rgbColor: hexToRgbNorm(this.textStyle.color) } };
        fields.push("foregroundColor");
      }
      if (this.textStyle.bold !== undefined) {
        style.bold = this.textStyle.bold;
        fields.push("bold");
      }
      if (this.textStyle.italic !== undefined) {
        style.italic = this.textStyle.italic;
        fields.push("italic");
      }
      if (this.textStyle.underline !== undefined) {
        style.underline = this.textStyle.underline;
        fields.push("underline");
      }
      if (this.textStyle.strikethrough !== undefined) {
        style.strikethrough = this.textStyle.strikethrough;
        fields.push("strikethrough");
      }
      if (this.textStyle.link) {
        style.link = { url: this.textStyle.link };
        fields.push("link");
      }

      if (fields.length > 0) {
        requests.push({
          updateTextStyle: {
            objectId: this.id,
            textRange: { type: "ALL" },
            style,
            fields: fields.join(",")
          }
        });
      }

      // 4. Update paragraph style, if defined inside textStyle
      const pStyle = this.textStyle.paragraphStyle;
      if (pStyle) {
        const pStyleReq: any = {};
        const pFields: string[] = [];

        if (pStyle.alignment) {
          pStyleReq.alignment = pStyle.alignment;
          pFields.push("alignment");
        }
        if (typeof pStyle.lineSpacing === "number") {
          pStyleReq.lineSpacing = pStyle.lineSpacing;
          pFields.push("lineSpacing");
        }
        if (pStyle.indentStart) {
          pStyleReq.indentStart = pStyle.indentStart;
          pFields.push("indentStart");
        }
        if (pStyle.indentEnd) {
          pStyleReq.indentEnd = pStyle.indentEnd;
          pFields.push("indentEnd");
        }
        if (pStyle.spaceAbove) {
          pStyleReq.spaceAbove = pStyle.spaceAbove;
          pFields.push("spaceAbove");
        }
        if (pStyle.spaceBelow) {
          pStyleReq.spaceBelow = pStyle.spaceBelow;
          pFields.push("spaceBelow");
        }

        if (pFields.length > 0) {
          requests.push({
            updateParagraphStyle: {
              objectId: this.id,
              textRange: { type: "ALL" },
              style: pStyleReq,
              fields: pFields.join(",")
            }
          });
        }
      }
    }

    // 5. Update shape fill and border
    const shapeProperties: any = {};
    const shapeFields: string[] = [];

    if (this.fill) {
      shapeProperties.shapeBackgroundFill = {
        solidFill: {
          color: hexToRgbNorm(this.fill.color)
            ? { rgbColor: hexToRgbNorm(this.fill.color) }
            : undefined,
          alpha: 1 - (this.fill.transparency ?? 0)
        }
      };
      shapeFields.push("shapeBackgroundFill");
    }

    if (this.textStyle?.contentAlignment) {
      shapeProperties.contentAlignment = this.textStyle.contentAlignment;
      shapeFields.push("contentAlignment");
    }

    if (this.border) {
      shapeProperties.outline = {
        outlineFill: {
          solidFill: {
            color: hexToRgbNorm(this.border.color)
              ? { rgbColor: hexToRgbNorm(this.border.color) }
              : undefined
          }
        },
        weight: { magnitude: this.border.weight ?? 1, unit: "PT" }, // default 1pt if not set
        dashStyle: this.border.style
      };
      shapeFields.push("outline");
    }

    if (shapeFields.length > 0) {
      requests.push({
        updateShapeProperties: {
          objectId: this.id,
          shapeProperties,
          fields: shapeFields.join(",")
        }
      });
    }

    return requests;
  }
}

// Supporting types and enums
export type SlidesShapeType =
  | "RECTANGLE"
  | "ROUND_RECTANGLE"
  | "ELLIPSE"
  | "CIRCLE"
  | "DIAMOND"
  | "STAR_5"
  | "TRAPEZOID"
  | "PARALLELAGRAM"
  | "POLYGON"
  | "ARC"
  | "TEXT_BOX"
  | "CUSTOM";

export type BorderStyle =
  | "SOLID"
  | "DASH"
  | "DOT"
  | "DASH_DOT"
  | "LONG_DASH"
  | "LONG_DASH_DOT";
