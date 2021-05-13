const express = require('express');
// const User = require('../model/user');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('dashboard');
});

module.exports = router;