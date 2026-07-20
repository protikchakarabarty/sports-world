import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const checkEnv = async () => {
  const { getOptionalEnv } = await import('@/config/env');
  const env = getOptionalEnv();
  console.log('=== ENV STATUS ===');
  console.log(`Football API enabled:   ${env.footballApiKey ? 'YES' : 'NO'}`);
  console.log(`Cricket API enabled:    ${env.cricketApiKey ? 'YES' : 'NO'}`);
  console.log(`YouTube API enabled:    ${env.youtubeApiKey ? 'YES' : 'NO'}`);
  console.log(`News API enabled:       ${env.newsApiKey ? 'YES' : 'NO'}`);
  console.log(`Gemini API enabled:     ${env.geminiApiKey ? 'YES' : 'NO'}`);
  console.log(`Groq AI enabled:        ${import.meta.env.VITE_GROQ_API_KEY ? 'YES' : 'NO'}`);
  console.log('====================');

  if (env.footballApiKey) {
    const { getCompetitions } = await import('@/services/providers/providerManager');
    console.log('[Boot] Testing football data providers...');
    try {
      const { competitions: comps, source } = await getCompetitions();
      const count = comps.length;
      if (count > 0) {
        console.log(`[Boot] Football data ✅ — ${count} competitions from ${source}`);
      } else {
        console.warn('[Boot] Football data ⚠️ — 0 competitions returned');
      }
    } catch {
      console.error('[Boot] Football data ❌ Network error');
    }
  } else {
    console.warn('[Boot] VITE_FOOTBALL_API_KEY is empty — football features will be disabled');
  }

  if (env.cricketApiKey && env.cricketRapidapiHost) {
    console.log('[Boot] Cricket API key present — will be tested when components mount');
  } else {
    console.warn('[Boot] Cricket API credentials incomplete');
  }
};
checkEnv();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
