import express from 'express'
import prisma from '../utils/prisma.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

//router.post(routePath,[middleware],routeHandler)
//middleware executes before routeHandler
router.post('/',auth, async (req, res) => {
  let data = req.body

  //convert image price from float to int, add 00 to price without decimal place
  data.price = parseInt(parseFloat(data.price)*100)

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