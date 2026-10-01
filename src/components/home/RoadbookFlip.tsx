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

function addImage(parent: HTMLElement, src: string, alt: string) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.draggable = false;
  parent.appendChild(img);
  return img;
}

function createPages() {
  const last = roadbookPages.length - 1;
  return roadbookPages.map((page, index) => {
    const el = document.createElement("div");
    const hard = index === 0 || index === last;
    el.className = hard ? "roadbook-page roadbook-page-cover" : "roadbook-page";
    el.dataset.density = hard ? "hard" : "soft";

    if (page.kind === "cover") {
      addImage(el, page.src, page.title);
      return el;
    }

    if (page.kind === "plate") {
      const frame = document.createElement("div");
      frame.className = "roadbook-plate";
      addImage(frame, page.src, page.title);
      const caption = document.createElement("p");
      caption.className = "roadbook-plate-cap";
      const name = document.createElement("strong");
      name.textContent = page.title;
      caption.append(name, document.createTextNode(` — ${page.caption}`));
      frame.appendChild(caption);
      el.appendChild(frame);
      return el;
    }

    const sheet = document.createElement("div");
    sheet.className = "roadbook-sheet";
    const kicker = document.createElement("p");
    kicker.className = "roadbook-kicker";
    kicker.textContent = page.kicker;
    const title = document.createElement("h3");
    title.className = "roadbook-sheet-title";
    title.textContent = page.title;
    const body = document.createElement("p");
    body.className = "roadbook-sheet-body";
    body.textContent = page.body;
    sheet.append(kicker, title, body);
    if (page.lines?.length) {
      const list = document.createElement("ul");
      list.className = "roadbook-sheet-list";
      page.lines.forEach((line) => {
        const item = document.createElement("li");
        item.textContent = line;
        list.appendChild(item);
      });
      sheet.appendChild(list);
    }
    el.appendChild(sheet);
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

    const syncBookClass = (
      index: number,
      pageWidth: number,
      pageHeight: number,
      portrait: boolean,
    ) => {
      const closed = index === 0 || index === lastIndex;
      wrap.classList.toggle("is-cover", index === 0);
      wrap.classList.toggle("is-back", index === lastIndex);
      wrap.classList.toggle("is-open", !closed);
      wrap.classList.toggle("is-portrait", portrait);
      wrap.style.setProperty("--page-w", `${pageWidth}px`);
      wrap.style.setProperty("--page-h", `${pageHeight}px`);
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
        syncBookClass(currentIndex, size.width, size.height, size.portrait);
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
        maxShadowOpacity: 0.45,
        flippingTime: 900,
        showCover: true,
        usePortrait: size.portrait,
        autoSize: false,
        startZIndex: 2,
        startPage: currentIndex,
        mobileScrollSupport: false,
        swipeDistance: 28,
        clickEventForward: false,
        useMouseEvents: true,
        showPageCorners: true,
        disableFlipByClick: false,
      });

      pageFlip.on("init", (event: FlipEvent) => {
        if (!pageFlip) return;
        currentIndex = pageIndex(event.data);
        syncBookClass(currentIndex, size.width, size.height, size.portrait);
        onPageRef.current(currentIndex + 1);
      });

      pageFlip.on("flip", (event: FlipEvent) => {
        if (!pageFlip) return;
        currentIndex = pageIndex(event.data);
        syncBookClass(currentIndex, size.width, size.height, size.portrait);
        onPageRef.current(currentIndex + 1);
      });

      pageFlip.on("changeState", (event: FlipEvent) => {
        if (event.data !== "flipping") return;
        const opening = currentIndex === 0 || currentIndex === lastIndex;
        if (!opening) return;
        wrap.classList.remove("is-cover", "is-back");
        wrap.classList.add("is-open");
      });

      pageFlip.loadFromHTML(createPages());
      syncBookClass(currentIndex, size.width, size.height, size.portrait);

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
      <div className="roadbook-shell" aria-hidden="true">
        <span className="roadbook-board roadbook-board-left" />
        <span className="roadbook-board roadbook-board-right" />
        <span className="roadbook-thickness roadbook-thickness-left" />
        <span className="roadbook-thickness roadbook-thickness-right" />
        <span className="roadbook-gutter" />
        <span className="roadbook-floor" />
      </div>
      <div ref={hostRef} className="roadbook-host" />
    </div>
  );
}
