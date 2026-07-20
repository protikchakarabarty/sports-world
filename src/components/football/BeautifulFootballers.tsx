import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';

const footballers = [
  { name: 'Alexia Putellas', nationality: 'Spain', position: 'Midfielder', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=300' },
  { name: 'Sam Kerr', nationality: 'Australia', position: 'Forward', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300' },
  { name: 'Aitana Bonmatí', nationality: 'Spain', position: 'Midfielder', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300' },
  { name: 'Ada Hegerberg', nationality: 'Norway', position: 'Forward', image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=300' },
  { name: 'Caroline Graham Hansen', nationality: 'Norway', position: 'Winger', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300' },
  { name: 'Wendie Renard', nationality: 'France', position: 'Defender', image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=300' },
];

export function BeautifulFootballers() {
  const { t } = useLanguage();

  return (
    <Section title={t("Women's Football Stars", 'মহিলা ফুটবল তারকা')} subtitle={t('Celebrating the icons of the beautiful game', 'সুন্দর খেলার আইকনদের সম্মাননা')}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {footballers.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-3 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-rose-500 p-0.5 mb-2">
              <img src={f.image} alt={f.name} className="w-full h-full object-cover rounded-full" loading="lazy" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{f.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{f.position}</p>
            <p className="text-xs text-gray-500">{f.nationality}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
