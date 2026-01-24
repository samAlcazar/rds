import DBLocal from 'db-local'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import z from 'zod'
import { SALT_ROUNDS } from '../../config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

export class UserDB {
  static getAll () {
    return User.find({}) || []
  }

  static async findByUserName (username) {
    const user = User.findOne({ username })
    return user
  }

  static async create ({ username, password }) {
    const parsed = z.object({
      username: z.string().min(3, 'Username must be at least 3 characters long'),
      password: z.string().min(6, 'Password must be at least 6 characters long')
    }).parse({ username, password })

    const user = User.findOne({ username: parsed.username })
    if (user) throw new Error('Username already exists')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(parsed.password, SALT_ROUNDS)

    return await User.create({
      _id: id,
      username: parsed.username,
      password: hashedPassword
    }).save()
  }
}
