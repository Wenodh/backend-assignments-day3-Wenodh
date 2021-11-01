const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Todo = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            require: true,
        },
        title: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            enum: ['work', 'hobby', 'task'],
            required: true,
        },
    },
    {
        timestamps: { createdAt: 'addedAt', updatedAt: 'modifiedAt' },
    }
);
Todo.plugin(mongoosePaginate);
module.exports = mongoose.model('Todo', Todo);
