/**
 * Parses a voice command like "add dinner rupees 300"
 * @param {string} text - The transcript from speech recognition.
 * @returns {{amount: number, note: string} | null}
 */
export const parseVoiceInput = (text) => {
  const textLower = text.toLowerCase();
  // Regex to find amount after "rupees", "dollars", or just a number
  const amountMatch = textLower.match(/(?:rupees|rs|dollar|dollars|\$)\s*(\d+)|(\d+)/);
  
  if (!amountMatch) return null;
  
  const amount = parseInt(amountMatch[1] || amountMatch[2], 10);
  
  // The note is everything before the amount keywords
  let note = textLower.split(/(?:rupees|rs|dollar|\d+)/)[0].trim();
  note = note.replace(/^add |^log |^expense /i, '').trim(); // Clean up starting words
  
  return { amount, note };
};