const Todo = require('../models/todo.model');
const User = require('../models/user.model');
const { verifyToken } = require('../middlewares/authJwt');
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

// add todo
exports.createTodo = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const input = req.body;
        input.username = user.username;
        const todo = new Todo(input);
        await todo.save();
        await user.updateOne({
            $push: { todoList: todo._id },
        });
        res.status(200).json({ success: true, data: todo });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

//show all
exports.getAllTodo = async (req, res) => {
    try {
        const { page, size, title, category, id, completed } = req.query;
        let condition = {};
        if (title) {
            condition.title = { $regex: new RegExp(title), $options: 'i' };
        }
        if (category) {
            condition.category = {
                $regex: new RegExp(category),
                $options: 'i',
            };
        }
        if (id) {
            condition._id = id;
        }
        if (completed) {
            condition.completed = completed;
        }
        let options = {
            sort: { addedAt: -1 },
        };
        const { limit, offset } = getPagination(page, size);
        const todo = await Todo.paginate(condition, { offset, limit, options });
        res.status(200).json({ success: true, data: todo });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
// get by id,
exports.getTodoByUsername = async (req, res) => {
    try {
        if (req.params.id === req.body.userId) {
            const { page, size } = req.query;
            let options = {
                sort: { addedAt: -1 },
            };
            const { limit, offset } = getPagination(page, size);
            const todo = await Todo.paginate(
                { userId: req.body.userId },
                {
                    offset,
                    limit,
                    options,
                }
            );
            // const { limit, offset } = getPagination(page, size);
            // const todo = await Todo.find({ userId: req.body.userId });
            res.status(200).json({ success: true, data: todo });
        }
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
//add, update by id and
exports.updateTodoById = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'updated' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
//delete by id
exports.deleteTodoById = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'deleted' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
