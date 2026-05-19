const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
        error: error.errors.map(e => e.message) 
    })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ 
        error: error.errors.map( e => e.message ) 
    })
  }

  next(error)
}

const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)

    try {
      req.decodedToken = jwt.verify(token, SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }

    const session = await Session.findOne({
      where: {
        token
      }
    })

    if (!session) {
      return res.status(401).json({ error: 'session expired' })
    }

    req.token = token
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

module.exports = {
  errorHandler,
  tokenExtractor
}
