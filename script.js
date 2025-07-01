// Global state management
const AppState = {
  tasks: JSON.parse(localStorage.getItem("focus-tasks")) || [],
  notes: JSON.parse(localStorage.getItem("focus-notes")) || [],
  journalEntries: JSON.parse(localStorage.getItem("focus-journal")) || [],
  moodEntries: JSON.parse(localStorage.getItem("focus-mood")) || [],
  currentTab: "tasks",
  currentJournalMood: "okay",
  currentMoodScale: 3,
  currentTaskTags: [],
  currentNoteTags: [],
  currentJournalTags: [],
  currentMoodTags: [],
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  quickActionsOpen: false,
}

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem("focus-theme")
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  const theme = savedTheme || systemTheme

  document.documentElement.setAttribute("data-theme", theme)
  updateThemeToggle(theme)
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("focus-theme", newTheme)
  updateThemeToggle(newTheme)
}

function updateThemeToggle(theme) {
  const toggles = document.querySelectorAll("#themeToggle")
  toggles.forEach((toggle) => {
    const sunIcon = toggle.querySelector(".sun-icon")
    const moonIcon = toggle.querySelector(".moon-icon")

    if (theme === "dark") {
      sunIcon.style.opacity = "0"
      sunIcon.style.transform = "translate(-50%, -50%) rotate(-90deg) scale(0)"
      moonIcon.style.opacity = "1"
      moonIcon.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)"
    } else {
      sunIcon.style.opacity = "1"
      sunIcon.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)"
      moonIcon.style.opacity = "0"
      moonIcon.style.transform = "translate(-50%, -50%) rotate(90deg) scale(0)"
    }
  })
}

// Utility functions
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Tab management
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")
      switchTab(tabId)
    })
  })
}

function switchTab(tabId) {
  // Update buttons
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active")

  // Update content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active")
  })
  document.getElementById(tabId).classList.add("active")

  AppState.currentTab = tabId

  // Initialize tab-specific content
  switch (tabId) {
    case "calendar":
      renderCalendar()
      break
    case "journal":
      updateJournalDate()
      break
    case "mood":
      updateMoodDate()
      updateMoodStats()
      break
  }
}

// Welcome banner
function dismissWelcome() {
  const banner = document.getElementById("welcomeBanner")
  if (banner) {
    banner.style.display = "none"
    localStorage.setItem("focus-welcome-dismissed", "true")
  }
}

// Task management
function addTask() {
  const input = document.getElementById("newTaskInput")
  const title = input.value.trim()

  if (!title) return

  const task = {
    id: generateId(),
    title: title,
    completed: false,
    priority: "medium",
    tags: [...AppState.currentTaskTags],
    createdAt: new Date().toISOString(),
    dueDate: null,
  }

  AppState.tasks.unshift(task)
  saveToLocalStorage("focus-tasks", AppState.tasks)

  input.value = ""
  AppState.currentTaskTags = []
  renderTasks()
  renderTaskTags()
  updateStats()
}

function toggleTask(taskId) {
  const task = AppState.tasks.find((t) => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    saveToLocalStorage("focus-tasks", AppState.tasks)
    renderTasks()
    updateStats()
  }
}

function deleteTask(taskId) {
  AppState.tasks = AppState.tasks.filter((t) => t.id !== taskId)
  saveToLocalStorage("focus-tasks", AppState.tasks)
  renderTasks()
  updateStats()
}

function addTaskTag() {
  const input = document.getElementById("taskTagInput")
  const tag = input.value.trim()

  if (tag && !AppState.currentTaskTags.includes(tag)) {
    AppState.currentTaskTags.push(tag)
    input.value = ""
    renderTaskTags()
  }
}

function removeTaskTag(tag) {
  AppState.currentTaskTags = AppState.currentTaskTags.filter((t) => t !== tag)
  renderTaskTags()
}

function renderTaskTags() {
  const container = document.getElementById("taskTags")
  if (!container) return

  container.innerHTML = AppState.currentTaskTags
    .map(
      (tag) => `
        <span class="tag">
            ${tag}
            <button class="tag-remove" onclick="removeTaskTag('${tag}')">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `,
    )
    .join("")
}

function renderTasks() {
  const container = document.getElementById("tasksList")
  const summary = document.getElementById("tasksSummary")

  if (!container) return

  if (AppState.tasks.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No tasks yet. Add your first task above!</p>'
  } else {
    container.innerHTML = AppState.tasks
      .map(
        (task) => `
            <div class="task-item">
                <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} 
                       onchange="toggleTask('${task.id}')">
                <div class="task-content">
                    <div class="task-title ${task.completed ? "completed" : ""}">${task.title}</div>
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                        ${task.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                        ${
                          task.dueDate
                            ? `
                            <div class="task-due-date">
                                <i class="fas fa-calendar"></i>
                                ${task.dueDate}
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-delete" onclick="deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  if (summary) {
    const completed = AppState.tasks.filter((t) => t.completed).length
    const total = AppState.tasks.length
    summary.textContent = `${total - completed} of ${total} tasks remaining`
  }
}

// Notes management
function showNewNoteForm() {
  const form = document.getElementById("newNoteForm")
  if (form) {
    form.classList.remove("hidden")
    document.getElementById("newNoteTitle").focus()
  }
}

function cancelNewNote() {
  const form = document.getElementById("newNoteForm")
  if (form) {
    form.classList.add("hidden")
    document.getElementById("newNoteTitle").value = ""
    document.getElementById("newNoteContent").value = ""
    AppState.currentNoteTags = []
    renderNoteTags()
  }
}

function saveNote() {
  const title = document.getElementById("newNoteTitle").value.trim()
  const content = document.getElementById("newNoteContent").value.trim()

  if (!title || !content) return

  const note = {
    id: generateId(),
    title: title,
    content: content,
    tags: [...AppState.currentNoteTags],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  AppState.notes.unshift(note)
  saveToLocalStorage("focus-notes", AppState.notes)

  cancelNewNote()
  renderNotes()
  updateStats()
}

function deleteNote(noteId) {
  AppState.notes = AppState.notes.filter((n) => n.id !== noteId)
  saveToLocalStorage("focus-notes", AppState.notes)
  renderNotes()
  updateStats()
}

function addNoteTag() {
  const input = document.getElementById("noteTagInput")
  const tag = input.value.trim()

  if (tag && !AppState.currentNoteTags.includes(tag)) {
    AppState.currentNoteTags.push(tag)
    input.value = ""
    renderNoteTags()
  }
}

function removeNoteTag(tag) {
  AppState.currentNoteTags = AppState.currentNoteTags.filter((t) => t !== tag)
  renderNoteTags()
}

function renderNoteTags() {
  const container = document.getElementById("noteTags")
  if (!container) return

  container.innerHTML = AppState.currentNoteTags
    .map(
      (tag) => `
        <span class="tag">
            ${tag}
            <button class="tag-remove" onclick="removeNoteTag('${tag}')">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `,
    )
    .join("")
}

function renderNotes() {
  const container = document.getElementById("notesList")
  if (!container) return

  if (AppState.notes.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No notes yet. Create your first note!</p>'
  } else {
    container.innerHTML = AppState.notes
      .map(
        (note) => `
            <div class="note-item">
                <div class="note-header">
                    <h4 class="note-title">${note.title}</h4>
                    <div class="note-actions">
                        <button class="note-action">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="note-action delete" onclick="deleteNote('${note.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="note-content">${note.content}</p>
                ${
                  note.tags.length > 0
                    ? `
                    <div class="note-tags">
                        ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                `
                    : ""
                }
                <div class="note-date">Updated: ${formatDate(note.updatedAt)}</div>
            </div>
        `,
      )
      .join("")
  }
}

// Calendar management
function previousMonth() {
  AppState.currentMonth--
  if (AppState.currentMonth < 0) {
    AppState.currentMonth = 11
    AppState.currentYear--
  }
  renderCalendar()
}

function nextMonth() {
  AppState.currentMonth++
  if (AppState.currentMonth > 11) {
    AppState.currentMonth = 0
    AppState.currentYear++
  }
  renderCalendar()
}

function renderCalendar() {
  const monthElement = document.getElementById("currentMonth")
  const gridElement = document.getElementById("calendarGrid")

  if (!monthElement || !gridElement) return

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  monthElement.textContent = `${monthNames[AppState.currentMonth]} ${AppState.currentYear}`

  const firstDay = new Date(AppState.currentYear, AppState.currentMonth, 1).getDay()
  const daysInMonth = new Date(AppState.currentYear, AppState.currentMonth + 1, 0).getDate()
  const today = new Date()
  const isCurrentMonth = today.getMonth() === AppState.currentMonth && today.getFullYear() === AppState.currentYear

  let calendarHTML = ""

  // Day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  dayHeaders.forEach((day) => {
    calendarHTML += `<div class="calendar-day-header">${day}</div>`
  })

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<div class="calendar-day"></div>'
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === today.getDate()
    const events = getEventsForDate(AppState.currentYear, AppState.currentMonth, day)

    calendarHTML += `
            <div class="calendar-day ${isToday ? "today" : ""}">
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-events">
                    ${events
                      .slice(0, 2)
                      .map(
                        (event) => `
                        <div class="calendar-event event-${event.type}" title="${event.title} at ${event.time}">
                            ${event.title}
                        </div>
                    `,
                      )
                      .join("")}
                    ${events.length > 2 ? `<div class="calendar-event">+${events.length - 2} more</div>` : ""}
                </div>
            </div>
        `
  }

  gridElement.innerHTML = calendarHTML
  renderUpcomingEvents()
}

function getEventsForDate(year, month, day) {
  // Sample events - in a real app, this would come from your data
  const sampleEvents = [
    { id: "1", title: "Team Meeting", date: "2024-01-15", time: "10:00", type: "meeting" },
    { id: "2", title: "Project Deadline", date: "2024-01-18", time: "17:00", type: "task" },
    { id: "3", title: "Lunch with Sarah", date: "2024-01-20", time: "12:30", type: "personal" },
  ]

  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  return sampleEvents.filter((event) => event.date === dateStr)
}

function renderUpcomingEvents() {
  const container = document.getElementById("upcomingEventsList")
  if (!container) return

  const sampleEvents = [
    { id: "1", title: "Team Meeting", date: "2024-01-15", time: "10:00", type: "meeting" },
    { id: "2", title: "Project Deadline", date: "2024-01-18", time: "17:00", type: "task" },
    { id: "3", title: "Lunch with Sarah", date: "2024-01-20", time: "12:30", type: "personal" },
  ]

  container.innerHTML = sampleEvents
    .slice(0, 3)
    .map(
      (event) => `
        <div class="upcoming-event">
            <div class="event-indicator ${event.type}"></div>
            <div class="event-details">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${event.date} at ${event.time}</div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Journal management
function updateJournalDate() {
  const dateElement = document.getElementById("journalDate")
  if (dateElement) {
    dateElement.textContent = formatDate(new Date())
  }
}

function selectJournalMood(mood) {
  AppState.currentJournalMood = mood

  document.querySelectorAll(".mood-button").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-mood="${mood}"]`).classList.add("active")
}

function addJournalTag() {
  const input = document.getElementById("journalTagInput")
  const tag = input.value.trim()

  if (tag && !AppState.currentJournalTags.includes(tag)) {
    AppState.currentJournalTags.push(tag)
    input.value = ""
    renderJournalTags()
  }
}

function removeJournalTag(tag) {
  AppState.currentJournalTags = AppState.currentJournalTags.filter((t) => t !== tag)
  renderJournalTags()
}

function renderJournalTags() {
  const container = document.getElementById("journalTags")
  if (!container) return

  container.innerHTML = AppState.currentJournalTags
    .map(
      (tag) => `
        <span class="tag">
            ${tag}
            <button class="tag-remove" onclick="removeJournalTag('${tag}')">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `,
    )
    .join("")
}

function saveJournalEntry() {
  const content = document.getElementById("journalContent").value.trim()

  if (!content) return

  const entry = {
    id: generateId(),
    date: new Date().toISOString().split("T")[0],
    content: content,
    mood: AppState.currentJournalMood,
    tags: [...AppState.currentJournalTags],
    createdAt: new Date().toISOString(),
  }

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

function renderJournalEntries() {
  const container = document.getElementById("journalEntriesList")
  if (!container) return

  if (AppState.journalEntries.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No journal entries yet. Start writing!</p>'
  } else {
    container.innerHTML = AppState.journalEntries
      .map(
        (entry) => `
            <div class="journal-entry">
                <div class="journal-entry-header">
                    <div class="journal-entry-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(entry.date)}
                    </div>
                    <div class="journal-entry-mood mood-${entry.mood}">
                        ${getMoodEmoji(entry.mood)} ${entry.mood}
                    </div>
                </div>
                ${
                  entry.tags.length > 0
                    ? `
                    <div class="note-tags">
                        ${entry.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                `
                    : ""
                }
                <div class="journal-entry-content">${entry.content}</div>
            </div>
        `,
      )
      .join("")
  }
}

// Mood log management
function updateMoodDate() {
  const dateElement = document.getElementById("moodDate")
  if (dateElement) {
    dateElement.textContent = formatDate(new Date())
  }
}

function selectMoodScale(scale) {
  AppState.currentMoodScale = scale

  document.querySelectorAll(".mood-scale-button").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-mood="${scale}"]`).classList.add("active")
}

function addMoodTag() {
  const input = document.getElementById("moodTagInput")
  const tag = input.value.trim()

  if (tag && !AppState.currentMoodTags.includes(tag)) {
    AppState.currentMoodTags.push(tag)
    input.value = ""
    renderMoodTags()
  }
}

function removeMoodTag(tag) {
  AppState.currentMoodTags = AppState.currentMoodTags.filter((t) => t !== tag)
  renderMoodTags()
}

function renderMoodTags() {
  const container = document.getElementById("moodTags")
  if (!container) return

  container.innerHTML = AppState.currentMoodTags
    .map(
      (tag) => `
        <span class="tag">
            ${tag}
            <button class="tag-remove" onclick="removeMoodTag('${tag}')">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `,
    )
    .join("")
}

function saveMoodEntry() {
  const note = document.getElementById("moodNote").value.trim()

  const entry = {
    id: generateId(),
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    mood: AppState.currentMoodScale,
    note: note,
    tags: [...AppState.currentMoodTags],
    createdAt: new Date().toISOString(),
  }

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

function updateMoodStats() {
  const totalElement = document.getElementById("totalMoodEntries")
  const averageElement = document.getElementById("averageMood")
  const todayElement = document.getElementById("todayMoodEntries")

  if (totalElement) totalElement.textContent = AppState.moodEntries.length

  if (averageElement) {
    const average =
      AppState.moodEntries.length > 0
        ? (AppState.moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / AppState.moodEntries.length).toFixed(1)
        : "0.0"
    averageElement.textContent = average
  }

  if (todayElement) {
    const today = new Date().toISOString().split("T")[0]
    const todayEntries = AppState.moodEntries.filter((entry) => entry.date === today)
    todayElement.textContent = todayEntries.length
  }
}

function renderMoodEntries() {
  const container = document.getElementById("moodEntriesList")
  if (!container) return

  if (AppState.moodEntries.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No mood entries yet. Log your first mood!</p>'
  } else {
    container.innerHTML = AppState.moodEntries
      .slice(0, 5)
      .map(
        (entry) => `
            <div class="mood-entry">
                <div class="mood-entry-header">
                    <div class="mood-entry-date">
                        <i class="fas fa-calendar"></i>
                        ${entry.date} at ${entry.time}
                    </div>
                    <div class="mood-entry-scale mood-scale-${entry.mood}">
                        ${getMoodEmoji(entry.mood)} ${getMoodLabel(entry.mood)}
                    </div>
                </div>
                ${entry.note ? `<div class="mood-entry-content">${entry.note}</div>` : ""}
                ${
                  entry.tags.length > 0
                    ? `
                    <div class="mood-entry-tags">
                        ${entry.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `,
      )
      .join("")
  }
}

function getMoodEmoji(mood) {
  const emojiMap = {
    1: "😢",
    2: "😔",
    3: "😐",
    4: "😊",
    5: "😄",
    great: "😄",
    good: "😊",
    okay: "😐",
    bad: "😔",
    terrible: "😢",
  }
  return emojiMap[mood] || "😐"
}

function getMoodLabel(mood) {
  const labelMap = {
    1: "Very Low",
    2: "Low",
    3: "Neutral",
    4: "Good",
    5: "Excellent",
  }
  return labelMap[mood] || "Neutral"
}

// Quick actions
function toggleQuickActions() {
  const menu = document.getElementById("quickActionsMenu")
  const toggle = document.getElementById("quickActionsToggle")

  AppState.quickActionsOpen = !AppState.quickActionsOpen

  if (AppState.quickActionsOpen) {
    menu.classList.add("active")
    toggle.classList.add("active")
  } else {
    menu.classList.remove("active")
    toggle.classList.remove("active")
  }
}

function quickAction(tab) {
  switchTab(tab)
  toggleQuickActions()

  // Focus on relevant input
  setTimeout(() => {
    switch (tab) {
      case "tasks":
        document.getElementById("newTaskInput")?.focus()
        break
      case "notes":
        showNewNoteForm()
        break
      case "journal":
        document.getElementById("journalContent")?.focus()
        break
      case "mood":
        document.getElementById("moodNote")?.focus()
        break
    }
  }, 100)
}

// Stats update
function updateStats() {
  const tasksCompleted = document.getElementById("tasksCompleted")
  const notesCount = document.getElementById("notesCount")
  const journalEntries = document.getElementById("journalEntries")
  const moodEntries = document.getElementById("moodEntries")

  if (tasksCompleted) {
    tasksCompleted.textContent = AppState.tasks.filter((t) => t.completed).length
  }
  if (notesCount) {
    notesCount.textContent = AppState.notes.length
  }
  if (journalEntries) {
    journalEntries.textContent = AppState.journalEntries.length
  }
  if (moodEntries) {
    moodEntries.textContent = AppState.moodEntries.length
  }
}

// Event listeners
function initEventListeners() {
  // Theme toggle
  document.querySelectorAll("#themeToggle").forEach((toggle) => {
    toggle.addEventListener("click", toggleTheme)
  })

  // Task input enter key
  const taskInput = document.getElementById("newTaskInput")
  if (taskInput) {
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTask()
    })
  }

  // Tag inputs enter key
  const tagInputs = ["taskTagInput", "noteTagInput", "journalTagInput", "moodTagInput"]
  tagInputs.forEach((inputId) => {
    const input = document.getElementById(inputId)
    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          switch (inputId) {
            case "taskTagInput":
              addTaskTag()
              break
            case "noteTagInput":
              addNoteTag()
              break
            case "journalTagInput":
              addJournalTag()
              break
            case "moodTagInput":
              addMoodTag()
              break
          }
        }
      })
    }
  })

  // Close quick actions when clicking outside
  document.addEventListener("click", (e) => {
    const quickActions = document.querySelector(".quick-actions")
    if (quickActions && !quickActions.contains(e.target) && AppState.quickActionsOpen) {
      toggleQuickActions()
    }
  })

  // Check if welcome banner should be hidden
  if (localStorage.getItem("focus-welcome-dismissed")) {
    const banner = document.getElementById("welcomeBanner")
    if (banner) banner.style.display = "none"
  }
}

// Initialize app
function initApp() {
  initTheme()
  initEventListeners()

  // Only initialize dashboard features if we're on the dashboard page
  if (document.getElementById("tasksList")) {
    initTabs()
    renderTasks()
    renderNotes()
    renderJournalEntries()
    renderMoodEntries()
    renderCalendar()
    updateJournalDate()
    updateMoodDate()
    updateMoodStats()
    updateStats()
  }
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)
