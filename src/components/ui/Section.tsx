import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FiChevronRight } from 'react-icons/fi';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  link?: string;
  className?: string;
  gradient?: 'default' | 'cricket' | 'football';
  id?: string;
}

const gradients = {
  default: 'gradient-text',
  cricket: 'gradient-text-cricket',
  football: 'gradient-text-football',
};

export function Section({ title, subtitle, children, link, className = '', gradient = 'default', id }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-10 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold ${gradients[gradient]}`}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {link && (
          <motion.a
            href={link}
            whileHover={{ x: 4 }}
            className="flex items-center gap-1 text-primary hover:text-primary-light text-sm font-medium transition-colors"
          >
            View All <FiChevronRight className="w-4 h-4" />
          </motion.a>
        )}
      </div>
      {children}
    </motion.section>
  );
}
