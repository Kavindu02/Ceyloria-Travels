// src/utils/jsonParser.js

/**
 * Safely parses a potential JSON string into an array or object.
 * If the input is already an array/object, it returns it as-is.
 * If the input is invalid JSON, it returns a fallback value (defaulting to an empty array).
 *
 * @param {any} data - The data to parse (string, array, or object)
 * @param {any} fallback - The fallback value if parsing fails (default: [])
 * @returns {any} The parsed array/object or the fallback value
 */
export const safeParseJSON = (data, fallback = []) => {
  if (!data) return fallback;
  
  // If it's already an object/array, return it
  if (typeof data !== 'string') return data;
  
  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON:", data, err);
    return fallback;
  }
};
