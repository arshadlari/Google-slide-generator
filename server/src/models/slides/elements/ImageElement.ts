import type {SlideElement } from "./SlideElement.ts";
import type { Position } from "../properties.ts";
import { hexToRgbNorm } from "../properties.ts";

export class ImageElement implements SlideElement {

    id: string;
    slideId: string;
    position: Position;
    imageUrl: string;
    elementType: string = "IMAGE";  
    imageProperties: {
      transparency?: number;
      cropProperties?: {
        leftOffset?: number;
        topOffset?: number;
        rightOffset?: number;
        bottomOffset?: number;
      };
      outline?: {
        // Provide either color (hex) or themeColor
        color?: string;
        themeColor?: string;
        alpha?: number;
        weight?: number; // PT
        dashStyle?: "SOLID" | "DOT" | "DASH" | "DASH_DOT" | "LONG_DASH" | "LONG_DASH_DOT";
        propertyState?: "RENDERED" | "NOT_RENDERED";
      };
      shadow?: {
        type?: string;
        alignment?: string;
        alpha?: number;
        blurRadiusPt?: number; // PT
        rotateWithShape?: boolean;
        propertyState?: "RENDERED" | "NOT_RENDERED";
      };
    };
    imageUrlOverride?: string | null;
  
    constructor(params: {
      id: string;
      slideId: string;
      position: Position;
      imageUrl: string;
      imageProperties: ImageElement["imageProperties"];
      imageUrlOverride?: string | null;
    }) {
      this.id = params.id;
      this.slideId = params.slideId;
      this.position = params.position;
      this.imageUrl = params.imageUrl;
      this.imageProperties = params.imageProperties;
      this.imageUrlOverride = params.imageUrlOverride;
    }
  
    toBatchRequests(): any[] {
      const requests: any[] = [{
        createImage: {
          objectId: this.id,
          url: this.imageUrl,
          elementProperties: {
            pageObjectId: this.slideId,
            size: {
              height: { magnitude: this.position.height, unit: "EMU" },
              width: { magnitude: this.position.width, unit: "EMU" }
            },
            transform: {
              scaleX: this.position.scaleX ?? 1,
              scaleY: this.position.scaleY ?? 1,
              translateX: this.position.x,
              translateY: this.position.y,
              unit: "EMU"
            }
          }
        }
      },
    ];

      if (this.imageProperties) {
        const imageProps: any = {};
        const fields: string[] = [];

        if (this.imageProperties.cropProperties) {
          imageProps.cropProperties = {};
          const cp = this.imageProperties.cropProperties;
          if (cp.leftOffset !== undefined) imageProps.cropProperties.leftOffset = cp.leftOffset, fields.push("cropProperties.leftOffset");
          if (cp.topOffset !== undefined) imageProps.cropProperties.topOffset = cp.topOffset, fields.push("cropProperties.topOffset");
          if (cp.rightOffset !== undefined) imageProps.cropProperties.rightOffset = cp.rightOffset, fields.push("cropProperties.rightOffset");
          if (cp.bottomOffset !== undefined) imageProps.cropProperties.bottomOffset = cp.bottomOffset, fields.push("cropProperties.bottomOffset");
        }

        if (this.imageProperties.transparency !== undefined) {
          imageProps.transparency = this.imageProperties.transparency;
          fields.push("transparency");
        }

        if (this.imageProperties.outline) {
          const ol = this.imageProperties.outline;
          const outline: any = { propertyState: ol.propertyState ?? "RENDERED" };
          outline.outlineFill = { solidFill: { } };
          if (ol.themeColor) {
            outline.outlineFill.solidFill.color = { themeColor: ol.themeColor };
          } else if (ol.color) {
            outline.outlineFill.solidFill.color = { rgbColor: hexToRgbNorm(ol.color) };
          }
          if (ol.alpha !== undefined) outline.outlineFill.solidFill.alpha = ol.alpha;
          if (ol.weight !== undefined) outline.weight = { magnitude: ol.weight, unit: "PT" };
          if (ol.dashStyle) outline.dashStyle = ol.dashStyle;
          imageProps.outline = outline;
          fields.push("outline");
        }

        if (this.imageProperties.shadow) {
          const sh = this.imageProperties.shadow;
          const shadow: any = { propertyState: sh.propertyState ?? "RENDERED" };
          if (sh.type) shadow.type = sh.type;
          if (sh.alignment) shadow.alignment = sh.alignment;
          if (sh.alpha !== undefined) shadow.alpha = sh.alpha;
          if (sh.blurRadiusPt !== undefined) {
            shadow.blurRadius = { magnitude: sh.blurRadiusPt, unit: "PT" };
          }
          if (sh.rotateWithShape !== undefined) shadow.rotateWithShape = sh.rotateWithShape;
          imageProps.shadow = shadow;
          fields.push("shadow");
        }

        if (fields.length > 0) {
          requests.push({
            updateImageProperties: {
              objectId: this.id,
              imageProperties: imageProps,
              fields: fields.join(",")
            }
          });
        }
      }

      // if imageUrlOverride is provided, replace the image with the new url
      if (this.imageUrlOverride) {
        requests.push({
          replaceImage: {
            imageObjectId: this.id,
            url: this.imageUrlOverride,
            imageReplaceMethod: "CENTER_CROP"
          }
        });
      }

      return requests;
    }
  }