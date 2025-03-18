/**
 * Convert a value from dollars to big blinds
 * @param {number} value - The value in dollars
 * @param {number} bbSize - The big blind size in dollars
 * @returns {number} The value in big blinds
 */
export const toBigBlinds = (value, bbSize) => {
  if (bbSize <= 0) return 0;
  return value / bbSize;
};

/**
 * Convert a value from big blinds to dollars
 * @param {number} value - The value in big blinds
 * @param {number} bbSize - The big blind size in dollars
 * @returns {number} The value in dollars
 */
export const toDollars = (value, bbSize) => {
  return value * bbSize;
};

/**
 * Format a value based on the current display unit
 * @param {number} value - The value in dollars
 * @param {string} displayUnit - The current display unit ('$' or 'bb')
 * @param {number} bbSize - The big blind size in dollars
 * @returns {string} The formatted value with unit
 */
export const formatValue = (value, displayUnit, bbSize) => {
  if (displayUnit === 'bb') {
    return `${toBigBlinds(value, bbSize).toFixed(1)} bb`;
  }
  return `${value} $`;
};