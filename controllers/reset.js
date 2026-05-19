const router = require('express').Router()

const { Blog, User, ReadingList, Session } = require('../models')

router.post('/', async (req, res) => {
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {} })
  await Session.destroy({ where: {} })
  await ReadingList.destroy({ where: {} })

  res.status(204).end()
})

module.exports = router