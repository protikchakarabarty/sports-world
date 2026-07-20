import { FiPlay, FiExternalLink } from 'react-icons/fi';
import type { Gender } from '@/data/mockData';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { MatchCarousel } from '@/components/football/MatchCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCricketHighlights, useWomenCricketHighlights } from '@/hooks/useYouTubeData';

const fallbackHighlights = [
  { videoId: 'ph-m1', title: 'India vs England 1st ODI', description: '2.4M views', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', channel: '' },
  { videoId: 'ph-m2', title: 'West Indies vs New Zealand 2nd ODI', description: '1.8M views', thumbnail: 'https://images.unsplash.com/photo-1540749913343-feb0e7e5c38a?w=400', channel: '' },
  { videoId: 'ph-m3', title: 'Zimbabwe vs Bangladesh 1st T20I', description: '1.1M views', thumbnail: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400', channel: '' },
  { videoId: 'ph-m4', title: 'England vs India 2nd ODI Highlights', description: '2.1M views', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', channel: '' },
  { videoId: 'ph-m5', title: 'Pakistan vs West Indies Warm-up', description: '980K views', thumbnail: 'https://images.unsplash.com/photo-1540749913343-feb0e7e5c38a?w=400', channel: '' },
  { videoId: 'ph-m6', title: 'Asia Cup 2025 Final Highlights', description: '5.2M views', thumbnail: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400', channel: '' },
  { videoId: 'ph-m7', title: 'IPL 2026: CSK vs MI Thriller', description: '3.7M views', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', channel: '' },
  { videoId: 'ph-m8', title: 'Australia vs India Test Series', description: '4.1M views', thumbnail: 'https://images.unsplash.com/photo-1540749913343-feb0e7e5c38a?w=400', channel: '' },
  { videoId: 'ph-m9', title: 'South Africa vs Pakistan ODI', description: '1.6M views', thumbnail: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400', channel: '' },
  { videoId: 'ph-m10', title: 'T20 World Cup 2026 Highlights', description: '6.8M views', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', channel: '' },
  { videoId: 'ph-m11', title: 'Sri Lanka vs New Zealand Test', description: '1.3M views', thumbnail: 'https://images.unsplash.com/photo-1540749913343-feb0e7e5c38a?w=400', channel: '' },
  { videoId: 'ph-m12', title: 'Bangladesh vs Afghanistan T20', description: '1.9M views', thumbnail: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400', channel: '' },
];

const fallbackWomenHighlights = [
  { videoId: 'ph-w1', title: 'India Women vs England Women 3rd ODI Highlights', description: '1.2M views', thumbnail: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3ca97?w=400', channel: '' },
  { videoId: 'ph-w2', title: 'Smriti Mandhana 112 vs England Women', description: '980K views', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', channel: '' },
  { videoId: 'ph-w3', title: 'Bangladesh Women vs Zimbabwe Women 4th T20I', description: '650K views', thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400', channel: '' },
  { videoId: 'ph-w4', title: 'Harmanpreet Kaur Match-winning Knock', description: '1.1M views', thumbnail: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3ca97?w=400', channel: '' },
  { videoId: 'ph-w5', title: 'West Indies Women vs Pakistan Women 1st T20I', description: '720K views', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', channel: '' },
  { videoId: 'ph-w6', title: 'WPL 2026: Top 10 Sixes of the Season', description: '2.3M views', thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400', channel: '' },
  { videoId: 'ph-w7', title: 'Australia Women vs South Africa Women ODI', description: '890K views', thumbnail: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3ca97?w=400', channel: '' },
  { videoId: 'ph-w8', title: 'Ellyse Perry All-round Masterclass', description: '1.5M views', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', channel: '' },
  { videoId: 'ph-w9', title: 'Nat Sciver-Brunt 89 vs India Women', description: '780K views', thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400', channel: '' },
  { videoId: 'ph-w10', title: 'New Zealand Women vs England Women T20', description: '610K views', thumbnail: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3ca97?w=400', channel: '' },
  { videoId: 'ph-w11', title: 'Women T20 World Cup 2026: Best Catches', description: '3.2M views', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', channel: '' },
  { videoId: 'ph-w12', title: 'Meg Lanning Century vs Sri Lanka Women', description: '940K views', thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400', channel: '' },
];

export function CricketHighlights({ gender = 'men' }: { gender?: Gender }) {
  const { t } = useLanguage();
  const { data: menVideos, isLoading: menLoading } = useCricketHighlights();
  const { data: womenVideos, isLoading: womenLoading } = useWomenCricketHighlights();
  const isLoading = gender === 'men' ? menLoading : womenLoading;
  const videos = gender === 'women'
    ? (womenVideos?.length ? womenVideos : fallbackWomenHighlights).slice(0, 12)
    : (menVideos?.length ? menVideos : fallbackHighlights).slice(0, 12);

  if (isLoading) {
    return (
      <Section title={t('Match Highlights', 'ম্যাচ হাইলাইটস')} subtitle={t('Best moments from recent matches', 'সাম্প্রতিক ম্যাচের সেরা মুহূর্ত')}>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-full sm:w-72 glass-card p-0 overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="p-2.5 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section title={t('Match Highlights', 'ম্যাচ হাইলাইটস')} subtitle={t('Best moments from recent matches', 'সাম্প্রতিক ম্যাচের সেরা মুহূর্ত')}>
      <MatchCarousel>
        {videos.map((v) => (
          <a
            key={v.videoId}
            href={v.videoId.startsWith('ph-') ? undefined : `https://www.youtube.com/watch?v=${v.videoId}`}
            target={v.videoId.startsWith('ph-') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="glass-card overflow-hidden group cursor-pointer p-0 block"
          >
            <div className="relative aspect-video">
              <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-blue-500/90 flex items-center justify-center">
                  <FiPlay className="w-4 h-4 text-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="p-2.5">
              <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{v.title}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <p className="text-xs text-gray-400 truncate flex-1">{v.description || v.channel}</p>
                {!v.videoId.startsWith('ph-') && <FiExternalLink className="w-3 h-3 text-gray-400 shrink-0" />}
              </div>
            </div>
          </a>
        ))}
      </MatchCarousel>
    </Section>
  );
}
