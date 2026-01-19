<template>
  <div class="login-page">
    <div class="login-card">

      <h2 class="title">Sign In</h2>
      <p class="subtitle">Enter your credentials to access your account</p>

      <form @submit.prevent="handleLogin">

        <!-- Email -->
        <label class="label">Email Address</label>
        <input
          v-model="email"
          type="email"
          class="input"
          placeholder="Enter your email"
          required
        />

        <!-- Password -->
        <label class="label">Password</label>
        <div class="password-wrapper">
          <input
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            class="input"
            placeholder="Enter your password"
            required
          />
          <span class="eye" @click="showPass = !showPass">
            <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </span>
        </div>

        <div class="bottom-row">
          <label class="remember">
            <input type="checkbox" />
            Remember me
          </label>

          <a href="#" class="forgot">Forgot password?</a>
        </div>

        <button class="btn">Sign In</button>
      </form>

      <p class="register">
        Don't have an account?
        <router-link to="/register">Create one</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useToast } from "vue-toastification"
import { useRouter } from "vue-router"

const toast = useToast()
const router = useRouter()

const email = ref("")
const password = ref("")
const showPass = ref(false)

async function handleLogin() {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: email.value,
        password: password.value
      },
      { withCredentials: true }
    )

    localStorage.setItem("user", JSON.stringify(res.data.user))
    toast.success("Prihlásenie úspešné!")
    router.push("/")
  } catch (err) {
    toast.error(err.response?.data?.message || "Nesprávny email alebo heslo")
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 40px 35px;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  text-align: center;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}

.subtitle {
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 30px;
}

.label {
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-top: 10px;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.password-wrapper {
  position: relative;
}

.eye {
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.remember input {
  margin-right: 6px;
}

.forgot {
  font-size: 14px;
  color: #2563eb;
  text-decoration: none;
}

.forgot:hover {
  text-decoration: underline;
}

.btn {
  width: 100%;
  margin-top: 20px;
  background: #2563eb;
  color: white;
  padding: 13px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}

.btn:hover {
  background: #1d4ed8;
}

.register {
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.register a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.register a:hover {
  text-decoration: underline;
}
</style>
