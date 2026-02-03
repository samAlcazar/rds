import { Router } from 'express'
import { UserDB } from '../db/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWT_SECRET } from '../../config.js'

export const loginRouter = () => {
  const router = Router()

  router.post('/', async (req, res) => {
    const { username, password } = req.body
    try {
      if (!username || !password) {
        return res.status(400).send({ message: 'Username or password is missing' })
      }

      const result = await UserDB.findByUserName(username)
      if (!result) throw new Error('User not found')

      const isValidPassword = await bcrypt.compare(password, result.password)

      if (!isValidPassword) {
        return res.status(401).send({ message: 'Credentials are invalid' })
      }

      const payload = {
        id: result.id,
        username: result.username
      }

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '3h' })

      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/'
        })
        .json({ username: result.username, message: 'Logged in successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message })
    }
  })

  router.post('/logout', (req, res) => {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })
      .status(200)
      .send({ message: 'Logged out successfully' })
  })

  return router
}
