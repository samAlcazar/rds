import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { loginRouter } from './src/routes/login.js'
import { postsRouter } from './src/routes/posts.js'
import { authorization } from './src/middleware/authorization.js'
import { userRouter } from './src/routes/users.js'
import { PORT } from './config.js'
import { marqueeRouter } from './src/routes/marqee.js'
import { publicityRouter } from './src/routes/publicity.js'
import { videoRouter } from './src/routes/video.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://reddefensor.com',
    'https://www.reddefensor.com',
    'https://admin.reddefensor.com',
    'https://rds-front.vercel.app',
    'https://rds-admin-eosin.vercel.app'
  ],
  credentials: true
}))

app.set('x-powered-by', false)

app.use('/login', loginRouter())
app.use('/users', userRouter())
app.use('/posts', postsRouter())
app.use('/marquees', marqueeRouter())
app.use('/publicity', publicityRouter())
app.use('/videos', videoRouter())

app.get('/', authorization, (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
