import express from 'express'
import prisma from '../utils/prisma.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const allImages = await prisma.images.findMany()
  return res.json(allImages)
})

export default router