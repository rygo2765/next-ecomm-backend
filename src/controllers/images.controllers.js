import express from 'express'
import prisma from '../utils/prisma.js'
import auth from '../middlewares/auth.js'
import { validateImage } from '../validators/image.js'



const router = express.Router()

router.post('/',auth, async (req, res) => {
  let data = req.body

  //convert image price from float to int, add 00 to price without decimal place
  if (data.price.includes(".")){
    let arr = data.price.split(".")
    data.price = arr.join("")
  } else{
    data.price = data.price + "00"
  }

  //convert price from string to number
  data.price = +data.price

  const validationErrors = validateImage(data)
  
  if (Object.keys(validationErrors).length != 0) return
  res.status(400).send({
    error: validationErrors
  })

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