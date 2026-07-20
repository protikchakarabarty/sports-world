import { useState, useEffect } from 'react';

const playerImageCache = new Map<string, string>();

function getPhotoGradient(name: string): string {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-yellow-500',
    'from-sky-500 to-blue-500',
    'from-lime-500 to-green-500',
    'from-violet-500 to-indigo-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return gradients[Math.abs(hash) % gradients.length];
}

async function fetchPlayerImage(name: string): Promise<string | null> {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

export function PlayerPhoto({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const [imgSrc, setImgSrc] = useState<string | null>(() => playerImageCache.get(name) ?? null);
  const [failed, setFailed] = useState(false);

  const sizeClass = size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
  const textClass = size === 'lg' ? 'text-sm' : size === 'md' ? 'text-sm' : 'text-xs';

  useEffect(() => {
    if (!playerImageCache.has(name)) {
      fetchPlayerImage(name).then((url) => {
        if (url) {
          playerImageCache.set(name, url);
          setImgSrc(url);
        } else {
          playerImageCache.set(name, '');
        }
      });
    }
  }, [name]);

  if (!imgSrc || failed) {
    return (
      <div className={`flex-shrink-0 ${sizeClass} rounded-full bg-gradient-to-br ${getPhotoGradient(name)} flex items-center justify-center text-white ${textClass} font-bold shadow-lg`}>
        {name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
      </div>
    );
  }
  return (
    <img
      src={imgSrc}
      alt={name}
      className={`flex-shrink-0 ${sizeClass} rounded-full object-cover shadow-lg bg-gray-100 dark:bg-gray-800`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
