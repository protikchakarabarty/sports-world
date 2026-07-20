import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlay, FiExternalLink } from 'react-icons/fi';
import { Badge } from '@/components/ui/Badge';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useGeneralSportsNews } from '@/hooks/useNewsData';
import type { NormalizedArticle } from '@/services/newsApi';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  source: string;
  url: string;
}

const curatedFallback: HeroSlide[] = [
  { id: 'fb1', title: 'NBA Finals 2026: Boston Celtics Clinch Championship in Game 7 Thriller', subtitle: 'Jayson Tatum named Finals MVP after 42-point performance', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1920', source: 'Sports World', url: '#' },
  { id: 'fb2', title: 'Wimbledon 2026: Sinner Defeats Alcaraz in Epic Five-Set Final', subtitle: 'Italian star claims second Grand Slam title on Centre Court', image: 'https://images.unsplash.com/photo-1622279457486-28c2f0912047?q=80&w=1920', source: 'Sports World', url: '#' },
  { id: 'fb3', title: 'F1 2026: Verstappen Secures Fourth Consecutive World Championship', subtitle: 'Red Bull driver dominates season with record 15 wins', image: 'https://images.unsplash.com/photo-1647516263096-23d3e8820b87?q=80&w=1920', source: 'Sports World', url: '#' },
  { id: 'fb4', title: 'Heavyweight Boxing: Fury Defeats Joshua in Epic Showdown', subtitle: 'The Gypsy King retains WBC title in front of 90,000 at Wembley', image: 'https://images.unsplash.com/photo-1599813391054-2e09a9a24e59?q=80&w=1920', source: 'Sports World', url: '#' },
  { id: 'fb5', title: 'The Masters 2026: Scheffler Wins Second Green Jacket', subtitle: 'World number one dominates at Augusta National', image: 'https://images.unsplash.com/photo-1587174486073-ae5eac565387?q=80&w=1920', source: 'Sports World', url: '#' },
  { id: 'fb6', title: 'World Aquatics Championships: Record-Breaking Performances', subtitle: 'Multiple world records fall as swimming stars shine', image: 'https://images.unsplash.com/photo-1560087637-8b8f1b7f1e9b?q=80&w=1920', source: 'Sports World', url: '#' },
];

function mapArticleToSlide(a: NormalizedArticle, index: number): HeroSlide {
  return {
    id: a.id || `slide-${index}`,
    title: a.title,
    subtitle: a.description,
    image: a.image,
    source: a.source,
    url: a.url,
  };
}

const AUTO_INTERVAL = 5000;
const PROGRESS_TICK = 50;
const PROGRESS_STEPS = AUTO_INTERVAL / PROGRESS_TICK;

export function HeroSection() {
  const { data: newsData, isLoading } = useGeneralSportsNews();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = (() => {
    if (newsData && newsData.length > 0) {
      return newsData.slice(0, 6).map(mapArticleToSlide);
    }
    return curatedFallback;
  })();

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  useEffect(() => {
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 1, PROGRESS_STEPS));
    }, PROGRESS_TICK);
    timerRef.current = setInterval(next, AUTO_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [next]);

  const handleImgError = useCallback((i: number) => {
    setImgErrors((prev) => new Set(prev).add(i));
  }, []);

  const currentSlide = slides[current];
  const categories = ['All', 'Basketball', 'Tennis', 'Formula 1', 'Boxing', 'Golf', 'Swimming'];

  if (isLoading) {
    return (
      <div className="space-y-4 mb-6">
        <div className="h-10 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="h-[450px] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Breaking News Ticker */}
      <div className="glass-card px-4 py-2.5 flex items-center gap-3 overflow-hidden">
        <Badge variant="breaking">BREAKING</Badge>
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-sm font-medium text-gray-900 dark:text-white truncate"
          >
            {currentSlide?.title ?? ''}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Hero Carousel */}
      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {currentSlide.image && !imgErrors.has(current) ? (
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
                onError={() => handleImgError(current)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-40" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="trending">Top Story</Badge>
                <span className="text-xs font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {currentSlide.source}
                </span>
              </div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mt-2 mb-2 leading-tight drop-shadow-lg">
                {currentSlide.title}
              </h2>
              <p className="text-sm md:text-base text-gray-200 max-w-2xl line-clamp-2">
                {currentSlide.subtitle}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href={currentSlide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/30 transition-all"
                >
                  <FiPlay className="w-4 h-4" /> Read Full Story
                </a>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/20 transition-all">
                  <FiExternalLink className="w-4 h-4" /> Open Article
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full max-w-xs h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${(progress / PROGRESS_STEPS) * 100}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>

        {/* Thumbnail Strip (desktop) */}
        <div className="absolute bottom-4 right-4 hidden md:flex gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                i === current
                  ? 'border-white shadow-lg scale-110'
                  : 'border-white/30 opacity-60 hover:opacity-90'
              }`}
            >
              {slide.image ? (
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Dots */}
        <div className="absolute top-4 right-4 flex md:hidden gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? 'w-6 bg-white' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories + Featured Story */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card overflow-hidden group cursor-pointer">
          <div className="relative overflow-hidden h-24">
            {currentSlide.image && !imgErrors.has(current) ? (
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                onError={() => handleImgError(current)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-3 right-3">
              <span className="text-xs font-semibold text-white/80">{currentSlide.source ?? 'Sports'}</span>
              <h4 className="text-sm font-bold text-white truncate">{currentSlide.title ?? ''}</h4>
            </div>
            <div className="absolute top-2 right-2"><BookmarkButton id={currentSlide.id ?? 'featured'} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
