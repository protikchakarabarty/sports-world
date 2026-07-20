import { useState, useMemo, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiChevronDown } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTransfers, useTransferRumours, useTransferNews, useDiscussedPlayers } from '@/hooks/useFootballData';
import { Skeleton } from '@/components/ui/Skeleton';
import { MatchCarousel } from '@/components/football/MatchCarousel';
import { timeAgo } from '@/services/transferRumourService';
import type { TransferRumour as TR } from '@/services/transferRumourService';

function Flag({ code }: { code: string }) {
  const emoji = useMemo(() => {
    if (!code || code.length !== 2) return null;
    try {
      const cp = [...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
      return String.fromCodePoint(...cp);
    } catch { return null; }
  }, [code]);
  return (
    <span className="inline-flex items-center justify-center w-4 h-3 rounded text-sm shrink-0" title={code}>
      {emoji ?? ''}
    </span>
  );
}

function getCountryName(code: string): string {
  const names: Record<string, string> = {
    'es': 'Spain', 'gb-eng': 'England', 'au': 'Australia', 'us': 'United States',
    'se': 'Sweden', 'de': 'Germany', 'fr': 'France', 'it': 'Italy',
    'nl': 'Netherlands', 'pt': 'Portugal', 'br': 'Brazil', 'ar': 'Argentina',
    'be': 'Belgium', 'tr': 'Turkey', 'gb-sct': 'Scotland', 'jp': 'Japan',
    'ng': 'Nigeria', 'za': 'South Africa', 'cn': 'China', 'no': 'Norway',
    'dk': 'Denmark', 'ch': 'Switzerland', 'at': 'Austria', 'pl': 'Poland',
    'ua': 'Ukraine', 'ru': 'Russia', 'mx': 'Mexico', 'ca': 'Canada',
    'kr': 'South Korea', 'in': 'India',
  };
  return names[code] || code;
}

function CardSkeleton() {
  return (
    <div className="w-full sm:w-[280px] lg:w-[340px] shrink-0">
      <div className="glass-card p-4 flex flex-col gap-3 ">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-[180px] w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function RumourCard({ rumour }: { rumour: TR }) {
  const { t } = useLanguage();
  const ago = timeAgo(rumour.date);
  const confidenceLevel = rumour.probability >= 70 ? 'high' : rumour.probability >= 40 ? 'medium' : 'low';
  const showFrom = rumour.fromTeam && rumour.fromTeam !== '—';
  const showTo = rumour.toTeam && rumour.toTeam !== '—';
  const countryName = rumour.countryFlag ? getCountryName(rumour.countryFlag) : '';
  const [imgFailed, setImgFailed] = useState(false);

  const initials = rumour.player.split(' ').map(n => n[0]).join('').toUpperCase();
  const showImg = rumour.playerImage && !imgFailed;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full sm:w-[280px] lg:w-[340px] shrink-0"
    >
      <div className="glass-card rounded-xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col">
        {/* Player thumbnail */}
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 shrink-0">
          {showImg ? (
            <img src={rumour.playerImage} alt={rumour.player}
              className="w-full h-full object-cover" loading="lazy"
              onError={() => setImgFailed(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600">
              <span className="text-white text-3xl font-bold drop-shadow-md">{initials}</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 font-medium backdrop-blur-sm">
              {ago}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5 flex flex-col flex-1 gap-2">
          {/* Player name + country */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white break-words flex-1 min-w-0">
              {rumour.player}
            </h3>
            {countryName && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                {rumour.countryFlag && <Flag code={rumour.countryFlag} />}
                {countryName}
              </span>
            )}
          </div>

          {/* Transfer headline */}
          {rumour.title && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
              {rumour.title}
            </p>
          )}

          {/* From → To */}
          <div className="flex items-center gap-1.5 text-xs py-1.5 px-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shrink-0">
            <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider shrink-0">{t('From', 'থেকে')}</span>
            <ClubDisplay name={showFrom ? rumour.fromTeam : (showTo ? rumour.toTeam : '')} />
            {showFrom && showTo && (
              <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            )}
            <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider shrink-0">{t('To', 'এতে')}</span>
            <ClubDisplay name={showTo ? rumour.toTeam : '—'} />
          </div>

          {/* Fee + Confidence */}
          <div className="flex items-center justify-between gap-2 shrink-0">
            <div>
              <span className="text-[10px] text-gray-400">{t('Fee', 'ফি')}</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{rumour.estimatedFee}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400">{t('Confidence', 'আত্মবিশ্বাস')}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-14 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className={`h-full rounded-full ${confidenceLevel === 'high' ? 'bg-emerald-500' : confidenceLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${rumour.probability}%` }} />
                </div>
                <span className={`text-xs font-bold ${confidenceLevel === 'high' ? 'text-emerald-500' : confidenceLevel === 'medium' ? 'text-amber-500' : 'text-red-500'}`}>
                  {rumour.probability}%
                </span>
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {rumour.sources.slice(0, 3).map((s, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 truncate max-w-[90px]">
                    {s}
                  </span>
                ))}
              </div>
              {rumour.articleUrl && (
                <a href={rumour.articleUrl} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-500 transition-colors shrink-0">
                  <FiExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ClubDisplay({ name }: { name: string }) {
  if (!name || name === '—') {
    return <span className="text-gray-400 dark:text-gray-600 text-xs">—</span>;
  }
  return <span className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[100px]">{name}</span>;
}

function NewsCard({ item }: { item: { title: string; image: string; source: string; url: string; date: string } }) {
  const ago = timeAgo(item.date);
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = item.image && !imgFailed;

  return (
    <motion.a
      href={item.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 block group"
    >
      <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-800 shrink-0">
        {showImg ? (
          <img src={item.image} alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy"
            onError={() => setImgFailed(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-green-600/20">
            <svg className="w-8 h-8 text-emerald-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3.5">
        <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {item.title}
        </p>
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span className="truncate max-w-[120px]">{item.source}</span>
          {ago && <span>{ago}</span>}
        </div>
      </div>
    </motion.a>
  );
}

function DiscussedCard({ rumour }: { rumour: TR }) {
  const { t } = useLanguage();
  const ago = timeAgo(rumour.date);
  const countryName = rumour.countryFlag ? getCountryName(rumour.countryFlag) : '';
  const [imgFailed, setImgFailed] = useState(false);

  const initials = rumour.player.split(' ').map(n => n[0]).join('').toUpperCase();
  const showImg = rumour.playerImage && !imgFailed;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full sm:w-[280px] lg:w-[340px] shrink-0"
    >
      <div className="glass-card rounded-xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col">
        {/* Player thumbnail */}
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 shrink-0">
          {showImg ? (
            <img src={rumour.playerImage} alt={rumour.player}
              className="w-full h-full object-cover" loading="lazy"
              onError={() => setImgFailed(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
              <span className="text-white text-3xl font-bold drop-shadow-md">{initials}</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 font-medium backdrop-blur-sm">
              {ago}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5 flex flex-col flex-1 gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white break-words flex-1 min-w-0">
              {rumour.player}
            </h3>
            {countryName && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                {rumour.countryFlag && <Flag code={rumour.countryFlag} />}
                {countryName}
              </span>
            )}
          </div>

          {rumour.title && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
              {rumour.title}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 shrink-0">
            {rumour.fromTeam && rumour.fromTeam !== '—' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {rumour.fromTeam}
              </span>
            )}
            {rumour.sources.slice(0, 2).map((s, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ViewMoreBtn({ showAll, hiddenCount, onClick }: { showAll: boolean; hiddenCount: number; onClick: () => void }) {
  const { t } = useLanguage();
  if (hiddenCount <= 0 && showAll) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-6">
      <button onClick={onClick}
        className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold
          bg-gradient-to-r from-emerald-500 to-green-500 text-white
          shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50
          ring-1 ring-amber-400/40 hover:ring-amber-400/70
          transition-all duration-300 hover:scale-105 active:scale-[0.98]"
      >
        <motion.span animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }} className="inline-flex">
          <FiChevronDown className="w-4 h-4" />
        </motion.span>
        {showAll
          ? t('Show Less', 'সংক্ষেপে দেখান')
          : `${t('View More', 'আরো দেখুন')} (${hiddenCount})`}
      </button>
    </motion.div>
  );
}

export function TransferMarketSection({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: transfers, isLoading: trLoading, isError: trError } = useTransfers(gender);
  const { data: rumours, isLoading: rmLoading } = useTransferRumours();
  const { data: news, isLoading: nwLoading } = useTransferNews();
  const { data: discussed, isLoading: dsLoading } = useDiscussedPlayers();

  const [showAllRumours, setShowAllRumours] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);
  const [showAllDiscussed, setShowAllDiscussed] = useState(false);

  const hasApiTransfers = !trLoading && !trError && transfers && transfers.length > 0;
  const loading = trLoading || rmLoading || nwLoading || dsLoading;

  const rumourList = useMemo(() => rumours ?? [], [rumours]);
  const newsList = useMemo(() => news ?? [], [news]);
  const discussedList = useMemo(() => discussed ?? [], [discussed]);

  const showRumours = rumourList.length > 0;
  const showNews = newsList.length > 0;
  const showDiscussed = discussedList.length > 0;
  const hasAnyData = hasApiTransfers || showRumours || showNews || showDiscussed;

  // Log which provider is being used
  if (hasApiTransfers) {
    console.log(`[Transfer] Using Sportmonks (${transfers!.length} transfers)`);
  } else if (showRumours || showNews || showDiscussed) {
    console.log(`[Transfer] Using NewsAPI fallback + AI-generated rumours`);
  } else if (!loading) {
    console.log(`[Transfer] All providers exhausted — showing empty state`);
  }

  const displayedRumours = useMemo(
    () => showAllRumours ? rumourList : rumourList.slice(0, 10),
    [rumourList, showAllRumours],
  );
  const rumourHiddenCount = Math.max(0, rumourList.length - 10);

  const displayedNews = useMemo(
    () => showAllNews ? newsList : newsList.slice(0, 6),
    [newsList, showAllNews],
  );
  const newsHiddenCount = Math.max(0, newsList.length - 6);

  const displayedDiscussed = useMemo(
    () => showAllDiscussed ? discussedList : discussedList.slice(0, 10),
    [discussedList, showAllDiscussed],
  );
  const discussedHiddenCount = Math.max(0, discussedList.length - 10);

  // Loading
  if (loading && !hasAnyData) {
    return (
      <Section title={t('Transfer Market', 'ট্রান্সফার মার্কেট')} subtitle={t('Latest player transfers and rumours', 'সর্বশেষ খেলোয়াড় স্থানান্তর এবং গুজব')}>
        <div className="flex gap-4 overflow-hidden mb-8">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <GridSkeleton count={3} />
      </Section>
    );
  }

  // Empty state — compact, only if absolutely nothing exists
  if (!hasAnyData && !loading) {
    return (
      <Section title={t('Transfer Market', 'ট্রান্সফার মার্কেট')} subtitle={t('Latest player transfers', 'সর্বশেষ খেলোয়াড় স্থানান্তর')}>
        <div className="flex items-center justify-center py-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('No verified transfer updates available today.', 'আজ কোনো নিশ্চিত ট্রান্সফার আপডেট নেই।')}
          </p>
        </div>
      </Section>
    );
  }

  // Sportmonks API transfers
  if (hasApiTransfers) {
    return (
      <Section title={t('Transfer Market', 'ট্রান্সফার মার্কেট')} subtitle={t('Latest player transfers', 'সর্বশেষ খেলোয়াড় স্থানান্তর')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transfers!.slice(0, 30).map((transfer, i) => (
            <motion.div key={transfer.id || `transfer-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={transfer.status === 'completed' ? 'success' : 'warning'}>
                  {transfer.status === 'completed' ? t('Completed', 'নিশ্চিত') : t('Rumour', 'গুজব')}
                </Badge>
                <span className="text-[11px] text-gray-400">{transfer.date}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 truncate">{transfer.player}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate">{transfer.from || '—'}</span>
                <span className="text-gray-300 dark:text-gray-600 shrink-0">→</span>
                <span className="truncate">{transfer.to || '—'}</span>
              </div>
              <p className="text-xs font-semibold text-primary mt-2">{transfer.fee}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title={t('Transfer Market', 'ট্রান্সফার মার্কেট')}
      subtitle={t('Latest player transfers, rumours, and news', 'সর্বশেষ খেলোয়াড় স্থানান্তর, গুজব এবং খবর')}
    >
      {/* 🔥 Trending Transfer Rumours */}
      {showRumours && displayedRumours.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🔥</span> {t('Trending Transfer Rumours', 'ট্রেন্ডিং ট্রান্সফার গুজব')}
          </h3>
          <MatchCarousel>
            {displayedRumours.map((rumour, ri) => (
              <RumourCard key={rumour.id || `rumour-${ri}`} rumour={rumour} />
            ))}
          </MatchCarousel>
          <ViewMoreBtn showAll={showAllRumours} hiddenCount={rumourHiddenCount} onClick={() => setShowAllRumours((p) => !p)} />
        </div>
      )}

      {/* ✅ Latest Transfer News */}
      {showNews && displayedNews.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>✅</span> {t('Latest Transfer News', 'সর্বশেষ ট্রান্সফার খবর')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedNews.map((item, i) => (
              <NewsCard key={item.url || `news-${i}`} item={item} />
            ))}
          </div>
          <ViewMoreBtn showAll={showAllNews} hiddenCount={newsHiddenCount} onClick={() => setShowAllNews((p) => !p)} />
        </div>
      )}

      {/* ⭐ Most Discussed Players */}
      {showDiscussed && displayedDiscussed.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⭐</span> {t('Most Discussed Players', 'সর্বাধিক আলোচিত খেলোয়াড়')}
          </h3>
          <MatchCarousel>
            {displayedDiscussed.map((rumour, di) => (
              <DiscussedCard key={rumour.id || `discussed-${di}`} rumour={rumour} />
            ))}
          </MatchCarousel>
          <ViewMoreBtn showAll={showAllDiscussed} hiddenCount={discussedHiddenCount} onClick={() => setShowAllDiscussed((p) => !p)} />
        </div>
      )}
    </Section>
  );
}
