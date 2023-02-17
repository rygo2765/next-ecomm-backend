import express from "express"
import prisma from "./src/utils/prisma.js"

const app = express()
const port = process.env.PORT || 3000

app.get('/', async (req,res) => {
  const allUsers = await prisma.user.findMany()
  res.send(allUsers)
})

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})