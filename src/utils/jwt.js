import jwt from 'jsonwebtoken'
const accessTokenSecret = process.env.APP_SECRET

export function signAccessToken(payload){
  return new Promise((resolve,reject) => {
    jwt.sign({ payload }, accessTokenSecret,{
    }, (err,token) => {
      if (err) {
        reject("Something went wrong")
      }
      resolve(token)
    })
  })
}

export function verifyAccessToken(token) {
  return new Promise((resolve,reject) => {
    jwt.verify(token, accessTokenSecret, (err,payload) => {
      if (err) {
        //ternary operator, if condition err.name == 'JsonWebTokenError' is true, assign 'Unauthorized' to message; if false, assign err.message to message
        const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
        console.log(message)
        return reject(message)
      }
      resolve(payload)
    })
  })
}