import express from 'express'
import bcrypt from "bcryptjs"
import { Prisma } from '@prisma/client'
import prisma from '../utils/prisma.js'
import {validateUser} from "../validators/users.js"
import {filter} from "../utils/common.js"
import sgMail from '@sendgrid/mail'

const emailAPI = process.env.SENDGRID_API_KEY
sgMail.setApiKey(emailAPI)

const router = express.Router()

router.post('/', async (req, res) => {
  const data = req.body

  const validationErrors = validateUser(data)

  data.password = bcrypt.hashSync(data.password, 8);

  if (Object.keys(validationErrors).length != 0) return res.status(400).send({
    error: validationErrors
  })

  prisma.user.create({
    data
  })
  .then(user => {
    const msg = {
      to: `${data.email}`, // Change to your recipient
      from: 'throwhot69420@gmail.com', // Change to your verified sender
      subject: 'Welcome to Next-Ecomm',
      text: `Hi ${data.name},\n\nThank you for signing up! We're excited to have you on board.\n\nBest regards, \nThe Next-Ecomm team`,
    }

    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        console.error(error)
      })

    return res.json(filter(user, 'id', 'name', 'email'))

  }).catch(err => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const formattedError = {}
      formattedError[`${err.meta.target[0]}`] = 'already taken'

      return res.status(500).send({
        error: formattedError
      })
    }
    throw err
  })
})

export default router