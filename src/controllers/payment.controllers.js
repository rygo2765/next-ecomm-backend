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
          name: image.title,
          images: [image.url]
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

// import express from 'express';
// import Stripe from 'stripe'
// const stripe = new Stripe ('sk_test_51NLH7lDSZDxIvwntMu2KfIg6n8VKlCXJBGrh5OWusAuADBw6EZxz3jGP8Q4625BklCKm9s6iD8m1nGrV6DL1y7TF00ppTTwxyb')
// const router = express.Router()

// router.post('/', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'T-shirt',
//           },
//           unit_amount: 1900,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'http://localhost:5713/success',
//     cancel_url: 'http://localhost:5713/cancel',
//   });

//   // res.redirect(303, session.url);
//   return res.json({url:session.url});
// });

// export default router

// import Stripe from "stripe";
// import express from "express";
// import prisma from "../utils/prisma.js";
// const stripe = new Stripe(
//   "sk_test_51NLL4zLuItmOXGtPgtQstCbiAwq2JguYSHPmW4TaqZsN3a5BFZj1kPVMc7B30m9bWHLiyEQUJ3qNyDSkNs2mOtwr00fqwJKR6u"
// );

// const YOUR_DOMAIN = "http://localhost:5173";
// const router = express.Router();

// router.post("/", async (req, res) => {
//   const id = parseInt(req.body.id);
//   const image = await prisma.images.findUnique({
//     where:{
//       id: id
//     }
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: image.title,
//           },
//           unit_amount: image.price,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${YOUR_DOMAIN}/success.html`,
//     cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//   });

//   res.redirect(303, session.url);
// });

// export default router;
