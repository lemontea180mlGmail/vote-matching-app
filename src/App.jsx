import React, { useState } from 'react';
import QuestionCard from './components/QuestionCard';
import AttributeSurvey from './components/AttributeSurvey';
import ResultDisplay from './components/ResultDisplay';
import { calculateMatch } from './utils/MatchEngine';
import { useVoteData } from './hooks/useVoteData';

function App() {
    const { questions, parties, loading, error } = useVoteData();
    const [step, setStep] = useState('intro'); // intro, survey, question, result
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [surveyData, setSurveyData] = useState(null);
    const [matchResults, setMatchResults] = useState([]);

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

    const handleAnswer = (value) => {
        // Save answer
        const questionId = questions[currentQuestionIndex].id;
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            // Next question
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                window.scrollTo(0, 0);
            }, 250);
        } else {
            // Finished questions -> Calculate and show results
            const results = calculateMatch(newAnswers, parties, questions);
            setMatchResults(results);

            setStep('result');
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

                {step === 'intro' && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-fade-in-up max-w-md w-full">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-6 tracking-tight">
                            Vote Match
                        </h1>
                        <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                            1分であなたに合う政党が分かります
                        </p>
                        <button
                            onClick={handleStart}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block text-xl"
                        >
                            スタート
                        </button>
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
                    />
                )}

                {step === 'result' && (
                    <ResultDisplay results={matchResults} questions={questions} />
                )}

            </div>
        </div>
    );
}

export default App;
