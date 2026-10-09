
import type { Habit } from "../types";

export type StoredHabit = Habit & {
  completionDates: string[];
};

const STORAGE_KEY = "tracker-habits-v1";

export function todayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getHabits(): StoredHabit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const habits = JSON.parse(raw) as StoredHabit[];
    if (!Array.isArray(habits)) return [];

    return habits.map((habit) => {
      const completionDates = Array.isArray(habit.completionDates)
        ? habit.completionDates
        : [];

      return {
        ...habit,
        completionDates,
        completedToday: completionDates.includes(todayKey()),
      };
    });
  } catch {
    return [];
  }
}

export function saveHabits(habits: StoredHabit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function toggleCompletion(habit: StoredHabit): StoredHabit {
  const today = todayKey();
  const completed = habit.completionDates.includes(today);
  const completionDates = completed
    ? habit.completionDates.filter((date) => date !== today)
    : [...habit.completionDates, today];

  return {
    ...habit,
    completionDates,
    completedToday: !completed,
  };
}

export function calculateCurrentStreak(completionDates: string[]): number {
  const completed = new Set(completionDates);
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  // If today isn't complete yet, yesterday can still be the active streak.
  if (!completed.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = String(cursor.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${day}`;

    if (!completed.has(key)) break;

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateBestStreak(completionDates: string[]): number {
  const dates = [...new Set(completionDates)].sort();
  if (dates.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const previous = new Date(`${dates[i - 1]}T12:00:00`);
    const currentDate = new Date(`${dates[i]}T12:00:00`);
    const difference = Math.round(
      (currentDate.getTime() - previous.getTime()) / 86400000,
    );

    if (difference === 1) {
      current += 1;
      best = Math.max(best, current);
    } else if (difference > 1) {
      current = 1;
    }
  }

  return best;
}