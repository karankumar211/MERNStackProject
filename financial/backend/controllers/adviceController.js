import Goal from "../models/Goal.js";
import User from "../models/User.js";

// Re-create the budget rules here so the advice controller is self-contained
const expensePercentage = 60;
const investmentPercentage = 40;

const foodSplit = 25;
const travelSplit = 10;
const subscriptionsSplit = 15;

/**
 * @desc    Generate context-aware advice with emotional tags after a goal is created
 * @route   POST /api/advice
 */
export const getFinancialAdvice = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newGoal, salary } = req.body;

    if (!newGoal || !salary) {
      // Fallback for a generic quote if no goal is provided
      return res.json({
        advice: "Every saving starts with a goal. Well done!",
        tags: [],
      });
    }

    let adviceMessage = "";
    const emotionalTags = []; // Array to hold our new tags

    // --- 1. Emotional Analysis Logic ---
    const targetDate = new Date(newGoal.targetDate);
    const yearsAway = targetDate.getFullYear() - new Date().getFullYear();

    if (yearsAway > 5) {
      emotionalTags.push({ tag: "Long-Term Goal", type: "success" });
    } else if (yearsAway < 2) {
      emotionalTags.push({ tag: "Short-Term Goal", type: "info" });
    }

    if (newGoal.riskProfile === "High") {
      emotionalTags.push({ tag: "High-Risk", type: "warning" });
    }
    // ------------------------------------

    // --- 2. Goal Feasibility Analysis ---
    const currentMonthlyInvestment = salary * (investmentPercentage / 100);
    // Calculate required savings based on months, not just a fixed year
    const monthsToGoal =
      (targetDate.getFullYear() - new Date().getFullYear()) * 12 +
      (targetDate.getMonth() - new Date().getMonth());
    const requiredMonthlyForGoal =
      monthsToGoal > 0 ? newGoal.targetAmount / monthsToGoal : newGoal.targetAmount;

    if (requiredMonthlyForGoal <= currentMonthlyInvestment) {
      // The user can already afford this goal
      adviceMessage = `Great news! Based on your budget, your current monthly investment allocation of ₹${currentMonthlyInvestment.toFixed(
        0
      )} is enough to reach your goal of "${newGoal.goalName}".`;
    } else {
      // The user needs to save more
      const shortfall = requiredMonthlyForGoal - currentMonthlyInvestment;
      const foodBudget =
        salary * (expensePercentage / 100) * (foodSplit / 100);
      const travelBudget =
        salary * (expensePercentage / 100) * (travelSplit / 100);
      const subscriptionsBudget =
        salary * (expensePercentage / 100) * (subscriptionsSplit / 100);

      const foodCut = foodBudget * 0.1;
      const travelCut = travelBudget * 0.1;
      const totalCut = foodCut + travelCut;

      adviceMessage = `To afford your goal of "${
        newGoal.goalName
      }", you need to save an extra ₹${shortfall.toFixed(0)} per month.`;

      if (totalCut >= shortfall) {
        adviceMessage += ` Here's a suggestion: Reduce your spending on Food by 10% (save ₹${foodCut.toFixed(
          0
        )}) and Travel by 10% (save ₹${travelCut.toFixed(
          0
        )}). This will help you reach your goal!`;
      } else {
        adviceMessage += ` This is a challenging goal! You may need to significantly reduce your monthly expenses or extend your goal's timeline.`;
      }
    }

    // --- 3. Send the Combined Response ---
    return res.json({ advice: adviceMessage, tags: emotionalTags });
    
  } catch (error) {
    console.error("Error generating goal-based advice:", error);
    res.status(500).json({ message: "Server error while generating advice." });
  }
};