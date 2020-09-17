const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: 1
    },
    displayName: {
        type: String,
        required: 1
    },
    firstName: {
        type: String,
        required: 1
    },
    lastName: {
        type: String,
        required: 1
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)