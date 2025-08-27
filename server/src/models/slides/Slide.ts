import type { SlideElement } from "./elements/SlideElement.ts";
import { PageProperties } from "./PageProperties.ts";

export class Slide {
    id: string;
    elements: SlideElement[];
    pageProperties: PageProperties | null;

    constructor(id: string, elements: SlideElement[] = [], pageProperties?: PageProperties) {
        this.id = id;
        this.elements = elements;
        this.pageProperties = pageProperties ?? null;
    }

    addElement(element: SlideElement): void {
        this.elements.push(element);
    }

    toBatchRequests(): any[] {
        const requests: any[] = [];
        if (this.pageProperties) {
            requests.push(...this.pageProperties.toBatchRequests());
        }
        requests.push(...this.elements.map((el) => el.toBatchRequests()).flat());
        return requests;
    }
}