import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';

function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return '';
  try {
    const cp = [...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
    return String.fromCodePoint(...cp);
  } catch {
    return '';
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

interface Player {
  name: string;
  nationality: string;
  flag: string;
  position: string;
  club: string;
  age: number;
  social: string;
  image: string;
}

const ALL_PLAYERS: Player[] = [
  { name: 'Alisha Lehmann',     nationality: 'Switzerland', flag: 'ch', position: 'Forward',  club: 'Aston Villa',  age: 26, social: '@alishalehmann',   image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lewes_FC_Women_0_West_Ham_Utd_Women_5_pre_season_12_08_2018-614_%2829081676397%29_%28cropped%29.jpg/330px-Lewes_FC_Women_0_West_Ham_Utd_Women_5_pre_season_12_08_2018-614_%2829081676397%29_%28cropped%29.jpg' },
  { name: 'Ana Maria Markovi\u0107', nationality: 'Croatia', flag: 'hr', position: 'Forward',  club: 'Grasshopper',  age: 25, social: '@anamariamarkovic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/LS3_1091-1_%2853332368764%29_%28cropped%29.jpg/330px-LS3_1091-1_%2853332368764%29_%28cropped%29.jpg' },
  { name: 'Jordyn Huitema',     nationality: 'Canada',      flag: 'ca', position: 'Forward',  club: 'Seattle Reign', age: 24, social: '@jordynhuitema',    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Jordyn_Huitema_Canada_v_Argentina_Mar_7_2026-29_%28cropped%29.jpg/330px-Jordyn_Huitema_Canada_v_Argentina_Mar_7_2026-29_%28cropped%29.jpg' },
  { name: 'Alex Morgan',         nationality: 'USA',         flag: 'us', position: 'Forward',  club: 'San Diego Wave', age: 36, social: '@alexmorgan',       image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Alex_Morgan_May19.jpg/330px-Alex_Morgan_May19.jpg' },
  { name: 'Ellie Carpenter',    nationality: 'Australia',   flag: 'au', position: 'Defender', club: 'Lyon',           age: 25, social: '@elliecarpenter',   image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/20250905-Ellie_Carpenter.jpg/330px-20250905-Ellie_Carpenter.jpg' },
  { name: 'Kosovare Asllani',   nationality: 'Sweden',      flag: 'se', position: 'Midfielder', club: 'AC Milan',      age: 35, social: '@kosovareasllani',  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Kosovare_Asllani_2021.jpg/330px-Kosovare_Asllani_2021.jpg' },
  { name: 'Lauren Hemp',        nationality: 'England',     flag: 'gb-eng', position: 'Winger', club: 'Manchester City', age: 24, social: '@laurenhemp',      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/20250905-Lauren_Hemp.jpg/330px-20250905-Lauren_Hemp.jpg' },
  { name: 'Chloe Kelly',        nationality: 'England',     flag: 'gb-eng', position: 'Winger', club: 'Manchester City', age: 27, social: '@chloekelly',      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/On_29.07.England_Lionesses_Bus_Celebration_-_The_Mall%2C_Lond2025_11_%28cropped-J1%29.jpg/330px-On_29.07.England_Lionesses_Bus_Celebration_-_The_Mall%2C_Lond2025_11_%28cropped-J1%29.jpg' },
  { name: 'Sakina Karchaoui',   nationality: 'France',      flag: 'fr', position: 'Defender', club: 'Paris Saint-Germain', age: 29, social: '@sakinakarchaoui', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sakina_Karchaoui_PSG-ManU.png/330px-Sakina_Karchaoui_PSG-ManU.png' },
  { name: 'Lucy Bronze',        nationality: 'England',     flag: 'gb-eng', position: 'Defender', club: 'Chelsea',      age: 33, social: '@lucybronze',      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/20250510-Lucy_Bronze_%28cropped_-_portrait%29.jpg/330px-20250510-Lucy_Bronze_%28cropped_-_portrait%29.jpg' },
  { name: 'Leah Williamson',    nationality: 'England',     flag: 'gb-eng', position: 'Defender', club: 'Arsenal',      age: 28, social: '@leahwilliamson',   image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Leah_Williamson_2022_%28cropped%29.jpg/330px-Leah_Williamson_2022_%28cropped%29.jpg' },
  { name: 'Jill Roord',         nationality: 'Netherlands', flag: 'nl', position: 'Midfielder', club: 'Manchester City', age: 28, social: '@jillroord',       image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Jill_Roord_2023_%28cropped%29.jpg/330px-Jill_Roord_2023_%28cropped%29.jpg' },
  { name: 'Fridolina Rolf\u00f6', nationality: 'Sweden',     flag: 'se', position: 'Forward',  club: 'Barcelona',      age: 31, social: '@fridolinarolfo',   image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Fridolina_Rolf%C3%B6_2023_%28cropped%29.jpg/330px-Fridolina_Rolf%C3%B6_2023_%28cropped%29.jpg' },
  { name: 'Giulia Gwinn',       nationality: 'Germany',     flag: 'de', position: 'Midfielder', club: 'Bayern Munich', age: 25, social: '@giuliagwinn',      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Giulia_Gwinn_2024_%28cropped%29.jpg/330px-Giulia_Gwinn_2024_%28cropped%29.jpg' },
  { name: 'Alexia Putellas',    nationality: 'Spain',       flag: 'es', position: 'Midfielder', club: 'Barcelona',      age: 31, social: '@alexiaputellas',   image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Alexia_Putellas_2024_%28cropped%29.jpg/330px-Alexia_Putellas_2024_%28cropped%29.jpg' },
  { name: 'Aitana Bonmat\u00ed',  nationality: 'Spain',       flag: 'es', position: 'Midfielder', club: 'Barcelona',      age: 27, social: '@aitanabonmati',    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Aitana_Bonmat%C3%AD_2024_%28cropped%29.jpg/330px-Aitana_Bonmat%C3%AD_2024_%28cropped%29.jpg' },
  { name: 'Caroline Graham Hansen', nationality: 'Norway',  flag: 'no', position: 'Winger',   club: 'Barcelona',      age: 30, social: '@carolinegh',       image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Caroline_Graham_Hansen_2023_%28cropped%29.jpg/330px-Caroline_Graham_Hansen_2023_%28cropped%29.jpg' },
  { name: 'Sam Kerr',           nationality: 'Australia',   flag: 'au', position: 'Forward',  club: 'Chelsea',        age: 31, social: '@samkerr',          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Sam_Kerr_2023_%28cropped%29.jpg/330px-Sam_Kerr_2023_%28cropped%29.jpg' },
  { name: 'Ada Hegerberg',      nationality: 'Norway',      flag: 'no', position: 'Forward',  club: 'Lyon',           age: 29, social: '@adahegerberg',     image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Ada_Hegerberg_2022_%28cropped%29.jpg/330px-Ada_Hegerberg_2022_%28cropped%29.jpg' },
  { name: 'Pernille Harder',    nationality: 'Denmark',     flag: 'dk', position: 'Midfielder', club: 'Bayern Munich', age: 32, social: '@pernilleharder',   image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pernille_Harder%2C_V%C3%A5lerenga_Fotball_Damer_v_FC_Bayern_M%C3%BCnchen_Frauen%2C_21_November_2024_05_%28cropped%29.jpg/330px-Pernille_Harder%2C_V%C3%A5lerenga_Fotball_Damer_v_FC_Bayern_M%C3%BCnchen_Frauen%2C_21_November_2024_05_%28cropped%29.jpg' },
];

function PlayerPhoto({ player, onFail }: { player: Player; onFail: () => void }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    const initials = getInitials(player.name);
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 shrink-0">
        <span className="text-white text-3xl font-bold drop-shadow-md">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={player.image}
      alt={player.name}
      className="w-full h-48 object-cover shrink-0"
      loading="lazy"
      onError={() => {
        setImgError(true);
        onFail();
      }}
    />
  );
}

export function WomenBeautifulFootballers() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [failedPlayers, setFailedPlayers] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    const pool = ALL_PLAYERS.filter((p) => !failedPlayers.has(p.name));
    if (pool.length === 0) return ALL_PLAYERS.slice(0, 10);
    return pool.slice(0, 10);
  }, [failedPlayers]);

  const handleImageFail = (name: string) => {
    setFailedPlayers((prev) => {
      if (prev.has(name)) return prev;
      const next = new Set(prev);
      next.add(name);
      return next;
    });
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <Section
      title={t('Most Beautiful Women Footballers', 'সবচেয়ে সুন্দরী মহিলা ফুটবলার')}
      subtitle={t('Top 10 Prettiest Women Footballers', 'শীর্ষ ১০ সুন্দরী মহিলা ফুটবলার')}
    >
      <div className="relative">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors -ml-4"
        >
          <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Scroll row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
        >
          {visible.map((player, i) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="snap-start shrink-0"
            >
              <div className="w-[220px] glass-card rounded-xl overflow-hidden hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1">
                {/* Photo */}
                <PlayerPhoto player={player} onFail={() => handleImageFail(player.name)} />

                {/* Info */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {player.name}
                    </h3>
                    {i < 3 && (
                      <span className="text-xs shrink-0">
                        {['👑', '🥈', '🥉'][i]}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-sm">{flagEmoji(player.flag)}</span>
                    <span className="truncate">{player.nationality}</span>
                  </div>

                  <div className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                    <span>{player.club}</span>
                    <span className="mx-1">·</span>
                    <span>{player.position}</span>
                    <span className="mx-1">·</span>
                    <span>{player.age}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 pt-0.5">
                    <FiInstagram className="w-3 h-3" />
                    <span className="truncate">{player.social}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right scroll button */}
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
