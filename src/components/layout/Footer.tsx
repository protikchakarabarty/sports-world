import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiYoutube, FiInstagram, FiMail } from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Sports World</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Your premium destination for global sports news, live scores, rankings, and everything sports.
            </p>
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiYoutube, FiInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/cricket" className="hover:text-primary transition-colors">Cricket</Link></li>
              <li><Link to="/football" className="hover:text-primary transition-colors">Football</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Top Sports</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/?sport=basketball" className="hover:text-primary transition-colors">🏀 Basketball</Link></li>
              <li><Link to="/?sport=tennis" className="hover:text-primary transition-colors">🎾 Tennis</Link></li>
              <li><Link to="/?sport=formula1" className="hover:text-primary transition-colors">🏎️ Formula 1</Link></li>
              <li><Link to="/?sport=boxing" className="hover:text-primary transition-colors">🥊 Boxing</Link></li>
              <li><Link to="/?sport=athletics" className="hover:text-primary transition-colors">🏃 Athletics</Link></li>
              <li><Link to="/?sport=cycling" className="hover:text-primary transition-colors">🚴 Cycling</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><FiMail className="w-3 h-3" /> Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Sports World. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
