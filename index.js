const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Import Routes
const autRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();
//Connect DB
mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParse: true },
    () => console.log('connected to DB')
);

//Middleware 
app.use(express.json());


//Route Middlewares
app.use('/api/user', autRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server up and running'));