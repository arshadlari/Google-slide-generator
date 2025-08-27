import { hexToRgbNorm } from "./properties.ts";

export class PageProperties {
  slideId: string;
  backgroundColor: string;
  colorScheme: { type: string; color: string }[];

  constructor(params: {
    slideId: string;
    backgroundColor: string;
    colorScheme: { type: string; color: string }[];
  }) {
    this.slideId = params.slideId;
    this.backgroundColor = params.backgroundColor;
    this.colorScheme = params.colorScheme;
  }

  toBatchRequests(): any[] {
    const requests: any[] = [];

    const pageProperties: any = {};

    if (this.backgroundColor) {
      pageProperties.pageBackgroundFill = {
        solidFill: {
          color: {
            rgbColor: hexToRgbNorm(this.backgroundColor)
          },
          alpha: 1
        },
        propertyState: "RENDERED"
      };
    }

    if (Array.isArray(this.colorScheme) && this.colorScheme.length > 0) {
      pageProperties.colorScheme = {
        colors: this.colorScheme.map(({ type, color }) => ({
          type,
          color: {
            rgbColor: hexToRgbNorm(color)
          }
        }))
      };
    }

    requests.push({
      updatePageProperties: {
        objectId: this.slideId,
        pageProperties,
        fields: Object.keys(pageProperties).join(",")
      }
    });

    return requests;
  }
}
