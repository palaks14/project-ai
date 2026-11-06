/**
 * SM-2 Algorithm Implementation
 * @param {number} quality - Response quality (0-5)
 * @param {number} prevInterval - Previous interval in days
 * @param {number} prevEase - Previous ease factor
 * @param {number} repetitions - Number of consecutive correct repetitions
 * @returns {object} - { interval, easeFactor, repetitions }
 */
const calculateSM2 = (quality, prevInterval, prevEase, repetitions) => {
  let interval;
  let easeFactor = prevEase;
  let newRepetitions = repetitions;

  if (quality >= 3) {
    if (newRepetitions === 0) {
      interval = 1;
    } else if (newRepetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * prevEase);
    }
    newRepetitions++;
    easeFactor = prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    newRepetitions = 0;
    interval = 1;
    easeFactor = prevEase - 0.2;
  }

  if (easeFactor < 1.3) easeFactor = 1.3;

  return { interval, easeFactor, repetitions: newRepetitions };
};

module.exports = { calculateSM2 };
