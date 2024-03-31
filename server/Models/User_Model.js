const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
})

const User = mongoose.model('Users', UserSchema)


module.exports = User;