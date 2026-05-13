/**
 * Financial calculation helpers for the VitFinity Budget Simulator
 */

/**
 * Calculate pocket money based on age
 * Formula: Age × 10 Units
 */
export function calculatePocketMoney(age) {
  return Math.max(0, Math.round(age * 10));
}

/**
 * Calculate budget allocation from total and percentages
 * @returns {{ needs: number, wants: number, savings: number }}
 */
export function calculateBudgetSplit(total, needsPct = 50, wantsPct = 30, savingsPct = 20) {
  return {
    needs: Math.round((total * needsPct) / 100),
    wants: Math.round((total * wantsPct) / 100),
    savings: Math.round((total * savingsPct) / 100),
  };
}

/**
 * Calculate happiness score based on spending decisions
 * Range: 0–100
 */
export function calculateHappiness(decisions) {
  if (!decisions || decisions.length === 0) return 70; // baseline happiness

  let happiness = 70;

  decisions.forEach((d) => {
    if (d.type === 'want' && d.purchased) happiness += 5;
    if (d.type === 'want' && !d.purchased) happiness -= 2;
    if (d.type === 'need' && d.purchased) happiness += 3;
    if (d.type === 'need' && !d.purchased) happiness -= 8;
    if (d.type === 'smart_alternative') happiness += 7;
    if (d.type === 'saved') happiness += 2;
  });

  return Math.max(0, Math.min(100, happiness));
}

/**
 * Calculate financial health score based on budget status
 * Range: 0–100
 */
export function calculateFinancialHealth(budget) {
  if (!budget) return 50;

  let health = 50;
  const { needs, wants, savings, needsSpent = 0, wantsSpent = 0, savingsUsed = 0 } = budget;

  // Reward staying under budget
  if (needsSpent <= needs) health += 15;
  else health -= 10;

  if (wantsSpent <= wants) health += 10;
  else health -= 15;

  // Reward savings preservation
  const savingsRemaining = savings - savingsUsed;
  if (savingsRemaining > 0) health += 20;
  if (savingsRemaining === savings) health += 5; // untouched savings bonus

  return Math.max(0, Math.min(100, health));
}

/**
 * Format currency value with coin symbol
 */
export function formatCurrency(amount) {
  return `${Math.round(amount)} Units`;
}

/**
 * Get grade/rating based on score
 */
export function getGrade(score) {
  if (score >= 90) return { grade: 'S', label: 'Stellar!', color: 'solar-yellow' };
  if (score >= 80) return { grade: 'A', label: 'Amazing!', color: 'nova-green' };
  if (score >= 70) return { grade: 'B', label: 'Great Job!', color: 'plasma-blue' };
  if (score >= 60) return { grade: 'C', label: 'Good Effort', color: 'plasma-purple' };
  if (score >= 50) return { grade: 'D', label: 'Keep Trying', color: 'cosmic-pink' };
  return { grade: 'F', label: 'Room to Grow', color: 'comet-red' };
}

/**
 * Calculate percentage safely
 */
export function safePercentage(value, total) {
  if (total === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}
