import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Info } from 'lucide-react';

interface PrivacyProps {
    darkMode: boolean;
    lang: 'ar' | 'en';
    translations: any;
}

const Privacy: React.FC<PrivacyProps> = ({ darkMode, lang, translations: t }) => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <div className="pt-40 pb-32 container mx-auto px-6 max-w-4xl">
            <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className={`space-y-12 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
            >
                <div className="space-y-4">
                    <h1 className="text-5xl font-black">{t.privacy.title}</h1>
                    <p className={`text-xl font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.privacy.desc}</p>
                </div>

                <div className={`p-8 sm:p-12 rounded-[3rem] border leading-relaxed text-lg ${darkMode ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50 text-slate-600'}`}>
                    <div className="space-y-8">
                        <p className="font-medium text-xl leading-loose">
                            {t.privacy.content}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-slate-700/10">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-primary-500">{lang === 'ar' ? 'أمان البيانات' : 'Data Security'}</h3>
                                <p className="text-base opacity-70">{lang === 'ar' ? 'تشفير كامل لكافة الإعدادات المخزنة محلياً لضمان عدم وصول أي طرف خارجي لها.' : 'Full encryption for all locally stored settings to ensure no external party can access them.'}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                                    <Info className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-primary-500">{lang === 'ar' ? 'شفافية الكود' : 'Code Transparency'}</h3>
                                <p className="text-base opacity-70">{lang === 'ar' ? 'بما أن التطبيق مفتوح المصدر، يمكنك مراجعة الكود بنفسك للتأكد من خلوه من أي تتبع.' : 'Since the app is open source, you can review the code yourself to ensure no tracking exists.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Privacy;
