
import { useEffect, useState } from "react";
import {
  calculateBestStreak,
  calculateCurrentStreak,
  getHabits,
  todayKey,
  type StoredHabit,
} from "../lib/habits";

export default function Insights() {
  const [habits, setHabits] = useState<StoredHabit[]>([]);

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  const today = todayKey();

  const completedToday = habits.filter((habit) =>
    habit.completionDates.includes(today),
  ).length;

  const allDates = habits.flatMap((habit) => habit.completionDates);
  const totalCompletions = allDates.length;

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const count = habits.filter((habit) =>
      habit.completionDates.includes(key),
    ).length;

    return {
      key,
      label: date.toLocaleDateString("en-IN", { weekday: "short" }),
      count,
    };
  });

  const possibleCompletions = habits.length * 7;
  const weeklyRate =
    possibleCompletions === 0
      ? 0
      : Math.round(
          (lastSevenDays.reduce((sum, day) => sum + day.count, 0) /
            possibleCompletions) *
            100,
        );

  const currentStreaks = habits.map((habit) =>
    calculateCurrentStreak(habit.completionDates),
  );
  const bestStreaks = habits.map((habit) =>
    calculateBestStreak(habit.completionDates),
  );

  const longestCurrent = Math.max(0, ...currentStreaks);
  const longestBest = Math.max(0, ...bestStreaks);

  const maxBar = Math.max(1, ...lastSevenDays.map((day) => day.count));

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1>Insights</h1>
      <p style={{ color: "#777" }}>
        Understand your habits and keep improving.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          margin: "24px 0",
        }}
      >
        {[
          { label: "Completed today", value: completedToday },
          { label: "All-time completions", value: totalCompletions },
          { label: "Weekly completion", value: `${weeklyRate}%` },
          { label: "Longest current streak", value: `${longestCurrent} days` },
          { label: "Best recorded streak", value: `${longestBest} days` },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: 18,
              border: "1px solid #e5e7eb",
              borderRadius: 14,
            }}
          >
            <p style={{ color: "#777", marginTop: 0 }}>{stat.label}</p>
            <strong style={{ fontSize: 26 }}>{stat.value}</strong>
          </div>
        ))}
      </div>

      <section
        style={{
          padding: 20,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
        }}
      >
        <h2>Last 7 days</h2>
        <p style={{ color: "#777" }}>
          Number of habits completed each day.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 10,
            alignItems: "end",
            minHeight: 180,
          }}
        >
          {lastSevenDays.map((day) => (
            <div
              key={day.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                height: 180,
                justifyContent: "flex-end",
                minWidth: 0,
              }}
            >
              <strong>{day.count}</strong>
              <div
                title={`${day.key}: ${day.count} completions`}
                style={{
                  width: "100%",
                  maxWidth: 44,
                  height: `${Math.max(6, (day.count / maxBar) * 115)}px`,
                  borderRadius: "8px 8px 3px 3px",
                  background: "#16a34a",
                }}
              />
              <span style={{ fontSize: 12, color: "#777" }}>{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      {habits.length === 0 && (
        <p style={{ marginTop: 24 }}>
          Add your first habit to start generating insights.
        </p>
      )}
    </div>
  );
}