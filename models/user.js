const config = require('config')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin : Boolean
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id , isAdmin: this.isAdmin} , config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User' , userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    })
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;