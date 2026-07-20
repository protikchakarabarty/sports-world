import { FiClock } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export function ComingSoon({ message }: { message?: string }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <FiClock className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {t('Coming Soon', 'শীঘ্রই আসছে')}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
        {message || t('Data source will be added in a future update.', 'ভবিষ্যত আপডেটে ডেটা উৎস যুক্ত করা হবে।')}
      </p>
    </div>
  );
}
