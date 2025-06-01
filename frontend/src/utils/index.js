export const openUrl = (url) => window.open(url);

/**
 * Parses a summary string to extract layman scores and details for each key, as well as the overall score if present.
 *
 * The expected format for each entry in the summary string is:
 *   "<Key>: Summary Layman Score - <score> (<details>)"
 * Optionally, an overall score can be present in the format:
 *   "Overall Score: <score>"
 *
 * @param {string} summaryStr - The summary string to parse.
 * @returns {Object} An object where each key corresponds to an entry in the summary string, containing:
 *   - {Object} [key]: An object with "Layman Score" (string) and "Details" (string).
 *   - {string} ["Overall Score"] (optional): The overall score if present.
 */
export const parseSummaryString = (summaryStr) => {
  const result = {};
  // Match entries like: Air: 50/100 (details...)
  const regex = /(\w+):\s*([\d/]+)\s*\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(summaryStr)) !== null) {
    const [_, key, score, details] = match;
    result[key] = {
      "Layman Score": score,
      Details: details.trim(),
    };
  }
  // Extract Overall Score if present (handles non-breaking space and colon variants)
  const overallMatch = summaryStr.match(
    /Overall(?:\s|&nbsp;)*Score:\s*([\d/]+)/i
  );
  if (overallMatch) {
    result["Overall Score"] = overallMatch[1];
  }
  return result;
};
