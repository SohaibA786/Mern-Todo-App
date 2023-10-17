import express from 'express';
import cors from 'cors';
import connectToDB from './database/db.js';
import TodoModel from './models/todo.js';
import UserModel from './models/user.js';

const app = express();
// const port = 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get('/test', (req, res) => {
    res.status(200).send('maliksohaib.official@gmail.com');
});


// Users //
// Create User
app.post('/user', async (req, res) => {
    try {
        console.log("// Create User request ", req.body.email)
        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            return res.status(204).send("User already exists");
        }
        const newUser = new UserModel({ email: req.body.email });
        await newUser.save();
        res.status(200).send(`User ${req.body.email} created`);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Could not create user");
    }
});

// Todos //
// Get Todos by User
app.get('/todos', async (req, res) => {
    try {
        console.log('// Get Todos by User: ',req.query.email)
        const user = await UserModel.findOne({ email: req.query.email });
        if (!user) return res.status(400).send("User does not exist");

        const todos = await TodoModel.find({ user: user._id }).populate("user");
        return res.status(200).send(todos);
    } catch (error) {
        return res.status(500).send("Could not get todos");
    }
});

// Create Todo by User
app.post('/todos', async (req, res) => {
    try {
        console.log("// Create Todo by User: ", req.body.email, req.body.todo)
        // Find user object
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User does not exist");
        // Create new todo
        const newTodo = new TodoModel({
            todo: req.body.todo,
            user: user._id,
        });
        await newTodo.save();
        res.status(200).send(newTodo);
    } catch (error) {
        res.status(500).send("Could not create todo");
    }

});

// Delete Todo by User
app.delete('/todos/:id', async (req, res) => {
    try {
        console.log("// Delete Todo by User ", req.params.id, req.query.email)
        const user = await UserModel.findOne({ email: req.query.email });
        if (!user) return res.status(400).send("User not authorized");
        const todo = await TodoModel.findOneAndDelete({ _id: req.params.id, user: user._id });
        if (!todo) return res.status(400).send(`This Todo does not exist for user ${req.query.email}`);
        res.status(200).send(`Todo ${req.params.id} deleted`);
    } catch (error) {
        res.status(500).send("Could not delete todo");
    }
});

// Toggle todo completion
app.patch('/todos/:id', async (req, res) => {
    try {
        console.log("// Toggle todo request: ",req.params.id, req.body.email);
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User not authorized");
        const todo = await TodoModel.findOne({ _id: req.params.id, user: user._id });
        if (!todo) return res.status(400).send(`This Todo does not exist for user ${req.body.email}`);
        todo.isCompleted = !todo.isCompleted;
        await todo.save();
        res.status(200).send(`Todo ${req.params.id} toggled`);
    } catch (error) {
        res.status(500).send("Could not toggle todo");
    }
})

// Update todo text
app.put('/todos/:id', async (req, res) => {
    try {
        console.log("// Update todo text ", req.params.id, req.body.email, req.body.todo)
        if (!req.body.todo) return res.status(400).send("Todo text is required");
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User not authorized");
        const todo = await TodoModel.findOne({ _id: req.params.id, user: user._id });
        if (!todo) return res.status(400).send(`This Todo does not exist for user ${req.body.email}`);
        todo.todo = req.body.todo;
        await todo.save();
        res.status(200).send(`Todo ${req.params.id} Updated`);
    } catch (error) {
        res.status(500).send("Could not update todo");
    }
})


const startServer = async () => {
    await connectToDB();
    if(process.env.PORT)
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    });
}

startServer();

export default app;