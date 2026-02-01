import React, { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import AttributeSurvey from './components/AttributeSurvey';
import ResultDisplay from './components/ResultDisplay';
import CutInComponent from './components/CutInComponent';
import { calculateMatch } from './utils/MatchEngine';
import { useVoteData } from './hooks/useVoteData';

// GAS Web App URL (Replace with your actual URL)
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzx03HnQGpUUctfPcjvEkvZMEGY-o65J03AWpJGdZyDyRUm-rBCQDJpgDg519NlQYK6/exec";

function App() {
    const { questions, parties, loading, error } = useVoteData();
    const [step, setStep] = useState('intro'); // intro, survey, question, result
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [surveyData, setSurveyData] = useState(null);
    const [matchResults, setMatchResults] = useState([]);
    const [showCutIn, setShowCutIn] = useState(false);

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
                        match_p1: matchResults[0].name
                    };

                    // console.log("Sending data to GAS:", payload);

                    await fetch(GAS_API_URL, {
                        method: 'POST',
                        mode: 'no-cors', // 'cors' is better if GAS returns headers, but 'no-cors' is safer for avoiding browser errors with opaque responses if setup is tricky
                        headers: {
                            'Content-Type': 'application/json', // Note: no-cors mode converts this to update/plain or similar, but GAS `e.postData.contents` handles it.
                        },
                        body: JSON.stringify(payload)
                    });
                    console.log("Data sent to Google Sheets");

                } catch (error) {
                    // Do not alert user, just log error context
                    console.error("Failed to save results:", error);
                }
            };
            sendData();
        }
    }, [step, matchResults, surveyData]);

    // Flow: Intro -> Survey -> Question -> Result
    const handleStart = () => {
        setStep('survey');
        setCurrentQuestionIndex(0);
        setAnswers({});
    };

    const handleSurveySubmit = (data) => {
        setSurveyData(data);
        console.log('Survey Data:', data);
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

        // Check Cut-In Trigger Conditions
        // 1. Attribute includes "統一教会員"
        // 2. Question ID is 2
        // 3. Answer is 1.0 (Very Agree)
        const isTargetAttribute = surveyData?.attributes?.includes('統一教会員');
        const isTargetQuestion = questionId === 2; // ID check
        const isTargetAnswer = value === 1.0;

        if (isTargetAttribute && isTargetQuestion && isTargetAnswer) {
            setShowCutIn(true);
            // CutInComponent calls onComplete to proceed
        } else {
            // Normal flow
            proceedToNext(newAnswers);
        }
    };

    const handleCutInComplete = () => {
        setShowCutIn(false);
        // Proceed using state values. 
        // Note: answers state update might be batched, but usually OK for next render.
        // For last question case, we need to ensure calculateMatch uses latest answers.

        // We need to pass the latest answers to proceedToNext, as `answers` state might not be updated yet
        // due to React's state batching.
        const latestAnswers = { ...answers, [questions[currentQuestionIndex].id]: answers[questions[currentQuestionIndex].id] };
        proceedToNext(latestAnswers);
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            window.scrollTo(0, 0);
        }
    };

    // Loading & Error States
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
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
                    <p className="text-gray-600">データの読み込みに失敗しました。<br />インターネット接続を確認して再読み込みしてください。</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
            <div className="w-full max-w-2xl flex flex-col items-center">
                {showCutIn && <CutInComponent onComplete={handleCutInComplete} />}

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
                        <p className="mt-4 text-xs text-gray-400">v0.8.0</p>
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
