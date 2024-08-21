const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Paytm-Payment:surajkr84@cluster0.vbdrsde.mongodb.net/paytm")
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        unique: true,
        trim:true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password:{
        type : String,
        required : true,
        minLength: 6
    },
    firstName:{
        type : String,
        required : true,
        trim:true,
        minLength: 3,
        maxLength: 50
    },
    lastName:{
        type : String,
        required : true,
        trim:true,
        minLength: 3,
        maxLength: 50
    },
});  

// Bank related Schema

const accountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
})

//  create a model from the schema

const Account = mongoose.model('Account',accountSchema)
const User = mongoose.model('User', userSchema);


module.exports = {
    User,
    Account
} 