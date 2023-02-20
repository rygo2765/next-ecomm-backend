import { Prisma } from "@prisma/client"
import express from "express"
import prisma from "./src/utils/prisma.js"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

function filter(obj, ...keys){
  return keys.reduce((a,c) => ({ ...a, [c]: obj[c]}), {})
}

app.get('/', async (req,res) => {
  const allUsers = await prisma.user.findMany()
  res.send(allUsers)
})

app.post('/users', async(req,res) => {
  const data = req.body

  prisma.user.create({ 
    data 
  }).then(user => {
    return res.json(filter(user, 'id', 'name', 'email'))

  }).catch(err => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') // P2002: "Unique constraint failed on the {constraint}" referring to email
     {
      const formattedError = {}
      formattedError[`${err.meta.target[0]}`] = 'already taken'

      return res.status(500).send({
        error: formattedError
      })
    }
    throw err
  })
})

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})