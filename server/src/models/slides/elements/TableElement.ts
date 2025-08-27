import type { SlideElement } from "./SlideElement.ts";
import type { Position, TableCell, TableColumn } from "../properties.ts";
import { hexToRgbNorm } from "../properties.ts";

export class TableElement implements SlideElement {
  id: string;
  slideId: string;
  position: Position;
  rows: number;
  columns: number;
  cells: TableCell[];
  columnsProps: TableColumn[];
  elementType: string = "TABLE";

  constructor(params: {
    id: string;
    slideId: string;
    position: Position;
    rows: number;
    columns: number;
    cells?: TableCell[];
    columnsProps: TableColumn[];
  }) {
    this.id = params.id;
    this.slideId = params.slideId;
    this.position = params.position;
    this.rows = params.rows;
    this.columns = params.columns;
    this.cells = params.cells || [];
    this.columnsProps = params.columnsProps;
  }

  toBatchRequests(): any[] {
    const requests: any[] = [];

    // Create Table
    requests.push({
      createTable: {
        objectId: this.id,
        elementProperties: {
          pageObjectId: this.slideId,
          size: {
            width: { magnitude: this.position.width, unit: "EMU" },
            height: { magnitude: this.position.height, unit: "EMU" }
          },
          transform: {
            scaleX: this.position.scaleX ?? 1,
            scaleY: this.position.scaleY ?? 1,
            translateX: this.position.x,
            translateY: this.position.y,
            unit: "EMU"
          }
        },
        rows: this.rows,
        columns: this.columns
      }
    });

    // Optional: set column widths
    if (this.columnsProps) {
      this.columnsProps.forEach((col, i) => {
        if (col.width) {
          requests.push({
            updateTableColumnProperties: {
              objectId: this.id,
              columnIndices: [i],
              tableColumnProperties: {
                columnWidth: { magnitude: col.width, unit: "EMU" }
              },
              fields: "columnWidth"
            }
          });
        }
      });
    }

    // Cell text and styles
    this.cells.forEach(cell => {
      // Insert text
      if (cell.textStyle?.text) {
        requests.push({
          insertText: {
            objectId: this.id,
            cellLocation: {
              rowIndex: cell.rowIndex,
              columnIndex: cell.columnIndex
            },
            insertionIndex: 0,
            text: cell.textStyle.text
          }
        });
      }

      // Cell properties: background, alignment
      const props: any = {};

      if (cell.backgroundFill) {
        let fill = cell.backgroundFill;
        // Prefer themeColor if present, otherwise convert HEX to rgbColor
        props.tableCellBackgroundFill = {
          propertyState: "RENDERED",
          solidFill: fill.themeColor
            ? { color: { themeColor: fill.themeColor }, alpha: 1 - (fill.transparency ?? 0) }
            : { color: { rgbColor: hexToRgbNorm(fill.color) }, alpha: 1 - (fill.transparency ?? 0) }
        };
      }

      if (cell.contentAlignment) {
        props.contentAlignment = cell.contentAlignment;
      }

      // Update cell properties, if specified
      if (Object.keys(props).length > 0) {
        requests.push({
          updateTableCellProperties: {
            objectId: this.id,
            tableRange: {
              location: { rowIndex: cell.rowIndex, columnIndex: cell.columnIndex },
              rowSpan: cell.rowSpan ?? 1,
              columnSpan: cell.columnSpan ?? 1
            },
            tableCellProperties: props,
            fields: Object.keys(props).join(",")
          }
        });
      }

      // Text style (font, color, etc.)
      if (cell.textStyle && Object.keys(cell.textStyle).length > 1) {
        const { fontFamily, fontSize, color, bold, italic, underline, strikethrough, align, link } = cell.textStyle;
        const styleFields: string[] = [];

        const textStyle: any = {};
        if (fontFamily) { textStyle.fontFamily = fontFamily; styleFields.push("fontFamily"); }
        if (fontSize) { textStyle.fontSize = { magnitude: fontSize, unit: "PT" }; styleFields.push("fontSize"); }
        if (color) { textStyle.foregroundColor = { opaqueColor: { rgbColor: hexToRgbNorm(color) } }; styleFields.push("foregroundColor"); }
        if (bold !== undefined) { textStyle.bold = bold; styleFields.push("bold"); }
        if (italic !== undefined) { textStyle.italic = italic; styleFields.push("italic"); }
        if (underline !== undefined) { textStyle.underline = underline; styleFields.push("underline"); }
        if (strikethrough !== undefined) { textStyle.strikethrough = strikethrough; styleFields.push("strikethrough"); }
        if (align) { /* Set paragraphStyle align via updateParagraphStyle */ }
        if (link) { textStyle.link = { url: link }; styleFields.push("link"); }

        requests.push({
          updateTextStyle: {
            objectId: this.id,
            cellLocation: { rowIndex: cell.rowIndex, columnIndex: cell.columnIndex },
            style: textStyle,
            fields: styleFields.join(",")
          }
        });
      }
    });

    return requests;
  }
}
