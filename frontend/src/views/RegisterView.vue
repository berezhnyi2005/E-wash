<template>
  <div class="register-page">
    <div class="register-card">

      <h2 class="title">Registrácia</h2>
      <p class="subtitle">
        Vyplňte údaje pre vytvorenie nového účtu
      </p>

      <form @submit.prevent="handleRegister" class="form">

        <label class="label">Meno a priezvisko</label>
        <input v-model="name" type="text" class="input" placeholder="Zadajte meno" required />

        <label class="label">Email</label>
        <input v-model="email" type="email" class="input" placeholder="Zadajte email" required />

        <label class="label">Heslo</label>
        <div class="password-wrapper">
          <input v-model="password" :type="showPass ? 'text' : 'password'" class="input"
            placeholder="Minimálne 6 znakov" required />
          <span class="eye" @click="showPass = !showPass">
            <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </span>
        </div>

        <button class="btn btn-primary">
          Vytvoriť účet
        </button>
      </form>

      <p class="login">
        Už máte účet?
        <router-link to="/login">Prihlásiť sa</router-link>
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
  background: var(--white);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 420px;
  background: var(--white-aktive);
  padding: 36px 32px;
  border-radius: 18px;
  border: 1px solid var(--color-border);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-main);
  margin-bottom: 6px;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
  margin-bottom: 26px;
}

.label {
  display: block;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-main);
  margin-top: 12px;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  padding: 12px 0px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

.input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.password-wrapper {
  position: relative;
}

.eye {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  color: var(--color-text-muted);
}

.btn {
  width: 100%;
  margin-top: 22px;
  padding: 13px 0;
  font-size: 15px;
  font-weight: 600;
}

.login {
  margin-top: 18px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.login a {
  color: var(--blue);
  font-weight: 600;
  text-decoration: none;
}

.login a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 28px 20px;
    border-radius: 30px;
  }


  .title {
    font-size: 22px;
  }

  .subtitle {
    font-size: 13px;
  }

  .input {
    font-size: 15px;
    padding: 13px 3px;
  }

  .btn {
    font-size: 16px;
    padding: 14px 0;
  }
}
</style>
