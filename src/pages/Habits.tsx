
import { useEffect, useState, type FormEvent } from "react";
import type { Habit } from "../types";
import {
  calculateBestStreak,
  calculateCurrentStreak,
  getHabits,
  saveHabits,
  toggleCompletion,
  type StoredHabit,
} from "../lib/habits";

const COLORS = ["#dce8d5", "#dce6f5", "#f5e4d6", "#eadff5", "#f5e5b9"];
const ICONS = ["📚", "🏃", "💧", "🧘", "✍️", "💻", "🎯", "🌱"];

const EMPTY_FORM = {
  name: "",
  description: "",
  icon: "🎯",
  color: COLORS[0],
  frequency: "daily" as Habit["frequency"],
  target: 1,
};

export default function Habits() {
  const [habits, setHabits] = useState<StoredHabit[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  function commit(nextHabits: StoredHabit[]) {
    setHabits(nextHabits);

    try {
      saveHabits(nextHabits);
      setMessage("Changes saved.");
    } catch {
      setMessage("Could not save changes. Check your browser storage.");
    }
  }

  function submitHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) {
      setMessage("Please enter a habit name.");
      return;
    }

    if (editingId) {
      const updated = habits.map((habit) =>
        habit.id === editingId
          ? { ...habit, ...form, name }
          : habit,
      );

      commit(updated);
    } else {
      const newHabit: StoredHabit = {
        ...form,
        name,
        id: crypto.randomUUID(),
        currentStreak: 0,
        bestStreak: 0,
        completedToday: false,
        completionDates: [],
      };

      commit([...habits, newHabit]);
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(habit: StoredHabit) {
    setForm({
      name: habit.name,
      description: habit.description ?? "",
      icon: habit.icon,
      color: habit.color,
      frequency: habit.frequency,
      target: habit.target,
    });

    setEditingId(habit.id);
    setShowForm(true);
    setMessage("");
  }

  function removeHabit(id: string) {
    const habit = habits.find((item) => item.id === id);
    if (!habit) return;

    if (!window.confirm(`Delete "${habit.name}" and its history?`)) {
      return;
    }

    commit(habits.filter((item) => item.id !== id));
  }

  function toggle(habit: StoredHabit) {
    const updated = toggleCompletion(habit);

    const withStreaks: StoredHabit = {
      ...updated,
      currentStreak: calculateCurrentStreak(updated.completionDates),
      bestStreak: calculateBestStreak(updated.completionDates),
    };

    commit(
      habits.map((item) =>
        item.id === habit.id ? withStreaks : item,
      ),
    );
  }

  function cancelForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setMessage("");
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>My Habits</h1>
          <p>Create routines, track progress, and stay consistent.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            if (showForm) {
              cancelForm();
            } else {
              setForm(EMPTY_FORM);
              setEditingId(null);
              setShowForm(true);
              setMessage("");
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add habit"}
        </button>
      </div>

      {message && (
        <p role="status" style={{ marginBottom: 16, color: "#666" }}>
          {message}
        </p>
      )}

      {showForm && (
        <form
          className="card form-fields"
          onSubmit={submitHabit}
          style={{ marginBottom: 24 }}
        >
          <h2 className="section-title">
            {editingId ? "Edit habit" : "Create a habit"}
          </h2>

          <label>
            Habit name
            <input
              required
              maxLength={70}
              value={form.name}
              placeholder="e.g. Read for 20 minutes"
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
            />
          </label>

          <label>
            Description (optional)
            <input
              maxLength={160}
              value={form.description}
              placeholder="Why is this habit important?"
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </label>

          <label>
            Icon
            <select
              value={form.icon}
              onChange={(event) =>
                setForm({ ...form, icon: event.target.value })
              }
            >
              {ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </label>

          <label>
            Frequency
            <select
              value={form.frequency}
              onChange={(event) =>
                setForm({
                  ...form,
                  frequency: event.target.value as Habit["frequency"],
                })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>

          <label>
            Color
            <select
              value={form.color}
              onChange={(event) =>
                setForm({ ...form, color: event.target.value })
              }
            >
              {COLORS.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>

          <button className="primary-button" type="submit">
            {editingId ? "Save changes" : "Create habit"}
          </button>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="card empty-state">
          <p style={{ fontSize: 32 }}>🌱</p>
          <h2>No habits yet</h2>
          <p>Create your first habit to begin tracking your progress.</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map((habit) => {
            const currentStreak = calculateCurrentStreak(
              habit.completionDates,
            );
            const bestStreak = calculateBestStreak(
              habit.completionDates,
            );

            return (
              <article className="habit-row" key={habit.id}>
                <div
                  className="habit-icon"
                  style={{ background: habit.color }}
                >
                  {habit.icon}
                </div>

                <div className="habit-info">
                  <h3>{habit.name}</h3>
                  <p>
                    {habit.description || habit.frequency}
                    {" · "}
                    {currentStreak} day streak
                    {" · "}
                    Best: {bestStreak}
                  </p>
                </div>

                <button
                  className={`habit-check${habit.completedToday ? " completed" : ""}`}
                  onClick={() => toggle(habit)}
                  aria-label={
                    habit.completedToday
                      ? `Mark ${habit.name} incomplete`
                      : `Mark ${habit.name} complete`
                  }
                  title="Toggle today's completion"
                >
                  {habit.completedToday ? "✓" : ""}
                </button>

                <button
                  className="button"
                  onClick={() => startEdit(habit)}
                >
                  Edit
                </button>

                <button
                  className="button"
                  onClick={() => removeHabit(habit.id)}
                  aria-label={`Delete ${habit.name}`}
                >
                  Delete
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}