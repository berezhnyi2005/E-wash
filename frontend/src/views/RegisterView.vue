<template>
  <div class="register-page">
    <div class="register-card">

      <h2 class="title">Create Account</h2>
      <p class="subtitle">Fill in your details to create a new account</p>

      <form @submit.prevent="handleRegister" class="form">

        <label class="label">Full Name</label>
        <input
          v-model="name"
          type="text"
          class="input"
          placeholder="Enter your name"
          required
        />

        <label class="label">Email Address</label>
        <input
          v-model="email"
          type="email"
          class="input"
          placeholder="Enter your email"
          required
        />

        <label class="label">Password</label>
        <div class="password-wrapper">
          <input
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            class="input"
            placeholder="Minimum 6 characters"
            required
          />
          <span class="eye" @click="showPass = !showPass">
            <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </span>
        </div>

        <button class="btn">Create Account</button>
      </form>

      <p class="login">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
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

const name = ref("")
const email = ref("")
const password = ref("")
const showPass = ref(false)

async function handleRegister() {
  try {
    await axios.post("http://localhost:5000/api/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value
    })

    toast.success("Účet bol úspešne vytvorený!")
    router.push("/login")
  } catch (err) {
    toast.error(err.response?.data?.message || "Registrácia zlyhala")
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
  padding: 20px;
}

.register-card {
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

.btn {
  width: 100%;
  margin-top: 22px;
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

.login {
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.login a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.login a:hover {
  text-decoration: underline;
}
</style>
