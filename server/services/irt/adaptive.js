/**
 * Simplified IRT-based Adaptive Difficulty Engine
 * Estimates student ability based on question difficulty and correctness.
 */

const updateAbilityEstimate = (currentAbility, itemDifficulty, isCorrect) => {
  // Constants for adjustment
  const learningRate = 0.5;
  const discrimination = 1.0; // Assume constant discrimination for simplicity

  // Probability of correct answer (Logistic function)
  const probability = 1 / (1 + Math.exp(-discrimination * (currentAbility - itemDifficulty)));

  // Adjustment based on the difference between actual result and predicted probability
  const adjustment = learningRate * (isCorrect - probability);
  
  return currentAbility + adjustment;
};

const getRecommendedDifficulty = (abilityEstimate) => {
  // Map ability estimate (-3 to +3) to difficulty bands (1 to 5)
  if (abilityEstimate <= -1.5) return 1; // Beginner
  if (abilityEstimate <= -0.5) return 2; // Intermediate
  if (abilityEstimate <= 0.5) return 3;  // Advanced
  if (abilityEstimate <= 1.5) return 4;  // Expert
  return 5; // Mastery
};

module.exports = { updateAbilityEstimate, getRecommendedDifficulty };
