import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config.js'

export const authorization = (req, res, next) => {
  const token = req.cookies?.access_token

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' })
  }
  try {
    const user = jwt.verify(token, JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({ message: 'Invalid token' })
  }
}
