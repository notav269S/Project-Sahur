// Authentication state
const AuthState = {
  isLogin: true,
  isLoading: false,
}

// Initialize authentication page
function initAuth() {
  // Placeholder for initTheme function
  function initTheme() {
    // Implement theme initialization here
  }

  setupPasswordStrength()
  setupFormValidation()
}

// Toggle between login and signup
function toggleAuthMode() {
  AuthState.isLogin = !AuthState.isLogin

  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")
  const authTitle = document.getElementById("authTitle")
  const authSubtitle = document.getElementById("authSubtitle")
  const toggleText = document.getElementById("toggleText")
  const toggleBtn = document.getElementById("toggleBtn")

  if (AuthState.isLogin) {
    // Switch to login
    loginForm.classList.remove("hidden")
    signupForm.classList.add("hidden")
    authTitle.textContent = "Welcome Back"
    authSubtitle.textContent = "Sign in to your account to continue"
    toggleText.textContent = "Don't have an account?"
    toggleBtn.textContent = "Sign Up"
  } else {
    // Switch to signup
    loginForm.classList.add("hidden")
    signupForm.classList.remove("hidden")
    authTitle.textContent = "Create Account"
    authSubtitle.textContent = "Join thousands of productive users"
    toggleText.textContent = "Already have an account?"
    toggleBtn.textContent = "Sign In"
  }

  clearAlerts()
}

// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.parentElement.querySelector(".password-toggle i")

  if (input.type === "password") {
    input.type = "text"
    button.className = "fas fa-eye-slash"
  } else {
    input.type = "password"
    button.className = "fas fa-eye"
  }
}

// Password strength checker
function setupPasswordStrength() {
  const passwordInput = document.getElementById("signupPassword")
  const strengthFill = document.getElementById("strengthFill")
  const strengthText = document.getElementById("strengthText")

  if (!passwordInput) return

  passwordInput.addEventListener("input", function () {
    const password = this.value
    const strength = calculatePasswordStrength(password)

    strengthFill.style.width = `${strength.percentage}%`
    strengthFill.className = `strength-fill strength-${strength.level}`
    strengthText.textContent = strength.text
  })
}

function calculatePasswordStrength(password) {
  let score = 0
  const feedback = []

  if (password.length >= 8) score += 25
  else feedback.push("at least 8 characters")

  if (/[a-z]/.test(password)) score += 25
  else feedback.push("lowercase letter")

  if (/[A-Z]/.test(password)) score += 25
  else feedback.push("uppercase letter")

  if (/[0-9]/.test(password)) score += 25
  else feedback.push("number")

  if (/[^A-Za-z0-9]/.test(password)) score += 10

  let level, text
  if (score < 30) {
    level = "weak"
    text = "Weak - Add " + feedback.slice(0, 2).join(", ")
  } else if (score < 60) {
    level = "fair"
    text = "Fair - Add " + feedback.slice(0, 1).join(", ")
  } else if (score < 90) {
    level = "good"
    text = "Good password"
  } else {
    level = "strong"
    text = "Strong password"
  }

  return { percentage: Math.min(score, 100), level, text }
}

// Form validation
function setupFormValidation() {
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)

    // Real-time password confirmation
    const confirmPassword = document.getElementById("confirmPassword")
    const signupPassword = document.getElementById("signupPassword")

    confirmPassword.addEventListener("input", function () {
      if (this.value && this.value !== signupPassword.value) {
        this.setCustomValidity("Passwords do not match")
      } else {
        this.setCustomValidity("")
      }
    })
  }
}

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault()

  if (AuthState.isLoading) return

  const formData = new FormData(e.target)
  const email = formData.get("email")
  const password = formData.get("password")
  const remember = formData.get("remember") === "on"

  if (!email || !password) {
    showAlert("error", "Please fill in all fields")
    return
  }

  setLoading(true, "loginBtn")
  clearAlerts()

  try {
    const response = await fetch("auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "login",
        email: email,
        password: password,
        remember: remember,
      }),
    })

    const data = await response.json()

    if (data.success) {
      showAlert("success", "Login successful! Redirecting...")
      setTimeout(() => {
        window.location.href = "dashboard.php"
      }, 1500)
    } else {
      showAlert("error", data.message || "Login failed. Please try again.")
    }
  } catch (error) {
    console.error("Login error:", error)
    showAlert("error", "Network error. Please check your connection.")
  } finally {
    setLoading(false, "loginBtn")
  }
}

// Handle signup form submission
async function handleSignup(e) {
  e.preventDefault()

  if (AuthState.isLoading) return

  const formData = new FormData(e.target)
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const terms = formData.get("terms") === "on"

  if (!name || !email || !password || !confirmPassword) {
    showAlert("error", "Please fill in all fields")
    return
  }

  if (password !== confirmPassword) {
    showAlert("error", "Passwords do not match")
    return
  }

  if (password.length < 6) {
    showAlert("error", "Password must be at least 6 characters long")
    return
  }

  if (!terms) {
    showAlert("error", "Please agree to the Terms of Service")
    return
  }

  setLoading(true, "signupBtn")
  clearAlerts()

  try {
    const response = await fetch("auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "signup",
        name: name,
        email: email,
        password: password,
      }),
    })

    const data = await response.json()

    if (data.success) {
      showAlert("success", "Account created successfully! Redirecting...")
      setTimeout(() => {
        window.location.href = "dashboard.php"
      }, 1500)
    } else {
      showAlert("error", data.message || "Signup failed. Please try again.")
    }
  } catch (error) {
    console.error("Signup error:", error)
    showAlert("error", "Network error. Please check your connection.")
  } finally {
    setLoading(false, "signupBtn")
  }
}

// Social login placeholder
function socialLogin(provider) {
  showAlert("info", `${provider} login will be available soon!`)
}

// Utility functions
function showAlert(type, message) {
  clearAlerts()

  const alertId = type === "error" ? "errorAlert" : "successAlert"
  const messageId = type === "error" ? "errorMessage" : "successMessage"

  const alert = document.getElementById(alertId)
  const messageEl = document.getElementById(messageId)

  if (alert && messageEl) {
    messageEl.textContent = message
    alert.classList.remove("hidden")

    // Auto-hide success messages
    if (type === "success") {
      setTimeout(() => {
        alert.classList.add("hidden")
      }, 5000)
    }
  }
}

function clearAlerts() {
  document.getElementById("errorAlert")?.classList.add("hidden")
  document.getElementById("successAlert")?.classList.add("hidden")
}

function setLoading(loading, buttonId) {
  AuthState.isLoading = loading
  const button = document.getElementById(buttonId)
  const text = button.querySelector(".btn-text")
  const spinner = button.querySelector(".btn-spinner")

  if (loading) {
    button.disabled = true
    text.style.opacity = "0.7"
    spinner.classList.remove("hidden")
  } else {
    button.disabled = false
    text.style.opacity = "1"
    spinner.classList.add("hidden")
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initAuth)
