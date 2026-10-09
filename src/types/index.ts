export interface Habit {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  frequency: "daily" | "weekly"
  target: number
  currentStreak: number
  bestStreak: number
  completedToday: boolean
}

export interface UserProfile {
  name: string
  email: string
}
