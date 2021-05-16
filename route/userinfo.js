const express = require('express');
const User = require('../model/user');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('dashboard');
});

router.get('/dashboard', function (req, res) {
    res.render('dashboard');
});

router.get('/login', (req,res)=>{
    res.render('login');
});

router.post('/login', async function (req, res) {

    let email = (req.body.email);
    let password = (req.body.password);

    try{
        const user = await User.findUser(email,password);
        // console.log(user);
        //creating token
        // const token = await user.genAuthToken();
        // res.cookie('jwt', token,{
        //     maxAge: 1000*60*60*24,
        //     httpOnly: true
        // });
        res.send({ success: user._id});
    }catch(err){
        console.log(err.message);
        if(err.message == 'Invalid Details'){
            return res.send({
                alert: 'Login failed'
            });
        }
    }
    });
router.get('/signup', (req,res)=> {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    let checkUser = {
        email: req.body.email
    }
    User.findOne(checkUser)
        .then((checkUser) => {
            if (checkUser == null) {
                User.create({
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    password: req.body.password
                })
                    .then(() => {
                        return res.send({ success: "Registration Successfull" })
                    })
                    .catch(() => {
                        return res.send({ error: "Registration Failed" })
                    })
            } else {
                return res.send({ error: "Email already exists" })
            }
        })
})

module.exports = router;