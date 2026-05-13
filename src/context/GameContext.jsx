import { createContext, useContext, useReducer, useEffect } from 'react';
import { calculatePocketMoney, calculateBudgetSplit } from '../utils/calculations';

const GameContext = createContext(null);

const STORAGE_KEY = 'vitfinity_game_state';

/** Initial game state */
const initialState = {
  player: {
    name: '',
    age: 0,
    avatar: '',
    pocketMoney: 0,
  },
  budget: {
    needs: 0,
    wants: 0,
    savings: 0,
    needsSpent: 0,
    wantsSpent: 0,
    savingsUsed: 0,
  },
  progress: {
    currentPhase: 0,
    phasesCompleted: [],
    score: 0,
    happiness: 70,
    financialHealth: 50,
  },
  history: {
    decisions: [],
    emergencies: [],
    rewards: [],
  },
  isOnboarded: false,
};

/** Game state reducer */
function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER': {
      const { name, age, avatar } = action.payload;
      const pocketMoney = calculatePocketMoney(age);
      const budget = calculateBudgetSplit(pocketMoney);
      return {
        ...state,
        player: { name, age, avatar, pocketMoney },
        budget: { ...state.budget, ...budget },
        progress: { ...state.progress, currentPhase: 1 },
        isOnboarded: true,
      };
    }

    case 'ALLOCATE_BUDGET': {
      const { needsPct, wantsPct, savingsPct } = action.payload;
      const budget = calculateBudgetSplit(state.player.pocketMoney, needsPct, wantsPct, savingsPct);
      return {
        ...state,
        budget: {
          ...state.budget,
          ...budget,
          needsSpent: 0,
          wantsSpent: 0,
          savingsUsed: 0,
        },
      };
    }

    case 'SPEND': {
      const { category, amount, item } = action.payload;
      const categoryKey = `${category}Spent`;
      const decision = {
        ...item,
        category,
        amount,
        timestamp: Date.now(),
        purchased: true,
      };
      return {
        ...state,
        budget: {
          ...state.budget,
          [categoryKey]: state.budget[categoryKey] + amount,
        },
        history: {
          ...state.history,
          decisions: [...state.history.decisions, decision],
        },
      };
    }

    case 'SKIP_ITEM': {
      const { item, category } = action.payload;
      const decision = {
        ...item,
        category,
        amount: 0,
        timestamp: Date.now(),
        purchased: false,
      };
      return {
        ...state,
        history: {
          ...state.history,
          decisions: [...state.history.decisions, decision],
        },
      };
    }

    case 'ADD_REWARD': {
      const reward = { ...action.payload, timestamp: Date.now() };
      return {
        ...state,
        progress: {
          ...state.progress,
          score: state.progress.score + (reward.points || 0),
        },
        history: {
          ...state.history,
          rewards: [...state.history.rewards, reward],
        },
      };
    }

    case 'TRIGGER_EMERGENCY': {
      const emergency = { ...action.payload, timestamp: Date.now() };
      return {
        ...state,
        history: {
          ...state.history,
          emergencies: [...state.history.emergencies, emergency],
        },
      };
    }

    case 'USE_SAVINGS': {
      const { amount } = action.payload;
      return {
        ...state,
        budget: {
          ...state.budget,
          savingsUsed: state.budget.savingsUsed + amount,
        },
      };
    }

    case 'UPDATE_HAPPINESS': {
      return {
        ...state,
        progress: {
          ...state.progress,
          happiness: Math.max(0, Math.min(100, action.payload)),
        },
      };
    }

    case 'UPDATE_FINANCIAL_HEALTH': {
      return {
        ...state,
        progress: {
          ...state.progress,
          financialHealth: Math.max(0, Math.min(100, action.payload)),
        },
      };
    }

    case 'ADVANCE_PHASE': {
      const nextPhase = state.progress.currentPhase + 1;
      const completed = state.progress.phasesCompleted.includes(state.progress.currentPhase)
        ? state.progress.phasesCompleted
        : [...state.progress.phasesCompleted, state.progress.currentPhase];
      return {
        ...state,
        progress: {
          ...state.progress,
          currentPhase: nextPhase,
          phasesCompleted: completed,
        },
      };
    }

    case 'COMPLETE_PHASE': {
      const phaseId = action.payload;
      const completed = state.progress.phasesCompleted.includes(phaseId)
        ? state.progress.phasesCompleted
        : [...state.progress.phasesCompleted, phaseId];
      return {
        ...state,
        progress: {
          ...state.progress,
          phasesCompleted: completed,
        },
      };
    }

    case 'SET_PHASE': {
      return {
        ...state,
        progress: {
          ...state.progress,
          currentPhase: action.payload,
        },
      };
    }

    case 'RESET_GAME': {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) { /* ignore */ }
      return { ...initialState };
    }

    case 'LOAD_STATE': {
      return { ...initialState, ...action.payload };
    }

    default:
      return state;
  }
}

/** Provider component */
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, (initial) => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...initial, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load game state:', e);
    }
    return initial;
  });

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save game state:', e);
    }
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

/** Hook to use game state */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

/** Convenience selectors */
export function usePlayer() {
  const { state } = useGame();
  return state.player;
}

export function useBudget() {
  const { state } = useGame();
  return state.budget;
}

export function useProgress() {
  const { state } = useGame();
  return state.progress;
}

export function useHistory() {
  const { state } = useGame();
  return state.history;
}

export function useRemainingBudget() {
  const { state } = useGame();
  const { budget } = state;
  return {
    needs: budget.needs - budget.needsSpent,
    wants: budget.wants - budget.wantsSpent,
    savings: budget.savings - budget.savingsUsed,
    total:
      budget.needs - budget.needsSpent +
      (budget.wants - budget.wantsSpent) +
      (budget.savings - budget.savingsUsed),
  };
}
