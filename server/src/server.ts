import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config()

connectDB()

const app = express()
app.use(cors(corsConfig))

//Logging
app.use(morgan('dev'))

//Habilitar la lectura de los datos en formato JSON
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

export default app