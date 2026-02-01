import React from 'react';
import CutInComponent from './CutInComponent'; // Ideally move this to an 'effects' folder later if needed
import { EFFECT_TYPES } from '../logic/EffectTriggers';

export default function EffectsRenderer({ effectType, onComplete }) {
    if (!effectType) return null;

    switch (effectType) {
        case EFFECT_TYPES.PACHINKO_CUT_IN:
            return <CutInComponent onComplete={onComplete} />;

        // Add new cases here for future effects
        // case EFFECT_TYPES.ANOTHER_EFFECT:
        //    return <AnotherEffect onComplete={onComplete} />;

        default:
            console.warn(`Unknown effect type: ${effectType}`);
            // If effect is unknown, immediately complete to avoid getting stuck
            onComplete();
            return null;
    }
}
