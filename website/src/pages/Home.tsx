import React from 'react';
import { motion } from 'framer-motion';
import { Download, Clock, Laptop, Bell, Shield, Settings, Globe, Apple, Terminal, Volume2, Heart } from 'lucide-react';

interface HomeProps {
    darkMode: boolean;
    lang: 'ar' | 'en';
    translations: any;
}

const Home: React.FC<HomeProps> = ({ darkMode, lang, translations: t }) => {
    const DOWNLOAD_LINK = "#";

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    const SectionWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );

    return (
        <>
            {/* Hero Section */}
            <section className="pt-40 pb-32 px-6 relative overflow-hidden">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className={`absolute -top-20 -right-20 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] filter ${darkMode ? 'opacity-30' : 'opacity-40'}`}
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -50, 0],
                            y: [0, -30, 0]
                        }}
                        transition={{ duration: 18, repeat: Infinity }}
                        className={`absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] filter ${darkMode ? 'opacity-30' : 'opacity-40'}`}
                    />
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                            className={`space-y-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                            <motion.div variants={fadeIn} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black shadow-sm ${darkMode ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-primary-50 text-primary-700 border border-primary-100'}`}>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                {t.hero.badge}
                            </motion.div>

                            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                                {t.hero.title1} <span className="text-primary-500">{t.hero.title2}</span> <br />
                                {t.hero.title3} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-400">{t.hero.title4}</span>
                            </motion.h1>

                            <motion.p variants={fadeIn} className={`text-xl lg:text-2xl leading-relaxed max-w-2xl font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {t.hero.desc}
                            </motion.p>

                            <motion.div variants={fadeIn} className={`flex flex-wrap gap-5 pt-6 ${lang === 'ar' ? '' : 'flex-row-reverse justify-end'}`}>
                                <motion.a
                                    href={DOWNLOAD_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5 }}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-5 rounded-3xl font-black text-xl transition-all shadow-2xl shadow-primary-600/30 flex items-center gap-4 group"
                                >
                                    <Download className="w-7 h-7 group-hover:animate-bounce" />
                                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                                        <div className="text-xs font-medium opacity-70">{lang === 'ar' ? 'تحميل لنظام' : 'Download for'}</div>
                                        <div>Windows 10/11</div>
                                    </div>
                                </motion.a>

                                <div className="flex gap-3">
                                    <motion.a
                                        href="#"
                                        target="_blank"
                                        whileHover={{ y: -5 }}
                                        className={`p-4 rounded-3xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-primary-500' : 'bg-white border-gray-200 hover:border-primary-500 shadow-lg'}`}
                                        title="macOS"
                                    >
                                        <Apple className="w-8 h-8 text-primary-500" />
                                    </motion.a>
                                    <motion.a
                                        href="#"
                                        target="_blank"
                                        whileHover={{ y: -5 }}
                                        className={`p-4 rounded-3xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-primary-500' : 'bg-white border-gray-200 hover:border-primary-500 shadow-lg'}`}
                                        title="Linux"
                                    >
                                        <Terminal className="w-8 h-8 text-primary-500" />
                                    </motion.a>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeIn} className="flex items-center gap-8 pt-6 text-sm font-bold opacity-50">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-500" />
                                    <span>{t.stats.noTracking}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    <span>{t.stats.openSource}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                    <span>{t.stats.allCities}</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: lang === 'ar' ? -5 : 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "backOut" }}
                            className="relative"
                        >
                            <div className={`aspect-square rounded-[4rem] border-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] ${darkMode ? 'bg-slate-900 border-slate-800 shadow-primary-900/20' : 'bg-white border-gray-100 transition-all p-12 overflow-hidden relative'}`}>
                                <div className="h-full flex flex-col items-center justify-center space-y-8">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="text-8xl font-black text-primary-600 tracking-tighter"
                                        >
                                            12:30
                                        </motion.div>
                                        <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary-500/20 blur-2xl rounded-full" />
                                    </div>
                                    <div className="text-3xl font-bold opacity-40 uppercase tracking-[0.2em]">{lang === 'ar' ? 'صلاة الظهر' : 'Dhuhr Prayer'}</div>

                                    <div className="grid grid-cols-2 gap-4 w-full px-12">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-2 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`} />
                                        ))}
                                    </div>
                                </div>

                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className={`absolute -bottom-8 -right-8 p-6 rounded-[2rem] shadow-2xl border backdrop-blur-xl ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                            <Volume2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className={`text-xs font-bold opacity-50 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'تنبيه مفعل' : 'Alert Active'}</div>
                                            <div className="font-extrabold text-lg">{lang === 'ar' ? 'صوت المدينة' : 'Madina Voice'}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={`py-32 ${darkMode ? 'bg-slate-900/30' : 'bg-white'}`}>
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionWrapper className="text-center max-w-3xl mx-auto mb-20 space-y-5">
                        <h2 className="text-4xl md:text-6xl font-black italic">{t.features.sectionTitle}</h2>
                        <p className={`text-xl font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {t.features.sectionDesc}
                        </p>
                    </SectionWrapper>

                    <div className={`grid md:grid-cols-3 gap-10 border-0 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {[
                            { icon: <Clock />, title: t.features.f1_title, desc: t.features.f1_desc },
                            { icon: <Laptop />, title: t.features.f2_title, desc: t.features.f2_desc },
                            { icon: <Bell />, title: t.features.f3_title, desc: t.features.f3_desc },
                            { icon: <Shield />, title: t.features.f4_title, desc: t.features.f4_desc },
                            { icon: <Settings />, title: t.features.f5_title, desc: t.features.f5_desc },
                            { icon: <Globe />, title: t.features.f6_title, desc: t.features.f6_desc }
                        ].map((f, i) => (
                            <SectionWrapper key={i}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className={`p-10 rounded-[2.5rem] border transition-all h-full ${darkMode ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700' : 'bg-gray-50 hover:bg-white border-transparent hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-gray-100'}`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-2xl shadow-inner ${darkMode ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                                    <p className={`text-lg leading-relaxed font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {f.desc}
                                    </p>
                                </motion.div>
                            </SectionWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section id="download" className="py-32">
                <div className="container mx-auto px-6 max-w-5xl">
                    <SectionWrapper>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={`rounded-[4rem] p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl ${darkMode ? 'bg-gradient-to-br from-primary-600 to-indigo-700' : 'bg-black text-white shadow-primary-600/20'}`}
                        >
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 text-white">{t.cta.title}</h2>
                            <p className="text-xl md:text-2xl mb-12 opacity-80 max-w-2xl mx-auto font-medium relative z-10 text-white">
                                {t.cta.desc}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                                <motion.a
                                    href={DOWNLOAD_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-primary-600 px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl flex items-center gap-3 justify-center"
                                >
                                    <Download className="w-6 h-6" />
                                    {t.cta.btn}
                                </motion.a>
                                <div className="flex gap-4 justify-center">
                                    <motion.a
                                        href="#"
                                        target="_blank"
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 shadow-xl text-white"
                                        title="macOS"
                                    >
                                        <Apple className="w-8 h-8" />
                                    </motion.a>
                                    <motion.a
                                        href="#"
                                        target="_blank"
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 shadow-xl text-white"
                                        title="Linux"
                                    >
                                        <Terminal className="w-8 h-8" />
                                    </motion.a>
                                </div>
                            </div>
                            <p className="mt-10 text-sm font-bold opacity-40 text-white">{t.cta.footer}</p>
                        </motion.div>
                    </SectionWrapper>
                </div>
            </section>
        </>
    );
};

export default Home;
