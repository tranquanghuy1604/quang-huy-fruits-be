const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes/index');
const initUser = require('./configs/initUser');
const connectDB = require('./configs/db');

connectDB();
initUser();
// autoCheckOrder();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);
app.use('/uploads', express.static('uploads'));

app.listen(port, console.log(`server is running on ${port}`));
