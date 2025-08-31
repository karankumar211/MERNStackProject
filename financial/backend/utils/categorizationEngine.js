const categoryKeywords = {
  Food: ['dinner', 'lunch', 'zomato', 'swiggy', 'restaurant', 'food', 'snacks'],
  Travel: ['uber', 'ola', 'flight', 'train', 'bus', 'taxi'],
  Bills: ['electricity', 'recharge', 'phone', 'internet', 'rent', 'bill'],
  Shopping: ['amazon', 'flipkart', 'myntra', 'clothes', 'shopping', 'gadget'],
  Entertainment: ['movie', 'concert', 'tickets', 'netflix'],
};

export const categorizeExpense = (note) => {
  const noteLower = note.toLowerCase();
  for (const category in categoryKeywords) {
    if (categoryKeywords[category].some(keyword => noteLower.includes(keyword))) {
      return category;
    }
  }
  return 'Uncategorized';
};