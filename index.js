const {apiKey, domain, receiverAddress} = require('./private.js')
const mailgun = require('mailgun-js')({ apiKey, domain })

exports.handler = (event, context, callback) => {
    const { email, text, subject } = event
    const mailOptions = {
        from: email,
        subject,
        text,
        to: receiverAddress
    }

    mailgun.messages().send(mailOptions, err => {
        if (err) {
            console.error(err)
            callback(err)
        } else {
            console.log('Email sent')
            callback()
        }
    })
}
