import type { SlideElement } from "./SlideElement.ts";
import type { Position } from "../properties.ts";

export class VideoElement implements SlideElement {
  id: string;
  slideId: string;
  position: Position;
  videoUrl: string; // Must be a YouTube URL
  elementType: string = "VIDEO";
  
  constructor(params: {
    id: string;
    slideId: string;
    position: Position;
    videoUrl: string;
  }) {
    this.id = params.id;
    this.slideId = params.slideId;
    this.position = params.position;
    this.videoUrl = params.videoUrl;
  }

  toBatchRequests(): any[] {
    return [{
      createVideo: {
        objectId: this.id,
        // Only supports YouTube URLs
        id: this.extractYouTubeId(this.videoUrl),
        source: "YOUTUBE",
        elementProperties: {
          pageObjectId: this.slideId,
          size: {
            height: { magnitude: this.position.height, unit: "PT" },
            width: { magnitude: this.position.width, unit: "PT" }
          },
          transform: {
            scaleX: this.position.scaleX ?? 1,
            scaleY: this.position.scaleY ?? 1,
            translateX: this.position.x,
            translateY: this.position.y,
            shearX: this.position.shearX,
            shearY: this.position.shearY,
            unit: "PT"
          }
        }
      }
    }];
  }

  // Helper: Extracts the YouTube video ID from a URL
  private extractYouTubeId(url: string): string {
    const match = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
    );
    if (match && match[1]) {
      return match[1];
    }
    throw new Error("Invalid YouTube URL for Slides VideoElement");
  }
}
