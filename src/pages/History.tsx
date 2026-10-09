
import { useEffect, useState } from "react";
import { getHabits, todayKey, type StoredHabit } from "../lib/habits";

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function History() {
  const [habits, setHabits] = useState<StoredHabit[]>([]);

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  const today = todayKey();
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (13 - index));
    return date;
  });

  const totalCompletions = habits.reduce(
    (sum, habit) => sum + habit.completionDates.length,
    0,
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1>Habit History</h1>
      <p style={{ color: "#777" }}>
        Review your consistency over the last 14 days.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          margin: "24px 0",
        }}
      >
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 18 }}>
          <p style={{ color: "#777" }}>Total habits</p>
          <strong style={{ fontSize: 28 }}>{habits.length}</strong>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 18 }}>
          <p style={{ color: "#777" }}>Recorded completions</p>
          <strong style={{ fontSize: 28 }}>{totalCompletions}</strong>
        </div>
      </div>

      {habits.length === 0 ? (
        <p>Create a habit first to begin building your history.</p>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {habits.map((habit) => (
            <section
              key={habit.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <h2 style={{ fontSize: 18 }}>
                {habit.icon} {habit.name}
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: 8,
                }}
              >
                {days.map((date) => {
                  const key = dateKey(date);
                  const complete = habit.completionDates.includes(key);

                  return (
                    <div
                      key={key}
                      title={`${key}: ${complete ? "Completed" : "Not completed"}`}
                      style={{
                        textAlign: "center",
                        padding: "10px 2px",
                        borderRadius: 8,
                        background: complete ? "#dcfce7" : "#f3f4f6",
                        color: complete ? "#166534" : "#6b7280",
                        fontSize: 12,
                      }}
                    >
                      <div>
                        {date.toLocaleDateString("en-IN", { weekday: "short" })}
                      </div>
                      <strong style={{ display: "block", marginTop: 5 }}>
                        {date.getDate()}
                      </strong>
                      <div style={{ marginTop: 4 }}>
                        {complete ? "✓" : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p style={{ color: "#777", fontSize: 13 }}>
                {habit.completionDates.includes(today)
                  ? "Completed today"
                  : "Not completed today"}
              </p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}