const mongoose = require('mongoose');
// const validator = require('validator');

const securitySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter FirstName']
    },
    lastName: {
        type: String,
        required: [true, 'Please enter LastName']
    },
    nic: {
        type: String,
        required: [true, 'Please enter nic'],
        unique:true
        // maxlength: [10, 'nic cannot exceed 10 characters'],

    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique:true

        // validate: [validator.isEmail, 'Please enter valid email address']
    },
    jobtype:{
        type:String,
        required: [true, 'Please select  jobtype'],

    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        // max:[6,"password should be 6 character"],
        // maxlength: [10, 'Password cannot exceed 10 characters'],
        // select: false
    },

    mobilenumber: {
        type: String,
        required:[true,'please enter mobilenumber'],
        // validate:[validator.isMobilePhone,'Please enter valid phone number']
    },
    Staffid: {
        type: String,
        required:[true,'please enter staffid'],
    },
    Address: {
        type: String,
        required: [true, 'Please enter Address']
    },
    // resetPasswordToken: String,
    // resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('security', securitySchema)