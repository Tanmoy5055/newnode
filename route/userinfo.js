const express = require('express');
const User = require('../model/user');
const router = express.Router();
const requireAuth = require('../middleware/user');
const notRequireAuth = require('../middleware/log');
const logAuth = require('../middleware/logauth');
const checkUser = require('../middleware/checkuser');
const bcrypt = require('bcrypt');


router.get('*', checkUser);

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/dashboard', requireAuth, async function (req, res) {
    res.render('dashboard');
});

router.get('/login', notRequireAuth, (req, res) => {
    res.render('login');
});

router.post('/login', async function (req, res) {

    let email = (req.body.email);
    let password = (req.body.password);

    try {
        const userSearch = await User.findOne({ email: email });
        // console.log(userSearch);
        if (!userSearch) {
            throw new Error('Invalid Details');
        }
        const isMatch = await bcrypt.compare(password, userSearch.password);
        // console.log(isMatch);
        if (!isMatch) {
            throw new Error('Invalid Details');
        }
        // creating token
        const token = await userSearch.genAuthToken();
        res.cookie('jwt', token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        // res.send({ success: userSearch._id });
        console.log("Login Successfull");
        res.send({success:"Login Successfull"});

    } catch (err) {
        console.log(err.message);
        if (err.message == 'Invalid Details') {
            return res.send({
                alert: 'Login failed'
            });
        }
    }
});

router.get('/signup', notRequireAuth, (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    let email = req.body.email;
    let checkUser = await User.findOne({ email });

    if (!checkUser) {
        const records = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password,
        });
        try {
            const recordInfo = await records.save();
            return res.send({ success: "Registration Successfull" });
        } catch {
            return res.send({ error: "Registration failed" });
        }
    } else {
        return res.send({ alert: "Email already exist" });
    }
});

//logout
router.get('/logout', logAuth, async (req, res) => {
    try {
        req.test.tokens = req.test.tokens.filter((element) => {
            return element.token !== req.token
        });
        // req.test.tokens = []

        // res.clearCookie('jwt');
        res.cookie('jwt', '', { maxAge: 1 });

        await req.test.save();


        console.log("Logout Successfully");
        res.send("Logout Successfully");
        res.redirect('/login');

    } catch (err) {
        console.log(err);
    }
});

router.get('/logoutall', logAuth, async (req, res) => {
    try{
        req.test.tokens = [];

        // res.clearCookie('jwt');
        res.cookie('jwt', '', { maxAge: 1 });

        await req.test.save();

        console.log("Logout Successfully");

        res.redirect('/login');

    } catch(err) {
        console.log(err);
    }
});

//register using API
router.post('/scripts', async (req, res) => {
    try {
        const records = new User(req.body);
        const recordInfo = await records.save();
        res.send(recordInfo);
    } catch (e) {
        res.send(e);
    }
});

//get data from DB using API
router.get('/scripts', async (req, res) => {
    try {
        const getinfos = await User.find();
        res.send(getinfos);
    } catch (e) {
        res.send(e);
    }
});

//get data by id from DB using API
router.get('/scripts/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const getData = await User.findById(_id);
        console.log(getData.fname);
        res.send();
    } catch (e) {
        res.send(e);
    }
});

// router.get('/dashboard/:id',async (req,res)=>{
//     try{
//       const _id = req.params.id
//       const getData = await User.findById(_id);
//       console.log(getData.fname);
//         res.send({
//             fname: getData.fname,
//             lname: getData.lname,
//             email: getData.email
//         });

//     }catch(e){
//         res.send(e);
//     }
// });

//update data by id using API
router.patch('/scripts/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const getData = await User.findByIdAndUpdate(_id, req.body, {
            new: true
        });
        res.send(getData);
    } catch (e) {
        res.send(e);
    }
});

//delete data by id from DB using API
router.delete('/scripts/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const getData = await User.findByIdAndDelete(_id);
        //   console.log(getinfo);
        res.send("Record Deleted");
    } catch (e) {
        res.send(e);
    }
});
module.exports = router;