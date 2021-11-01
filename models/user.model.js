const mongoose = require('mongoose');
// let validateEmail = function (email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email);
// };
const User = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            // validate: [validateEmail, 'Please fill a valid email address'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email address',
            ],
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^\d{10}$/, 'Please fill a valid phone number'],
        },
        password: {
            type: String,
            minlength: 8,
            trim: true,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        todoList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Todo',
            },
        ],
    },
    { timestamps: true }
);
User.plugin(require('mongoose-paginate-v2'));
module.exports = mongoose.model('User', User);
