import { useEffect, useState } from "react";
import {
  calculateBestStreak,
  calculateCurrentStreak,
  getHabits,
  saveHabits,
  toggleCompletion,
  todayKey,
  type StoredHabit,
} from "../lib/habits";

export default function Dashboard() {
  const [habits, setHabits] = useState<StoredHabit[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHabits(getHabits());
    setLoaded(true);
  }, []);

  function toggleHabit(id: string) {
    const updated = habits.map((habit) => {
      if (habit.id !== id) return habit;

      const toggled = toggleCompletion(habit);

      return {
        ...toggled,
        currentStreak: calculateCurrentStreak(toggled.completionDates),
        bestStreak: Math.max(
          habit.bestStreak,
          calculateBestStreak(toggled.completionDates),
        ),
      };
    });

    try {
      saveHabits(updated);
      setHabits(updated);
      setError("");
    } catch {
      setError("Could not save your changes. Please try again.");
    }
  }

  const completed = habits.filter((habit) =>
    habit.completionDates.includes(todayKey()),
  ).length;

  const total = habits.length;
  const remaining = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!loaded) {
    return <div style={{ padding: 24 }}>Loading your habits...</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
      <header style={{ marginBottom: 28 }}>
        <p style={{ color: "#777", marginBottom: 6 }}>{today}</p>
        <h1 style={{ fontSize: 32, margin: "0 0 8px" }}>Your Dashboard</h1>
        <p style={{ color: "#777", margin: 0 }}>
          Small actions. Consistent progress.
        </p>
      </header>

      {error && (
        <p role="alert" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Total habits", value: total, icon: "🎯" },
          { label: "Completed today", value: completed, icon: "✅" },
          { label: "Still remaining", value: remaining, icon: "⏳" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: 20,
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              background: "var(--card, #ffffff)",
            }}
          >
            <div style={{ fontSize: 24 }}>{stat.icon}</div>
            <p style={{ color: "#777", margin: "12px 0 4px" }}>
              {stat.label}
            </p>
            <strong style={{ fontSize: 30 }}>{stat.value}</strong>
          </div>
        ))}
      </div>

      <section
        style={{
          padding: 22,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20 }}>Daily progress</h2>
          <strong>{progress}%</strong>
        </div>

        <div
          style={{
            height: 10,
            borderRadius: 99,
            background: "#e5e7eb",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#16a34a",
              borderRadius: 99,
              transition: "width 200ms ease",
            }}
          />
        </div>

        <p style={{ color: "#777", marginBottom: 0 }}>
          {total === 0
            ? "Add your first habit to start tracking your progress."
            : completed === total
              ? "Amazing! All your habits are complete for today."
              : `${completed} of ${total} habits completed. Keep going!`}
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Today's habits</h2>

        {habits.length === 0 ? (
          <div
            style={{
              padding: 28,
              textAlign: "center",
              border: "1px dashed #cbd5e1",
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 36 }}>🌱</div>
            <h3>No habits yet</h3>
            <p style={{ color: "#777" }}>
              Visit the Habits page to create your first habit.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {habits.map((habit) => {
              const done = habit.completionDates.includes(todayKey());

              return (
                <div
                  key={habit.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: 16,
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    opacity: done ? 0.8 : 1,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleHabit(habit.id)}
                    aria-label={
                      done
                        ? `Mark ${habit.name} incomplete`
                        : `Complete ${habit.name}`
                    }
                    style={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      borderRadius: "50%",
                      border: `2px solid ${done ? "#16a34a" : "#cbd5e1"}`,
                      background: done ? "#16a34a" : "transparent",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: 17,
                    }}
                  >
                    {done ? "✓" : ""}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        textDecoration: done ? "line-through" : "none",
                      }}
                    >
                      {habit.icon} {habit.name}
                    </div>
                    {habit.description && (
                      <p style={{ color: "#777", margin: "4px 0 0" }}>
                        {habit.description}
                      </p>
                    )}
                    <p style={{ color: "#777", fontSize: 13, margin: "6px 0 0" }}>
                      🔥 {habit.currentStreak} day streak
                    </p>
                  </div>

                  <span
                    style={{
                      color: done ? "#16a34a" : "#777",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {done ? "Done" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}