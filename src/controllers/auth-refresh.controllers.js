import auth from "../middlewares/auth.js";
import { filter } from "../utils/common.js";
import { signAccessToken } from "../utils/jwt.js";
import prisma from "../utils/prisma.js";
import express from 'express';

const router = express.Router()

router.post('/', auth, async(req, res) => {
    
    //use payload info to verify user exist 
    const userInfo = await prisma.user.findUnique({
        where:{
            email: req.user.payload.email
        }
    })

    if (!userInfo) return res.status(401).send({
        error:{
            'authentication': 'Token provided not valid'
        }
    })

    const userFiltered = filter(userInfo, 'id', 'name', 'email')
    console.log(userFiltered)
    const accessToken = await signAccessToken(userFiltered)
    return res.json({accessToken})
})

export default router