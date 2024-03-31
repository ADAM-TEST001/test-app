const mongoose = require('mongoose')


const TokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
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

const Token = mongoose.model('tokens', TokenSchema)


module.exports = Token;