import express from 'express'
import prisma from '../utils/prisma.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const allImages = await prisma.images.findMany()
  return res.json(allImages)
})

router.delete('/:id', auth, async (req, res) => {
  console.log(req.params.id)
  const image = await prisma.images.findUnique({
    where: {
      id: +req.params.id
    }
  })
  
  // we have access to `req.user` from our auth middleware function (see code above where the assignment was made)
  if (req.user.payload.id != image.ownerId) {
      return res.status(401).send({"error": "Unauthorized"})
  }
  
  // some code
  const deleteImage = await prisma.images.delete({
    where:{
      id: +req.params.id
    }
  })
  
  return res.json(deleteImage);
})

export default router