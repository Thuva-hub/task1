const mongoose = require('mongoose');
// const validator = require('validator');

const taskSchema = new mongoose.Schema({
    type:{
        type:String,
        required:[true,'please enter type'],
        unique:true
    },
    description: {
        type: String,
        required: [true, 'Please enter description']
    },
    due_date: {
        type: String,
        required: [true, 'Please enter date']
    },
    state: {
        
        type: String,
        required: [true, 'Please enter state'],
        unique:true
        // maxlength: [10, 'nic cannot exceed 10 characters'],

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('task', taskSchema)