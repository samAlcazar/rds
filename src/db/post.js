import DBLocal from 'db-local'
import crypto from 'node:crypto'
import z from 'zod'

const { Schema } = new DBLocal({ path: './db' })

const Post = Schema('Post', {
  _id: { type: String, required: true },
  date: { type: Date, required: true, default: () => new Date() },
  title: { type: String, required: true },
  imgs: { type: [String], required: false },
  video: { type: [String], required: false },
  excerpt: { type: String, required: true },
  content: { type: [String], required: true },
  tags: { type: [String], required: false }
})

const createPostSchema = z.object({
  date: z.string().default(() => new Date()),
  title: z.string().min(1),
  imgs: z.array(z.string()).optional(),
  video: z.array(z.string()).optional(),
  excerpt: z.string().min(1),
  content: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional()
})

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  imgs: z.array(z.string()).optional(),
  video: z.array(z.string()).optional(),
  excerpt: z.string().min(1, 'Excerpt is required').optional(),
  content: z.array(z.string()).min(1, 'Content is required').optional(),
  tags: z.array(z.string()).optional()
})

export class PostDB {
  static async create ({ date, title, imgs = [], video = [], excerpt, content = [], tags = [] }) {
    try {
      const parsed = createPostSchema.parse({ date, title, imgs, video, excerpt, content, tags })
      const id = crypto.randomUUID()

      return await Post.create({
        _id: id,
        date: parsed.date,
        title: parsed.title,
        imgs: parsed.imgs,
        video: parsed.video,
        excerpt: parsed.excerpt,
        content: parsed.content,
        tags: parsed.tags
      }).save()
    } catch (error) {
      console.error(error)
      throw new Error('Invalid post data')
    }
  }

  static async updateOne ({ id, title, imgs, video, excerpt, content, tags }) {
    const post = Post.findOne({ _id: id })
    if (!post) {
      throw new Error('Post not found')
    }

    try {
      const parsed = updatePostSchema.parse({ title, imgs, video, excerpt, content, tags })

      if (parsed.title) post.title = parsed.title
      if (parsed.imgs) post.imgs = parsed.imgs
      if (parsed.video) post.video = parsed.video
      if (parsed.excerpt) post.excerpt = parsed.excerpt
      if (parsed.content) post.content = parsed.content
      if (parsed.tags) post.tags = parsed.tags

      return await post.save()
    } catch (error) {
      throw new Error('Invalid post data')
    }
  }

  static async delete (id) {
    const post = Post.findOne({ _id: id })
    if (!post) {
      throw new Error('Post not found')
    }
    Post.remove({ _id: id })
    return { message: 'Post deleted' }
  }

  static getAll () {
    return Post.find({}) || []
  }

  static getOne (id) {
    const post = Post.findOne({ _id: id })
    if (!post) {
      throw new Error('Post not found')
    }
    return post
  }

  static findByTag (tag) {
    const allPosts = Post.find({}) || []
    const posts = allPosts.filter(post => post.tags && post.tags.includes(tag))
    if (!posts || posts.length === 0) {
      throw new Error('No posts found for this tag')
    }
    return posts
  }
}
