
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import serviceRoutes from './routes/serviceRoutes.js'
import extraServiceRoutes from './routes/extraServiceRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import userRoutes from './routes/userRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
//import authRoutes from './routes/authRoutes.js'



dotenv.config()


const app = express()



app.use(express.json())

app.use(cors())
app.use(cookieParser())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true                 
  })
)

//app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/extraServices', extraServiceRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)
app.use('/api/appointments', appointmentRoutes)


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-Wash API is running 🚗💦' })
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
