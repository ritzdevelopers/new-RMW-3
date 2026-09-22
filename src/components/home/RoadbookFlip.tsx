"use client";

import { useEffect, useRef } from "react";
import { PageFlip } from "page-flip/dist/js/page-flip.module.js";
import { roadbookPages } from "@/lib/roadbook";

export type RoadbookFlipApi = {
  next: () => void;
  prev: () => void;
};

type RoadbookFlipProps = {
  onPage: (page: number) => void;
  onApi: (api: RoadbookFlipApi) => void;
};

type FlipEvent = {
  data: number | string | { page: number; mode: string };
};

const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 580;
const PAGE_RATIO = PAGE_HEIGHT / PAGE_WIDTH;

/* Below this viewport width a two-page spread is too small to read, so the
   book flips as a single portrait page instead. */
const PORTRAIT_MAX_VW = 640;

function pageIndex(data: FlipEvent["data"]) {
  if (typeof data === "number") return data;
  if (typeof data === "object" && data) return data.page;
  return 0;
}

function softenAll(book: PageFlip) {
  const count = book.getPageCount();
  for (let i = 0; i < count; i += 1) {
    book.getPage(i).setDensity("soft");
  }
}

function isPortraitViewport() {
  return window.matchMedia(`(max-width: ${PORTRAIT_MAX_VW}px)`).matches;
}

function measurePage(box: HTMLElement) {
  const availW = box.clientWidth;
  const availH = box.clientHeight;
  const portrait = isPortraitViewport();
  if (availW < 40 || availH < 40) {
    return { width: PAGE_WIDTH, height: PAGE_HEIGHT, ready: false, portrait };
  }

  let width = Math.min(PAGE_WIDTH, Math.floor(portrait ? availW : availW / 2));
  let height = Math.round(width * PAGE_RATIO);

  if (height > Math.min(PAGE_HEIGHT, availH)) {
    height = Math.min(PAGE_HEIGHT, availH);
    width = Math.round(height / PAGE_RATIO);
  }

  return {
    width: Math.max(1, width),
    height: Math.max(1, height),
    ready: true,
    portrait,
  };
}

function createPages() {
  return roadbookPages.map((page) => {
    const el = document.createElement("div");
    el.className = "roadbook-page";
    el.dataset.density = "soft";
    const img = document.createElement("img");
    img.src = page.src;
    img.alt = page.title;
    img.draggable = false;
    el.appendChild(img);
    return el;
  });
}

export function RoadbookFlip({ onPage, onApi }: RoadbookFlipProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const onPageRef = useRef(onPage);
  const onApiRef = useRef(onApi);

  onPageRef.current = onPage;
  onApiRef.current = onApi;

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = hostRef.current;
    if (!wrap || !host) return;

    let pageFlip: PageFlip | null = null;
    let currentIndex = 0;
    let lastKey = "";
    let raf = 0;

    const lastIndex = roadbookPages.length - 1;

    const syncCoverClass = (
      index: number,
      pageWidth: number,
      portrait: boolean,
    ) => {
      wrap.classList.toggle("is-cover", index === 0);
      wrap.classList.toggle("is-back", index === lastIndex);
      // In portrait there is no spread to re-centre against the cover.
      wrap.style.setProperty(
        "--cover-shift",
        portrait ? "0px" : `${Math.round(pageWidth / 2)}px`,
      );
    };

    const destroyBook = () => {
      if (!pageFlip) return;
      pageFlip.off("flip");
      pageFlip.off("init");
      pageFlip.off("changeState");
      pageFlip.destroy();
      pageFlip = null;
      host.replaceChildren();
    };

    const mountBook = () => {
      const size = measurePage(wrap);
      if (!size.ready) return;

      const key = `${size.width}x${size.height}:${size.portrait ? "p" : "l"}`;
      if (pageFlip && lastKey === key) {
        pageFlip.update();
        softenAll(pageFlip);
        syncCoverClass(currentIndex, size.width, size.portrait);
        return;
      }

      lastKey = key;
      destroyBook();

      const root = document.createElement("div");
      root.className = "roadbook-book";
      host.replaceChildren(root);

      pageFlip = new PageFlip(root, {
        width: size.width,
        height: size.height,
        size: "fixed",
        minWidth: size.width,
        maxWidth: size.width,
        minHeight: size.height,
        maxHeight: size.height,
        drawShadow: true,
        maxShadowOpacity: 0.9,
        flippingTime: 1100,
        showCover: true,
        usePortrait: size.portrait,
        autoSize: false,
        startZIndex: 2,
        startPage: currentIndex,
        mobileScrollSupport: true,
        swipeDistance: 24,
        clickEventForward: false,
        useMouseEvents: false,
        showPageCorners: false,
        disableFlipByClick: true,
      });

      pageFlip.on("init", (event: FlipEvent) => {
        if (!pageFlip) return;
        softenAll(pageFlip);
        currentIndex = pageIndex(event.data);
        syncCoverClass(currentIndex, size.width, size.portrait);
        onPageRef.current(currentIndex + 1);
      });

      pageFlip.on("flip", (event: FlipEvent) => {
        if (!pageFlip) return;
        softenAll(pageFlip);
        currentIndex = pageIndex(event.data);
        syncCoverClass(currentIndex, size.width, size.portrait);
        onPageRef.current(currentIndex + 1);
      });

      pageFlip.on("changeState", (event: FlipEvent) => {
        if (event.data === "flipping") {
          wrap.classList.remove("is-cover", "is-back");
        }
      });

      pageFlip.loadFromHTML(createPages());
      softenAll(pageFlip);
      syncCoverClass(currentIndex, size.width, size.portrait);

      onApiRef.current({
        next: () => pageFlip?.flipNext("bottom"),
        prev: () => pageFlip?.flipPrev("bottom"),
      });
    };

    const scheduleMount = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(mountBook);
    };

    mountBook();
    const observer = new ResizeObserver(scheduleMount);
    observer.observe(wrap);
    window.addEventListener("resize", scheduleMount);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", scheduleMount);
      destroyBook();
    };
  }, []);

  return (
    <div ref={wrapRef} className="roadbook-flip-wrap is-cover">
      <div ref={hostRef} className="roadbook-host" />
    </div>
  );
}
