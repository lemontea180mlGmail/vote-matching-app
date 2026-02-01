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

            {/* 3D飛び出しボタン ("!!" デザイン) - リアル挙動（枠固定・ボタン沈下） */}
            <div className="absolute bottom-20 z-50 animate-bounce-in" style={{ perspective: '600px' }}>
                <div
                    onClick={onComplete}
                    className="group relative w-40 h-40 cursor-pointer outline-none tap-highlight-transparent"
                    style={{ transformStyle: 'preserve-3d', transform: 'rotateX(45deg)' }}
                >
                    {/* --- 静止パーツ：台座 (Base/Rim) --- 
                        クリックしても動かない（group-activeの影響を受けない独立層、ただし同じ3D空間に配置） 
                    */}
                    <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                        {/* 台座の底面 */}
                        <div
                            className="absolute inset-[-20px] rounded-[50%] bg-gradient-to-b from-gray-300 via-gray-100 to-gray-400"
                            style={{ transform: 'translateZ(-60px)' }}
                        ></div>
                        {/* 光る縁 (Cyan Glow) */}
                        <div
                            className="absolute inset-[-15px] rounded-[50%] bg-cyan-400 opacity-50 blur-md animate-pulse"
                            style={{ transform: 'translateZ(-59px)' }}
                        ></div>
                    </div>

                    {/* --- 可動パーツ：ボタン本体 (Piston) ---
                        クリック時(group-active)にZ軸方向へ沈み込む
                    */}
                    <div
                        className="absolute inset-0 transition-transform duration-75 ease-out group-active:translate-z-[-30px]"
                        style={{
                            transformStyle: 'preserve-3d',
                            '--tw-translate-z': '0px', // デフォルト
                        }}
                    >
                        {/* 注入するカスタムスタイル: active時にtranslateZを変更するためのStyleタグ */}
                        <style jsx>{`
                            .group:active .group-active\\:translate-z-\\[-30px\\] {
                                transform: translateZ(-30px);
                            }
                        `}</style>

                        {/* 円筒の側面 (Cylinder Side) */}
                        {/* 側面はトップと一緒に沈むので、ベースに潜り込んで見えなくなる */}
                        <div
                            className="absolute inset-x-0 w-full h-full rounded-[50%] bg-gradient-to-b from-[#ff3333] to-[#cc0000] opacity-90 pointer-events-none"
                            style={{
                                transform: 'translateZ(-60px)',
                                height: '100%'
                            }}
                        ></div>
                        {/* 側面の積層レイヤー（厚み表現） */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute inset-0 rounded-[50%] bg-[#ff0000] opacity-30 border border-[#ff9999]/20 pointer-events-none"
                                style={{ transform: `translateZ(${-5 * (i + 1)}px)` }}
                            ></div>
                        ))}

                        {/* 内部発光コア */}
                        <div
                            className="absolute inset-[5px] rounded-[50%] bg-yellow-500 opacity-20 blur-sm pointer-events-none"
                            style={{ transform: 'translateZ(-30px)' }}
                        ></div>

                        {/* ボタンの上面 (Top Face) */}
                        <div
                            className="relative h-full w-full rounded-[50%] flex items-center justify-center overflow-hidden border-[3px] border-[#ffcccc]/50"
                            style={{
                                background: 'radial-gradient(circle at 50% 30%, #ff5555 0%, #dd0000 60%, #990000 100%)',
                                transform: 'translateZ(0px)',
                            }}
                        >
                            {/* ハイライト */}
                            <div className="absolute top-[5%] left-[15%] w-[70%] h-[40%] bg-gradient-to-b from-white/70 to-transparent rounded-[50%] pointer-events-none blur-[2px]"></div>

                            {/* "!!" テキスト - 丸みのあるフォント & 左シフト調整 */}
                            <span
                                className="text-white font-black text-8xl italic drop-shadow-sm select-none pr-2 mb-4"
                                style={{
                                    fontFamily: '"Arial Rounded MT Bold", "Varela Round", sans-serif',
                                    transform: 'skewX(-12deg) translateX(-5px)'
                                }}
                            >
                                !!
                            </span>
                        </div>
                    </div>
                </div>
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
                @keyframes bounce-in {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    80% { transform: scale(0.95); }
                    100% { transform: scale(1); }
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
