import React, { useEffect, useRef } from 'react';
import { Volume2, X, Bell } from 'lucide-react';

interface AdhanAlertProps {
    isVisible: boolean;
    prayerName: string;
    prayerNameAr: string;
    onDismiss: () => void;
    darkMode: boolean;
    volume: number;
}

// Generate adhan notification sound using Web Audio API
function playNotificationSound(volume: number, type: string): { stop: () => void } {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);

    // Default Adhan-like sequence if no MP3 is provided
    const isDefault = type === 'default';

    // Frequencies representing a basic spiritual melody
    const notes =
        type === 'chime' ? [523, 659, 784, 1047] :
            type === 'bell' ? [880, 1108, 1320] :
                [329.63, 349.23, 392.00, 329.63, 261.63, 293.66, 329.63]; // Default "spiritual" sequence

    const durations = type === 'bell' ? [1.5, 1.2, 1.0] :
        type === 'chime' ? [0.8, 0.8, 0.8, 1.2] :
            [2.0, 1.5, 2.5, 2.0, 2.0, 1.5, 3.0]; // Longer for default

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isDefault ? 'triangle' : 'sine'; // Triangle sounds more like a wind instrument
        osc.frequency.value = freq;

        const spacing = isDefault ? 2.2 : 0.6;
        const startTime = ctx.currentTime + i * spacing;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + (durations[i] || 0.8));

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + (durations[i] || 0.8) + 0.1);
    });

    return {
        stop: () => {
            ctx.close();
        }
    };
}

export default function AdhanAlert({ isVisible, prayerName, prayerNameAr, onDismiss, darkMode, volume }: AdhanAlertProps) {
    const audioRef = useRef<{ stop: () => void } | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isVisible) {
            // Play sound - fixed to the specific MP3
            const audio = new Audio('/audio/adhan.mp3');
            audio.volume = volume;
            audio.play().catch(e => {
                console.error("Failed to play adhan:", e);
                // Fallback to synthesized sound if file fails
                audioRef.current = playNotificationSound(volume, 'default');
            });
            audioRef.current = { stop: () => { audio.pause(); audio.currentTime = 0; } };

            // Auto-dismiss
            timerRef.current = setTimeout(() => {
                onDismiss();
            }, 60000 * 5); // 5 minutes for full adhan

            // Try to bring window to front via Wails
            try {
                (window as any)['go']?.['main']?.['App']?.['ShowMainWindow']?.();
            } catch (e) { }
        }

        return () => {
            if (audioRef.current) audioRef.current.stop();
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80" dir="rtl">
            <div className={`relative w-full h-full flex flex-col justify-center items-center ${darkMode ? 'bg-[#0a0a0f]' : 'bg-[#f8f7ff]'}`}>
                {/* Progress bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-600/10">
                    <div className="h-full bg-purple-600 animate-slide-up" style={{ animationDuration: '300s' }} />
                </div>

                <div className="flex flex-col items-center w-full max-w-sm">
                    {/* Icon */}
                    <div className="mb-8">
                        <div className={`w-24 h-24 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-600/20`}>
                            <Bell className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="text-center mb-10">
                        <p className={`text-sm font-bold text-purple-600 mb-3 tracking-[0.2em] uppercase`}>حان وقت صلاة</p>
                        <h2 className={`text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 tracking-tight`}>{prayerNameAr}</h2>
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{prayerName} Prayer</p>
                    </div>

                    {/* Bismillah */}
                    <div className="mb-12 text-center">
                        <p className={`text-3xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>
                            الله أكبر الله أكبر
                        </p>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={onDismiss}
                        className={`w-64 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20`}
                    >
                        إيقاف الأذان
                    </button>
                </div>
            </div>
        </div>
    );
}

