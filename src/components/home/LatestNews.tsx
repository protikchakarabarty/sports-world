import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useGeneralSportsNews } from '@/hooks/useNewsData';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useLanguage } from '@/contexts/LanguageContext';

export function LatestNews() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: articles, isLoading } = useGeneralSportsNews();

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <Section title={t('Latest Sports News', 'সর্বশেষ খবর')} subtitle={t('Across all sports worldwide', 'বিশ্বব্যাপী সব খেলা')} link="#">
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -ml-4"
        >
          <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[300px] shrink-0">
                <div className="glass-card overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('Data source will be added in a future update.', 'ভবিষ্যত আপডেটে ডেটা উৎস যুক্ত করা হবে।')}
            </p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
          >
            {articles.slice(0, 12).map((article, i) => (
              <motion.a
                key={article.id || `news-${i}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="snap-start shrink-0 block"
              >
                <div className="w-[300px] glass-card overflow-hidden group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={article.image || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'}
                      alt={article.title}
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="trending">{t('Trending', 'ট্রেন্ডিং')}</Badge>
                    </div>
                    <div className="absolute top-2 right-2"><BookmarkButton id={article.id} /></div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-500 transition-colors">{article.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{article.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{article.source}</span>
                      <span>{article.publishedAt?.split('T')[0]}</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -mr-4"
        >
          <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </Section>
  );
}
