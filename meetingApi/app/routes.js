var Todo = require('./models/todo');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------

    // handle CORS - allow access or all
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });


    // The following 3 methods are used to test and demonstrate Kubernetes liveness probe.
    // global variable to drive the test, when service starts everything works fine
    let working = true;

    // Calling this endpoint the heath check service stops working
    app.get('/api/breakIt', function (req, res) {
        working = false;
        res.status(200).json({
            message: 'Just broke it!'
        });
    });

    // Calling this endpoint the heath check service starts working
    app.get('/api/fixIt', function (req, res) {
        working = true;
        res.status(200).json({
            message: 'Just fixed it!'
        });
    });

    // The response of this service depends on 'working' variable
    app.get('/api/healthCheck', function (req, res) {
        if (working == true) {
            res.status(200).json({
                message: 'ok'
            });
        } else {
            res.status(500).json({
                message: 'ko'
            });
        }  
    });
};
