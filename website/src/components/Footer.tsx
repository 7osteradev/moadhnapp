import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
    darkMode: boolean;
    lang: 'ar' | 'en';
    translations: any;
}

const Footer: React.FC<FooterProps> = ({ darkMode, lang, translations: t }) => {
    const GITHUB_LINK = "https://github.com/7ostera/moadhnapp";

    return (
        <footer className={`py-20 border-t ${darkMode ? 'bg-[#050811] border-slate-900' : 'bg-gray-50 border-gray-100'}`}>
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <Link to="/" className="flex items-center gap-4 cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-600/20">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                            <div className="text-xl font-black">{t.title}</div>
                            <div className="text-xs font-bold opacity-40 uppercase tracking-widest leading-none mt-1">{t.subtitle}</div>
                        </div>
                    </Link>

                    <div className={`text-sm font-bold opacity-60`}>
                        {t.footer.rights.replace('{year}', new Date().getFullYear().toString())}
                    </div>

                    <div className="flex items-center gap-8">
                        <Link to="/contact" className="hover:text-primary-500 transition-colors font-bold">{t.nav.contact}</Link>
                        <Link to="/privacy" className="hover:text-primary-500 transition-colors font-bold">{t.nav.privacy}</Link>
                        <div className="flex gap-4">
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                href={GITHUB_LINK}
                                target="_blank"
                                className="px-4 py-2 rounded-xl bg-slate-500/10 hover:bg-primary-500/20 hover:text-primary-500 transition-all flex items-center gap-2 font-bold text-sm"
                            >
                                <Github className="w-4 h-4" />
                                {t.footer.sourceCode}
                            </motion.a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
