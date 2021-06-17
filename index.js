const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const userData = require('./route/userinfo');
const mongoose = require('mongoose');
const db = 'mongodb+srv://tanmoy:sarkar@123@cluster0.fr728.mongodb.net/directory?retryWrites=true&w=majority';

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, 
    function(err){
        if(err) {
        console.error('DB connection Failed')
        }else{
        console.log('DB connected Successfully')
    }
});
// console.log(__dirname);

// console.log(path.join(__dirname, 'views'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser()); //middleware(use)

app.use(express.json());
app.use(userData);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('Server running on '+PORT);
});