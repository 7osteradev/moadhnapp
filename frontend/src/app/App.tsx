import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sunrise, Sun, Sunset, Moon, CloudMoon, MapPin, Calendar, Clock,
  Volume2, VolumeX, Loader2, MapPinOff, RefreshCw, AlertTriangle,
  Navigation, SunMedium, MoonStar, Settings as SettingsIcon, Play,
  Minimize2, Bell, Minus, Square, X
} from 'lucide-react';
import SettingsModal, { Settings, DEFAULT_SETTINGS } from './components/SettingsModal';
import AdhanAlert from './components/AdhanAlert';

interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
  time24: string;
  icon: React.ReactNode;
  isNext: boolean;
}

interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

const toWesternDigits = (str: string): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let result = str;
  arabicDigits.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, 'g'), index.toString());
  });
  return result;
};

// Load settings from localStorage
function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem('moadhn-settings');
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch (e) { }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(s: Settings) {
  localStorage.setItem('moadhn-settings', JSON.stringify(s));
  // Also save to backend if available
  try {
    (window as any)['go']?.['main']?.['App']?.['SaveSettings']?.(JSON.stringify(s));
  } catch (e) { }
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPrayer, setSelectedPrayer] = useState<number | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [rawTimings, setRawTimings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [appVisible, setAppVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [adhanAlert, setAdhanAlert] = useState<{ visible: boolean; name: string; nameAr: string }>({ visible: false, name: '', nameAr: '' });
  const alertedPrayersRef = useRef<Set<string>>(new Set());
  const lastDateRef = useRef<string>('');

  const isAr = settings.language === 'ar';
  const darkMode = settings.darkMode;

  // Save settings on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setAppVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Adhan alarm check - every second
  useEffect(() => {
    if (prayerTimes.length === 0 || !settings.soundEnabled) return;
    const now = currentTime;
    const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    // Reset alerted prayers on new day
    if (lastDateRef.current !== todayStr) {
      alertedPrayersRef.current.clear();
      lastDateRef.current = todayStr;
    }

    const currentHH = String(now.getHours()).padStart(2, '0');
    const currentMM = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHH}:${currentMM}`;

    prayerTimes.forEach((prayer) => {
      const prayerTime24 = prayer.time24;
      if (prayerTime24 === currentTimeStr && now.getSeconds() === 0) {
        if (!alertedPrayersRef.current.has(prayer.name)) {
          alertedPrayersRef.current.add(prayer.name);
          setAdhanAlert({ visible: true, name: prayer.name, nameAr: prayer.nameAr });
          // Call Go to show the separate small window
          try {
            (window as any)['go']?.['main']?.['App']?.['ShowAdhanWindow']?.();
          } catch (e) { }
        }
      }
    });
  }, [currentTime, prayerTimes, settings.soundEnabled]);

  // Fetch prayer times
  const fetchPrayerTimes = useCallback(async (lat: number, lng: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${settings.calculationMethod}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      const data = await response.json();

      if (data.code === 200) {
        const timings = data.data.timings;
        const dateInfo = data.data.date;
        setRawTimings(timings);

        const hijriDateStr = toWesternDigits(
          `${dateInfo.hijri.day} ${dateInfo.hijri.month.ar} ${dateInfo.hijri.year}`
        );
        setHijriDate(hijriDateStr);

        const formatTime = (time: string) => {
          const [hours, minutes] = time.split(':');
          const hour = parseInt(hours);
          const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          return `${hour12.toString().padStart(2, '0')}:${minutes}`;
        };

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const prayers: PrayerTime[] = [
          { name: 'Fajr', nameAr: 'الفجر', time: formatTime(timings.Fajr), time24: timings.Fajr, icon: <Sunrise className="w-7 h-7 sm:w-8 sm:h-8" />, isNext: false },
          { name: 'Dhuhr', nameAr: 'الظهر', time: formatTime(timings.Dhuhr), time24: timings.Dhuhr, icon: <Sun className="w-7 h-7 sm:w-8 sm:h-8" />, isNext: false },
          { name: 'Asr', nameAr: 'العصر', time: formatTime(timings.Asr), time24: timings.Asr, icon: <CloudMoon className="w-7 h-7 sm:w-8 sm:h-8" />, isNext: false },
          { name: 'Maghrib', nameAr: 'المغرب', time: formatTime(timings.Maghrib), time24: timings.Maghrib, icon: <Sunset className="w-7 h-7 sm:w-8 sm:h-8" />, isNext: false },
          { name: 'Isha', nameAr: 'العشاء', time: formatTime(timings.Isha), time24: timings.Isha, icon: <Moon className="w-7 h-7 sm:w-8 sm:h-8" />, isNext: false }
        ];

        let nextPrayerIndex = -1;
        let minDiff = Infinity;
        prayers.forEach((prayer, index) => {
          const [h, m] = prayer.time24.split(':');
          const pMin = parseInt(h) * 60 + parseInt(m);
          const diff = pMin - currentMinutes;
          if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextPrayerIndex = index;
          }
        });
        if (nextPrayerIndex !== -1) prayers[nextPrayerIndex].isNext = true;

        setPrayerTimes(prayers);
        setLoading(false);
        setError(null);
        setErrorDetails(null);
      } else {
        setError(isAr ? 'فشل في جلب أوقات الصلاة' : 'Failed to fetch prayer times');
        setErrorDetails(isAr ? 'الخادم أرجع استجابة غير صحيحة.' : 'Server returned an invalid response.');
        setLoading(false);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError(isAr ? 'انتهت مهلة الاتصال' : 'Connection timed out');
        setErrorDetails(isAr ? 'تأكد من اتصالك بالإنترنت.' : 'Check your internet connection.');
      } else {
        setError(isAr ? 'فشل في الاتصال بالخادم' : 'Failed to connect');
        setErrorDetails(isAr ? 'تحقق من اتصالك بالإنترنت.' : 'Check your internet connection.');
      }
      setLoading(false);
    }
  }, [settings.calculationMethod, isAr]);

  // Get location
  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    setRetrying(false);

    if (!navigator.geolocation) {
      setError(isAr ? 'لا يدعم تحديد الموقع' : 'Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          const geoData = await geoResponse.json();
          setLocation({
            city: geoData.city || geoData.locality || (isAr ? 'غير معروف' : 'Unknown'),
            country: geoData.countryName || (isAr ? 'غير معروف' : 'Unknown'),
            latitude, longitude
          });
          await fetchPrayerTimes(latitude, longitude);
        } catch (err) {
          setLocation({ city: isAr ? 'غير معروف' : 'Unknown', country: isAr ? 'غير معروف' : 'Unknown', latitude, longitude });
          await fetchPrayerTimes(latitude, longitude);
        }
      },
      (err) => {
        const msgs: Record<number, [string, string]> = {
          1: [isAr ? 'تم رفض إذن تحديد الموقع' : 'Location permission denied', isAr ? 'الرجاء السماح بالوصول إلى موقعك.' : 'Please allow location access.'],
          2: [isAr ? 'تعذر تحديد الموقع' : 'Position unavailable', isAr ? 'تأكد من تفعيل GPS.' : 'Make sure GPS is enabled.'],
          3: [isAr ? 'انتهت مهلة تحديد الموقع' : 'Location timeout', isAr ? 'حاول مرة أخرى.' : 'Please try again.'],
        };
        const [e, d] = msgs[err.code] || [isAr ? 'خطأ غير متوقع' : 'Unexpected error', ''];
        setError(e);
        setErrorDetails(d);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, [fetchPrayerTimes, isAr]);

  useEffect(() => { getLocation(); }, [getLocation]);

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const formatDate = (date: Date) => {
    if (isAr) {
      const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      return `${days[date.getDay()]}، ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTimeRemaining = () => {
    const nextPrayer = prayerTimes.find(p => p.isNext);
    if (!nextPrayer) return { hours: 0, minutes: 0, seconds: 0, percentage: 0 };
    const [h, m] = nextPrayer.time24.split(':');
    const pt = new Date();
    pt.setHours(parseInt(h), parseInt(m), 0, 0);
    const diff = pt.getTime() - currentTime.getTime();
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      percentage: Math.max(0, Math.min(100, ((6 * 3600 - totalSeconds) / (6 * 3600)) * 100))
    };
  };

  const timeRemaining = getTimeRemaining();

  const handleTestAdhan = () => {
    setAdhanAlert({ visible: true, name: 'Test', nameAr: 'تجربة' });
    try {
      (window as any)['go']?.['main']?.['App']?.['ShowAdhanWindow']?.();
    } catch (e) { }
  };

  const handleDismissAdhan = () => {
    setAdhanAlert({ visible: false, name: '', nameAr: '' });
    try {
      (window as any)['go']?.['main']?.['App']?.['HideMainWindow']?.();
    } catch (e) { }
  };

  const handleQuitApp = () => {
    try {
      (window as any)['go']?.['main']?.['App']?.['QuitApp']?.();
    } catch (e) {
      window.close();
    }
  };

  const handleMinimize = () => {
    try {
      (window as any)['go']?.['main']?.['App']?.['MinimizeMainWindow']?.();
    } catch (e) { }
  };

  const handleMaximize = () => {
    try {
      (window as any)['go']?.['main']?.['App']?.['ToggleMaximize']?.();
    } catch (e) { }
  };

  const handleClose = () => {
    try {
      (window as any)['go']?.['main']?.['App']?.['CloseWindow']?.();
    } catch (e) { }
  };

  // Theme colors
  const t = {
    bgGradient: darkMode ? 'bg-[#0a0a0f]' : 'bg-[#f8f7ff]',
    card: darkMode ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-white border-gray-200',
    cardHover: darkMode ? 'hover:bg-white/[0.06]' : 'hover:bg-gray-50',
    cardSelected: darkMode ? 'bg-white/[0.08] border-purple-500/50' : 'bg-purple-50 border-purple-200',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    textMuted: darkMode ? 'text-gray-500' : 'text-gray-400',
    glassCard: darkMode ? 'bg-[#12121e] border-white/[0.05]' : 'bg-white border-gray-200',
    accent: darkMode ? 'text-purple-400' : 'text-purple-600',
    accentBg: darkMode ? 'from-purple-400 to-violet-400' : 'from-purple-600 to-violet-600',
    nextCard: darkMode
      ? 'bg-purple-600 text-white'
      : 'bg-purple-600 text-white',
    loadingBg: darkMode ? 'bg-[#12121e]' : 'bg-white',
    errorBg: darkMode ? 'bg-red-500/10' : 'bg-red-50',
    errorText: darkMode ? 'text-red-400' : 'text-red-600',
    errorIcon: darkMode ? 'text-red-400' : 'text-red-500',
    switchOff: darkMode ? 'bg-gray-700' : 'bg-gray-200',
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${t.bgGradient} ${appVisible ? 'opacity-100' : 'opacity-0'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div
        className={`fixed top-0 left-0 right-0 h-10 z-[100] flex items-center justify-between pl-4 pr-0 ${darkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-white text-gray-700'} border-b ${darkMode ? 'border-white/5' : 'border-gray-200'}`}
        style={{ "--wails-draggable": "drag" } as any}
        dir="ltr"
      >
        <div className="flex items-center gap-2" dir={isAr ? 'rtl' : 'ltr'}>
          <Bell className={`w-4 h-4 ${t.accent}`} />
          <span className="text-xs font-medium tracking-tight opacity-80">
            {isAr ? 'تطبيق مؤذن' : 'Moadhn App'}
          </span>
        </div>

        <div className="flex items-center h-full" style={{ "--wails-draggable": "no-drag" } as any}>
          <button onClick={() => setSettings(s => ({ ...s, darkMode: !s.darkMode }))}
            className={`h-10 px-3 flex items-center justify-center transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer`}
            aria-label="Toggle theme">
            {darkMode ? <SunMedium className="w-4 h-4 text-amber-400" /> : <MoonStar className="w-4 h-4 text-indigo-500" />}
          </button>

          <button onClick={() => setSettingsOpen(true)}
            className={`h-10 px-3 flex items-center justify-center transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer`}
            aria-label="Settings">
            <SettingsIcon className={`w-4 h-4 opacity-70`} />
          </button>

          <div className="w-[1px] h-4 bg-gray-500/20 mx-1" />

          <button onClick={handleMinimize}
            className={`h-10 w-12 flex items-center justify-center transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer`}
            aria-label="Minimize">
            <Minus className="w-4 h-4" />
          </button>

          <button onClick={handleMaximize}
            className={`h-10 w-12 flex items-center justify-center transition-all hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer`}
            aria-label="Maximize">
            <Square className="w-3 h-3" />
          </button>

          <button onClick={handleClose}
            className={`h-10 w-12 flex items-center justify-center transition-all hover:bg-red-600 hover:text-white cursor-pointer`}
            aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8 max-w-7xl">
        {/* Adhan Mode - Hide EVERYTHING else when alert is active */}
        {!adhanAlert.visible && (
          <>
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
                <Loader2 className={`w-12 h-12 ${t.accent} animate-spin mb-4`} />
                <p className={`text-lg ${t.text} font-medium`}>{isAr ? 'جاري تحديد موقعك...' : 'Detecting your location...'}</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn text-center">
                <div className={`w-16 h-16 rounded-full ${t.errorBg} flex items-center justify-center mx-auto mb-4`}>
                  <MapPinOff className={`w-8 h-8 ${t.errorIcon}`} />
                </div>
                <h2 className={`text-xl font-bold ${t.text} mb-2`}>{error}</h2>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg transition-all font-medium mx-auto cursor-pointer"
                  onClick={() => { setRetrying(true); getLocation(); }} disabled={retrying}>
                  {isAr ? 'إعادة المحاولة' : 'Retry'}
                </button>
              </div>
            )}

            {/* Main content */}
            {!loading && !error && (
              <div className="animate-fadeIn">
                {/* Location & Date */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${t.card}`}>
                    <MapPin className={`w-4 h-4 ${t.accent}`} />
                    <span className={`text-sm font-medium ${t.text}`}>{location?.city}, {location?.country}</span>
                    <button
                      onClick={getLocation}
                      className={`ml-2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer`}
                      title={isAr ? 'تحديث الموقع' : 'Refresh Location'}
                    >
                      <RefreshCw className={`w-3 h-3 ${t.textSecondary}`} />
                    </button>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${t.card}`}>
                    <Calendar className={`w-4 h-4 ${t.accent}`} />
                    <span className={`text-sm font-medium ${t.text}`}>{hijriDate}</span>
                  </div>
                </div>

                {/* Digital clock */}
                <div className="max-w-md mx-auto mb-12">
                  <div className="text-center">
                    <div className={`text-6xl sm:text-7xl font-bold ${t.text} tracking-tight`} dir="ltr">
                      {formatTime(currentTime)}
                    </div>
                    <p className={`${t.textSecondary} mt-2 text-lg`}>{formatDate(currentTime)}</p>
                  </div>
                </div>

                {/* بطاقات أوقات الصلاة */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
                  {prayerTimes.map((prayer, index) => (
                    <div key={index} className="prayer-card"
                      onClick={() => setSelectedPrayer(selectedPrayer === index ? null : index)}>
                      <div className={`rounded-xl p-5 border transition-all ${prayer.isNext ? `${t.nextCard}`
                        : selectedPrayer === index ? `${t.cardSelected}`
                          : `${t.card} ${t.cardHover}`
                        }`}>
                        <div className="flex justify-between items-center mb-3">
                          <div className={prayer.isNext ? 'text-white' : t.accent}>{prayer.icon}</div>
                          {prayer.isNext && (
                            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                              {isAr ? 'القادمة' : 'Next'}
                            </span>
                          )}
                        </div>
                        <h3 className={`text-lg font-bold ${prayer.isNext ? 'text-white' : t.text}`}>
                          {isAr ? prayer.nameAr : prayer.name}
                        </h3>
                        <div className={`text-2xl font-bold mt-1 ${prayer.isNext ? 'text-white' : t.accent}`}>
                          {prayer.time}
                        </div>

                        {prayer.isNext && (
                          <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="opacity-80">{isAr ? 'المتبقي' : 'Remaining'}</span>
                              <span className="font-bold font-mono">
                                {String(timeRemaining.hours).padStart(2, '0')}:
                                {String(timeRemaining.minutes).padStart(2, '0')}:
                                {String(timeRemaining.seconds).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: `${timeRemaining.percentage}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                  {/* Sound toggle */}
                  <div className={`p-4 rounded-xl border ${t.card} flex-1 w-full`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center`}>
                          {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" /> : <VolumeX className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${t.text}`}>{isAr ? 'تنبيهات الأذان' : 'Adhan Alerts'}</h4>
                        </div>
                      </div>
                      <button className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.soundEnabled ? 'bg-purple-600' : t.switchOff}`}
                        onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.soundEnabled ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')}`} />
                      </button>
                    </div>
                  </div>

                  {/* Test adhan button */}
                  <button onClick={handleTestAdhan}
                    className={`p-4 rounded-xl border ${t.card} ${t.cardHover} flex items-center gap-3 transition-all cursor-pointer active:scale-95 w-full sm:w-auto flex-1`}>
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-amber-600" />
                    </div>
                    <h4 className={`font-bold text-sm ${t.text}`}>{isAr ? 'تجربة الأذان' : 'Test Adhan'}</h4>
                  </button>
                </div>

                {/* Quote */}
                <div className="text-center mt-12">
                  <p className={`text-lg ${t.textSecondary} italic`}>
                    ﴿ وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِّنَ اللَّيْلِ ﴾
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onTestAdhan={handleTestAdhan}
        onQuitApp={handleQuitApp}
      />

      <AdhanAlert
        isVisible={adhanAlert.visible}
        prayerName={adhanAlert.name}
        prayerNameAr={adhanAlert.nameAr}
        onDismiss={handleDismissAdhan}
        darkMode={darkMode}
        volume={settings.volume}
      />
    </div>
  );
}

export default App;
