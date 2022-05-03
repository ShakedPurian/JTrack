import mongoose from "mongoose";

const JobSchema= new mongoose.Schema({
    company:{
        type: String,
        required: [true, 'Please provide company']
    },
    position:{
        type: String,
        required: [true, 'Please provide position']
    },
    status:{
        type: String,
        enum: ['pending', 'interview', 'declined'],
        default: 'pending'
    },
    jobType:{
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'internship'],
        default: 'full-time'
    },
    jobLocation:{
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref:'User'
    }
},
{timestamps:true})

export default mongoose.model('Job', JobSchema)