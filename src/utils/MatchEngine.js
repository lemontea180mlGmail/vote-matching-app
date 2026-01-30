
export function calculateMatch(answers, parties, questions) {
    // answers: { questionId: value }
    // parties: Array of party objects { id, name, stances: { questionId: value } }
    // questions: Array of question objects (used for debugging/logging)

    console.log("--- Starting Match Calculation ---");
    console.log("User Answers:", answers);

    const results = parties.map(party => {
        let totalAbsDiff = 0;
        let validCount = 0;
        let breakdown = [];

        // Iterate over user answers
        Object.keys(answers).forEach(qId => {
            // Ensure qId is correct type (int vs string key)
            // CSV parser might produce ints or strings. normalize to string for robust key lookup if needed

            const userVal = answers[qId];
            // Skip if "Don't Know" (null)
            if (userVal === null || userVal === undefined) {
                return;
            }

            // Check if party has stance on this question
            const partyVal = party.stances[qId];
            if (partyVal === undefined || partyVal === null) {
                // Party has no defined stance (should ideally not happen with complete data)
                return;
            }

            // Calculate Absolute Error
            const diff = Math.abs(userVal - partyVal);
            totalAbsDiff += diff;
            validCount++;

            breakdown.push({
                qId,
                userVal,
                partyVal,
                diff
            });
        });

        if (validCount === 0) {
            return {
                ...party,
                matchRate: 0,
                breakdown: []
            };
        }

        // MAE (Mean Absolute Error) = totalAbsDiff / validCount
        // Range of AbsDiff per question is 0 to 2 (e.g. 1.0 - (-1.0) = 2)
        // Normalized Distance = MAE / 2
        // Match Rate = 1 - Normalized Distance

        const mae = totalAbsDiff / validCount;
        const similarity = 1 - (mae / 2);
        const matchPercentage = Math.round(similarity * 100);

        console.log(`Party: ${party.name}, Valid Qs: ${validCount}, MAE: ${mae.toFixed(3)}, Match: ${matchPercentage}%`);

        return {
            ...party,
            matchRate: matchPercentage,
            detailedBreakdown: breakdown, // For UI comparison
        };
    });

    // Sort by match rate desc
    return results.sort((a, b) => b.matchRate - a.matchRate);
}
