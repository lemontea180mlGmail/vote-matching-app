
// Effect Constants
export const EFFECT_TYPES = {
    PACHINKO_CUT_IN: 'PACHINKO_CUT_IN',
};

/**
 * Checks if any effect should be triggered based on the current answer and user attributes.
 * @param {Object} surveyData - User's attribute data (e.g., { attributes: [...] })
 * @param {number} questionId - The ID of the current question
 * @param {number} answerValue - The value of the user's answer
 * @returns {string|null} - The ID of the effect to trigger, or null
 */
export function checkEffectTrigger(surveyData, questionId, answerValue) {
    if (!surveyData) return null;

    // Trigger 1: Pachinko Cut-In
    // Condition: "統一教会員" attribute + Question 2 + "Very Agree" (1.0)
    const isUnificationMember = surveyData.attributes && surveyData.attributes.includes('統一教会員');
    const isTargetQuestion = questionId === 2;
    const isTargetAnswer = answerValue === 1.0;

    if (isUnificationMember && isTargetQuestion && isTargetAnswer) {
        return EFFECT_TYPES.PACHINKO_CUT_IN;
    }

    return null;
}
