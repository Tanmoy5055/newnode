const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    fname: {
        type: String,
        lowercase: true
    },
    lname: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
});

userSchema.plugin(uniqueValidator);

//mongoose hook | password encryption
userSchema.pre('save', async function (next) {
    // const userPass = this;
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

//Verifing password
//create a statsic variable that will hold a method
//static keyword will be used when a model calls a method
// userSchema.statics.findUser = async function (email, password) {
//     const userSearch = await User.findOne({ email });
//     if (!userSearch) {
//         throw new Error('Invalid Email');
//     }
//     const isMatch = await bcrypt.compare(password, userSearch.password);
//     if (!isMatch) {
//         throw new Error('Invalid Password');
//     }
//     return userSearch;
// }

//generating token
//methods will be used when an instance will call a method
userSchema.methods.genAuthToken = async function () {
    const userTuple = this;
    // console.log(user);
    const token = await jwt.sign({
        _id: userTuple._id
    }, 'abc');
    // console.log(token);
    userTuple.tokens = userTuple.tokens.concat({ token: token })
    await userTuple.save();
    return token;
}


const User = mongoose.model('import', userSchema);
module.exports = User;