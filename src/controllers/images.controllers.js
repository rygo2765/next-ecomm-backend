import express from 'express'
import prisma from '../utils/prisma.js'
import auth from '../middlewares/auth.js'



const router = express.Router()

router.post('/',auth, async (req, res) => {
  let data = req.body
  data.price = +data.price
  
  prisma.images.create({
    data: {
      ...data,
      ownerId: req.user.payload.id
    }
  }).then(images => {
    return res.json(images)
  })
})

export default router