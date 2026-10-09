
import { useEffect, useState } from "react";
import { getHabits, type StoredHabit } from "../lib/habits";

export default function Dashboard() {
  const [habits, setHabits] = useState<StoredHabit[]>([]);

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  const completed = habits.filter((habit) => habit.completedToday).length;
  const total = habits.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>A little progress every day adds up.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card">
          <div className="stat-label">Total habits</div>
          <div className="stat-value">{total}</div>
          <div className="stat-note">Your active routines</div>
        </div>
        <div className="card">
          <div className="stat-label">Completed today</div>
          <div className="stat-value">{completed}/{total}</div>
          <div className="stat-note">Keep moving forward</div>
        </div>
        <div className="card">
          <div className="stat-label">Daily progress</div>
          <div className="stat-value">{progress}%</div>
          <div className="stat-note">Today's completion rate</div>
        </div>
        <div className="card">
          <div className="stat-label">Remaining</div>
          <div className="stat-value">{total - completed}</div>
          <div className="stat-note">Habits left for today</div>
        </div>
      </div>

      <h2 className="section-title">Today's habits</h2>

      {habits.length === 0 ? (
        <div className="card empty-state">
          <p style={{ fontSize: 32 }}>🎯</p>
          <h2>Your first step starts here</h2>
          <p>Open My Habits to create a routine and see it on your dashboard.</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map((habit) => (
            <article className="habit-row" key={habit.id}>
              <div className="habit-icon" style={{ background: habit.color }}>
                {habit.icon}
              </div>
              <div className="habit-info">
                <h3>{habit.name}</h3>
                <p>{habit.completedToday ? "Completed today" : "Not completed yet"}</p>
              </div>
              <span>{habit.completedToday ? "✓ Done" : "In progress"}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}