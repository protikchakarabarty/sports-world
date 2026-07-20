import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';

export type Gender = 'men' | 'women';

interface GenderSwitcherProps {
  gender: Gender;
  onChange: (g: Gender) => void;
}

const tabs: { key: Gender; label: string; icon: string }[] = [
  { key: 'men', label: 'Men', icon: '♂' },
  { key: 'women', label: 'Women', icon: '♀' },
];

export function GenderSwitcher({ gender, onChange }: GenderSwitcherProps) {
  return (
    <div className="flex items-center justify-center -mt-6 mb-8 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl p-1 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
      >
        <FiUsers className="w-4 h-4 text-gray-400 ml-2" />
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(tab.key)}
            className={`relative px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
              gender === tab.key
                ? 'text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {gender === tab.key && (
              <motion.div
                layoutId="gender-bg"
                className={`absolute inset-0 rounded-xl ${
                  tab.key === 'men'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500'
                } shadow-lg`}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10 text-lg leading-none">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

export function getGenderAccent(gender: Gender): string {
  return gender === 'men'
    ? 'from-blue-500 to-indigo-500'
    : 'from-pink-500 to-rose-500';
}

export function getGenderAccentLight(gender: Gender): string {
  return gender === 'men'
    ? 'from-blue-500/10 to-indigo-500/10 border-blue-500/20'
    : 'from-pink-500/10 to-rose-500/10 border-pink-500/20';
}

export function getGenderTextAccent(gender: Gender): string {
  return gender === 'men'
    ? 'text-blue-500 dark:text-blue-400'
    : 'text-pink-500 dark:text-pink-400';
}
