const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true
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

//mongoose hook | password encryption
userSchema.pre('save', async function (next) {
    // const userPass = this;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    // console.log(this.password);
    next();
});

//Verifing password
//create a statsic variable that will hold a method
//static keyword will be used when a model calls a method
userSchema.statics.findUser = async function(email, password){
    const userSearch = await User.findOne({email});
    // console.log(userSearch.password);
    if(!userSearch){
        throw new Error('Invalid Details');
    }
    const isMatch = await bcrypt.compare(password,userSearch.password);
    // console.log(isMatch);
    if(!isMatch){
        throw new Error('Invalid Details');
    }
    return userSearch;
}

//generating token
//methods will be used when an instance will call a method
// userSchema.methods.genAuthToken = async function(){
//     const userTuple = this;
//     // console.log(user);
//     const token = await jwt.sign({
//         _id: userTuple._id
//     },'abc');
//     // console.log(token);
//     userTuple.tokens = userTuple.tokens.concat({token: token})
//     await userTuple.save();
//     return token;
// }


const User = mongoose.model('import', userSchema);
module.exports = User;