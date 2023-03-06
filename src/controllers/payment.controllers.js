import express, { application } from 'express'
import Stripe from 'stripe' 
import prisma from '../utils/prisma.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const router = express.Router()

async function getImage(id){
 const image = await prisma.images.findUnique({
    where:{
      id
    }
  })
  return image
}

router.post('/:id', async (req,res) => {
  const image = await getImage(parseInt(req.params.id))
  console.log(image)

  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: image.price,
        product_data:{
          name: image.title
        },
      },
      quantity: 1,
    }],
    mode: 'payment',
    payment_method_types:['card'],
    success_url: 'https://www.google.com',
    cancel_url: 'https://youtube.com'
  })

  return res.json({url:session.url});
})

export default router