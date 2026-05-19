const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { ReadingList, Blog, User } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    if (!blogId || !userId) {
      return res.status(400).json({ error: 'blogId and userId are required' })
    }

    const blog = await Blog.findByPk(blogId)
    const user = await User.findByPk(userId)

    if (!blog || !user) {
      return res.status(404).json({ error: 'blog or user not found' })
    }

    const existing = await ReadingList.findOne({
      where: {
        blogId,
        userId
      }
    })

    if (existing) {
      return res.status(400).json({ error: 'blog already in reading list' })
    }

    const readingList = await ReadingList.create({
      blogId,
      userId
    })

    res.json({
      id: readingList.id,
      blog_id: readingList.blogId,
      user_id: readingList.userId,
      read: readingList.read
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)

    if (!readingList) {
      return res.status(404).end()
    }

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: 'operation not allowed' })
    }

    readingList.read = req.body.read
    await readingList.save()

    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router