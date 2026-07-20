import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SportsHeroProps {
  image: string;
  title: string;
  subtitle: string;
  accentGradient: string;
  overlayColor?: string;
}

const fallbackImages: Record<string, string> = {
  cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1920&q=80',
  football: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&q=80',
};

export function SportsHero({ image, title, subtitle, accentGradient, overlayColor = 'from-emerald-900/40 via-cyan-900/20' }: SportsHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgError(true);
  }, [image]);

  const displayImg = imgError ? (title.toLowerCase().includes('cricket') ? fallbackImages.cricket : fallbackImages.football) : image;

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      whileHover={{ scale: 1.002 }}
      className="relative h-[320px] sm:h-[380px] md:h-[460px] lg:h-[520px] overflow-hidden group cursor-default"
    >
      <div className="absolute inset-0 transition-all duration-700 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${displayImg})`,
            filter: imgLoaded ? 'none' : 'blur(20px)',
            transform: `scale(${imgLoaded ? 1 : 1.05})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/60 to-gray-950/30" />
        <div className={`absolute inset-0 bg-gradient-to-br ${overlayColor} to-transparent opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 via-transparent to-gray-950/10" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
        <div className="absolute top-1/4 left-1/2 w-40 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />

      <motion.div
        style={{ y: contentY }}
        className="absolute inset-0 flex items-end pb-12 md:pb-20"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white/90 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sports World Exclusive
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-white/0 rounded-2xl blur-xl" />
              <div className="relative backdrop-blur-xl bg-black/20 rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  {title}
                </h1>
                <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${accentGradient} mt-4 mb-4`} />
                <p className="text-base sm:text-lg md:text-xl text-white/80 font-light max-w-2xl">
                  {subtitle}
                </p>
                <div className="flex flex-wrap gap-3 mt-5">
                  <span className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Updates
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    Breaking News
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    Exclusive Analysis
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}
