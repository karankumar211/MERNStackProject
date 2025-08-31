// A sample user ID will be generated upon seeding. This is a placeholder.
const sampleUserId = '6584b384a56a64c4493a7d97'; // Replace with an actual ID from your DB after seeding user

export const users = [
    { _id: new mongoose.Types.ObjectId(sampleUserId), name: "Demo User", email: "demo@finvoice.com", moneyPersona: "Balanced" }
];

export const expenses = [
    { userId: sampleUserId, amount: 250, note: "Dinner with friends", category: "Food" },
    { userId: sampleUserId, amount: 1200, note: "Amazon shopping for clothes", category: "Shopping" },
    { userId: sampleUserId, amount: 150, note: "Uber ride to office", category: "Travel" },
    { userId: sampleUserId, amount: 800, note: "Electricity bill payment", category: "Bills" },
];

export const goals = [
    { userId: sampleUserId, goalName: "Buy a new Car", targetAmount: 500000, currentAmount: 75000, targetDate: new Date('2026-12-31') }
];