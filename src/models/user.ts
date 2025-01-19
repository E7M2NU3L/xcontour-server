import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    token : {
        type : String,
        default : ''
    },
    Role : {
        type : String,
        default : 'user',
        enum : ['viewer', 'admin', 'editor']
    },
    profilePic : {
        type : String,
        default : ''
    },
    phoneNumber : {
        type : String,
        default : ""
    },
    Bio : {
        type : String,
        default : ""
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
}, {
    timestamps : true,
});

export const UserModel = mongoose.model('User', UserSchema);