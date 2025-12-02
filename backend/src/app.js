// Импортируем необходимые библиотеки
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import serviceRoutes from './routes/serviceRoutes.js'
import extraServiceRoutes from './routes/extraServiceRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import userRoutes from './routes/userRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'




// Загружаем переменные окружения (.env)
dotenv.config()

// Создаём экземпляр приложения Express
const app = express()

// === Middleware ===
// Это как “прослойки”, которые обрабатывают запросы перед тем, как дойдут до маршрутов.

// Позволяет серверу принимать JSON-тело в запросах (например, POST /api/login с данными)
app.use(express.json())

// Разрешаем запросы с фронтенда (CORS = Cross-Origin Resource Sharing)
app.use(cors())

// ниже, после middleware
app.use('/api/services', serviceRoutes)
app.use('/api/extraServices', extraServiceRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)
app.use('/api/appointments', appointmentRoutes)

// === ROUTE TEST ===
// Простейший маршрут, чтобы проверить, работает ли сервер
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-Wash API is running 🚗💦' })
})

// === SERVER START ===
// PORT читаем из .env, а если нет — используем 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
