const express = require('express');
const User = require('../model/user');
const router = express.Router();
const requireAuth = require('../middleware/user');
const notRequireAuth = require('../middleware/log');
const logAuth = require('../middleware/logauth');
const checkUser = require('../middleware/checkuser');


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
        const user = await User.findUser(email, password);
        // creating token
        const token = await user.genAuthToken();
        res.cookie('jwt', token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        res.send({ success: user._id });
        // res.redirect('/dashboard');
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
// router.get('/logout', requireAuth, async (req, res) => {
//     try {
//         // req.user.tokens = req.user.tokens.filter((token) => {
//         //     return token.token !== req.token
//         // })

//         req.user.tokens = []
//         await req.user.save()

//         res.cookie('jwt', '', { maxAge: 1 });
//         res.redirect('/login');
//         // res.send()
//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.get('/logout', logAuth, async (req, res) => {
    try {
        // req.test.tokens = req.test.tokens.filter((element) => {
        //     return element.token !== req.token
        // });
        req.test.tokens = []
        
        // res.clearCookie('jwt');
        await req.test.save();

        res.cookie('jwt', '', { maxAge: 1 });
        
        console.log("Logout Successfully");
        res.redirect('/login');

    } catch (err) {
        console.log(err);
    }
})

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