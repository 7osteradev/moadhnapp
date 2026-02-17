import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MessageSquare } from 'lucide-react';

interface ContactProps {
    darkMode: boolean;
    lang: 'ar' | 'en';
    translations: any;
}

const Contact: React.FC<ContactProps> = ({ darkMode, lang, translations: t }) => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <div className="pt-40 pb-32 container mx-auto px-6 max-w-3xl">
            <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="space-y-12"
            >
                <div className={`space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h1 className="text-5xl font-black">{t.contact.title}</h1>
                    <p className={`text-xl font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.contact.desc}</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`block text-sm font-bold opacity-60 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.contact.name}</label>
                            <div className="relative">
                                <User className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 opacity-40`} />
                                <input
                                    type="text"
                                    className={`w-full p-4 ${lang === 'ar' ? 'pr-12' : 'pl-12'} rounded-2xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-primary-500 outline-none' : 'bg-white border-gray-200 focus:border-primary-500 outline-none shadow-sm'}`}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={`block text-sm font-bold opacity-60 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.contact.email}</label>
                            <div className="relative">
                                <Mail className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 opacity-40`} />
                                <input
                                    type="email"
                                    className={`w-full p-4 ${lang === 'ar' ? 'pr-12' : 'pl-12'} rounded-2xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-primary-500 outline-none' : 'bg-white border-gray-200 focus:border-primary-500 outline-none shadow-sm'}`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={`block text-sm font-bold opacity-60 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.contact.message}</label>
                        <div className="relative">
                            <MessageSquare className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 opacity-40`} />
                            <textarea
                                rows={5}
                                className={`w-full p-4 ${lang === 'ar' ? 'pr-12' : 'pl-12'} rounded-2xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-primary-500 outline-none' : 'bg-white border-gray-200 focus:border-primary-500 outline-none shadow-sm'}`}
                            />
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-600/20 transition-all text-lg"
                    >
                        {t.contact.send}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Contact;
