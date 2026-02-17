import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

type Language = 'ar' | 'en';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Language>('ar');
  const location = useLocation();

  const t = translations[lang];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const pageTransition = {
    initial: { opacity: 0, x: lang === 'ar' ? 20 : -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: lang === 'ar' ? -20 : 20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#0a0f1c] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        scrolled={scrolled}
        lang={lang}
        setLang={setLang}
        translations={t}
      />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname + lang}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/" element={<Home darkMode={darkMode} lang={lang} translations={t} />} />
              <Route path="/contact" element={<Contact darkMode={darkMode} lang={lang} translations={t} />} />
              <Route path="/privacy" element={<Privacy darkMode={darkMode} lang={lang} translations={t} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer darkMode={darkMode} lang={lang} translations={t} />
    </div>
  );
}

export default App;
