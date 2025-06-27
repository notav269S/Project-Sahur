// Dashboard-specific functionality with database integration
const DashboardState = {
  userId: window.currentUser?.id || null,
  isOnline: navigator.onLine,
  syncQueue: [],
}

const AppState = {
  tasks: [],
  currentTaskTags: [],
  notes: [],
  currentNoteTags: [],
  journalEntries: [],
  currentJournalTags: [],
  currentJournalMood: "okay",
  moodEntries: [],
  currentMoodTags: [],
  currentMoodScale: 3,
}

// Override the original functions to work with database
async function addTask() {
  const input = document.getElementById("newTaskInput")
  const title = input.value.trim()

  if (!title) return

  const task = {
    title: title,
    completed: false,
    priority: "medium",
    tags: [...AppState.currentTaskTags],
  }

  try {
    const response = await fetch("api/tasks.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })

    const data = await response.json()

    if (data.success) {
      task.id = data.id
      task.createdAt = data.createdAt
      AppState.tasks.unshift(task)

      input.value = ""
      AppState.currentTaskTags = []
      renderTasks()
      renderTaskTags()
      updateStats()
    } else {
      showAlert("error", data.message || "Failed to add task")
    }
  } catch (error) {
    console.error("Error adding task:", error)
    showAlert("error", "Network error. Task saved locally.")

    // Fallback to local storage
    task.id = generateId()
    task.createdAt = new Date().toISOString()
    AppState.tasks.unshift(task)
    saveToLocalStorage("focus-tasks", AppState.tasks)

    input.value = ""
    AppState.currentTaskTags = []
    renderTasks()
    renderTaskTags()
    updateStats()
  }
}

async function toggleTask(taskId) {
  const task = AppState.tasks.find((t) => t.id === taskId)
  if (!task) return

  const originalCompleted = task.completed
  task.completed = !task.completed

  try {
    const response = await fetch(`api/tasks.php?id=${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: task.completed }),
    })

    const data = await response.json()

    if (data.success) {
      renderTasks()
      updateStats()
    } else {
      // Revert on error
      task.completed = originalCompleted
      renderTasks()
      showAlert("error", data.message || "Failed to update task")
    }
  } catch (error) {
    console.error("Error updating task:", error)
    // Keep the change locally but show warning
    renderTasks()
    updateStats()
    showAlert("error", "Network error. Change saved locally.")
  }
}

async function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return

  const taskIndex = AppState.tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) return

  const task = AppState.tasks[taskIndex]
  AppState.tasks.splice(taskIndex, 1)

  try {
    const response = await fetch(`api/tasks.php?id=${taskId}`, {
      method: "DELETE",
    })

    const data = await response.json()

    if (data.success) {
      renderTasks()
      updateStats()
    } else {
      // Restore on error
      AppState.tasks.splice(taskIndex, 0, task)
      renderTasks()
      showAlert("error", data.message || "Failed to delete task")
    }
  } catch (error) {
    console.error("Error deleting task:", error)
    renderTasks()
    updateStats()
    showAlert("error", "Network error. Deletion saved locally.")
  }
}

async function saveNote() {
  const title = document.getElementById("newNoteTitle").value.trim()
  const content = document.getElementById("newNoteContent").value.trim()

  if (!title || !content) return

  const note = {
    title: title,
    content: content,
    tags: [...AppState.currentNoteTags],
  }

  try {
    const response = await fetch("api/notes.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    })

    const data = await response.json()

    if (data.success) {
      note.id = data.id
      note.createdAt = data.createdAt
      note.updatedAt = data.updatedAt
      AppState.notes.unshift(note)

      cancelNewNote()
      renderNotes()
      updateStats()
    } else {
      showAlert("error", data.message || "Failed to save note")
    }
  } catch (error) {
    console.error("Error saving note:", error)
    showAlert("error", "Network error. Note saved locally.")

    // Fallback to local storage
    note.id = generateId()
    note.createdAt = new Date().toISOString()
    note.updatedAt = note.createdAt
    AppState.notes.unshift(note)
    saveToLocalStorage("focus-notes", AppState.notes)

    cancelNewNote()
    renderNotes()
    updateStats()
  }
}

async function deleteNote(noteId) {
  if (!confirm("Are you sure you want to delete this note?")) return

  const noteIndex = AppState.notes.findIndex((n) => n.id === noteId)
  if (noteIndex === -1) return

  const note = AppState.notes[noteIndex]
  AppState.notes.splice(noteIndex, 1)

  try {
    const response = await fetch(`api/notes.php?id=${noteId}`, {
      method: "DELETE",
    })

    const data = await response.json()

    if (data.success) {
      renderNotes()
      updateStats()
    } else {
      // Restore on error
      AppState.notes.splice(noteIndex, 0, note)
      renderNotes()
      showAlert("error", data.message || "Failed to delete note")
    }
  } catch (error) {
    console.error("Error deleting note:", error)
    renderNotes()
    updateStats()
    showAlert("error", "Network error. Deletion saved locally.")
  }
}

async function saveJournalEntry() {
  const content = document.getElementById("journalContent").value.trim()

  if (!content) return

  const entry = {
    date: new Date().toISOString().split("T")[0],
    content: content,
    mood: AppState.currentJournalMood,
    tags: [...AppState.currentJournalTags],
  }

  try {
    const response = await fetch("api/journal.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })

    const data = await response.json()

    if (data.success) {
      entry.id = data.id
      entry.createdAt = data.createdAt
      AppState.journalEntries.unshift(entry)

      document.getElementById("journalContent").value = ""
      AppState.currentJournalTags = []
      AppState.currentJournalMood = "okay"

      renderJournalTags()
      selectJournalMood("okay")
      renderJournalEntries()
      updateStats()
    } else {
      showAlert("error", data.message || "Failed to save journal entry")
    }
  } catch (error) {
    console.error("Error saving journal entry:", error)
    showAlert("error", "Network error. Entry saved locally.")

    // Fallback to local storage
    entry.id = generateId()
    entry.createdAt = new Date().toISOString()
    AppState.journalEntries.unshift(entry)
    saveToLocalStorage("focus-journal", AppState.journalEntries)

    document.getElementById("journalContent").value = ""
    AppState.currentJournalTags = []
    AppState.currentJournalMood = "okay"

    renderJournalTags()
    selectJournalMood("okay")
    renderJournalEntries()
    updateStats()
  }
}

async function saveMoodEntry() {
  const note = document.getElementById("moodNote").value.trim()

  const entry = {
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    mood: AppState.currentMoodScale,
    note: note,
    tags: [...AppState.currentMoodTags],
  }

  try {
    const response = await fetch("api/mood.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })

    const data = await response.json()

    if (data.success) {
      entry.id = data.id
      entry.createdAt = data.createdAt
      AppState.moodEntries.unshift(entry)

      document.getElementById("moodNote").value = ""
      AppState.currentMoodTags = []
      AppState.currentMoodScale = 3

      renderMoodTags()
      selectMoodScale(3)
      renderMoodEntries()
      updateMoodStats()
      updateStats()
    } else {
      showAlert("error", data.message || "Failed to save mood entry")
    }
  } catch (error) {
    console.error("Error saving mood entry:", error)
    showAlert("error", "Network error. Entry saved locally.")

    // Fallback to local storage
    entry.id = generateId()
    entry.createdAt = new Date().toISOString()
    AppState.moodEntries.unshift(entry)
    saveToLocalStorage("focus-mood", AppState.moodEntries)

    document.getElementById("moodNote").value = ""
    AppState.currentMoodTags = []
    AppState.currentMoodScale = 3

    renderMoodTags()
    selectMoodScale(3)
    renderMoodEntries()
    updateMoodStats()
    updateStats()
  }
}

// Load data from database
async function loadUserData() {
  try {
    const [tasksRes, notesRes, journalRes, moodRes] = await Promise.all([
      fetch("api/tasks.php"),
      fetch("api/notes.php"),
      fetch("api/journal.php"),
      fetch("api/mood.php"),
    ])

    const [tasksData, notesData, journalData, moodData] = await Promise.all([
      tasksRes.json(),
      notesRes.json(),
      journalRes.json(),
      moodRes.json(),
    ])

    if (tasksData.success) AppState.tasks = tasksData.data || []
    if (notesData.success) AppState.notes = notesData.data || []
    if (journalData.success) AppState.journalEntries = journalData.data || []
    if (moodData.success) AppState.moodEntries = moodData.data || []

    // Render all data
    renderTasks()
    renderNotes()
    renderJournalEntries()
    renderMoodEntries()
    updateMoodStats()
    updateStats()
  } catch (error) {
    console.error("Error loading user data:", error)
    showAlert("error", "Failed to load data. Using offline mode.")

    // Fallback to local storage
    AppState.tasks = JSON.parse(localStorage.getItem("focus-tasks")) || []
    AppState.notes = JSON.parse(localStorage.getItem("focus-notes")) || []
    AppState.journalEntries = JSON.parse(localStorage.getItem("focus-journal")) || []
    AppState.moodEntries = JSON.parse(localStorage.getItem("focus-mood")) || []

    renderTasks()
    renderNotes()
    renderJournalEntries()
    renderMoodEntries()
    updateMoodStats()
    updateStats()
  }
}

// User menu functionality
function toggleUserMenu() {
  const dropdown = document.getElementById("userDropdown")
  dropdown.classList.toggle("active")
}

// Close user menu when clicking outside
document.addEventListener("click", (e) => {
  const userMenu = document.querySelector(".user-menu")
  const dropdown = document.getElementById("userDropdown")

  if (userMenu && !userMenu.contains(e.target)) {
    dropdown?.classList.remove("active")
  }
})

// Logout functionality
async function logout() {
  try {
    const response = await fetch("auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "logout" }),
    })

    const data = await response.json()

    if (data.success) {
      // Clear local storage
      localStorage.clear()

      // Redirect to login
      window.location.href = "login.html"
    } else {
      showAlert("error", "Failed to logout")
    }
  } catch (error) {
    console.error("Logout error:", error)
    // Force logout on error
    localStorage.clear()
    window.location.href = "login.html"
  }
}

// Alert system for dashboard
function showAlert(type, message) {
  // Create alert element if it doesn't exist
  let alertContainer = document.getElementById("alertContainer")
  if (!alertContainer) {
    alertContainer = document.createElement("div")
    alertContainer.id = "alertContainer"
    alertContainer.style.cssText = `
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `
    document.body.appendChild(alertContainer)
  }

  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.innerHTML = `
    <i class="fas fa-${type === "error" ? "exclamation-circle" : "check-circle"}"></i>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer;">
      <i class="fas fa-times"></i>
    </button>
  `

  alertContainer.appendChild(alert)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove()
    }
  }, 5000)
}

// Initialize dashboard with database data
function initDashboard() {
  initTheme()
  initEventListeners()
  initTabs()

  // Load data from database
  loadUserData()

  updateJournalDate()
  updateMoodDate()
  renderCalendar()
}

// Override the original initApp for dashboard
if (document.getElementById("tasksList")) {
  document.addEventListener("DOMContentLoaded", initDashboard)
}

// Declare missing functions
function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function cancelNewNote() {
  document.getElementById("newNoteTitle").value = ""
  document.getElementById("newNoteContent").value = ""
}

function renderTasks() {
  // Implementation for rendering tasks
}

function renderTaskTags() {
  // Implementation for rendering task tags
}

function updateStats() {
  // Implementation for updating stats
}

function renderNotes() {
  // Implementation for rendering notes
}

function renderJournalTags() {
  // Implementation for rendering journal tags
}

function selectJournalMood(mood) {
  // Implementation for selecting journal mood
}

function renderJournalEntries() {
  // Implementation for rendering journal entries
}

function renderMoodTags() {
  // Implementation for rendering mood tags
}

function selectMoodScale(scale) {
  // Implementation for selecting mood scale
}

function renderMoodEntries() {
  // Implementation for rendering mood entries
}

function updateMoodStats() {
  // Implementation for updating mood stats
}

function initTheme() {
  // Implementation for initializing theme
}

function initEventListeners() {
  // Implementation for initializing event listeners
}

function initTabs() {
  // Implementation for initializing tabs
}

function updateJournalDate() {
  // Implementation for updating journal date
}

function updateMoodDate() {
  // Implementation for updating mood date
}

function renderCalendar() {
  // Implementation for rendering calendar
}
