import { useRef, useState, useEffect, useCallback, type ReactNode, type TouchEvent, type MouseEvent } from 'react';

interface Props {
  children: ReactNode[];
}

function NavButton({ dir, onClick, hidden }: { dir: 'left' | 'right'; onClick: () => void; hidden: boolean }) {
  if (hidden) return null;
  const isLeft = dir === 'left';
  return (
    <div
      className={`absolute top-1/2 z-10 -translate-y-1/2 ${isLeft ? 'left-0' : 'right-0'}`}
    >
      <button
        onClick={onClick}
        className={`
          ${isLeft ? '-ml-6' : '-mr-6'}
          w-12 h-12 flex items-center justify-center rounded-full
          bg-gradient-to-b from-[#4ADE80] to-[#16A34A]
          border border-white/25
          shadow-[0_12px_30px_rgba(22,163,74,0.35)]
          transition-all duration-300 ease-out
          hover:-translate-y-1 hover:scale-105 hover:shadow-[0_16px_40px_rgba(22,163,74,0.5)]
          ${isLeft ? 'hover:-translate-x-1' : 'hover:translate-x-1'}
          active:translate-y-[2px] active:scale-95
          focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900
        `}
        aria-label={isLeft ? 'Previous matches' : 'Next matches'}
      >
        <span className="relative flex items-center justify-center w-full h-full">
          <span className="absolute inset-0 rounded-full bg-gradient-to-b from-[rgba(255,255,120,0.45)] to-transparent pointer-events-none" />
          <svg
            className="w-5 h-5 text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={isLeft ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
          </svg>
        </span>
      </button>
    </div>
  );
}

export function MatchCarousel({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const dragState = useRef<{ start: number; scroll: number; isDragging: boolean }>({
    start: 0,
    scroll: 0,
    isDragging: false,
  });

  const updateButtons = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateButtons, { passive: true });
    updateButtons();
    return () => el.removeEventListener('scroll', updateButtons);
  }, [updateButtons, children]);

  const scrollBy = (dir: -1 | 1) => {
    const el = containerRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    if (!card) return;
    const gap = 16;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  const onWheel = useCallback((e: WheelEvent) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: e.deltaX || e.deltaY, behavior: 'auto' });
    e.preventDefault();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') scrollBy(-1);
    if (e.key === 'ArrowRight') scrollBy(1);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('keydown', onKeyDown as EventListener);
    el.setAttribute('tabindex', '0');
    return () => el.removeEventListener('keydown', onKeyDown as EventListener);
  }, [onKeyDown]);

  const onDragStart = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    dragState.current = { start: clientX, scroll: el.scrollLeft, isDragging: true };
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };

  const onDragMove = (clientX: number) => {
    const ds = dragState.current;
    if (!ds.isDragging) return;
    const el = containerRef.current;
    if (!el) return;
    el.scrollLeft = ds.scroll + (ds.start - clientX);
  };

  const onDragEnd = () => {
    dragState.current.isDragging = false;
    const el = containerRef.current;
    if (!el) return;
    el.style.cursor = '';
    el.style.userSelect = '';
  };

  const handleMouseDown = (e: MouseEvent) => onDragStart(e.clientX);
  const handleMouseMove = (e: MouseEvent) => onDragMove(e.clientX);
  const handleMouseUp = () => onDragEnd();
  const handleMouseLeave = () => onDragEnd();

  const handleTouchStart = (e: TouchEvent) => onDragStart(e.touches[0].clientX);
  const handleTouchMove = (e: TouchEvent) => onDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => onDragEnd();

  if (!children.length) return null;

  return (
    <div className="relative px-1">
      {/* Cards container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex flex-nowrap gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 cursor-grab active:cursor-grabbing
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]"
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
          >
            {child}
          </div>
        ))}
      </div>

      <NavButton dir="left" onClick={() => scrollBy(-1)} hidden={!canScrollLeft} />
      <NavButton dir="right" onClick={() => scrollBy(1)} hidden={!canScrollRight} />
    </div>
  );
}
