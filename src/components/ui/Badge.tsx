import { motion } from 'framer-motion';

interface BadgeProps {
  children: string;
  variant?: 'default' | 'live' | 'trending' | 'breaking' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variants: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  live: 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30',
  trending: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  breaking: 'bg-red-600 text-white',
  success: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  danger: 'bg-red-500/20 text-red-600 dark:text-red-400',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {variant === 'live' && <span className="live-dot" />}
      {children}
    </motion.span>
  );
}
