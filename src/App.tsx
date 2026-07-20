import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BookmarkProvider } from '@/contexts/BookmarkContext';
import Home from '@/pages/Home';
import Cricket from '@/pages/Cricket';
import Football from '@/pages/Football';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BookmarkProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cricket" element={<Cricket />} />
                <Route path="/football" element={<Football />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </BookmarkProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
