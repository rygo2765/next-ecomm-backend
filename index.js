import sgMail from '@sendgrid/mail'

const SENDGRID_API_KEY = "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"

sgMail.setApiKey(SENDGRID_API_KEY)

const msg = {
  to: 'ryangohce@gmail.com', // Change to your recipient
  from: 'throwhot69420@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
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