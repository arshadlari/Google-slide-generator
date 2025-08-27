import type { Position } from "../properties.ts";

export interface SlideElement {
    id: string;
    slideId: string;
    position: Position;
    elementType: string;
    toBatchRequests(): any[];
}
