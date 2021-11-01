const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose.Promise = global.Promise;
const URL = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@sandbox.wrvbj.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
mongoose
    .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to mongoDB');
    })
    .catch((err) => {
        console.log(err);
    });
require('./routes/todo.route')(app);
require('./routes/auth.routes')(app);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
