import Expense from "../models/Expense.js";

/**
 * @desc    Create a dynamic budget based on actual expenses and leftover income
 * @route   POST /api/budget/plan
 */
export const createBudgetPlan = async (req, res) => {
  const { salary } = req.body;
  const userId = req.user._id;

  if (!salary || salary <= 0) {
    return res.status(400).json({ message: "A valid salary is required." });
  }

  try {
    // 1. Fetch user's expenses from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentExpenses = await Expense.find({
        userId: userId,
        timestamp: { $gte: thirtyDaysAgo },
    });
    const totalExpenses = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 2. Calculate the leftover money
    const leftoverAmount = salary - totalExpenses;

    if (leftoverAmount <= 0) {
      return res.status(200).json({
        monthlySalary: parseFloat(salary),
        totalExpenses: totalExpenses.toFixed(2),
        investmentPlan: null, // No money left to invest
        message: "Your expenses have met or exceeded your income. There is no money left to invest this month."
      });
    }

    // 3. Define the investment allocation rules (applied to the leftover amount)
    let realEstateSplit, fdSplit, mediumRiskSplit, highRiskSplit;
    if (salary <= 30000) {
      // Safer plan for lower incomes
      realEstateSplit = 20;
      fdSplit = 50;
      mediumRiskSplit = 30;
      highRiskSplit = 0;
    } else {
      // Standard plan for higher incomes
      realEstateSplit = 20;
      fdSplit = 30;
      mediumRiskSplit = 30;
      highRiskSplit = 20;
    }

    // 4. Calculate the detailed investment breakdown based on the leftover money
    const realEstateAmount = leftoverAmount * (realEstateSplit / 100);
    const fdAmount = leftoverAmount * (fdSplit / 100);
    const mediumRiskAmount = leftoverAmount * (mediumRiskSplit / 100);
    const highRiskAmount = leftoverAmount * (highRiskSplit / 100);

    const plan = {
      monthlySalary: parseFloat(salary),
      totalExpenses: totalExpenses.toFixed(2),
      leftoverForInvestment: leftoverAmount.toFixed(2),
      investmentPlan: {
        total: {
          amount: leftoverAmount.toFixed(2),
        },
        breakdown: [
          { category: 'Real Estate', splitPercentage: realEstateSplit, amount: realEstateAmount.toFixed(2) },
          { category: 'Fixed Deposits (FD)', splitPercentage: fdSplit, amount: fdAmount.toFixed(2) },
          { category: 'Medium-Risk Equity', splitPercentage: mediumRiskSplit, amount: mediumRiskAmount.toFixed(2) },
          { category: 'High-Risk Equity', splitPercentage: highRiskSplit, amount: highRiskAmount.toFixed(2) }
        ].filter(item => item.splitPercentage > 0)
      }
    };

    res.status(200).json(plan);

  } catch (error) {
    console.error("Error creating dynamic budget plan:", error);
    res.status(500).json({ message: "Server error while creating the plan." });
  }
};