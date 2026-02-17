import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Download, Moon, Sun, Github, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
    scrolled: boolean;
    lang: 'ar' | 'en';
    setLang: (val: 'ar' | 'en') => void;
    translations: any;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, scrolled, lang, setLang, translations: t }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    const GITHUB_LINK = "https://github.com/7ostera/moadhnapp";

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? (darkMode ? 'bg-[#0a0f1c]/90 border-slate-800 py-3' : 'bg-white/90 border-gray-200 py-3') : 'bg-transparent py-5'} backdrop-blur-md border-b border-transparent`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <motion.div
                        initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${darkMode ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-600 text-white'}`}
                    >
                        <Bell className="w-6 h-6" />
                    </motion.div>
                    <span className="text-xl font-black tracking-tight">{t.title}</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-bold opacity-70">
                    {isHome ? (
                        <>
                            {[
                                { id: 'features', label: t.nav.features },
                                { id: 'download', label: t.nav.download },
                                { id: 'about', label: t.nav.about }
                            ].map((item, i) => (
                                <motion.a
                                    key={item.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    href={`#${item.id}`}
                                    className="hover:text-primary-500 transition-colors relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                                </motion.a>
                            ))}
                        </>
                    ) : (
                        <Link
                            to="/"
                            className="hover:text-primary-500 transition-colors flex items-center gap-2"
                        >
                            {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                            {lang === 'ar' ? 'الرئيسية' : 'Home'}
                        </Link>
                    )}
                    <Link to="/contact" className={`hover:text-primary-500 transition-colors ${location.pathname === '/contact' ? 'text-primary-500' : ''}`}>
                        {t.nav.contact}
                    </Link>
                    <Link to="/privacy" className={`hover:text-primary-500 transition-colors ${location.pathname === '/privacy' ? 'text-primary-500' : ''}`}>
                        {t.nav.privacy}
                    </Link>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${darkMode ? 'bg-slate-800 text-primary-400' : 'bg-gray-100 text-primary-600'}`}
                    >
                        {lang === 'ar' ? 'English' : 'العربية'}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-gray-100 text-slate-600'}`}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.button>

                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={GITHUB_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'}`}
                    >
                        <Github className="w-5 h-5" />
                    </motion.a>

                    <a
                        href="#download"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl font-bold transition-all shadow-xl shadow-primary-600/20 hidden sm:flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>{t.hero.downloadSub}</span>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
