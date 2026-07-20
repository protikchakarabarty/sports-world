interface EnvConfig {
  footballApiKey: string;
  cricketApiKey: string;
  cricketRapidapiHost: string;
  cricketDataApiKey: string;
  newsApiKey: string;
  newsdataApiKey: string;
  gnewsApiKey: string;
  youtubeApiKey: string;
  geminiApiKey: string;
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
}

function requireEnv(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Add it to your .env file or set it in your environment.\n` +
      `See .env.example for the full list of required variables.`
    );
  }
  return value;
}

function optionalEnv(key: string, fallback = ''): string {
  return (import.meta.env[key] as string | undefined) ?? fallback;
}

let instance: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (instance) return instance;

  instance = {
    footballApiKey: optionalEnv('VITE_FOOTBALL_API_KEY'),
    cricketApiKey: requireEnv('VITE_CRICKET_API_KEY'),
    cricketRapidapiHost: requireEnv('VITE_CRICKET_RAPIDAPI_HOST'),
    cricketDataApiKey: optionalEnv('VITE_CRICKETDATA_API_KEY'),
    newsApiKey: requireEnv('VITE_NEWS_API_KEY'),
    newsdataApiKey: requireEnv('VITE_NEWSDATA_API_KEY'),
    gnewsApiKey: optionalEnv('VITE_GNEWS_API_KEY'),
    youtubeApiKey: optionalEnv('VITE_YOUTUBE_API_KEY'),
    geminiApiKey: optionalEnv('VITE_GEMINI_API_KEY'),
    firebaseApiKey: optionalEnv('VITE_FIREBASE_API_KEY'),
    firebaseAuthDomain: optionalEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    firebaseProjectId: optionalEnv('VITE_FIREBASE_PROJECT_ID'),
    firebaseStorageBucket: optionalEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    firebaseMessagingSenderId: optionalEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    firebaseAppId: optionalEnv('VITE_FIREBASE_APP_ID'),
  };

  return instance;
}

export function getOptionalEnv(): Partial<EnvConfig> {
  return {
    footballApiKey: optionalEnv('VITE_FOOTBALL_API_KEY'),
    cricketApiKey: optionalEnv('VITE_CRICKET_API_KEY'),
    cricketRapidapiHost: optionalEnv('VITE_CRICKET_RAPIDAPI_HOST'),
    cricketDataApiKey: optionalEnv('VITE_CRICKETDATA_API_KEY'),
    newsApiKey: optionalEnv('VITE_NEWS_API_KEY'),
    newsdataApiKey: optionalEnv('VITE_NEWSDATA_API_KEY'),
    gnewsApiKey: optionalEnv('VITE_GNEWS_API_KEY'),
    youtubeApiKey: optionalEnv('VITE_YOUTUBE_API_KEY'),
    geminiApiKey: optionalEnv('VITE_GEMINI_API_KEY'),
    firebaseApiKey: optionalEnv('VITE_FIREBASE_API_KEY'),
    firebaseAuthDomain: optionalEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    firebaseProjectId: optionalEnv('VITE_FIREBASE_PROJECT_ID'),
    firebaseStorageBucket: optionalEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    firebaseMessagingSenderId: optionalEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    firebaseAppId: optionalEnv('VITE_FIREBASE_APP_ID'),
  };
}
