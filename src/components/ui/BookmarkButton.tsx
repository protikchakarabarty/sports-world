import { motion } from 'framer-motion';
import { FiBookmark } from 'react-icons/fi';
import { useBookmark } from '@/contexts/BookmarkContext';

interface BookmarkButtonProps {
  id: string;
}

export function BookmarkButton({ id }: BookmarkButtonProps) {
  const { toggle, isBookmarked } = useBookmark();
  const saved = isBookmarked(id);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }}
      className={`p-1.5 rounded-lg transition-colors ${
        saved
          ? 'text-primary bg-primary/10'
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
    >
      <FiBookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
    </motion.button>
  );
}
