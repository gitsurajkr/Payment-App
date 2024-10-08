require('dotenv').config(); 

const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
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