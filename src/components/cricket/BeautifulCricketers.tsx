import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';

const playerImageCache = new Map<string, string>();

const gradients = [
  'from-pink-500 to-rose-600',
  'from-purple-500 to-indigo-600',
  'from-fuchsia-500 to-pink-600',
  'from-rose-500 to-red-500',
  'from-violet-500 to-purple-600',
  'from-pink-400 to-rose-500',
];

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return gradients[Math.abs(hash) % gradients.length];
}

function CricketerPhoto({ name }: { name: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(() => playerImageCache.get(name) ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!playerImageCache.has(name)) {
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`)
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          const url = data?.thumbnail?.source ?? null;
          playerImageCache.set(name, url ?? '');
          if (url) setImgSrc(url);
        })
        .catch(() => { playerImageCache.set(name, ''); });
    }
  }, [name]);

  if (!imgSrc || failed) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${getGradient(name)} flex items-center justify-center`}>
        <span className="text-white text-4xl font-bold drop-shadow-lg">
          {name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={name}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

const beautifulCricketers = [
  { id: 'bc1', name: 'Ellyse Perry', country: 'Australia', role: 'All-Rounder', team: 'Australia Women', bio: 'Consistently ranked as the most beautiful, she is celebrated for her all-round brilliance, global icon status, and incredible dual-sport legacy.' },
  { id: 'bc2', name: 'Smriti Mandhana', country: 'India', role: 'Opening Batter', team: 'India Women', bio: 'Renowned for her elegant left-handed batting and charming simplicity, she boasts a massive global fan base.' },
  { id: 'bc3', name: 'Amelia Kerr', country: 'New Zealand', role: 'All-Rounder', team: 'New Zealand Women', bio: 'The talented Kiwi all-rounder is celebrated for her radiant looks and record-breaking cricketing skills.' },
  { id: 'bc4', name: 'Lauren Bell', country: 'England', role: 'Fast Bowler', team: 'England Women', bio: 'Known as "The Shard", this English fast bowler is widely admired for her striking features and tall, graceful presence.' },
  { id: 'bc5', name: 'Harleen Deol', country: 'India', role: 'Batter', team: 'India Women', bio: 'Captivating fans with both her athletic brilliance (like her viral boundary catch) and her magnetic on-screen personality.' },
  { id: 'bc6', name: 'Laura Wolvaardt', country: 'South Africa', role: 'Opening Batter', team: 'South Africa Women', bio: 'Known for her textbook cover drives and calm, natural beauty on and off the pitch.' },
  { id: 'bc7', name: 'Harmanpreet Kaur', country: 'India', role: 'Captain & Batter', team: 'India Women', bio: 'The iconic Indian captain with a powerful presence and striking elegance both on and off the field.' },
  { id: 'bc8', name: 'Jemimah Rodrigues', country: 'India', role: 'Batter', team: 'India Women', bio: 'Celebrated for her vibrant energy, infectious smile, and multifaceted talents beyond cricket.' },
  { id: 'bc9', name: 'Beth Mooney', country: 'Australia', role: 'Opening Batter', team: 'Australia Women', bio: 'The world\'s top-ranked T20I batter known for her calm beauty and match-winning grace under pressure.' },
  { id: 'bc10', name: 'Marizanne Kapp', country: 'South Africa', role: 'All-Rounder', team: 'South Africa Women', bio: 'South Africa\'s greatest all-rounder known for her fierce competitiveness and elegant charm.' },
];

export function BeautifulCricketers() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <Section
      title={t('Most Beautiful Women Cricketers', 'সবচেয়ে সুন্দরী নারী ক্রিকেটার')}
      subtitle={t('Celebrating the grace, talent and beauty of women\'s cricket', 'নারী ক্রিকেটের নৃত্যশিল্প, প্রতিভা এবং সৌন্দর্য উদযাপন')}
    >
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -ml-4"
        >
          <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2">
          {beautifulCricketers.map((player, i) => {
            const bcKey = player.id ?? player.name ?? `beautiful-${i}`;
            return (
            <motion.div
              key={bcKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="snap-start shrink-0 w-[300px] glass-card overflow-hidden group"
            >
              <div className="relative h-56 overflow-hidden">
                <CricketerPhoto name={player.name} />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all z-10">
                  <FiHeart className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-10">
                  <h3 className="text-lg font-bold text-white">{player.name}</h3>
                  <p className="text-xs text-white/80">{player.country} • {player.team}</p>
                </div>
              </div>
              <div className="p-4">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-semibold mb-2">{player.role}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{player.bio}</p>
              </div>
            </motion.div>
            );
          })}
        </div>

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
