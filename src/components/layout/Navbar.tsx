import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiBell, FiMenu, FiX, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { useState, useRef, useEffect } from 'react';

const sportItems = [
  { key: 'basketball', label: 'Basketball', emoji: '🏀' },
  { key: 'tennis', label: 'Tennis', emoji: '🎾' },
  { key: 'formula1', label: 'Formula 1', emoji: '🏎️' },
  { key: 'hockey', label: 'Hockey', emoji: '🏑' },
  { key: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { key: 'boxing', label: 'Boxing', emoji: '🥊' },
  { key: 'golf', label: 'Golf', emoji: '⛳' },
  { key: 'athletics', label: 'Athletics', emoji: '🏃' },
  { key: 'baseball', label: 'Baseball', emoji: '⚾' },
  { key: 'swimming', label: 'Swimming', emoji: '🏊' },
  { key: 'mma', label: 'MMA', emoji: '🥊' },
  { key: 'rugby', label: 'Rugby', emoji: '🏉' },
  { key: 'cycling', label: 'Cycling', emoji: '🚴' },
];

const navLinks = [
  { path: '/', label: { en: 'Home', bn: 'হোম' } },
  { path: '/cricket', label: { en: 'Cricket', bn: 'ক্রিকেট' } },
  { path: '/football', label: { en: 'Football', bn: 'ফুটবল' } },
];

export function Navbar() {
  const { isDark, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);
  const sportsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sportsRef.current && !sportsRef.current.contains(e.target as Node)) setSportsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">SW</span>
            </motion.div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t('Sports World', 'স্পোর্টস ওয়ার্ল্ড')}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label.en}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <div className="relative" ref={sportsRef}>
              <button
                onClick={() => setSportsOpen(!sportsOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  location.search.includes('sport=') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Sports
                <motion.span animate={{ rotate: sportsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <FiChevronDown className="w-4 h-4" />
                </motion.span>
              </button>
              <AnimatePresence>
                {sportsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50"
                  >
                    <div className="py-1 max-h-80 overflow-y-auto">
                      {sportItems.map((item) => (
                        <Link
                          key={item.key}
                          to={`/?sport=${item.key}`}
                          onClick={() => setSportsOpen(false)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                            location.search === `?sport=${item.key}`
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="text-base">{item.emoji}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FiSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Switch language"
            >
              <FiGlobe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300 ml-0.5">
                {lang.toUpperCase()}
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.label.en}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  More Sports
                </p>
                {sportItems.map((item) => (
                  <Link
                    key={item.key}
                    to={`/?sport=${item.key}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.search === `?sport=${item.key}`
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
