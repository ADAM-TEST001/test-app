const mongoose = require('mongoose')


const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: '2m'
    },
})

const Otp = mongoose.model('otps', OTPSchema)


module.exports = Otp;