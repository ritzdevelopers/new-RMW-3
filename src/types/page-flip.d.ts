declare module "page-flip/dist/js/page-flip.module.js" {
  export class PageFlip {
    constructor(
      element: HTMLElement,
      settings: {
        width: number;
        height: number;
        size?: "fixed" | "stretch";
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        drawShadow?: boolean;
        flippingTime?: number;
        usePortrait?: boolean;
        startZIndex?: number;
        autoSize?: boolean;
        maxShadowOpacity?: number;
        showCover?: boolean;
        mobileScrollSupport?: boolean;
        swipeDistance?: number;
        clickEventForward?: boolean;
        useMouseEvents?: boolean;
        showPageCorners?: boolean;
        disableFlipByClick?: boolean;
        startPage?: number;
      },
    );
    loadFromHTML(pages: HTMLElement[] | NodeListOf<HTMLElement>): void;
    destroy(): void;
    update(): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    getPageCount(): number;
    getPage(index: number): { setDensity: (density: string) => void };
    on(
      event: string,
      callback: (e: { data: number | { page: number; mode: string } | string }) => void,
    ): PageFlip;
    off(event: string): void;
  }
}
