import React, { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import AttributeSurvey from './components/AttributeSurvey';
import ResultDisplay from './components/ResultDisplay';
import EffectsRenderer from './components/EffectsRenderer';
import { calculateMatch } from './utils/MatchEngine';
import { useVoteData } from './hooks/useVoteData';
import { checkEffectTrigger, EFFECT_TYPES } from './logic/EffectTriggers';

// GAS Web App URL (Replace with your actual URL)
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzx03HnQGpUUctfPcjvEkvZMEGY-o65J03AWpJGdZyDyRUm-rBCQDJpgDg519NlQYK6/exec";

function App() {
    const { questions, parties, loading, error } = useVoteData();
    const [step, setStep] = useState('intro'); // intro, survey, question, result
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [surveyData, setSurveyData] = useState(null);
    const [matchResults, setMatchResults] = useState([]);

    // activeEffect stores the ID of the effect to show (null if none)
    const [activeEffect, setActiveEffect] = useState(null);

    // Debug logging
    console.log("App Render:", { step, loading, error });

    // Send results to Google Sheets when step becomes 'result'
    useEffect(() => {
        if (step === 'result' && matchResults.length > 0 && surveyData) {
            const sendData = async () => {
                try {
                    // Anonymous User ID Logic
                    let userId = localStorage.getItem('vote_matching_user_id');
                    if (!userId) {
                        try {
                            userId = crypto.randomUUID();
                        } catch (e) {
                            // Fallback for older browsers if needed, or simple random string
                            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
                        }
                        localStorage.setItem('vote_matching_user_id', userId);
                    }

                    const payload = {
                        userId: userId,
                        age: surveyData.age,
                        gender: surveyData.gender,
                        area: surveyData.region,
                        options: surveyData.attributes,
                        match_p1: matchResults[0]?.name || 'Unknown',
                        // Add other survey data if needed
                    };

                    await fetch(GAS_API_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    });
                    console.log("Data sent to Google Sheets");

                } catch (error) {
                    console.error("Failed to save results:", error);
                }
            };
            sendData();
        }
    }, [step, matchResults, surveyData]);

    const handleStart = () => {
        setStep('survey');
        window.scrollTo(0, 0);
    };

    const handleSurveySubmit = (data) => {
        setSurveyData(data);
        setStep('question');
        window.scrollTo(0, 0);
    };

    const proceedToNext = (currentAnswers) => {
        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                window.scrollTo(0, 0);
            }, 250);
        } else {
            setStep('calculating');
            window.scrollTo(0, 0);
            setTimeout(() => {
                const results = calculateMatch(currentAnswers, parties, questions); // Pass current answers
                setMatchResults(results);
                setStep('result');
                window.scrollTo(0, 0);
            }, 2500);
        }
    };

    const handleAnswer = (value) => {
        // Save answer
        const questionId = questions[currentQuestionIndex].id;
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        // Check for Trigger Effects
        const effectId = checkEffectTrigger(surveyData, questionId, value);

        if (effectId) {
            setActiveEffect(effectId);
        } else {
            // Normal flow
            proceedToNext(newAnswers);
        }
    };

    const handleEffectComplete = () => {
        // Special Handling for Pachinko Cut-In: Force LDP 100%
        if (activeEffect === EFFECT_TYPES.PACHINKO_CUT_IN) {
            setActiveEffect(null);

            // Show Calculating Screen First
            setStep('calculating');
            window.scrollTo(0, 0);

            setTimeout(() => {
                const forcedResults = parties.map(p => {
                    let rate = 0;
                    if (p.id === 'jimin') rate = 100;
                    else if (p.id === 'chudo') rate = 5;

                    return {
                        ...p,
                        matchRate: rate,
                        detailedBreakdown: [] // Empty detailed breakdown
                    };
                }).sort((a, b) => b.matchRate - a.matchRate);

                setMatchResults(forcedResults);
                setStep('result');
                window.scrollTo(0, 0);
            }, 2500); // Wait 2.5s like normal flow

            return;
        }

        setActiveEffect(null);

        // Normal proceeding for other effects (if any in future)
        // We need to pass the latest answers to proceedToNext
        // Note: 'answers' state might not be updated yet in this closure if react batching hasn't flushed
        // so we manually reconstruct the intended state for processing.
        // But proceedToNext relies on currentQuestionIndex + 1 logic or calculating on final.
        // If we are not forcing results, we likely just proceed to next question.

        proceedToNext(answers);
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            window.scrollTo(0, 0);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
                    <p className="text-gray-600">データの読み込みに失敗しました。<br />インターネット接続を確認して再読み込みしてください。</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
            <div className="w-full max-w-2xl flex flex-col items-center">

                {/* Effect Overlay */}
                <EffectsRenderer effectType={activeEffect} onComplete={handleEffectComplete} />

                {step === 'intro' && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-fade-in-up max-w-md w-full">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-6 tracking-tight">
                            Vote Match
                        </h1>
                        <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                            政治に詳しくなくても最速10秒で<br />あなたに合う政党が分かります
                        </p>
                        <p className="text-xl font-bold text-gray-800 mb-10">
                            衆議院選挙2026
                        </p>
                        <button
                            onClick={handleStart}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block text-xl"
                        >
                            スタート
                        </button>
                        <p className="mt-4 text-xs text-gray-400">v0.9.5</p>
                    </div>
                )}

                {step === 'survey' && (
                    <AttributeSurvey onSubmit={handleSurveySubmit} />
                )}

                {step === 'question' && questions.length > 0 && (
                    <QuestionCard
                        question={questions[currentQuestionIndex]}
                        current={currentQuestionIndex + 1}
                        total={questions.length}
                        onAnswer={handleAnswer}
                        onBack={handleBack}
                    />
                )}

                {step === 'calculating' && (
                    <div className="bg-white rounded-2xl shadow-xl p-10 text-center animate-fade-in-up w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">あなたと政党の相性を<br />分析しています...</h2>
                        <div className="flex justify-center mb-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                        </div>
                        <p className="text-gray-500 animate-pulse">しばらくお待ちください</p>
                    </div>
                )}

                {step === 'result' && (
                    <ResultDisplay results={matchResults} questions={questions} />
                )}

            </div>
        </div>
    );
}

export default App;
