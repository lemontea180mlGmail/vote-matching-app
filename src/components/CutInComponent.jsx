import React, { useEffect } from 'react';

export default function CutInComponent({ onComplete }) {
    useEffect(() => {
        // Sound Effect
        const audio = new Audio('/pachinko_sound.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Audio playback failed:", e));

        // Auto-complete timer removed to wait for button push
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            {/* 集中線・背景エフェクト */}
            <div className="absolute inset-0 bg-red-600 mix-blend-multiply opacity-50 animate-pulse pointer-events-none"></div>
            <div
                className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,#ff0000_0deg_10deg,#ffff00_10deg_20deg)] opacity-30 animate-spin-slow pointer-events-none"
                style={{ animationDuration: '2s' }}
            ></div>

            {/* カットイン画像コンテナ */}
            <div className="relative w-full h-64 md:h-96 bg-black border-y-8 border-yellow-400 transform -skew-x-12 animate-slide-in-right shadow-[0_0_50px_rgba(255,255,0,0.8)] overflow-hidden flex items-center justify-center pointer-events-none">

                {/* 激しい点滅オーバーレイ */}
                <div className="absolute inset-0 bg-white opacity-0 animate-flash z-20"></div>

                {/* 画像：目力～頭の先まで（半分から上）を表示 */}
                <div className="w-full h-full absolute inset-0 animate-shake flex items-end justify-center overflow-hidden">
                    <img
                        src="/image/takaichi.jpg"
                        alt="Cut In"
                        className="w-full h-[200%] object-cover object-top filter contrast-125 brightness-110 drop-shadow-2xl"
                        style={{ transform: 'translateY(0%)' }} // 画像の上半分を表示
                    />
                </div>

                {/* テキストエフェクト（オプション） */}
                <div className="absolute bottom-16 right-4 text-yellow-300 font-black italic text-6xl md:text-8xl drop-shadow-[5px_5px_0_#ff0000] animate-bounce z-10 stroke-text">
                    CHANCE!
                </div>
            </div>

            {/* PUSHボタン (クリッカブルエリア確保のため pointer-events-auto を設定) */}
            <div className="absolute bottom-20 z-50 animate-pulse-fast">
                <button
                    onClick={onComplete}
                    className="group relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500 via-yellow-400 to-red-600 shadow-[0_0_30px_rgba(255,0,0,0.8)] border-4 border-white flex items-center justify-center transform hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                    <span className="text-white font-black text-2xl drop-shadow-md animate-ping absolute inset-0 rounded-full opacity-20"></span>
                    <span className="text-white font-black text-3xl drop-shadow-md relative z-10 group-hover:text-yellow-100">PUSH</span>
                </button>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg) scale(1.5); }
                    to { transform: rotate(360deg) scale(1.5); }
                }
                @keyframes slide-in-right {
                    0% { transform: translateX(120%) skewX(-12deg); opacity: 0; }
                    50% { transform: translateX(-10%) skewX(-12deg); opacity: 1; }
                    70% { transform: translateX(5%) skewX(-12deg); }
                    100% { transform: translateX(0) skewX(-12deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translate(0, 0) scale(1.1); }
                    10%, 30%, 50%, 70%, 90% { transform: translate(-2px, -2px) scale(1.15); }
                    20%, 40%, 60%, 80% { transform: translate(2px, 2px) scale(1.15); }
                }
                @keyframes flash {
                    0%, 50%, 100% { opacity: 0; }
                    25%, 75% { opacity: 0.8; }
                }
                @keyframes pulse-fast {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-pulse-fast {
                    animation: pulse-fast 0.5s infinite;
                }
                .stroke-text {
                    -webkit-text-stroke: 2px red;
                }
            `}</style>
        </div>
    );
}
