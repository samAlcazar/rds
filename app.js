import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { loginRouter } from './src/routes/login.js'
import { postsRouter } from './src/routes/posts.js'
import { authorization } from './src/middleware/authorization.js'
import { userRouter } from './src/routes/users.js'
import { PORT } from './config.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.set('x-powered-by', false)

app.use('/login', loginRouter())
app.use('/users', userRouter())
app.use('/posts', postsRouter())

app.get('/', authorization, (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
