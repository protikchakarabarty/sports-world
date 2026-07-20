import { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface NavItem {
  key: string;
  label: string;
}

const items: NavItem[] = [
  { key: 'matches', label: 'Matches' },
  { key: 'fan-predictions', label: 'Fan Predictions' },
  { key: 'ai-predictions', label: 'AI Predictions' },
  { key: 'series', label: 'Series' },
  { key: 'upcoming-series', label: 'Upcoming Series' },
  { key: 'news', label: 'News' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'rankings', label: 'Rankings' },
  { key: 'injuries', label: 'Injuries' },
  { key: 'stats', label: 'Stats' },
  { key: 'auction', label: 'Auction' },
  { key: 'fantasy', label: 'Fantasy XI' },
  { key: 'richest', label: 'Richest' },
  { key: 'beautiful', label: 'Beautiful' },
  { key: 'today', label: 'On This Day' },
];

export function CricketNav() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('matches');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace('section-', ''));
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(`section-${item.key}`);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleClick = (key: string) => {
    const el = document.getElementById(`section-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 dark:bg-gray-800/90 shadow flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <FiChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scrollbar-none py-2 px-6"
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => handleClick(item.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                active === item.key
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 dark:bg-gray-800/90 shadow flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <FiChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
