declare module "page-flip" {
  export class PageFlip {
    constructor(element: HTMLElement, setting: any);
    loadFromImages(images: string[]): void;
    loadFromHTML(elements: NodeListOf<HTMLElement> | HTMLElement[]): void;
    turnToPage(page: number): void;
    turnToPrevPage(): void;
    turnToNextPage(): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    destroy(): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): "portrait" | "landscape";
    getState(): string;
    on(event: string, callback: (e: any) => void): void;
    off(event: string, callback: (e: any) => void): void;
  }
}
