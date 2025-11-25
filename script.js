/* -------------------------------
   Habit Tracker (LocalStorage)
   Features:
   ✔ Add habit (daily/weekly)
   ✔ Mark habit as complete
   ✔ Track streaks
   ✔ Save data in localStorage
-------------------------------- */

const habitForm = document.getElementById("habit-form");
const habitName = document.getElementById("habit-name");
const habitFrequency = document.getElementById("habit-frequency");
const habitsList = document.getElementById("habits-list");
const emptyText = document.getElementById("empty-text");
const clearAll = document.getElementById("clear-all");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

/* ---------- Save to Local Storage ---------- */
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

/* ---------- Render Habits ---------- */
function renderHabits() {
  habitsList.innerHTML = "";

  if (habits.length === 0) {
    emptyText.style.display = "block";
    return;
  }

  emptyText.style.display = "none";

  habits.forEach(habit => {
    const item = document.createElement("div");
    item.className = "habit-item";

    item.innerHTML = `
      <div>
        <div class="habit-name">${habit.name}</div>
        <div class="habit-info">${habit.frequency} • Streak: ${habit.streak}</div>
      </div>
      <div>
        <button class="btn-small primary" onclick="markDone('${habit.id}')">Done</button>
        <button class="btn-small danger" onclick="deleteHabit('${habit.id}')">Delete</button>
      </div>
    `;

    habitsList.appendChild(item);
  });
}

/* ---------- Add Habit ---------- */
habitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newHabit = {
    id: Date.now().toString(),
    name: habitName.value,
    frequency: habitFrequency.value,
    streak: 0,
    lastDone: null
  };

  habits.push(newHabit);
  saveHabits();
  renderHabits();
  habitName.value = "";
});

/* ---------- Mark Habit Done ---------- */
function markDone(id) {
  const today = new Date().toISOString().slice(0, 10);

  habits = habits.map(habit => {
    if (habit.id === id) {
      if (habit.lastDone === today) {
        alert("Already completed today!");
        return habit;
      }
      habit.streak += 1;
      habit.lastDone = today;
    }
    return habit;
  });

  saveHabits();
  renderHabits();
}

/* ---------- Delete Habit ---------- */
function deleteHabit(id) {
  habits = habits.filter(habit => habit.id !== id);
  saveHabits();
  renderHabits();
}

/* ---------- Clear All ---------- */
clearAll.addEventListener("click", () => {
  if (confirm("Delete all habits?")) {
    habits = [];
    saveHabits();
    renderHabits();
  }
});

/* ---------- Initial Render ---------- */
renderHabits();
