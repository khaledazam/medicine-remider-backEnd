const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        medicines: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Medicine',
            }
        ]
    },
    {
        timestamps: true
    }
);


const User = mongoose.model('User', userSchema);

module.exports = User;