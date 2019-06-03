const {
    apiKey, 
    domain, 
    receiverAddress, 
    CORSWhitelist
} = require('./private.js')
const mailgun = require('mailgun-js')({ apiKey, domain })

const waitForSendCompletion = (mailOptions) => new Promise((resolve, reject) =>
{
    mailgun.messages().send(mailOptions, err => {
        if (err) return reject(err)
        console.log('Email sent')
        resolve()
    })
})

exports.handler = async (event, context, callback) => {
    if (!CORSWhitelist.includes(event.headers.origin)) {
        return callback(null, {statusCode: 401})
    }
    let requestJSON = JSON.parse(event.body)
    console.log(requestJSON)
    const { email, text, subject } = requestJSON
    if (!email || !test || !subject) {
        return callback(null, {statusCode: 400})
    }
    const mailOptions = {
        from: email,
        subject,
        text,
        to: receiverAddress
    }
    try {
        await waitForSendCompletion(mailOptions)    
    } catch (e) {
        console.error(e)
        return callback(e)
    }
    var response = {
        statusCode: 200,
        headers: {
           "Access-Control-Allow-Origin": event.headers.origin,
           "Access-Control-Allow-Methods": "POST"
        }
    }
    callback(null, response)
}
