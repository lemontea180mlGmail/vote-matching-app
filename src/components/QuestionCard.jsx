import React from 'react';
import { OPTIONS } from '../data/questions';

export default function QuestionCard({ question, current, total, onAnswer, onBack }) {
    return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-10 animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-blue-600 tracking-wider">
                    Q. {current} <span className="text-gray-400 font-normal">/ {total}</span>
                </span>
                <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${(current / total) * 100}%` }}
                    />
                </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 leading-relaxed text-center">
                {question.text}
            </h2>

            <div className="grid grid-cols-1 gap-4">
                {OPTIONS.map((option) => (
                    <button
                        key={option.label}
                        onClick={() => onAnswer(option.value)}
                        className={`
              ${option.color} 
              py-4 px-4 rounded-xl font-bold text-sm md:text-base 
              transition-all duration-200 
              transform hover:scale-[1.02] active:scale-95 
              shadow-md hover:shadow-lg opacity-90 hover:opacity-100
            `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {current > 1 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-700 font-medium text-sm underline transition-colors"
                    >
                        前の質問に戻る
                    </button>
                </div>
            )}
        </div>
    );
}
