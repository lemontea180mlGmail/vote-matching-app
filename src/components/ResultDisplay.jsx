import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Twitter, Share2 } from 'lucide-react';

export default function ResultDisplay({ results, questions }) {
    const [selectedParty, setSelectedParty] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }, []);

    const topMatch = results[0];
    const shareUrl = window.location.href;
    const shareText = `私のボートマッチング結果は【1位：${topMatch.name}（一致度：${topMatch.matchRate}%）】でした！あなたの考えに近い政党はどこ？ #ボートマッチング #選挙`;

    const handleShareTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleShareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Vote Matching Result',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
            setShowShareToast(true);
            setTimeout(() => setShowShareToast(false), 3000);
        }
    };

    const handlePartyClick = (party) => {
        if (selectedParty?.id === party.id) {
            // Deselecting (Back to list)
            setIsAnimating(true);
            setTimeout(() => {
                setSelectedParty(null);
                setIsAnimating(false);
            }, 300);
        } else {
            // Selecting (Focus mode)
            setIsAnimating(true);
            setTimeout(() => {
                setSelectedParty(party);
                setIsAnimating(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        }
    };

    const handleBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setSelectedParty(null);
            setIsAnimating(false);
        }, 300);
    };

    const getStanceLabel = (val) => {
        if (val === 1.0) return "とても賛成";
        if (val === 0.5) return "賛成";
        if (val === 0) return "どちらとも言えない";
        if (val === -0.5) return "反対";
        if (val === -1.0) return "とても反対";
        return "-";
    };

    const getStanceColor = (val) => {
        if (val > 0) return "bg-blue-100 text-blue-800";
        if (val < 0) return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-800";
    };

    // If a party is selected, only show that one. Otherwise show all.
    const displayList = selectedParty ? [selectedParty] : results;

    return (
        <div className={`w-full max-w-2xl pb-10 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>

            {/* Top Banner - Hide when in focused mode to save space/focus */}
            {!selectedParty && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 animate-fade-in-up">
                    <div
                        className="p-8 text-white text-center"
                        style={{ backgroundColor: topMatch.color }}
                    >
                        <p className="text-sm md:text-base opacity-90 mb-2 font-medium">あなたと最も考えが近いのは...</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-shadow-sm">
                            {topMatch.name}
                        </h2>
                        <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-lg font-bold">
                            一致度 {topMatch.matchRate}%
                        </div>
                    </div>

                    <div className="p-8 text-center md:text-left">
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">
                            あなたの回答は、<span className="font-bold text-gray-800">{topMatch.name}</span>の政策と高い一致度を示しました。
                            {topMatch.matchRate > 80
                                ? '多くの項目で意見が共有されており、非常に相性が良いと言えます。'
                                : 'いくつかの重要なポイントで意見が近く、支持を検討する価値があります。'}
                        </p>

                        {/* Social Share Buttons */}
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-3 text-center md:text-left">結果をみんなに教える</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                <button
                                    onClick={handleShareTwitter}
                                    className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all hover:scale-105"
                                >
                                    <Twitter size={20} fill="white" />
                                    Xでポスト
                                </button>
                                <button
                                    onClick={handleShareNative}
                                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all hover:scale-105 border border-gray-200"
                                >
                                    <Share2 size={20} />
                                    共有する
                                </button>
                            </div>

                            {/* Toast Notification */}
                            {showShareToast && (
                                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg text-sm animate-fade-in-up z-50">
                                    リンクとテキストをコピーしました！
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header for list */}
            <h3 className="text-xl font-bold text-gray-700 mb-6 px-2 flex items-center animate-fade-in-up">
                {selectedParty ? (
                    <button onClick={handleBack} className="text-blue-600 flex items-center hover:underline">
                        <span className="mr-2">←</span> ランキングに戻る
                    </button>
                ) : (
                    <>
                        <span className="bg-gray-200 w-1 h-6 mr-3 rounded-full"></span>
                        全政党との一致度ランキング
                        <span className="ml-auto text-xs font-normal text-gray-500">クリックで詳細比較</span>
                    </>
                )}
            </h3>

            <div className="space-y-4">
                {displayList.map((party, index) => {
                    // Find original index if we are in filtered view
                    const rankingIndex = selectedParty ? results.findIndex(r => r.id === party.id) : index;

                    return (
                        <div key={party.id} className="animate-fade-in-up">
                            <div
                                onClick={() => !selectedParty && handlePartyClick(party)}
                                className={`
                bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 flex items-center
                transition-all duration-300
                ${!selectedParty ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''}
                ${rankingIndex === 0 ? 'ring-2 ring-blue-100' : ''}
                ${selectedParty?.id === party.id ? 'ring-2 ring-blue-500 shadow-md transform scale-[1.02]' : ''}
              `}
                            >
                                <div className="font-bold text-gray-400 w-6 text-center text-lg mr-4">
                                    {rankingIndex + 1}
                                </div>

                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 mr-4 shadow-sm"
                                    style={{ backgroundColor: party.color }}
                                >
                                    {party.name.substring(0, 2)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-lg text-gray-800">{party.name}</span>
                                        <span className="font-bold text-lg text-blue-600">{party.matchRate}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${party.matchRate}%`,
                                                backgroundColor: party.color
                                            }}
                                        />
                                    </div>
                                </div>

                                {!selectedParty && (
                                    <div className="ml-4 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Detailed Comparison Panel - Always shown if this party is the selected one */}
                            {selectedParty?.id === party.id && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6 animate-fade-in-down mt-6 mx-1 shadow-inner">
                                    <h4 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <span className="bg-blue-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                                            回答の比較詳細
                                        </span>
                                        <button onClick={handleBack} className="text-xs text-blue-600 font-medium hover:underline">
                                            閉じる
                                        </button>
                                    </h4>
                                    <div className="space-y-3">
                                        {party.detailedBreakdown.map((item) => {
                                            // Fix: ID type mismatch (number vs string) caused find to fail.
                                            // Convert both to string for robust comparison.
                                            const question = questions.find(q => String(q.id) === String(item.qId));

                                            // Fallback if question not found (should not happen with correct data)
                                            if (!question) {
                                                console.warn(`Question not found for ID: ${item.qId}`);
                                                return null;
                                            }

                                            const isMatch = item.diff === 0;
                                            const isFar = item.diff > 1.0;

                                            return (
                                                <div key={item.qId} className="bg-white p-3 rounded-lg border border-gray-100 text-sm">
                                                    <p className="font-medium text-gray-800 mb-2">{question.text}</p>
                                                    <div className="flex justify-between items-center bg-gray-50 rounded p-2">
                                                        <div className="text-center w-1/2 border-r border-gray-200 pr-2">
                                                            <span className="block text-xs text-gray-400 mb-1">あなた</span>
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStanceColor(item.userVal)}`}>
                                                                {getStanceLabel(item.userVal)}
                                                            </span>
                                                        </div>
                                                        <div className="text-center w-1/2 pl-2">
                                                            <span className="block text-xs text-gray-400 mb-1">{party.name}</span>
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStanceColor(item.partyVal)}`}>
                                                                {getStanceLabel(item.partyVal)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={`mt-2 text-center text-xs font-bold ${isMatch ? 'text-green-600' : isFar ? 'text-red-500' : 'text-yellow-600'}`}>
                                                        {isMatch ? '一致！' : isFar ? '意見が異なります' : '近いです'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {party.detailedBreakdown.length === 0 && (
                                            <p className="text-gray-500 text-center">比較可能な回答がありません</p>
                                        )}
                                    </div>
                                    <div className="mt-6 text-center">
                                        <button onClick={handleBack} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                            ランキングに戻る
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {!selectedParty && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-sm"
                    >
                        もう一度はじめから
                    </button>
                </div>
            )}
        </div>
    );
}
