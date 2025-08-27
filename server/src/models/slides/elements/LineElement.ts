import type { SlideElement } from "./SlideElement.ts";
import type { Position, Fill, LineConnection, Link } from "../properties.ts";
import { hexToRgbNorm } from "../properties.ts";

export class LineElement implements SlideElement {
    id: string;
    slideId: string;
    position: Position;
    lineCategory: LineCategory;
    lineType?: LineType; // deprecated
    lineFill: Fill;
    weight?: number;
    dashStyle?: DashStyle;
    startArrow?: ArrowStyle;
    endArrow?: ArrowStyle;
    startConnection?: LineConnection;
    endConnection?: LineConnection;
    link?: Link;
    elementType: string = "LINE";

    constructor(params: {
        id: string;
        slideId: string;
        position: Position;
        lineCategory: LineCategory;
        lineType?: LineType;
        lineFill: Fill;
        weight?: number;
        dashStyle?: DashStyle;
        startArrow?: ArrowStyle;
        endArrow?: ArrowStyle;
        startConnection?: LineConnection;
        endConnection?: LineConnection;
        link?: Link;
    }) {
        Object.assign(this, params);
    }

    toBatchRequests(): any[] {
        const requests: any[] = [];

        // 1. Create Line
        const createLineReq: any = {
            objectId: this.id,
            elementProperties: {
                pageObjectId: this.slideId,
                size: {
                    width: { magnitude: this.position.width, unit: "EMU" },
                    height: { magnitude: this.position.height, unit: "EMU" }
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
            },
            lineCategory: this.lineCategory
        };
        if (this.lineType) {
            createLineReq.lineType = this.lineType;
        }
        requests.push({ createLine: createLineReq });

        // 2. Update Line Properties
        const lineProperties: any = {};

        // Proper solidFill mapping
        if (this.lineFill) {
            const solidFill: any = {};
            if (this.lineFill.themeColor) {
                solidFill.color = { themeColor: this.lineFill.themeColor };
            } else if (this.lineFill.color) {
                // this.lineFill.color must be HEX string - convert to normalized RGB
                solidFill.color = { rgbColor: hexToRgbNorm(this.lineFill.color) };
            }
            // API expects alpha as opacity: 1 (opaque) to 0 (transparent)
            const transparency = this.lineFill.transparency ?? 0;
            solidFill.alpha = 1 - transparency;
            lineProperties.lineFill = { solidFill };
        }

        // Other properties
        if (this.weight !== undefined) {
            lineProperties.weight = { magnitude: this.weight, unit: "EMU" };
        }
        if (this.dashStyle) lineProperties.dashStyle = this.dashStyle;
        if (this.startArrow) lineProperties.startArrow = this.startArrow;
        if (this.endArrow) lineProperties.endArrow = this.endArrow;
        if (this.link) lineProperties.link = this.link;
        if (this.startConnection) lineProperties.startConnection = this.startConnection;
        if (this.endConnection) lineProperties.endConnection = this.endConnection;

        if (Object.keys(lineProperties).length > 0) {
            requests.push({
                updateLineProperties: {
                    objectId: this.id,
                    lineProperties,
                    fields: Object.keys(lineProperties).join(',')
                }
            });
        }

        // Optionally add updateLineCategory for category changes after creation
        if (this.lineType && this.lineCategory) {
            requests.push({
                updateLineCategory: {
                    objectId: this.id,
                    lineCategory: this.lineCategory
                }
            });
        }

        return requests;
    }
}


export type LineCategory = 'STRAIGHT' | 'BENT' | 'CURVED';
export type DashStyle =
    | 'DASH_STYLE_UNSPECIFIED'
    | 'SOLID'
    | 'DOT'
    | 'DASH'
    | 'DASH_DOT'
    | 'LONG_DASH'
    | 'LONG_DASH_DOT';
export type ArrowStyle =
    | 'ARROW_STYLE_UNSPECIFIED'
    | 'NONE'
    | 'STEALTH_ARROW'
    | 'FILL_ARROW'
    | 'FILL_CIRCLE'
    | 'FILL_SQUARE'
    | 'FILL_DIAMOND'
    | 'OPEN_ARROW'
    | 'OPEN_CIRCLE'
    | 'OPEN_SQUARE'
    | 'OPEN_DIAMOND';
// deprecated
export type LineType =
    | 'TYPE_UNSPECIFIED'
    | 'STRAIGHT_CONNECTOR_1'
    | 'BENT_CONNECTOR_2'
    | 'BENT_CONNECTOR_3'
    | 'BENT_CONNECTOR_4'
    | 'BENT_CONNECTOR_5'
    | 'CURVED_CONNECTOR_2'
    | 'CURVED_CONNECTOR_3'
    | 'CURVED_CONNECTOR_4'
    | 'CURVED_CONNECTOR_5'
    | 'STRAIGHT_LINE';
