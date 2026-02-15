import React from 'react';
import {
    X, Globe, Bell, Monitor, Volume2, Play, Power,
    Minimize2, Calculator, Info, ChevronLeft
} from 'lucide-react';

export interface Settings {
    language: 'ar' | 'en';
    darkMode: boolean;
    soundEnabled: boolean;
    volume: number;
    startupOnBoot: boolean;
    minimizeOnClose: boolean;
    calculationMethod: number;
    adhanPreNotify: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
    language: 'ar',
    darkMode: false,
    soundEnabled: true,
    volume: 0.8,
    startupOnBoot: false,
    minimizeOnClose: true,
    calculationMethod: 4,
    adhanPreNotify: true,
};


interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
    onTestAdhan: () => void;
    onQuitApp: () => void;
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'}`}
            onClick={() => onChange(!enabled)}
        >
            <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-1' : 'left-1'}`}
            />
        </button>
    );
}

export default function SettingsModal({ isOpen, onClose, settings, onSettingsChange, onTestAdhan, onQuitApp }: SettingsModalProps) {
    const isAr = settings.language === 'ar';
    const t = (ar: string, en: string) => isAr ? ar : en;

    const update = (partial: Partial<Settings>) => {
        onSettingsChange({ ...settings, ...partial });
    };

    const dark = settings.darkMode;
    const bg = dark ? 'bg-[#0a0a0f]' : 'bg-[#f8f7ff]';
    const text = dark ? 'text-gray-100' : 'text-gray-900';
    const textSec = dark ? 'text-gray-400' : 'text-gray-500';
    const border = dark ? 'border-white/10' : 'border-gray-200';
    const sectionBg = dark ? 'bg-white/5' : 'bg-white';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex" dir={isAr ? 'rtl' : 'ltr'}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className={`relative ${isAr ? 'mr-auto' : 'ml-auto'} w-full max-w-sm h-full ${bg} shadow-2xl overflow-y-auto settings-slide-in`}>
                {/* Header */}
                <div className={`sticky top-0 ${bg} z-10 px-6 py-4 border-b ${border}`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-xl font-bold ${text}`}>{t('الإعدادات', 'Settings')}</h2>
                        <button
                            onClick={onClose}
                            className={`w-8 h-8 rounded-md ${dark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} flex items-center justify-center transition-all cursor-pointer`}
                        >
                            <X className={`w-4 h-4 ${textSec}`} />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-6 space-y-8">
                    {/* General Section */}
                    <div className="space-y-4">
                        <h3 className={`text-xs font-bold ${textSec} uppercase tracking-widest`}>{t('عام', 'General')}</h3>
                        <div className={`rounded-xl border ${border} ${sectionBg} divide-y ${border}`}>
                            <div className="flex items-center justify-between p-4">
                                <span className={`text-sm font-medium ${text}`}>{t('اللغة', 'Language')}</span>
                                <div className={`flex rounded-lg overflow-hidden border ${border}`}>
                                    <button onClick={() => update({ language: 'ar' })} className={`px-4 py-1.5 text-xs font-bold transition-all ${isAr ? 'bg-purple-600 text-white' : `${textSec} hover:bg-black/5`}`}>عربي</button>
                                    <button onClick={() => update({ language: 'en' })} className={`px-4 py-1.5 text-xs font-bold transition-all ${!isAr ? 'bg-purple-600 text-white' : `${textSec} hover:bg-black/5`}`}>English</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <span className={`text-sm font-medium ${text}`}>{t('الوضع الداكن', 'Dark Mode')}</span>
                                <ToggleSwitch enabled={dark} onChange={(v) => update({ darkMode: v })} />
                            </div>
                        </div>
                    </div>

                    {/* Adhan Section */}
                    <div className="space-y-4">
                        <h3 className={`text-xs font-bold ${textSec} uppercase tracking-widest`}>{t('الأذان', 'Adhan')}</h3>
                        <div className={`rounded-xl border ${border} ${sectionBg} divide-y ${border}`}>
                            <div className="flex items-center justify-between p-4">
                                <span className={`text-sm font-medium ${text}`}>{t('تفعيل الأذان', 'Enable Adhan')}</span>
                                <ToggleSwitch enabled={settings.soundEnabled} onChange={(v) => update({ soundEnabled: v })} />
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-medium ${text}`}>{t('مستوى الصوت', 'Volume')}</span>
                                    <span className={`text-xs font-bold ${textSec}`}>{Math.round(settings.volume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.05"
                                    value={settings.volume}
                                    onChange={(e) => update({ volume: parseFloat(e.target.value) })}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to ${isAr ? 'left' : 'right'}, #9333ea ${settings.volume * 100}%, ${dark ? '#333' : '#eee'} ${settings.volume * 100}%)`
                                    }}
                                />
                            </div>
                            <div className="p-4 space-y-2">
                                <span className={`text-sm font-medium ${text}`}>{t('طريقة الحساب', 'Calculation Method')}</span>
                                <select
                                    value={settings.calculationMethod}
                                    onChange={(e) => update({ calculationMethod: parseInt(e.target.value) })}
                                    className={`w-full p-2.5 rounded-lg border ${border} ${sectionBg} ${text} text-xs font-bold outline-none cursor-pointer focus:border-purple-500 transition-all`}
                                >
                                    <option value="1">{t('جامعة العلوم الإسلامية، كراتشي', 'Univ. of Islamic Sciences, Karachi')}</option>
                                    <option value="2">{t('الجمعية الإسلامية لأمريكا الشمالية (ISNA)', 'Islamic Society of North America (ISNA)')}</option>
                                    <option value="3">{t('رابطة العالم الإسلامي (MWL)', 'Muslim World League (MWL)')} (MWL)</option>
                                    <option value="4">{t('جامعة أم القرى، مكة', 'Umm Al-Qura University, Makkah')}</option>
                                    <option value="5">{t('الهيئة العامة المصرية للمساحة', 'Egyptian General Authority of Survey')}</option>
                                    <option value="8">{t('الخليج', 'Gulf Region')}</option>
                                    <option value="9">{t('الكويت', 'Kuwait')}</option>
                                    <option value="10">{t('قطر', 'Qatar')}</option>
                                    <option value="11">{t('سنغافورة', 'Singapore')}</option>
                                    <option value="12">{t('فرنسا', 'France')}</option>
                                    <option value="13">{t('تركيا', 'Turkey')}</option>
                                    <option value="14">{t('روسيا', 'Russia')}</option>
                                </select>
                            </div>
                            <div className="p-4">
                                <button onClick={onTestAdhan} className="w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-all active:scale-[0.98]">
                                    {t('تجربة صوت الأذان', 'Test Sound')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* App Section */}
                    <div className="space-y-4">
                        <h3 className={`text-xs font-bold ${textSec} uppercase tracking-widest`}>{t('النظام', 'System')}</h3>
                        <div className={`rounded-xl border ${border} ${sectionBg}`}>
                            <div className="flex items-center justify-between p-4">
                                <span className={`text-sm font-medium ${text}`}>{t('التشغيل عند بدء النظام', 'Start on Boot')}</span>
                                <ToggleSwitch enabled={settings.startupOnBoot} onChange={(v) => {
                                    update({ startupOnBoot: v });
                                    try { (window as any)['go']?.['main']?.['App']?.['SetStartupOnBoot']?.(v); } catch (e) { }
                                }} />
                            </div>
                            <div className="p-4 border-t border-white/5">
                                <button
                                    onClick={() => {
                                        // We need to pass a way to call getLocation here, 
                                        // but since it's in App.tsx, we can try to find another way or just rely on the main screen button.
                                        // Actually, let's just make it clear on the main screen.
                                    }}
                                    className="hidden"
                                >
                                </button>
                                <div className={`text-[10px] ${textSec} leading-relaxed mt-1 opacity-70`}>
                                    {t('* يتم تحديد الموقع بدقة عالية باستخدام GPS المتصفح.', '* Location is detected with high accuracy using browser GPS.')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quit Button */}
                    <div className="pt-6">
                        <button onClick={onQuitApp} className="w-full py-3 rounded-xl bg-red-500/10 text-red-600 text-sm font-bold hover:bg-red-500/20 transition-all">
                            {t('إغلاق التطبيق نهائياً', 'Quit Application')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

