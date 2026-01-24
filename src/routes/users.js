import { Router } from 'express'
import { UserDB } from '../db/user.js'
import { authorization } from '../middleware/authorization.js'

export const userRouter = () => {
  const router = Router()

  router.get('/', authorization, (req, res) => {
    const allUsers = UserDB.getAll()
    res.send(allUsers)
  })

  router.post('/', authorization, async (req, res) => {
    const { username, password } = req.body

    try {
      if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required' })
      }
      const result = await UserDB.create({ username, password })
      res.status(201).send({ message: 'User created successfully', userId: result._id, username: result.username })
    } catch (error) {
      res.status(500).send({ error: 'Internal server errorqwe' })
    }
  })

  return router
}
