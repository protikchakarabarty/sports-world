import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchOlympicMedalTable } from '@/services/olympicMedalService';
import type { MedalEntry } from '@/types';

export function MedalTable() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<MedalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const data = await fetchOlympicMedalTable(20);
        if (!cancelled) setEntries(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <Section title={t('Olympic Medal Table', 'অলিম্পিক মেডেল টেবিল')} subtitle={t('Paris 2024 Summer Olympics final medal standings', '২০২৪ প্যারিস অলিম্পিকের চূড়ান্ত পদক তালিকা')}>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-gray-700/50">
                <th className="text-left p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">#</th>
                <th className="text-left p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">{t('Country', 'দেশ')}</th>
                <th className="text-center p-3 font-semibold text-amber-500 text-xs uppercase">{t('Gold', 'সোনা')}</th>
                <th className="text-center p-3 font-semibold text-gray-400 text-xs uppercase">{t('Silver', 'রুপা')}</th>
                <th className="text-center p-3 font-semibold text-amber-700 text-xs uppercase">{t('Bronze', 'ব্রোঞ্জ')}</th>
                <th className="text-center p-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">{t('Total', 'মোট')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-sm">{t('Loading medal table...', 'পদক তালিকা লোড হচ্ছে...')}</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-gray-400">{t('Could not load medal table', 'পদক তালিকা লোড করা যায়নি')}</p>
                      <button
                        onClick={() => {
                          setError(false);
                          setLoading(true);
                          fetchOlympicMedalTable(20).then(setEntries).catch(() => setError(true)).finally(() => setLoading(false));
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        {t('Retry', 'পুনরায় চেষ্টা করুন')}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                entries.map((entry, i) => (
                  <motion.tr
                    key={entry.country}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-100/50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-3 font-bold text-gray-400">{i + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{entry.flag}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{entry.country}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-amber-500">{entry.gold}</td>
                    <td className="p-3 text-center font-bold text-gray-500 dark:text-gray-300">{entry.silver}</td>
                    <td className="p-3 text-center font-bold text-amber-700">{entry.bronze}</td>
                    <td className="p-3 text-center font-bold text-gray-900 dark:text-white">{entry.total}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
