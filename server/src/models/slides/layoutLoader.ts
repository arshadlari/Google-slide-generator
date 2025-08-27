import { Slide } from "./Slide.ts";
import { ShapeElement } from "./elements/ShapeElement.ts";
import { LineElement } from "./elements/LineElement.ts";
import { ImageElement } from "./elements/ImageElement.ts";
import { TableElement } from "./elements/TableElement.ts";
import { VideoElement } from "./elements/VideoElement.ts";
import type { SlideElement } from "./elements/SlideElement.ts";
import type { Position, Fill, Border, TextStyle, TableCell, TableColumn } from "./properties.ts";
import { PageProperties } from "./PageProperties.ts";  


function generateUniqueId(prefix: string): string {
    const rand = Math.random().toString(36).slice(2, 8);
    return `${prefix}_${Date.now()}_${rand}`;
}
  
export function createUniqueSlideFromLayoutData(
  
    layoutData: { id: string; elements: any[] },
    options?: { 
      slideIdPrefix?: string; 
      elementPrefix?: string; 
      slideIdOverride?: string;
      inputs?: Record<string, string>;
    }
  ): Slide {
    const slidePrefix = options?.slideIdPrefix ?? (layoutData.id || "slide");
    const elementPrefix = options?.elementPrefix ?? "el";
  
    const newSlideId = options?.slideIdOverride ?? generateUniqueId(slidePrefix);
  
    // First pass: allocate new ids for every element
    const idMap = new Map<string, string>();
    for (const el of layoutData.elements) {
      const newId = generateUniqueId(`${elementPrefix}_${el.type || "el"}`);
      idMap.set(el.id, newId);
    }

    let pageProperties: PageProperties | null = null;
    if (layoutData.pageProperties) {
      pageProperties = new PageProperties({
        slideId: newSlideId,
        backgroundColor: layoutData.pageProperties.backgroundColor,
        colorScheme: layoutData.pageProperties.colorScheme,
      });
    }
  
    // Second pass: build elements with remapp ed ids and slideId
    const elements: SlideElement[] = [];
    for (const el of layoutData.elements) {
      const newElementId = idMap.get(el.id)!;
  
      if (el.elementType === "SHAPE") {
        const shapeParams: any = {
          id: newElementId,
          slideId: newSlideId,
          type: el.type as any,
          position: el.position,
        };
        if (el.fill !== undefined) shapeParams.fill = el.fill;
        if (el.border !== undefined) shapeParams.border = el.border;
        if (el.textStyle !== undefined) {
          // Apply text overrides from inputs map if provided and this is a TEXT_BOX
          if (el.type === "TEXT_BOX" && options?.inputs) {
            const overrideText = options.inputs[el.id];
            if (overrideText !== undefined) {
              shapeParams.textStyle = { ...(el.textStyle || {}), text: String(overrideText) };
            } else {
              shapeParams.textStyle = el.textStyle;
            }
          } else {
            shapeParams.textStyle = el.textStyle;
          }
        } else if (el.type === "TEXT_BOX" && options?.inputs && options.inputs[el.id] !== undefined) {
          shapeParams.textStyle = { text: String(options.inputs[el.id]) };
        }
        elements.push(new ShapeElement(shapeParams));
      } else if (el.elementType === "LINE") {
        const startConnection = (el as any).startConnection
          ? {
              connectedObjectId:
                idMap.get((el as any).startConnection.connectedObjectId) ||
                (el as any).startConnection.connectedObjectId,
              connectionSiteIndex: (el as any).startConnection.connectionSiteIndex,
            }
          : undefined;
        const endConnection = (el as any).endConnection
          ? {
              connectedObjectId:
                idMap.get((el as any).endConnection.connectedObjectId) ||
                (el as any).endConnection.connectedObjectId,
              connectionSiteIndex: (el as any).endConnection.connectionSiteIndex,
            }
          : undefined;
  
        const lineParams: any = {
          id: newElementId,
          slideId: newSlideId,
          position: el.position,
          lineCategory: (el as any).lineCategory || "STRAIGHT",
          lineFill: (el as any).lineFill as Fill,
        };
        if ((el as any).weight !== undefined) lineParams.weight = (el as any).weight;
        if ((el as any).dashStyle !== undefined) lineParams.dashStyle = (el as any).dashStyle;
        if ((el as any).startArrow !== undefined) lineParams.startArrow = (el as any).startArrow;
        if ((el as any).endArrow !== undefined) lineParams.endArrow = (el as any).endArrow;
        if (startConnection !== undefined) lineParams.startConnection = startConnection;
        if (endConnection !== undefined) lineParams.endConnection = endConnection;
        elements.push(new LineElement(lineParams));
      } else if (el.elementType === "IMAGE") {
        let imageUrlOverride: string | null = options?.inputs?.[el.id] ?? null;  
        elements.push(
          new ImageElement({
            id: newElementId, 
            slideId: newSlideId,
            position: el.position,
            // add image from inputs if provided
            imageUrl: (el as any).imageUrl,
            imageProperties: (el as any).imageProperties,
            imageUrlOverride: imageUrlOverride
          })
        );
      } else if (el.elementType === "VIDEO") {
        if (!(el as any).videoUrl) continue;
        elements.push(
          new VideoElement({
            id: newElementId,
            slideId: newSlideId,
            position: el.position,
            videoUrl: (el as any).videoUrl,
          })
        );
      } else if (el.elementType === "TABLE") {
        elements.push(
          new TableElement({
            id: newElementId,
            slideId: newSlideId,
            position: el.position,
            rows: (el as any).rows ?? 0,
            columns: (el as any).columns ?? 0,
            cells: (el as any).cells ?? [],
            columnsProps: (el as any).columnsProps ?? [],
          })
        );
      } else {
        console.log('Unknown element type:', el.elementType);
      }
    }
    
    return new Slide(newSlideId, elements, pageProperties);
}

export function createSlideFromLayoutData(layoutData: { id: string; elements: any[] }): Slide {
  const elements: SlideElement[] = [];
    
  for (const el of layoutData.elements) {
    if (el.elementType === "SHAPE") {
      const shapeParams: any = {
        id: el.id,
        slideId: el.slideId,
        type: el.type as any,
        position: el.position,
      };
      if (el.fill !== undefined) shapeParams.fill = el.fill;
      if (el.border !== undefined) shapeParams.border = el.border;
      if (el.textStyle !== undefined) shapeParams.textStyle = el.textStyle;
      elements.push(new ShapeElement(shapeParams));
    } else if (el.elementType === "LINE") {
      elements.push(
        new LineElement({
          id: el.id,
          slideId: el.slideId,
          position: el.position,
          lineCategory: (el as any).lineCategory || "STRAIGHT",
          lineFill: (el as any).lineFill as Fill,
          weight: (el as any).weight,
          dashStyle: (el as any).dashStyle,
          startArrow: (el as any).startArrow,
          endArrow: (el as any).endArrow,
          startConnection: (el as any).startConnection
            ? {
                connectedObjectId: (el as any).startConnection.connectedObjectId,
                connectionSiteIndex: (el as any).startConnection.connectionSiteIndex,
              }
            : undefined,
          endConnection: (el as any).endConnection
            ? {
                connectedObjectId: (el as any).endConnection.connectedObjectId,
                connectionSiteIndex: (el as any).endConnection.connectionSiteIndex,
              }
            : undefined,
        })
      );
    } else if (el.elementType === "IMAGE") {
      if (!el.imageUrl) continue;
      elements.push(
        new ImageElement({
          id: el.id,
          slideId: el.slideId,
          position: el.position,
          imageUrl: el.imageUrl,
        })
      );
    } else if (el.elementType === "VIDEO") {
      if (!el.videoUrl) continue;
      elements.push(
        new VideoElement({
          id: el.id,
          slideId: el.slideId,
          position: el.position,
          videoUrl: el.videoUrl,
        })
      );
    } else if (el.elementType === "TABLE") {
      elements.push(
        new TableElement({
          id: el.id,
          slideId: el.slideId,
          position: el.position,
          rows: (el as any).rows ?? 0,
          columns: (el as any).columns ?? 0,
          cells: (el as any).cells ?? [],
          columnsProps: (el as any).columnsProps ?? [],
        })
      );
    }
  }

  return new Slide(layoutData.id, elements);
}

export function createBatchRequestsFromLayoutData(layoutData: { id: string; elements: any[] }): any[] {
  const slide = createSlideFromLayoutData(layoutData);
  return slide.toBatchRequests();
}




