import { Router } from 'express'
import { PostDB } from '../db/post.js'
import { authorization } from '../middleware/authorization.js'

export const postsRouter = () => {
  const router = Router()

  router.post('/', authorization, async (req, res) => {
    const result = req.body
    try {
      if (!result) {
        return res.status(400).send({ message: 'Missing data' })
      }
      const newPost = await PostDB.create({
        date: result.date,
        title: result.title,
        imgs: result.imgs,
        video: result.video,
        excerpt: result.excerpt,
        content: result.content,
        tags: result.tags
      })
      res.status(201).send({ message: 'Post created', post: newPost._id })
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Error creating post' })
    }
  })

  router.put('/:id', authorization, async (req, res) => {
    const { id } = req.params
    const result = req.body
    try {
      if (!result || !id) {
        return res.status(400).send({ message: 'Id is not valid or is missing' })
      }

      const updatedPost = await PostDB.updateOne({
        id,
        title: result.title,
        imgs: result.imgs,
        video: result.video,
        excerpt: result.excerpt,
        content: result.content,
        tags: result.tags
      })
      res.status(200).send({ message: 'Post updated', updatedPost: updatedPost._id })
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Error updating post' })
    }
  })

  router.delete('/:id', authorization, async (req, res) => {
    const { id } = req.params
    try {
      if (!id) {
        return res.status(400).send({ message: 'Id is missing' })
      }
      await PostDB.delete(id)
      res.status(200).send({ message: 'Post deleted', id })
    } catch (error) {
      console.log(error)
      res.status(404).send({ message: 'Post not found' })
    }
  })

  router.get('/', (req, res) => {
    const allPosts = PostDB.getAll()
    res.send(allPosts)
  })

  router.get('/tag/:tag', (req, res) => {
    const { tag } = req.params
    try {
      const posts = PostDB.findByTag(tag)
      res.send(posts)
    } catch (error) {
      res.status(404).send({ message: 'No posts found for this tag' })
    }
  })

  router.get('/:id', (req, res) => {
    const { id } = req.params
    try {
      const post = PostDB.getOne(id)
      res.send(post)
    } catch (error) {
      res.status(404).send({ message: 'Post not found' })
    }
  })
  return router
}
