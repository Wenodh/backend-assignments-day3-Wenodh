const controller = require('../controllers/todo.controller');
const middleware = require('../middlewares/authJwt');
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });
    app.get(
        '/api/todos',
        [middleware.verifyToken, middleware.isAdmin],
        controller.getAllTodo
    );
    app.get(
        '/api/todo/:id',
        [middleware.verifyToken],
        controller.getTodoByUsername
    );
    app.post('/api/todos', [middleware.verifyToken], controller.createTodo);
    app.delete(
        '/api/todos/:id',
        [middleware.verifyToken],
        controller.deleteTodoById
    );
    app.put(
        '/api/todos/:id',
        [middleware.verifyToken],
        controller.updateTodoById
    );
};
